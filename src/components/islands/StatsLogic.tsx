import { useEffect } from 'preact/hooks';

const StatsLogic = () => {
  useEffect(() => {
    // Animate numbers when they come into view
    const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
      const startTimestamp = Date.now();
      const step = () => {
        const timestamp = Date.now();
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * (end - start) + start);
        
        const suffix = element.getAttribute('data-suffix') || '';
        element.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    // Set up Intersection Observer for number animation
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const numberObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          const element = entry.target as HTMLElement;
          const shouldAnimate = element.getAttribute('data-animate') === 'true';
          
          if (shouldAnimate) {
            const endValue = parseInt(element.getAttribute('data-value') || '0');
            const suffix = element.getAttribute('data-suffix') || '';
            
            // Start animation
            element.classList.add('animated');
            element.textContent = '0' + suffix;
            
            setTimeout(() => {
              animateValue(element, 0, endValue, 2000);
            }, 200);
          }
        }
      });
    }, observerOptions);

    // Observe all number elements
    const numberElements = document.querySelectorAll('.stats__number[data-animate="true"]');
    numberElements.forEach(element => {
      numberObserver.observe(element);
    });

    // Live visitor count simulation
    const updateLiveCount = () => {
      const liveCountElement = document.querySelector('[data-live-count]');
      if (liveCountElement) {
        const baseCount = 15;
        const variance = 8;
        const count = baseCount + Math.floor(Math.random() * variance);
        const text = count === 1 ? 'человек' : 'человек';
        liveCountElement.textContent = `${count} ${text}`;
      }
    };

    // Update live count periodically
    updateLiveCount();
    const liveCountInterval = setInterval(updateLiveCount, 30000); // Every 30 seconds

    // Ticker animation pause on hover
    const ticker = document.querySelector('[data-ticker]') as HTMLElement;
    if (ticker) {
      ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
      });
      
      ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
      });
    }

    // Stats item hover effects with tilt
    const statsItems = document.querySelectorAll('.stats__item');
    statsItems.forEach(item => {
      const element = item as HTMLElement;
      
      element.addEventListener('mouseenter', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e as MouseEvent).clientX - rect.left;
        const y = (e as MouseEvent).clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        element.style.transform = `
          perspective(1000px)
          rotateY(${deltaX * 5}deg)
          rotateX(${-deltaY * 5}deg)
          translateY(-4px)
        `;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    });

    // Add parallax effect to stats section
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      const handleParallax = () => {
        const scrolled = window.pageYOffset;
        const rect = statsSection.getBoundingClientRect();
        const speed = 0.5;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = -(scrolled * speed);
          (statsSection as HTMLElement).style.backgroundPosition = `center ${yPos}px`;
        }
      };

      window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // Cleanup
    return () => {
      clearInterval(liveCountInterval);
      numberElements.forEach(element => {
        numberObserver.unobserve(element);
      });
    };
  }, []);

  return null;
};

export default StatsLogic;
