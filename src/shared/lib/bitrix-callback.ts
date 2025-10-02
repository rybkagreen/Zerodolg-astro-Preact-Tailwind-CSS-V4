// Bitrix Callback Widget Logic

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
  UF_CRM_1234567890: string;
}

interface CallTimeOptions {
  [key: string]: string;
}

export class BitrixCallback {
  private widget: HTMLElement | null = null;
  private button: HTMLElement | null = null;
  private popup: HTMLElement | null = null;
  private closeBtn: HTMLElement | null = null;
  private form: HTMLFormElement | null = null;
  private successState: HTMLElement | null = null;
  private webhookUrl: string | undefined;
  private sitePhone: string | undefined;

  constructor(bitrixWebhookUrl: string | undefined, sitePhone: string | undefined) {
    // If no webhook URL, don't initialize
    if (!bitrixWebhookUrl) {
      console.warn('BitrixCallback: No webhook URL provided, widget will not function');
      return;
    }

    this.webhookUrl = bitrixWebhookUrl;
    this.sitePhone = sitePhone;

    // Initialize after constructor to ensure properties are assigned
    this.init();
  }

  private initElements(): void {
    this.widget = document.querySelector('.bitrix-callback');
    this.button = document.querySelector('.bitrix-callback__button');
    this.popup = document.querySelector('.bitrix-callback__popup');
    this.closeBtn = document.querySelector('.bitrix-callback__close');
    this.form = document.querySelector('.bitrix-callback__form') as HTMLFormElement;
    this.successState = document.querySelector('.bitrix-callback__success');
  }

  init() {
    // Initialize elements
    this.initElements();

    // If no webhook URL, don't initialize
    if (!this.webhookUrl) {
      return;
    }

    // Show widget after hero section
    this.setupVisibilityTrigger();

    // Event listeners
    this.button?.addEventListener('click', () => this.togglePopup());
    this.closeBtn?.addEventListener('click', () => this.closePopup());
    this.form?.addEventListener('submit', (e: Event) => this.handleSubmit(e));

    // Close popup on outside click
    document.addEventListener('click', (e) => {
      if (!this.widget?.contains(e.target as Node)) {
        this.closePopup();
      }
    });

    // Phone mask
    this.setupPhoneMask();

    // Form validation
    this.setupValidation();
  }

