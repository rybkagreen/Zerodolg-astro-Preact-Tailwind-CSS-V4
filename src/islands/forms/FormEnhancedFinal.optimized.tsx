import { useState, useCallback, useMemo, useRef, useEffect } from 'preact/hooks';
import { Component } from 'preact';
import { z } from 'zod';
import type { JSX, VNode } from 'preact';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { useIntersectionObserver } from '../../shared/hooks/useIntersectionObserver';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';
import { type FormField, type FormConfig } from '@shared/types/form';
import { cn } from '@shared/utils/cn';

// Form validation schemas using Zod
const createFieldSchema = (field: FormField) => {
  let schema = z.string();

  if (field.required) {
    schema = schema.min(1, field.validation?.message || 'Поле обязательно для заполнения');
  }

  switch (field.type) {
    case 'email':
      schema = schema.email('Введите корректный email');
      break;
    case 'tel':
      schema = schema.regex(/^[+]?[1-9][\d\s\-()]{0,15}$/, 'Введите корректный номер телефона');
      break;
  }

  if (field.validation?.min) {
    schema = schema.min(field.validation.min, field.validation.message);
  }

  if (field.validation?.max) {
    schema = schema.max(field.validation.max, field.validation.message);
  }

  if (field.validation?.pattern) {
    schema = schema.regex(new RegExp(field.validation.pattern), field.validation.message);
  }

  return schema;
};

interface EnhancedFormProps {
  config: FormConfig;
  onSuccess?: (data: Record<string, string>) => void | Promise<void>;
  onError?: (error: Error) => void;
  className?: string;
  enableAnalytics?: boolean;
  enableAutoSave?: boolean;
  submitOnEnter?: boolean;
  enableProgressiveEnhancement?: boolean;
  enableFieldValidationHighlight?: boolean;
}

