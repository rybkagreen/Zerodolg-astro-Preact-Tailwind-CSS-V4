// Bitrix Callback Widget for Astro HTML Structure

interface FormData {
  name: string;
  phone: string;
  callTime: string;
  source: string;
  page: string;
}

interface LeadData {
  TITLE: string;
  NAME: string;
  PHONE: { VALUE: string; VALUE_TYPE: string }[];
  SOURCE_ID: string;
  SOURCE_DESCRIPTION: string;
  COMMENTS: string;
}

export class BitrixCallbackWidget {
  private button: HTMLButtonElement | null = null;
  private popup: HTMLElement | null = null;
  private closeBtn: HTMLButtonElement | null = null;
  private form: HTMLFormElement | null = null;
  private successState: HTMLElement | null = null;
  private webhookUrl: string | undefined;
  private sitePhone: string | undefined;

  constructor(bitrixWebhookUrl: string | undefined, sitePhone: string | undefined) {
    this.webhookUrl = bitrixWebhookUrl;
    this.sitePhone = sitePhone || '+7 (905) 577-33-87';

    // Initialize after DOM is ready
    this.init();
  }

  private init(): void {
    // Find elements by the structure in the Astro component
    const container = document.querySelector('[aria-label="Виджет обратного звонка"]');
    if (!container) {
      console.warn('Bitrix callback widget container not found');
      return;
    }

    this.button = container.querySelector('button[aria-label="Заказать обратный звонок"]');
    this.popup = container.querySelector('.fixed.inset-0');
    this.closeBtn = this.popup?.querySelector('button[aria-label="Закрыть"]') as HTMLButtonElement;
    this.form = container.querySelector('#bitrix-callback-form') as HTMLFormElement;
    this.successState = container.querySelector('.success-state') as HTMLElement;

    if (!this.button || !this.popup || !this.form) {
      console.warn('Bitrix callback widget elements not found');
      return;
    }

    this.setupEventListeners();
    this.setupPhoneMask();
    this.setupValidation();
  }

