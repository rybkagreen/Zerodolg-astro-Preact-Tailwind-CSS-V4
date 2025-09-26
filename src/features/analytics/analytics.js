// Analytics integration script for ZeroDolg Astro project
// Based on the original project's analytics implementation

// Configuration - these should be set in environment variables
const CONFIG = {
  YANDEX_METRIKA_ID: import.meta.env.PUBLIC_YM_ID,
  GOOGLE_ANALYTICS_ID: import.meta.env.PUBLIC_GA_ID,
  BITRIX24_WEBHOOK_URL: import.meta.env.BITRIX24_WEBHOOK_URL,
  DEBUG: import.meta.env.DEBUG === 'true' || false,
};

// Debug logging function
function debugLog(message, data) {
  if (CONFIG.DEBUG) {
    console.log(`[Analytics] ${message}`, data || '');
  }
}

// Initialize Yandex Metrika
function initYandexMetrika() {
  if (!CONFIG.YANDEX_METRIKA_ID) {
    debugLog('Yandex Metrika ID not configured');
    return;
  }

  // Load Yandex Metrika script
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) {
        return;
      }
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  // Initialize with configuration
  if (typeof window.ym !== 'undefined') {
    window.ym(CONFIG.YANDEX_METRIKA_ID, 'init', {
      defer: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: 'dataLayer',
      triggerEvent: true,
      params: {
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
      },
    });
  }

  debugLog('Yandex Metrika initialized');
}

// Initialize Google Analytics
function initGoogleAnalytics() {
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
  function gtag() {
    window.dataLayer.push(arguments);
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
function trackScrollDepth() {
  let maxScroll = 0;
  const scrollDepths = [25, 50, 75, 100];
  const trackedDepths = [];

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
          if (typeof window.ym !== 'undefined') {
            window.ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'scroll_depth', {
              depth: depth,
            });
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
function trackPhoneClicks() {
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('a[href^="tel:"]');
      if (link) {
        const phoneNumber = link.href.replace('tel:', '');

        // Yandex.Metrika
        if (typeof window.ym !== 'undefined') {
          window.ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'phone_click', {
            phone: phoneNumber,
          });
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
function trackFormSubmissions() {
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form && form.tagName === 'FORM') {
      const formId = form.id || 'unknown';
      const formClass = form.className || 'unknown';

      // Yandex.Metrika
      if (typeof window.ym !== 'undefined') {
        window.ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'form_submit_direct', {
          form_id: formId,
          form_class: formClass,
        });
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
function trackCTAClicks() {
  document.addEventListener(
    'click',
    (e) => {
      const button = e.target.closest(
        '.cta-primary, .btn-primary, .cta-button, button[type="submit"]'
      );
      if (button) {
        const buttonText = button.textContent.trim();
        const buttonLocation = button.closest('section')?.className || 'unknown';

        // Yandex.Metrika
        if (typeof window.ym !== 'undefined') {
          window.ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'cta_click', {
            button_text: buttonText,
            location: buttonLocation,
          });
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
function initAnalytics() {
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
    trackEvent: function (eventName, parameters) {
      parameters = parameters || {};

      // Yandex.Metrika
      if (typeof window.ym !== 'undefined' && CONFIG.YANDEX_METRIKA_ID) {
        window.ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', eventName, parameters);
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
    setDebug: function (enabled) {
      CONFIG.DEBUG = enabled;
      debugLog('Debug mode:', enabled ? 'enabled' : 'disabled');
    },

    // Get current config
    getConfig: function () {
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
