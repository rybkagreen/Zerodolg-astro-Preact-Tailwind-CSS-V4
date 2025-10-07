# Qwen Code Extension Context

Этот файл содержит контекстуальную информацию для расширений Qwen Code,
используемых в проекте Astro.

## Проект

Это проект веб-сайта на Astro версии 5.13.7 для компании, предоставляющей
юридические услуги по банкротству.

## Технологии

- Astro 5.14.1
- Preact 10.27.2 для интерактивных компонентов
- TypeScript 5.9.3
- Tailwind CSS 3.4.17 для стилизации
- CSS с пользовательскими свойствами
- @modelcontextprotocol/sdk 1.19.1 и astro-mcp 0.4.2 для Model Context Protocol
- zod 4.1.11 для валидации схем

## Окружение разработки

### WSL2 Ubuntu (Рекомендуется)

Проект оптимизирован для разработки в WSL2 Ubuntu для лучшей производительности
и совместимости с инструментами разработки.

**Расположение проекта:**

- WSL2 путь: `~/develop/zerodolg.ru/zerodolg-astro`
- Windows путь: `\\wsl$\Ubuntu\root\develop\zerodolg.ru\zerodolg-astro`

**Требования:**

- Node.js >=18.17.1 (установленная версия v24.9.0)
- npm 10+
- Git с настроенными SSH ключами для GitHub

**Работа с проектом:**

```bash
# Вход в WSL2
wsl

# Переход в директорию проекта
cd ~/develop/zerodolg.ru/zerodolg-astro

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка проекта
npm run build
```

**Работа из Windows PowerShell:**

```powershell
# Запуск команд в WSL2 без входа
wsl bash -c "cd ~/develop/zerodolg.ru/zerodolg-astro && npm run dev"

# Проверка статуса
wsl bash -c "cd ~/develop/zerodolg.ru/zerodolg-astro && git status"
```

**Преимущества WSL2:**

- Значительно быстрее работа с npm и файловой системой
- Нативная совместимость с Linux-инструментами
- Меньше проблем с путями и правами доступа
- Лучшая производительность Docker (если используется)

### Windows (Альтернатива)

Проект также может работать в Windows, но с меньшей производительности:

- Расположение: `D:\develop\zerodolg.ru\zerodolg-astro`
- Все команды выполняются через PowerShell
- Могут возникать проблемы с длинными путями и правами доступа

## Архитектура

- Islands Architecture: интерактивные компоненты только там, где они необходимы
- Статическая генерация: предварительно отрендеренный HTML для повышения
  производительности
- Прогрессивное улучшение: работает без JavaScript
- Компонентный подход: модульные и повторно используемые компоненты
- Feature-Sliced Design: организация кода по бизнес-функциям и слоям

## Структура проекта

