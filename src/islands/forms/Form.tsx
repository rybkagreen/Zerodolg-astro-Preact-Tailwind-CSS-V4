import { useState } from 'preact/hooks';
import type { FormConfig, FormField } from '../../types/form';

interface Props {
  config: FormConfig;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Form({ config, onSuccess, onError }: Props) {
  const [formData, setFormData] = useState<{[key: string]: string}>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { formId, formType, fields, submitText, endpoint } = config;
  
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [target.name]: target.value
    });
    
    // Clear error when user types
    if (errors[target.name]) {
      setErrors({
        ...errors,
        [target.name]: ''
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    fields.forEach((field: FormField) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = field.validation?.message || 'Поле обязательно для заполнения';
      }
      
      // Add other validation rules based on field type
      if (field.type === 'email' && formData[field.name] && !isValidEmail(formData[field.name] || '')) {
        newErrors[field.name] = 'Введите корректный email';
      }
      
      if (field.type === 'tel' && formData[field.name] && !isValidPhone(formData[field.name] || '')) {
        newErrors[field.name] = 'Введите корректный телефон';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
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
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже.';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {fields.map((field: FormField) => (
        <div class="form-field">
          <label for={`${formId}-${field.name}`} class="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span class="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            id={`${formId}-${field.name}`}
            name={field.name}
            value={formData[field.name] || ''}
            onInput={handleChange}
            class={`w-full px-4 py-2 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
            placeholder={field.placeholder}
            required={field.required}
          />
          {errors[field.name] && (
            <span class="text-sm text-red-600 mt-1 block" role="alert">{errors[field.name]}</span>
          )}
        </div>
      ))}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        class="w-full py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 font-medium"
      >
        <span class="flex items-center justify-center">
          {isSubmitting ? 'Отправка...' : submitText}
          {isSubmitting && (
            <span class="ml-2">
              <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 20 20" aria-label="Загрузка">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
              </svg>
            </span>
          )}
        </span>
      </button>
      
      {errors.general && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mt-2" role="alert">
          <p class="text-sm text-red-700">{errors.general}</p>
        </div>
      )}
      
      {isSubmitted && (
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mt-2" role="alert" aria-live="polite">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Заявка отправлена!</h3>
              <p class="text-sm text-green-700 mt-1">
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
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Analytics tracking
const trackFormSubmission = (formType: string, formId: string) => {
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
};