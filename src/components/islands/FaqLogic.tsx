// FaqLogic.tsx
import { useEffect } from 'preact/hooks';

export interface FaqProps {
  data?: any;
  [key: string]: any;
}

export default function FaqLogic(_props: FaqProps) {
  useEffect(() => {
    // FAQ Component Logic
    const initializeFAQ = () => {
      const faqItems = document.querySelectorAll('.faq__item');
      
      faqItems.forEach((item) => {
        const button = item.querySelector('.faq__question') as HTMLElement;
        const answer = item.querySelector('.faq__answer') as HTMLElement;
        
        if (button && answer) {
          button.addEventListener('click', () => {
            const isExpanded = item.classList.contains('faq__item--open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.classList.remove('faq__item--open');
                const otherButton = otherItem.querySelector('.faq__question');
                if (otherButton) {
                  otherButton.setAttribute('aria-expanded', 'false');
                }
              }
            });
            
            // Toggle current item
            if (isExpanded) {
              item.classList.remove('faq__item--open');
              button.setAttribute('aria-expanded', 'false');
            } else {
              item.classList.add('faq__item--open');
              button.setAttribute('aria-expanded', 'true');
            }
          });
          
          // Initialize ARIA attributes
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-controls', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
          answer.setAttribute('id', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
        }
      });
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeFAQ);
    } else {
      initializeFAQ();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return null;
}