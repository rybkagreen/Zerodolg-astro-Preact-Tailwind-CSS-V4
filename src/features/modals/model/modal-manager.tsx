import { useEffect } from 'preact/hooks';
import { logger } from '../../../shared/lib/logger';

// Extended HTMLElement interface for modal-specific properties
interface ExtendedHTMLElement extends HTMLElement {
  _focusTrapHandler?: (e: KeyboardEvent) => void;
}

/**
 * Unified Modal Manager Component
 * Handles both declarative modals (defined as components) and
 * imperative modals (created dynamically with JavaScript)
 */
class UnifiedModalManager {
  private activeModal: HTMLElement | null = null;
  private focusedElementBeforeModal: HTMLElement | null = null;
  private dynamicModals: Set<HTMLElement> = new Set();
  private modalTypeMap: Map<string, string> = new Map(); // Map of modal IDs to their types

  init(): void {
    logger.debug('[ModalManager] Starting initialization');
    
    // Make sure DOM is ready
    if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
      logger.debug('[ModalManager] DOM not ready, waiting...');
      document.addEventListener('DOMContentLoaded', () => {
        logger.debug('[ModalManager] DOM ready, initializing...');
        this.setupModalManager();
      });
      return;
    }
    
    this.setupModalManager();
  }
  
  private setupModalManager(): void {
    logger.debug('[ModalManager] Setting up modal manager');

    // Setup event delegation for modal triggers
    document.addEventListener('click', this.handleTriggerClick.bind(this));
    logger.debug('[ModalManager] Click event listener added to document');

    // Setup ESC key handling
    document.addEventListener('keydown', this.handleEscKey.bind(this));

    // Setup hash change handling for direct modal opening
    window.addEventListener('hashchange', this.checkHashForModal.bind(this));

    // Check for hash on initial load
    this.checkHashForModal();

    // Setup public API
    window.modalManager = {
      open: this.openModal.bind(this),
      close: (modalId?: string) => this.closeModal(modalId),
      closeAll: this.closeAllModals.bind(this),
      debug: this.getStats.bind(this),
    };

    // Debug info
    logger.debug('[ModalManager] Available modals:', {
      modals: Array.from(document.querySelectorAll('.modal')).map(m => ({ id: m.id, classes: m.className }))
    });

    logger.debug('[ModalManager] Global API window.modalManager set up');
    logger.info('[ModalManager] Initialization completed');
  }

  private handleTriggerClick(e: Event): void {
    logger.debug('[ModalManager] handleTriggerClick called');
    const target = e.target as HTMLElement;
    const trigger = target.closest('[data-modal]') as HTMLElement;
    const closeButton = target.closest('[data-modal-close]') as HTMLElement;

    // Handle modal close buttons
    if (closeButton) {
      e.preventDefault();
      logger.debug('[ModalManager] Close button clicked');
      this.closeModal();
      return;
    }

    // Handle modal open triggers
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modalType = trigger.getAttribute('data-modal-type');

      logger.debug('[ModalManager] Modal attributes', { modalId, modalType });

      if (modalId) {
        this.openModal(modalId, modalType || undefined);
      }
    }
  }

  private handleEscKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.activeModal) {
      logger.debug('[ModalManager] ESC key pressed, closing modal');
      this.closeModal();
    }
  }

  private checkHashForModal(): void {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('modal-')) {
      const modalId = hash.replace('modal-', '');
      logger.debug('[ModalManager] Hash change detected, opening modal', { modalId });
      this.openModal(modalId);
    }
  }

  openModal(modalId: string, modalType?: string): void {
    logger.debug('[ModalManager] Opening modal', { modalId, modalType });

    try {
      const modalElement = document.getElementById(modalId);

      if (!modalElement) {
        logger.warn('[ModalManager] Modal element not found', { modalId });
        return;
      }

      // Store modal type if provided
      if (modalType) {
        this.modalTypeMap.set(modalId, modalType);
      }

      // Close any currently open modal
      this.closeModal();

      // Store focused element before opening modal
      this.focusedElementBeforeModal = document.activeElement as HTMLElement;

      // Show modal
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.setAttribute('data-modal-open', 'true');

      // Set as active modal
      this.activeModal = modalElement;

      // Focus trap setup
      this.setupFocusTrap(modalElement);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Dispatch custom event
      modalElement.dispatchEvent(new CustomEvent('modal:open', { detail: { modalId, modalType } }));

      logger.info('[ModalManager] Modal opened successfully', { modalId, modalType });
    } catch (error) {
      logger.error('[ModalManager] Error opening modal', {
        modalId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  closeModal(modalId?: string): void {
    const modalToClose = modalId ? document.getElementById(modalId) : this.activeModal;

    if (!modalToClose) {
      logger.debug('[ModalManager] No modal to close');
      return;
    }

    logger.debug('[ModalManager] Closing modal', { modalId: modalToClose.id });

    try {
      // Hide modal
      modalToClose.style.display = 'none';
      modalToClose.setAttribute('aria-hidden', 'true');
      modalToClose.removeAttribute('data-modal-open');

      // Remove from active modal if it's the current one
      if (this.activeModal === modalToClose) {
        this.activeModal = null;
      }

      // Remove from dynamic modals if it exists there
      this.dynamicModals.delete(modalToClose);

      // Cleanup focus trap
      this.cleanupFocusTrap(modalToClose);

      // Remove modal type mapping
      this.modalTypeMap.delete(modalToClose.id);

      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (this.focusedElementBeforeModal) {
        this.focusedElementBeforeModal.focus();
        this.focusedElementBeforeModal = null;
      }

      // Dispatch custom event
      modalToClose.dispatchEvent(
        new CustomEvent('modal:close', { detail: { modalId: modalToClose.id } })
      );

      logger.info('[ModalManager] Modal closed successfully', { modalId: modalToClose.id });
    } catch (error) {
      logger.error('[ModalManager] Error closing modal', {
        modalId: modalToClose.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  closeAllModals(): void {
    logger.debug('[ModalManager] Closing all modals');

    // Close active modal
    if (this.activeModal) {
      this.closeModal(this.activeModal.id);
    }

    // Close all dynamic modals
    this.dynamicModals.forEach((modal) => {
      this.closeModal(modal.id);
    });

    this.dynamicModals.clear();
    this.modalTypeMap.clear();

    logger.info('[ModalManager] All modals closed');
  }

  private setupFocusTrap(modalElement: HTMLElement): void {
    logger.debug('[ModalManager] Setting up focus trap');

    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element
      if (firstElement) {
        firstElement.focus();
      }

      // Add keyboard trap
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            if (lastElement) {
              lastElement.focus();
            }
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            if (firstElement) {
              firstElement.focus();
            }
          }
        }
      };

      modalElement.addEventListener('keydown', handleTabKey);

      // Store handler for cleanup
      (modalElement as ExtendedHTMLElement)._focusTrapHandler = handleTabKey;
    }
  }

  private cleanupFocusTrap(modalElement: HTMLElement): void {
    logger.debug('[ModalManager] Cleaning up focus trap');

    const handler = (modalElement as ExtendedHTMLElement)._focusTrapHandler;
    if (handler) {
      modalElement.removeEventListener('keydown', handler);
      delete (modalElement as ExtendedHTMLElement)._focusTrapHandler;
    }
  }

  // Method to create dynamic modal (for imperative usage)
  createDynamicModal(
    content: string,
    options: { modalId?: string; modalType?: string } = {}
  ): string {
    const modalId = options.modalId || `dynamic-modal-${Date.now()}`;

    logger.debug('[ModalManager] Creating dynamic modal', {
      modalId,
      modalType: options.modalType,
    });

    try {
      // Create modal element
      const modalElement = document.createElement('div');
      modalElement.id = modalId;
      modalElement.className = 'modal dynamic-modal';
      modalElement.setAttribute('role', 'dialog');
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.style.display = 'none';

      // Set content
      modalElement.innerHTML = content;

      // Add to document
      document.body.appendChild(modalElement);

      // Store in dynamic modals set
      this.dynamicModals.add(modalElement);

      // Store modal type if provided
      if (options.modalType) {
        this.modalTypeMap.set(modalId, options.modalType);
      }

      logger.info('[ModalManager] Dynamic modal created', {
        modalId,
        modalType: options.modalType,
      });

      return modalId;
    } catch (error) {
      logger.error('[ModalManager] Error creating dynamic modal', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Method to remove dynamic modal
  removeDynamicModal(modalId: string): void {
    logger.debug('[ModalManager] Removing dynamic modal', { modalId });

    const modalElement = document.getElementById(modalId);

    if (modalElement && this.dynamicModals.has(modalElement)) {
      this.closeModal(modalId);
      modalElement.remove();
      this.dynamicModals.delete(modalElement);
      this.modalTypeMap.delete(modalId);

      logger.info('[ModalManager] Dynamic modal removed', { modalId });
    } else {
      logger.warn('[ModalManager] Dynamic modal not found or not managed by this instance', {
        modalId,
      });
    }
  }

  // Get modal statistics for debugging/analytics
  getStats(): { totalModals: number; activeModal: string | null; dynamicModals: number } {
    const stats = {
      totalModals: this.modalTypeMap.size,
      activeModal: this.activeModal?.id || null,
      dynamicModals: this.dynamicModals.size,
    };

    logger.debug('[ModalManager] Modal statistics', stats);

    return stats;
  }
}

// Note: Global type declaration moved to src/global.d.ts to avoid conflicts

// Export singleton instance
export const modalManager = new UnifiedModalManager();

// Hook for React/Preact components
export const useModalManager = () => {
  useEffect(() => {
    try {
      logger.debug('[ModalManager] Initializing from useModalManager hook');
      modalManager.init();
    } catch (error) {
      logger.error('[ModalManager] Failed to initialize', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return () => {
      logger.debug('[ModalManager] Cleanup from useModalManager hook');
      // Cleanup if needed
    };
  }, []);

  return modalManager;
};

// Component wrapper for easier usage
export default function ModalManagerComponent() {
  useModalManager();
  return null;
}
