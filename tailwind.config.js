// Tailwind CSS v4 configuration
// В v4 конфигурация может быть минимальной, так как основные настройки теперь в CSS

/** @type {import('tailwindcss').Config} */
export default {
  // Контент будет автоматически определяться из @import "tailwindcss"
  // но мы можем добавить дополнительные пути при необходимости
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // Большинство настроек теперь в CSS через @theme
  theme: {},
  // Плагины теперь встроены в v4
  plugins: [],
};
