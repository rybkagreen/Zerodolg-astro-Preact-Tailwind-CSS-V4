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
- `@modelcontextprotocol/sdk` 1.19.1 и astro-mcp 0.4.2 для Model Context
  Protocol
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

## Astro Development

- Запуск сервера разработки с горячей перезагрузкой
- Сборка проекта для продакшена
- Просмотр собранного проекта
- Тестирование и проверка типов
- Линтинг кода
- Форматирование кода с помощью Prettier
- Использование экспериментальной версии Tailwind CSS
- Реализация безопасности через middleware
- Поддержка SSR и гибридной архитектуры
- Интеграция с Model Context Protocol (MCP)
- Поддержка TypeScript и Zod для валидации схем
