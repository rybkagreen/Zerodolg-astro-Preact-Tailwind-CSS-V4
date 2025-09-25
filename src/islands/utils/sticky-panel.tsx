import { useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';

// Declare gtag global function

interface StickyPanelProps {
  delay?: number;
  scrollThreshold?: number;
  cookieDays?: number;
}

export default function StickyPanel({ 
  delay = 5000,
  scrollThreshold = 300,
  cookieDays = 1,
}: StickyPanelProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const cookieName = 'sticky_panel_closed';

  // Cookie utilities
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Handle countdown timer
  const startCountdown = () => {
    const panel = document.querySelector('[data-sticky-panel]');
    if (!panel) return;

    const timerElement = panel.querySelector('[data-timer]');
    if (!timerElement) return;

    const targetDate = timerElement.getAttribute('data-timer');
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        hide();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      const daysEl = timerElement.querySelector('[data-days]');
      const hoursEl = timerElement.querySelector('[data-hours]');
      const minutesEl = timerElement.querySelector('[data-minutes]');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    };

    updateTimer();
    countdownRef.current = setInterval(updateTimer, 60000); // Update every minute
  };

  // Show panel
  const show = () => {
    if (isVisible || hasBeenShown) return;

    const panel = document.querySelector('[data-sticky-panel]');
    if (!panel) return;

    panel.removeAttribute('hidden');
    panel.classList.add('sticky-panel--visible');

    requestAnimationFrame(() => {
      panel.classList.add('sticky-panel--animate');
    });

    setIsVisible(true);
    setHasBeenShown(true);

    // Start countdown if timer exists
    startCountdown();

    // Track analytics event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'view', {
        event_category: 'StickyPanel',
        event_label: 'panel_shown',
      });
    }
  };

  // Hide panel
  const hide = () => {
    const panel = document.querySelector('[data-sticky-panel]');
    if (!panel) return;

    panel.classList.remove('sticky-panel--animate');
    panel.classList.remove('sticky-panel--visible');

    setTimeout(() => {
      panel.setAttribute('hidden', '');
    }, 300);

    setIsVisible(false);

    // Set cookie
    setCookie(cookieName, 'true', cookieDays);

    // Clear timers
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    // Track analytics event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'close', {
        event_category: 'StickyPanel',
        event_label: 'panel_closed',
      });
    }
  };

  useEffect(() => {
    // Check if panel was previously closed
    if (getCookie(cookieName)) {
      return;
    }

    const panel = document.querySelector('[data-sticky-panel]');
    if (!panel) return;

    // Setup close button
    const closeBtn = panel.querySelector('[data-sticky-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', hide);
    }

    // Setup CTA buttons
    const ctaButtons = panel.querySelectorAll('[data-modal]');
    ctaButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const modalName = target.getAttribute('data-modal');
        const trackEvent = target.getAttribute('data-track');

        // Track event
        if (trackEvent && typeof window.gtag !== 'undefined') {
          window.gtag('event', 'click', {
            event_category: 'StickyPanel',
            event_label: trackEvent,
          });
        }

        // Trigger modal
        if (modalName) {
          window.dispatchEvent(
            new CustomEvent('open-modal', {
              detail: { modal: modalName },
            })
          );
        }

        // Hide panel
        hide();
      });
    });

    // Delay trigger
    timerRef.current = setTimeout(() => {
      if (!hasBeenShown) {
        show();
      }
    }, delay);

    // Scroll trigger
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (!hasBeenShown && window.scrollY > scrollThreshold) {
          show();
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      window.removeEventListener('scroll', handleScroll);

      if (closeBtn) {
        closeBtn.removeEventListener('click', hide);
      }
    };
  }, [delay, scrollThreshold, cookieDays, hasBeenShown]);

  return null as any; // This component only handles logic, no UI
}
