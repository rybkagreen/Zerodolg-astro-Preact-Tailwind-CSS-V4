#!/usr/bin/env node

/**
 * Скрипт автоматической настройки инструментов оптимизации
 * Запуск: node scripts/setup-optimization.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n📦 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} - выполнено!`, 'green');
    return true;
  } catch (error) {
    log(`❌ Ошибка при выполнении: ${description}`, 'red');
    console.error(error.message);
    return false;
  }
}

function createFile(filePath, content, description) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    log(`✅ Создан файл: ${filePath}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Ошибка при создании файла: ${filePath}`, 'red');
    console.error(error.message);
    return false;
  }
}

function updateJsonFile(filePath, updates, description) {
  try {
    let config = {};
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      config = JSON.parse(content);
    }
    
    // Глубокое слияние объектов
    const mergedConfig = deepMerge(config, updates);
    
    fs.writeFileSync(filePath, JSON.stringify(mergedConfig, null, 2));
    log(`✅ Обновлен файл: ${filePath}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Ошибка при обновлении файла: ${filePath}`, 'red');
    console.error(error.message);
    return false;
  }
}

function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

async function main() {
  log('\n🚀 Начинаем настройку инструментов оптимизации для проекта ZeroDolg\n', 'yellow');

  // 1. Установка зависимостей для качества кода
  log('\n📋 Этап 1: Установка инструментов качества кода', 'yellow');
  
  const devDependencies = [
    'prettier',
    'husky',
    'lint-staged',
    '@typescript-eslint/parser',
    '@typescript-eslint/eslint-plugin',
    'eslint-config-prettier',
    'eslint-plugin-prettier'
  ];
  
  execCommand(
    `npm install -D ${devDependencies.join(' ')}`,
    'Установка инструментов качества кода'
  );

  // 2. Создание конфигурации Prettier
  log('\n📋 Этап 2: Настройка Prettier', 'yellow');
  
  const prettierConfig = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}`;

  createFile('.prettierrc', prettierConfig, 'Конфигурация Prettier');
  
  const prettierIgnore = `# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
.astro/
*.min.js
*.min.css

# Coverage reports
coverage/

# Environment files
.env*

# IDE
.vscode/
.idea/`;

  createFile('.prettierignore', prettierIgnore, 'Prettier ignore файл');

  // 3. Обновление TypeScript конфигурации для строгого режима
  log('\n📋 Этап 3: Настройка строгого TypeScript', 'yellow');
  
  updateJsonFile('tsconfig.json', {
    compilerOptions: {
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      baseUrl: ".",
      paths: {
        "@core/*": ["src/core/*"],
        "@features/*": ["src/features/*"],
        "@shared/*": ["src/shared/*"],
        "@widgets/*": ["src/widgets/*"],
        "@styles/*": ["src/styles/*"],
        "@types/*": ["src/core/types/*"],
        "@utils/*": ["src/shared/utils/*"]
      }
    }
  }, 'TypeScript конфигурация');

  // 4. Настройка Husky и lint-staged
  log('\n📋 Этап 4: Настройка Git hooks', 'yellow');
  
  execCommand('npx husky install', 'Инициализация Husky');
  
  updateJsonFile('package.json', {
    scripts: {
      prepare: 'husky install',
      'lint:fix': 'eslint . --ext .js,.ts,.tsx,.astro --fix',
      'format': 'prettier --write "src/**/*.{js,ts,tsx,astro,css}"',
      'format:check': 'prettier --check "src/**/*.{js,ts,tsx,astro,css}"',
      'quality:check': 'npm run lint && npm run format:check && npm run type-check'
    },
    'lint-staged': {
      '*.{js,ts,tsx,astro}': [
        'eslint --fix',
        'prettier --write'
      ],
      '*.{css,scss}': [
        'prettier --write'
      ],
      '*.{json,md}': [
        'prettier --write'
      ]
    }
  }, 'package.json scripts и lint-staged');

  // Создание pre-commit хука
  const preCommitHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged`;

  createFile('.husky/pre-commit', preCommitHook, 'Pre-commit хук');
  
  // Делаем хук исполняемым (на Unix-системах)
  if (process.platform !== 'win32') {
    execCommand('chmod +x .husky/pre-commit', 'Установка прав на pre-commit хук');
  }

  // 5. Создание базовой структуры папок
  log('\n📋 Этап 5: Создание оптимизированной структуры папок', 'yellow');
  
  const folders = [
    'src/core/config',
    'src/core/constants',
    'src/core/types',
    'src/features/calculator/ui',
    'src/features/calculator/model',
    'src/features/calculator/api',
    'src/features/forms/ui',
    'src/features/forms/model',
    'src/features/forms/api',
    'src/features/modals/ui',
    'src/features/modals/model',
    'src/shared/ui',
    'src/shared/hooks',
    'src/shared/utils',
    'src/shared/api',
    'src/widgets/header',
    'src/widgets/footer',
    'src/widgets/faq',
    'src/widgets/reviews'
  ];

  folders.forEach(folder => {
    const folderPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      log(`📁 Создана папка: ${folder}`, 'green');
    }
  });

  // 6. Создание файла с дизайн-токенами
  log('\n📋 Этап 6: Создание системы дизайн-токенов', 'yellow');
  
  const designTokens = `/**
 * Дизайн токены для проекта ZeroDolg
 */

