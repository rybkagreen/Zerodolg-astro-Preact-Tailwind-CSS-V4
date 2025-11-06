/**
 * Cookie Consent Banner
 * Баннер для получения согласия пользователя на использование cookies и аналитики
 * Соответствует GDPR и 152-ФЗ РФ
 */

import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { consentManager } from '../lib/consent-manager';

interface CookieBannerProps {
  position?: 'bottom' | 'top';
  className?: string;
}

export default function CookieBanner({
  position = 'bottom',
  className = '',
}: CookieBannerProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли уже сохраненное согласие
    if (!consentManager.hasConsentDecision() || consentManager.isConsentExpired()) {
      // Если согласия нет или оно истекло, показываем баннер с небольшой задержкой
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      // Добавляем обработчик прокрутки для автоматического согласия
      const handleScroll = () => {
        // Если пользователь прокрутил более 100px, считаем это подтверждением согласия
        if (window.scrollY > 100) {
          consentManager.acceptAll();
          setIsVisible(false);

          // Отправляем событие в аналитику
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'consent_granted', {
              event_category: 'consent',
              event_label: 'cookie_banner_auto',
            });
          }

          // Загружаем аналитику после получения согласия
          loadAnalyticsAfterConsent();

          // Удаляем обработчик, чтобы не срабатывал повторно
          window.removeEventListener('scroll', handleScroll);
        }
      };

      // Добавляем обработчик прокрутки, если баннер видим
      window.addEventListener('scroll', handleScroll);

      // Очищаем обработчик при размонтировании компонента
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // Уже есть согласие, не показываем баннер
      setIsVisible(false);

      // Return empty cleanup function to satisfy TypeScript
      return () => {};
    }
  }, []);

  const handleAccept = () => {
    consentManager.acceptAll();
    setIsVisible(false);

    // Отправляем событие в аналитику (если согласие дано)
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'consent_granted', {
        event_category: 'consent',
        event_label: 'cookie_banner',
      });
    }

    // Загружаем аналитику после получения согласия
    loadAnalyticsAfterConsent();
  };

  const handleDecline = () => {
    consentManager.declineAll();
    setIsVisible(false);

    // Отправляем событие (без персональных данных)
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'consent_denied', {
        event_category: 'consent',
        event_label: 'cookie_banner',
      });
    }
  };

  // Функция для загрузки аналитики после получения согласия
  const loadAnalyticsAfterConsent = () => {
    // Загружаем скрипт аналитики
    import('../../features/analytics/analytics')
      .then((analyticsModule) => {
        if (analyticsModule && typeof analyticsModule.initAnalytics === 'function') {
          analyticsModule.initAnalytics();
        }
      })
      .catch((error) => {
        console.error('Failed to load analytics after consent:', error);
      });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  const positionClasses = position === 'bottom' ? 'bottom-0 slide-in-bottom' : 'top-0 slide-in-top';

  return (
    <div
      className={`cookie-banner fixed left-0 right-0 ${positionClasses} z-[9999] ${className}`}
      role='dialog'
      aria-label='Cookie Consent'
      aria-live='polite'
    >
      <div className='bg-gray-900 text-white shadow-2xl border-t border-gray-700'>
        <div className='container mx-auto px-4 py-4 sm:py-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            {/* Основной текст */}
            <div className='flex-1'>
              <div className='flex items-start gap-3'>
                {/* Иконка cookie */}
                <div className='flex-shrink-0 mt-1'>
                  <svg
                    className='w-6 h-6 text-blue-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    aria-hidden='true'
                  >
                    <path d='M10 2a8 8 0 100 16 8 8 0 000-16zM7 9a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 11-2 0 1 1 0 012 0z' />
                  </svg>
                </div>

                {/* Текст */}
                <div className='flex-1'>
                  <h3 className='text-base sm:text-lg font-semibold mb-2'>Мы используем cookies</h3>
                  <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>
                    Этот сайт использует cookies и собирает анонимные данные для улучшения вашего
                    опыта использования и аналитики посещаемости. Продолжая использовать сайт, вы
                    даете согласие на использование файлов cookie.
                    {!isExpanded && (
                      <button
                        onClick={toggleExpanded}
                        className='text-blue-400 hover:text-blue-300 underline ml-1 transition-colors'
                        aria-expanded={isExpanded}
                      >
                        Подробнее
                      </button>
                    )}
                  </p>

                  {/* Развернутая информация */}
                  {isExpanded && (
                    <div className='mt-3 p-3 bg-gray-800 rounded-lg text-sm text-gray-300 space-y-2 animate-fade-in'>
                      <p>
                        <strong className='text-white'>Мы собираем:</strong>
                      </p>
                      <ul className='list-disc list-inside space-y-1 ml-2'>
                        <li>Информацию о посещениях страниц (Google Analytics, Яндекс.Метрика)</li>
                        <li>
                          Данные из форм обратной связи (имя, телефон, email) —{' '}
                          <strong>только при вашем согласии</strong>
                        </li>
                        <li>
                          Хешированные (зашифрованные) данные для улучшения аналитики — они не могут
                          быть использованы для идентификации
                        </li>
                      </ul>
                      <p className='mt-2'>
                        <strong className='text-white'>Автоматическое согласие:</strong> Продолжая
                        использовать сайт (прокручивая страницу), вы автоматически соглашаетесь на
                        использование файлов cookie.
                      </p>
                      <p className='mt-2'>
                        Подробнее в{' '}
                        <a
                          href='/privacy'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-400 hover:text-blue-300 underline'
                        >
                          политике конфиденциальности
                        </a>
                        .
                      </p>
                      <button
                        onClick={toggleExpanded}
                        className='text-blue-400 hover:text-blue-300 underline mt-2'
                      >
                        Свернуть
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className='flex flex-col sm:flex-row gap-3 lg:flex-shrink-0'>
              <button
                onClick={handleDecline}
                className='px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                type='button'
              >
                Отклонить
              </button>
              <button
                onClick={handleAccept}
                className='px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg'
                type='button'
              >
                Принять все
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-bottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-top {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .slide-in-bottom {
          animation: slide-in-bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .slide-in-top {
          animation: slide-in-top 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out forwards;
        }

        .cookie-banner {
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
