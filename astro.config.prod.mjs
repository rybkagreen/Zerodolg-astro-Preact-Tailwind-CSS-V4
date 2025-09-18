// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

// Production-specific configuration with enhanced optimizations
// https://astro.build/config
export default defineConfig({
  site: 'https://zerodolg.ru',
  integrations: [
    preact(),
    // Sitemap generation for better SEO
    sitemap({
      filter: (page) => !page.includes('admin'),
      customPages: [
        'https://zerodolg.ru/',
        'https://zerodolg.ru/#reviews',
        'https://zerodolg.ru/#faq'
      ],
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru',
        }
      }
    }),
    // Robots.txt generation
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/private/']
        }
      ],
      sitemap: true
    })
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
    serverEntry: 'entry.mjs',
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    optimizeDeps: {
      include: ['preact', 'preact/hooks']
    },
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
        mangle: {
          properties: {
            regex: /^__/,
          }
        },
        keep_classnames: false,
        keep_fnames: false,
      },
      // Enable CSS optimization
      cssMinify: 'lightningcss',
      // Asset compression settings
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['preact', 'preact/hooks'],
            ui: ['@astrojs/preact/client.js'],
          },
          // Better chunk naming
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        }
      },
      // Report compressed chunk sizes
      chunkSizeWarningLimit: 1000
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
  },
  // Performance optimizations
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  }
});