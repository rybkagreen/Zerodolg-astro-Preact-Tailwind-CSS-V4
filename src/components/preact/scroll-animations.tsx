import { useEffect } from 'preact/hooks';

interface ScrollAnimationsProps {
  offset?: number;
  duration?: number;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?: string;
}

/**
 * ScrollAnimations Component
 * Handles scroll-triggered animations for elements with data-aos attributes
 * Based on AOS (Animate On Scroll) library concepts
 */
export default function ScrollAnimations({
  offset = 120,
  duration = 800,
  once = false,
  mirror = false
}: ScrollAnimationsProps) {
  // anchorPlacement parameter available but unused in current implementation
  useEffect(() => {
    // Get all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;

    // IntersectionObserver options
    const observerOptions = {
      root: null,
      rootMargin: `-${offset}px 0px`,
      threshold: 0.1
    };

    // Track which elements have been animated
    const animatedSet = new Set<Element>();

    // IntersectionObserver callback
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          // Element is visible - add animation
          element.classList.add('aos-animated');
          animatedSet.add(element);
          
          // If once is true, stop observing this element
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once || mirror) {
          // Element is not visible and we should remove animation
          if (animatedSet.has(element)) {
            element.classList.remove('aos-animated');
            animatedSet.delete(element);
          }
        }
      });
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements
    animatedElements.forEach((element) => {
      // Apply custom duration if specified on element
      const customDuration = element.getAttribute('data-aos-duration');
      if (customDuration) {
        (element as HTMLElement).style.transitionDuration = `${customDuration}ms`;
      } else {
        (element as HTMLElement).style.transitionDuration = `${duration}ms`;
      }

      // Apply custom delay if specified on element
      const customDelay = element.getAttribute('data-aos-delay');
      if (customDelay) {
        (element as HTMLElement).style.transitionDelay = `${customDelay}ms`;
      }

      // Apply custom easing if specified on element
      const customEasing = element.getAttribute('data-aos-easing');
      if (customEasing) {
        (element as HTMLElement).style.transitionTimingFunction = customEasing;
      }

      // Start observing
      observer.observe(element);
    });

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [offset, duration, once, mirror]);

  // This component doesn't render anything
  return null;
}

/**
 * Utility function to trigger re-initialization of animations
 * Useful after dynamic content is added to the page
 */
export function refreshScrollAnimations() {
  const event = new CustomEvent('aos:refresh');
  window.dispatchEvent(event);
}

/**
 * Utility function to programmatically trigger animation on an element
 */
export function animateElement(element: HTMLElement) {
  if (element.hasAttribute('data-aos')) {
    element.classList.add('aos-animated');
  }
}

/**
 * Utility function to reset animation on an element
 */
export function resetAnimation(element: HTMLElement) {
  if (element.hasAttribute('data-aos')) {
    element.classList.remove('aos-animated');
  }
}
