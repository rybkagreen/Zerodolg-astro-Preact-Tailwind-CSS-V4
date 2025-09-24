/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './src/components/**/*.{astro,tsx,jsx}',
    './src/features/**/*.{astro,tsx,jsx}', 
    './src/widgets/**/*.{astro,tsx,jsx}',
    './src/shared/**/*.{astro,tsx,jsx}',
    './src/pages/**/*.{astro,md}'
  ],
  theme: {
    extend: {
      colors: {
        // Точное соответствие существующим CSS переменным
        'primary': {
          DEFAULT: '#2563eb',
          'dark': '#1e40af',
          'light': '#60a5fa',
        },
        'accent': {
          DEFAULT: '#ea580c',
          'dark': '#c2410c', 
          'light': '#fb923c',
          'gold': '#ffd700',
          'orange': '#fb923c',
        },
        'success': {
          DEFAULT: '#059669',
          'light': '#10b981',
        },
        'error': {
          DEFAULT: '#dc2626',
          'light': '#ef4444',
        },
        'warning': {
          DEFAULT: '#d97706',
          'light': '#f59e0b',
        },
        // Дополнительные цвета из проекта
        'nav': {
          'text': '#333333',
          'hover': '#2c5aa0',
        },
        'text': {
          DEFAULT: '#1e293b',
          'muted': '#64748b',
          'light': '#94a3b8',
          'inverse': '#ffffff',
        },
        'bg': {
          DEFAULT: '#ffffff',
          'muted': '#f8fafc',
          'dark': '#f1f5f9',
          'accent': '#eff6ff',
        },
        'border': {
          DEFAULT: '#e2e8f0',
          'dark': '#cbd5e1',
          'light': 'rgba(0, 0, 0, 0.05)',
        }
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
        '6xl': '3.75rem',   // 60px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
  // Важно для production
  safelist: [
    // Динамические классы, которые генерируются в JS
    'hidden',
    'block',
    'opacity-0',
    'opacity-100',
    // Классы для модалок
    'modal-open',
    'modal-backdrop',
  ]
}