import { useEffect, useRef } from 'preact/hooks';

/**
 * Хук для мониторинга производительности компонента
 * @param componentName - название компонента для отслеживания
 */
export function usePerformanceMonitor(componentName: string): void {
  const renderCount = useRef(0);
  const startTime = useRef<number | null>(null);
  const observer = useRef<PerformanceObserver | null>(null);

  // Включаем мониторинг только в режиме разработки
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!isDev) return;

    renderCount.current += 1;
    startTime.current = performance.now();

    // Мониторим long tasks (задачи, занимающие >50ms) только в dev режиме
    if ('PerformanceObserver' in window && isDev) {
      observer.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries && entries.length > 0) {
          entries.forEach((entry) => {
            if (entry.entryType === 'longtask') {
              console.warn(`Long task detected in ${componentName}:`, entry);
            }
          });
        }
      });

      try {
        observer.current.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Игнорируем ошибки наблюдателя
        console.warn('PerformanceObserver error:', error);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }

      // Логируем время жизни компонента только в dev режиме
      if (startTime.current !== null && isDev) {
        const lifetime = performance.now() - startTime.current;
        console.log(`${componentName} lifetime: ${lifetime}ms`);
      }
    };
  }, [componentName, isDev]);

  useEffect(() => {
    if (!isDev) return;

    // Логируем количество рендеров только в dev режиме
    console.log(`${componentName} renders: ${renderCount.current}`);

    // Мониторим производительность рендеринга только в dev режиме
    const measureName = `${componentName}-render`;
    if (performance.mark && performance.measure) {
      performance.mark(`${measureName}-start`);

      return () => {
        performance.mark(`${measureName}-end`);
        performance.measure(measureName, `${measureName}-start`, `${measureName}-end`);

        const measures = performance.getEntriesByName(measureName);
        if (measures && measures.length > 0) {
          const measure = measures[0];
          if (measure && measure.duration > 16.67) {
            // > 1 фрейма при 60 FPS
            console.warn(`${componentName} render took ${measure.duration.toFixed(2)}ms`);
          }
        }
      };
    }

    // Return empty cleanup function to satisfy TypeScript
    return () => {};
  }, [componentName, isDev]);
}