  private setupEventListeners(): void {
    // Main button click
    this.button?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.openPopup();
    });

    // Close button click
    this.closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closePopup();
    });

    // Popup overlay click
    this.popup?.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.closePopup();
      }
    });

    // Form submission
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPopupOpen()) {
        this.closePopup();
      }
    });
  }

  private isPopupOpen(): boolean {
    return (
      this.popup?.style.visibility === 'visible' ||
      this.popup?.classList.contains('popup-open') ||
      false
    );
  }

  private openPopup(): void {
    if (!this.popup) return;

    this.popup.style.visibility = 'visible';
    this.popup.style.opacity = '1';
    this.popup.setAttribute('aria-hidden', 'false');

    // Focus first input
    const firstInput = this.form?.querySelector('input') as HTMLInputElement;
    firstInput?.focus();

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'callback_widget_opened', {
        event_category: 'engagement',
        event_label: 'bitrix_callback',
      });
    }
  }

  private closePopup(): void {
    if (!this.popup) return;

    this.popup.style.visibility = 'hidden';
    this.popup.style.opacity = '0';
    this.popup.setAttribute('aria-hidden', 'true');

    // Restore body scrolling
    document.body.style.overflow = '';

    // Reset form if not in success state
    if (this.successState?.style.display !== 'block') {
      this.form?.reset();
      this.clearErrors();
    }
  }

  private setupPhoneMask(): void {
    const phoneInput = document.getElementById('callback-phone') as HTMLInputElement;
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      let value = target.value.replace(/\D/g, '');

      if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
          value = value.substring(1);
        }

        let formatted = '+7';
        if (value.length > 0) {
          formatted += ` (${value.substring(0, 3)}`;
        }
        if (value.length >= 4) {
          formatted += `) ${value.substring(3, 6)}`;
        }
        if (value.length >= 7) {
          formatted += `-${value.substring(6, 8)}`;
        }
        if (value.length >= 9) {
          formatted += `-${value.substring(8, 10)}`;
        }

        target.value = formatted;
      }
    });
  }

  private setupValidation(): void {
    const nameInput = document.getElementById('callback-name') as HTMLInputElement;
    const phoneInput = document.getElementById('callback-phone') as HTMLInputElement;

    nameInput?.addEventListener('blur', () => {
      if (nameInput.value.trim().length < 2) {
        this.showError(nameInput, 'Введите ваше имя');
      } else {
        this.hideError(nameInput);
      }
    });

    phoneInput?.addEventListener('blur', () => {
      const cleaned = phoneInput.value.replace(/\D/g, '');
      if (cleaned.length < 11) {
        this.showError(phoneInput, 'Введите корректный номер телефона');
      } else {
        this.hideError(phoneInput);
      }
    });
  }

  private showError(input: HTMLInputElement, message: string): void {
    const errorElement = input.nextElementSibling as HTMLElement;
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    input.style.borderColor = '#ef4444';
  }

  private hideError(input: HTMLInputElement): void {
    const errorElement = input.nextElementSibling as HTMLElement;
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    input.style.borderColor = '';
  }

  private clearErrors(): void {
    const inputs = this.form?.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    inputs?.forEach((input) => this.hideError(input));
  }

  private async handleSubmit(): Promise<void> {
    if (!this.form) return;

    const formData = new FormData(this.form);
    const data: FormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      callTime: formData.get('callTime') as string,
      source: 'callback_widget',
      page: window.location.pathname,
    };

    // Validate
    let hasErrors = false;

    if (!data.name || data.name.trim().length < 2) {
      this.showError(
        document.getElementById('callback-name') as HTMLInputElement,
        'Введите ваше имя'
      );
      hasErrors = true;
    }

    const cleanedPhone = data.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 11) {
      this.showError(
        document.getElementById('callback-phone') as HTMLInputElement,
        'Введите корректный номер телефона'
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const submitText = submitBtn?.querySelector('.submit-text') as HTMLElement;
    const submitLoader = submitBtn?.querySelector('.submit-loader') as HTMLElement;

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitLoader) {
      submitLoader.style.display = 'inline-block';
      submitLoader.classList.remove('hidden');
    }

    try {
      // Send to Bitrix24 if webhook URL is available
      if (this.webhookUrl) {
        await this.sendToBitrix24(data);
      }

      // Show success state
      this.showSuccess();

      // Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'callback_form_submitted', {
          event_category: 'lead',
          event_label: 'bitrix_callback',
        });
      }

      // Close after delay
      setTimeout(() => {
        this.closePopup();
        this.hideSuccess();
        this.form?.reset();
      }, 3000);
    } catch (error) {
      console.error('Error submitting callback form:', error);

      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-red-500 text-sm mt-2 p-2 bg-red-50 rounded';
      errorDiv.textContent = `Произошла ошибка отправки. Пожалуйста, позвоните нам: ${this.sitePhone}`;
      this.form.appendChild(errorDiv);

      setTimeout(() => {
        errorDiv.remove();
      }, 5000);
    } finally {
      // Restore button state
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.style.display = 'inline';
      if (submitLoader) {
        submitLoader.style.display = 'none';
        submitLoader.classList.add('hidden');
      }
    }
  }

  private async sendToBitrix24(data: FormData): Promise<unknown> {
    if (!this.webhookUrl) {
      throw new Error('No webhook URL provided');
    }

    const leadData: LeadData = {
      TITLE: `Обратный звонок: ${data.name}`,
      NAME: data.name,
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: `Виджет обратного звонка - ${data.page}`,
      COMMENTS: `Желаемое время звонка: ${this.getCallTimeText(data.callTime)}`,
    };

    const response = await fetch(`${this.webhookUrl}crm.lead.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: leadData,
        params: { REGISTER_SONET_EVENT: 'Y' },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create lead in Bitrix24');
    }

    return response.json();
  }

  private getCallTimeText(value: string): string {
    const times: { [key: string]: string } = {
      now: 'Сейчас',
      '15min': 'Через 15 минут',
      '30min': 'Через 30 минут',
      '1hour': 'Через час',
      morning: 'Утром (9:00-12:00)',
      afternoon: 'Днем (12:00-18:00)',
      evening: 'Вечером (18:00-21:00)',
    };
    return times[value] || value;
  }

  private showSuccess(): void {
    if (this.form) this.form.style.display = 'none';
    if (this.successState) {
      this.successState.style.display = 'block';
      this.successState.classList.remove('hidden');
    }
  }

  private hideSuccess(): void {
    if (this.form) this.form.style.display = 'block';
    if (this.successState) {
      this.successState.style.display = 'none';
      this.successState.classList.add('hidden');
    }
  }
}
