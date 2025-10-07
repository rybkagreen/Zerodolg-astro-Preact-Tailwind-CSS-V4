import type { APIRoute } from 'astro';
import { SERVICE_VALUES } from '@shared/lib/analytics-manager';

// Конфигурация Bitrix24 из переменных окружения
const BITRIX24_WEBHOOK_URL = import.meta.env['BITRIX24_WEBHOOK_URL'];
const IS_TESTING_ENV =
  import.meta.env['NODE_ENV'] === 'test' ||
  import.meta.env['TESTING'] === 'true' ||
  import.meta.env['STAGING'] === 'true';

if (!BITRIX24_WEBHOOK_URL && !IS_TESTING_ENV) {
  console.error('BITRIX24_WEBHOOK_URL is not configured!');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Проверяем наличие webhook URL
    if (!BITRIX24_WEBHOOK_URL) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Сервис временно недоступен. Пожалуйста, позвоните нам.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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

    // Проверка на тестовый запрос (для целей проверки доступности API)
    const isTestRequest = !name && !phone && !email && !message;
    if (isTestRequest) {
      // Возвращаем успешный ответ для тестирования, не выполняя реальной отправки
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Form endpoint is available',
          test: true,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
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

    // В тестовом режиме используем mock-ответ, иначе отправляем в Bitrix24
    let bitrixResult = null;

    if (IS_TESTING_ENV) {
      // В тестовом режиме просто возвращаем успешный ответ без вызова Bitrix24
      console.log('TESTING MODE: Skipping Bitrix24 webhook call, returning mock success response');
      // В тестовом режиме создаем mock-ответ
      bitrixResult = { result: `mock_lead_${Date.now()}` };
      console.log('TESTING MODE: Generated mock lead result:', bitrixResult);
    } else {
      // Отправляем в Bitrix24 с таймаутом
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const bitrixResponse = await fetch(`${BITRIX24_WEBHOOK_URL}crm.lead.add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bitrixData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!bitrixResponse.ok) {
          throw new Error(`Bitrix24 error: ${bitrixResponse.status}`);
        }

        bitrixResult = await bitrixResponse.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Bitrix24 request timeout');
        }
        throw error;
      }

      // Логируем для отладки (только в режиме разработки)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Lead created:', bitrixResult);
      }
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
        ...(import.meta.env.DEV && { originalError: (error as Error).message }),
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

// Обработка HEAD запросов (для проверки доступности)
export const HEAD: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
