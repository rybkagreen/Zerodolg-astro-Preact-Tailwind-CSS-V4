// Analytics integration script for ZeroDolg Astro project
// Based on the original project's analytics implementation

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
  [key: string]: any;
}

// Configuration - these should be set in environment variables
const CONFIG: AnalyticsConfig = {
  YANDEX_METRIKA_ID: import.meta.env['PUBLIC_YM_ID'],
  GOOGLE_ANALYTICS_ID: import.meta.env['PUBLIC_GA_ID'],
  BITRIX24_WEBHOOK_URL: import.meta.env['BITRIX24_WEBHOOK_URL'],
  DEBUG: import.meta.env['DEBUG'] === 'true' || false,
};

// Debug logging function
function debugLog(message: string, data?: any): void {
  if (CONFIG.DEBUG) {
    console.log(`[Analytics] ${message}`, data || '');
  }
}

  // Initialize Yandex Metrika
function initYandexMetrika(): void {
  if (!CONFIG.YANDEX_METRIKA_ID) {
    debugLog('Yandex Metrika ID not configured');
    return;
  }

  // Load Yandex Metrika script
  (function (m: any, e: Document, t: string, r: string, i: string, k?: HTMLScriptElement, a?: HTMLScriptElement) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date().getTime();
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
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  // Initialize with configuration
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
        defer: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: 'dataLayer',
        triggerEvent: true,
        params,
      });
    }
  }

  debugLog('Yandex Metrika initialized');
}

  // Initialize Google Analytics
function initGoogleAnalytics(): void {
  if (!CONFIG.GOOGLE_ANALYTICS_ID) {
    debugLog('Google Analytics ID not configured');
    return;
  }

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(script);

  // Initialize
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]): void {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', CONFIG.GOOGLE_ANALYTICS_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  debugLog('Google Analytics initialized');
}

// Track scroll depth
function trackScrollDepth(): void {
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
                depth: depth,
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
  // Initialize analytics services
  initYandexMetrika();
  initGoogleAnalytics();

  // Set up event tracking
  trackScrollDepth();
  trackPhoneClicks();
  trackFormSubmissions();
  trackCTAClicks();

  // Expose analytics API for manual tracking
  window.ZeroDolgAnalytics = {
    // Track custom event
    trackEvent: function (eventName: string, parameters?: EventParameters): void {
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

      debugLog('Custom event tracked:', { event: eventName, parameters: parameters });
    },

    // Enable/disable debug mode
    setDebug: function (enabled: boolean): void {
      CONFIG.DEBUG = enabled;
      debugLog('Debug mode:', enabled ? 'enabled' : 'disabled');
    },

    // Get current config
    getConfig: function (): AnalyticsConfig {
      return CONFIG;
    },
  };

  debugLog('Analytics initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  // DOM is already ready
  initAnalytics();
}

export { initAnalytics };
export default initAnalytics;

// For backward compatibility with Layout.astro
export const injectAnalytics = initAnalytics;