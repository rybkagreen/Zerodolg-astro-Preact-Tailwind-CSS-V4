import { type VNode } from 'preact';
import { useEffect } from 'preact/hooks';
import { useModal } from '@features/modals/model/modal-context';
import { useDynamicModals } from '@features/modals/model/use-dynamic-modals';

interface ModalManagerHooksProps {
  // This component doesn't accept any props
}

export default function ModalManagerHooks({}: ModalManagerHooksProps): null {
  const { openModal, closeModal } = useModal();
  const { createModal } = useDynamicModals();

  useEffect(() => {
    console.log('[ModalManager] Initializing with hooks');

    // Setup event delegation for modal triggers
    const handleTriggerClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest('[data-modal]') as HTMLElement;

      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modalType = trigger.getAttribute('data-modal-type');

        if (modalId) {
          if (modalType) {
            // Create dynamic modal
            createModal(modalId, modalType);
          } else {
            // Open existing modal
            openModal(modalId);
          }
        }
      }

      // Handle close buttons
      const closeBtn = target.closest('[data-modal-close]') as HTMLElement;
      if (closeBtn) {
        e.preventDefault();
        closeModal();
      }
    };

    // Setup hash change handling for direct modal opening
    const checkHashForModal = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('modal-')) {
        const modalId = hash.replace('modal-', '');
        openModal(modalId);
      }
    };

    // Add event listeners
    document.addEventListener('click', handleTriggerClick);
    window.addEventListener('hashchange', checkHashForModal);

    // Check for hash on initial load
    checkHashForModal();

    // Setup public API
    (window as any).modalManager = {
      open: openModal,
      close: closeModal,
      closeAll: () => {
        closeModal();
        // Additional cleanup if needed
      },
    };

    console.log('[ModalManager] Initialization completed with hooks');

    // Cleanup function
    return () => {
      console.log('[ModalManager] Cleaning up');
      document.removeEventListener('click', handleTriggerClick);
      window.removeEventListener('hashchange', checkHashForModal);
      delete (window as any).modalManager;
    };
  }, []);

  return null;
}
