import { useEffect, useRef } from 'preact/hooks';

/**
 * Хук для отслеживания кликов вне компонента
 * @param handler - функция, вызываемая при клике вне компонента
 * @returns ref, который нужно прикрепить к DOM элементу
 */
export function useClickOutside<T extends HTMLElement>(
  handler: (event: Event) => void
): { ref: (element: T | null) => void } {
  const ref = useRef<T | null>(null);
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        savedHandler.current(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { ref: (element: T | null) => {
    ref.current = element;
  } };
}