export const tokens = {
  colors: {
    // Основные цвета
    primary: {
      50: '#e6f1ff',
      100: '#b3d4ff',
      200: '#80b8ff',
      300: '#4d9bff',
      400: '#1a7eff',
      500: '#0066cc', // Основной цвет
      600: '#0052a3',
      700: '#003d7a',
      800: '#002952',
      900: '#001429'
    },
    secondary: {
      50: '#e6f7f2',
      100: '#b3e6d8',
      200: '#80d5be',
      300: '#4dc4a4',
      400: '#1ab38a',
      500: '#00a86b', // Вторичный цвет
      600: '#008656',
      700: '#006541',
      800: '#00432b',
      900: '#002216'
    },
    semantic: {
      success: '#00a86b',
      warning: '#ffa500',
      error: '#dc3545',
      info: '#17a2b8'
    },
    neutral: {
      white: '#ffffff',
      50: '#f8f9fa',
      100: '#f1f3f5',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
      black: '#000000'
    }
  },
  
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem',  // 96px
    '5xl': '8rem'   // 128px
  },
  
  typography: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Monaco, Consolas, monospace'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    },
    fontWeight: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },
  
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },
  
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  transitions: {
    duration: {
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
      slower: '500ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  zIndex: {
    below: -1,
    base: 0,
    above: 1,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080
  }
};

export type DesignTokens = typeof tokens;
`;

  createFile('src/core/constants/design-tokens.ts', designTokens, 'Файл с дизайн-токенами');

  // 7. Установка дополнительных инструментов для SEO и производительности
  log('\n📋 Этап 7: Установка инструментов для SEO и производительности', 'yellow');
  
  const seoDevDependencies = [
    '@astrojs/sitemap',
    'astro-robots-txt',
    'astro-compress',
    'astro-seo'
  ];
  
  execCommand(
    `npm install -D ${seoDevDependencies.join(' ')}`,
    'Установка SEO инструментов'
  );

  // Итоговый отчет
  log('\n\n🎉 Настройка завершена успешно!', 'green');
  log('\n📝 Что было сделано:', 'yellow');
  log('  ✅ Установлены инструменты качества кода (Prettier, Husky, lint-staged)', 'green');
  log('  ✅ Настроен строгий режим TypeScript с алиасами путей', 'green');
  log('  ✅ Созданы Git hooks для автоматической проверки кода', 'green');
  log('  ✅ Создана оптимизированная структура папок', 'green');
  log('  ✅ Добавлена система дизайн-токенов', 'green');
  log('  ✅ Установлены инструменты для SEO оптимизации', 'green');
  
  log('\n📋 Следующие шаги:', 'yellow');
  log('  1. Запустите "npm run format" для форматирования существующего кода', 'blue');
  log('  2. Исправьте TypeScript ошибки командой "npm run type-check"', 'blue');
  log('  3. Начните миграцию компонентов в новую структуру папок', 'blue');
  log('  4. Обновите импорты, используя новые алиасы (@core, @features, @shared)', 'blue');
  log('  5. Создайте SEO компонент используя astro-seo', 'blue');
  
  log('\n💡 Полезные команды:', 'yellow');
  log('  npm run format       - Форматирование всего кода', 'blue');
  log('  npm run lint:fix     - Исправление линтинг ошибок', 'blue');
  log('  npm run quality:check - Полная проверка качества кода', 'blue');
  log('  npm run type-check   - Проверка TypeScript', 'blue');
  
  log('\n📚 Документация:', 'yellow');
  log('  См. PROJECT_OPTIMIZATION_PLAN.md для полного плана оптимизации', 'blue');
  log('  См. OPTIMIZATION_CHECKLIST.md для пошагового чеклиста', 'blue');
}

// Запуск скрипта
main().catch(error => {
  log('\n❌ Произошла критическая ошибка:', 'red');
  console.error(error);
  process.exit(1);
});