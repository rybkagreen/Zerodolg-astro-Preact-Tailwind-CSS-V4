import { useState } from 'preact/hooks';
import type { Review } from '../../shared/data/reviews-data';

interface ReviewsEnhancedProps {
  reviews: Review[];
  initialVisible?: number;
  loadMoreCount?: number;
}

const ReviewsEnhanced = ({
  reviews,
  initialVisible = 3,
  loadMoreCount = 3,
}: ReviewsEnhancedProps) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [isLoading, setIsLoading] = useState(false);

  // Format name as "Имя Отчество Ф."
  const formatName = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 3) {
      const [first, patronymic, last] = parts;
      const lastInitial = last ? `${last.charAt(0)}.` : '';
      return `${first} ${patronymic} ${lastInitial}`.trim();
    }
    if (parts.length === 2) {
      const [first, last] = parts;
      const lastInitial = last ? `${last.charAt(0)}.` : '';
      return `${first} ${lastInitial}`.trim();
    }
    return fullName;
  };

  const handleLoadMore = async () => {
    setIsLoading(true);

    // Simulate loading delay for UX
    await new Promise((resolve) => setTimeout(resolve, 400));

    setVisibleCount((prev) => Math.min(prev + loadMoreCount, reviews.length));
    setIsLoading(false);

    // Track analytics
    try {
      const win = window as Window & {
        gtag?: (command: string, ...args: unknown[]) => void;
        ym?: (id: number, command: string, ...args: unknown[]) => void;
      };
      if (win.gtag) {
        win.gtag('event', 'reviews_load_more', {
          event_category: 'engagement',
          event_label: 'reviews',
          value: visibleCount + loadMoreCount,
        });
      }
      if (win.ym) {
        win.ym(103604926, 'reachGoal', 'reviews_load_more');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[ReviewsEnhanced] Analytics tracking failed:', error);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className='reviews-enhanced-wrapper'>
      {/* Reviews Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
        {visibleReviews.map((review, index) => (
          <article
            key={review.id}
            className='group relative w-full h-full flex flex-col bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] overflow-hidden'
            style={{
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              animationDelay: `${(index % loadMoreCount) * 100}ms`,
              minHeight: '420px',
            }}
            itemScope
            itemType='https://schema.org/Review'
          >
            {/* Header */}
            <div className='mb-4'>
              <div className='flex items-start gap-3 mb-3'>
                {/* Avatar Icon */}
                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0'>
                  {review.name.charAt(0)}
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-lg font-bold text-white mb-1 drop-shadow-sm group-hover:text-yellow-400 transition-colors leading-tight'>
                    {formatName(review.name)}
                  </h3>
                  <p className='text-sm text-white/70 leading-relaxed'>
                    {review.profession}, {review.age} лет, {review.city}
                  </p>
                </div>
                {/* Verified Badge */}
                {review.verified && (
                  <div className='flex-shrink-0'>
                    <span className='inline-flex items-center gap-1 px-2 py-1 bg-green-500/30 backdrop-blur-sm text-green-300 text-xs rounded-full border border-green-400/30 font-medium'>
                      <svg width='10' height='10' viewBox='0 0 24 24' fill='none'>
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

            {/* Rating Stars */}
            <div
              className='flex items-center gap-1 mb-4'
              itemProp='reviewRating'
              itemScope
              itemType='https://schema.org/Rating'
            >
              <meta itemProp='ratingValue' content={review.rating.toString()} />
              <meta itemProp='bestRating' content='5' />
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg transition-all duration-200 drop-shadow-sm ${
                    i < review.rating ? 'text-yellow-400 group-hover:scale-110' : 'text-white/30'
                  }`}
                  aria-label={i < review.rating ? 'Полная звезда' : 'Пустая звезда'}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Stats Badges */}
            <div className='flex flex-wrap gap-2 mb-4'>
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-200 border border-red-400/30'>
                💰 {review.debt}
              </span>
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30'>
                ⏱️ {review.duration}
              </span>
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-400/30'>
                📋 {review.procedure}
              </span>
            </div>

            {/* Review Text */}
            <div className='mb-4 flex-1'>
              <blockquote
                className='text-white/90 text-sm leading-relaxed font-medium drop-shadow-sm group-hover:text-white transition-colors duration-300'
                itemProp='reviewBody'
              >
                "{review.text}"
              </blockquote>
            </div>

            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div className='flex flex-wrap gap-1 mb-4'>
                {review.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className='px-2 py-1 bg-white/20 backdrop-blur-sm text-white/80 text-xs rounded-md border border-white/30 font-medium group-hover:bg-white/30 group-hover:text-white transition-all duration-300'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className='mt-auto pt-3 border-t border-white/20'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3 text-xs text-white/70'>
                  <button
                    className='inline-flex items-center gap-1 font-medium transition-all duration-300 hover:text-green-400'
                    aria-label='Полезный отзыв'
                  >
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      className='drop-shadow-sm'
                    >
                      <path
                        d='M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    {review.helpful}
                  </button>
                  <time
                    className='text-xs font-medium'
                    dateTime={review.date}
                    itemProp='datePublished'
                  >
                    {formatDate(review.date)}
                  </time>
                </div>

                {/* Lawyer Badge */}
                {review.lawyer && (
                  <div className='flex items-center gap-1 text-xs text-white/70 bg-white/5 px-2 py-1 rounded-md flex-shrink-0'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' />
                    </svg>
                    <span className='font-medium truncate'>{review.lawyer}</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className='text-center mt-12'>
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className='inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Загрузка...
              </>
            ) : (
              <>
                Загрузить ещё отзывы
                <svg
                  className='w-5 h-5 transition-transform group-hover:translate-y-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </>
            )}
          </button>
          <p className='mt-4 text-slate-600 text-sm font-medium'>
            Показано {visibleCount} из {reviews.length} отзывов
          </p>
        </div>
      )}

      {/* All loaded message */}
      {!hasMore && reviews.length > initialVisible && (
        <div className='text-center mt-12'>
          <p className='text-slate-600 font-medium'>✓ Все отзывы загружены</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsEnhanced;
