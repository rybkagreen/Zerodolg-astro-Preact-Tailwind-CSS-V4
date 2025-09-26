import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Responsive Component Tests', () => {
  // Mock window.matchMedia for responsive testing
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  // Mock window resize event
  const mockWindowResize = () => {
    const resizeListeners: Function[] = [];

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    window.addEventListener = vi.fn((event, listener) => {
      if (event === 'resize') {
        resizeListeners.push(listener as Function);
      }
    }) as any;

    window.removeEventListener = vi.fn((event, listener) => {
      if (event === 'resize') {
        const index = resizeListeners.indexOf(listener as Function);
        if (index > -1) {
          resizeListeners.splice(index, 1);
        }
      }
    }) as any;

    return {
      triggerResize: (width: number) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        resizeListeners.forEach((listener) => listener());
      },
    };
  };

  beforeEach(() => {
    // Setup JSDOM environment
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Breakpoint detection tests
  it('should detect breakpoints correctly', () => {
    const breakpointDetector = {
      breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        largeDesktop: 1280,
      },
      getCurrentBreakpoint(width: number) {
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'phablet';
        if (width < this.breakpoints.desktop) return 'tablet';
        if (width < this.breakpoints.largeDesktop) return 'desktop';
        return 'largeDesktop';
      },
      isMobile(width: number) {
        return width < this.breakpoints.tablet;
      },
      isTablet(width: number) {
        return width >= this.breakpoints.tablet && width < this.breakpoints.desktop;
      },
      isDesktop(width: number) {
        return width >= this.breakpoints.desktop;
      },
    };

    // Test mobile breakpoint
    expect(breakpointDetector.getCurrentBreakpoint(320)).toBe('mobile');
    expect(breakpointDetector.getCurrentBreakpoint(400)).toBe('mobile');
    expect(breakpointDetector.isMobile(400)).toBe(true);
    expect(breakpointDetector.isTablet(400)).toBe(false);
    expect(breakpointDetector.isDesktop(400)).toBe(false);

    // Test phablet breakpoint
    expect(breakpointDetector.getCurrentBreakpoint(600)).toBe('phablet');
    expect(breakpointDetector.isMobile(600)).toBe(true);
    expect(breakpointDetector.isTablet(600)).toBe(false);
    expect(breakpointDetector.isDesktop(600)).toBe(false);

    // Test tablet breakpoint
    expect(breakpointDetector.getCurrentBreakpoint(800)).toBe('tablet');
    expect(breakpointDetector.isMobile(800)).toBe(false);
    expect(breakpointDetector.isTablet(800)).toBe(true);
    expect(breakpointDetector.isDesktop(800)).toBe(false);

    // Test desktop breakpoint
    expect(breakpointDetector.getCurrentBreakpoint(1100)).toBe('desktop');
    expect(breakpointDetector.isMobile(1100)).toBe(false);
    expect(breakpointDetector.isTablet(1100)).toBe(false);
    expect(breakpointDetector.isDesktop(1100)).toBe(true);

    // Test large desktop breakpoint
    expect(breakpointDetector.getCurrentBreakpoint(1400)).toBe('largeDesktop');
    expect(breakpointDetector.isMobile(1400)).toBe(false);
    expect(breakpointDetector.isTablet(1400)).toBe(false);
    expect(breakpointDetector.isDesktop(1400)).toBe(true);
  });

  // Responsive grid tests
  it('should calculate responsive grid columns correctly', () => {
    const gridCalculator = {
      getColumnCount(containerWidth: number, itemMinWidth: number, gap: number = 20) {
        // Calculate available width for items
        const availableWidth = containerWidth - gap;
        // Calculate how many items can fit
        return Math.max(1, Math.floor(availableWidth / (itemMinWidth + gap)));
      },
      getColumnWidth(containerWidth: number, columns: number, gap: number = 20) {
        // Calculate width minus gaps
        const totalGapWidth = gap * (columns - 1);
        const availableWidth = containerWidth - totalGapWidth;
        return Math.max(0, availableWidth / columns);
      },
      getResponsiveColumns(width: number) {
        if (width < 480) return 1; // Mobile: 1 column
        if (width < 768) return 2; // Phablet/Tablet: 2 columns
        if (width < 1024) return 3; // Tablet: 3 columns
        return 4; // Desktop: 4 columns
      },
    };

    // Test column count calculation
    expect(gridCalculator.getColumnCount(1200, 300, 20)).toBe(3);
    expect(gridCalculator.getColumnCount(800, 250, 15)).toBe(3);
    expect(gridCalculator.getColumnCount(400, 350, 20)).toBe(1);
    expect(gridCalculator.getColumnCount(600, 200, 10)).toBe(2);

    // Test column width calculation
    expect(gridCalculator.getColumnWidth(1200, 3, 20)).toBeCloseTo(380, 0);
    expect(gridCalculator.getColumnWidth(800, 2, 15)).toBeCloseTo(387.5, 1);
    expect(gridCalculator.getColumnWidth(600, 1, 10)).toBe(590);

    // Test responsive columns
    expect(gridCalculator.getResponsiveColumns(320)).toBe(1); // Mobile
    expect(gridCalculator.getResponsiveColumns(600)).toBe(2); // Phablet
    expect(gridCalculator.getResponsiveColumns(800)).toBe(3); // Tablet
    expect(gridCalculator.getResponsiveColumns(1200)).toBe(4); // Desktop
    expect(gridCalculator.getResponsiveColumns(1600)).toBe(4); // Large Desktop
  });

  // Responsive typography tests
  it('should calculate responsive font sizes correctly', () => {
    const typographyScaler = {
      clamp(min: number, preferred: string, max: number) {
        // Simple clamp implementation for testing
        return `clamp(${min}px, ${preferred}, ${max}px)`;
      },
      getResponsiveFontSize(viewportWidth: number, minSize: number, maxSize: number) {
        // Linear scaling based on viewport width
        const minWidth = 320;
        const maxWidth = 1920;

        if (viewportWidth <= minWidth) return minSize;
        if (viewportWidth >= maxWidth) return maxSize;

        const scale = (viewportWidth - minWidth) / (maxWidth - minWidth);
        return minSize + (maxSize - minSize) * scale;
      },
      generateClampValue(minSize: number, maxSize: number, minWidth: number, maxWidth: number) {
        // Generate CSS clamp() value
        const preferred = `${minSize + (maxSize - minSize) / 2}px`;
        return `clamp(${minSize}px, ${preferred}, ${maxSize}px)`;
      },
    };

    // Test responsive font size calculation
    expect(typographyScaler.getResponsiveFontSize(320, 16, 24)).toBe(16); // Min size
    expect(typographyScaler.getResponsiveFontSize(1920, 16, 24)).toBe(24); // Max size
    expect(typographyScaler.getResponsiveFontSize(1120, 16, 24)).toBe(20); // Mid range

    // Test clamp value generation
    const clampValue = typographyScaler.generateClampValue(16, 24, 320, 1920);
    expect(clampValue).toContain('clamp(16px');
    expect(clampValue).toContain('24px)');
  });

  // Media query matching tests
  it('should match media queries correctly', () => {
    const mediaQueryMatcher = {
      queries: {
        mobile: '(max-width: 479px)',
        tablet: '(min-width: 480px) and (max-width: 1023px)',
        desktop: '(min-width: 1024px)',
      },
      matches(query: string, viewportWidth: number) {
        if (query === this.queries.mobile) {
          return viewportWidth < 480;
        }
        if (query === this.queries.tablet) {
          return viewportWidth >= 480 && viewportWidth < 1024;
        }
        if (query === this.queries.desktop) {
          return viewportWidth >= 1024;
        }
        return false;
      },
    };

    // Test mobile media query
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.mobile, 320)).toBe(true);
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.mobile, 600)).toBe(false);

    // Test tablet media query
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.tablet, 600)).toBe(true);
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.tablet, 320)).toBe(false);
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.tablet, 1200)).toBe(false);

    // Test desktop media query
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.desktop, 1200)).toBe(true);
    expect(mediaQueryMatcher.matches(mediaQueryMatcher.queries.desktop, 800)).toBe(false);
  });

  // Responsive image handling tests
  it('should handle responsive images correctly', () => {
    const imageHandler = {
      getSrcSet(basePath: string, widths: number[]) {
        return widths.map((width) => `${basePath}-${width}.jpg ${width}w`).join(', ');
      },
      getSizes(breakpoints: Record<string, string>) {
        return Object.entries(breakpoints)
          .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
          .join(', ');
      },
      getOptimalWidth(viewportWidth: number, devicePixelRatio: number = 1) {
        // Round up to nearest 100px for performance
        const effectiveWidth = viewportWidth * devicePixelRatio;
        return Math.ceil(effectiveWidth / 100) * 100;
      },
    };

    // Test srcset generation
    const srcSet = imageHandler.getSrcSet('/images/hero', [320, 640, 1024, 1200]);
    expect(srcSet).toContain('/images/hero-320.jpg 320w');
    expect(srcSet).toContain('/images/hero-1200.jpg 1200w');
    expect(srcSet.split(', ').length).toBe(4);

    // Test sizes attribute generation
    const sizes = imageHandler.getSizes({
      '480px': '100vw',
      '768px': '50vw',
      '1024px': '33vw',
    });
    expect(sizes).toContain('(max-width: 480px) 100vw');
    expect(sizes).toContain('(max-width: 768px) 50vw');
    expect(sizes).toContain('(max-width: 1024px) 33vw');

    // Test optimal width calculation
    expect(imageHandler.getOptimalWidth(320)).toBe(400); // 320px → 400px
    expect(imageHandler.getOptimalWidth(800, 2)).toBe(1600); // 800px × 2 DPR → 1600px
    expect(imageHandler.getOptimalWidth(1200)).toBe(1200); // 1200px → 1200px (already rounded)
  });

  // Responsive navigation tests
  it('should handle responsive navigation correctly', () => {
    const navigationHandler = {
      isMobileMenuActive: false,
      breakpoints: {
        mobile: 768,
      },
      shouldShowMobileMenu(viewportWidth: number) {
        return viewportWidth < this.breakpoints.mobile;
      },
      toggleMobileMenu() {
        this.isMobileMenuActive = !this.isMobileMenuActive;
        return this.isMobileMenuActive;
      },
      closeMobileMenu() {
        this.isMobileMenuActive = false;
        return false;
      },
      openMobileMenu() {
        this.isMobileMenuActive = true;
        return true;
      },
    };

    // Test mobile menu activation
    expect(navigationHandler.shouldShowMobileMenu(600)).toBe(true);
    expect(navigationHandler.shouldShowMobileMenu(1024)).toBe(false);

    // Test mobile menu toggling
    expect(navigationHandler.isMobileMenuActive).toBe(false);
    expect(navigationHandler.toggleMobileMenu()).toBe(true);
    expect(navigationHandler.isMobileMenuActive).toBe(true);
    expect(navigationHandler.toggleMobileMenu()).toBe(false);
    expect(navigationHandler.isMobileMenuActive).toBe(false);

    // Test explicit open/close
    expect(navigationHandler.openMobileMenu()).toBe(true);
    expect(navigationHandler.isMobileMenuActive).toBe(true);
    expect(navigationHandler.closeMobileMenu()).toBe(false);
    expect(navigationHandler.isMobileMenuActive).toBe(false);
  });

  // Responsive layout tests
  it('should calculate responsive layouts correctly', () => {
    const layoutCalculator = {
      getContainerPadding(viewportWidth: number) {
        if (viewportWidth < 480) return 16; // Mobile: 16px padding
        if (viewportWidth < 768) return 24; // Tablet: 24px padding
        if (viewportWidth < 1024) return 32; // Desktop: 32px padding
        return 40; // Large desktop: 40px padding
      },
      getMaxWidth(viewportWidth: number) {
        if (viewportWidth < 768) return viewportWidth - 32; // Full width minus padding
        if (viewportWidth < 1200) return 768; // Fixed max width
        return 1140; // Larger fixed max width
      },
      getGridGap(viewportWidth: number) {
        if (viewportWidth < 480) return 16; // Mobile: 16px gap
        if (viewportWidth < 768) return 20; // Tablet: 20px gap
        if (viewportWidth < 1024) return 24; // Desktop: 24px gap
        return 32; // Large desktop: 32px gap
      },
    };

    // Test container padding
    expect(layoutCalculator.getContainerPadding(320)).toBe(16); // Mobile
    expect(layoutCalculator.getContainerPadding(600)).toBe(24); // Tablet
    expect(layoutCalculator.getContainerPadding(900)).toBe(32); // Desktop
    expect(layoutCalculator.getContainerPadding(1400)).toBe(40); // Large desktop

    // Test max width
    expect(layoutCalculator.getMaxWidth(400)).toBe(368); // 400 - 32 (padding)
    expect(layoutCalculator.getMaxWidth(800)).toBe(768); // Fixed
    expect(layoutCalculator.getMaxWidth(1400)).toBe(1140); // Fixed

    // Test grid gap
    expect(layoutCalculator.getGridGap(320)).toBe(16); // Mobile
    expect(layoutCalculator.getGridGap(600)).toBe(20); // Tablet
    expect(layoutCalculator.getGridGap(900)).toBe(24); // Desktop
    expect(layoutCalculator.getGridGap(1400)).toBe(32); // Large desktop
  });
});
