import { useState, useEffect } from 'preact/hooks';

interface Review {
  id: string;
  name: string;
  age?: number;
  city?: string;
  date: string;
  rating: number;
  debt?: string;
  duration?: string;
  profession?: string;
  procedure?: string;
  text: string;
  verified?: boolean;
  tags?: string[];
  lawyer?: string;
  photo?: string;
}

interface ReviewsData {
  stats: {
    total_reviews: number;
    average_rating: number;
    five_stars_percent: number;
    verified_percent: number;
  };
  trust_signals: Record<string, any>;
  reviews: Review[];
}

interface ReviewsLogicProps {
  reviewsData: ReviewsData;
}

export default function ReviewsLogic({ reviewsData }: ReviewsLogicProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  useEffect(() => {
    // Animate counters when component mounts
    animateCounters();
    
    // Setup intersection observer for reviews
    setupReviewsObserver();
  }, []);

  useEffect(() => {
    // Update displayed reviews when page changes
    updateReviewsDisplay();
  }, [currentPage]);

  /**
   * Animate statistics counters
   */
  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count-to]');
    
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-count-to') || '0');
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = target * easedProgress;
        
        // Format the number
        if (decimals > 0) {
          counter.textContent = current.toFixed(decimals);
        } else {
          counter.textContent = Math.floor(current).toString();
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (decimals > 0) {
            counter.textContent = target.toFixed(decimals);
          } else {
            counter.textContent = Math.floor(target).toString();
          }
        }
      };
      
      // Start animation when element is in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              requestAnimationFrame(animate);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      if (counter instanceof HTMLElement) {
        observer.observe(counter);
      }
    });
  };

  /**
   * Setup intersection observer for review cards
   */
  const setupReviewsObserver = () => {
    const reviewCards = document.querySelectorAll('.review-card');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('review-card--visible');
            }, index * 100); // Stagger animation
          }
        });
      },
      { threshold: 0.1 }
    );
    
    reviewCards.forEach(card => {
      observer.observe(card);
    });
  };

  /**
   * Update reviews display based on current page
   */
  const updateReviewsDisplay = () => {
    const grid = document.querySelector('.reviews__grid');
    if (!grid) return;

    const start = (currentPage - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    const pageReviews = reviewsData.reviews.slice(start, end);

    // Clear current reviews
    const reviewCards = grid.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
      card.classList.add('review-card--fade-out');
    });

    setTimeout(() => {
      // Update grid with new reviews
      grid.innerHTML = pageReviews.map(review => createReviewCardHTML(review)).join('');
      
      // Re-setup observer for new cards
      setupReviewsObserver();
      
      // Scroll to top of reviews section
      const reviewsSection = document.querySelector('.reviews');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  /**
   * Create HTML for review card
   */
  const createReviewCardHTML = (review: Review): string => {
    const initials = review.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const formattedDate = new Date(review.date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <article class="review-card ${review.verified ? 'review-card--verified' : ''}" data-review-id="${review.id}">
        <div class="review-card__header">
          <div class="review-card__avatar">
            ${review.photo ? 
              `<img src="${review.photo}" alt="Фото клиента ${review.name}" loading="lazy">` :
              `<span class="review-card__avatar-text">${initials}</span>`
            }
          </div>
          <div class="review-card__info">
            <div class="review-card__name">${review.name}</div>
            <div class="review-card__meta">
              ${review.age ? `<span>${review.age} лет</span>` : ''}
              ${review.city ? `<span>${review.city}</span>` : ''}
              <span class="review-card__date">${formattedDate}</span>
            </div>
          </div>
        </div>
        
        <div class="review-card__rating">
          <div class="rating-stars">
            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
          </div>
          <div class="rating-text">
            <span class="rating-number">${review.rating}</span> из 5
          </div>
        </div>
        
        ${(review.debt || review.duration || review.profession) ? `
          <div class="review-card__details">
            ${review.debt ? `
              <div class="review-card__detail">
                <div class="review-card__detail-label">Долг</div>
                <div class="review-card__detail-value">${review.debt}</div>
              </div>
            ` : ''}
            ${review.duration ? `
              <div class="review-card__detail">
                <div class="review-card__detail-label">Срок</div>
                <div class="review-card__detail-value">${review.duration}</div>
              </div>
            ` : ''}
            ${review.profession ? `
              <div class="review-card__detail">
                <div class="review-card__detail-label">Профессия</div>
                <div class="review-card__detail-value">${review.profession}</div>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        <div class="review-card__content">
          <div class="review-card__text">${review.text}</div>
          ${review.tags && review.tags.length > 0 ? `
            <div class="review-card__tags">
              ${review.tags.map(tag => `<span class="review-tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="review-card__footer">
          ${review.verified ? '<div class="review-card__verified review-card__verified--enhanced">Проверено</div>' : ''}
        </div>
      </article>
    `;
  };

  /**
   * Handle page change
   */
  const goToPage = (page: number) => {
    setCurrentPage(page);
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'reviews_page_change', {
        page_number: page
      });
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(reviewsData.reviews.length / reviewsPerPage);

  // Render pagination controls
  useEffect(() => {
    const paginationContainer = document.querySelector('.reviews__pagination');
    if (!paginationContainer || totalPages <= 1) return;

    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<button class="reviews__page-btn reviews__page-btn--prev" data-page="${currentPage - 1}">←</button>`;
    }
    
    // Page numbers with ellipsis for many pages
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      paginationHTML += `<button class="reviews__page-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="reviews__page-ellipsis">...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage ? ' reviews__page-btn--active' : '';
      paginationHTML += `<button class="reviews__page-btn${isActive}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="reviews__page-ellipsis">...</span>`;
      }
      paginationHTML += `<button class="reviews__page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<button class="reviews__page-btn reviews__page-btn--next" data-page="${currentPage + 1}">→</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add click handlers
    const buttons = paginationContainer.querySelectorAll('.reviews__page-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const page = parseInt(target.getAttribute('data-page') || '1');
        goToPage(page);
      });
    });
  }, [currentPage, totalPages]);

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .review-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      
      .review-card--visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .review-card--fade-out {
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .reviews__page-ellipsis {
        padding: 0.5rem;
        color: rgba(255, 255, 255, 0.5);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component only handles logic, no UI
}
