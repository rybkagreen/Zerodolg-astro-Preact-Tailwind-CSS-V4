import { useEffect } from 'preact/hooks';
import { useModal } from '@features/modals/model/modal-context';
import { useDynamicModals } from '@features/modals/model/use-dynamic-modals';
import { logger } from '@shared/lib/logger';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ModalManagerHooksProps {}

export default function ModalManagerHooks({}: ModalManagerHooksProps): null {
  const { openModal, closeModal } = useModal();
  const { loadModal } = useDynamicModals();

  useEffect(() => {
    logger.debug('[ModalManager] Initializing with hooks');

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
            loadModal(modalId);
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
    window.modalManager = {
      open: openModal,
      close: closeModal,
      closeAll: () => {
        closeModal();
        // Additional cleanup if needed
      },
      debug: () => ({
        totalModals: document.querySelectorAll('.modal').length,
        activeModal: null,
        dynamicModals: 0
      }),
    };

    logger.info('[ModalManager] Initialization completed with hooks');

    // Cleanup function
    return () => {
      logger.debug('[ModalManager] Cleaning up');
      document.removeEventListener('click', handleTriggerClick);
      window.removeEventListener('hashchange', checkHashForModal);
      delete window.modalManager;
    };
  }, []);

  return null;
}
