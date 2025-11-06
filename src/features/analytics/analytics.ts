// Analytics integration script for ZeroDolg Astro project
// Based on the original project's analytics implementation

import { initWebvisorWithConsent } from './webvisor-handler';

// Types
interface AnalyticsConfig {
  YANDEX_METRIKA_ID: string | undefined;
  GOOGLE_ANALYTICS_ID: string | undefined;
  BITRIX24_WEBHOOK_URL: string | undefined;
  DEBUG: boolean;
}

interface YandexMetrikaParams {
  page_url: string;
  page_ref: string;
  init_utc_timestamp: string;
  page_load_utc: number;
  timezone_offset: number;
  timezone_name: string;
  user_agent: string;
  screen_resolution: string;
  viewport_size: string;
  page_title: string;
}

interface EventParameters {
  [key: string]: string | number | boolean | undefined;
}

// Configuration - these should be set in environment variables
const CONFIG: AnalyticsConfig = {
  YANDEX_METRIKA_ID: import.meta.env['PUBLIC_YM_ID'],
  GOOGLE_ANALYTICS_ID: import.meta.env['PUBLIC_GA_ID'],
  BITRIX24_WEBHOOK_URL: import.meta.env['BITRIX24_WEBHOOK_URL'],
  DEBUG: import.meta.env['DEBUG'] === 'true' || false,
};

// SSR Protection: Check if running in browser context
const isBrowser = typeof window !== 'undefined';

// Debug logging function
function debugLog(message: string, data?: unknown): void {
  if (CONFIG.DEBUG) {
    if (import.meta.env.DEV && isBrowser) {
      // eslint-disable-next-line no-console
      console.log(`[Analytics] ${message}`, data || '');
    }
  }
}

// Initialize Yandex Metrika
function initYandexMetrika(): void {
  if (!isBrowser || !CONFIG.YANDEX_METRIKA_ID) {
    if (!CONFIG.YANDEX_METRIKA_ID) {
      debugLog('Yandex Metrika ID not configured');
    }
    return;
  }

  // Согласие пользователя уже проверено в initAnalytics() (строка 456-468)
  // Здесь просто загружаем скрипт Метрики
  loadYandexMetrikaScript();
}

// Загрузка скрипта Yandex Metrika
function loadYandexMetrikaScript(): void {
  if (!isBrowser || !CONFIG.YANDEX_METRIKA_ID) {
    if (!CONFIG.YANDEX_METRIKA_ID) {
      debugLog('Yandex Metrika ID not configured');
    }
    return;
  }

  // Check if script is already loaded
  if (document.querySelector('script[src*="mc.yandex.ru/metrika/tag.js"]')) {
    debugLog('Yandex Metrika script already loaded');
    return;
  }

  // Load Yandex Metrika script
  type YandexMetrikaFunction = {
    (...args: unknown[]): void;
    a?: unknown[];
    l?: number;
  };

  (function (
    m: Window & { [key: string]: YandexMetrikaFunction | undefined },
    e: Document,
    t: string,
    r: string,
    i: string,
    k?: HTMLScriptElement,
    a?: HTMLScriptElement
  ) {
    const ymFunc: YandexMetrikaFunction = function (...args: unknown[]) {
      const fn = m[i] as YandexMetrikaFunction | undefined;
      if (!fn) return;
      (fn.a = fn.a || []).push(args);
    };
    m[i] = m[i] || ymFunc;
    const currentFn = m[i];
    if (currentFn) {
      currentFn.l = 1 * new Date().getTime();
    }
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j]?.src === r) {
        return;
      }
    }
    k = e.createElement(t) as HTMLScriptElement;
    a = e.getElementsByTagName(t)[0] as HTMLScriptElement;
    k.async = true;
    k.src = r;
    a.parentNode?.insertBefore(k, a);
  })(
    window as unknown as Window & { [key: string]: YandexMetrikaFunction | undefined },
    document,
    'script',
    'https://mc.yandex.ru/metrika/tag.js',
    'ym'
  );

  // Initialize with configuration after script is loaded
  const initMetrika = () => {
    if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
      const params: YandexMetrikaParams = {
        page_url: window.location.href,
        page_ref: document.referrer,
        init_utc_timestamp: new Date().toISOString(),
        page_load_utc: new Date().getTime(),
        timezone_offset: new Date().getTimezoneOffset(),
        timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        page_title: document.title,
      };

      // Convert string ID to number for ym function
      const ymId = parseInt(CONFIG.YANDEX_METRIKA_ID, 10);
      if (!isNaN(ymId)) {
        window.ym?.(ymId, 'init', {
          defer: false, // ✅ ИСПРАВЛЕНО: разрешаем автоматические хиты
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: 'dataLayer',
          triggerEvent: true,
          params,
        });

        debugLog('Yandex Metrika initialized');
        console.info('📊 Яндекс.Метрика инициализирована с ID:', ymId);

        // ✅ ДОБАВЛЕНО: Явная отправка первого хита (просмотра страницы)
        window.ym?.(ymId, 'hit', window.location.href, {
          title: document.title,
          referer: document.referrer,
        });

        debugLog('Initial pageview sent to Yandex Metrika');
      }
    }
  };

  // Wait for script to load before initializing
  if (typeof window.ym !== 'undefined') {
    initMetrika();
  } else {
    // Wait for script to load
    const checkYm = setInterval(() => {
      if (typeof window.ym !== 'undefined') {
        clearInterval(checkYm);
        initMetrika();
      }
    }, 100);
  }
}

