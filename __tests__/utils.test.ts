import { describe, it, expect, vi } from 'vitest';

describe('Utility Functions', () => {
  // Debounce utility test
  it('should debounce function calls correctly', () => {
    vi.useFakeTimers();

    let callCount = 0;
    const func = () => {
      callCount++;
    };

    const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
      let timeout: any;
      return function executedFunction(...args: Parameters<T>) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    const debouncedFunc = debounce(func, 300);

    // Call function multiple times rapidly
    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    // Should not have been called yet due to debounce
    expect(callCount).toBe(0);

    // Fast-forward time
    vi.advanceTimersByTime(300);

    // Should only have been called once
    expect(callCount).toBe(1);

    vi.useRealTimers();
  });

  // Format currency test
  it('should format currency correctly', () => {
    const formatCurrency = (amount: number, currency = 'RUB') => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    expect(formatCurrency(1000000)).toBe('1 000 000 ₽');
    expect(formatCurrency(500000)).toBe('500 000 ₽');
    expect(formatCurrency(1000000, 'USD')).toBe('1 000 000 $');
  });

  // Format phone number test
  it('should format phone numbers correctly', () => {
    const formatPhoneNumber = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
      if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
      }
      return phone;
    };

    expect(formatPhoneNumber('+79055773387')).toBe('+7 (905) 577-33-87');
    expect(formatPhoneNumber('89055773387')).toBe('+8 (905) 577-33-87');
  });

  // Validate email test
  it('should validate email addresses correctly', () => {
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });

  // Truncate text test
  it('should truncate text correctly', () => {
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return `${text.substr(0, maxLength).trimEnd()}...`;
    };

    expect(truncateText('Short text', 20)).toBe('Short text');
    expect(truncateText('This is a very long text that needs to be truncated', 20)).toBe(
      'This is a very long...'
    );
  });

  // Generate unique ID test
  it('should generate unique IDs', () => {
    const generateId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
});
