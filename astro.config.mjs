// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    optimizeDeps: {
      include: ['preact', 'preact/hooks']
    }
  }
});
