import type { RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface FocusTrapOptions {
  initialFocus?: string | HTMLElement | undefined;
  restoreFocus?: boolean;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
  onDeactivate?: () => void;
}

/**
 * Хук для создания ловушки фокуса внутри элемента (для модалок, попапов и т.д.)
 */
export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean,
  options: FocusTrapOptions = {}
): RefObject<T> {
  const {
    initialFocus,
    restoreFocus = true,
    allowOutsideClick = false,
    escapeDeactivates = true,
    onDeactivate,
  } = options;

  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Save previously focused element
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
      ).filter((el) => {
        // Check if element is visible and not hidden
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    };

    const focusableElements = getFocusableElements();
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (initialFocus) {
      const initialElement =
        typeof initialFocus === 'string'
          ? container.querySelector<HTMLElement>(initialFocus)
          : initialFocus;

      if (initialElement) {
        initialElement.focus();
      } else if (firstFocusable) {
        firstFocusable.focus();
      }
    } else if (firstFocusable) {
      firstFocusable.focus();
    }

    // Handle tab navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }

      // Handle escape key
      if (escapeDeactivates && e.key === 'Escape') {
        onDeactivate?.();
      }
    };

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (!allowOutsideClick && !container.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        firstFocusable?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside, true);

      // Restore focus
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, initialFocus, restoreFocus, allowOutsideClick, escapeDeactivates, onDeactivate]);

  return containerRef;
}
