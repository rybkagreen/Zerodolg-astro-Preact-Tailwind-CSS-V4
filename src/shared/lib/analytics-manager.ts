// Analytics Manager - Единая точка отслеживания всех событий аналитики
// Поддерживает Google Analytics 4, Яндекс.Метрику, GTM Data Layer

import type { UserData, HashedUserData } from './hash-utils';
import { hashUserData, isWebCryptoSupported, isSecureContext } from './hash-utils';
import { consentManager } from './consent-manager';

export interface ConversionData {
  transaction_id: string;
  value: number;
  currency?: string;
  form_type: string;
  lead_id?: string;
  user_data?: UserData; // Данные пользователя для Enhanced Conversions
}

export interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

// Константы стоимости услуг (средние чеки)
export const SERVICE_VALUES: Record<string, number> = {
  bankruptcy: 150000, // Полное банкротство
  restructuring: 80000, // Реструктуризация долгов
  consultation: 5000, // Юридическая консультация
  callback: 2000, // Обратный звонок
  calculator: 3000, // Использование калькулятора (квалифицированный интерес)
  general: 10000, // Общая заявка
};

/**
 * Analytics Manager - Singleton класс для управления аналитикой
 */
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private conversionsSent: Set<string> = new Set();
  private initialized = false;
  private enhancedConversionsEnabled = false;

  // ID счетчиков из environment
  private readonly GA_ID = import.meta.env['PUBLIC_GA_ID'];
  private readonly YM_ID = import.meta.env['PUBLIC_YM_ID'];

  private constructor() {
    this.init();
  }

  /**
   * Получить singleton instance
   */
  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  /**
   * Инициализация
   */
  private init(): void {
    if (typeof window === 'undefined') return;

    // Проверяем поддержку Enhanced Conversions
    this.enhancedConversionsEnabled = isWebCryptoSupported() && isSecureContext();

    if (!this.enhancedConversionsEnabled && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        'Enhanced Conversions disabled: Web Crypto API not supported or not in secure context'
      );
    }

    // Проверяем доступность аналитики
    const checkAnalytics = () => {
      const gaAvailable = typeof window.gtag !== 'undefined';
      const ymAvailable = typeof window.ym !== 'undefined';

      if (gaAvailable && ymAvailable) {
        this.initialized = true;
        this.log('Analytics Manager initialized', {
          ga4: this.GA_ID,
          yandex: this.YM_ID,
          enhancedConversions: this.enhancedConversionsEnabled,
        });
      } else {
        // Повторяем проверку через 500мс
        setTimeout(checkAnalytics, 500);
      }
    };

    checkAnalytics();
  }

  /**
   * Логирование в режиме разработки
   */
  private log(message: string, data?: unknown): void {
    if (import.meta.env.DEV && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log(`[Analytics] ${message}`, data || '');
    }
  }

  /**
   * Проверка на дубликат события
   */
  private isDuplicate(eventId: string): boolean {
    return this.conversionsSent.has(eventId);
  }

  /**
   * Добавить событие в список отправленных
   */
  private markAsSent(eventId: string): void {
    this.conversionsSent.add(eventId);
    // Очищаем старые события через 5 минут
    setTimeout(
      () => {
        this.conversionsSent.delete(eventId);
      },
      5 * 60 * 1000
    );
  }

  /**
   * Отправка события в Google Analytics 4
   */
  private sendToGA4(eventName: string, params: EventParams, userData?: HashedUserData): void {
    if (typeof window.gtag === 'undefined') {
      this.log('GA4 not available');
      return;
    }

    try {
      const eventParams: Record<string, unknown> = {
        ...params,
        send_to: this.GA_ID,
        timestamp: Date.now(),
        page_location: window.location.href,
        page_path: window.location.pathname,
      };

      // Добавляем user_data для Enhanced Conversions
      if (userData && this.enhancedConversionsEnabled) {
        eventParams['user_data'] = userData;
        this.log('Enhanced Conversion data included', userData);
      }

      window.gtag('event', eventName, eventParams);
      this.log(`GA4 Event: ${eventName}`, params);
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('GA4 tracking error:', error);
      }
    }
  }

  /**
   * Отправка события в Яндекс.Метрику
   */
  private sendToYM(goalName: string, params?: EventParams): void {
    if (typeof window.ym === 'undefined' || !this.YM_ID) {
      this.log('Yandex Metrika not available');
      return;
    }

    // ✅ ПРОВЕРЯЕМ СОГЛАСИЕ НА АНАЛИТИКУ ПЕРЕД ОТПРАВКОЙ ДАННЫХ
    if (!consentManager.hasAnalyticsConsent()) {
      this.log('Yandex Metrika: No consent for analytics, skipping event:', goalName);
      return;
    }

    try {
      const ymId = parseInt(this.YM_ID, 10);
      if (!isNaN(ymId)) {
        window.ym(ymId, 'reachGoal', goalName, params);
        this.log(`YM Goal: ${goalName}`, params);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Yandex Metrika tracking error:', error);
      }
    }
  }

  /**
   * Инициализация Webvisor (только с согласием пользователя)
   */
  enableWebvisor(): void {
    if (!consentManager.hasAnalyticsConsent()) {
      this.log('Webvisor not enabled - no user consent');
      return;
    }

    if (typeof window.ym === 'undefined' || !this.YM_ID) {
      this.log('Yandex Metrika not available for Webvisor');
      return;
    }

    try {
      const ymId = parseInt(this.YM_ID, 10);
      if (!isNaN(ymId)) {
        // Включаем Webvisor только если пользователь дал согласие
        window.ym(ymId, 'params', { webvisor: true });
        this.log('Webvisor enabled');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Webvisor initialization error:', error);
      }
    }
  }

  /**
   * Отключение Webvisor
   */
  disableWebvisor(): void {
    if (typeof window.ym === 'undefined' || !this.YM_ID) {
      return;
    }

    try {
      const ymId = parseInt(this.YM_ID, 10);
      if (!isNaN(ymId)) {
        window.ym(ymId, 'params', { webvisor: false });
        this.log('Webvisor disabled');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Webvisor disabling error:', error);
      }
    }
  }

  /**
   * Отправка в GTM Data Layer
   */
  private sendToDataLayer(eventName: string, params: EventParams): void {
    if (typeof window.dataLayer === 'undefined') {
      return;
    }

    try {
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: Date.now(),
      });
      this.log(`DataLayer: ${eventName}`, params);
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('DataLayer push error:', error);
      }
    }
  }

  /**
   * Универсальная отправка события
   */
  trackEvent(eventName: string, params: EventParams = {}): void {
    if (!this.initialized) {
      this.log('Analytics not initialized yet, queuing event:', eventName);
      // Повторяем отправку через 1 секунду
      setTimeout(() => this.trackEvent(eventName, params), 1000);
      return;
    }

    // Проверка на дубликат (только для важных событий)
    if (params['prevent_duplicate']) {
      const eventId = `${eventName}_${JSON.stringify(params)}`;
      if (this.isDuplicate(eventId)) {
        this.log(`Duplicate event prevented: ${eventName}`);
        return;
      }
      this.markAsSent(eventId);
    }

    // Отправляем во все системы
    this.sendToGA4(eventName, params);
    this.sendToYM(eventName, params);
    this.sendToDataLayer(eventName, params);
  }

  /**
   * Отслеживание конверсии (лид создан в CRM)
   */
  async trackConversion(data: ConversionData): Promise<void> {
    const { transaction_id, value, currency = 'RUB', form_type, lead_id, user_data } = data;

    // ✅ ПРОВЕРЯЕМ СОГЛАСИЕ ПЕРЕД ОТПРАВКОЙ ПЕРСОНАЛЬНЫХ ДАННЫХ
    if (!consentManager.hasAnalyticsConsent()) {
      this.log('Conversion tracking: no user consent for Enhanced Conversions');
      // Отправляем базовое событие без персональных данных
      this.sendToGA4(
        'purchase',
        {
          transaction_id,
          value,
          currency,
          items: JSON.stringify([
            {
              item_id: form_type,
              item_name: this.getServiceName(form_type),
              item_category: 'legal_services',
              price: value,
              quantity: 1,
            },
          ]),
        },
        undefined // Не передаем user_data без согласия
      );
      return;
    }

    // Проверка на дубликат по transaction_id
    const conversionId = `conversion_${transaction_id}`;
    if (this.isDuplicate(conversionId)) {
      this.log('Duplicate conversion prevented:', transaction_id);
      return;
    }
    this.markAsSent(conversionId);

    // Хешируем данные пользователя для Enhanced Conversions
    let hashedUserData: HashedUserData | undefined;
    if (user_data && this.enhancedConversionsEnabled) {
      try {
        hashedUserData = await hashUserData(user_data);
        this.log('User data hashed for Enhanced Conversions');
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Error hashing user data:', error);
        }
      }
    }

    // GA4 - используем стандартное событие 'purchase' с Enhanced Conversions
    this.sendToGA4(
      'purchase',
      {
        transaction_id,
        value,
        currency,
        items: JSON.stringify([
          {
            item_id: form_type,
            item_name: this.getServiceName(form_type),
            item_category: 'legal_services',
            price: value,
            quantity: 1,
          },
        ]),
      },
      hashedUserData
    );

    // Яндекс.Метрика - цель с ценностью
    this.sendToYM('lead_created', {
      order_price: value,
      currency,
      lead_id: lead_id || transaction_id,
      service_type: form_type,
    });

    // GTM Data Layer
    this.sendToDataLayer('lead_conversion', {
      transactionId: transaction_id,
      transactionTotal: value,
      currency,
      leadId: lead_id || transaction_id,
      formType: form_type,
      serviceName: this.getServiceName(form_type),
    });

    this.log('Conversion tracked', {
      transaction_id,
      value,
      form_type,
    });
  }

  /**
   * Отслеживание этапа воронки
   */
  trackFunnelStep(step: string, additionalData: EventParams = {}): void {
    const funnelSteps: Record<string, number> = {
      page_view: 1,
      form_view: 2,
      form_start: 3,
      form_submit: 4,
      form_success: 5,
    };

    this.trackEvent('funnel_step', {
      step_name: step,
      step_number: funnelSteps[step] || 0,
      ...additionalData,
    });
  }

  /**
   * Отслеживание просмотра страницы
   */
  trackPageView(pagePath?: string): void {
    const path = pagePath || window.location.pathname;

    // GA4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', this.GA_ID || '', {
        page_path: path,
      });
    }

    // Яндекс.Метрика
    if (typeof window.ym !== 'undefined' && this.YM_ID) {
      const ymId = parseInt(this.YM_ID, 10);
      if (!isNaN(ymId)) {
        window.ym(ymId, 'hit', path);
      }
    }

    this.log('Page view tracked:', path);
  }

  /**
   * Получить читаемое название услуги
   */
  private getServiceName(formType: string): string {
    const names: Record<string, string> = {
      bankruptcy: 'Банкротство физических лиц',
      restructuring: 'Реструктуризация долгов',
      consultation: 'Юридическая консультация',
      callback: 'Обратный звонок',
      calculator: 'Расчет калькулятора',
      general: 'Общая заявка',
    };
    return names[formType] || 'Неизвестная услуга';
  }

  /**
   * Получить стоимость услуги
   */
  getServiceValue(formType: string): number {
    const value = SERVICE_VALUES[formType];
    const defaultValue = SERVICE_VALUES['general'];
    // Гарантируем возврат числа, используя константу по умолчанию
    return value !== undefined ? value : defaultValue !== undefined ? defaultValue : 10000;
  }

  /**
   * Проверка поддержки Enhanced Conversions
   */
  isEnhancedConversionsEnabled(): boolean {
    return this.enhancedConversionsEnabled;
  }

  /**
   * Сброс состояния (для тестирования)
   */
  reset(): void {
    this.conversionsSent.clear();
  }
}

// Экспортируем singleton instance
export const analytics = AnalyticsManager.getInstance();

// Экспортируем для использования в других модулях
export default analytics;
