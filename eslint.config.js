// @ts-check
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Global ignores
  {
    files: ['**/*'],
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      '.astro/**/*',
      '*.min.js',
      'public/**/*',
      'coverage/**/*',
      '.git/**/*',
      '.github/**/*',
      'eslint.config.js',
      'jest.config.cjs',
      'jest.setup.ts',
      'astro.config.mjs',
      'astro.config.prod.mjs',
      'tailwind.config.js',
      'postcss.config.cjs',
      '**/*.d.ts',
      'dist/**/*',
      'public/**/*',
      '__tests__/**/*',
      'src/__tests__/**/*',
      'vitest.config.ts',
      'vitest.setup.ts',
      'simple-test.cjs',
      'test-js-functionality.cjs',
      'tools/**/*',
      'scripts/**/*',
      'scripts/**/*.cjs',
      'scripts/**/*.js',
    ],
  },

  // Base ESLint recommended config
  ...tseslint.configs.recommended,

  // Node.js configuration files
  {
    files: ['astro.config.mjs', 'astro.config.prod.mjs', 'jest.config.cjs', 'postcss.config.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Skip TypeScript parsing for config files by creating a separate config without ts settings
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: [
      'eslint.config.js',
      'tailwind.config.js',
      'astro.config.mjs',
      'astro.config.prod.mjs',
      'jest.config.cjs',
      'postcss.config.cjs',
      'scripts/**/*',
      'tools/**/*',
      'public/**/*',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
    },
  },

  // TypeScript ESLint configs
  ...tseslint.configs.recommended,

  // JavaScript and TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
        gtag: 'readonly',
        ym: 'readonly',
        dataLayer: 'readonly',
      },
    },
    rules: {
      // TypeScript specific rules - stricter rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      // Base rules
      indent: 'off', // Temporarily disabled due to recursion issue in v9.35.0
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead
    },
  },

  // Astro files configuration
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astroPlugin,
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        gtag: 'readonly',
        ym: 'readonly',
        dataLayer: 'readonly',
      },
    },
    processor: astroPlugin.processors['.astro'],
    rules: {
      ...astroPlugin.configs.recommended.rules,
      ...astroPlugin.configs['jsx-a11y-recommended'].rules,
      // Astro-specific rule overrides
      'astro/no-set-html-directive': 'warn',
      'astro/no-unused-css-selector': 'warn',
      // TypeScript rules for Astro files
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  // Scripts and tools configuration - allow relaxed rules for development utilities
  {
    files: ['scripts/**/*', 'tools/**/*', 'src/shared/utils/**/*'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Allow console in scripts and tools
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // Test files configuration
  {
    files: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts', 'vitest.config.ts', 'vitest.setup.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        vi: true, // Vitest global
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
      },
    },
    rules: {
      // Relax some rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // CommonJS files - allow require statements
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
