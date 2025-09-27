import { type VNode, type ComponentChildren } from 'preact';
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import { useFocusTrap } from '../../../shared/hooks/useFocusTrap';
import { useScrollLock } from '../../../shared/hooks/useScrollLock';
import { useReducedMotion } from '../../../shared/hooks/useReducedMotion';
import { useClickOutside } from '../../../shared/hooks/useClickOutside';
import { usePerformanceMonitor } from '../../../shared/hooks/usePerformanceMonitor';

interface ModalProps {
  id: string;
  title: string;
  onClose?: () => void;
  children: ComponentChildren;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  disableScrollLock?: boolean;
  initialFocus?: string;
  role?: 'dialog' | 'alertdialog';
  backdropClass?: string;
  containerClass?: string;
  headerClass?: string;
  bodyClass?: string;
}

export default function ModalEnhanced({
  id,
  title,
  onClose,
  children,
  closeOnOverlayClick = true, // Used for compatibility
  closeOnEscape = true,
  disableScrollLock = false,
  initialFocus,
  role = 'dialog',
  backdropClass = 'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity',
  containerClass = 'fixed inset-0 overflow-y-auto',
  headerClass = 'flex items-center justify-between p-4 border-b',
  bodyClass = 'p-4'
}: ModalProps): VNode | null {
  const [isActive, setIsActive] = useState(false);
  const { ref: clickOutsideRef } = useClickOutside<HTMLDivElement>(() => {
    if (closeOnOverlayClick) {
      handleClose();
    }
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isActive, {
    initialFocus: initialFocus as string | HTMLElement | undefined,
    restoreFocus: true,
    allowOutsideClick: false,
    escapeDeactivates: true,
    onDeactivate: () => handleClose()
  });
  const prefersReducedMotion = useReducedMotion();

  usePerformanceMonitor('ModalEnhanced');

  // Установим активность модального окна при рендере
  useEffect(() => {
    setIsActive(true);
    return () => setIsActive(false);
  }, []);

  // Блокировка прокрутки
  useScrollLock(!disableScrollLock && isActive);

  // Обработчик закрытия модального окна
  const handleClose = useCallback(() => {
    setIsActive(false);
    setTimeout(() => {
      onClose?.();
    }, prefersReducedMotion ? 0 : 300); // Даем время на анимацию закрытия
  }, [onClose, prefersReducedMotion]);

  // Обработка нажатия клавиши ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        handleClose();
      }
    };

    if (isActive && closeOnEscape) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isActive, closeOnEscape, handleClose]);

  // Стили с анимацией
  const containerStyle = {
    opacity: isActive ? 1 : 0,
    visibility: isActive ? 'visible' : 'hidden',
    transition: prefersReducedMotion ? 'none' : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const contentStyle = {
    transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    transition: prefersReducedMotion ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div
      class={containerClass}
      style={containerStyle}
      aria-hidden={!isActive}
      aria-modal={isActive}
      role={role}
    >
      <div class={backdropClass} />
      <div
        ref={clickOutsideRef}
        class="min-h-full flex items-center justify-center p-4"
      >
        <div
          ref={(el) => {
            if (el) {
              modalRef.current = el;
              focusTrapRef.current = el;
            }
          }}
          class="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          style={contentStyle}
          role="document"
        >
          <div class={headerClass}>
            <h3 class="text-lg font-semibold text-gray-900" id={`${id}-title`}>
              {title}
            </h3>
            <button
              onClick={handleClose}
              class="text-gray-400 hover:text-gray-600 rounded-full p-1"
              aria-label="Закрыть"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={contentRef} class={bodyClass}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}