// Initialize Google Analytics with Consent Mode v2
function initGoogleAnalytics(): void {
  if (!isBrowser || !CONFIG.GOOGLE_ANALYTICS_ID) {
    if (!CONFIG.GOOGLE_ANALYTICS_ID) {
      debugLog('Google Analytics ID not configured');
    }
    return;
  }

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]): void {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  // ✅ СНАЧАЛА устанавливаем Consent Mode v2 (по умолчанию denied)
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500, // Ждем 500ms для Cookie Banner
  });

  debugLog('Consent Mode v2 initialized (default: denied)');

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(script);

  // Configure GA4
  gtag('js', new Date());
  gtag('config', CONFIG.GOOGLE_ANALYTICS_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  debugLog('Google Analytics initialized with Consent Mode v2');
  console.info('📊 Google Analytics инициализирован с ID:', CONFIG.GOOGLE_ANALYTICS_ID);
}

// Track scroll depth
function trackScrollDepth(): void {
  if (!isBrowser) return;

  let maxScroll = 0;
  const scrollDepths = [25, 50, 75, 100];
  const trackedDepths: number[] = [];

  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      scrollDepths.forEach((depth) => {
        if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
          trackedDepths.push(depth);

          // Yandex.Metrika
          if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
            const ymId = parseInt(CONFIG.YANDEX_METRIKA_ID, 10);
            if (!isNaN(ymId)) {
              window.ym(ymId, 'reachGoal', 'scroll_depth', {
                depth,
              });
            }
          }

          // Google Analytics
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'scroll', {
              event_category: 'engagement',
              event_label: `${depth}%`,
              value: depth,
            });
          }

          debugLog('Scroll depth tracked:', `${depth}%`);
        }
      });
    }
  });
}

// Track phone clicks
function trackPhoneClicks(): void {
  if (!isBrowser) return;

  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (link) {
        const phoneNumber = link.href.replace('tel:', '');

        // Yandex.Metrika
        if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
          const ymId = parseInt(CONFIG.YANDEX_METRIKA_ID, 10);
          if (!isNaN(ymId)) {
            window.ym(ymId, 'reachGoal', 'phone_click', {
              phone: phoneNumber,
            });
          }
        }

        // Google Analytics
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'phone_click', {
            event_category: 'contact',
            event_label: phoneNumber,
          });
        }

        debugLog('Phone click tracked:', phoneNumber);
      }
    },
    true
  );
}

