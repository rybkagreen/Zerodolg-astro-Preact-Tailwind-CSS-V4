# Qwen Code Extension Context

Этот файл содержит контекстуальную информацию для расширений Qwen Code,
используемых в проекте Astro.

## Проект

Это проект веб-сайта на Astro версии 5.13.7 для компании, предоставляющей
юридические услуги по банкротству. Проект полностью реализован и размещен на
https://zerodolg.ru. Сайт включает интерактивный калькулятор, интеграцию с
Bitrix24, формы обратной связи и аналитику.

## Технологии

- Astro 5.13.7 с SSR (серверным рендерингом)
- Preact 10.27.2 для интерактивных компонентов (островная архитектура)
- TypeScript 5.9.2 для типобезопасности
- Tailwind CSS 3.4.17 с пользовательскими дизайн-токенами
- CSS с пользовательскими свойствами и ITCSS архитектурой
- Model Context Protocol 1.19.1 и astro-mcp 0.4.2 для Model Context Protocol
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

Проект также может работать в Windows, но с меньшей производительностью:

- Расположение: `D:\develop\zerodolg.ru\zerodolg-astro`
- Все команды выполняются через PowerShell
- Могут возникать проблемы с длинными путями и правами доступа

## Архитектура

- Islands Architecture: интерактивные компоненты только там, где они необходимы
- Серверный рендеринг (SSR): для улучшенного SEO и производительности
- Прогрессивное улучшение: работает без JavaScript
- Компонентный подход: модульные и повторно используемые компоненты
- Feature-Sliced Design: организация кода по бизнес-функциям и слоям
- Гибридный режим: SSR для динамических страниц, SSG для статических

## Структура проекта

