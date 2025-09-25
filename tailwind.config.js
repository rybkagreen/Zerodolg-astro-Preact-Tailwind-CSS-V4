// Tailwind CSS v4 configuration for full Tailwind-only approach
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/astro/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#60a5fa',
        },
        // Accent colors
        accent: {
          DEFAULT: '#ea580c',
          dark: '#c2410c',
          light: '#fb923c',
          gold: '#ffd700',
          orange: '#fb923c',
        },
        // Status colors
        success: {
          DEFAULT: '#059669',
          light: '#10b981',
        },
        error: {
          DEFAULT: '#dc2626',
          light: '#ef4444',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#f59e0b',
        },
        // Text colors
        text: {
          DEFAULT: '#1e293b',
          muted: '#64748b',
          light: '#94a3b8',
          inverse: '#ffffff',
        },
        // Background colors
        bg: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          dark: '#f1f5f9',
          accent: '#eff6ff',
        },
        // Border colors
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#cbd5e1',
          light: 'rgba(0, 0, 0, 0.05)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        xl: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
