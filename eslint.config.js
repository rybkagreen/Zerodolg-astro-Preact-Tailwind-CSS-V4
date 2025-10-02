// @ts-check
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Global ignores - важно поставить в начало
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      '*.min.js',
      'public/**',
      'coverage/**',
      '__tests__/**',
      'vitest.config.ts',
      'vitest.setup.ts',
      '.git/**',
      '.github/**',
      'eslint.config.js',
      'jest.config.cjs',
      'jest.setup.ts',
      'astro.config.mjs',
      'astro.config.prod.mjs',
      'astro.config.optimized.mjs',
      'tailwind.config.js',
      'postcss.config.cjs',
      '**/*.d.ts',
      'simple-test.cjs',
      'test-js-functionality.cjs',
      'fix-dependencies.js',
      'tools/**',
      'scripts/**',
      'tsconfig.test.json',
      // Debug and utility files
      '**/modal-debug.ts',
      '**/*.optimized.*',
      '**/puppeteer-helper.js',
      '**/test-modal.astro',
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

  // Skip TypeScript parsing for JavaScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: [
      'scripts/**',
      'tools/**',
      'public/**',
      '__tests__/**',
      '**/*.test.*',
      '**/*.spec.*',
      'simple-test.cjs',
      'test-js-functionality.cjs',
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
      // TypeScript specific rules - modern 2025 best practices
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Более мягко для продакшена
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Отключаем для удобства
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 3,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
          allowObjectTypes: 'never',
        },
      ],

      // Modern JavaScript/TypeScript best practices
      'object-shorthand': 'error',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],

      // Base rules
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead

      // Security and performance
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
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
      // Astro-specific rule overrides - более мягкие для продакшена
      'astro/no-set-html-directive': 'warn', // Предупреждение вместо ошибки
      'astro/no-unused-css-selector': 'warn',
      'astro/prefer-class-list-directive': 'warn',
      'astro/prefer-object-class-list': 'warn',

      // TypeScript rules for Astro files - более мягкие
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Разрешаем console в Astro файлах для отладки
      'no-console': 'off',
    },
  },

  // Scripts and tools configuration - relaxed rules for development utilities
  {
    files: ['scripts/**/*', 'tools/**/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        console: true,
        process: true,
        Buffer: true,
        __dirname: true,
        __filename: true,
      },
    },
    rules: {
      // Разрешенные в скриптах и инструментах
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-process-exit': 'off',
      'prefer-const': 'off',
      'no-undef': 'off',
    },
  },

  // Test files configuration - максимально мягкие правила для тестов
  {
    files: [
      '**/__tests__/**/*',
      '**/*.test.*',
      '**/*.spec.*',
      'vitest.config.*',
      'vitest.setup.*',
      'simple-test.cjs',
      'test-js-functionality.cjs',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
        vi: true, // Vitest global
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        jest: true,
        window: true,
        document: true,
        global: true,
      },
    },
    rules: {
      // Полное отключение строгих правил для тестов
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
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
