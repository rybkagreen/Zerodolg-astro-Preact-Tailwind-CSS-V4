import { type VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Countdown Timer Component
const CountdownTimer = ({ deadline }: { deadline: string }): VNode | null => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const getTodayEndTime = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return end;
    };

    // Parse the deadline string to create a Date object
    const targetTime = deadline ? new Date(deadline) : getTodayEndTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        // Note: We don't have access to the interval here, but that's okay
        // because we clear it in the cleanup function anyway
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
    return <div class='countdown-expired'>Время истекло</div>;
  }

  return (
    <div class='countdown-timer'>
      <span class='countdown-label'>Осталось:</span>
      <div class='countdown-blocks'>
        <div class='countdown-block'>
          <span class='countdown-number'>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span class='countdown-unit'>час</span>
        </div>
        <div class='countdown-block'>
          <span class='countdown-number'>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span class='countdown-unit'>мин</span>
        </div>
        <div class='countdown-block'>
          <span class='countdown-number'>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span class='countdown-unit'>сек</span>
        </div>
      </div>
    </div>
  );
};

// Special Offer Banner Component
const SpecialOfferBanner = (): VNode | null => {
  const [isVisible, setIsVisible] = useState(false); // Начинаем с false
  const [isExiting, setIsExiting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Проверяем, не был ли баннер закрыт
  useEffect(() => {
    const checkBannerStatus = () => {
      try {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[SpecialOfferBanner] Initializing banner check...');
        }

        if (typeof window === 'undefined') {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[SpecialOfferBanner] Window undefined, skipping...');
          }
          return;
        }

        if (typeof sessionStorage === 'undefined') {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn('[SpecialOfferBanner] SessionStorage unavailable, showing banner anyway');
          }
          setIsVisible(true);
          setIsInitialized(true);
          return;
        }

        const wasClosed = sessionStorage.getItem('offerBannerClosed');
        const showDelay = 5000; // Показываем через 5 секунд

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[SpecialOfferBanner] Banner status:', {
            wasClosed: !!wasClosed,
            showDelay,
          });
        }

        if (!wasClosed) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[SpecialOfferBanner] Banner not closed, setting timer...');
          }
          const timerId = setTimeout(() => {
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.log('[SpecialOfferBanner] Showing banner after delay');
            }
            setIsVisible(true);
            setIsInitialized(true);
          }, showDelay);

          // Очищаем таймер при размонтировании
          return () => clearTimeout(timerId);
        } else {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[SpecialOfferBanner] Banner was closed, not showing');
          }
          setIsInitialized(true);
          return undefined; // Explicitly return undefined when banner was closed
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[SpecialOfferBanner] Error checking banner status:', error);
        }
        setIsInitialized(true);
        return undefined;
      }
    };

    const cleanup = checkBannerStatus();
    return cleanup;
  }, []);

  const handleClose = () => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[SpecialOfferBanner] Closing banner...');
    }
    setIsExiting(true);
    setTimeout(() => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[SpecialOfferBanner] Banner hidden');
      }
      setIsVisible(false);
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('offerBannerClosed', 'true');
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[SpecialOfferBanner] Banner close status saved to sessionStorage');
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[SpecialOfferBanner] Error saving to sessionStorage:', error);
        }
      }
    }, 500);
  };

  const handleCtaClick = () => {
    try {
      // Try to trigger consultation modal
      const modalTrigger = document.querySelector('[data-modal="consultation"]') as HTMLElement;
      if (modalTrigger) {
        modalTrigger.click();
      } else {
        // Fallback: scroll to form section or hero form
        const heroForm =
          document.querySelector('#hero .form-wrapper') ||
          document.querySelector('#hero form') ||
          document.querySelector('form[data-form-type="hero_form"]') ||
          document.querySelector('.hero-form');
        if (heroForm) {
          heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn('[SpecialOfferBanner] No form found to scroll to');
          }
        }
      }

      // Analytics
      try {
        const win = window as typeof window & {
          gtag?: (command: string, ...args: unknown[]) => void;
        };
        if (win.gtag) {
          win.gtag('event', 'special_offer_cta_clicked', {
            event_category: 'engagement',
            event_label: 'discount_button',
          });
        }
      } catch (analyticsError) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn('[SpecialOfferBanner] Analytics error:', analyticsError);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[SpecialOfferBanner] Error in handleCtaClick:', error);
      }
    }
  };

  // Не показываем баннер до инициализации
  if (!isInitialized) {
    return null;
  }

  // Не показываем, если баннер скрыт или был закрыт
  if (!isVisible) {
    return null;
  }

  return (
    <div
      class={`special-offer-banner compact ${
        isVisible && !isExiting ? 'visible' : ''
      } ${isExiting ? 'slide-out' : ''}`}
      id='special-offer-banner'
    >
      <div class='offer-container compact'>
        <button class='offer-close' aria-label='Закрыть' onClick={handleClose}>
          ×
        </button>
        <div class='offer-content compact'>
          <div class='offer-header-row'>
            <span class='offer-title-compact'>
              🔥 Банкротство «под ключ»: от заявления до списания долгов!
            </span>
          </div>
          <div class='offer-price-row'>
            <span class='old-price-compact'>200 000₽</span>
            <span class='price-arrow'> → </span>
            <span class='new-price-compact'>150 000₽</span>
            <span class='discount-compact'>-25%</span>
          </div>
          <div class='countdown-compact'>
            <CountdownTimer deadline='2025-12-31' />
          </div>
          <button class='cta-button-compact' onClick={handleCtaClick}>
            Получить скидку
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferBanner;
