import { useEffect } from 'preact/hooks';

/**
 * Хук для выполнения асинхронного эффекта
 * @param effect - асинхронная функция эффекта
 * @param deps - зависимости эффекта
 */
export function useAsyncEffect(
  effect: () => Promise<void> | (() => void | Promise<void>),
  deps?: unknown[]
): void {
  useEffect(() => {
    let cancelled = false;

    const executeEffect = async () => {
      const cleanup = await effect();
      
      if (cancelled && typeof cleanup === 'function') {
        cleanup();
      }
    };

    executeEffect();

    return () => {
      cancelled = true;
    };
  }, deps);
}