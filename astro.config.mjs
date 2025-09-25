// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mcp from 'astro-mcp';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://zerodolg.ru',

  // Современная настройка выходных файлов
  output: 'static',

  // Оптимизация сборки
  build: {
    // Встроенная минификация активна по умолчанию
    inlineStylesheets: 'auto',
  },

  integrations: [
    preact({
      // Включаем React DevTools для разработки
      devtools: process.env.NODE_ENV === 'development',
    }),
    mcp(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Исключаем служебные страницы из sitemap
      filter: (page) => !page.includes('/admin') && !page.includes('/api'),
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api', '/_astro/'],
        },
      ],
      sitemap: 'https://zerodolg.ru/sitemap-index.xml',
    }),
  ],

  // Оптимизация Vite
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
    build: {
      // Включаем tree-shaking для CSS
      cssCodeSplit: true,
      // Оптимизируем размер чанков
      rollupOptions: {
        output: {
          // Разделение vendor пакетов для лучшего кэширования
          manualChunks: {
            preact: ['preact', '@preact/signals'],
          },
        },
      },
    },
  },

  // Настройки сервера разработки
  server: {
    port: 4321,
    host: true,
  },
});
