# Qwen Code Extension Context

Этот файл содержит контекстуальную информацию для расширений Qwen Code,
используемых в проекте Astro.

## Проект

Это проект веб-сайта на Astro версии 5.13.7 для компании, предоставляющей
юридические услуги по банкротству.

## Технологии

- Astro 5.13.7
- Preact 10.27.1 для интерактивных компонентов
- TypeScript 5.9.2
- Tailwind CSS (экспериментальная версия v4) для стилизации
- CSS с пользовательскими свойствами

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
├── .github/             # GitHub-specific files
│   └── workflows/       # GitHub Actions workflows
│       └── ci.yml       # CI/CD pipeline
├── .husky/              # Git hooks configuration
├── .qwen/               # Qwen AI assistant configuration
├── .vscode/             # VS Code configuration
├── docs/                # Documentation files
│   ├── analysis/        # Analysis reports
│   ├── blog/            # Blog content
│   ├── migrations/      # Migration guides
│   ├── optimization/    # Optimization guides and checklists
│   ├── setup/           # Setup and configuration docs
│   ├── architecture.md  # Architecture documentation
│   └── style-guide.md   # Style guide documentation
├── public/              # Static assets
├── screenshots/         # Screenshots and comparison reports
├── scripts/             # Organized development scripts
│   ├── build/           # Build-related scripts
│   ├── deploy/          # Deployment scripts
│   ├── dev/             # Development utilities
│   ├── maintenance/     # Maintenance and optimization
│   └── test/            # Testing scripts
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
├── CONTRIBUTING.md      # Contribution guidelines
└── Configuration Files  # Root-level config files
```

## Astro Development

- Запуск сервера разработки с горячей перезагрузкой
- Сборка проекта для продакшена
- Просмотр собранного проекта
- Тестирование и проверка типов
- Линтинг кода
- Работа с экспериментальной версией Tailwind CSS v4
- Реализация безопасности через middleware
