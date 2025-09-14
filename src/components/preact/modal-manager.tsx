import { useEffect } from 'preact/hooks';

/**
 * Unified Modal Manager Component
 * Handles both declarative modals (defined as components) and 
 * imperative modals (created dynamically with JavaScript)
 */
class UnifiedModalManager {
  private modals: Map<string, HTMLElement> = new Map();
  private activeModal: HTMLElement | null = null;
  private focusedElementBeforeModal: HTMLElement | null = null;
  private dynamicModals: Set<HTMLElement> = new Set();

  init(): void {
    // Setup event delegation for modal triggers
    document.addEventListener('click', this.handleTriggerClick.bind(this));
    
    // Setup ESC key handling
    document.addEventListener('keydown', this.handleEscKey.bind(this));
    
    // Setup hash change handling for direct modal opening
    window.addEventListener('hashchange', this.checkHashForModal.bind(this));
    
    // Check for hash on initial load
    this.checkHashForModal();
    
    // Setup public API
    (window as any).modalManager = {
      open: this.openModal.bind(this),
      close: this.closeModal.bind(this),
      closeAll: this.closeAllModals.bind(this)
    };
  }

  private handleTriggerClick(e: Event): void {
    const target = e.target as HTMLElement;
    const trigger = target.closest('[data-modal]') as HTMLElement;
    
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modalType = trigger.getAttribute('data-modal-type');
      
      if (modalId) {
        // For dynamic modals, we need to create them first
        if (modalType) {
          this.createDynamicModal(modalId, modalType);
        }
        this.openModal(modalId);
      }
    }
    
