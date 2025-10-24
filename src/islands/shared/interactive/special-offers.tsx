import { type VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Countdown Timer - компактная горизонтальная версия
const CountdownTimer = ({ deadline }: { deadline: string }): VNode | null => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const getTodayEndTime = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return end;
    };

    const targetTime = deadline ? new Date(deadline) : getTodayEndTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (isExpired) {
    return (
      <span 
        class="text-sm text-red-700 dark:text-red-300 font-bold px-3 py-1.5 bg-red-100 dark:bg-red-900 rounded-lg border border-red-300 dark:border-red-700"
      >
        Акция завершена
      </span>
    );
  }

  return (
    <div 
      class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-500"
    >
      <div class="flex items-baseline gap-0.5">
        <span class="text-base sm:text-xl font-bold text-red-700 dark:text-red-400">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span class="text-[10px] sm:text-xs text-gray-800 dark:text-gray-200 font-semibold">ч</span>
      </div>
      <span class="text-gray-600 dark:text-gray-300 font-bold text-sm sm:text-base">:</span>
      <div class="flex items-baseline gap-0.5">
        <span class="text-base sm:text-xl font-bold text-red-700 dark:text-red-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span class="text-[10px] sm:text-xs text-gray-800 dark:text-gray-200 font-semibold">м</span>
      </div>
      <span class="text-gray-600 dark:text-gray-300 font-bold text-sm sm:text-base">:</span>
      <div class="flex items-baseline gap-0.5">
        <span class="text-base sm:text-xl font-bold text-red-700 dark:text-red-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span class="text-[10px] sm:text-xs text-gray-800 dark:text-gray-200 font-semibold">с</span>
      </div>
    </div>
  );
};