  setupVisibilityTrigger() {
    // Find hero section
    const heroSection = document.querySelector('#hero, .hero, section:first-of-type');

    if (heroSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio < 0.1) {
              // Hero section is mostly out of view
              this.showWidget();
            }
          });
        },
        {
          threshold: [0, 0.1, 0.5, 1],
        }
      );

      observer.observe(heroSection);
    } else {
      // Fallback: show after scroll
      let scrolled = false;
      window.addEventListener('scroll', () => {
        if (!scrolled && window.scrollY > 300) {
          scrolled = true;
          this.showWidget();
        }
      });
    }
  }

  showWidget() {
    this.widget?.classList.add('bitrix-callback--visible');
    // Widget is now fixed to bottom-right, no need to adjust position
  }

  togglePopup() {
    const isActive = this.popup?.classList.contains('bitrix-callback__popup--active');
    if (isActive) {
      this.closePopup();
    } else {
      this.openPopup();
    }
  }

  openPopup() {
    this.popup?.classList.add('bitrix-callback__popup--active');

    // Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'callback_widget_opened', {
        event_category: 'engagement',
        event_label: 'bitrix_callback',
      });
    }
  }

  closePopup() {
    this.popup?.classList.remove('bitrix-callback__popup--active');
  }

  setupPhoneMask() {
    const phoneInput = document.getElementById('callback-phone') as HTMLInputElement;
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e: Event) => {
      const eventTarget = e.target as HTMLInputElement;
      let value = eventTarget.value.replace(/\D/g, '');

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

        eventTarget.value = formatted;
      }
    });
  }

  setupValidation() {
    const nameInput = document.getElementById('callback-name') as HTMLInputElement | null;
    const phoneInput = document.getElementById('callback-phone') as HTMLInputElement | null;

    nameInput?.addEventListener('blur', () => {
      if (nameInput && nameInput.value.trim().length < 2) {
        this.showError(nameInput, 'Введите ваше имя');
      } else {
        if (nameInput) this.hideError(nameInput);
      }
    });

    phoneInput?.addEventListener('blur', () => {
      if (phoneInput) {
        const cleaned = phoneInput.value.replace(/\D/g, '');
        if (cleaned.length < 11) {
          this.showError(phoneInput, 'Введите корректный номер телефона');
        } else {
          this.hideError(phoneInput);
        }
      }
    });
  }

  showError(input: HTMLElement, message: string) {
    const error = input.nextElementSibling;
    if (error) {
      error.textContent = message;
      error.classList.add('bitrix-callback__error--visible');
    }
    if (input instanceof HTMLElement) {
      (input as HTMLElement).style.borderColor = '#ef4444';
    }
  }

  hideError(input: HTMLElement) {
    const error = input.nextElementSibling;
    if (error) {
      error.classList.remove('bitrix-callback__error--visible');
    }
    if (input instanceof HTMLElement) {
      (input as HTMLElement).style.borderColor = '';
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();

    // If no webhook URL, don't submit
    if (!this.webhookUrl) {
      console.error('BitrixCallback: No webhook URL provided, cannot submit form');
      return;
    }

    if (!this.form) {
      console.error('BitrixCallback: Form element not found');
      return;
    }

    const formData = new FormData(this.form);
    const data: FormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      callTime: formData.get('callTime') as string,
      source: 'callback_widget',
      page: window.location.pathname,
    };

    // Validate
    if (!data.name || data.name.trim().length < 2) {
      const nameInput = document.getElementById('callback-name');
      if (nameInput) {
        this.showError(nameInput, 'Введите ваше имя');
      }
      return;
    }

    const cleanedPhone = data.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 11) {
      const phoneInput = document.getElementById('callback-phone');
      if (phoneInput) {
        this.showError(phoneInput, 'Введите корректный номер телефона');
      }
      return;
    }

    // Show loading state
    const submitBtn = this.form.querySelector('.bitrix-callback__submit') as HTMLButtonElement;
    const submitText = submitBtn?.querySelector('.bitrix-callback__submit-text');
    const submitLoader = submitBtn?.querySelector('.bitrix-callback__submit-loader');

    if (submitBtn) submitBtn.disabled = true;
    if (submitText && submitText instanceof HTMLElement) submitText.style.display = 'none';
    if (submitLoader && submitLoader instanceof HTMLElement) submitLoader.style.display = 'block';

    try {
      // Send to Bitrix24
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

      // Reset and close after delay
      setTimeout(() => {
        this.closePopup();
        if (this.form) {
          this.form.reset();
        }
        this.hideSuccess();
      }, 3000);
    } catch (error) {
      console.error('Error submitting callback form:', error);
      // Show user-friendly error message instead of alert
      console.error(`Произошла ошибка. Пожалуйста, позвоните нам: ${this.sitePhone}`);

      // Show error in UI instead of alert
      if (this.form) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bitrix-callback__error bitrix-callback__error--visible';
        errorDiv.textContent = 'Произошла ошибка отправки. Попробуйте еще раз или позвоните нам.';
        this.form.appendChild(errorDiv);

        setTimeout(() => {
          errorDiv.remove();
        }, 5000);
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText && submitText instanceof HTMLElement) submitText.style.display = 'block';
      if (submitLoader && submitLoader instanceof HTMLElement) submitLoader.style.display = 'none';
    }
  }

  async sendToBitrix24(data: FormData) {
    // If no webhook URL, don't send
    if (!this.webhookUrl) {
      throw new Error('No webhook URL provided');
    }

    // Create lead in Bitrix24
    const leadData: LeadData = {
      TITLE: `Обратный звонок: ${data.name}`,
      NAME: data.name,
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: `Виджет обратного звонка - ${data.page}`,
      COMMENTS: `Желаемое время звонка: ${this.getCallTimeText(data.callTime)}`,
      UF_CRM_1234567890: data.callTime, // Custom field for call time
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

  getCallTimeText(value: string) {
    const times: CallTimeOptions = {
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

  showSuccess() {
    if (this.form) this.form.style.display = 'none';
    if (this.successState) this.successState.style.display = 'block';
  }

  hideSuccess() {
    if (this.form) this.form.style.display = 'flex';
    if (this.successState) this.successState.style.display = 'none';
  }
}

// Initialize when DOM is ready
export function initBitrixCallback(
  bitrixWebhookUrl: string | undefined,
  sitePhone: string | undefined
) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new BitrixCallback(bitrixWebhookUrl, sitePhone);
    });
  } else {
    // DOM is already ready
    new BitrixCallback(bitrixWebhookUrl, sitePhone);
  }
}
