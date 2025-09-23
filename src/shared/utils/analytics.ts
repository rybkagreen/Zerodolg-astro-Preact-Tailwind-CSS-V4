// Shared analytics utilities
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ym?: (id: number, command: string, ...args: any[]) => void;
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Yandex Metrika
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(0, 'reachGoal', action);
  }

  // Development logging
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', { action, category, label, value });
  }
}

export function trackPageView(pagePath: string): void {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.PUBLIC_GA_ID, {
      page_path: pagePath,
    });
  }

  // Yandex Metrika
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(0, 'hit', pagePath);
  }

  // Development logging
  if (import.meta.env.DEV) {
    console.log('Page View:', pagePath);
  }
}
