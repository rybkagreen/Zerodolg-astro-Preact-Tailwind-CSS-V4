// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
// import mcp from 'astro-mcp'; // Temporarily disabled due to JSON parsing error
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://zerodolg.ru',

  // Hybrid mode: server output + prerender for static pages
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  // Оптимизация сборки
  build: {
    // Отключаем встроенные стили для более надежной загрузки CSS
    inlineStylesheets: 'never',
    // Улучшенная оптимизация для лучшего кэширования
    rollupOptions: {
      output: {
        // Оптимизация чанков для лучшей загрузки
        manualChunks: {
          vendor: ['preact', 'preact/hooks'],
          ui: ['@astrojs/preact'],
        },
      },
    },
  },

  integrations: [
    preact({
      // Включаем React DevTools для разработки
      devtools: process.env.NODE_ENV === 'development',
    }),
    // mcp(), // Temporarily disabled
    // Используем динамический sitemap.xml.ts вместо интеграции для SSR режима
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api', '/_astro/'],
        },
      ],
      sitemap: 'https://zerodolg.ru/sitemap.xml',
    }),
  ],

  // Оптимизация Vite
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@app': '/src/app',
        '@entities': '/src/entities',
        '@features': '/src/features',
        '@widgets': '/src/widgets',
        '@shared': '/src/shared',
        '@pages': '/src/pages',
      },
    },
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
            vendor: ['preact', 'preact/hooks'],
            ui: ['@astrojs/preact'],
          },
          // Улучшенное именование файлов для кэширования
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      // Включаем дополнительные оптимизации для production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
        mangle: true,
        format: {
          comments: false,
        },
      },
    },
  },

  // Настройки сервера разработки
  server: {
    port: 4321,
    host: true,
  },

  // Включаем сжатие HTML для уменьшения размера
  compressHTML: true,

  // Оптимизация изображений
  image: {
    // Используем Sharp для оптимизации изображений
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    // Оптимальное качество для веба
    quality: 80,
    // Поддержка современных форматов
    formats: ['avif', 'webp'],
  },

  // Включаем предзагрузку для улучшения производительности
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
