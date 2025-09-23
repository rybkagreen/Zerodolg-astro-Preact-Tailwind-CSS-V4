import { useEffect, useRef } from 'preact/hooks';
import { validateEmail, validatePhone, validateRequired } from '../../features/forms/model/form-utils';

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
    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        const result = validateField(input as HTMLInputElement);
        if (!result.isValid) {
          showFieldError(input as HTMLInputElement, result.errorMessage);
        } else {
          clearFieldError(input as HTMLInputElement);
        }
      });
      input.addEventListener('input', () => clearFieldError(input as HTMLInputElement));
    });

    return () => {
      form.removeEventListener('submit', handleSubmit);
      // Clean up mask instances
      maskInstances.current.clear();
    };
  }, [formId, formType]);

  // Form submission
  const submitForm = async (form: HTMLFormElement) => {
    const submitButton = form.querySelector('.form__submit') as HTMLButtonElement;
    const successMessage = form.querySelector('.form__success-message') as HTMLElement;

    // Show loading state
    submitButton?.classList.add('loading');
    submitButton?.setAttribute('disabled', 'true');

    try {
      const formData = new FormData(form);
      formData.append('formType', formType);
      formData.append('formId', formId);

      // Add UTM parameters if present
      const urlParams = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((param) => {
        const value = urlParams.get(param);
        if (value) {
          formData.append(param, value);
        }
      });

      const response = await fetch('/api/form', {
        method: 'POST',
        body: formData,
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
              form_id: formId,
            });
          }

          // Yandex Metrika
          if ((window as any).ym) {
            (window as any).ym(94567890, 'reachGoal', 'form_submit', {
              form_type: formType,
              form_id: formId,
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
      const errorMessage =
        error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже.';

      // Create or update error alert
      let errorAlert = form.querySelector('.form__alert') as HTMLElement;
      if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'form__alert form__alert--error';
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