```
zerodolg-astro/
├── .astro/                              # Astro build artifacts
├── .claude/                             # Claude AI configuration
├── .github/                             # GitHub configuration
├── .husky/                              # Git hooks
├── .qwen/                               # Qwen AI assistant configuration
├── .vscode/                             # VS Code configuration
├── dist/                                # Build output directory
├── docs/                                # Documentation files
├── logs/                                # Log files
├── node_modules/                        # Node.js dependencies (excluded from map)
├── public/                              # Static assets
│   ├── icons/                           # Favicon and icon files
│   ├── images/                          # Static images
│   ├── js/                              # Client-side JavaScript
│   ├── patterns/                        # Background patterns
│   ├── apple-touch-icon.png             # Apple touch icon
│   ├── favicon.ico                      # Favicon (legacy)
│   ├── favicon.png                      # Favicon (PNG)
│   ├── favicon.svg                      # Favicon (SVG)
│   ├── manifest.json                    # Web app manifest
│   ├── offline.html                     # Offline page
│   ├── robots.txt                       # SEO/robot instructions
│   ├── service-worker.js.disabled       # Service worker (disabled)
│   ├── sitemap.xml                      # Sitemap
│   └── yandex_09474d9fc47249b6.html    # Yandex verification file
├── screenshots/                         # Screenshots and comparison reports
├── scripts/                             # Development and maintenance scripts
│   ├── build/                           # Build-related scripts
│   ├── deploy/                          # Deployment scripts
│   ├── dev/                             # Development utilities
│   ├── maintenance/                     # Maintenance and optimization
│   └── staging/                         # Staging environment scripts
├── src/                                 # Source code
│   ├── app/                             # Application-specific files
│   │   ├── layouts/                     # Main layout components
│   │   └── styles/                      # Tailwind CSS styles
│   ├── components/                      # Reusable UI components
│   │   ├── blog/                        # Blog-related components
│   │   ├── forms/                       # Form components
│   │   └── sections/                    # Page sections (Hero, Benefits, etc.)
│   ├── content/                         # Content collections for blog posts, etc.
│   │   ├── blog/                        # Blog posts and content
│   │   ├── reviews/                     # Customer reviews content
│   │   ├── team/                        # Team member information
│   │   └── config.ts                    # Content collection configuration
│   ├── core/                            # Core application functionality
│   ├── entities/                        # Business entities
│   │   ├── review/                      # Review entity related code
│   │   ├── team/                        # Team entity related code
│   │   └── config.ts                    # Entity configuration
│   ├── features/                        # Business-feature specific logic
│   │   ├── analytics/                   # Analytics feature
│   │   ├── calculator/                  # Calculator feature
│   │   ├── forms/                       # Form handling feature
│   │   └── modals/                      # Modal dialogs feature
│   ├── islands/                         # Interactive Preact components only
│   │   ├── features/                    # Interactive feature components
│   │   ├── forms/                       # Interactive form components
│   │   ├── interactive/                 # Interactive components (TeamInteractive, etc.)
│   │   ├── layout/                      # Interactive layout components
│   │   ├── sections/                    # Interactive sections
│   │   ├── shared/                      # Shared interactive components
│   │   └── utils/                       # Interactive utilities
│   ├── layouts/                         # Page layouts
│   ├── middleware.ts                    # Security and caching middleware
│   ├── pages/                           # Page routes
│   │   ├── api/                         # API endpoints
│   │   ├── blog/                        # Blog-related pages
│   │   ├── bankrotstvo-s-sokhraneniyem-imushchestva.astro  # Bankruptcy with asset preservation page
│   │   ├── health.ts                    # Health check endpoint
│   │   ├── index.astro                  # Homepage
│   │   ├── privacy.astro                # Privacy policy page
│   │   ├── restrukturizaciya-dolgov.astro  # Debt restructuring page
│   │   ├── sitemap.astro                # Sitemap page
│   │   ├── sitemap.xml.ts               # Sitemap XML generation
│   │   └── terms.astro                  # Terms of service page
│   ├── shared/                          # Shared utilities and APIs
│   │   ├── analytics/                   # Analytics utilities
│   │   ├── config/                      # Configuration files
│   │   ├── data/                        # Shared data
│   │   ├── hooks/                       # Shared React/Preact hooks
│   │   ├── lib/                         # Shared libraries
│   │   ├── seo/                         # SEO utilities
│   │   ├── types/                       # TypeScript type definitions
│   │   ├── ui/                          # Shared UI components
│   │   ├── utils/                       # Shared utilities
│   │   └── api/                         # API utilities and clients
│   ├── types/                           # Global TypeScript types
│   │   └── global.d.ts                  # Global type definitions
│   └── widgets/                         # Complex UI components (Header, Footer, Reviews, etc.)
│       ├── faq/                         # FAQ widget components
│       ├── footer/                      # Footer widget components
│       ├── header/                      # Header widget components
│       └── reviews/                     # Reviews widget components
├── tools/                               # Standalone utility tools
├── .dockerignore                        # Docker ignore rules
├── .env.example                         # Example environment variables
├── .gitignore                           # Git ignore rules
├── .prettierrc                          # Prettier formatting configuration
├── astro.config.mjs                     # Main Astro configuration
├── astro.config.optimized.mjs           # Optimized Astro configuration
├── astro.config.prod.mjs                # Production Astro configuration
├── config.puppeteer.js                  # Puppeteer configuration
├── deploy-ssr.ps1                       # PowerShell SSR deployment script
├── deploy-ssr.sh                        # Bash SSR deployment script
├── deploy.ps1                           # PowerShell deployment script
├── deploy.sh                            # Bash deployment script
├── docker-compose.staging.simple.yml    # Docker Compose staging simple configuration
├── docker-compose.staging.ssr.yml       # Docker Compose staging SSR configuration
├── docker-compose.yml                   # Docker Compose configuration
├── Dockerfile                           # Main Dockerfile
├── Dockerfile.ssr                       # SSR Dockerfile
├── Dockerfile.staging                   # Staging Dockerfile
├── Dockerfile.staging.simple            # Staging simple Dockerfile
├── Dockerfile.staging.ssr               # Staging SSR Dockerfile
├── ecosystem.config.cjs                 # PM2 process configuration
├── ecosystem.config.staging.cjs         # PM2 staging process configuration
├── eslint-full-report.txt               # Full ESLint report
├── eslint-report.json                   # ESLint report in JSON
├── eslint.config.js                     # ESLint configuration
├── fix-dependencies.js                  # Dependency fixing script
├── layout-fixes-report.md               # Layout fixes report
├── LICENSE                              # Project license
├── migration-analysis.json              # Migration analysis data
├── nginx_issue_report.json              # Nginx issue report
├── nginx-ssr-staging.conf               # Nginx SSR staging configuration
├── nginx-ssr.conf                       # Nginx SSR configuration
├── nginx-staging.conf                   # Nginx staging configuration
├── nginx.conf                           # Main Nginx configuration
├── optimization_plan.json               # Optimization plan
├── package-lock.json                    # Lock file for dependencies
├── package.json                         # Project dependencies and scripts
├── postcss.config.cjs                   # PostCSS configuration
├── solution-choice-section.astro        # Solution choice section component
├── start-staging.sh                     # Staging start script
├── tailwind.config.js                   # Tailwind CSS configuration
├── temp_zerodolg-ssr-20251007-180938.tar.gz  # Temporary backup file
├── tsconfig.json                        # TypeScript configuration
└── QWEN.md                              # Current file
```

## Зависимости

- Управление зависимостями через npm
- Проверка устаревших зависимостей
- Обновление зависимостей с учетом совместимости
- Поддержка Tailwind CSS v3 с кастомной цветовой палитрой на основе OKLCH
- Интеграция с Bitrix24 через API
- Использование Model Context Protocol (MCP) через astro-mcp

## Стили и CSS

- Использование Tailwind CSS с кастомной цветовой палитрой на основе OKLCH
- Modern CSS features: custom properties, nesting, and modern units
- PostCSS для обработки CSS с плагинами: postcss-import, tailwindcss,
  postcss-nesting, postcss-preset-env, autoprefixer
