/**
 * Consent Manager - управление согласием пользователя на обработку данных
 * Реализует Consent Mode v2 для Google Analytics 4
 * Соответствует требованиям GDPR и 152-ФЗ РФ
 */

export type ConsentStatus = 'granted' | 'denied' | null;

export interface ConsentState {
  analytics: ConsentStatus;
  advertising: ConsentStatus;
  timestamp: number;
}

/**
 * Менеджер согласий пользователя
 */
export class ConsentManager {
  private static readonly CONSENT_KEY = 'user_consent_v2';
  private static readonly CONSENT_VERSION = 2;
  private static instance: ConsentManager;
  private consentState: ConsentState | null = null;

  private constructor() {
    this.loadConsent();
  }

  /**
   * Получить singleton instance
   */
  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  /**
   * Загрузить сохраненное согласие из localStorage
   */
  private loadConsent(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(ConsentManager.CONSENT_KEY);
      if (saved) {
        this.consentState = JSON.parse(saved);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to load consent state:', error);
      }
    }
  }

  /**
   * Сохранить согласие в localStorage
   */
  private saveConsent(state: ConsentState): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(ConsentManager.CONSENT_KEY, JSON.stringify(state));
      this.consentState = state;
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to save consent state:', error);
      }
    }
  }

  /**
   * Проверить, дал ли пользователь согласие на аналитику
   */
  hasAnalyticsConsent(): boolean {
    return this.consentState?.analytics === 'granted';
  }

  /**
   * Проверить, дал ли пользователь согласие на рекламу
   */
  hasAdvertisingConsent(): boolean {
    return this.consentState?.advertising === 'granted';
  }

  /**
   * Проверить, есть ли сохраненное согласие
   */
  hasConsentDecision(): boolean {
    return this.consentState !== null;
  }

  /**
   * Получить текущее состояние согласия
   */
  getConsentState(): ConsentState | null {
    return this.consentState;
  }

  /**
   * Принять все согласия
   */
  acceptAll(): void {
    const state: ConsentState = {
      analytics: 'granted',
      advertising: 'denied', // Для юридических услуг рекламные cookies не нужны
      timestamp: Date.now(),
    };

    this.saveConsent(state);
    this.updateGoogleConsent(state);
    this.triggerConsentEvent('granted');

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('✅ User consent granted:', state);
    }
  }

  /**
   * Отклонить все согласия
   */
  declineAll(): void {
    const state: ConsentState = {
      analytics: 'denied',
      advertising: 'denied',
      timestamp: Date.now(),
    };

    this.saveConsent(state);
    this.updateGoogleConsent(state);
    this.triggerConsentEvent('denied');

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('❌ User consent denied:', state);
    }
  }

  /**
   * Установить кастомное согласие
   */
  setConsent(analytics: ConsentStatus, advertising: ConsentStatus = 'denied'): void {
    const state: ConsentState = {
      analytics,
      advertising,
      timestamp: Date.now(),
    };

    this.saveConsent(state);
    this.updateGoogleConsent(state);
    this.triggerConsentEvent(analytics);
  }

  /**
   * Отозвать согласие
   */
  revokeConsent(): void {
    this.declineAll();
  }

  /**
   * Обновить согласие в Google Analytics через Consent Mode v2
   */
  private updateGoogleConsent(state: ConsentState): void {
    if (typeof window === 'undefined' || typeof window.gtag === 'undefined') {
      return;
    }

    try {
      window.gtag('consent', 'update', {
        analytics_storage: state.analytics || 'denied',
        ad_storage: state.advertising || 'denied',
        ad_user_data: state.advertising || 'denied',
        ad_personalization: state.advertising || 'denied',
      });

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('✅ Google Consent Mode updated:', state);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to update Google consent:', error);
      }
    }
  }

  /**
   * Отправить кастомное событие о изменении согласия
   */
  private triggerConsentEvent(status: ConsentStatus): void {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
      new CustomEvent('consent-changed', {
        detail: {
          status,
          timestamp: Date.now(),
        },
      })
    );
  }

  /**
   * Инициализировать согласие при загрузке страницы
   * Должно вызываться ДО инициализации GA4
   */
  static initializeDefault(): void {
    if (typeof window === 'undefined' || typeof window.gtag === 'undefined') {
      return;
    }

    // Устанавливаем значения по умолчанию (denied)
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500, // Ждем 500ms для баннера
    });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔒 Google Consent Mode initialized (default: denied)');
    }
  }

  /**
   * Восстановить сохраненное согласие при загрузке страницы
   */
  static restoreSavedConsent(): void {
    const manager = ConsentManager.getInstance();

    if (manager.hasConsentDecision()) {
      const state = manager.getConsentState();
      if (state) {
        manager.updateGoogleConsent(state);

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('✅ Saved consent restored:', state);
        }
      }
    }
  }

  /**
   * Проверить, истек ли срок согласия (по умолчанию 365 дней)
   */
  isConsentExpired(maxAgeDays: number = 365): boolean {
    if (!this.consentState) return true;

    const age = Date.now() - this.consentState.timestamp;
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;

    return age > maxAge;
  }

  /**
   * Очистить все сохраненные данные согласия
   */
  clearConsent(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(ConsentManager.CONSENT_KEY);
      this.consentState = null;
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to clear consent:', error);
      }
    }
  }
}

// Экспортируем singleton instance
export const consentManager = ConsentManager.getInstance();

// Экспортируем для использования в других модулях
export default consentManager;
