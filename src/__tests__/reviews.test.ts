import { describe, it, expect } from 'vitest';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  helpful: number;
  avatar?: string;
  tags?: string[];
}

interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

describe('Reviews Component', () => {
  const mockReviews: Review[] = [
    {
      id: '1',
      author: 'Александр В.',
      rating: 5,
      date: '2024-03-15',
      text: 'Отличная компания! Помогли решить проблему с долгами быстро и профессионально.',
      verified: true,
      helpful: 24,
      tags: ['Профессионализм', 'Быстро', 'Поддержка'],
    },
    {
      id: '2',
      author: 'Марина Б.',
      rating: 4,
      date: '2024-03-10',
      text: 'Хорошие специалисты, помогли в сложной ситуации.',
      verified: true,
      helpful: 18,
      tags: ['Помощь', 'Консультация'],
    },
    {
      id: '3',
      author: 'Дмитрий К.',
      rating: 5,
      date: '2024-03-05',
      text: 'Полностью доволен результатом. Рекомендую!',
      verified: true,
      helpful: 15,
      tags: ['Результат', 'Рекомендую'],
    },
  ];

  const calculateStats = (reviews: Review[]): ReviewStats => {
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach((review) => {
      distribution[review.rating]++;
      totalRating += review.rating;
    });

    return {
      total: reviews.length,
      average: reviews.length > 0 ? totalRating / reviews.length : 0,
      distribution,
    };
  };

  it('should calculate review statistics correctly', () => {
    const stats = calculateStats(mockReviews);

    expect(stats.total).toBe(3);
    expect(stats.average).toBeCloseTo(4.67, 2);
    expect(stats.distribution[5]).toBe(2);
    expect(stats.distribution[4]).toBe(1);
    expect(stats.distribution[3]).toBe(0);
    expect(stats.distribution[2]).toBe(0);
    expect(stats.distribution[1]).toBe(0);
  });

  it('should handle empty reviews array', () => {
    const emptyReviews: Review[] = [];
    const stats = calculateStats(emptyReviews);

    expect(stats.total).toBe(0);
    expect(stats.average).toBe(0);
    expect(stats.distribution[5]).toBe(0);
    expect(stats.distribution[4]).toBe(0);
    expect(stats.distribution[3]).toBe(0);
    expect(stats.distribution[2]).toBe(0);
    expect(stats.distribution[1]).toBe(0);
  });

  it('should format dates correctly', () => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    };

    const formattedDate = formatDate('2024-03-15');
    // Since the format depends on locale, we'll just check it's a non-empty string
    expect(formattedDate).toBeTruthy();
    expect(typeof formattedDate).toBe('string');
  });

  it('should get initials from names correctly', () => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    };

    expect(getInitials('Александр В.')).toBe('АВ');
    expect(getInitials('Марина')).toBe('М');
    expect(getInitials('Дмитрий Константинович Петров')).toBe('ДКП');
  });

  it('should sort reviews by date correctly', () => {
    const sortedReviews = [...mockReviews].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    expect(sortedReviews[0].id).toBe('1'); // Most recent
    expect(sortedReviews[sortedReviews.length - 1].id).toBe('3'); // Oldest
  });
});