- CSS Nano для оптимизации в продакшене
- Анимации с использованием keyframes и CSS-анимаций
- ITCSS архитектура с методологией BEM

## Архитектурные решения

- Использование Feature-Sliced Design для организации кода
- Единая стратегия масок и z-index для визуальных слоев
- Использование стандартизованных CSS переменных для слоев и масок
- Поддержка AOS (Animate On Scroll) анимаций
- Интерактивные элементы с использованием Preact островов (islands)
- Пререндеринг статических страниц и SSR для динамических

## Бизнес-логика

- Интеграция с Bitrix24 для обработки заявок
- Интерактивный калькулятор для оценки ситуации с долгами
- Формы для запроса консультаций и обратного звонка
- Калькулятор для расчета стоимости услуг
- SEO-оптимизация с использованием Schema.org структур
- Поддержка серверного рендеринга (SSR) для лучшего SEO
- Аналитика событий и отслеживание конверсий

## Model Context Protocol (MCP) Интеграция

Проект настроен для использования расширенных MCP-серверов, которые обеспечивают
интеграцию с различными инструментами разработки:

- **Astro MCP**: Прямая интеграция с документацией Astro и инструментами
  фреймворка
- **Node.js Dev Server**: Сервер для выполнения скриптов npm, проверки
  зависимостей и запуска dev-сервера
- **Tailwind MCP**: Помощь в работе с утилитами и конфигурацией Tailwind CSS
- **TypeScript Analyzer**: Инструменты для проверки и анали즈 TypeScript кода
- **ESLint MCP**: Проверка качества кода и стилистические рекомендации
- **Git MCP**: Управление операциями Git
- **Astro Performance**: Анализ производительности сборки и рекомендации по
  оптимизации
- **Legal Compliance**: Проверка юридического контента на соответствие нормам
- **Conversion Tracker**: Трекинг конверсий и аналитика
- **Bitrix24 MCP**: Расширенная работа с Bitrix24 API

Для получения максимальной отдачи от этих инструментов, рекомендуется
использовать Qwen Code с поддержкой MCP.

## Специализированные агенты

Проект включает в себя набор специализированных агентов для решения
узкоспециализированных задач:

- **Frontend Specialist**: Создание и модификация Astro компонентов
- **CSS Specialist**: Аrchитектура CSS, методология BEM, ITCSS, Tailwind CSS
- **API Specialist**: Работа с API, формами, интеграции с Bitrix24
- **DevOps Specialist**: Процессы сборки, деплоя, Docker, CI/CD
- **Testing Specialist**: Тестирование, отладка, аудит производительности
- **General Assistant**: Общие вопросы по проекту
- **Bitrix24 Specialist**: Интеграция с Bitrix24, вебхуки, API
- **SEO Specialist**: SEO оптимизация для юридических услуг
- **Accessibility Specialist**: Доступность и соответствие WCAG 2.1

## Команды проекта

Проект включает широкий набор специализированных команд для автоматизации
рутинных задач:

### Команды Bitrix24

- `/bitrix24:test-webhook`: Тестирование вебхуков Bitrix24
- `/bitrix24:sync-contacts`: Синхронизация контактов с Bitrix24
- `/bitrix24:deal-status`: Проверка статусов сделок в Bitrix24

### Команды производительности

- `/perf:audit`: Полный аудит производительности
- `/perf:bundle-analyze`: Анализ размера бандла

### Команды генерации

- `/generate:consultation-form`: Создать типовую форму консультации
- `/generate:service-page`: Создать шаблон страницы услуги
- `/generate:legal-component`: Создать юридический компонент с мета-данными

### Команды мониторинга

- `/monitor:performance`: Мониторинг производительности
- `/monitor:bitrix24-health`: Проверка здоровья интеграции Bitrix24
- `/monitor:seo-health`: Проверка SEO здоровья сайта

### Команды безопасности

- `/security:gdpr-check`: Проверка соответствия GDPR
- `/security:data-protection`: Проверка защиты персональных данных

## Особенности реализации

### Калькулятор

Интерактивный калькулятор реализован с использованием Preact островов и
включает:

- Многоступенчатую форму для оценки ситуации с долгами
- Динамические рекомендации на основе ввода пользователя
- Расчет стоимости, сроков и преимуществ различных решений

### Bitrix24 интеграция

- API endpoint `/api/form` обрабатывает все формы и отправляет в Bitrix24
- Поддержка различных типов форм: callback, consultation, bankruptcy, calculator
- Валидация данных формы перед отправкой
- Таймауты и обработка ошибок

### Аналитика и отслеживание

- Интеграция с Google Analytics
- Интеграция с Yandex Metrics
- Отслеживание конверсий и пользовательских событий
- Подсчет стоимости лида на основе типа формы

### Безопасность и кэширование

- Middleware обеспечивает заголовки безопасности (CSP, X-Frame-Options и др.)
- Настроенное кэширование с различными политиками для разных типов контента
- Валидация всех входящих данных
