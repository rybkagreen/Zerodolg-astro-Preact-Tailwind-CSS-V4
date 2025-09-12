import type { APIRoute } from 'astro';

// Конфигурация Bitrix24 из переменных окружения
const BITRIX24_WEBHOOK_URL = import.meta.env.BITRIX24_WEBHOOK_URL || 'https://zerodolg.bitrix24.ru/rest/1/sn1lo90na6t13v1d/';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Получаем данные формы
    const data = await request.formData();
    
    // Извлекаем поля
    const name = data.get('name')?.toString() || '';
    const phone = data.get('phone')?.toString() || '';
    const email = data.get('email')?.toString() || '';
    const message = data.get('message')?.toString() || '';
    const formType = data.get('formType')?.toString() || 'callback';
    
    // Валидация
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Имя и телефон обязательны' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Определяем заголовок в зависимости от типа формы
    const titles: Record<string, string> = {
      callback: 'Заявка на обратный звонок',
      consultation: 'Запрос консультации',
      calculator: 'Расчет калькулятора',
      bankruptcy: 'Заявка на банкротство'
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
      }
    };
    
    // Отправляем в Bitrix24
    const bitrixResponse = await fetch(`${BITRIX24_WEBHOOK_URL}crm.lead.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bitrixData)
    });
    
    if (!bitrixResponse.ok) {
      throw new Error(`Bitrix24 error: ${bitrixResponse.status}`);
    }
    
    const bitrixResult = await bitrixResponse.json();
    
    // Логируем для отладки
    console.log('Lead created:', bitrixResult);
    
    // Возвращаем успешный ответ
    return new Response(
      JSON.stringify({ 
        success: true,
        leadId: bitrixResult.result,
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Произошла ошибка при отправке формы. Попробуйте позже.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
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
        POST: '/api/form - Submit form data to Bitrix24'
      }
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