    // Handle close buttons
    const closeBtn = target.closest('[data-modal-close]') as HTMLElement;
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest('[data-modal-container]') as HTMLElement;
      if (modal) {
        this.closeModal(modal);
      } else {
        // For dynamically created modals
        const dynamicModal = closeBtn.closest('.modal') as HTMLElement;
        if (dynamicModal) {
          this.closeDynamicModal(dynamicModal);
        }
      }
    }
    
    // Handle overlay clicks
    const overlay = target.closest('.modal__overlay') as HTMLElement;
    if (overlay) {
      const modal = overlay.parentElement as HTMLElement;
      if (modal && modal.hasAttribute('data-modal-container')) {
        this.closeModal(modal);
      } else if (modal && modal.classList.contains('modal')) {
        this.closeDynamicModal(modal);
      }
    }
  }

  private handleEscKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.activeModal) {
      this.closeModal();
    }
  }

  /**
   * Open a modal by ID
   */
  openModal(modalId: string): void {
    // First check for declarative modals
    const modal = document.querySelector(`[data-modal-container="${modalId}"]`) as HTMLElement;
    if (modal) {
      this.activateModal(modal);
      return;
    }
    
    // Then check for dynamic modals
    const dynamicModal = document.querySelector(`.modal[data-dynamic-id="${modalId}"]`) as HTMLElement;
    if (dynamicModal) {
      this.activateModal(dynamicModal);
      return;
    }
    
    console.warn(`Modal with id "${modalId}" not found`);
  }

  /**
   * Activate a modal (both declarative and dynamic)
   */
  private activateModal(modal: HTMLElement): void {
    // Store the currently focused element
    this.focusedElementBeforeModal = document.activeElement as HTMLElement;

    // Open modal
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    this.activeModal = modal;

    // Focus management
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }

    // Trap focus within modal
    this.trapFocus(modal);

    // Fire custom event
    const modalId = modal.getAttribute('data-modal-container') || modal.getAttribute('data-dynamic-id') || '';
    modal.dispatchEvent(new CustomEvent('modal:opened', { detail: { modalId } }));
  }

  /**
   * Close a specific modal or the active modal
   */
  closeModal(modal?: HTMLElement): void {
    const targetModal = modal || this.activeModal;
    if (!targetModal) return;

    // Close modal
    targetModal.setAttribute('data-open', 'false');
    targetModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Restore focus
    if (this.focusedElementBeforeModal) {
      this.focusedElementBeforeModal.focus();
      this.focusedElementBeforeModal = null;
    }

    // Fire custom event
    const modalId = targetModal.getAttribute('data-modal-container') || targetModal.getAttribute('data-dynamic-id') || '';
    targetModal.dispatchEvent(new CustomEvent('modal:closed', { detail: { modalId } }));

    if (this.activeModal === targetModal) {
      this.activeModal = null;
    }
  }

  /**
   * Close a dynamically created modal
   */
  private closeDynamicModal(modal: HTMLElement): void {
    // Animate out
    modal.classList.remove('modal--visible');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      modal.remove();
      this.dynamicModals.delete(modal);
      
      // If this was the active modal, clear it
      if (this.activeModal === modal) {
        this.activeModal = null;
        document.body.classList.remove('modal-open');
      }
    }, 300);
  }

  /**
   * Close all modals
   */
  closeAllModals(): void {
    // Close declarative modals
    document.querySelectorAll('[data-modal-container]').forEach(modal => {
      const modalElement = modal as HTMLElement;
      modalElement.setAttribute('data-open', 'false');
      modalElement.setAttribute('aria-hidden', 'true');
    });
    
    // Remove dynamic modals
    this.dynamicModals.forEach(modal => {
      modal.remove();
    });
    this.dynamicModals.clear();
    
    document.body.classList.remove('modal-open');
    this.activeModal = null;
  }

  /**
   * Trap focus within a modal
   */
  private trapFocus(element: HTMLElement): void {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
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
  }

  /**
   * Create a dynamic modal based on type
   */
  private createDynamicModal(modalId: string, modalType: string): void {
    // Check if modal already exists
    const existingModal = document.querySelector(`.modal[data-dynamic-id="${modalId}"]`) as HTMLElement;
    if (existingModal) {
      return;
    }
    
    // Create new modal
    const modal = document.createElement('div');
    modal.className = 'modal modal--lead-magnet';
    modal.setAttribute('data-dynamic-id', modalId);
    
    const modalContent = this.getModalContent(modalType);
    if (!modalContent) return;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    this.dynamicModals.add(modal);
  }

  /**
   * Get modal content by type
   */
  private getModalContent(modalType: string): string {
    const modalTemplates: { [key: string]: string } = {
      consultation: `
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3 class="modal__title">Бесплатная консультация юриста</h3>
            <button class="modal__close" data-modal-close>&times;</button>
          </div>
          <div class="modal__body">
            <p class="modal__description">
              Получите персональную консультацию по вашей ситуации от опытного юриста по банкротству.
            </p>
            <form class="modal-form" data-form-type="consultation">
              <div class="form-group">
                <label class="form-label">Ваше имя</label>
                <input type="text" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Телефон</label>
                <input type="tel" name="phone" class="form-input" required placeholder="+7 (___) ___-__-__">
              </div>
              <div class="form-group">
                <label class="form-label">Удобное время для звонка</label>
                <select name="preferred_time" class="form-select">
                  <option value="">Выберите время</option>
                  <option value="morning">Утром (9:00 - 12:00)</option>
                  <option value="afternoon">Днем (12:00 - 17:00)</option>
                  <option value="evening">Вечером (17:00 - 21:00)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Краткое описание ситуации (необязательно)</label>
                <textarea name="situation" class="form-textarea" rows="3" placeholder="Опишите вашу ситуацию..."></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--block">
                Получить консультацию
              </button>
            </form>
          </div>
        </div>
      `,
      
      calculator: `
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3 class="modal__title">Калькулятор банкротства</h3>
            <button class="modal__close" data-modal-close>&times;</button>
          </div>
          <div class="modal__body">
            <form class="modal-form" data-form-type="calculator">
              <div class="form-group">
                <label class="form-label">Общая сумма долгов</label>
                <div class="range-value" id="debt-amount-display">500 000 ₽</div>
                <input 
                  type="range" 
                  name="debt_amount" 
                  class="form-range" 
                  min="100000" 
                  max="10000000" 
                  value="500000"
                  step="50000"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Количество кредиторов</label>
                <select name="creditors_count" class="form-select" required>
                  <option value="">Выберите количество</option>
                  <option value="1-3">1-3 кредитора</option>
                  <option value="4-7">4-7 кредиторов</option>
                  <option value="8+">8 и более кредиторов</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Наличие имущества</label>
                <select name="property" class="form-select" required>
                  <option value="">Выберите вариант</option>
                  <option value="none">Нет имущества</option>
                  <option value="apartment">Единственное жилье</option>
                  <option value="multiple">Несколько объектов</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ваше имя</label>
                <input type="text" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Телефон для получения результата</label>
                <input type="tel" name="phone" class="form-input" required placeholder="+7 (___) ___-__-__">
              </div>
              <button type="submit" class="btn btn--primary btn--block">
                Рассчитать стоимость
              </button>
            </form>
          </div>
        </div>
      `,
      
      'guide-download': `
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3 class="modal__title">Скачать гид по банкротству 2025</h3>
            <button class="modal__close" data-modal-close>&times;</button>
          </div>
          <div class="modal__body">
            <div class="guide-preview">
              <div class="guide-preview__features">
                <div class="guide-feature">
                  <span class="guide-feature__icon">📖</span>
                  <span class="guide-feature__text">47 страниц полезной информации</span>
                </div>
                <div class="guide-feature">
                  <span class="guide-feature__icon">⚖️</span>
                  <span class="guide-feature__text">Актуальные изменения в законах</span>
                </div>
                <div class="guide-feature">
                  <span class="guide-feature__icon">📄</span>
                  <span class="guide-feature__text">Шаблоны всех документов</span>
                </div>
              </div>
            </div>
            <form class="modal-form" data-form-type="guide">
              <div class="form-group">
                <label class="form-label">Ваше имя</label>
                <input type="text" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email для отправки гида</label>
                <input type="email" name="email" class="form-input" required placeholder="example@mail.com">
              </div>
              <button type="submit" class="btn btn--primary btn--block">
                Скачать гид бесплатно
              </button>
            </form>
          </div>
        </div>
      `,
      
      'checklist-download': `
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3 class="modal__title">Получить чек-лист должника</h3>
            <button class="modal__close" data-modal-close>&times;</button>
          </div>
          <div class="modal__body">
            <p class="modal__description">
              Пошаговый план подготовки к банкротству с 25 пунктами для проверки.
            </p>
            <form class="modal-form" data-form-type="checklist">
              <div class="form-group">
                <label class="form-label">Ваше имя</label>
                <input type="text" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-input" required>
              </div>
              <button type="submit" class="btn btn--primary btn--block">
                Получить чек-лист
              </button>
            </form>
          </div>
        </div>
      `,
      
      test: `
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3 class="modal__title">Тест на возможность банкротства</h3>
            <button class="modal__close" data-modal-close>&times;</button>
          </div>
          <div class="modal__body">
            <p class="modal__description">
              Пройдите тест из 10 вопросов и узнайте, подходит ли вам процедура банкротства.
            </p>
            <form class="modal-form" data-form-type="test">
              <div class="form-group">
                <label class="form-label">Сумма задолженности</label>
                <select name="debt" class="form-select" required>
                  <option value="">Выберите сумму</option>
                  <option value="less_300k">Менее 300 000 ₽</option>
                  <option value="300k_500k">300 000 - 500 000 ₽</option>
                  <option value="500k_1m">500 000 - 1 000 000 ₽</option>
                  <option value="more_1m">Более 1 000 000 ₽</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ваше имя</label>
                <input type="text" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Телефон</label>
                <input type="tel" name="phone" class="form-input" required>
              </div>
              <button type="submit" class="btn btn--primary btn--block">
                Получить результат теста
              </button>
            </form>
          </div>
        </div>
      `,
      
      emergency: `
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3 class="modal__title">Экстренная правовая помощь</h3>
            <button class="modal__close" data-modal-close>&times;</button>
          </div>
          <div class="modal__body">
            <div class="emergency-notice">
              <div class="emergency-notice__icon">🚨</div>
              <div class="emergency-notice__text">
                Экстренная консультация в течение 2 часов
              </div>
            </div>
            <form class="modal-form" data-form-type="emergency">
              <div class="form-group">
                <label class="form-label">Ваше имя</label>
                <input type="text" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Телефон</label>
                <input type="tel" name="phone" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Опишите срочную ситуацию</label>
                <textarea name="emergency_situation" class="form-textarea" rows="3" required 
                          placeholder="Коллекторы угрожают, арестованы счета, завтра суд..."></textarea>
              </div>
              <button type="submit" class="btn btn--danger btn--block">
                Получить помощь сейчас
              </button>
            </form>
          </div>
        </div>
      `
    };
    
    return modalTemplates[modalType] || '';
  }

  /**
   * Check URL hash for direct modal opening
   */
  private checkHashForModal(): void {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('modal-')) {
      const modalId = hash.replace('modal-', '');
      this.openModal(modalId);
    }
  }

  /**
   * Cleanup function
   */
  destroy(): void {
    document.removeEventListener('click', this.handleTriggerClick.bind(this));
    document.removeEventListener('keydown', this.handleEscKey.bind(this));
    window.removeEventListener('hashchange', this.checkHashForModal.bind(this));
    delete (window as any).modalManager;
  }
}

// Component to initialize the unified modal manager
export default function ModalManager() {
  useEffect(() => {
    const modalManager = new UnifiedModalManager();
    modalManager.init();
    
    // Cleanup function
    return () => {
      modalManager.destroy();
    };
  }, []);

  return null;
}