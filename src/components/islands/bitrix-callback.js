// Bitrix Callback Widget Logic
export class BitrixCallback {
  constructor(bitrixWebhookUrl, sitePhone) {
    // If no webhook URL, don't initialize
    if (!bitrixWebhookUrl) {
      console.warn('BitrixCallback: No webhook URL provided, widget will not function');
      return;
    }

    this.widget = document.querySelector('.bitrix-callback');
    this.button = document.querySelector('.bitrix-callback__button');
    this.popup = document.querySelector('.bitrix-callback__popup');
    this.closeBtn = document.querySelector('.bitrix-callback__close');
    this.form = document.querySelector('.bitrix-callback__form');
    this.successState = document.querySelector('.bitrix-callback__success');
    this.webhookUrl = bitrixWebhookUrl;
    this.sitePhone = sitePhone;

    this.init();
  }

  init() {
    // If no webhook URL, don't initialize
    if (!this.webhookUrl) {
      return;
    }

    // Show widget after hero section
    this.setupVisibilityTrigger();

    // Event listeners
    this.button?.addEventListener('click', () => this.togglePopup());
    this.closeBtn?.addEventListener('click', () => this.closePopup());
    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));

    // Close popup on outside click
    document.addEventListener('click', (e) => {
      if (!this.widget?.contains(e.target)) {
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
    if (typeof gtag !== 'undefined') {
      gtag('event', 'callback_widget_opened', {
        event_category: 'engagement',
        event_label: 'bitrix_callback',
      });
    }
  }

  closePopup() {
    this.popup?.classList.remove('bitrix-callback__popup--active');
  }

  setupPhoneMask() {
    const phoneInput = document.getElementById('callback-phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
          value = value.substring(1);
        }

        let formatted = '+7';
        if (value.length > 0) {
          formatted += ' (' + value.substring(0, 3);
        }
        if (value.length >= 4) {
          formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
          formatted += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
          formatted += '-' + value.substring(8, 10);
        }

        e.target.value = formatted;
      }
    });
  }

  setupValidation() {
    const nameInput = document.getElementById('callback-name');
    const phoneInput = document.getElementById('callback-phone');

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

  showError(input, message) {
    const error = input.nextElementSibling;
    if (error) {
      error.textContent = message;
      error.classList.add('bitrix-callback__error--visible');
    }
    input.style.borderColor = '#ef4444';
  }

  hideError(input) {
    const error = input.nextElementSibling;
    if (error) {
      error.classList.remove('bitrix-callback__error--visible');
    }
    input.style.borderColor = '';
  }

  async handleSubmit(e) {
    e.preventDefault();

    // If no webhook URL, don't submit
    if (!this.webhookUrl) {
      console.error('BitrixCallback: No webhook URL provided, cannot submit form');
      return;
    }

    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      callTime: formData.get('callTime'),
      source: 'callback_widget',
      page: window.location.pathname,
    };

    // Validate
    if (!data.name || data.name.trim().length < 2) {
      this.showError(document.getElementById('callback-name'), 'Введите ваше имя');
      return;
    }

    const cleanedPhone = data.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 11) {
      this.showError(
        document.getElementById('callback-phone'),
        'Введите корректный номер телефона'
      );
      return;
    }

    // Show loading state
    const submitBtn = this.form.querySelector('.bitrix-callback__submit');
    const submitText = submitBtn?.querySelector('.bitrix-callback__submit-text');
    const submitLoader = submitBtn?.querySelector('.bitrix-callback__submit-loader');

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = 'none';
    if (submitLoader) submitLoader.style.display = 'block';

    try {
      // Send to Bitrix24
      if (this.webhookUrl) {
        await this.sendToBitrix24(data);
      }

      // Show success state
      this.showSuccess();

      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'callback_form_submitted', {
          event_category: 'lead',
          event_label: 'bitrix_callback',
        });
      }

      // Reset and close after delay
      setTimeout(() => {
        this.closePopup();
        this.form.reset();
        this.hideSuccess();
      }, 3000);
    } catch (error) {
      console.error('Error submitting callback form:', error);
      alert(`Произошла ошибка. Пожалуйста, позвоните нам: ${this.sitePhone}`);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.style.display = 'block';
      if (submitLoader) submitLoader.style.display = 'none';
    }
  }

  async sendToBitrix24(data) {
    // If no webhook URL, don't send
    if (!this.webhookUrl) {
      throw new Error('No webhook URL provided');
    }

    // Create lead in Bitrix24
    const leadData = {
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

  getCallTimeText(value) {
    const times = {
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
export function initBitrixCallback(bitrixWebhookUrl, sitePhone) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new BitrixCallback(bitrixWebhookUrl, sitePhone);
    });
  } else {
    // DOM is already ready
    new BitrixCallback(bitrixWebhookUrl, sitePhone);
  }
}
