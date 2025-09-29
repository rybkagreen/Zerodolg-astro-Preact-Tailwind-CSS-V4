import { useState, useRef } from 'preact/hooks';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';

interface Review {
  id: string;
  author?: string;
  name?: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  helpful?: number;
  tags?: string[];
}

interface ReviewsInteractiveProps {
  reviews: Review[];
  initialVisible?: number;
}

const ReviewsInteractive = ({ reviews, initialVisible = 3 }: ReviewsInteractiveProps) => {
  const [visibleReviews, setVisibleReviews] = useState(initialVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({});

  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  usePerformanceMonitor('ReviewsInteractive');

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Handle load more reviews
  const handleLoadMore = async () => {
    if (visibleReviews >= reviews.length) return;

    setIsLoading(true);

    // Simulate loading delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newVisible = Math.min(visibleReviews + 3, reviews.length);
    setVisibleReviews(newVisible);
    setIsLoading(false);

    // Animate new cards
    if (!prefersReducedMotion && gridRef.current) {
      const newCards = gridRef.current.querySelectorAll(
        `article:nth-child(n+${visibleReviews + 1})`
      );
      newCards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';

        setTimeout(() => {
          cardElement.style.transition = 'all 0.6s ease-out';
          cardElement.style.opacity = '1';
          cardElement.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }

    // Track analytics
    trackLoadMoreReviews(newVisible);
  };

  // Handle helpful button click
  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulClicks[reviewId]) return; // Already clicked

    setHelpfulClicks((prev) => ({ ...prev, [reviewId]: true }));

    // Track analytics
    trackHelpfulClick(reviewId);
  };

  // Analytics tracking
  const trackLoadMoreReviews = (newTotal: number) => {
    try {
      const win = window as any;
      if (win.gtag) {
        win.gtag('event', 'reviews_load_more', {
          event_category: 'engagement',
          event_label: 'reviews',
          value: newTotal,
        });
      }
      if (win.ym) {
        win.ym(88005553535, 'reachGoal', 'reviews_load_more', { total: newTotal });
      }
    } catch (error) {
      console.warn('[ReviewsInteractive] Analytics tracking failed:', error);
    }
  };

  const trackHelpfulClick = (reviewId: string) => {
    try {
      const win = window as any;
      if (win.gtag) {
        win.gtag('event', 'review_helpful_clicked', {
          event_category: 'engagement',
          event_label: reviewId,
        });
      }
      if (win.ym) {
        win.ym(88005553535, 'reachGoal', 'review_helpful', { review_id: reviewId });
      }
    } catch (error) {
      console.warn('[ReviewsInteractive] Analytics tracking failed:', error);
    }
  };

  return (
    <div className='reviews-interactive'>
      {/* Reviews Grid */}
      <div
        ref={gridRef}
        id='reviews-grid'
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      >
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <article
            key={review.id}
            className='group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105'
            style={{
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
            data-index={index}
          >
            {/* Header */}
            <div className='mb-4'>
              <div className='flex items-start gap-3'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg'>
                  {(review.author ?? review.name ?? '').charAt(0)}
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-bold text-white mb-1 drop-shadow-sm'>
                    {review.author ?? review.name ?? ''}
                  </h3>
                  <time className='text-sm text-white/70 block font-medium'>
                    {formatDate(review.date)}
                  </time>
                </div>
                {review.verified && (
                  <div className='ml-auto'>
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-500/30 backdrop-blur-sm text-green-300 text-xs rounded-full border border-green-400/30 font-medium'>
                      <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      Проверено
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className='flex gap-1 mb-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xl transition-all duration-200 drop-shadow-sm ${
                    i < review.rating ? 'text-yellow-400 group-hover:scale-110' : 'text-white/30'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review Text */}
            <p className='text-white/90 mb-4 leading-relaxed font-medium drop-shadow-sm group-hover:text-white transition-colors duration-300'>
              {review.text}
            </p>

            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-4'>
                {review.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className='px-3 py-1 bg-white/20 backdrop-blur-sm text-white/80 text-xs rounded-full border border-white/30 font-medium group-hover:bg-white/30 group-hover:text-white transition-all duration-300'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className='flex justify-between items-center pt-4 border-t border-white/20'>
              <button
                onClick={() => handleHelpfulClick(review.id)}
                disabled={helpfulClicks[review.id]}
                className={`inline-flex items-center gap-2 font-medium transition-all duration-300 hover:scale-105 ${
                  helpfulClicks[review.id] ? 'text-green-400' : 'text-white/70 hover:text-white'
                }`}
              >
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  className='drop-shadow-sm'
                >
                  <path
                    d='M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3'
                    stroke='currentColor'
                    fill={helpfulClicks[review.id] ? 'currentColor' : 'none'}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Полезно ({(review.helpful ?? 0) + (helpfulClicks[review.id] ? 1 : 0)})
              </button>

              <button className='text-white/70 hover:text-white transition-all duration-300 hover:scale-110'>
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  className='drop-shadow-sm'
                >
                  <path
                    d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {visibleReviews < reviews.length && (
        <div className='text-center mt-12'>
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className='inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            style={{
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            <span>{isLoading ? 'Загрузка...' : 'Загрузить ещё отзывы'}</span>
            {isLoading ? (
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                className='drop-shadow-sm animate-spin'
              >
                <path
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                className='drop-shadow-sm'
              >
                <path
                  d='M6 9l6 6 6-6'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {visibleReviews >= reviews.length && (
        <div className='text-center mt-12'>
          <span className='text-white/70 font-medium'>Все отзывы загружены</span>
        </div>
      )}
    </div>
  );
};

export default ReviewsInteractive;
