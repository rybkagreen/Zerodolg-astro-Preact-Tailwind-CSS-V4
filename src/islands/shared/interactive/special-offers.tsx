import { useState, useEffect } from 'preact/hooks';

// Countdown Timer Component
const CountdownTimer = ({ endTime }: { endTime?: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const getTodayEndTime = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return end;
    };

    const targetTime = endTime || getTodayEndTime();
    let interval: NodeJS.Timeout;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (isExpired) {
    return <div class="countdown-expired">Время истекло</div>;
  }

  return (
    <div class="countdown-timer">
      <span class="countdown-label">Осталось:</span>
      <div class="countdown-blocks">
        <div class="countdown-block">
          <span class="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span class="countdown-unit">час</span>
        </div>
        <div class="countdown-block">
          <span class="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span class="countdown-unit">мин</span>
        </div>
        <div class="countdown-block">
          <span class="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span class="countdown-unit">сек</span>
        </div>
      </div>
    </div>
  );
};

// Special Offer Banner Component
const SpecialOfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('offerBannerClosed', 'true');
      }
    }, 500);
  };

  const handleCtaClick = () => {
    const form = document.getElementById('consultation-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (
    !isVisible ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('offerBannerClosed'))
  ) {
    return null;
  }

  return (
    <div
      class={`special-offer-banner compact ${isExiting ? 'slide-out' : ''}`}
      id="special-offer-banner"
    >
      <div class="offer-container compact">
        <button class="offer-close" aria-label="Закрыть" onClick={handleClose}>
          ×
        </button>
        <div class="offer-content compact">
          <div class="offer-header-row">
            <span class="offer-badge-compact">🔥 АКЦИЯ</span>
            <span class="offer-title-compact">Банкротство под ключ</span>
          </div>
          <div class="offer-price-row">
            <span class="old-price-compact">220 000₽</span>
            <span class="price-arrow"> → </span>
            <span class="new-price-compact">150 000₽</span>
            <span class="discount-compact">-32%</span>
          </div>
          <div class="countdown-compact">
            <CountdownTimer />
          </div>
          <button class="cta-button-compact" onClick={handleCtaClick}>
            Получить скидку
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferBanner;
