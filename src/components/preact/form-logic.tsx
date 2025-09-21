import { useEffect, useRef } from 'preact/hooks';

interface FormProps {
  formId: string;
  formType: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Form({ formId, formType, onSuccess, onError }: FormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const maskInstances = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;
    
    formRef.current = form;

    // Initialize phone mask
    initPhoneMask(form);
    
    // Initialize currency mask
    initCurrencyMask(form);
    
    // Form validation and submission
    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      
      if (!validateForm(form)) {
        return;
      }
      
      await submitForm(form);
    };
    
    form.addEventListener('submit', handleSubmit);
    
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input[required], input[data-validate]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input as HTMLInputElement));
      input.addEventListener('input', () => clearFieldError(input as HTMLInputElement));
    });
    
    return () => {
      form.removeEventListener('submit', handleSubmit);
      // Clean up mask instances
      maskInstances.current.clear();
    };
  }, [formId, formType]);

  // Phone mask initialization
  const initPhoneMask = (form: HTMLFormElement) => {
    const phoneInputs = form.querySelectorAll('input[data-mask="phone"]');
    phoneInputs.forEach(input => {
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
        if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey) ||
            (e.keyCode === 67 && e.ctrlKey) ||
            (e.keyCode === 86 && e.ctrlKey) ||
            (e.keyCode === 88 && e.ctrlKey)) {
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      });
    });
  };

  // Currency mask initialization
  const initCurrencyMask = (form: HTMLFormElement) => {
    const currencyInputs = form.querySelectorAll('input[data-mask="currency"]');
    currencyInputs.forEach(input => {
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
  };

  // Field validation
  const validateField = (field: HTMLInputElement): boolean => {
    const errorElement = field.parentElement?.querySelector('.universal-form__error') as HTMLElement;
    if (!errorElement) return true;
    
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
    
    // Update UI
    if (!isValid) {
      field.classList.add('error');
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    } else {
      field.classList.remove('error');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
    
    return isValid;
  };

  // Clear field error
  const clearFieldError = (field: HTMLInputElement) => {
    field.classList.remove('error');
    const errorElement = field.parentElement?.querySelector('.universal-form__error') as HTMLElement;
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  };

  // Form validation
  const validateForm = (form: HTMLFormElement): boolean => {
    const fields = form.querySelectorAll('input[required], input[data-validate]');
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field as HTMLInputElement)) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  // Form submission
  const submitForm = async (form: HTMLFormElement) => {
    const submitButton = form.querySelector('.universal-form__submit') as HTMLButtonElement;
    const successMessage = form.querySelector('.universal-form__success') as HTMLElement;
    
    // Show loading state
    submitButton?.classList.add('loading');
    submitButton?.setAttribute('disabled', 'true');
    
    try {
      const formData = new FormData(form);
      formData.append('formType', formType);
      formData.append('formId', formId);
      
      // Add UTM parameters if present
      const urlParams = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const value = urlParams.get(param);
        if (value) {
          formData.append(param, value);
        }
      });
      
      const response = await fetch('/api/form', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        form.style.display = 'none';
        successMessage?.classList.add('show');
        
        // Track event in analytics
        if (typeof window !== 'undefined') {
          // Google Analytics
          if ((window as any).gtag) {
            (window as any).gtag('event', 'form_submit', {
              form_type: formType,
              form_id: formId
            });
          }
          
          // Yandex Metrika
          if ((window as any).ym) {
            (window as any).ym(94567890, 'reachGoal', 'form_submit', {
              form_type: formType,
              form_id: formId
            });
          }
        }
        
        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
        
        // Reset form after 5 seconds
        setTimeout(() => {
          form.style.display = '';
          successMessage?.classList.remove('show');
          form.reset();
        }, 5000);
      } else {
        throw new Error(result.error || 'Ошибка отправки формы');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже.';
      
      // Create or update error alert
      let errorAlert = form.querySelector('.universal-form__alert') as HTMLElement;
      if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'universal-form__alert universal-form__alert--error';
        form.insertBefore(errorAlert, form.firstChild);
      }
      errorAlert.textContent = errorMessage;
      errorAlert.style.display = 'block';
      
      // Hide error after 5 seconds
      setTimeout(() => {
        errorAlert.style.display = 'none';
      }, 5000);
      
      // Call error callback
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      // Remove loading state
      submitButton?.classList.remove('loading');
      submitButton?.removeAttribute('disabled');
    }
  };

  return null; // This component doesn't render anything
}