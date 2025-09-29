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

  return (
    <div className='reviews-interactive'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {reviews.slice(0, visibleReviews).map((review) => (
          <div
            key={review.id}
            className='bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20'
          >
            <h3 className='text-white font-semibold mb-2'>
              {review.author ?? review.name ?? 'Аноним'}
            </h3>
            <div className='flex gap-1 mb-2'>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-white/30'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className='text-white/90 text-sm mb-3'>{review.text}</p>
            <div className='text-xs text-white/70'>
              Полезно: {review.helpful ?? 0} | {review.date}
            </div>
          </div>
        ))}
      </div>

      {visibleReviews < reviews.length && (
        <div className='text-center mt-6'>
          <button
            onClick={handleLoadMore}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleReviewsInteractive;
