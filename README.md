# ZeroDolg Astro Website

Корпоративный сайт юридической компании по банкротству физических лиц.

## 🚀 Быстрый старт

```sh
# Установка зависимостей
npm install

# Запуск локального сервера разработки
npm run dev

# Сборка проекта для продакшена
npm run build

# Предварительный просмотр собранного сайта
npm run preview
```

## 📁 Структура проекта

```
zerodolg-astro/
├── .github/                    # GitHub-specific files
│   └── workflows/              # GitHub Actions workflows
│       └── ci.yml              # CI/CD pipeline
├── .husky/                     # Git hooks configuration
├── .qwen/                      # Qwen AI assistant configuration
├── .vscode/                    # VS Code configuration
├── docs/                       # Documentation files
│   ├── analysis/               # Analysis reports
│   ├── blog/                   # Blog content
│   ├── migrations/             # Migration guides
│   ├── optimization/           # Optimization guides and checklists
│   └── setup/                  # Setup and configuration docs
├── public/                     # Static assets
├── screenshots/                # Screenshots and comparison reports
├── scripts/                    # Organized development scripts
│   ├── build/                  # Build-related scripts
│   ├── deploy/                 # Deployment scripts
│   ├── dev/                    # Development utilities
│   ├── maintenance/            # Maintenance and optimization
│   └── test/                   # Testing scripts
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components (Button, Card, etc.)
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components (Header, Footer, etc.)
│   │   └── sections/           # Page sections (Hero, Benefits, etc.)
│   ├── islands/                # Interactive Preact components only
│   │   ├── forms/              # Interactive form components
│   │   ├── interactive/        # Interactive components (TeamInteractive, etc.)
│   │   ├── layout/             # Interactive layout components
│   │   ├── shared/             # Shared interactive components
│   │   └── utils/              # Interactive utilities
│   ├── features/               # Business-feature specific logic
│   │   ├── analytics/          # Analytics feature
│   │   ├── calculator/         # Calculator feature
│   │   ├── forms/              # Form handling feature
│   │   └── modals/             # Modal dialogs feature
│   ├── layouts/                # Page layouts
│   ├── pages/                  # Page routes
│   ├── widgets/                # Complex UI components
│   ├── content/                # Content collections
│   ├── lib/                    # Utilities and helper functions
│   ├── shared/                 # Shared utilities and APIs
│   ├── core/                   # Core application logic
│   └── styles/                 # ITCSS styled architecture
├── tools/                      # Standalone utility tools
└── Configuration Files         # Root-level config files
```

## 📚 Документация

Подробная документация доступна в директории [`docs/`](docs/):

### Основные документы

- [Архитектура](docs/architecture.md) - Проектная архитектура с Feature-Sliced Design
- [Qwen.md](QWEN.md) - Конфигурация и руководство для Qwen Code

### Документация в подкаталогах

- [Оптимизация](docs/optimization/) - Руководства и чек-листы по оптимизации
- [Настройка](docs/setup/) - Документация по настройке и установке
- [Миграции](docs/migrations/) - Гайды по миграции технологий
- [Анализ](docs/analysis/) - Отчеты и результаты анализа проекта
- [Блог](docs/blog/) - Документы, связанные с контентом блога

## 🛠 Технологии

- **[Astro](https://astro.build/)** - Статический генератор сайтов (v5.13.5)
- **[Preact](https://preactjs.com/)** - Легковесная альтернатива React (v10.27.1)
- **[TypeScript](https://www.typescriptlang.org/)** - Строгая типизация JavaScript (v5.9.2)
- **[CSS](https://developer.mozilla.org/ru/docs/Web/CSS)** - Современный CSS с пользовательскими свойствами
- **[Alibaba CMS](https://www.alibabacloud.com/product/cms)** - Облачная система управления контентом
- **[Tailwind CSS](https://tailwindcss.com/)** - Утилитарный CSS-фреймворк v4

## 🎨 Архитектура

### Основные принципы

- **Feature-Sliced Design** - Организация кода по бизнес-функциям и слоям
- **Статическая генерация** - Предварительный рендеринг HTML для максимальной производительности
- **Islands Architecture** - Интерактивные компоненты только там, где они нужны
- **Прогрессивное улучшение** - Сайт работает без JavaScript
- **Компонентный подход** - Модульная и переиспользуемая архитектура

### Стили

- **[ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)** - Инвертированный треугольник CSS для организации стилей
- **[BEM](http://getbem.com/)** - Блок, Элемент, Модификатор для именования CSS классов
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Утилитарный CSS-фреймворк для быстрой разработки
- **Mobile First** - Дизайн сначала для мобильных устройств

## ✅ Статус проекта

Проект полностью завершен и готов к продакшену:

- ✅ Все страницы реализованы и протестированы
- ✅ SEO полностью оптимизирован с robots.txt и sitemap.xml
- ✅ Все интерактивные компоненты работают корректно
- ✅ Формы проходят валидацию и отправляют данные
- ✅ Система модальных окон функционирует правильно
- ✅ Аналитика интегрирована и работает
- ✅ Производительность оптимизирована
- ✅ Дизайн адаптирован для всех устройств
- ✅ Миграция на Tailwind CSS v4 завершена (оценка качества: 83.3%)

## 📦 Команды

| Команда                 | Описание                                      |
| :---------------------- | :-------------------------------------------- |
| `npm run dev`           | Запуск локального сервера разработки          |
| `npm run build`         | Сборка проекта для продакшена                 |
| `npm run build:prod`    | Сборка проекта с оптимизациями для продакшена |
| `npm run preview`       | Предварительный просмотр собранного сайта     |
| `npm run lint`          | Проверка кода с помощью ESLint                |
| `npm run lint:fix`      | Автоматическое исправление ошибок в коде      |
| `npm run type-check`    | Проверка типов TypeScript                     |
| `npm run test`          | Запуск тестов с помощью Jest                  |
| `npm run test:coverage` | Запуск тестов с отчетом о покрытии            |
| `npm run clean`         | Очистка скомпилированных файлов               |

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Alibaba CMS
CMS_API_BASE=https://your-cms-endpoint.alibabacloud.com
CMS_API_KEY=your-api-key-here
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для вашей функции (`git checkout -b feature/AmazingFeature`)
3. Зафиксируйте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Контакты

Для вопросов и поддержки обращайтесь к команде разработки.