```
zerodolg-astro/
├── .dockerignore        # Docker ignore rules
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore rules
├── .prettierrc          # Prettier formatting configuration
├── .qwen/               # Qwen AI assistant configuration
├── .vscode/             # VS Code configuration
├── ANIMATION_FIX.md     # Animation fixes documentation
├── AOS_ANIMATION_FIXES.md # AOS animation fixes documentation
├── AOS_FIXES_SUMMARY.md # AOS fixes summary
├── AOS_GRADIENT_TRANSITION_ANALYSIS.md # AOS gradient transition analysis
├── astro.config.mjs     # Main Astro configuration
├── astro.config.optimized.mjs # Optimized Astro configuration
├── astro.config.prod.mjs # Production Astro configuration
├── BITRIX24_SETUP.md    # Bitrix24 setup documentation
├── BORDER_TO_BORDER_LAYOUT.md # Border to border layout documentation
├── config.puppeteer.js  # Puppeteer configuration
├── CSS_OPTIMIZATION_GUIDE.md # CSS optimization guide
├── DEPLOY_SSR_GUIDE.md  # SSR deployment guide
├── deploy-ssr.ps1       # PowerShell SSR deployment script
├── deploy-ssr.sh        # Bash SSR deployment script
├── DEPLOY.md            # Deployment documentation
├── deploy.ps1           # PowerShell deployment script
├── deploy.sh            # Bash deployment script
├── docker-compose.*.yml # Docker Compose configurations
├── DOCKER_SETUP_GUIDE.md # Docker setup guide
├── DOCS_STRUCTURE.md    # Documentation structure
├── ecosystem.config.js  # PM2 process configuration
├── env.d.ts             # TypeScript environment definitions
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Lock file for dependencies
├── postcss.config.mjs   # PostCSS configuration
├── public/              # Static assets
│   ├── favicon.svg      # Favicon
│   ├── favicon.png      # Favicon (alternative)
│   ├── favicon.ico      # Favicon (legacy)
│   ├── logo/            # Logo assets
│   └── robots.txt       # SEO/robot instructions
├── screenshots/         # Screenshots and comparison reports
├── scripts/             # Organized development scripts
│   ├── build/           # Build-related scripts
│   ├── deploy/          # Deployment scripts
│   ├── dev/             # Development utilities
│   ├── maintenance/     # Maintenance and optimization
│   └── staging/         # Staging environment scripts
├── src/                 # Source code
│   ├── app/             # Application-specific files
│   │   └── styles/      # Tailwind CSS styles
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components (Button, Card, etc.)
│   │   ├── forms/       # Form components
│   │   ├── layout/      # Layout components (Header, Footer, etc.)
│   │   └── sections/    # Page sections (Hero, Benefits, etc.)
│   ├── entities/        # Business entities
│   ├── features/        # Business-feature specific logic
│   │   ├── analytics/   # Analytics feature
│   │   ├── calculator/  # Calculator feature
│   │   ├── forms/       # Form handling feature
│   │   └── modals/      # Modal dialogs feature
│   ├── islands/         # Interactive Preact components only
│   │   ├── forms/       # Interactive form components
│   │   ├── interactive/ # Interactive components (TeamInteractive, etc.)
│   │   ├── layout/      # Interactive layout components
│   │   ├── shared/      # Shared interactive components
│   │   └── utils/       # Interactive utilities
│   ├── layouts/         # Page layouts
│   ├── middleware.ts    # Security and caching middleware
│   ├── pages/           # Page routes
│   ├── shared/          # Shared utilities and APIs
│   └── widgets/         # Complex UI components
├── tools/               # Standalone utility tools
├── tsconfig.json        # TypeScript configuration
├── CONTRIBUTING.md      # Contribution guidelines
└── Configuration Files  # Root-level config files
```

## Деплой и архитектура

- Гибридная архитектура: поддержка как статических страниц, так и SSR
- API endpoints полностью функциональны в SSR режиме
- POST запросы обрабатываются Node.js сервером
- Формы работают корректно через `/api/form` endpoint
- Используется PM2 для управления Node.js процессами в продакшене
- Интеграция с Bitrix24 через webhook для обработки заявок

## Docker и staging

- Настроена конфигурация Docker и docker-compose для staging окружения
- Используется многоступенчатая сборка для оптимизации размера образа
- Стейджинг запускается командой `npm run staging:up`
- Используется nginx как reverse proxy в Docker контейнере
- Есть скрипты для запуска, остановки и очистки staging окружения

## Зависимости и инструменты

- Управление зависимостями через npm
- Проверка устаревших зависимостей
- Обновление зависимостей с учетом совместимости
- Tailwind CSS 3.4.17 с кастомной конфигурацией
- Интеграция с Bitrix24 через API
- Использование Model Context Protocol (MCP) через astro-mcp
- Автоматическое копирование CSS файлов из server в client директории после
  сборки

## Git и SSH в WSL2

**Настройка SSH для GitHub:**

SSH ключи должны быть скопированы из Windows в WSL2:

```bash
# Создание директории .ssh
mkdir -p ~/.ssh && chmod 700 ~/.ssh

# Копирование ключей из Windows
cp /mnt/c/Users/alex_/.ssh/ssh-key-* ~/.ssh/

# Настройка прав доступа
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Добавление GitHub в known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

**Работа с Git:**

```bash
# Проверка статуса
git status

# Коммит изменений (требуется соблюдение формата)
git commit -m "type(scope): description"

# Форматы типов: feat, fix, docs, style, refactor, test, chore, perf, ci, build
# Пример: chore(docs): update documentation for WSL2

