import { useCallback, useRef } from 'preact/hooks';

/**
 * Хук для троттлинга функций
 * @param callback - функция для троттлинга
 * @param delay - минимальная задержка между вызовами в миллисекундах
 * @returns троттленная функция
 */
export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const isThrottled = useRef(false);
  const lastArgs = useRef<Parameters<T> | null>(null);

  const throttledFunction = useCallback(
    (...args: Parameters<T>) => {
      if (!isThrottled.current) {
        callback(...args);
        isThrottled.current = true;

        setTimeout(() => {
          isThrottled.current = false;
          if (lastArgs.current) {
            throttledFunction(...lastArgs.current);
            lastArgs.current = null;
          }
        }, delay);
      } else {
        lastArgs.current = args;
      }
    },
    [callback, delay]
  );

  return throttledFunction as T;
}