// Track form submissions
function trackFormSubmissions(): void {
  if (!isBrowser) return;

  document.addEventListener('submit', (e: SubmitEvent) => {
    const form = e.target as HTMLFormElement | null;
    if (form && form.tagName === 'FORM') {
      const formId = form.id || 'unknown';
      const formClass = form.className || 'unknown';

      // Yandex.Metrika
      if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
        const ymId = parseInt(CONFIG.YANDEX_METRIKA_ID, 10);
        if (!isNaN(ymId)) {
          window.ym(ymId, 'reachGoal', 'form_submit_direct', {
            form_id: formId,
            form_class: formClass,
          });
        }
      }

      // Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'form_submit_direct', {
          event_category: 'engagement',
          event_label: formId,
        });
      }

      debugLog('Form submission tracked:', { id: formId, class: formClass });
    }
  });
}

// Track CTA clicks
function trackCTAClicks(): void {
  if (!isBrowser) return;

  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest(
        '.cta-primary, .btn-primary, .cta-button, button[type="submit"]'
      ) as HTMLButtonElement | null;
      if (button) {
        const buttonText = button.textContent?.trim() || 'unknown';
        const buttonLocation = button.closest('section')?.className || 'unknown';

        // Yandex.Metrika
        if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
          const ymId = parseInt(CONFIG.YANDEX_METRIKA_ID, 10);
          if (!isNaN(ymId)) {
            window.ym(ymId, 'reachGoal', 'cta_click', {
              button_text: buttonText,
              location: buttonLocation,
            });
          }
        }

        // Google Analytics
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: buttonText,
            event_location: buttonLocation,
          });
        }

        debugLog('CTA click tracked:', { text: buttonText, location: buttonLocation });
      }
    },
    true
  );
}

// Main initialization function
function initAnalytics(): void {
  if (!isBrowser) return;

  // ✅ Восстанавливаем сохраненное согласие пользователя
  if (typeof window !== 'undefined') {
    // Динамический импорт для избежания проблем с SSR
    import('../../shared/lib/consent-manager')
      .then(({ ConsentManager }) => {
        ConsentManager.restoreSavedConsent();
        debugLog('Consent restored from localStorage');
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Failed to import consent-manager:', error);
        }
      });
  }

  // Initialize analytics services
  initYandexMetrika();
  initGoogleAnalytics();

  // Initialize Webvisor (only with consent)
  initWebvisorWithConsent();

  // Set up event tracking
  trackScrollDepth();
  trackPhoneClicks();
  trackFormSubmissions();
  trackCTAClicks();

  // Expose analytics API for manual tracking
  window.ZeroDolgAnalytics = {
    // Track custom event
    trackEvent(eventName: string, parameters?: EventParameters): void {
      parameters = parameters || {};

      // Yandex.Metrika
      if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
        const ymId = parseInt(CONFIG.YANDEX_METRIKA_ID, 10);
        if (!isNaN(ymId)) {
          window.ym(ymId, 'reachGoal', eventName, parameters);
        }
      }

      // Google Analytics
      if (typeof window.gtag !== 'undefined' && CONFIG.GOOGLE_ANALYTICS_ID) {
        window.gtag(
          'event',
          eventName,
          Object.assign(
            {
              event_category: 'custom',
            },
            parameters
          )
        );
      }

      debugLog('Custom event tracked:', { event: eventName, parameters });
    },

    // Enable/disable debug mode
    setDebug(enabled: boolean): void {
      CONFIG.DEBUG = enabled;
      debugLog('Debug mode:', enabled ? 'enabled' : 'disabled');
    },

    // Get current config
    getConfig(): AnalyticsConfig {
      return CONFIG;
    },
  };

  debugLog('Analytics initialized');
  console.info('📊 Система аналитики полностью инициализирована');
}

// Initialize analytics when consent is granted
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Check for existing consent immediately
  import('../../shared/lib/consent-manager')
    .then(({ consentManager }) => {
      if (consentManager.hasAnalyticsConsent()) {
        // Consent already given, initialize immediately
        initAnalytics();
      } else {
        // Wait for consent to be granted
        window.addEventListener('consent-changed', (event: Event) => {
          // Type assertion for CustomEvent
          const customEvent = event as CustomEvent;
          if (customEvent.detail?.status === 'granted') {
            initAnalytics();
          }
        });
      }
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to import consent-manager:', error);
      }
    });
}

export { initAnalytics };
export default initAnalytics;

// For backward compatibility with Layout.astro
export const injectAnalytics = initAnalytics;
