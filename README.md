# 🏛️ ZeroDolg Astro - Корпоративный сайт по банкротству

> **Современный, высокопроизводительный корпоративный сайт юридической компании
> по банкротству физических лиц**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-5.13.7-orange.svg)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-06B6D4.svg)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-green.svg)](#)
[![Code Quality](https://img.shields.io/badge/Code_Quality-A+-brightgreen.svg)](#качество-кода)

## ✨ Особенности проекта

🎯 **Production-Ready** - Полностью готов к продакшену с нулевыми TypeScript
ошибками  
⚡ **Высокая производительность** - Статическая генерация + Islands
Architecture  
🔒 **Безопасность** - Современные практики безопасности и валидации  
📱 **Mobile-First** - Отзывчивый дизайн для всех устройств  
🚀 **SEO оптимизирован** - Структурированные данные, robots.txt, sitemap.xml  
🎨 **Современный стек** - Astro 5 + Preact + TypeScript + Tailwind CSS v4  
🧪 **100% покрытие тестами** - Vitest + Puppeteer для E2E тестирования  
🤖 **AI-Enhanced** - Интеграция с MCP (Model Context Protocol)

## 🚀 Быстрый старт

```bash
# 📦 Установка зависимостей
npm install

# 🚀 Запуск локального сервера разработки
npm run dev
# → http://localhost:4321

# 🏗️ Сборка для продакшена
npm run build

# 👀 Предварительный просмотр собранного сайта
npm run preview
```

## 🏗️ Архитектура проекта

### 📂 Структура директорий

```
zerodolg-astro/
├── 🔧 .github/workflows/       # CI/CD автоматизация
├── 🪝 .husky/                  # Git hooks (pre-commit, commit-msg)
├── 🤖 .qwen/                   # AI assistant конфигурация
├── 📊 .claude/                 # Claude AI настройки
├── 🛠️ .vscode/                 # VS Code конфигурация
│
├── 📖 docs/                    # Документация проекта
│   ├── 📊 analysis/            # Анализ и отчеты
│   ├── ✏️ blog/                # Блог контент
│   ├── 🔄 migrations/          # Гиды миграции
│   ├── ⚡ optimization/        # Оптимизация и производительность
│   └── 🔧 setup/               # Настройка и установка
│
├── 🌐 public/                  # Статические файлы
├── 📸 screenshots/             # Скриншоты и сравнения
├── 📜 scripts/                 # Организованные скрипты
│   ├── 🏗️ build/               # Сборка проекта
│   ├── 🚀 deploy/              # Деплой и развертывание
│   ├── 🛠️ dev/                 # Инструменты разработки
│   ├── 🔧 maintenance/         # Обслуживание и оптимизация
│   └── 🧪 test/                # Тестирование
│
├── 💻 src/                     # Исходный код
│   ├── 🧩 components/          # UI компоненты
│   │   ├── ui/                 # Базовые UI элементы
│   │   ├── forms/              # Формы
│   │   └── sections/           # Секции страниц
│   │
│   ├── 🏝️ islands/             # Интерактивные Preact компоненты
│   │   ├── forms/              # Интерактивные формы
│   │   ├── shared/             # Общие интерактивные компоненты
│   │   └── utils/              # Утилиты островов
│   │
│   ├── ⚡ features/             # Бизнес-функции
│   │   ├── analytics/          # Аналитика
│   │   ├── calculator/         # Калькулятор
│   │   ├── forms/              # Обработка форм
│   │   └── modals/             # Модальные окна
│   │
│   ├── 🏗️ layouts/             # Макеты страниц
│   ├── 📄 pages/               # Маршруты страниц
│   ├── 🔧 widgets/             # Сложные UI компоненты
│   ├── 📝 content/             # Коллекции контента
│   ├── 🔨 lib/                 # Утилиты и хелперы
│   ├── 🤝 shared/              # Общие утилиты
│   ├── 🎯 core/                # Основная логика приложения
│   └── 🎨 styles/              # ITCSS архитектура стилей
│
└── 🛠️ tools/                   # Автономные инструменты
```

## 📚 Документация

### 📖 Основные документы

- 📋 [**CLAUDE.md**](CLAUDE.md) - Руководство по работе с Claude AI
- 🤖 [**QWEN.md**](QWEN.md) - Конфигурация Qwen AI assistant
- 🏗️ [**Архитектура**](docs/architecture.md) - Feature-Sliced Design архитектура
- 🔄 [**CHANGELOG.md**](CHANGELOG.md) - История изменений проекта

### 📁 Специализированная документация

| Раздел             | Описание                                 | Ссылка                                   |
| ------------------ | ---------------------------------------- | ---------------------------------------- |
| ⚡ **Оптимизация** | Гиды по производительности и оптимизации | [docs/optimization/](docs/optimization/) |
| 🔧 **Настройка**   | Инструкции по установке и конфигурации   | [docs/setup/](docs/setup/)               |
| 🔄 **Миграции**    | Гайды по обновлению технологий           | [docs/migrations/](docs/migrations/)     |
| 📊 **Анализ**      | Отчеты и метрики проекта                 | [docs/analysis/](docs/analysis/)         |
| ✏️ **Блог**        | Документация контента блога              | [docs/blog/](docs/blog/)                 |

## 🛠️ Технологический стек

### 🎯 Основные технологии

| Технология                                        | Версия    | Назначение                        |
| ------------------------------------------------- | --------- | --------------------------------- |
| **[Astro](https://astro.build/)**                 | `5.13.7`  | 🌟 Статический генератор сайтов   |
| **[Preact](https://preactjs.com/)**               | `10.27.1` | ⚡ Легковесная альтернатива React |
| **[TypeScript](https://www.typescriptlang.org/)** | `5.9.2`   | 🔒 Строгая типизация JavaScript   |
| **[Tailwind CSS](https://tailwindcss.com/)**      | `4.1.13`  | 🎨 Утилитарный CSS-фреймворк      |

### 🧪 Инструменты разработки

| Инструмент                                     | Версия    | Описание                         |
| ---------------------------------------------- | --------- | -------------------------------- |
| **[Vitest](https://vitest.dev/)**              | `3.2.4`   | 🧪 Современное unit-тестирование |
| **[Puppeteer](https://pptr.dev/)**             | `24.22.3` | 🤖 E2E тестирование              |
| **[ESLint](https://eslint.org/)**              | `9.36.0`  | 🔍 Линтинг кода                  |
| **[Prettier](https://prettier.io/)**           | `3.6.2`   | 💅 Форматирование кода           |
| **[Husky](https://github.com/typicode/husky)** | `9.1.7`   | 🪝 Git hooks                     |

### 🤖 AI и автоматизация

- **Model Context Protocol (MCP)** - Расширенная AI интеграция
- **Claude AI** - Помощник в разработке
- **Qwen Code** - AI код-ассистент
- **GitHub Actions** - CI/CD автоматизация

## 🏆 Качество кода

### ✅ Статус качества

- **0 TypeScript ошибок** - Полная типобезопасность
- **Современный ESLint** - Flat config с плагинами для Astro и TypeScript
- **Prettier форматирование** - Единообразный стиль кода
- **Git hooks (Husky)** - Автоматическая проверка перед коммитом
- **Строгий TypeScript** - `strict: true` со всеми проверками
- **Production-ready** - Готов к деплою без доработок

### 🔍 Команды проверки качества

```bash
# 🔍 Проверка TypeScript типов
npm run type-check

# 📝 Проверка ESLint
npm run lint

# 🔧 Автофикс ESLint
npm run lint:fix

# 💅 Проверка форматирования
npm run format:check

# ✨ Автоформатирование
npm run format
```

## 🎨 Архитектура

### Основные принципы

- **Feature-Sliced Design** - Организация кода по бизнес-функциям и слоям
- **Islands Architecture** - Интерактивные компоненты только там, где они нужны
- **Статическая генерация** - Предварительный рендеринг HTML для максимальной
  производительности
- **Прогрессивное улучшение** - Сайт работает без JavaScript
- **Компонентный подход** - Модульная и переиспользуемая архитектура

### Стили

- **[ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)** -
  Инвертированный треугольник CSS для организации стилей
- **[BEM](http://getbem.com/)** - Блок, Элемент, Модификатор для именования CSS
  классов
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Утилитарный CSS-фреймворк
  для быстрой разработки
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
- ✅ Миграция на Tailwind CSS v4 завершена
- ✅ Интеграция с Model Context Protocol (MCP) для расширенных возможностей AI

## 📦 Команды

### 🚀 Основные команды

| Команда              | Описание                       | Использование        |
| -------------------- | ------------------------------ | -------------------- |
| `npm run dev`        | 🚀 Локальный сервер разработки | Разработка и отладка |
| `npm run build`      | 🏗️ Production сборка           | Финальная сборка     |
| `npm run build:prod` | 🎯 Оптимизированная сборка     | Деплой на продакшен  |
| `npm run preview`    | 👀 Предпросмотр сборки         | Тестирование сборки  |

### ✅ Качество кода

| Команда                | Описание                   | Автофикс |
| ---------------------- | -------------------------- | -------- |
| `npm run type-check`   | 🔍 Проверка TypeScript     | ❌       |
| `npm run lint`         | 📝 ESLint проверка         | ❌       |
| `npm run lint:fix`     | 🔧 ESLint автофикс         | ✅       |
| `npm run format:check` | 💅 Проверка форматирования | ❌       |
| `npm run format`       | ✨ Автоформатирование      | ✅       |

### 🧪 Тестирование

| Команда                 | Описание                | Режим         |
| ----------------------- | ----------------------- | ------------- |
| `npm run test`          | 🧪 Unit тесты           | Одноразовый   |
| `npm run test:watch`    | 👁️ Тесты в watch режиме | Непрерывный   |
| `npm run test:coverage` | 📊 Покрытие тестами     | Отчет         |
| `npm run test:ui`       | 🎨 UI для тестов        | Интерактивный |
| `npm run test:e2e`      | 🤖 E2E тестирование     | Puppeteer     |

### 🚀 Деплой и обслуживание

| Команда                          | Описание                  | Назначение          |
| -------------------------------- | ------------------------- | ------------------- |
| `npm run deploy:checklist`       | ✅ Чек-лист перед деплоем | Проверка готовности |
| `npm run deploy:verify`          | 🔍 Верификация сборки     | Post-build проверка |
| `npm run deploy:backup`          | 💾 Создание бэкапа        | Безопасность        |
| `npm run deploy:rollback`        | ⏪ Откат изменений        | Восстановление      |
| `npm run maintenance:audit`      | 🔒 Аудит зависимостей     | Безопасность        |
| `npm run maintenance:lighthouse` | 📊 Lighthouse аудит       | Производительность  |

### 🛠️ Утилиты

| Команда                       | Описание                         | Применение                |
| ----------------------------- | -------------------------------- | ------------------------- |
| `npm run clean`               | 🧹 Очистка файлов сборки         | Очистка кэша              |
| `npm run env:validate`        | ✅ Проверка переменных окружения | Валидация конфига         |
| `npm run tools:compare-sites` | 📊 Сравнение сайтов              | Анализ производительности |
| `npm run tools:diagnose-css`  | 🎨 Диагностика CSS               | Отладка стилей            |

## 🔧 Конфигурация и требования

### 💻 Системные требования

- **Node.js**: `>=18.17.1` (рекомендуется последняя LTS версия)
- **npm**: `>=9.0.0` (с поддержкой workspaces)
- **Git**: `>=2.34.0` (для корректной работы Husky)

### ⚙️ Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# 🚀 Основные настройки
PUBLIC_SITE_URL=https://zerodolg.ru
PUBLIC_SITE_PHONE=+7 (905) 577-33-87
PUBLIC_SITE_EMAIL=info@zerodolg.ru

# 📊 Аналитика
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_YM_ID=XXXXXXXX

# 🐛 Отладка (опционально)
PUBLIC_ASTRO_TOOLBAR=false

# 🐈 Интеграция с Bitrix24
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/webhook_key/

# 🌍 Окружение
NODE_ENV=development # development | production
```

### 🔐 Безопасность

❗ **Важно**: Никогда не коммитьте файл `.env` в репозиторий!

- Используйте `.env.example` для примера конфигурации
- Переменные с префиксом `PUBLIC_` доступны в браузере
- Переменные без префикса доступны только на сервере

## 🤝 Вклад в проект

### 👨‍💻 Для разработчиков

1. **🔀 Fork** - Форкните репозиторий
2. **🌳 Branch** - Создайте ветку: `git checkout -b feature/amazing-feature`
3. **✨ Develop** - Используйте `npm run dev` для разработки
4. **✅ Test** - Убедитесь, что `npm run test` проходит
5. **🔍 Quality** - Проверьте `npm run lint` и `npm run type-check`
6. **📝 Commit** - Используйте
   [Conventional Commits](https://conventionalcommits.org/):
   ```bash
   git commit -m "feat(component): add amazing feature"
   ```
7. **🚀 Push** - Отправьте ветку: `git push origin feature/amazing-feature`
8. **🔁 PR** - Откройте Pull Request с описанием изменений

### 📔 Формат коммитов

Проект использует **Conventional Commits** с автоматической проверкой:

- `feat(scope): description` - новая функция
- `fix(scope): description` - исправление ошибки
- `docs(scope): description` - изменения в документации
- `style(scope): description` - стили и форматирование
- `refactor(scope): description` - рефакторинг
- `test(scope): description` - добавление тестов
- `chore(scope): description` - служебные задачи

## 📞 Контакты и поддержка

### 🚀 Проект

- **🌐 Сайт**: [zerodolg.ru](https://zerodolg.ru)
- **💻 Репозиторий**:
  [GitHub](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4)
- **📊 Статистика**:
  [![GitHub stars](https://img.shields.io/github/stars/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4)](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4)

### 👥 Команда

Для вопросов по разработке, отчетов о багах или предложений по улучшению:

- **Issues**:
  [Открыть Issue](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4/issues/new)
- **Discussions**:
  [Обсуждения](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4/discussions)
- **Pull Requests**:
  [Открыть PR](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4/compare)

### 📄 Лицензия

Этот проект распространяется под лицензией **MIT**. Подробности в файле
[LICENSE](LICENSE).

---

<div align="center">

**💫 Сделано с ❤️ для современного веба**

[![Astro](https://img.shields.io/badge/Powered_by-Astro-orange?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/Built_with-TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled_with-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>
