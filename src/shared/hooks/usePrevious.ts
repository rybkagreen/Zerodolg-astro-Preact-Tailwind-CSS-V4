import { useEffect, useRef } from 'preact/hooks';

/**
 * Хук для отслеживания предыдущего значения
 * @param value - текущее значение
 * @returns предыдущее значение
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
