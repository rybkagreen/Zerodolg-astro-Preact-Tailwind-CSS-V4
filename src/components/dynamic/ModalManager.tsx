import { useEffect } from 'preact/hooks';

const ModalManager = () => {
  useEffect(() => {
    // Modal management
    const modals = document.querySelectorAll('[data-modal-container]');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    let activeModal: HTMLElement | null = null;
    let focusedElementBeforeModal: HTMLElement | null = null;

    const openModal = (modalId: string) => {
      const modal = document.querySelector(`[data-modal-container="${modalId}"]`) as HTMLElement;
      if (!modal) return;

      // Store the currently focused element
      focusedElementBeforeModal = document.activeElement as HTMLElement;

      // Open modal
      modal.setAttribute('data-open', 'true');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      activeModal = modal;

      // Focus management
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }

      // Trap focus within modal
      trapFocus(modal);

      // Fire custom event
      modal.dispatchEvent(new CustomEvent('modal:opened', { detail: { modalId } }));
    };

    const closeModal = (modal?: HTMLElement) => {
      const targetModal = modal || activeModal;
      if (!targetModal) return;

      // Close modal
      targetModal.setAttribute('data-open', 'false');
      targetModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      // Restore focus
      if (focusedElementBeforeModal) {
        focusedElementBeforeModal.focus();
        focusedElementBeforeModal = null;
      }

      // Fire custom event
      const modalId = targetModal.getAttribute('data-modal-container');
      targetModal.dispatchEvent(new CustomEvent('modal:closed', { detail: { modalId } }));

      activeModal = null;
    };

    const trapFocus = (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement?.focus();
          }
        }
      };

      element.addEventListener('keydown', handleTabKey);
    };

    // Setup triggers
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        if (modalId) {
          openModal(modalId);
        }
      });
    });

    // Setup close buttons
    modals.forEach(modal => {
      const closeButtons = modal.querySelectorAll('[data-modal-close]');
      closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
          closeModal(modal as HTMLElement);
        });
      });

      // Close on overlay click
      const overlay = modal.querySelector('.modal__overlay');
      if (overlay) {
        overlay.addEventListener('click', () => {
          closeModal(modal as HTMLElement);
        });
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    });

    // Handle URL hash for direct modal opening
    const checkHashForModal = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('modal-')) {
        const modalId = hash.replace('modal-', '');
        openModal(modalId);
      }
    };

    // Check on load
    checkHashForModal();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHashForModal);

    // Public API for programmatic control
    (window as any).modalManager = {
      open: openModal,
      close: closeModal,
      closeAll: () => {
        modals.forEach(modal => {
          modal.setAttribute('data-open', 'false');
          modal.setAttribute('aria-hidden', 'true');
        });
        document.body.classList.remove('modal-open');
        activeModal = null;
      }
    };

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', checkHashForModal);
      delete (window as any).modalManager;
    };
  }, []);

  return null;
};

export default ModalManager;
