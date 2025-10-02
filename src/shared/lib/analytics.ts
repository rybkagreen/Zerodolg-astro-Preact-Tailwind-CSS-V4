// Shared analytics utilities

export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }

  // Yandex Metrika
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(0, 'reachGoal', action);
  }

  // Development logging
  if (import.meta.env.DEV) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('Analytics Event:', { action, category, label, value });
    }
  }
}

export function trackPageView(pagePath: string): void {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env['PUBLIC_GA_ID'], {
      page_path: pagePath,
    });
  }

  // Yandex Metrika
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(0, 'hit', pagePath);
  }

  // Development logging
  if (import.meta.env.DEV) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('Page View:', pagePath);
    }
  }
}
