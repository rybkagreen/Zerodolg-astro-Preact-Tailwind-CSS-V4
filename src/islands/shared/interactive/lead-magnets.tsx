import { type VNode } from 'preact';
import { useEffect } from 'preact/hooks';

export default function LeadMagnets({}: { data?: Record<string, unknown> }): VNode | null {
  useEffect(() => {
    // Button click handlers
    const buttons = document.querySelectorAll('button[data-modal]');
    if (!buttons) return;

    const handleButtonClick = (e: Event) => {
      e.preventDefault();
      const button = e.currentTarget as HTMLElement;
      const modalType = button.getAttribute('data-modal');
      const trackEvent = button.getAttribute('data-track');

      if (modalType) {
        openModal(modalType);
      }

      if (trackEvent) {
        trackAnalytics(trackEvent, { modal_type: modalType });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', handleButtonClick);
    });

    // Modal functionality
    function openModal(modalType: string) {
      const modal = createModal(modalType);
      if (!modal) return;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      // Animate in
      requestAnimationFrame(() => {
        modal.classList.add('modal--visible');
      });

      // Setup close handlers
      const closeBtn = modal.querySelector('[data-modal-close]');
      const overlay = modal.querySelector('.modal__overlay');

      const closeModal = () => {
        modal.classList.remove('modal--visible');
        document.body.style.overflow = '';
        setTimeout(() => {
          modal.remove();
        }, 300);
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      if (overlay) {
        overlay.addEventListener('click', closeModal);
      }

      // Escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', handleEscape);
        }
      };

      document.addEventListener('keydown', handleEscape);

      // Form handler
      const form = modal.querySelector('form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await handleFormSubmit(form, modalType);
        });
      }

      // Range input handler for calculator
      const rangeInput = modal.querySelector('input[type="range"]');
      if (rangeInput) {
        const display = modal.querySelector('#lead-debt-amount-display');
        rangeInput.addEventListener('input', (e) => {
          const value = parseInt((e.target as HTMLInputElement).value);
          if (display) {
            display.textContent = formatCurrency(value);
          }
        });
      }
    }

    function createModal(modalType: string): HTMLElement | null {
      const modal = document.createElement('div');
      modal.className = 'modal modal--lead-magnet';

      const modalContent = getModalContent(modalType);
      if (!modalContent) return null;

      modal.innerHTML = modalContent;
      return modal;
    }

    function getModalContent(modalType: string): string {
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
                  <label for="lead-consultation-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-consultation-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-consultation-phone" class="form-label">Телефон</label>
                  <input type="tel" id="lead-consultation-phone" name="phone" class="form-input" required placeholder="+7 (___) ___-__-__" autocomplete="tel">
                </div>
                <div class="form-group">
                  <label for="lead-consultation-time" class="form-label">Удобное время для звонка</label>
                  <select id="lead-consultation-time" name="preferred_time" class="form-select" autocomplete="off">
                    <option value="">Выберите время</option>
                    <option value="morning">Утром (9:00 - 12:00)</option>
                    <option value="afternoon">Днем (12:00 - 17:00)</option>
                    <option value="evening">Вечером (17:00 - 21:00)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="lead-consultation-situation" class="form-label">Краткое описание ситуации (необязательно)</label>
                  <textarea id="lead-consultation-situation" name="situation" class="form-textarea" rows="3" placeholder="Опишите вашу ситуацию..." autocomplete="off"></textarea>
                </div>
                <button type="submit" class="btn btn--primary btn--block">
                  Готов к консультации? Нажми здесь!
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
                  <label for="lead-calculator-debt" class="form-label">Общая сумма долгов</label>
                  <div class="range-value" id="lead-debt-amount-display">500 000 ₽</div>
                  <input 
                    type="range" 
                    id="lead-calculator-debt"
                    name="debt_amount" 
                    class="form-range" 
                    min="100000" 
                    max="10000000" 
                    value="500000"
                    step="50000"
                    autocomplete="off"
                  >
                </div>
                <div class="form-group">
                  <label for="lead-calculator-creditors" class="form-label">Количество кредиторов</label>
                  <select id="lead-calculator-creditors" name="creditors_count" class="form-select" required autocomplete="off">
                    <option value="">Выберите количество</option>
                    <option value="1-3">1-3 кредитора</option>
                    <option value="4-7">4-7 кредиторов</option>
                    <option value="8+">8 и более кредиторов</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="lead-calculator-property" class="form-label">Наличие имущества</label>
                  <select id="lead-calculator-property" name="property" class="form-select" required autocomplete="off">
                    <option value="">Выберите вариант</option>
                    <option value="none">Нет имущества</option>
                    <option value="apartment">Квартира</option>
                    <option value="house">Дом</option>
                    <option value="car">Автомобиль</option>
                    <option value="multiple">Несколько объектов</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="lead-calculator-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-calculator-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-calculator-phone" class="form-label">Телефон для получения результата</label>
                  <input type="tel" id="lead-calculator-phone" name="phone" class="form-input" required placeholder="+7 (___) ___-__-__" autocomplete="tel">
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
                  <label for="lead-guide-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-guide-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-guide-email" class="form-label">Email для отправки гида</label>
                  <input type="email" id="lead-guide-email" name="email" class="form-input" required placeholder="example@mail.com" autocomplete="email">
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
                  <label for="lead-checklist-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-checklist-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-checklist-email" class="form-label">Email</label>
                  <input type="email" id="lead-checklist-email" name="email" class="form-input" required autocomplete="email">
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
                  <label for="lead-test-debt" class="form-label">Сумма задолженности</label>
                  <select id="lead-test-debt" name="debt" class="form-select" required autocomplete="off">
                    <option value="">Выберите сумму</option>
                    <option value="less_300k">Менее 300 000 ₽</option>
                    <option value="300k_500k">300 000 - 500 000 ₽</option>
                    <option value="500k_1m">500 000 - 1 000 000 ₽</option>
                    <option value="more_1m">Более 1 000 000 ₽</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="lead-test-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-test-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-test-phone" class="form-label">Телефон</label>
                  <input type="tel" id="lead-test-phone" name="phone" class="form-input" required autocomplete="tel">
                </div>
                <button type="submit" class="btn btn--primary btn--block">
                  Получить результат теста
                </button>
              </form>
            </div>
          </div>
        `,

        'webinar-registration': `
          <div class="modal__overlay"></div>
          <div class="modal__container">
            <div class="modal__header">
              <h3 class="modal__title">Регистрация на вебинар</h3>
              <button class="modal__close" data-modal-close>&times;</button>
            </div>
            <div class="modal__body">
              <div class="webinar-info">
                <div class="webinar-info__schedule">
                  <strong>📅 Каждый четверг в 19:00 МСК</strong>
                </div>
                <p class="modal__description">
                  "Банкротство без ошибок" — живой вебинар с разбором реальных кейсов и ответами на ваши вопросы.
                </p>
              </div>
              <form class="modal-form" data-form-type="webinar">
                <div class="form-group">
                  <label for="lead-webinar-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-webinar-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-webinar-email" class="form-label">Email для получения ссылки</label>
                  <input type="email" id="lead-webinar-email" name="email" class="form-input" required autocomplete="email">
                </div>
                <div class="form-group">
                  <label for="lead-webinar-phone" class="form-label">Телефон (необязательно)</label>
                  <input type="tel" id="lead-webinar-phone" name="phone" class="form-input" autocomplete="tel">
                </div>
                <button type="submit" class="btn btn--primary btn--block">
                  Записаться на вебинар
                </button>
              </form>
            </div>
          </div>
        `,

        assessment: `
          <div class="modal__overlay"></div>
          <div class="modal__container">
            <div class="modal__header">
              <h3 class="modal__title">Экспресс-оценка дела</h3>
              <button class="modal__close" data-modal-close>&times;</button>
            </div>
            <div class="modal__body">
              <div class="assessment-info">
                <div class="assessment-info__badge">
                  <span>⚡ Результат через 24 часа</span>
                </div>
                <p class="modal__description">
                  Получите предварительную оценку перспектив вашего дела от опытных юристов. Анализ проводится бесплатно и конфиденциально.
                </p>
              </div>
              <form class="modal-form" data-form-type="assessment">
                <div class="form-group">
                  <label for="lead-assessment-name" class="form-label">Ваше имя</label>
                  <input type="text" id="lead-assessment-name" name="name" class="form-input" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="lead-assessment-phone" class="form-label">Телефон</label>
                  <input type="tel" id="lead-assessment-phone" name="phone" class="form-input" required autocomplete="tel">
                </div>
                <div class="form-group">
                  <label for="lead-assessment-debt" class="form-label">Примерная сумма долгов</label>
                  <select id="lead-assessment-debt" name="debt_amount" class="form-select" required autocomplete="off">
                    <option value="">Выберите сумму</option>
                    <option value="less_500k">Менее 500 000 ₽</option>
                    <option value="500k_1m">500 000 - 1 000 000 ₽</option>
                    <option value="1m_3m">1 - 3 млн ₽</option>
                    <option value="more_3m">Более 3 млн ₽</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="lead-assessment-situation" class="form-label">Краткое описание ситуации</label>
                  <textarea id="lead-assessment-situation" name="situation" class="form-textarea" rows="3" 
                            placeholder="Опишите вашу финансовую ситуацию..." autocomplete="off"></textarea>
                </div>
                <button type="submit" class="btn btn--primary btn--block">
                  Получить оценку бесплатно
                </button>
              </form>
            </div>
          </div>
        `,
      };

      return modalTemplates[modalType] || '';
    }

    async function handleFormSubmit(form: HTMLFormElement, modalType: string) {
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';

      try {
        // Collect form data - will be sent to API when implemented
        // const formData = new FormData(form);
        // const data = Object.fromEntries(formData.entries());
        // await fetch('/api/form', { method: 'POST', body: JSON.stringify(data) });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show success message
        showSuccessMessage(form, modalType);

        // Track event
        trackAnalytics('form_submitted', { form_type: modalType });
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Form submission error:', error);
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }

    function showSuccessMessage(form: HTMLFormElement, formType: string) {
      const modalBody = form.closest('.modal__body');
      if (!modalBody) return;

      const messages: { [key: string]: string } = {
        consultation: 'Наш специалист свяжется с вами в течение 15 минут',
        calculator: 'Расчет отправлен на указанный номер телефона',
        guide: 'Гид отправлен на вашу электронную почту',
        checklist: 'Чек-лист отправлен на вашу почту',
        webinar: 'Ссылка на вебинар отправлена на вашу почту',
        assessment: 'Заявка принята. Оценка будет готова через 24 часа',
      };

      modalBody.innerHTML = `
        <div class="success-message">
          <div class="success-message__icon">✅</div>
          <h3 class="success-message__title">Заявка отправлена!</h3>
          <p class="success-message__text">
            ${messages[formType] || 'Мы свяжемся с вами в ближайшее время'}
          </p>
          <button class="btn btn--primary" data-modal-close>
            Закрыть
          </button>
        </div>
      `;

      const closeBtn = modalBody.querySelector('[data-modal-close]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const modal = modalBody.closest('.modal');
          if (modal) {
            modal.classList.remove('modal--visible');
            document.body.style.overflow = '';
            setTimeout(() => {
              modal.remove();
            }, 300);
          }
        });
      }
    }

    function formatCurrency(amount: number): string {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(amount);
    }

    function trackAnalytics(eventName: string, data: Record<string, unknown>) {
      const win = window as typeof window & {
        gtag?: (command: string, ...args: unknown[]) => void;
        ym?: (id: number, command: string, ...args: unknown[]) => void;
      };

      // Google Analytics
      if (typeof window !== 'undefined' && win.gtag) {
        win.gtag('event', eventName, {
          event_category: 'Lead Magnets',
          ...data,
        });
      }

      // Yandex Metrica
      if (typeof window !== 'undefined' && win.ym) {
        win.ym(103604926, 'reachGoal', eventName, data);
      }
    }

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .modal--lead-magnet {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10001;
      }
      
      .modal--lead-magnet.modal--visible {
        opacity: 1;
      }
      
      .modal__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }
      
      .modal__container {
        background: var(--color-white, #ffffff);
        border-radius: var(--radius-xl, 1rem);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        position: relative;
        z-index: 1;
      }
      
      .modal--visible .modal__container {
        transform: scale(1);
      }
      
      .modal__header {
        padding: var(--space-xl, 2rem);
        border-bottom: 1px solid var(--color-border-light, #e2e8f0);
        position: relative;
      }
      
      .modal__title {
        font-size: var(--text-xl, 1.25rem);
        font-weight: var(--font-bold, 700);
        color: var(--color-text, #1f2937);
        margin: 0;
        line-height: 1.3;
      }
      
      .modal__close {
        position: absolute;
        top: var(--space-lg, 1.5rem);
        right: var(--space-lg, 1.5rem);
        background: none;
        border: none;
        font-size: var(--text-2xl, 1.5rem);
        cursor: pointer;
        color: var(--color-text-muted, #64748b);
        transition: color 0.2s ease;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      
      .modal__close:hover {
        color: var(--color-text, #1f2937);
        background: var(--color-bg-muted, #f1f5f9);
      }
      
      .modal__body {
        padding: var(--space-xl, 2rem);
      }
      
      .modal__description {
        font-size: var(--text-base, 1rem);
        color: var(--color-text-secondary, #64748b);
        margin-bottom: var(--space-lg, 1.5rem);
        line-height: 1.6;
      }
      
      .form-group {
        margin-bottom: var(--space-lg, 1.5rem);
      }
      
      .form-label {
        display: block;
        font-weight: var(--font-semibold, 600);
        color: var(--color-text, #1f2937);
        margin-bottom: var(--space-sm, 0.5rem);
        font-size: var(--text-sm, 0.875rem);
      }
      
      .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: var(--space-md, 1rem);
        border: 2px solid var(--color-border-light, #e2e8f0);
        border-radius: var(--radius-lg, 0.75rem);
        font-size: var(--text-base, 1rem);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        background: var(--color-white, #ffffff);
      }
      
      .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: var(--color-primary, #2563eb);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
      
      .form-textarea {
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
      }
      
      .form-range {
        width: 100%;
        height: 8px;
        border-radius: var(--radius, 0.25rem);
        background: var(--color-bg-muted, #f1f5f9);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
      }
      
      .form-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--color-primary, #2563eb);
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        transition: transform 0.2s ease;
      }
      
      .form-range::-webkit-slider-thumb:hover {
        transform: scale(1.1);
      }
      
      .range-value {
        font-weight: var(--font-bold, 700);
        color: var(--color-primary, #2563eb);
        font-size: var(--text-lg, 1.125rem);
        margin-bottom: var(--space-sm, 0.5rem);
        text-align: center;
        padding: var(--space-xs, 0.5rem);
        background: rgba(37, 99, 235, 0.1);
        border-radius: var(--radius-md, 0.5rem);
      }
      
      .btn--block {
        width: 100%;
      }
      
      .btn--danger {
        background: var(--color-error, #ef4444);
        color: var(--color-white, #ffffff);
      }
      
      .btn--danger:hover {
        background: var(--color-error-dark, #dc2626);
      }
      
      .success-message, .emergency-notice {
        text-align: center;
        padding: var(--space-xl, 2rem);
      }
      
      .success-message__icon, .emergency-notice__icon {
        font-size: 4rem;
        margin-bottom: var(--space-md, 1rem);
        display: block;
      }
      
      .success-message__title, .emergency-notice__text {
        font-size: var(--text-xl, 1.25rem);
        font-weight: var(--font-bold, 700);
        color: var(--color-text, #1f2937);
        margin-bottom: var(--space-md, 1rem);
      }
      
      .success-message__text {
        color: var(--color-text-secondary, #64748b);
        margin-bottom: var(--space-xl, 2rem);
        font-size: var(--text-base, 1rem);
        line-height: 1.6;
      }
      
      .emergency-notice {
        background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05));
        border: 2px solid var(--color-error, #dc2626);
        border-radius: var(--radius-lg, 0.75rem);
        margin-bottom: var(--space-lg, 1.5rem);
      }
      
      .guide-preview__features {
        display: grid;
        gap: var(--space-md, 1rem);
        margin-bottom: var(--space-lg, 1.5rem);
      }
      
      .guide-feature {
        display: flex;
        align-items: center;
        gap: var(--space-md, 1rem);
        padding: var(--space-md, 1rem);
        background: var(--color-bg-secondary, #f1f5f9);
        border-radius: var(--radius-md, 0.5rem);
      }
      
      .guide-feature__icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      
      .guide-feature__text {
        font-size: var(--text-sm, 0.875rem);
        color: var(--color-text-secondary, #64748b);
      }
      
      @media (max-width: 768px) {
        .modal__container {
          width: 95%;
          margin: var(--space-lg, 1.5rem);
        }
        
        .modal__header, .modal__body {
          padding: var(--space-lg, 1.5rem);
        }
        
        .modal__title {
          font-size: var(--text-lg, 1.125rem);
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      if (buttons) {
        buttons.forEach((button) => {
          button.removeEventListener('click', handleButtonClick);
        });
      }
    };
  }, []);

  return null;
}
