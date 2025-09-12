import { useEffect, useRef, useState } from 'preact/hooks';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  once?: boolean;
  enableScrollTrigger?: boolean;
  scrollOffset?: number;
  className?: string;
  onComplete?: () => void;
}

/**
 * AnimatedCounter Component
 * Animates numbers from start to end value with formatting options
 * Can be triggered on scroll or immediately
 */
export default function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ' ',
  once = true,
  enableScrollTrigger = true,
  scrollOffset = 100,
  className = '',
  onComplete
}: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Format number with separator (e.g., 1000 -> 1 000)
  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  // Easing function for smooth animation
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  // Animation function
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    const current = start + (end - start) * easedProgress;
    setCurrentValue(current);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setHasAnimated(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating || (once && hasAnimated)) return;

    setIsAnimating(true);
    startTimeRef.current = undefined;
    
    if (delay > 0) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Reset animation
  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCurrentValue(start);
    setIsAnimating(false);
    setHasAnimated(false);
    startTimeRef.current = undefined;
  };

  // Set up scroll trigger
  useEffect(() => {
    if (!enableScrollTrigger || !elementRef.current) {
      // Start immediately if scroll trigger is disabled
      if (!enableScrollTrigger) {
        startAnimation();
      }
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: `-${scrollOffset}px 0px`,
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimation();
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once && hasAnimated) {
          resetAnimation();
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enableScrollTrigger, scrollOffset, once]);

  // Add pulse effect when animation completes
  const pulseClass = hasAnimated && !isAnimating ? 'animate-pulse-once' : '';

  return (
    <span 
      ref={elementRef}
      className={`animated-counter ${className} ${pulseClass}`}
      data-end={end}
      data-start={start}
    >
      {prefix}
      <span className="counter-value">
        {formatNumber(currentValue)}
      </span>
      {suffix}
    </span>
  );
}

/**
 * Hook for using animated counter functionality
 */
export function useAnimatedCounter(
  end: number,
  options: Omit<AnimatedCounterProps, 'end'> = {}
) {
  const [value, setValue] = useState(options.start || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startValue = options.start || 0;
    const duration = options.duration || 2000;
    const startTime = performance.now();
    
    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      
      const current = startValue + (end - startValue) * easedProgress;
      setValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setIsAnimating(false);
        if (options.onComplete) {
          options.onComplete();
        }
      }
    };
    
    requestAnimationFrame(update);
  };
  
  const reset = () => {
    setValue(options.start || 0);
    setIsAnimating(false);
  };
  
  return { value, isAnimating, animate, reset };
}

// CSS styles for pulse effect
const styles = `
  @keyframes pulse-once {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-pulse-once {
    animation: pulse-once 0.5s ease-out;
  }
  
  .animated-counter {
    display: inline-block;
    font-variant-numeric: tabular-nums;
  }
  
  .counter-value {
    font-weight: bold;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
