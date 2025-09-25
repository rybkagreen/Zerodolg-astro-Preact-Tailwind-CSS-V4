// Shared form utilities
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

export function createFormState(): FormState {
  return {
    isSubmitting: false,
    isSuccess: false,
    isError: false,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+7|8)[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
  return phoneRegex.test(phone);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

// Form utility functions for validation and masking
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

/**
 * Validate a single form field
 * @param field The input field to validate
 * @returns ValidationResult object with validation status and error message
 */
export function validateField(field: HTMLInputElement): ValidationResult {
  let isValid = true;
  let errorMessage = '';

  // Required field validation
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'Это поле обязательно для заполнения';
  }

  // Name validation
  else if (field.dataset.validate === 'name') {
    if (field.value.trim().length < 2) {
      isValid = false;
      errorMessage = 'Имя должно содержать минимум 2 символа';
    } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(field.value.trim())) {
      isValid = false;
      errorMessage = 'Имя может содержать только буквы';
    }
  }

  // Phone validation
  else if (field.type === 'tel') {
    const phoneNumber = field.value.replace(/\D/g, '');
    if (phoneNumber.length !== 11) {
      isValid = false;
      errorMessage = 'Введите корректный номер телефона';
    }
  }

  // Email validation
  else if (field.type === 'email' && field.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      isValid = false;
      errorMessage = 'Введите корректный email';
    }
  }

  // Checkbox validation
  else if (field.type === 'checkbox' && field.hasAttribute('required')) {
    if (!field.checked) {
      isValid = false;
      errorMessage = 'Необходимо согласие';
    }
  }

  return { isValid, errorMessage };
}

/**
 * Clear error state for a field
 * @param field The input field to clear error state for
 */
export function clearFieldError(field: HTMLInputElement): void {
  field.classList.remove('error');
  const errorElement = field.parentElement?.querySelector('.form__error') as HTMLElement;
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

/**
 * Show error state for a field
 * @param field The input field to show error for
 * @param errorMessage The error message to display
 */
export function showFieldError(field: HTMLInputElement, errorMessage: string): void {
  field.classList.add('error');
  const errorElement = field.parentElement?.querySelector('.form__error') as HTMLElement;
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add('show');
  }
}

/**
 * Validate entire form
 * @param form The form element to validate
 * @returns Boolean indicating if form is valid
 */
export function validateForm(form: HTMLFormElement): boolean {
  const fields = form.querySelectorAll('input[required], input[data-validate]');
  let isValid = true;

  fields.forEach((field) => {
    const result = validateField(field as HTMLInputElement);
    if (!result.isValid) {
      showFieldError(field as HTMLInputElement, result.errorMessage);
      isValid = false;
    } else {
      clearFieldError(field as HTMLInputElement);
    }
  });

  return isValid;
}

/**
 * Initialize phone mask for input fields
 * @param form The form element containing phone inputs
 */
export function initPhoneMask(form: HTMLFormElement): void {
  const phoneInputs = form.querySelectorAll('input[data-mask="phone"]');
  phoneInputs.forEach((input) => {
    const phoneInput = input as HTMLInputElement;

    phoneInput.addEventListener('input', () => {
      let value = phoneInput.value.replace(/\D/g, '');

      // Add +7 if not present
      if (value.length > 0 && !value.startsWith('7')) {
        value = '7' + value;
      }

      // Format the number
      let formatted = '';
      if (value.length > 0) {
        formatted = '+7';
        if (value.length > 1) {
          formatted += ' (' + value.substring(1, 4);
        }
        if (value.length >= 5) {
          formatted += ') ' + value.substring(4, 7);
        }
        if (value.length >= 8) {
          formatted += '-' + value.substring(7, 9);
        }
        if (value.length >= 10) {
          formatted += '-' + value.substring(9, 11);
        }
      }

      phoneInput.value = formatted;
    });

    phoneInput.addEventListener('keydown', (e) => {
      // Allow backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].includes(e.keyCode) ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey) ||
        (e.keyCode === 67 && e.ctrlKey) ||
        (e.keyCode === 86 && e.ctrlKey) ||
        (e.keyCode === 88 && e.ctrlKey)
      ) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Initialize currency mask for input fields
 * @param form The form element containing currency inputs
 */
export function initCurrencyMask(form: HTMLFormElement): void {
  const currencyInputs = form.querySelectorAll('input[data-mask="currency"]');
  currencyInputs.forEach((input) => {
    const currencyInput = input as HTMLInputElement;

    currencyInput.addEventListener('input', () => {
      const value = currencyInput.value.replace(/\D/g, '');

      if (value.length > 0) {
        // Format with spaces as thousand separators
        const formatted = parseInt(value).toLocaleString('ru-RU');
        currencyInput.value = formatted + ' руб';
      }
    });

    currencyInput.addEventListener('focus', () => {
      // Remove 'руб' suffix when focused
      currencyInput.value = currencyInput.value.replace(' руб', '');
    });

    currencyInput.addEventListener('blur', () => {
      // Add 'руб' suffix when blurred if there's a value
      if (currencyInput.value && !currencyInput.value.includes('руб')) {
        currencyInput.value += ' руб';
      }
    });
  });
}