# Push в удалённый репозиторий
git push origin <branch-name>
```

## Миграция проекта в WSL2

Если проект изначально был в Windows и нужно мигрировать:

1. Убедитесь, что все изменения закоммичены и отправлены в удалённый репозиторий
2. Настройте SSH ключи в WSL2 (см. выше)
3. Клонируйте проект в WSL2:
   ```bash
   mkdir -p ~/develop/zerodolg.ru
   cd ~/develop/zerodolg.ru
   git clone -b <branch-name> git@github.com:rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4.git zerodolg-astro
   ```
4. Установите зависимости:
   ```bash
   cd zerodolg-astro
   npm install
   ```
5. Проверьте работоспособность:
   ```bash
   npm run dev
   ```

## Команды разработки

### Основные команды

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with validation
- `npm run preview` - Preview built site
- `npm run astro` - Run Astro CLI commands

### Линтинг и форматирование

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Работа с окружением

- `npm run env:validate` - Validate environment variables
- `npm run env:setup` - Setup environment variables

### Работа с зависимостями

- `npm run maintenance:audit` - Audit dependencies for vulnerabilities
- `npm run maintenance:optimize-images` - Optimize images
- `npm run maintenance:lighthouse` - Run Lighthouse audit

### Работа с тестированием и анализом

- `npm run puppeteer:setup` - Setup Puppeteer browsers
- `npm run mcp:server` - Start MCP Puppeteer server
- `npm run mcp:demo` - Run MCP Puppeteer demo
- `npm run tools:compare-sites` - Compare sites
- `npm run tools:semgrep` - Run Semgrep security scan
- `npm run tools:trufflehog` - Run TruffleHog security scan

### Работа с деплоем

- `npm run deploy:checklist` - Run deployment checklist
- `npm run deploy:verify` - Verify deployment
- `npm run deploy:rollback` - Rollback deployment
- `npm run deploy:backup` - Create backup before deployment
- `npm run deploy` - Deploy to production

### Очистка и обслуживание

- `npm run clean` - Clean build artifacts and cache

### Работа со staging

#### Full staging setup:

- `npm run staging:up` - Start staging environment with Docker
- `npm run staging:down` - Stop staging environment
- `npm run staging:logs` - View staging logs
- `npm run staging:restart` - Restart staging environment
- `npm run staging:clean` - Clean staging environment
- `npm run staging:test` - Run tests on staging environment
- `npm run staging:test:verbose` - Run tests on staging environment (verbose)

#### Simple staging setup:

- `npm run staging:simple:up` - Start simple staging environment
- `npm run staging:simple:down` - Stop simple staging environment
- `npm run staging:simple:logs` - View simple staging logs
- `npm run staging:simple:restart` - Restart simple staging environment

#### SSR staging setup:

- `npm run staging:ssr:up` - Start SSR staging environment
- `npm run staging:ssr:down` - Stop SSR staging environment
- `npm run staging:ssr:logs` - View SSR staging logs
- `npm run staging:ssr:restart` - Restart SSR staging environment

## Dev dependencies

- @astrojs/check 0.9.4
- @astrojs/node 9.4.4
- @eslint/js 9.36.0
- @lhci/cli 0.15.1
- @tailwindcss/typography 0.5.19
- @types/node 24.5.2
- @types/puppeteer 5.4.7
- @typescript-eslint/eslint-plugin 8.44.1
- @typescript-eslint/parser 8.44.1
- astro-eslint-parser 1.2.2
- autoprefixer 10.4.21
- cssnano 7.1.1
- eslint 9.36.0
- eslint-plugin-astro 1.3.1
- globals 16.4.0
- husky 9.1.7
- lightningcss 1.30.2
- lint-staged 16.2.0
- postcss 8.5.6
- postcss-import 16.1.1
- postcss-nesting 13.0.2
- postcss-preset-env 10.4.0
- prettier 3.6.2
- prettier-plugin-astro 0.14.1
- puppeteer 24.23.0
- rimraf 6.0.1
- sharp 0.34.4
- stylelint 16.25.0
- stylelint-config-recommended 17.0.0
- stylelint-config-standard 39.0.0
- tailwindcss 3.4.17
- terser 5.44.0
- tsx 4.20.6
- typescript 5.9.2
- typescript-eslint 8.44.1
