/**
 * Design Tokens - 2025 Modern CSS Architecture
 * Централизованная система дизайн токенов для масштабируемого проекта
 */

export const designTokens = {
  // Color Palette - OKLCH for better color science
  colors: {
    primary: {
      50: 'oklch(94.51% 0.015 262.89)',
      100: 'oklch(87.96% 0.036 262.89)',
      200: 'oklch(78.32% 0.07 262.89)',
      300: 'oklch(68.68% 0.105 262.89)',
      400: 'oklch(59.04% 0.14 262.89)',
      500: 'oklch(48.25% 0.227 262.89)', // Base
      600: 'oklch(42.39% 0.231 262.89)',
      700: 'oklch(35.26% 0.192 262.89)',
      800: 'oklch(28.8% 0.14 262.89)',
      900: 'oklch(23.39% 0.104 262.89)',
      950: 'oklch(17.22% 0.07 262.89)',
    },
    accent: {
      50: 'oklch(97.04% 0.019 39.93)',
      100: 'oklch(92.81% 0.043 39.93)',
      200: 'oklch(85.62% 0.086 39.93)',
      300: 'oklch(78.43% 0.129 39.93)',
      400: 'oklch(71.24% 0.172 39.93)',
      500: 'oklch(67.96% 0.156 39.93)', // Base
      600: 'oklch(54.84% 0.156 39.93)',
      700: 'oklch(45.88% 0.13 39.93)',
      800: 'oklch(37.84% 0.104 39.93)',
      900: 'oklch(31.27% 0.086 39.93)',
      950: 'oklch(21.65% 0.057 39.93)',
    },
    semantic: {
      success: 'oklch(72.04% 0.117 142.13)',
      error: 'oklch(63.78% 0.174 22.91)',
      warning: 'oklch(83.06% 0.118 90.43)',
      info: 'oklch(70.2% 0.131 231.8)',
    },
    neutral: {
      0: 'oklch(100% 0 0)', // Pure white
      50: 'oklch(98.72% 0.001 227.25)',
      100: 'oklch(96.54% 0.002 227.25)',
      200: 'oklch(94.2% 0.003 227.25)',
      300: 'oklch(90.1% 0.003 227.25)',
      400: 'oklch(85.2% 0.004 227.25)',
      500: 'oklch(55.2% 0.008 227.25)',
      600: 'oklch(37.14% 0.015 227.25)',
      700: 'oklch(25.22% 0.012 227.25)',
      800: 'oklch(15.22% 0.012 227.25)',
      900: 'oklch(8.22% 0.006 227.25)',
      950: 'oklch(4.22% 0.003 227.25)',
      1000: 'oklch(0% 0 0)', // Pure black
    },
  },

  // Typography Scale - Perfect Fourth (1.333)
  typography: {
    scale: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem', // 72px
      '8xl': '6rem', // 96px
      '9xl': '8rem', // 128px
    },
    weight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    leading: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    family: {
      sans: [
        'Inter Variable',
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
      ],
      mono: [
        'JetBrains Mono Variable',
        'JetBrains Mono',
        'Fira Code Variable',
        'Fira Code',
        'ui-monospace',
        'SFMono-Regular',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
  },

  // Spacing Scale - Perfect Fourth (1.333) with rem units
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  // Breakpoints - Mobile-first approach
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  // Border Radius Scale
  radius: {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    '4xl': '2rem', // 32px
    full: '9999px',
  },

  // Shadow Scale
  shadow: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Z-Index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1100',
    fixed: '1200',
    modalBackdrop: '1300',
    modal: '1400',
    popover: '1500',
    tooltip: '1600',
    notification: '1700',
  },

  // Animation & Transitions
  animation: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      back: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors.primary;
export type SpacingScale = keyof typeof designTokens.spacing;
export type BreakpointScale = keyof typeof designTokens.breakpoints;
