import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Accessibility Tests', () => {
  // Accessibility attributes tests
  it('should generate correct accessibility attributes', () => {
    const accessibilityHelper = {
      roles: {
        button: 'button',
        navigation: 'navigation',
        main: 'main',
        complementary: 'complementary',
        contentinfo: 'contentinfo',
        banner: 'banner',
        dialog: 'dialog',
        alertdialog: 'alertdialog',
      },
      ariaStates: {
        expanded: 'aria-expanded',
        pressed: 'aria-pressed',
        selected: 'aria-selected',
        checked: 'aria-checked',
        hidden: 'aria-hidden',
        busy: 'aria-busy',
        current: 'aria-current',
      },
      landmarks: {
        main: 'main',
        navigation: 'navigation',
        complementary: 'complementary',
        contentinfo: 'contentinfo',
        banner: 'banner',
        search: 'search',
        form: 'form',
      },
      generateLabel: function (element: string, text: string) {
        return {
          'aria-label': text,
          'data-element': element,
        };
      },
      generateDescribedBy: function (descriptionId: string) {
        return {
          'aria-describedby': descriptionId,
        };
      },
      generateControls: function (controlledId: string) {
        return {
          'aria-controls': controlledId,
        };
      },
      generateOwns: function (ownedId: string) {
        return {
          'aria-owns': ownedId,
        };
      },
    };

    // Test role generation
    expect(accessibilityHelper.roles.button).toBe('button');
    expect(accessibilityHelper.roles.navigation).toBe('navigation');
    expect(accessibilityHelper.roles.main).toBe('main');

    // Test ARIA state generation
    expect(accessibilityHelper.ariaStates.expanded).toBe('aria-expanded');
    expect(accessibilityHelper.ariaStates.selected).toBe('aria-selected');
    expect(accessibilityHelper.ariaStates.hidden).toBe('aria-hidden');

    // Test landmark generation
    expect(accessibilityHelper.landmarks.main).toBe('main');
    expect(accessibilityHelper.landmarks.navigation).toBe('navigation');

    // Test label generation
    const labeledButton = accessibilityHelper.generateLabel('button', 'Submit form');
    expect(labeledButton['aria-label']).toBe('Submit form');
    expect(labeledButton['data-element']).toBe('button');

    // Test describedby generation
    const describedElement = accessibilityHelper.generateDescribedBy('form-help-text');
    expect(describedElement['aria-describedby']).toBe('form-help-text');

    // Test controls generation
    const controllingElement = accessibilityHelper.generateControls('collapsible-section');
    expect(controllingElement['aria-controls']).toBe('collapsible-section');

    // Test owns generation
    const owningElement = accessibilityHelper.generateOwns('owned-list');
    expect(owningElement['aria-owns']).toBe('owned-list');
  });

  // Semantic HTML tests
  it('should use semantic HTML correctly', () => {
    const semanticChecker = {
      semanticTags: {
        // Content sectioning
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        section: 'region',
        article: 'article',
        aside: 'complementary',
        footer: 'contentinfo',

        // Text content
        h1: 'heading',
        h2: 'heading',
        h3: 'heading',
        h4: 'heading',
        h5: 'heading',
        h6: 'heading',
        p: 'paragraph',
        blockquote: 'blockquote',
        pre: 'code',

        // Embedded content
        img: 'img',
        video: 'video',
        audio: 'audio',
        canvas: 'canvas',

        // Table content
        table: 'table',
        caption: 'caption',
        thead: 'rowgroup',
        tbody: 'rowgroup',
        tfoot: 'rowgroup',
        tr: 'row',
        td: 'cell',
        th: 'columnheader',

        // Form content
        form: 'form',
        fieldset: 'group',
        legend: 'legend',
        label: 'label',
        input: 'textbox',
        select: 'combobox',
        textarea: 'textbox',
        button: 'button',
      },
      validateSemantics: function (html: string) {
        const issues = [];
        const semanticTags = Object.keys(this.semanticTags);

        // Check for proper heading hierarchy
        const headingMatches = html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
        if (headingMatches.length > 0) {
          let lastLevel = 0;
          for (const match of headingMatches) {
            const level = parseInt(match.charAt(2));
            if (level > lastLevel + 1) {
              issues.push(`Improper heading hierarchy: H${lastLevel} followed by H${level}`);
            }
            lastLevel = level;
          }
        }

        // Check for semantic tags
        const missingSemantics = semanticTags.filter(
          (tag) =>
            !html.includes(`<${tag}`) && !html.includes(`<${tag}>`) && !html.includes(`</${tag}>`)
        );

        if (missingSemantics.length > 0) {
          issues.push(`Missing semantic tags: ${missingSemantics.join(', ')}`);
        }

        return {
          valid: issues.length === 0,
          issues,
          semanticScore: semanticTags.length - missingSemantics.length,
        };
      },
      suggestImprovements: function (html: string) {
        const suggestions = [];

        // Suggest heading structure improvements
        const headingMatches = html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
        if (headingMatches.length > 0) {
          const firstHeading = headingMatches[0];
          if (!firstHeading.includes('<h1')) {
            suggestions.push('First heading should be <h1> for main page title');
          }
        } else {
          suggestions.push('Add at least one heading for accessibility');
        }

        // Suggest landmark improvements
        if (!html.includes('<main')) {
          suggestions.push('Add <main> element to identify main content');
        }

        if (!html.includes('<nav')) {
          suggestions.push('Add <nav> element for navigation areas');
        }

        if (!html.includes('<header')) {
          suggestions.push('Add <header> element for site header');
        }

        if (!html.includes('<footer')) {
          suggestions.push('Add <footer> element for site footer');
        }

        // Suggest form accessibility
        const formMatches = html.match(/<form/gi) || [];
        if (formMatches.length > 0) {
          const labelMatches = html.match(/<label/gi) || [];
          if (labelMatches.length === 0) {
            suggestions.push('Add <label> elements for form inputs');
          }
        }

        return suggestions;
      },
    };

    // Test semantic validation
    const validHtml = `
      <header role="banner">
        <h1>Main Page Title</h1>
      </header>
      <nav role="navigation">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
      <main role="main">
        <section>
          <h2>Section Title</h2>
          <p>Some content paragraph.</p>
        </section>
      </main>
      <footer role="contentinfo">
        <p>&copy; 2024 ZeroDolg. All rights reserved.</p>
      </footer>
    `;

    const validationResult = semanticChecker.validateSemantics(validHtml);
    expect(validationResult.valid).toBe(true);
    expect(Array.isArray(validationResult.issues)).toBe(true);
    expect(typeof validationResult.semanticScore).toBe('number');

    // Test improvement suggestions
    const suggestions = semanticChecker.suggestImprovements(validHtml);
    expect(Array.isArray(suggestions)).toBe(true);

    // Test invalid heading hierarchy
    const invalidHtml = `
      <h3>Incorrect Heading Level</h3>
      <h5>Another Incorrect Level</h5>
    `;

    const invalidValidation = semanticChecker.validateSemantics(invalidHtml);
    expect(invalidValidation.valid).toBe(false);
    expect(
      invalidValidation.issues.some((issue) => issue.includes('Improper heading hierarchy'))
    ).toBe(true);

    // Test missing semantic elements
    const minimalHtml = '<div>Minimal content</div>';
    const minimalValidation = semanticChecker.validateSemantics(minimalHtml);
    expect(minimalValidation.valid).toBe(false);

    const minimalSuggestions = semanticChecker.suggestImprovements(minimalHtml);
    expect(minimalSuggestions.length).toBeGreaterThan(0);
    expect(
      minimalSuggestions.some((suggestion) => suggestion.includes('Add at least one heading'))
    ).toBe(true);
  });

  // Keyboard navigation tests
  it('should support keyboard navigation correctly', () => {
    const keyboardNavigation = {
      focusableSelectors: [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        '[tabindex]:not([tabindex="-1"])',
        '[contentEditable=true]',
      ],
      getFocusableElements: function (container: HTMLElement) {
        const selectors = this.focusableSelectors;
        const elements = [];

        for (const selector of selectors) {
          const found = container.querySelectorAll(selector);
          elements.push(...Array.from(found));
        }

        return elements;
      },
      hasKeyboardAccess: function (element: HTMLElement) {
        // Check if element is keyboard accessible
        const tabIndex = element.getAttribute('tabindex');
        const isNativeFocusable = this.focusableSelectors.some((selector) =>
          element.matches(selector)
        );

        return isNativeFocusable || (tabIndex && parseInt(tabIndex) >= 0);
      },
      getTabIndex: function (element: HTMLElement) {
        const tabIndex = element.getAttribute('tabindex');
        return tabIndex ? parseInt(tabIndex) : null;
      },
      isFocusable: function (element: HTMLElement) {
        const computedStyle = window.getComputedStyle(element);
        return (
          computedStyle.visibility !== 'hidden' &&
          computedStyle.display !== 'none' &&
          this.hasKeyboardAccess(element)
        );
      },
      getKeyboardShortcuts: function () {
        return {
          Tab: 'Navigate to next focusable element',
          'Shift+Tab': 'Navigate to previous focusable element',
          Enter: 'Activate buttons and links',
          Space: 'Activate checkboxes and buttons',
          Escape: 'Close modals and dialogs',
        };
      },
    };

    // Test focusable elements detection
    const div = document.createElement('div');
    div.innerHTML = `
      <a href="#link1">Link 1</a>
      <button>Button</button>
      <input type="text" />
      <div tabindex="0">Focusable Div</div>
      <span tabindex="-1">Non-focusable Span</span>
      <div>Non-focusable Div</div>
    `;

    const focusableElements = keyboardNavigation.getFocusableElements(div);
    expect(focusableElements.length).toBe(4); // a, button, input, div[tabindex="0"]

    // Test keyboard accessibility
    const link = div.querySelector('a') as HTMLElement;
    const button = div.querySelector('button') as HTMLElement;
    const input = div.querySelector('input') as HTMLElement;
    const focusableDiv = div.querySelector('div[tabindex="0"]') as HTMLElement;
    const nonFocusableSpan = div.querySelector('span[tabindex="-1"]') as HTMLElement;

    expect(keyboardNavigation.hasKeyboardAccess(link)).toBe(true);
    expect(keyboardNavigation.hasKeyboardAccess(button)).toBe(true);
    expect(keyboardNavigation.hasKeyboardAccess(input)).toBe(true);
    expect(keyboardNavigation.hasKeyboardAccess(focusableDiv)).toBe(true);
    expect(keyboardNavigation.hasKeyboardAccess(nonFocusableSpan)).toBe(false);

    // Test tab index
    expect(keyboardNavigation.getTabIndex(link)).toBeNull(); // No explicit tabindex
    expect(keyboardNavigation.getTabIndex(focusableDiv)).toBe(0);
    expect(keyboardNavigation.getTabIndex(nonFocusableSpan)).toBe(-1);

    // Test focusability
    expect(keyboardNavigation.isFocusable(link)).toBe(true);
    expect(keyboardNavigation.isFocusable(button)).toBe(true);
    expect(keyboardNavigation.isFocusable(input)).toBe(true);
    expect(keyboardNavigation.isFocusable(focusableDiv)).toBe(true);
    expect(keyboardNavigation.isFocusable(nonFocusableSpan)).toBe(false);

    // Test keyboard shortcuts
    const shortcuts = keyboardNavigation.getKeyboardShortcuts();
    expect(shortcuts['Tab']).toBe('Navigate to next focusable element');
    expect(shortcuts['Shift+Tab']).toBe('Navigate to previous focusable element');
    expect(shortcuts['Enter']).toBe('Activate buttons and links');
    expect(shortcuts['Space']).toBe('Activate checkboxes and buttons');
    expect(shortcuts['Escape']).toBe('Close modals and dialogs');
  });

  // Screen reader support tests
  it('should provide screen reader support correctly', () => {
    const screenReaderSupport = {
      liveRegions: {
        polite: 'aria-live="polite"',
        assertive: 'aria-live="assertive"',
        off: 'aria-live="off"',
      },
      alerts: {
        info: 'role="alert" aria-live="polite"',
        warning: 'role="alert" aria-live="assertive"',
        error: 'role="alert" aria-live="assertive"',
      },
      statuses: {
        loading: 'aria-busy="true"',
        loaded: 'aria-busy="false"',
        expanded: 'aria-expanded="true"',
        collapsed: 'aria-expanded="false"',
      },
      announcements: new Map<string, string>(),
      announce: function (message: string, priority: 'polite' | 'assertive' = 'polite') {
        // Create announcement
        const announcement = {
          id: `announcement-${Date.now()}`,
          message,
          priority,
          timestamp: Date.now(),
        };

        this.announcements.set(announcement.id, message);
        return announcement;
      },
      getAnnouncement: function (id: string) {
        return this.announcements.get(id) || null;
      },
      clearAnnouncements: function () {
        this.announcements.clear();
      },
      generateStatusMessage: function (status: string, message: string) {
        return {
          'aria-label': `${status}: ${message}`,
          'data-status': status,
        };
      },
    };

    // Test live regions
    expect(screenReaderSupport.liveRegions.polite).toBe('aria-live="polite"');
    expect(screenReaderSupport.liveRegions.assertive).toBe('aria-live="assertive"');
    expect(screenReaderSupport.liveRegions.off).toBe('aria-live="off"');

    // Test alerts
    expect(screenReaderSupport.alerts.info).toBe('role="alert" aria-live="polite"');
    expect(screenReaderSupport.alerts.warning).toBe('role="alert" aria-live="assertive"');
    expect(screenReaderSupport.alerts.error).toBe('role="alert" aria-live="assertive"');

    // Test statuses
    expect(screenReaderSupport.statuses.loading).toBe('aria-busy="true"');
    expect(screenReaderSupport.statuses.loaded).toBe('aria-busy="false"');
    expect(screenReaderSupport.statuses.expanded).toBe('aria-expanded="true"');
    expect(screenReaderSupport.statuses.collapsed).toBe('aria-expanded="false"');

    // Test announcements
    const announcement1 = screenReaderSupport.announce('Loading data...', 'polite');
    const announcement2 = screenReaderSupport.announce('Error occurred', 'assertive');

    expect(typeof announcement1.id).toBe('string');
    expect(announcement1.message).toBe('Loading data...');
    expect(announcement1.priority).toBe('polite');

    expect(typeof announcement2.id).toBe('string');
    expect(announcement2.message).toBe('Error occurred');
    expect(announcement2.priority).toBe('assertive');

    expect(screenReaderSupport.getAnnouncement(announcement1.id)).toBe('Loading data...');
    expect(screenReaderSupport.getAnnouncement(announcement2.id)).toBe('Error occurred');

    // Test announcement clearance
    screenReaderSupport.clearAnnouncements();
    expect(screenReaderSupport.announcements.size).toBe(0);
    expect(screenReaderSupport.getAnnouncement(announcement1.id)).toBeNull();

    // Test status messages
    const statusMessage = screenReaderSupport.generateStatusMessage(
      'loading',
      'Processing request'
    );
    expect(statusMessage['aria-label']).toBe('loading: Processing request');
    expect(statusMessage['data-status']).toBe('loading');

    const errorMessage = screenReaderSupport.generateStatusMessage('error', 'Failed to load data');
    expect(errorMessage['aria-label']).toBe('error: Failed to load data');
    expect(errorMessage['data-status']).toBe('error');
  });

  // Color contrast tests
  it('should maintain sufficient color contrast', () => {
    const colorContrast = {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        dark: '#1e293b',
        light: '#f8fafc',
        gray: '#64748b',
        muted: '#94a3b8',
      },
      calculateContrastRatio: function (foreground: string, background: string) {
        // Convert hex to RGB
        const fgRgb = this.hexToRgb(foreground);
        const bgRgb = this.hexToRgb(background);

        if (!fgRgb || !bgRgb) return 0;

        // Calculate relative luminance
        const fgLuminance = this.getRelativeLuminance(fgRgb);
        const bgLuminance = this.getRelativeLuminance(bgRgb);

        // Calculate contrast ratio
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);

        return (lighter + 0.05) / (darker + 0.05);
      },
      hexToRgb: function (hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      },
      getRelativeLuminance: function (rgb: { r: number; g: number; b: number }) {
        const r = this.gamma(rgb.r / 255);
        const g = this.gamma(rgb.g / 255);
        const b = this.gamma(rgb.b / 255);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      },
      gamma: function (value: number) {
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
      },
      meetsWCAG: function (
        ratio: number,
        level: 'AA' | 'AAA' = 'AA',
        size: 'normal' | 'large' = 'normal'
      ) {
        if (level === 'AAA') {
          if (size === 'large') return ratio >= 4.5;
          return ratio >= 7.0;
        }
        if (size === 'large') return ratio >= 3.0;
        return ratio >= 4.5;
      },
      testColorCombination: function (
        foreground: string,
        background: string,
        level: 'AA' | 'AAA' = 'AA',
        size: 'normal' | 'large' = 'normal'
      ) {
        const ratio = this.calculateContrastRatio(foreground, background);
        const meets = this.meetsWCAG(ratio, level, size);

        return {
          ratio: Math.round(ratio * 100) / 100,
          meets,
          minRequired:
            level === 'AAA' ? (size === 'large' ? 4.5 : 7.0) : size === 'large' ? 3.0 : 4.5,
        };
      },
    };

    // Test color conversions
    const rgb = colorContrast.hexToRgb('#667eea');
    expect(rgb).toEqual({ r: 102, g: 126, b: 234 });

    const rgbBlack = colorContrast.hexToRgb('#000000');
    expect(rgbBlack).toEqual({ r: 0, g: 0, b: 0 });

    const rgbWhite = colorContrast.hexToRgb('#ffffff');
    expect(rgbWhite).toEqual({ r: 255, g: 255, b: 255 });

    // Test relative luminance calculations
    const blackLuminance = colorContrast.getRelativeLuminance({ r: 0, g: 0, b: 0 });
    expect(blackLuminance).toBe(0);

    const whiteLuminance = colorContrast.getRelativeLuminance({ r: 255, g: 255, b: 255 });
    expect(whiteLuminance).toBe(1);

    // Test contrast ratio calculations
    const whiteBlackRatio = colorContrast.calculateContrastRatio('#ffffff', '#000000');
    expect(whiteBlackRatio).toBe(21); // Maximum contrast

    const sameColorRatio = colorContrast.calculateContrastRatio('#667eea', '#667eea');
    expect(sameColorRatio).toBe(1); // No contrast

    // Test WCAG compliance
    expect(colorContrast.meetsWCAG(21, 'AA', 'normal')).toBe(true);
    expect(colorContrast.meetsWCAG(3.0, 'AA', 'normal')).toBe(false);
    expect(colorContrast.meetsWCAG(4.5, 'AA', 'normal')).toBe(true);
    expect(colorContrast.meetsWCAG(7.0, 'AAA', 'normal')).toBe(true);
    expect(colorContrast.meetsWCAG(4.5, 'AAA', 'normal')).toBe(false);
    expect(colorContrast.meetsWCAG(3.0, 'AA', 'large')).toBe(true);
    expect(colorContrast.meetsWCAG(3.0, 'AAA', 'large')).toBe(true);

    // Test color combinations
    const primaryDark = colorContrast.testColorCombination('#ffffff', '#667eea', 'AA', 'normal');
    expect(primaryDark.ratio).toBeGreaterThan(4.5);
    expect(primaryDark.meets).toBe(true);

    const primaryLight = colorContrast.testColorCombination('#1e293b', '#667eea', 'AA', 'normal');
    expect(primaryLight.meets).toBe(true);

    // Test insufficient contrast
    const poorContrast = colorContrast.testColorCombination('#cccccc', '#aaaaaa', 'AA', 'normal');
    expect(poorContrast.meets).toBe(false);
    expect(poorContrast.ratio).toBeLessThan(3.0);

    // Test color palette combinations
    const colorPairs = [
      ['#ffffff', '#667eea'], // White on primary
      ['#ffffff', '#764ba2'], // White on secondary
      ['#1e293b', '#f093fb'], // Dark on accent
      ['#1e293b', '#10b981'], // Dark on success
      ['#ffffff', '#ef4444'], // White on error
    ];

    colorPairs.forEach((pair) => {
      const contrast = colorContrast.testColorCombination(pair[0], pair[1], 'AA', 'normal');
      expect(contrast.ratio).toBeGreaterThan(3.0); // At least minimal contrast
    });
  });

  // Focus management tests
  it('should manage focus correctly', () => {
    const focusManager = {
      trappedElements: new WeakMap<
        HTMLElement,
        { firstFocusable: HTMLElement; lastFocusable: HTMLElement }
      >(),
      trapFocus: function (container: HTMLElement) {
        // Get all focusable elements within the container
        const focusable = this.getFocusableElements(container);
        if (focusable.length === 0) return;

        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        // Store trap information
        this.trappedElements.set(container, { firstFocusable, lastFocusable });

        // Trap focus within the container
        container.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              // Shift+Tab pressed
              if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
              }
            } else {
              // Tab pressed
              if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
              }
            }
          }
        });

        // Focus the first element
        firstFocusable.focus();
      },
      getFocusableElements: function (container: HTMLElement) {
        const focusableSelectors = [
          'a[href]',
          'area[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          'button:not([disabled])',
          'iframe',
          '[tabindex]:not([tabindex="-1"])',
          '[contentEditable=true]',
        ];

        const elements: HTMLElement[] = [];
        for (const selector of focusableSelectors) {
          const found = container.querySelectorAll<HTMLElement>(selector);
          elements.push(...Array.from(found));
        }

        return elements;
      },
      trapWithin: function (container: HTMLElement) {
        const focusableElements = this.getFocusableElements(container);
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        // Listen for focus events
        container.addEventListener('focusout', (e: FocusEvent) => {
          const relatedTarget = e.relatedTarget as HTMLElement;

          // If focus leaves the container, redirect it appropriately
          if (!container.contains(relatedTarget)) {
            if (e.target === last) {
              first.focus();
            } else {
              last.focus();
            }
          }
        });

        return focusableElements;
      },
      restoreFocus: function (container: HTMLElement) {
        // Restore focus when component is closed
        const trap = this.trappedElements.get(container);
        if (trap) {
          // Move focus to first focusable element in trap
          trap.firstFocusable.focus();
          this.trappedElements.delete(container);
        }
      },
    };

    // Test focusable elements detection
    const container = document.createElement('div');
    container.innerHTML = `
      <button>First Button</button>
      <input type="text" />
      <a href="#">Link</a>
      <div tabindex="0">Focusable Div</div>
      <span tabindex="-1">Non-focusable Span</span>
      <input type="text" disabled />
      <button disabled>Disabled Button</button>
    `;

    const focusableElements = focusManager.getFocusableElements(container);
    expect(focusableElements.length).toBe(4); // button, input, a, div[tabindex="0"]

    // Test focus trapping
    focusManager.trapFocus(container);
    expect(focusManager.trappedElements.has(container)).toBe(true);

    const trap = focusManager.trappedElements.get(container);
    expect(trap).toBeDefined();
    expect(trap?.firstFocusable).toBe(focusableElements[0]);
    expect(trap?.lastFocusable).toBe(focusableElements[focusableElements.length - 1]);

    // Test focus restoration
    focusManager.restoreFocus(container);
    expect(focusManager.trappedElements.has(container)).toBe(false);

    // Test trap within container
    const trapWithin = focusManager.trapWithin(container);
    expect(Array.isArray(trapWithin)).toBe(true);
    expect(trapWithin.length).toBe(4);
  });

  // Skip link tests
  it('should implement skip links correctly', () => {
    const skipLinks = {
      skipLinks: [] as Array<{ href: string; text: string; target: string }>,
      addSkipLink: function (href: string, text: string, target: string) {
        const skipLink = { href, text, target };
        this.skipLinks.push(skipLink);
        return skipLink;
      },
      generateSkipLinkMarkup: function (href: string, text: string, target: string) {
        return `
          <a href="${href}" class="skip-link" data-skip-target="${target}">
            ${text}
          </a>
        `.trim();
      },
      validateSkipLink: function (href: string, text: string, target: string) {
        return {
          validHref: href.startsWith('#'),
          hasText: text.length > 0,
          validTarget: target.length > 0,
          accessible: href.startsWith('#') && text.length > 0,
        };
      },
      getSkipLinks: function () {
        return this.skipLinks;
      },
      clearSkipLinks: function () {
        this.skipLinks = [];
      },
    };

    // Test adding skip links
    const mainSkipLink = skipLinks.addSkipLink('#main', 'Перейти к основному содержимому', 'main');
    const navSkipLink = skipLinks.addSkipLink('#navigation', 'Перейти к навигации', 'nav');
    const contentSkipLink = skipLinks.addSkipLink('#content', 'Перейти к содержимому', 'content');

    expect(skipLinks.skipLinks.length).toBe(3);
    expect(mainSkipLink.href).toBe('#main');
    expect(mainSkipLink.text).toBe('Перейти к основному содержимому');
    expect(mainSkipLink.target).toBe('main');

    // Test skip link markup generation
    const markup = skipLinks.generateSkipLinkMarkup('#main', 'Skip to main content', 'main');
    expect(markup).toContain('<a href="#main" class="skip-link" data-skip-target="main">');
    expect(markup).toContain('Skip to main content');
    expect(markup).toContain('</a>');

    // Test skip link validation
    const validSkipLink = skipLinks.validateSkipLink('#main', 'Skip to main', 'main');
    expect(validSkipLink.validHref).toBe(true);
    expect(validSkipLink.hasText).toBe(true);
    expect(validSkipLink.validTarget).toBe(true);
    expect(validSkipLink.accessible).toBe(true);

    const invalidSkipLink = skipLinks.validateSkipLink('main', '', 'main');
    expect(invalidSkipLink.validHref).toBe(false);
    expect(invalidSkipLink.hasText).toBe(false);
    expect(invalidSkipLink.accessible).toBe(false);

    // Test skip link retrieval
    const allSkipLinks = skipLinks.getSkipLinks();
    expect(allSkipLinks.length).toBe(3);
    expect(allSkipLinks[0].href).toBe('#main');
    expect(allSkipLinks[1].href).toBe('#navigation');
    expect(allSkipLinks[2].href).toBe('#content');

    // Test skip link clearance
    skipLinks.clearSkipLinks();
    expect(skipLinks.skipLinks.length).toBe(0);
  });

  // ARIA attributes tests
  it('should implement ARIA attributes correctly', () => {
    const ariaHelper = {
      attributes: {
        'aria-label': 'Defines a string value that labels an interactive element',
        'aria-labelledby': 'Identifies the element (or elements) that labels the current element',
        'aria-describedby': 'Identifies the element (or elements) that describes the object',
        'aria-expanded':
          'Indicates whether an element, or another grouping element it controls, is currently expanded or collapsed',
        'aria-controls':
          'Identifies the element (or elements) whose contents or presence are controlled by the current element',
        'aria-haspopup': 'Indicates the availability and type of interactive popup element',
        'aria-hidden': 'Indicates whether the element is exposed to an accessibility API',
        'aria-live':
          'Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region',
        'aria-atomic':
          'Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute',
        'aria-relevant':
          'Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified',
      },
      createAriaAttributes: function (attrs: Record<string, string>) {
        const result: Record<string, string> = {};

        Object.keys(attrs).forEach((key) => {
          if (this.attributes[key as keyof typeof this.attributes]) {
            result[key] = attrs[key];
          }
        });

        return result;
      },
      validateAriaAttributes: function (attrs: Record<string, string>) {
        const issues = [];

        Object.keys(attrs).forEach((key) => {
          if (!this.attributes[key as keyof typeof this.attributes]) {
            issues.push(`Unknown ARIA attribute: ${key}`);
          }
        });

        return {
          valid: issues.length === 0,
          issues,
        };
      },
      getAriaDescription: function (attribute: string) {
        return (
          this.attributes[attribute as keyof typeof this.attributes] || 'Unknown ARIA attribute'
        );
      },
    };

    // Test ARIA attribute creation
    const validAttrs = ariaHelper.createAriaAttributes({
      'aria-label': 'Main navigation',
      'aria-expanded': 'false',
      'aria-controls': 'submenu',
    });

    expect(validAttrs['aria-label']).toBe('Main navigation');
    expect(validAttrs['aria-expanded']).toBe('false');
    expect(validAttrs['aria-controls']).toBe('submenu');
    expect(Object.keys(validAttrs).length).toBe(3);

    // Test ARIA attribute validation
    const validation = ariaHelper.validateAriaAttributes({
      'aria-label': 'Some label',
      'aria-invalid-attr': 'Some value',
      'aria-expanded': 'true',
    });

    expect(validation.valid).toBe(false);
    expect(validation.issues.length).toBe(1);
    expect(validation.issues[0]).toBe('Unknown ARIA attribute: aria-invalid-attr');

    const validValidation = ariaHelper.validateAriaAttributes({
      'aria-label': 'Some label',
      'aria-expanded': 'true',
      'aria-controls': 'target',
    });

    expect(validValidation.valid).toBe(true);
    expect(validValidation.issues.length).toBe(0);

    // Test ARIA attribute descriptions
    const labelDesc = ariaHelper.getAriaDescription('aria-label');
    expect(labelDesc).toBe('Defines a string value that labels an interactive element');

    const expandedDesc = ariaHelper.getAriaDescription('aria-expanded');
    expect(expandedDesc).toBe(
      'Indicates whether an element, or another grouping element it controls, is currently expanded or collapsed'
    );

    const unknownDesc = ariaHelper.getAriaDescription('aria-unknown');
    expect(unknownDesc).toBe('Unknown ARIA attribute');

    // Test ARIA attributes for common components
    const dialogAttrs = ariaHelper.createAriaAttributes({
      'aria-label': 'Confirmation Dialog',
      'aria-modal': 'true',
      'aria-live': 'polite',
      role: 'dialog',
    });

    expect(dialogAttrs['aria-label']).toBe('Confirmation Dialog');
    expect(dialogAttrs['aria-modal']).toBe('true');
    expect(dialogAttrs['aria-live']).toBe('polite');
    expect(dialogAttrs['role']).toBe('dialog');
  });

  // Language attribute tests
  it('should handle language attributes correctly', () => {
    const languageHelper = {
      languages: {
        ru: 'Русский',
        en: 'English',
        uk: 'Українська',
        by: 'Беларуская',
      },
      rtlLanguages: ['ar', 'he', 'fa', 'ur'],
      defaultLanguage: 'ru',
      setLanguage: function (lang: string) {
        const html = document.documentElement;
        html.setAttribute('lang', lang);

        // Set direction if RTL language
        if (this.rtlLanguages.includes(lang)) {
          html.setAttribute('dir', 'rtl');
        } else {
          html.setAttribute('dir', 'ltr');
        }

        return lang;
      },
      getCurrentLanguage: function () {
        return document.documentElement.lang || this.defaultLanguage;
      },
      isRTLLanguage: function (lang: string) {
        return this.rtlLanguages.includes(lang);
      },
      getLanguageName: function (lang: string) {
        return this.languages[lang as keyof typeof this.languages] || 'Unknown Language';
      },
      validateLanguageCode: function (lang: string) {
        // ISO 639-1 codes are 2 characters
        return /^[a-z]{2}$/i.test(lang);
      },
      getSupportedLanguages: function () {
        return Object.keys(this.languages);
      },
    };

    // Test language setting
    const setLang = languageHelper.setLanguage('en');
    expect(setLang).toBe('en');
    expect(languageHelper.getCurrentLanguage()).toBe('en');

    // Test RTL language handling
    languageHelper.setLanguage('he'); // Hebrew
    expect(languageHelper.isRTLLanguage('he')).toBe(true);
    expect(document.documentElement.dir).toBe('rtl');

    // Test LTR language handling
    languageHelper.setLanguage('ru');
    expect(languageHelper.isRTLLanguage('ru')).toBe(false);
    expect(document.documentElement.dir).toBe('ltr');

    // Test language name retrieval
    expect(languageHelper.getLanguageName('ru')).toBe('Русский');
    expect(languageHelper.getLanguageName('en')).toBe('English');
    expect(languageHelper.getLanguageName('unknown')).toBe('Unknown Language');

    // Test language code validation
    expect(languageHelper.validateLanguageCode('ru')).toBe(true);
    expect(languageHelper.validateLanguageCode('en')).toBe(true);
    expect(languageHelper.validateLanguageCode('english')).toBe(false);
    expect(languageHelper.validateLanguageCode('r')).toBe(false);
    expect(languageHelper.validateLanguageCode('')).toBe(false);

    // Test supported languages
    const supportedLanguages = languageHelper.getSupportedLanguages();
    expect(supportedLanguages).toContain('ru');
    expect(supportedLanguages).toContain('en');
    expect(supportedLanguages).toContain('uk');
    expect(supportedLanguages).toContain('by');
    expect(supportedLanguages.length).toBe(4);
  });

  // Alternative navigation tests
  it('should support alternative navigation methods', () => {
    const altNavigation = {
      navigationMethods: {
        keyboard: 'Navigation using Tab, Arrow keys, Enter, Space',
        voice: 'Voice commands for navigation',
        switch: 'Single switch scanning navigation',
        headpointer: 'Head pointer navigation',
        eyeTracking: 'Eye tracking navigation',
      },
      landmarks: {
        banner: 'Site header containing site identity',
        navigation: 'Collection of navigational links',
        main: 'Primary content of the page',
        complementary: 'Supporting section of the document',
        contentinfo: 'Information about the document',
        search: 'Search functionality',
        form: 'Form associated with the document',
      },
      createLandmark: function (role: string, label: string) {
        return {
          role: role,
          'aria-label': label,
          tabindex: -1, // Not focusable by default
        };
      },
      addKeyboardShortcut: function (key: string, description: string) {
        return {
          key,
          description,
          'aria-keyshortcuts': key,
        };
      },
      getNavigationMethod: function (method: string) {
        return (
          this.navigationMethods[method as keyof typeof this.navigationMethods] ||
          'Unsupported method'
        );
      },
      getLandmarkDescription: function (landmark: string) {
        return this.landmarks[landmark as keyof typeof this.landmarks] || 'Unknown landmark';
      },
    };

    // Test navigation method support
    expect(altNavigation.getNavigationMethod('keyboard')).toBe(
      'Navigation using Tab, Arrow keys, Enter, Space'
    );
    expect(altNavigation.getNavigationMethod('voice')).toBe('Voice commands for navigation');
    expect(altNavigation.getNavigationMethod('switch')).toBe('Single switch scanning navigation');
    expect(altNavigation.getNavigationMethod('headpointer')).toBe('Head pointer navigation');
    expect(altNavigation.getNavigationMethod('eyeTracking')).toBe('Eye tracking navigation');
    expect(altNavigation.getNavigationMethod('invalid')).toBe('Unsupported method');

    // Test landmark descriptions
    expect(altNavigation.getLandmarkDescription('banner')).toBe(
      'Site header containing site identity'
    );
    expect(altNavigation.getLandmarkDescription('main')).toBe('Primary content of the page');
    expect(altNavigation.getLandmarkDescription('navigation')).toBe(
      'Collection of navigational links'
    );
    expect(altNavigation.getLandmarkDescription('invalid')).toBe('Unknown landmark');

    // Test landmark creation
    const mainLandmark = altNavigation.createLandmark('main', 'Основное содержимое');
    expect(mainLandmark.role).toBe('main');
    expect(mainLandmark['aria-label']).toBe('Основное содержимое');
    expect(mainLandmark.tabindex).toBe(-1);

    const navLandmark = altNavigation.createLandmark('navigation', 'Навигация по сайту');
    expect(navLandmark.role).toBe('navigation');
    expect(navLandmark['aria-label']).toBe('Навигация по сайту');

    // Test keyboard shortcuts
    const enterShortcut = altNavigation.addKeyboardShortcut('Enter', 'Активировать элемент');
    expect(enterShortcut.key).toBe('Enter');
    expect(enterShortcut.description).toBe('Активировать элемент');
    expect(enterShortcut['aria-keyshortcuts']).toBe('Enter');

    const tabShortcut = altNavigation.addKeyboardShortcut('Tab', 'Перейти к следующему элементу');
    expect(tabShortcut.key).toBe('Tab');
    expect(tabShortcut.description).toBe('Перейти к следующему элементу');
    expect(tabShortcut['aria-keyshortcuts']).toBe('Tab');

    // Test all navigation methods are available
    const allMethods = Object.keys(altNavigation.navigationMethods);
    expect(allMethods.length).toBe(5);
    expect(allMethods).toContain('keyboard');
    expect(allMethods).toContain('voice');
    expect(allMethods).toContain('switch');
    expect(allMethods).toContain('headpointer');
    expect(allMethods).toContain('eyeTracking');

    // Test all landmarks are available
    const allLandmarks = Object.keys(altNavigation.landmarks);
    expect(allLandmarks.length).toBe(7);
    expect(allLandmarks).toContain('banner');
    expect(allLandmarks).toContain('navigation');
    expect(allLandmarks).toContain('main');
    expect(allLandmarks).toContain('complementary');
    expect(allLandmarks).toContain('contentinfo');
    expect(allLandmarks).toContain('search');
    expect(allLandmarks).toContain('form');
  });
});
