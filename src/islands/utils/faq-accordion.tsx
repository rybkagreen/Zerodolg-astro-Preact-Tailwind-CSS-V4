import { useEffect } from 'preact/hooks';

/**
 * FAQ Accordion Handler Component
 * Handles interaction with static FAQ HTML elements using data-faq-* attributes
 */
const FaqAccordion = () => {
  useEffect(() => {
    const initFaqAccordion = () => {
      const faqItems = document.querySelectorAll('[data-faq-item]');

      faqItems.forEach((item) => {
        const trigger = item.querySelector('[data-faq-trigger]') as HTMLButtonElement;
        const content = item.querySelector('[data-faq-content]') as HTMLElement;
        const icon = trigger?.querySelector('.faq__icon') as HTMLElement;

        if (!trigger || !content) return;

        // Skip if already initialized
        if (trigger.hasAttribute('data-faq-initialized')) return;
        trigger.setAttribute('data-faq-initialized', 'true');

        // Set initial state
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        content.style.maxHeight = isExpanded ? `${content.scrollHeight}px` : '0px';
        content.style.opacity = isExpanded ? '1' : '0';
        content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';

        const clickHandler = () => {
          const currentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

          // Close all other items first (accordion behavior)
          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              const otherTrigger = otherItem.querySelector(
                '[data-faq-trigger]'
              ) as HTMLButtonElement;
              const otherContent = otherItem.querySelector('[data-faq-content]') as HTMLElement;
              const otherIcon = otherTrigger?.querySelector('.faq__icon') as HTMLElement;

              if (otherTrigger && otherContent) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherContent.setAttribute('aria-hidden', 'true');
                otherContent.style.maxHeight = '0px';
                otherContent.style.opacity = '0';
                if (otherIcon) {
                  otherIcon.style.transform = 'rotate(0deg)';
                }
              }
            }
          });

          // Toggle current item
          if (currentlyExpanded) {
            // Close
            trigger.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
            if (icon) {
              icon.style.transform = 'rotate(0deg)';
            }
          } else {
            // Open
            trigger.setAttribute('aria-expanded', 'true');
            content.setAttribute('aria-hidden', 'false');
            content.style.maxHeight = `${content.scrollHeight}px`;
            content.style.opacity = '1';
            if (icon) {
              icon.style.transform = 'rotate(180deg)';
            }
          }
        };

        trigger.addEventListener('click', clickHandler);
      });
    };

    // Wait for DOM to be fully loaded
    const timeoutId = setTimeout(() => {
      initFaqAccordion();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything, it just handles interactions
  return null;
};

export default FaqAccordion;
