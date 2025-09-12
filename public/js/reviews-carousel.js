/**
 * Reviews Carousel Module
 * Professional carousel implementation with touch support and auto-play
 */

class ReviewsCarousel {
  constructor(container) {
    this.container = container;
    this.wrapper = container.querySelector('.reviews__carousel-wrapper');
    this.track = container.querySelector('.reviews__carousel-track');
    this.slides = Array.from(this.track.children);
    this.prevBtn = container.querySelector('.reviews__nav--prev');
    this.nextBtn = container.querySelector('.reviews__nav--next');
    this.indicators = Array.from(container.querySelectorAll('.reviews__indicator'));
    
    this.currentSlide = 0;
    this.slidesPerView = this.getSlidesPerView();
    this.maxSlide = Math.max(0, this.slides.length - this.slidesPerView);
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    this.isAutoplay = container.dataset.autoplay === 'true';
    
    // Virtualization settings
    this.bufferSize = 3; // Number of extra slides to render on each side
    this.renderedSlides = new Set(); // Track which slides are currently rendered
    
    // Добавляем флаг для отслеживания hover 
    this.isHovering = false;
    
    // Pixel-based translate tracking
    this.currentTranslatePx = 0;
    this.prevTranslatePx = 0;
    
    // Touch/drag variables
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;
    this.startTime = null;
    
    // Check if user prefers reduced motion
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }
  
  /**
   * Determine which slides should be rendered based on current view + buffer
   */
  getRenderedSlides() {
    const start = Math.max(0, this.currentSlide - this.bufferSize);
    const end = Math.min(this.slides.length - 1, this.currentSlide + this.slidesPerView + this.bufferSize - 1);
    return { start, end };
  }
  
  /**
   * Update which slides are rendered
   */
  updateRenderedSlides() {
    // This would be implemented if we had actual virtualization
    // For now, we're keeping all slides rendered but this is where
    // we would implement the virtualization logic
  }
  
