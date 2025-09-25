/**
 * Analytics module for tracking user interactions and page views
 */

// The gtag interface is already declared in social-links.tsx
// No need to redeclare it here

/**
 * Initialize analytics tracking
 */
export function initAnalytics(): void {
  // Initialize Google Analytics if available
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    console.log('Analytics initialized');

    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);
  } else {
    // Fallback analytics initialization
    console.log('Analytics not available, using fallback tracking');
  }
}

/**
 * Track a page view
 * @param url - The URL to track
 * @param title - The page title
 */
export function trackPageView(url: string = '', title: string = ''): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', import.meta.env.PUBLIC_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
      page_path: url,
      page_title: title,
    });
  } else {
    console.log(`Page view tracked: ${url || window.location.pathname}`);
  }
}

/**
 * Track a custom event
 * @param action - The action name
 * @param category - The event category
 * @param label - Optional label
 * @param value - Optional value
 */
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.log(`Event tracked: ${action} in ${category}${label ? ` (label: ${label})` : ''}`);
  }
}

/**
 * Track an exception
 * @param description - Description of the error
 * @param fatal - Whether the error was fatal
 */
export function trackException(description: string, fatal: boolean = false): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    });
  } else {
    console.error(`Exception tracked: ${description}, Fatal: ${fatal}`);
  }
}
