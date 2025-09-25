# Qwen Code Extension Context

Этот файл содержит контекстуальную информацию для расширений Qwen Code, используемых в проекте Astro.

## Проект

Это проект веб-сайта на Astro версии 5.13.5 для компании, предоставляющей юридические услуги по банкротству.

## Технологии

- Astro 5.13.5
- Preact 10.27.1 для интерактивных компонентов
- TypeScript 5.9.2
- CSS с пользовательскими свойствами

## Архитектура

- Islands Architecture: интерактивные компоненты только там, где они необходимы
- Статическая генерация: предварительно отрендеренный HTML для повышения производительности
- Прогрессивное улучшение: работает без JavaScript
- Компонентный подход: модульные и повторно используемые компоненты

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
│   ├── optimization/    # Optimization guides and checklists
│   └── setup/           # Setup and configuration docs
├── public/              # Static assets
├── screenshots/         # Screenshots and comparison reports
├── scripts/             # Organized development scripts
│   ├── build/           # Build-related scripts
│   ├── deploy/          # Deployment scripts
│   ├── dev/             # Development utilities
│   ├── maintenance/     # Maintenance and optimization
│   └── test/            # Testing scripts
├── src/                 # Source code
├── tools/               # Standalone utility tools
└── Configuration Files  # Root-level config files
```

## Astro Development

- Запуск сервера разработки с горячей перезагрузкой
- Сборка проекта для продакшена
- Просмотр собранного проекта
- Тестирование и проверка типов
- Линтинг кода
