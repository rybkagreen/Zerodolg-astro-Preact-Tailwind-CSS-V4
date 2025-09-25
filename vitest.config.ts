import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig({
  test: {
    // Vitest specific options
    globals: true,
    environment: 'happy-dom', // Use happy-dom for DOM API support
    setupFiles: ['./vitest.setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx,js,jsx}'],
    testTimeout: 10000, // 10 seconds timeout
    hookTimeout: 15000, // 15 seconds timeout for hooks
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '.astro/**',
        '**/*.d.ts',
        '**/types/**',
        'vitest.config.ts',
        'vitest.setup.ts',
        '__tests__/**',
        'public/**',
        'scripts/**',
        'tools/**',
        'eslint.config.js',
        'astro.config.mjs',
        'astro.config.prod.mjs',
        'tailwind.config.js',
        'postcss.config.cjs',
      ],
    },
  },
  ...getViteConfig(),
});