// Error Boundary Component
class FormErrorBoundary extends Component<
  { children: VNode; className?: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: VNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static override getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: any) {
    // Send error to monitoring service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          class={cn(
            'p-6 bg-error-50 border border-error-200 rounded-lg',
            this.props.className || ''
          )}
        >
          <h3 class='text-error-800 font-semibold mb-2'>Произошла ошибка</h3>
          <p class='text-error-600'>
            {this.state.error?.message || 'Что-то пошло не так. Пожалуйста, обновите страницу.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            class={cn('mt-4 px-4 py-2 bg-error text-white rounded hover:bg-error-700')}
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading spinner component
const LoadingSpinner = (): JSX.Element => (
  <svg class={cn('animate-spin h-5 w-5')} viewBox='0 0 24 24' aria-label='Загрузка'>
    <circle
      class={cn('opacity-25')}
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      stroke-width='4'
      fill='none'
    />
    <path
      class={cn('opacity-75')}
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
);

// Success animation component
const SuccessCheckmark = (): JSX.Element => (
  <div class='success-checkmark'>
    <svg class={cn('w-16 h-16')} viewBox='0 0 52 52'>
      <circle
        class={cn('checkmark-circle')}
        cx='26'
        cy='26'
        r='25'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
      />
      <path
        class={cn('checkmark-check')}
        fill='none'
        stroke='currentColor'
        stroke-width='3'
        d='M14.1 27.2l7.1 7.2 16.7-16.8'
      />
    </svg>
    <style jsx>{`
      @keyframes stroke {
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes scale {
        0%,
        100% {
          transform: none;
        }
        50% {
          transform: scale3d(1.1, 1.1, 1);
        }
      }
      @keyframes fill {
        100% {
          box-shadow: inset 0px 0px 0px 30px #10b981;
        }
      }
      .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark-check {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      .success-checkmark {
        animation:
          fill 0.4s ease-in-out 0.4s both,
          scale 0.3s ease-in-out 0.9s both;
      }
    `}</style>
  </div>
);

// Field Error Component with animation
const FieldError = ({ message }: { message: string }): JSX.Element => (
  <div class={cn('mt-1 flex items-center text-sm text-error-500 animate-fade-in')} role='alert'>
    <svg class={cn('w-4 h-4 mr-1')} fill='currentColor' viewBox='0 0 20 20'>
      <path
        fill-rule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
        clip-rule='evenodd'
      />
    </svg>
    <span>{message}</span>
  </div>
);

// Main Enhanced Form Component
export default function FormEnhancedFinal({
  config,
  onSuccess,
  onError,
  className = '',
  enableAnalytics = true,
  enableAutoSave = false,
  submitOnEnter = false,
  enableProgressiveEnhancement = true,
  enableFieldValidationHighlight = true,
}: EnhancedFormProps): JSX.Element {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [fieldValidation, setFieldValidation] = useState<
    Record<string, 'valid' | 'invalid' | 'neutral'>
  >({});

  const formRef = useRef<HTMLFormElement>(null);
  const submitAttempts = useRef(0);

  usePerformanceMonitor('FormEnhancedFinal');

  // Use intersection observer to track form visibility
  const [observerRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
    triggerOnce: true,
  });

  // Debounced form data for auto-save
  const debouncedFormData = useDebounce(formData, 1000);

  // Create validation schema
  const validationSchema = useMemo(() => {
    const schemaObject: Record<string, z.ZodString> = {};
    config.fields.forEach((field) => {
      schemaObject[field.name] = createFieldSchema(field);
    });
    return z.object(schemaObject);
  }, [config.fields]);

  // Auto-save to localStorage
  useEffect(() => {
    if (enableAutoSave && Object.keys(debouncedFormData).length > 0) {
      localStorage.setItem(`form-draft-${config.formId}`, JSON.stringify(debouncedFormData));
    }
  }, [debouncedFormData, enableAutoSave, config.formId]);

  // Load saved draft on mount
  useEffect(() => {
    if (enableAutoSave) {
      const savedDraft = localStorage.getItem(`form-draft-${config.formId}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(parsed);
        } catch (e) {
          // Failed to load form draft
        }
      }
    }
  }, [enableAutoSave, config.formId]);

  // Track form visibility for analytics
  useEffect(() => {
    if (isVisible && enableAnalytics) {
      trackEvent('form_view', {
        form_id: config.formId,
        form_type: config.formType,
      });
    }
  }, [isVisible, enableAnalytics, config.formId, config.formType]);

  // Handle field change with validation
  const handleFieldChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name] && touchedFields.has(name)) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      // Validate single field if progressive enhancement is enabled
      if (enableProgressiveEnhancement) {
        try {
          const field = config.fields.find((f) => f.name === name);
          if (field) {
            const fieldSchema = createFieldSchema(field);
            fieldSchema.parse(value);
            setFieldValidation((prev) => ({ ...prev, [name]: 'valid' }));
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            setFieldValidation((prev) => ({ ...prev, [name]: 'invalid' }));
          } else {
            setFieldValidation((prev) => ({ ...prev, [name]: 'neutral' }));
          }
        }
      }
    },
    [errors, touchedFields, config.fields, enableProgressiveEnhancement]
  );

  // Handle field blur for validation
  const handleFieldBlur = useCallback(
    (name: string) => {
      setTouchedFields((prev) => new Set(prev).add(name));

      // Validate single field
      const field = config.fields.find((f) => f.name === name);
      if (!field) return;

      try {
        const fieldSchema = createFieldSchema(field);
        fieldSchema.parse(formData[name] || '');
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFieldValidation((prev) => ({ ...prev, [name]: 'valid' }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [name]: error.issues[0]?.message || 'Некорректное значение',
          }));
          setFieldValidation((prev) => ({ ...prev, [name]: 'invalid' }));
        }
      }
    },
    [config.fields, formData]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    try {
      validationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);

        // Mark all fields as touched
        setTouchedFields(new Set(config.fields.map((f) => f.name)));

        // Focus first error field
        const firstErrorField = config.fields.find((f) => newErrors[f.name]);
        if (firstErrorField && formRef.current) {
          const input = formRef.current.querySelector(
            `[name="${firstErrorField.name}"]`
          ) as HTMLElement;
          input?.focus();
        }
      }
      return false;
    }
  }, [validationSchema, formData, config.fields]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: Event) => {
      e.preventDefault();

      // Track submission attempt
      submitAttempts.current += 1;

      if (enableAnalytics) {
        trackEvent('form_submit_attempt', {
          form_id: config.formId,
          form_type: config.formType,
          attempt_number: submitAttempts.current,
        });
      }

      // Validate form
      if (!validateForm()) {
        if (enableAnalytics) {
          trackEvent('form_validation_error', {
            form_id: config.formId,
            errors: Object.keys(errors),
          });
        }
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        // Prepare submission data
        const submissionData = {
          ...formData,
          formType: config.formType,
          formId: config.formId,
          timestamp: new Date().toISOString(),
          metadata: {
            attempts: submitAttempts.current,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          },
        };

        // Submit to API
        const response = await fetch(config.endpoint || '/api/form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || `Server error: ${response.status}`);
        }

        // Success handling
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Форма успешно отправлена!');

        // Clear auto-saved draft
        if (enableAutoSave) {
          localStorage.removeItem(`form-draft-${config.formId}`);
        }

        // Track success
        if (enableAnalytics) {
          trackEvent('form_submit_success', {
            form_id: config.formId,
            form_type: config.formType,
          });
        }

        // Call success callback
        if (onSuccess) {
          await onSuccess(formData);
        }

        // Reset form after delay
        setTimeout(() => {
          setFormData({});
          setTouchedFields(new Set());
          setFieldValidation({});
          setSubmitStatus('idle');
          submitAttempts.current = 0;
        }, 5000);
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Unknown error');

        setSubmitStatus('error');
        setSubmitMessage(errorObj.message || 'Произошла ошибка при отправке формы');

        // Track error
        if (enableAnalytics) {
          trackEvent('form_submit_error', {
            form_id: config.formId,
            error: errorObj.message,
          });
        }

        // Call error callback
        if (onError) {
          onError(errorObj);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, config, validateForm, errors, enableAnalytics, enableAutoSave, onSuccess, onError]
  );

  // Handle Enter key submission
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (submitOnEnter && e.key === 'Enter' && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleSubmit(e);
        }
      }
    },
    [submitOnEnter, handleSubmit]
  );

  // Determine input field class based on validation state
  const getFieldClass = (fieldName: string) => {
    const baseClass = cn(
      'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all'
    );

    if (!enableFieldValidationHighlight) {
      return cn(baseClass, 'border-border');
    }

    if (touchedFields.has(fieldName)) {
      if (errors[fieldName]) {
        return cn(baseClass, 'border-error-500 focus:ring-error-500');
      } else if (fieldValidation[fieldName] === 'valid') {
        return cn(baseClass, 'border-success-500 focus:ring-success-500');
      }
    }

    return cn(baseClass, 'border-border');
  };

  return (
    <FormErrorBoundary>
      <div ref={observerRef as any} class={cn('form-enhanced', className)}>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          class='space-y-6'
          novalidate
          aria-label={config.formType}
        >
          {config.fields.map((field) => (
            <div key={field.name} class='form-field'>
              <label
                htmlFor={`${config.formId}-${field.name}`}
                class='block text-sm font-medium mb-2'
              >
                {field.label}
                {field.required && (
                  <span class='text-error-500 ml-1' aria-label='обязательное поле'>
                    *
                  </span>
                )}
              </label>

              <div class='relative'>
                {field.type === 'text' &&
                (field.name.includes('comment') ||
                  field.name.includes('message') ||
                  field.name.includes('description')) ? (
                  <textarea
                    id={`${config.formId}-${field.name}`}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onInput={(e) =>
                      handleFieldChange(field.name, (e.target as HTMLTextAreaElement).value)
                    }
                    onBlur={() => handleFieldBlur(field.name)}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                    class={getFieldClass(field.name)}
                    rows={4}
                    aria-label={field.label}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={`${config.formId}-${field.name}`}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onInput={(e) =>
                      handleFieldChange(field.name, (e.target as HTMLInputElement).value)
                    }
                    onBlur={() => handleFieldBlur(field.name)}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                    class={getFieldClass(field.name)}
                    autocomplete={field.autocomplete ?? undefined}
                    aria-label={field.label}
                  />
                )}

                {/* Показываем ошибку только для touched полей */}
                {errors[field.name] && touchedFields.has(field.name) && (
                  <FieldError message={errors[field.name] || ''} />
                )}

                {/* Показываем индикатор валидации */}
                {enableProgressiveEnhancement &&
                  touchedFields.has(field.name) &&
                  fieldValidation[field.name] &&
                  fieldValidation[field.name] === 'valid' && (
                    <div class='absolute inset-y-0 right-0 flex items-center pr-3'>
                      <svg class='h-5 w-5 text-success-500' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                          fill-rule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clip-rule='evenodd'
                        />
                      </svg>
                    </div>
                  )}
              </div>
            </div>
          ))}

          {/* Submit button */}
          <button
            type='submit'
            disabled={isSubmitting || submitStatus === 'success'}
            class={cn(
              'w-full py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]',
              isSubmitting || submitStatus === 'success'
                ? 'bg-gray-400 cursor-not-allowed'
                : cn(
                    'bg-gradient-to-r from-primary-500 to-accent text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-accent-600'
                  )
            )}
          >
            {isSubmitting ? (
              <span class='flex items-center justify-center'>
                <LoadingSpinner />
                <span class='ml-2'>Отправка...</span>
              </span>
            ) : submitStatus === 'success' ? (
              <span class='flex items-center justify-center'>
                <SuccessCheckmark />
                <span class='ml-2'>Отправлено!</span>
              </span>
            ) : (
              config.submitText || 'Отправить'
            )}
          </button>

          {/* Status messages */}
          {submitStatus === 'success' && (
            <div
              class={cn('p-4 bg-success-50 border border-success-200 rounded-lg animate-fade-in')}
            >
              <p class='text-success-800'>{submitMessage}</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div class={cn('p-4 bg-error-50 border border-error-200 rounded-lg animate-fade-in')}>
              <p class='text-error-800'>{submitMessage}</p>
            </div>
          )}

          {/* Auto-save indicator */}
          {enableAutoSave && Object.keys(formData).length > 0 && (
            <p class='text-xs text-text-muted text-center'>Черновик сохраняется автоматически</p>
          )}
        </form>
      </div>
    </FormErrorBoundary>
  );
}

// Analytics tracking helper
function trackEvent(eventName: string, eventData: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }

  // Yandex Metrika
  if ((window as any).ym) {
    (window as any).ym(94567890, 'reachGoal', eventName, eventData);
  }

  // Custom analytics
  if ((window as any).analytics) {
    (window as any).analytics.track(eventName, eventData);
  }

  // Console log for debugging removed for production
}
