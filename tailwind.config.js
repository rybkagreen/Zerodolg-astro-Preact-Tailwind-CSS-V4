// Tailwind CSS v3 Production Configuration with Design Tokens
// Modern 2025 architecture for scalable web applications

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@astrojs/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],

  darkMode: 'class', // Modern class-based dark mode

  theme: {
    // Complete theme system with design tokens
    extend: {
      // Color system - OKLCH for better color science
      colors: {
        // Primary brand colors
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
          DEFAULT: 'oklch(48.25% 0.227 262.89)',
        },

        // Accent colors
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
          DEFAULT: 'oklch(67.96% 0.156 39.93)',
        },

        // Semantic colors
        success: {
          50: 'oklch(96.3% 0.029 142.13)',
          100: 'oklch(92.4% 0.058 142.13)',
          500: 'oklch(72.04% 0.117 142.13)',
          600: 'oklch(65.69% 0.125 142.13)',
          DEFAULT: 'oklch(72.04% 0.117 142.13)',
        },
        error: {
          50: 'oklch(96.3% 0.043 22.91)',
          100: 'oklch(92.4% 0.087 22.91)',
          500: 'oklch(63.78% 0.174 22.91)',
          600: 'oklch(58.56% 0.185 22.91)',
          DEFAULT: 'oklch(63.78% 0.174 22.91)',
        },
        warning: {
          50: 'oklch(97.8% 0.029 90.43)',
          100: 'oklch(94.5% 0.059 90.43)',
          500: 'oklch(83.06% 0.118 90.43)',
          600: 'oklch(76.88% 0.126 90.43)',
          DEFAULT: 'oklch(83.06% 0.118 90.43)',
        },
        info: {
          50: 'oklch(96.3% 0.033 231.8)',
          100: 'oklch(92.4% 0.065 231.8)',
          500: 'oklch(70.2% 0.131 231.8)',
          600: 'oklch(64.12% 0.140 231.8)',
          DEFAULT: 'oklch(70.2% 0.131 231.8)',
        },
      },

      // Typography scale - Perfect Fourth (1.333)
      fontFamily: {
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

      // Extended spacing scale
      spacing: {
        18: '4.5rem', // 72px
        88: '22rem', // 352px
        128: '32rem', // 512px
      },

      // Extended border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Enhanced shadows
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        soft: '0 2px 15px 0 rgb(0 0 0 / 0.1)',
        medium: '0 4px 20px 0 rgb(0 0 0 / 0.12)',
        hard: '0 8px 30px 0 rgb(0 0 0 / 0.15)',
        glow: '0 0 20px rgb(59 130 246 / 0.5)',
      },

      // Animation system
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        float: 'float 6s ease-in-out infinite',
        typing: 'typing 3.5s steps(40, end)',
        blink: 'blink 1s infinite',
      },

      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'currentColor' },
        },
      },

      // Enhanced background utilities
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
      },

      // Z-index scale
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },

      // Extended screens
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },

      // Typography enhancements
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'oklch(15.22% 0.012 227.25)',
            '[class~="lead"]': {
              color: 'oklch(37.14% 0.015 227.25)',
            },
            strong: {
              color: 'oklch(15.22% 0.012 227.25)',
              fontWeight: '600',
            },
            'h1, h2, h3, h4': {
              color: 'oklch(15.22% 0.012 227.25)',
            },
          },
        },
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],

  // Performance optimizations
  corePlugins: {
    preflight: true,
  },
};