// Full-Width Banner между Header и Hero
const SpecialOfferBanner = (): VNode | null => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkBannerStatus = () => {
      try {
        if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
          setIsVisible(true);
          setIsInitialized(true);
          return;
        }

        const wasClosed = sessionStorage.getItem('offerBannerClosed');
        const showDelay = 3000;

        if (!wasClosed) {
          const timerId = setTimeout(() => {
            setIsVisible(true);
            setIsInitialized(true);
          }, showDelay);

          return () => clearTimeout(timerId);
        } else {
          setIsInitialized(true);
          return undefined;
        }
      } catch (_error) {
        setIsInitialized(true);
        return undefined;
      }
    };

    const cleanup = checkBannerStatus();
    return cleanup;
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosed(true);
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('offerBannerClosed', 'true');
        }
      } catch (_error) {
        // Error saving to sessionStorage
      }
    }, 400);
  };

  const handleCtaClick = () => {
    try {
      const modalTrigger = document.querySelector('[data-modal="consultation"]') as HTMLElement;
      if (modalTrigger) {
        modalTrigger.click();
      } else {
        const heroForm =
          document.querySelector('#hero .form-wrapper') ||
          document.querySelector('#hero form') ||
          document.querySelector('form[data-form-type="hero_form"]') ||
          document.querySelector('.hero-form');
        if (heroForm) {
          heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      try {
        const win = window as typeof window & {
          gtag?: (command: string, ...args: unknown[]) => void;
        };
        if (win.gtag) {
          win.gtag('event', 'special_offer_cta_clicked', {
            event_category: 'engagement',
            event_label: 'fullwidth_banner',
          });
        }
      } catch (_analyticsError) {
        // Analytics error
      }
    } catch (_error) {
      // Error in handleCtaClick
    }
  };

  // Если баннер закрыт, не рендерим его вообще (освобождаем место)
  if (!isInitialized || isClosed) {
    return null;
  }

  return (
    <aside
      class={`relative w-full overflow-hidden transition-all duration-500 ease-out ${isVisible && !isExiting ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      id="special-offer-banner"
      role="banner"
      aria-label="Специальное предложение: банкротство под ключ со скидкой 25%"
      aria-live="polite"
    >
      <div class="relative bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
        {/* Decorative top accent */}
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" aria-hidden="true"></div>

        {/* Main content */}
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] items-center gap-3 sm:gap-4 lg:gap-6">
            
            {/* Section 1: Title & Description */}
            <header class="text-center lg:text-left">
              <div class="flex items-center justify-center lg:justify-start gap-2 mb-1.5 sm:mb-2">
                <span class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
                  <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>СПЕЦПРЕДЛОЖЕНИЕ</span>
                </span>
              </div>
              <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1">
                Банкротство «под ключ»
              </h2>
              <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                От заявления до полного списания долгов
              </p>
            </header>

            {/* Section 2: Price Comparison */}
            <div class="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <div class="text-center min-w-[70px] sm:min-w-[80px]">
                <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium mb-0.5 sm:mb-1">Обычно</p>
                <p class="text-sm sm:text-lg font-bold text-gray-500 dark:text-gray-400 line-through" aria-label="Обычная цена 200 000 рублей">
                  <span class="xs:hidden">200&nbsp;тыс</span>
                  <span class="hidden xs:inline">200&nbsp;000₽</span>
                </p>
              </div>
              
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>

              <div class="text-center min-w-[105px] sm:min-w-[120px]">
                <p class="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-bold mb-0.5 sm:mb-1">Сейчас всего</p>
                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                  <p class="text-lg sm:text-2xl font-extrabold text-red-600 dark:text-red-400" aria-label="Цена со скидкой 150 000 рублей">
                    <span class="xs:hidden">150&nbsp;тыс.</span>
                    <span class="hidden xs:inline">150&nbsp;000₽</span>
                  </p>
                  <span class="px-1.5 sm:px-2 py-0.5 bg-red-600 dark:bg-red-700 text-white text-[10px] sm:text-xs font-bold rounded" aria-label="Скидка 25 процентов">-25%</span>
                </div>
              </div>
            </div>

            {/* Section 3: CTA & Timer */}
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Timer - Desktop */}
              <div class="hidden lg:flex flex-col items-center gap-1.5">
                <p class="text-xs text-gray-800 dark:text-gray-200 font-bold flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-red-600 dark:text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span>До конца акции</span>
                </p>
                <CountdownTimer deadline="2025-12-31" />
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleCtaClick}
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-700 dark:to-red-800 dark:hover:from-red-800 dark:hover:to-red-900 text-white font-bold rounded-lg transform hover:scale-105 active:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border border-red-500 dark:border-red-600"
                aria-label="Получить скидку 25 процентов на банкротство"
              >
                <span class="text-sm sm:text-base whitespace-nowrap">
                  Получить скидку →
                </span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              class="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 z-10"
              aria-label="Закрыть баннер спецпредложения"
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Timer - Mobile */}
          <div class="lg:hidden flex flex-col items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-300 dark:border-gray-700 mt-2 sm:mt-3">
            <p class="text-[10px] sm:text-xs text-gray-800 dark:text-gray-200 font-bold flex items-center gap-1 sm:gap-1.5">
              <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 dark:text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              <span>До конца акции:</span>
            </p>
            <CountdownTimer deadline="2025-12-31" />
          </div>
        </div>

        {/* Footer with trust badges */}
        <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 py-1.5 sm:py-2">
          <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <p class="text-[10px] sm:text-xs text-center text-gray-700 dark:text-gray-300 font-medium flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span class="inline-flex items-center gap-1 sm:gap-1.5">
                <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 dark:text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="hidden xs:inline">Конфиденциальность гарантирована</span>
                <span class="xs:hidden">Конфиденциально</span>
              </span>
              <span aria-hidden="true" class="hidden xs:inline">•</span>
              <span class="hidden xs:inline">100+ успешных дел</span>
              <span aria-hidden="true" class="hidden xs:inline">•</span>
              <span class="hidden xs:inline">Рассрочка 0%</span>
            </p>
          </div>
        </footer>
      </div>
    </aside>
  );
};

export default SpecialOfferBanner;
