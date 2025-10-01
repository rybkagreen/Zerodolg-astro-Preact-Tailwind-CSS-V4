// tracking-config.ts - Конфигурация отслеживания для новых страниц
// Актуализированная версия на октябрь 2024

export interface TrackingEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Конфигурация Google Analytics 4
export const GA4_CONFIG = {
  measurementId: 'G-XXXXXXXXXX', // Замените на реальный ID
  events: {
    // События для страницы реструктуризации
    restructuring: {
      page_view: {
        action: 'page_view',
        category: 'Restructuring',
        label: 'Restructuring Page View',
      },
      consultation_request: {
        action: 'consultation_request',
        category: 'Restructuring',
        label: 'Consultation Form Submit',
      },
      phone_call: {
        action: 'phone_call',
        category: 'Restructuring',
        label: 'Phone Call Click',
      },
      price_view: {
        action: 'price_view',
        category: 'Restructuring',
        label: 'Price Section View',
      },
    },
    // События для секции сравнения
    solution_choice: {
      section_view: {
        action: 'section_view',
        category: 'Solution Choice',
        label: 'Solution Choice Section View',
      },
      bankruptcy_click: {
        action: 'service_click',
        category: 'Solution Choice',
        label: 'Bankruptcy Option Click',
      },
      restructuring_click: {
        action: 'service_click',
        category: 'Solution Choice',
        label: 'Restructuring Option Click',
      },
      comparison_interaction: {
        action: 'comparison_interaction',
        category: 'Solution Choice',
        label: 'Service Comparison Interaction',
      },
    },
    // События для blog-статьи
    blog: {
      article_read: {
        action: 'article_read',
        category: 'Blog',
        label: 'Restructuring vs Bankruptcy Article',
      },
      article_share: {
        action: 'article_share',
        category: 'Blog',
        label: 'Article Share',
      },
      internal_link_click: {
        action: 'internal_link_click',
        category: 'Blog',
        label: 'Internal Link Click',
      },
    },
  },
};

// Конфигурация Яндекс.Метрики
export const YANDEX_METRIKA_CONFIG = {
  counterId: 'XXXXXXXXX', // Замените на реальный ID
  goals: {
    // Цели для реструктуризации
    restructuring_consultation: 'RESTRUCTURING_CONSULTATION',
    restructuring_phone_call: 'RESTRUCTURING_PHONE_CALL',
    restructuring_form_submit: 'RESTRUCTURING_FORM',

    // Цели для сравнения услуг
    solution_choice_interaction: 'SOLUTION_CHOICE_INTERACTION',
    service_comparison: 'SERVICE_COMPARISON',

    // Цели для перекрестных продаж
    cross_sell_bankruptcy_to_restructuring: 'CROSS_SELL_B_TO_R',
    cross_sell_restructuring_to_bankruptcy: 'CROSS_SELL_R_TO_B',
  },
};

// Декларации глобальных переменных для аналитики
declare global {
  function gtag(...args: any[]): void;
  function ym(...args: any[]): void;
}

// Функции отслеживания
export const trackEvent = (event: TrackingEvent): void => {
  // Google Analytics 4
  if (typeof globalThis.gtag !== 'undefined') {
    globalThis.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    });
  }

  // Яндекс.Метрика
  if (typeof globalThis.ym !== 'undefined' && YANDEX_METRIKA_CONFIG.counterId) {
    globalThis.ym(
      YANDEX_METRIKA_CONFIG.counterId,
      'reachGoal',
      event.action,
      event.custom_parameters
    );
  }

  // Console log для разработки
  if (process.env['NODE_ENV'] === 'development') {
    console.log('Analytics Event:', event);
  }
};

// Специфичные функции отслеживания для новых страниц
export const trackRestructuringPageView = (): void => {
  trackEvent(GA4_CONFIG.events.restructuring.page_view);
};

export const trackSolutionChoiceView = (): void => {
  trackEvent(GA4_CONFIG.events.solution_choice.section_view);
};

export const trackServiceComparison = (selectedService: 'bankruptcy' | 'restructuring'): void => {
  const event =
    selectedService === 'bankruptcy'
      ? GA4_CONFIG.events.solution_choice.bankruptcy_click
      : GA4_CONFIG.events.solution_choice.restructuring_click;

  trackEvent({
    ...event,
    custom_parameters: {
      selected_service: selectedService,
      comparison_timestamp: Date.now(),
    },
  });
};

export const trackCrossSell = (from: string, to: string): void => {
  trackEvent({
    action: 'cross_sell',
    category: 'Navigation',
    label: `${from} to ${to}`,
    custom_parameters: {
      source_page: from,
      target_page: to,
      cross_sell_type: `${from}_to_${to}`,
    },
  });
};

export const trackFormSubmission = (
  formType: 'bankruptcy' | 'restructuring' | 'general',
  source: string
): void => {
  trackEvent({
    action: 'form_submission',
    category: 'Lead Generation',
    label: `${formType} form from ${source}`,
    custom_parameters: {
      form_type: formType,
      source_page: source,
      submission_timestamp: Date.now(),
    },
  });
};

// Отслеживание прокрутки страницы для длинных лендингов
export const trackScrollDepth = (depth: number): void => {
  trackEvent({
    action: 'scroll_depth',
    category: 'User Engagement',
    label: `${depth}% scroll`,
    value: depth,
    custom_parameters: {
      scroll_depth: depth,
      page_url: window.location.pathname,
    },
  });
};

// Отслеживание времени на странице
export const trackTimeOnPage = (timeInSeconds: number, pageType: string): void => {
  trackEvent({
    action: 'time_on_page',
    category: 'User Engagement',
    label: `${pageType} - ${timeInSeconds}s`,
    value: timeInSeconds,
    custom_parameters: {
      time_on_page: timeInSeconds,
      page_type: pageType,
      engagement_level: timeInSeconds > 120 ? 'high' : timeInSeconds > 60 ? 'medium' : 'low',
    },
  });
};

export default {
  GA4_CONFIG,
  YANDEX_METRIKA_CONFIG,
  trackEvent,
  trackRestructuringPageView,
  trackSolutionChoiceView,
  trackServiceComparison,
  trackCrossSell,
  trackFormSubmission,
  trackScrollDepth,
  trackTimeOnPage,
};
