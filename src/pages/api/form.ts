import type { APIRoute } from 'astro';
import { SERVICE_VALUES } from '@shared/lib/analytics-manager';
import { logger } from '@shared/lib/logger';
import { isTestingEnv } from '@shared/config/testing-mode';
import { checkRecaptchaConfigConsistency } from '@features/forms/lib/recaptcha';

export const prerender = false;

// Runs once, at module load (Node caches the module after first import) —
// this is a startup-time deploy-config check, not a per-request one. See
// checkRecaptchaConfigConsistency's doc comment (src/features/forms/lib/recaptcha.ts)
// for what it catches.
checkRecaptchaConfigConsistency();

export const POST: APIRoute = async ({ request }) => {
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

    // Определяем заголовок в зависимости от типа формы
    const titles: Record<string, string> = {
      callback: 'Заявка на обратный звонок',
      consultation: 'Запрос консультации',
      calculator: 'Расчет калькулятора',
      bankruptcy: 'Заявка на банкротство',
    };

    const title = titles[formType] || 'Заявка с сайта';

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

    // Отправляем в Bitrix24
    const bitrixResponse = await fetch(`${webhookUrl}crm.lead.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bitrixData),
    });

    if (!bitrixResponse.ok) {
      throw new Error(`Bitrix24 error: ${bitrixResponse.status}`);
    }

    const bitrixResult = await bitrixResponse.json();

    // Логируем для отладки (только в режиме разработки)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('Lead created:', bitrixResult);
    }

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
    // Логируем ошибку (только в режиме разработки)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Form submission error:', error);
    }

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
