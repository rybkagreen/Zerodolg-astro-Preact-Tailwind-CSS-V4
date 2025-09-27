import { useEffect, useRef, useState } from 'preact/hooks';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Хук для отслеживания видимости элемента с помощью Intersection Observer
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverOptions = {}
): [import("preact").RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const { threshold = 0, root = null, rootMargin = '0px', triggerOnce = false } = options;
  
  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;
    
    // Skip if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggeredRef.current) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry) {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
        
        if (entry.isIntersecting && triggerOnce) {
          hasTriggeredRef.current = true;
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [elementRef as import("preact").RefObject<T>, isIntersecting, entry];
}