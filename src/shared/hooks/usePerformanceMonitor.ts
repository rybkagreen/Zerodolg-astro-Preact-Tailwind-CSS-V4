import { useEffect, useRef } from 'preact/hooks';

/**
 * Хук для мониторинга производительности компонента
 * @param componentName - название компонента для отслеживания
 */
export function usePerformanceMonitor(componentName: string): void {
  const renderCount = useRef(0);
  const startTime = useRef<number | null>(null);
  const observer = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    renderCount.current += 1;
    startTime.current = performance.now();

    // Мониторим long tasks (задачи, занимающие >50ms)
    if ('PerformanceObserver' in window) {
      observer.current = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            console.warn(`Long task detected in ${componentName}:`, entry);
          }
        });
      });

      observer.current.observe({ entryTypes: ['longtask'] });
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }

      // Логируем время жизни компонента
      if (startTime.current !== null) {
        const lifetime = performance.now() - startTime.current;
        console.log(`${componentName} lifetime: ${lifetime}ms`);
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Логируем количество рендеров
    console.log(`${componentName} renders: ${renderCount.current}`);

    // Мониторим производительность рендеринга
    const measureName = `${componentName}-render`;
    if (performance.mark && performance.measure) {
      performance.mark(`${measureName}-start`);
      
      return () => {
        performance.mark(`${measureName}-end`);
        performance.measure(measureName, `${measureName}-start`, `${measureName}-end`);
        
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && measure.duration > 16.67) { // > 1 фрейма при 60 FPS
          console.warn(`${componentName} render took ${measure.duration.toFixed(2)}ms`);
        }
      };
    }
    
    // Return empty cleanup function to satisfy TypeScript
    return () => {};
  }, [componentName]);
}