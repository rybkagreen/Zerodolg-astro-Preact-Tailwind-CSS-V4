// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import robotsTxt from 'astro-robots-txt';

// Production-specific configuration with enhanced optimizations
// https://astro.build/config
export default defineConfig({
  site: 'https://zerodolg.ru',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    preact(),
    // Используем динамический sitemap.xml.ts вместо интеграции для SSR режима
    // Robots.txt generation
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/private/'],
        },
      ],
      sitemap: 'https://zerodolg.ru/sitemap.xml',
    }),
  ],
  output: 'server', // Server mode with prerender for static pages
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
    serverEntry: 'entry.mjs',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      // Enable CSS and JS minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          ecma: 2020,
          module: true,
          passes: 3,
          unsafe_arrows: true,
          unsafe_methods: true,
          pure_getters: true,
          unsafe_comps: true,
        },
        format: {
          comments: false,
        },
      },
      // Use default CSS minification
      cssMinify: true,
      // Asset compression settings
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['preact', 'preact/hooks'],
            ui: ['@astrojs/preact'],
          },
          // Better chunk naming for improved caching
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      // Report compressed chunk sizes
      chunkSizeWarningLimit: 1000,
    },
    // Production-specific Vite settings
    appType: 'custom',
  },
  compressHTML: true,
  // Image optimization settings
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    quality: 80,
    formats: ['avif', 'webp'],
  },
  // Performance optimizations
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
