import { useEffect, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useFocusTrap } from '@shared/hooks/useFocusTrap';
import { cn } from '@shared/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: import('preact').JSX.Element;
  role?: 'dialog' | 'alertdialog';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function AccessibleModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  role = 'dialog',
  size = 'md',
  className = '' 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, {
    initialFocus: `[data-modal-id="${title}"] .modal-close`,
    allowOutsideClick: false,
  });

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  return createPortal(
    <div
      ref={containerRef}
      class={cn(
        'fixed inset-0 z-[1000] overflow-y-auto',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        'flex items-center justify-center p-4',
        className
      )}
      role={role}
      aria-modal="true"
      aria-labelledby={`modal-title-${title}`}
      onClick={onClose} // Close on backdrop click
    >
      <div
        ref={modalRef}
        class={cn(
          'relative bg-bg-primary rounded-xl shadow-xl',
          'w-full max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          'transform transition-all duration-300 ease-out'
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 
              id={`modal-title-${title}`}
              class="text-xl font-semibold text-text-primary"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              class={cn(
                'modal-close',
                'p-1 rounded-full hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-primary-500',
                'text-text-muted hover:text-text-primary'
              )}
              aria-label="Закрыть модальное окно"
              data-modal-id={title}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="modal-content">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}