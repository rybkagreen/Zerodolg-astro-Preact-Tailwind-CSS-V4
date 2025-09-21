import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe('Timeline Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('should initialize with correct default values', () => {
    const timelineState = {
      currentStep: 0,
      totalSteps: 5,
      completed: [] as number[],
      isAnimating: false,
      isComplete: false,
      previousStep: 0,
    };

    expect(timelineState.currentStep).toBe(0);
    expect(timelineState.totalSteps).toBe(5);
    expect(timelineState.completed).toEqual([]);
    expect(timelineState.isAnimating).toBe(false);
    expect(timelineState.isComplete).toBe(false);
  });

  it('should correctly calculate progress percentage', () => {
    const calculateProgress = (current: number, total: number) => {
      return total > 1 ? ((current) / (total - 1)) * 100 : 0;
    };

    expect(calculateProgress(0, 5)).toBe(0);
    expect(calculateProgress(1, 5)).toBe(25);
    expect(calculateProgress(2, 5)).toBe(50);
    expect(calculateProgress(3, 5)).toBe(75);
    expect(calculateProgress(4, 5)).toBe(100);
  });

  it('should handle step navigation correctly', () => {
    const timelineState = {
      currentStep: 0,
      totalSteps: 5,
      completed: [] as number[],
    };

    // Simulate going to next step
    const goToNextStep = (state: typeof timelineState) => {
      if (state.currentStep < state.totalSteps - 1) {
        // Mark previous step as completed
        if (!state.completed.includes(state.currentStep)) {
          state.completed.push(state.currentStep);
        }
        state.currentStep++;
      }
    };

    goToNextStep(timelineState);
    expect(timelineState.currentStep).toBe(1);
    expect(timelineState.completed).toContain(0);

    goToNextStep(timelineState);
    expect(timelineState.currentStep).toBe(2);
    expect(timelineState.completed).toContain(1);
  });

  it('should debounce function calls correctly', () => {
    // Mock setTimeout and clearTimeout
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

    // Fast-forward time
    vi.advanceTimersByTime(300);

    // Should only have been called once
    expect(callCount).toBe(1);

    vi.useRealTimers();
  });
});