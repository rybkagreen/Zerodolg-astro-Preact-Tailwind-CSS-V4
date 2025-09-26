import { useState } from 'preact/hooks';
import type { FormConfig, FormField } from '../../types/form';
import type { JSX } from 'preact';

interface Props {
  config: FormConfig;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Form({ config, onSuccess, onError }: Props): JSX.Element {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { formId, formType, fields, submitText, endpoint } = config;

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });

    // Clear error when user types
    if (errors[target.name]) {
      setErrors({
        ...errors,
        [target.name]: '',
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    fields.forEach((field: FormField) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = field.validation?.message || 'Поле обязательно для заполнения';
      }

      // Add other validation rules based on field type
      if (
        field.type === 'email' &&
        formData[field.name] &&
        !isValidEmail(formData[field.name] || '')
      ) {
        newErrors[field.name] = 'Введите корректный email';
      }

      if (
        field.type === 'tel' &&
        formData[field.name] &&
        !isValidPhone(formData[field.name] || '')
      ) {
        newErrors[field.name] = 'Введите корректный телефон';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form) return;

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint || '/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType,
          formId,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.();

        // Track analytics
        trackFormSubmission(formType, formId);

        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({});
          setIsSubmitted(false);
          setErrors({});
        }, 5000);
      } else {
        throw new Error(result.error || 'Ошибка отправки формы');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже.';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class='space-y-5'>
      {fields.map((field: FormField) => (
        <div class='relative'>
          <label
            for={`${formId}-${field.name}`}
            class='block text-sm font-medium text-white/90 mb-2'
          >
            {field.label} {field.required && <span class='text-yellow-300'>*</span>}
          </label>
          <div class='relative'>
            <input
              type={field.type}
              id={`${formId}-${field.name}`}
              name={field.name}
              value={formData[field.name] || ''}
              onInput={handleChange}
              class={`w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/60 focus:border-yellow-300/60 transition-all duration-300 ${
                errors[field.name]
                  ? 'border-red-400 ring-2 ring-red-400/60'
                  : 'border-white/20 hover:border-white/30'
              }`}
              placeholder={field.placeholder}
              required={field.required}
            />
            {/* Gradient glow effect on focus */}
            <div
              class={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 pointer-events-none transition-opacity duration-300 ${
                errors[field.name] ? 'opacity-0' : 'group-focus-within:opacity-100'
              }`}
            ></div>
          </div>
          {errors[field.name] && (
            <span class='text-sm text-red-300 mt-1 block flex items-center' role='alert'>
              <svg class='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors[field.name]}
            </span>
          )}
        </div>
      ))}

      <button
        type='submit'
        disabled={isSubmitting}
        class='w-full py-4 px-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-xl hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:ring-offset-2 focus:ring-offset-blue-900 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
      >
        {isSubmitting ? (
          <>
            <svg
              class='animate-spin h-5 w-5 text-white mr-2'
              viewBox='0 0 20 20'
              aria-label='Загрузка'
            >
              <circle
                cx='10'
                cy='10'
                r='8'
                stroke='currentColor'
                stroke-width='2'
                fill='none'
                stroke-linecap='round'
                stroke-dasharray='12.57 12.57'
              />
            </svg>
            Отправка...
          </>
        ) : (
          <>
            {submitText}
            <svg
              class='w-5 h-5 ml-2 transition-transform group-hover:translate-x-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 8l4 4m0 0l-4 4m4-4H3'
              />
            </svg>
          </>
        )}
      </button>

      {errors['general'] && (
        <div
          class='bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 mt-4'
          role='alert'
        >
          <div class='flex items-center'>
            <div class='flex-shrink-0'>
              <svg class='h-5 w-5 text-red-300' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div class='ml-3'>
              <p class='text-sm text-red-200 font-medium'>{errors['general']}</p>
            </div>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div
          class='bg-green-500/10 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 mt-4 animate-pulse'
          role='alert'
          aria-live='polite'
        >
          <div class='flex items-center'>
            <div class='flex-shrink-0'>
              <div class='w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center'>
                <svg class='h-5 w-5 text-green-300' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
            <div class='ml-4'>
              <h3 class='text-base font-semibold text-green-200'>Заявка отправлена!</h3>
              <p class='text-sm text-green-300 mt-1'>
                Мы свяжемся с вами в течение 15 минут для бесплатной консультации
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

// Analytics tracking
const trackFormSubmission = (formType: string, formId: string) => {
  if (typeof window !== 'undefined') {
    const win = window as typeof window & {
      gtag?: (command: string, ...args: unknown[]) => void;
      ym?: (id: number, command: string, ...args: unknown[]) => void;
    };

    // Google Analytics
    if (win.gtag) {
      win.gtag('event', 'form_submit', {
        form_type: formType,
        form_id: formId,
      });
    }

    // Yandex Metrika
    if (win.ym) {
      win.ym(94567890, 'reachGoal', 'form_submit', {
        form_type: formType,
        form_id: formId,
      });
    }
  }
};
