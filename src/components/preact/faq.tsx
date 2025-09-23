// Faq.tsx
import { useEffect } from 'preact/hooks';

export interface FaqProps {
  data?: any;
  [key: string]: any;
}

export default function Faq(_props: FaqProps) {
  // eslint-disable-line @typescript-eslint/no-unused-vars
  useEffect(() => {
    // FAQ accordion functionality
    const initializeFAQ = () => {
      const faqItems = document.querySelectorAll('[data-faq-item]');

      faqItems.forEach((item) => {
        const trigger = item.querySelector('[data-faq-trigger]') as HTMLElement;
        const content = item.querySelector('[data-faq-content]') as HTMLElement;

        if (!trigger || !content) return;

        // Ensure correct initial state
        item.classList.remove('faq__item--expanded');

        trigger.addEventListener('click', () => {
          const isOpen = trigger.getAttribute('aria-expanded') === 'true';

          // Close all other items
          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              const otherTrigger = otherItem.querySelector('[data-faq-trigger]') as HTMLElement;
              const otherContent = otherItem.querySelector('[data-faq-content]') as HTMLElement;

              if (otherTrigger && otherContent) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherContent.setAttribute('aria-hidden', 'true');
                otherItem.classList.remove('faq__item--expanded');
                // Remove inline style for closing
                otherContent.style.maxHeight = '';
              }
            }
          });

          // Toggle current item
          if (isOpen) {
            // Close
            trigger.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
            item.classList.remove('faq__item--expanded');
            // Remove inline style for closing
            content.style.maxHeight = '';
          } else {
            // Open
            trigger.setAttribute('aria-expanded', 'true');
            content.setAttribute('aria-hidden', 'false');
            item.classList.add('faq__item--expanded');
            // Set max height for animation
            content.style.maxHeight = content.scrollHeight + 'px';

            // Recalculate height after transition for dynamic content
            setTimeout(() => {
              if (trigger.getAttribute('aria-expanded') === 'true' && content) {
                content.style.maxHeight = content.scrollHeight + 'px';
              }
            }, 300);
          }
        });
      });
    };

    // Handle window resize to adjust opened accordions
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const faqItems = document.querySelectorAll('[data-faq-item]');
        faqItems.forEach((item) => {
          const trigger = item.querySelector('[data-faq-trigger]') as HTMLElement;
          const content = item.querySelector('[data-faq-content]') as HTMLElement;

          if (trigger?.getAttribute('aria-expanded') === 'true' && content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      }, 250);
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeFAQ);
    } else {
      initializeFAQ();
    }

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null;
}
