// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
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
          passes: 2,
          unsafe_arrows: true,
          unsafe_methods: true,
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
      // Enable asset compression
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['preact', 'preact/hooks'],
          }
        }
      }
    },
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
