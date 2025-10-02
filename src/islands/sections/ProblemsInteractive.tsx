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

    // Enhanced card interactions
    const setupCardInteractions = () => {
      const cards = section.querySelectorAll('.problems-card');

      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement;

        // Enhanced hover effects with parallax
        const handleMouseMove = (e: MouseEvent) => {
          if (prefersReducedMotion) return;

          const rect = cardElement.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          cardElement.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(-8px) 
            scale(1.02)
          `;
        };

        const handleMouseLeave = () => {
          if (prefersReducedMotion) return;

          cardElement.style.transform = '';
        };

        const handleClick = () => {
          // Track card interaction
          const problemType = cardElement.querySelector('h3')?.textContent;
          trackProblemCardClick(problemType, index + 1);

          // Add click ripple effect
          if (!prefersReducedMotion) {
            addRippleEffect(cardElement);
          }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        };

        // Add event listeners
        cardElement.addEventListener('mousemove', handleMouseMove);
        cardElement.addEventListener('mouseleave', handleMouseLeave);
        cardElement.addEventListener('click', handleClick);
        cardElement.addEventListener('keydown', handleKeyDown);

        // Store cleanup functions
        (cardElement as HTMLElement & { _cleanup?: () => void })._cleanup = () => {
          cardElement.removeEventListener('mousemove', handleMouseMove);
          cardElement.removeEventListener('mouseleave', handleMouseLeave);
          cardElement.removeEventListener('click', handleClick);
          cardElement.removeEventListener('keydown', handleKeyDown);
        };
      });
    };

    // Initialize interactions
    setupCardInteractions();

    // Cleanup function
    return () => {
      observer.disconnect();

      // Clean up card interactions
      const cards = section.querySelectorAll('.problems-card');
      cards.forEach((card) => {
        const cleanup = (card as HTMLElement & { _cleanup?: () => void })._cleanup;
        if (cleanup) cleanup();
      });
    };
  }, [prefersReducedMotion]);

  // Add ripple effect on click
  const addRippleEffect = (element: HTMLElement) => {
    const ripple = document.createElement('div');
    ripple.className = 'problems-ripple';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.height / 2 - size / 2}px`;

    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

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
        win.ym(88005553535, 'reachGoal', 'problems_viewed');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[ProblemsInteractive] Analytics tracking failed:', error);
      }
    }
  };

  const trackProblemCardClick = (problemType: string | null | undefined, cardIndex: number) => {
    try {
      const win = window as typeof window & {
        gtag?: (command: string, ...args: unknown[]) => void;
        ym?: (id: number, command: string, ...args: unknown[]) => void;
      };

      if (win.gtag) {
        win.gtag('event', 'problem_card_clicked', {
          event_category: 'engagement',
          event_label: problemType || `card_${cardIndex}`,
          custom_parameter_1: cardIndex,
        });
      }

      if (win.ym) {
        win.ym(88005553535, 'reachGoal', 'problem_card_clicked', {
          problem_type: problemType,
          card_index: cardIndex,
        });
      }

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[ProblemsInteractive] Card clicked:', { problemType, cardIndex });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[ProblemsInteractive] Analytics tracking failed:', error);
      }
    }
  };

  return null;
};

export default ProblemsInteractive;
