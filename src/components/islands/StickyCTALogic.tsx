import { useEffect, useRef } from 'preact/hooks';

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    ym?: (id: number, method: string, ...args: any[]) => void;
  }
}

export default function StickyCTALogic() {
  const isVisibleRef = useRef(false);
  const ctaRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cta = document.getElementById('sticky-cta');
    if (!cta) return;

    ctaRef.current = cta;
    const threshold = parseFloat(cta.dataset.threshold || '0.5');

    const checkVisibility = () => {
      const scrollPercent = window.scrollY / 
        (document.documentElement.scrollHeight - window.innerHeight);
      const shouldShow = scrollPercent >= threshold;

      if (shouldShow !== isVisibleRef.current) {
        isVisibleRef.current = shouldShow;
        cta.classList.toggle('is-visible', shouldShow);

        // Dispatch visibility change event
        cta.dispatchEvent(new CustomEvent('visibility-change', {
          detail: { visible: shouldShow }
        }));
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(checkVisibility);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.cta-button');
      
      if (button) {
        // Track analytics
        if (window.gtag) {
          window.gtag('event', 'click', {
            event_category: 'CTA',
            event_label: 'Sticky CTA Phone Click',
            event_value: 1
          });
        }

        if (window.ym) {
          window.ym(95470168, 'reachGoal', 'sticky_cta_click');
        }

        // Dispatch custom event for additional tracking
        document.dispatchEvent(new CustomEvent('cta-clicked', {
          detail: {
            type: 'sticky',
            action: 'phone-call'
          }
        }));
      }
    };

    // Initial check
    checkVisibility();

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    cta.addEventListener('click', handleClick);

    // Expose public API
    (window as any).stickyCTA = {
      show: () => {
        cta.classList.add('is-visible');
        isVisibleRef.current = true;
      },
      hide: () => {
        cta.classList.remove('is-visible');
        isVisibleRef.current = false;
      },
      setThreshold: (value: number) => {
        const newThreshold = Math.max(0, Math.min(1, value));
        cta.dataset.threshold = newThreshold.toString();
        checkVisibility();
      }
    };

    // Fire component loaded event
    document.dispatchEvent(new CustomEvent('componentLoaded', {
      detail: { name: 'sticky-cta', element: cta }
    }));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cta.removeEventListener('click', handleClick);
      delete (window as any).stickyCTA;
    };
  }, []);

  return null;
}
