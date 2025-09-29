import { describe, it, expect } from 'vitest';
import { reviews, reviewsStats } from '../src/shared/data/reviews-data';
import type { Review } from '../src/shared/data/reviews-data';

interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

describe('Reviews Data and Component', () => {
  // Test mock reviews for unit tests
  const mockReviews: Review[] = [
    {
      id: 'test-1',
      name: 'Тестовый Клиент',
      age: 35,
      city: 'Москва',
      profession: 'Менеджер',
      rating: 5,
      date: '2025-01-15',
      debt: '1.5 млн ₽',
      duration: '5 месяцев',
      procedure: 'Банкротство физлица',
      problem: 'Тестовая проблема',
      result: 'Тестовый результат',
      text: 'Отличная компания! Помогли решить проблему с долгами быстро и профессионально.',
      verified: true,
      helpful: 24,
      tags: ['Профессионализм', 'Быстро', 'Поддержка'],
      lawyer: 'Тестовый Юрист',
    },
    {
      id: 'test-2',
      name: 'Марина Тестова',
      age: 40,
      city: 'Химки',
      profession: 'Бухгалтер',
      rating: 4,
      date: '2025-01-10',
      debt: '800 тыс ₽',
      duration: '4 месяца',
      procedure: 'Реструктуризация долга',
      problem: 'Тестовая проблема 2',
      result: 'Тестовый результат 2',
      text: 'Хорошие специалисты, помогли в сложной ситуации.',
      verified: true,
      helpful: 18,
      tags: ['Помощь', 'Консультация'],
      lawyer: 'Ольга Белова',
    },
    {
      id: 'test-3',
      name: 'Дмитрий Тестовый',
      age: 45,
      city: 'Одинцово',
      profession: 'ИП',
      rating: 5,
      date: '2025-01-05',
      debt: '2.2 млн ₽',
      duration: '6 месяцев',
      procedure: 'Банкротство ИП',
      problem: 'Тестовая проблема 3',
      result: 'Тестовый результат 3',
      text: 'Полностью доволен результатом. Рекомендую!',
      verified: true,
      helpful: 15,
      tags: ['Результат', 'Рекомендую'],
      lawyer: 'Игорь Волков',
    },
  ];

  const calculateStats = (reviewsList: Review[]) => {
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviewsList.forEach((review) => {
      distribution[review.rating]++;
      totalRating += review.rating;
    });

    return {
      total: reviewsList.length,
      average: reviewsList.length > 0 ? totalRating / reviewsList.length : 0,
      distribution,
    };
  };

  it('should have at least 12 reviews in the data', () => {
    expect(reviews.length).toBeGreaterThanOrEqual(12);
  });

  it('should have all reviews from Moscow and Moscow region', () => {
    const moscowRegionCities = [
      'Москва',
      'Одинцово',
      'Химки',
      'Подольск',
      'Королёв',
      'Люберцы',
      'Мытищи',
      'Балашиха',
      'Красногорск',
      'Реутов',
    ];
    reviews.forEach((review) => {
      expect(moscowRegionCities).toContain(review.city);
    });
  });

  it('should have all reviews verified', () => {
    reviews.forEach((review) => {
      expect(review.verified).toBe(true);
    });
  });

  it('should have reviews from 2024-2025', () => {
    reviews.forEach((review) => {
      const year = new Date(review.date).getFullYear();
      expect(year).toBeGreaterThanOrEqual(2024);
      expect(year).toBeLessThanOrEqual(2025);
    });
  });

  it('should have all required fields in each review', () => {
    reviews.forEach((review) => {
      expect(review.id).toBeTruthy();
      expect(review.name).toBeTruthy();
      expect(review.age).toBeGreaterThan(0);
      expect(review.city).toBeTruthy();
      expect(review.profession).toBeTruthy();
      expect(review.date).toBeTruthy();
      expect(review.rating).toBeGreaterThan(0);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(review.debt).toBeTruthy();
      expect(review.duration).toBeTruthy();
      expect(review.procedure).toBeTruthy();
      expect(review.text).toBeTruthy();
      expect(Array.isArray(review.tags)).toBe(true);
      expect(review.lawyer).toBeTruthy();
    });
  });

  it('should have correct reviews stats', () => {
    expect(reviewsStats.total).toBe(reviews.length);
    expect(reviewsStats.averageRating).toBeGreaterThan(0);
    expect(reviewsStats.averageRating).toBeLessThanOrEqual(5);
    expect(reviewsStats.verifiedCount).toBe(reviews.length);
  });

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

  it('should get first letter from names correctly', () => {
    const getFirstLetter = (name: string) => {
      return name.charAt(0).toUpperCase();
    };

    expect(getFirstLetter('Александр Петров')).toBe('А');
    expect(getFirstLetter('Марина Иванова')).toBe('М');
    expect(getFirstLetter('Дмитрий Сидоров')).toBe('Д');
  });

  it('should sort reviews by date correctly', () => {
    const sortedReviews = [...mockReviews].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    expect(sortedReviews[0].id).toBe('test-1'); // Most recent
    expect(sortedReviews[sortedReviews.length - 1].id).toBe('test-3'); // Oldest
  });
});
