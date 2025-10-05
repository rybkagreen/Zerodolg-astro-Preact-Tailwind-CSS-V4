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

## Окружение разработки

### WSL2 Ubuntu (Рекомендуется)

Проект оптимизирован для разработки в WSL2 Ubuntu для лучшей производительности
и совместимости с инструментами разработки.

**Расположение проекта:**

- WSL2 путь: `~/develop/zerodolg.ru/zerodolg-astro`
- Windows путь: `\\wsl$\Ubuntu\root\develop\zerodolg.ru\zerodolg-astro`

**Требования:**

- Node.js 20+ (рекомендуется)
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
│   └── architecture.md  # Architecture documentation
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
- Поддержка экспериментальной версии Tailwind CSS v4
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
