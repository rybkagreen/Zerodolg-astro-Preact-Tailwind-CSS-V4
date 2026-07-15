import type { APIRoute } from 'astro';
import { SERVICE_VALUES } from '@shared/lib/analytics-manager';
import { logger } from '@shared/lib/logger';
import { isTestingEnv } from '@shared/config/testing-mode';
import { checkRecaptchaConfigConsistency, verifyRecaptcha } from '@features/forms/lib/recaptcha';

export const prerender = false;

// Runs once, at module load (Node caches the module after first import).
// NOTE: under Astro's Node adapter, route modules like this one are loaded
// lazily on the first matching request, not eagerly at process boot — so
// this actually fires on the first POST/GET/HEAD to /api/form, not at
// server startup. (Confirmed empirically: with a mismatched build, the
// "RECAPTCHA CONFIG MISMATCH" log is absent right after `node
// dist/server/entry.mjs` starts and stays absent through a `/` or `/health`
// request, appearing only once /api/form is hit for the first time.) A
// deploy smoke-test that hits /api/form will still catch it — see
// infra/README.md. See checkRecaptchaConfigConsistency's doc comment
// (src/features/forms/lib/recaptcha.ts) for what it catches.
checkRecaptchaConfigConsistency();

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const webhookUrl = process.env['BITRIX24_WEBHOOK_URL'];
  const testingEnv = isTestingEnv();

  if (!webhookUrl && !testingEnv) {
    logger.error('BITRIX24_WEBHOOK_URL is not configured');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Сервис временно недоступен. Пожалуйста, позвоните нам.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Получаем данные формы (поддержка JSON и FormData)
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown>;

    if (contentType.includes('application/json')) {
      // Если данные приходят как JSON
      data = await request.json();
    } else {
      // Если данные приходят как FormData
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Извлекаем поля
    const name = (data['name'] as string) || '';
    const phone = (data['phone'] as string) || '';
    const email = (data['email'] as string) || '';
    const message = (data['message'] as string) || '';
    const formType = (data['formType'] as string) || 'callback';
    const recaptchaToken = (data['recaptchaToken'] as string) || '';

    // Health-probe: all fields empty means monitoring, not a real submission
    if (!name && !phone && !email && !message) {
      return new Response(
        JSON.stringify({ success: true, message: 'Form endpoint is available', test: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Валидация
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Имя и телефон обязательны',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const recaptchaConfigured = Boolean(
      process.env['PUBLIC_RECAPTCHA_SITE_KEY'] && process.env['RECAPTCHA_SECRET']
    );

    if (!testingEnv && recaptchaConfigured) {
      const passed = await verifyRecaptcha(recaptchaToken, clientAddress);
      if (!passed) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              'Обнаружена подозрительная активность. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.',
          }),
          { status: 422, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Определяем заголовок в зависимости от типа формы
    const titles: Record<string, string> = {
      callback: 'Заявка на обратный звонок',
      consultation: 'Запрос консультации',
      calculator: 'Расчет калькулятора',
      bankruptcy: 'Заявка на банкротство',
    };

    const title = titles[formType] || 'Заявка с сайта';

    // Bitrix returns a numeric lead ID; the mock path below uses a string.
    // Typed narrowly (not `unknown`) so the existing `.toString()` call in
    // the success-response block further down the file keeps compiling.
    let bitrixResult: { result?: string | number };

    if (testingEnv) {
      bitrixResult = { result: `mock_lead_${Date.now()}` };
      logger.warn('TESTING MODE: skipping Bitrix24 webhook call', { formType });
    } else {
      // Формируем данные для Bitrix24
      const bitrixData = {
        fields: {
          TITLE: `${title} - ${name}`,
          NAME: name,
          PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
          EMAIL: email ? [{ VALUE: email, VALUE_TYPE: 'WORK' }] : undefined,
          COMMENTS: message || `Форма: ${formType}`,
          SOURCE_ID: 'WEB',
          OPENED: 'Y',
          ASSIGNED_BY_ID: 1,
          UF_CRM_1234567890: formType, // Кастомное поле для типа формы
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);
      let bitrixResponse: Response;

      try {
        bitrixResponse = await fetch(`${webhookUrl}crm.lead.add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bitrixData),
          signal: controller.signal,
        });
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Bitrix24 request timeout');
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }

      if (!bitrixResponse.ok) {
        throw new Error(`Bitrix24 error: ${bitrixResponse.status}`);
      }

      bitrixResult = await bitrixResponse.json();
    }

    // WARN, not INFO, solely because prod's logger floor is WARN — this is a
    // routine success event, not an anomaly. Riding on the floor is a known
    // workaround, not a root-cause fix; revisit with a dedicated always-emit
    // level (e.g. logger.audit()) if this ever needs to coexist with real
    // WARN/ERROR-based alerting.
    logger.warn('Lead created', { leadId: bitrixResult.result, formType });

    // Определяем ценность конверсии
    const leadValue = SERVICE_VALUES[formType] || SERVICE_VALUES['general'];

    // Возвращаем успешный ответ с данными для аналитики
    return new Response(
      JSON.stringify({
        success: true,
        leadId: bitrixResult.result,
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.',
        // Данные для отслеживания конверсии на клиенте
        analytics: {
          event: 'purchase',
          transaction_id: bitrixResult.result?.toString() || `lead_${Date.now()}`,
          value: leadValue,
          currency: 'RUB',
          form_type: formType,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error(
      'Form submission error',
      undefined,
      error instanceof Error ? error : new Error(String(error))
    );

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Произошла ошибка при отправке формы. Попробуйте позже.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Обработка GET запросов (для проверки)
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Form API is working',
      endpoints: {
        POST: '/api/form - Submit form data to Bitrix24',
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const HEAD: APIRoute = () => new Response(null, { status: 200 });
