// Performance monitoring utilities
export function measurePageLoad(): void {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        if (perfData) {
          const metrics = {
            dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcpConnection: perfData.connectEnd - perfData.connectStart,
            requestTime: perfData.responseEnd - perfData.requestStart,
            domContentLoaded:
              perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            pageLoadTime: perfData.loadEventEnd - perfData.loadEventStart,
            ttfb: perfData.responseStart - perfData.requestStart,
          };

          // Log to console in development
          if (import.meta.env.DEV) {
            console.log('Page Performance Metrics:', metrics);
          }

          // Send to analytics in production
          if (import.meta.env.PROD) {
            // This would typically send to your analytics service
            // sendToAnalytics('performance_metrics', metrics);
          }
        }
      }, 0);
    });
  }
}

export function trackFirstContentfulPaint(callback: (fcp: number) => void): void {
  if ('PerformanceObserver' in window && 'PerformancePaintTiming' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          callback(entry.startTime);
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }
}

export function trackLargestContentfulPaint(callback: (lcp: number) => void): void {
  if ('PerformanceObserver' in window && 'LargestContentfulPaint' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      callback(lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
}
