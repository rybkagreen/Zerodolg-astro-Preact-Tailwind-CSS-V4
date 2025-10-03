import { useEffect, useRef } from 'preact/hooks';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';

/**
 * Interactive enhancements for Problems section
 * Adds advanced animations, intersection observer, and analytics
 */
const ProblemsInteractive = (): null => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  usePerformanceMonitor('ProblemsInteractive');

  useEffect(() => {
    const section = document.getElementById('problems');
    if (!section) return;

    sectionRef.current = section;

    // Enhanced intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          const cards = entry.target.querySelectorAll('.problems-card');

          cards.forEach((card, index) => {
            if (!prefersReducedMotion) {
              setTimeout(() => {
                card.classList.add('animate-visible');
              }, index * 150);
            } else {
              card.classList.add('animate-visible');
            }
          });

          // Track analytics
          trackProblemsView();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(section);

    // Card interactions removed - cards are now static for better UX

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // Ripple effect removed - cards are now static

  // Analytics tracking
  const trackProblemsView = () => {
    try {
      const win = window as typeof window & {
        gtag?: (command: string, ...args: unknown[]) => void;
        ym?: (id: number, command: string, ...args: unknown[]) => void;
      };

      if (win.gtag) {
        win.gtag('event', 'problems_section_viewed', {
          event_category: 'engagement',
          event_label: 'problems_section',
        });
      }

      if (win.ym) {
        win.ym(103604926, 'reachGoal', 'problems_viewed');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[ProblemsInteractive] Analytics tracking failed:', error);
      }
    }
  };

  // Card click tracking removed - cards are now static

  return null;
};

export default ProblemsInteractive;