  init() {
    if (this.slides.length <= 1) return;
    
    // If user prefers reduced motion, adjust settings
    if (this.prefersReducedMotion) {
      this.autoplayDelay = 10000; // Slower autoplay
      // Disable continuous animations
      this.container.classList.add('reduced-motion');
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize position
    this.updateSlidePosition();
    
    // Start autoplay if enabled
    if (this.isAutoplay) {
      this.startAutoplay();
    }
    
    // Handle resize
    this.handleResize();
  }
  
  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch events
    this.track.addEventListener('touchstart', this.touchStart.bind(this));
    this.track.addEventListener('touchmove', this.touchMove.bind(this));
    this.track.addEventListener('touchend', this.touchEnd.bind(this));
    
    // Mouse events for desktop dragging
    this.track.addEventListener('mousedown', this.touchStart.bind(this));
    this.track.addEventListener('mousemove', this.touchMove.bind(this));
    this.track.addEventListener('mouseup', this.touchEnd.bind(this));
    this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
    
    // Prevent context menu on drag
    this.track.addEventListener('contextmenu', e => e.preventDefault());
    
    // Pause autoplay on hover with tracking
    if (this.isAutoplay) {
      this.container.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.pauseAutoplay();
      });
      this.container.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.startAutoplay();
      });
    }
    
    // Отслеживаем hover на карточках для предотвращения переключения
    this.slides.forEach(slide => {
      slide.addEventListener('mouseenter', () => {
        this.pauseAutoplay();
      });
      slide.addEventListener('mouseleave', () => {
        if (!this.isHovering) {
          this.startAutoplay();
        }
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isInViewport()) {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      }
    });
  }
  
  getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }
  
  handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newSlidesPerView = this.getSlidesPerView();
        if (newSlidesPerView !== this.slidesPerView) {
          this.slidesPerView = newSlidesPerView;
          this.maxSlide = Math.max(0, this.slides.length - this.slidesPerView);
          this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
          this.updateSlidePosition();
        }
      }, 250);
    });
  }
  
  updateSlidePosition(progressPx = null) {
    const stepPx = this.getStepPx();
    const translatePx = progressPx !== null
      ? progressPx
      : -(this.currentSlide * stepPx);

    this.currentTranslatePx = translatePx;
    
    // Используем translateX вместо translate3d для лучшей совместимости
    this.track.style.transform = `translateX(${translatePx}px)`;

    // Update navigation buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSlide === 0;
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSlide >= this.maxSlide;
    }

    // Update indicators
    this.updateIndicators();

    // Update ARIA attributes
    this.updateAriaAttributes();
  }
  
  updateIndicators() {
    // Активируем индикатор текущего первого видимого слайда
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentSlide) {
        indicator.classList.add('reviews__indicator--active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('reviews__indicator--active');
        indicator.removeAttribute('aria-current');
        indicator.style.display = '';
      }
    });
  }
  
  updateAriaAttributes() {
    this.slides.forEach((slide, index) => {
      if (index >= this.currentSlide && index < this.currentSlide + this.slidesPerView) {
        slide.setAttribute('aria-hidden', 'false');
        slide.querySelectorAll('button, a').forEach(el => el.tabIndex = 0);
      } else {
        slide.setAttribute('aria-hidden', 'true');
        slide.querySelectorAll('button, a').forEach(el => el.tabIndex = -1);
      }
    });
  }
  
  prevSlide() {
    if (this.currentSlide > 0) {
      // Линейная прокрутка по 1 карточке назад
      this.currentSlide = Math.max(0, this.currentSlide - 1);
      this.updateSlidePosition();
      this.resetAutoplay();
    }
  }
  
  nextSlide() {
    if (this.currentSlide < this.maxSlide) {
      // Линейная прокрутка по 1 карточке вперед
      this.currentSlide = Math.min(this.maxSlide, this.currentSlide + 1);
      this.updateSlidePosition();
      this.resetAutoplay();
    } else if (this.isAutoplay) {
      // Loop back to start if autoplay is enabled
      this.currentSlide = 0;
      this.updateSlidePosition();
    }
  }
  
  goToSlide(index) {
    // Переходим к конкретному слайду (линейная навигация)
    if (index >= 0 && index <= this.maxSlide) {
      this.currentSlide = index;
      this.updateSlidePosition();
      this.resetAutoplay();
    }
  }
  
  // Touch/drag handling
  touchStart(e) {
    this.isDragging = true;
    this.startTime = Date.now();
    this.wrapper.classList.add('dragging');

    this.startPos = this.getPositionX(e);
    // Запоминаем текущий translate в пикселях
    const stepPx = this.getStepPx();
    this.prevTranslatePx = -(this.currentSlide * stepPx);

    // Pause autoplay during drag
    if (this.isAutoplay) {
      this.pauseAutoplay();
    }

    if (e.type.includes('mouse')) {
      e.preventDefault();
    }
  }
  
  touchMove(e) {
    if (!this.isDragging) return;

    const currentPosition = this.getPositionX(e);
    const diff = currentPosition - this.startPos; // px

    const stepPx = this.getStepPx();
    const minTranslate = -(this.maxSlide * stepPx);
    const maxTranslate = 0;

    // Предварительный translate
    let translatePx = this.prevTranslatePx + diff;

    // Сопротивление на границах
    if (translatePx > maxTranslate) {
      translatePx = maxTranslate + (translatePx - maxTranslate) * 0.3;
    } else if (translatePx < minTranslate) {
      translatePx = minTranslate + (translatePx - minTranslate) * 0.3;
    }

    this.currentTranslatePx = translatePx;
    this.track.style.transform = `translate3d(${translatePx}px, 0, 0)`;
  }
  
  touchEnd(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.wrapper.classList.remove('dragging');

    const movedByPx = this.currentTranslatePx - this.prevTranslatePx;
    const timeDiff = Date.now() - this.startTime;
    const velocity = Math.abs(movedByPx) / Math.max(timeDiff, 1); // px/ms

    const stepPx = this.getStepPx();
    const threshold = stepPx / 3;

    let targetSlide = this.currentSlide;

    if (Math.abs(movedByPx) > threshold || velocity > 0.6) {
      const steps = Math.max(1, Math.round(Math.abs(movedByPx) / stepPx));
      if (movedByPx < 0) {
        targetSlide = Math.min(this.currentSlide + steps, this.maxSlide);
      } else {
        targetSlide = Math.max(this.currentSlide - steps, 0);
      }
    }

    this.currentSlide = targetSlide;
    this.updateSlidePosition();

    // Resume autoplay
    if (this.isAutoplay) {
      this.startAutoplay();
    }
  }
  
  getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }
  
  // Helpers to compute pixel-perfect steps
  getGapPx() {
    const styles = window.getComputedStyle(this.track);
    const gapStr = styles.gap || styles.columnGap || styles.rowGap || '0px';
    const gap = parseFloat(gapStr);
    return Number.isFinite(gap) ? gap : 0;
  }

  getStepPx() {
    // width of one slide + flex gap between slides
    const firstSlide = this.slides[0];
    if (!firstSlide) return 0;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const gap = this.getGapPx();
    return slideWidth + gap;
  }
  
  // Autoplay functionality
  startAutoplay() {
    if (!this.isAutoplay) return;
    
    this.pauseAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
    
    // Add progress bar animation
    const progressBar = this.container.querySelector('.reviews__progress-bar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      setTimeout(() => {
        progressBar.style.animation = '';
      }, 10);
    }
  }
  
  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
  
  resetAutoplay() {
    if (this.isAutoplay) {
      this.startAutoplay();
    }
  }
  
  // Check if carousel is in viewport
  isInViewport() {
    const rect = this.container.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Public API
  destroy() {
    this.pauseAutoplay();
    this.track.style.transform = '';
    this.wrapper.classList.remove('dragging');
  }
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.reviews__carousel');
  
  carousels.forEach(carousel => {
    new ReviewsCarousel(carousel);
  });
  
  // Animate stats counters when in view
  const animateStats = () => {
    const stats = document.querySelectorAll('.reviews__stat-number[data-count-to]');
    
    stats.forEach(stat => {
      if (stat.dataset.animated) return;
      
      const rect = stat.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        stat.dataset.animated = 'true';
        
        const target = parseFloat(stat.dataset.countTo);
        const decimals = parseInt(stat.dataset.decimals) || 0;
        const duration = 2000;
        const start = 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = current.toFixed(decimals);
        }, 16);
      }
    });
  };
  
  // Run on scroll and initial load
  animateStats();
  window.addEventListener('scroll', animateStats, { passive: true });
});
