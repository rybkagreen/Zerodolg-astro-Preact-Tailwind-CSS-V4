import { useEffect } from 'preact/hooks';

// Эта переменная нужна для доступа к window
declare let window: Window & typeof globalThis;

/**
 * Хук для блокировки прокрутки на элементе
 * @param isActive - флаг, указывающий, включена ли блокировка
 */
export function useScrollLock(isActive: boolean): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isActive) {
      // Сохраняем текущую позицию прокрутки
      const { scrollY } = window;

      // Устанавливаем позицию прокрутки и добавляем стили для отключения прокрутки
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Восстанавливаем прокрутку
      const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      // Восстанавливаем позицию прокрутки
      window.scrollTo(0, scrollY);
    }

    return () => {
      // Восстанавливаем в случае размонтирования
      if (isActive) {
        const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      }
    };
  }, [isActive]);
}
