import { useState } from 'preact/hooks';

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
  age?: number;
  city?: string;
  debt?: string;
  duration?: string;
  profession?: string;
  procedure?: string;
  lawyer?: string;
}

interface ReviewsInteractiveProps {
  reviews: Review[];
  initialVisible?: number;
}

const SimpleReviewsInteractive = ({ reviews, initialVisible = 3 }: ReviewsInteractiveProps) => {
  const [visibleReviews, setVisibleReviews] = useState(initialVisible);

  const handleLoadMore = () => {
    const newVisible = Math.min(visibleReviews + 3, reviews.length);
    setVisibleReviews(newVisible);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  return (
    <div className='reviews-interactive'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <article
            key={review.id}
            className='group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Top Accent Line */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            
            {/* Verified Badge */}
            {review.verified && (
              <div className='absolute -top-3 -right-3 bg-gradient-to-br from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1'>
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                </svg>
                Проверено
              </div>
            )}

            {/* Header with Author Info */}
            <div className='mb-4'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                  <h3 className='text-white font-bold text-lg mb-1 group-hover:text-yellow-400 transition-colors'>
                    {review.author ?? review.name ?? 'Аноним'}
                  </h3>
                  {review.profession && review.age && review.city && (
                    <p className='text-white/70 text-sm font-medium'>
                      {review.profession}, {review.age} лет, {review.city}
                    </p>
                  )}
                </div>
                {/* Rating Stars */}
                <div className='flex gap-0.5 ml-2'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl transition-transform group-hover:scale-110 ${
                        i < review.rating ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-white/20'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Stats Badges */}
              {(review.debt || review.duration || review.procedure) && (
                <div className='flex flex-wrap gap-2 mb-3'>
                  {review.debt && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-200 border border-red-400/30'>
                      💰 {review.debt}
                    </span>
                  )}
                  {review.duration && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30'>
                      ⏱️ {review.duration}
                    </span>
                  )}
                  {review.procedure && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30'>
                      📋 {review.procedure}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Review Text */}
            <p className='text-white/90 text-base leading-relaxed mb-4 line-clamp-4 group-hover:line-clamp-none transition-all'>
              {review.text}
            </p>

            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-4'>
                {review.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className='px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-colors'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className='flex items-center justify-between pt-4 border-t border-white/10'>
              <div className='flex items-center gap-4 text-sm text-white/60'>
                {/* Helpful Count */}
                <div className='flex items-center gap-1 hover:text-white/90 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5' />
                  </svg>
                  <span className='font-semibold'>{review.helpful ?? 0}</span>
                </div>
                {/* Date */}
                <time className='text-xs font-medium'>{formatDate(review.date)}</time>
              </div>
              {/* Lawyer Badge */}
              {review.lawyer && (
                <div className='flex items-center gap-1 text-xs text-white/70 bg-white/5 px-2 py-1 rounded-md'>
                  <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' />
                  </svg>
                  <span className='font-medium'>{review.lawyer}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {visibleReviews < reviews.length && (
        <div className='text-center mt-12'>
          <button
            onClick={handleLoadMore}
            className='group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden'
          >
            <span className='relative z-10 flex items-center gap-2'>
              Показать ещё отзывы
              <svg className='w-5 h-5 transition-transform group-hover:translate-y-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </span>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          </button>
          <p className='mt-4 text-white/60 text-sm font-medium'>
            Показано {visibleReviews} из {reviews.length} отзывов
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleReviewsInteractive;
