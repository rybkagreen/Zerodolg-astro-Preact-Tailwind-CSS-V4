# 🏛️ ZeroDolg Astro - Корпоративный сайт по банкротству

> **Современный, высокопроизводительный корпоративный сайт юридической компании
> по банкротству физических лиц**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-5.13.7-orange.svg)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4.svg)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-green.svg)](#)
[![Production](https://img.shields.io/badge/Status-Live_on_Production-success.svg)](https://zerodolg.ru)
[![Code Quality](https://img.shields.io/badge/Code_Quality-A+-brightgreen.svg)](#качество-кода)

## 🎉 Статус проекта: **ЗАВЕРШЕН И РАЗМЕЩЕН НА ПРОДАКШНЕ**

✨ **Проект полностью готов и работает в production на
[zerodolg.ru](https://zerodolg.ru)**

**Дата запуска**: Октябрь 2025  
**Статус**: 🚀 Live in Production  
**Готовность**: 100%

## ✨ Особенности проекта

🎯 **Production-Ready** - Полностью готов к продакшену с нулевыми TypeScript
ошибками  
⚡ **Высокая производительность** - Статическая генерация + Islands
Architecture  
🔒 **Безопасность** - Современные практики безопасности (Semgrep, TruffleHog)  
📱 **Mobile-First** - Отзывчивый дизайн для всех устройств  
🚀 **SEO оптимизирован** - Структурированные данные, robots.txt, sitemap.xml  
🎨 **Современный стек** - Astro 5 + Preact + TypeScript + Tailwind CSS 3.4  
🤖 **MCP-Enhanced** - Интеграция с Model Context Protocol (MCP)

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
├── 🛠️ .vscode/                 # VS Code конфигурация
│
├── 📖 docs/                    # Документация проекта
│   ├── 📊 analysis/            # Анализ и отчеты
│   ├── ✏️ blog/                # Блог контент
│   ├── 🔄 migrations/          # Гиды миграции
│   ├── ⚡ optimization/        # Оптимизация и производительность
│   ├── 🏗️ architecture.md      # Feature-Sliced Design архитектура
│   └── 📝 style-guide.md       # Руководство по стилю
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
├── 💻 src/                     # Исходный код (Feature-Sliced Design архитектура)
│   │
│   ├── 📱 app/                  # Application слой (FSD)
│   │   ├── layouts/            # Главные макеты приложения
│   │   ├── providers/          # React провайдеры и контекст
│   │   └── styles/             # Глобальные стили приложения
│   │
│   ├── 🧩 components/          # UI компоненты (временные, мигрируют в shared/ui)
│   │   ├── forms/              # Формы
│   │   ├── layout/             # Layout компоненты
│   │   └── sections/           # Секции страниц
│   │
│   ├── 🎯 core/                # Основная бизнес-логика
│   │   ├── constants/          # Константы приложения
│   │   └── team-members.ts     # Данные команды
│   │
│   ├── 🗄️ entities/             # Entities слой (FSD) - бизнес-сущности
│   │   ├── blog/content/       # Блог статьи (Markdown)
│   │   ├── review/content/     # Отзывы клиентов
│   │   ├── team/content/       # Данные команды
│   │   └── config.ts           # Конфигурация сущностей
│   │
│   ├── ⚡ features/             # Features слой (FSD) - бизнес-функции
│   │   ├── analytics/          # Аналитика (Google, Yandex)
│   │   ├── calculator/         # Калькулятор стоимости
│   │   ├── forms/              # Обработка форм
│   │   └── modals/             # Система модальных окон
│   │
│   ├── 🏝️ islands/             # Islands Architecture - интерактивные Preact компоненты
│   │   ├── forms/              # Интерактивные формы
│   │   ├── interactive/        # Интерактивные компоненты
│   │   ├── layout/             # Layout островки
│   │   ├── shared/interactive/ # Общие интерактивные компоненты
│   │   └── utils/              # Утилиты островов
│   │
│   ├── 📄 pages/               # Pages слой (FSD) - маршруты страниц
│   │   ├── api/                # API маршруты
│   │   └── blog/               # Страницы блога
│   │
│   ├── 🤝 shared/              # Shared слой (FSD) - переиспользуемые ресурсы
│   │   ├── api/                # API клиенты и интеграции
│   │   ├── config/             # Конфигурация приложения
│   │   ├── hooks/              # Custom React hooks (12 hooks)
│   │   │   ├── useAsyncEffect.ts      # Асинхронные эффекты
│   │   │   ├── useClickOutside.ts     # Обработка кликов вне
│   │   │   ├── useDebounce.ts         # Дебаунс хук
│   │   │   ├── useFocusTrap.ts        # Ловушка фокуса
│   │   │   ├── useIntersectionObserver.ts # Наблюдение за пересечением
│   │   │   ├── useLocalStorage.ts     # Работа с localStorage
│   │   │   ├── useMediaQuery.ts       # Медиа-запросы
│   │   │   ├── usePerformanceMonitor.ts # Мониторинг производительности
│   │   │   ├── usePrevious.ts         # Предыдущие значения
│   │   │   ├── useReducedMotion.ts    # Анимации с учетом доступности
│   │   │   ├── useScrollLock.ts       # Блокировка скролла
│   │   │   └── useThrottle.ts         # Троттлинг хук
│   │   ├── lib/                # Утилиты и хелперы
│   │   │   ├── analytics.ts    # Аналитика
│   │   │   ├── bitrix-callback.ts # Bitrix24 интеграция
│   │   │   ├── env-validator.ts # Валидация переменных окружения
│   │   │   ├── form-utils.ts   # Утилиты для форм
│   │   │   ├── logger.ts       # Логирование
│   │   │   └── performance.ts  # Производительность
│   │   ├── types/              # TypeScript типы
│   │   │   ├── analytics.ts    # Типы аналитики
│   │   │   ├── form.ts         # Типы форм
│   │   │   └── team.ts         # Типы команды
│   │   ├── ui/                 # Переиспользуемые UI компоненты
│   │   │   ├── Button/         # Кнопки
│   │   │   ├── Card/           # Карточки
│   │   │   ├── SEO/            # SEO компоненты
│   │   │   ├── AccessibleModal.tsx # Доступные модальные окна
│   │   │   ├── BitrixCallback.astro # Bitrix виджет
│   │   │   └── [другие UI]     # Остальные UI компоненты
│   │   └── utils/              # Общие утилиты
│   │       └── cn.ts           # Утилиты для className
│   │
│   ├── 🎨 styles/              # Дополнительные стили
│   │   └── theme.css           # Тема приложения
│   │
│   └── 🔧 widgets/             # Widgets слой (FSD) - сложные UI компоненты
│       ├── faq/                # FAQ секция
│       ├── footer/             # Подвал сайта
│       ├── header/             # Шапка сайта
│       └── reviews/            # Отзывы клиентов
│
└── 🛠️ tools/                   # Автономные инструменты
```

## 📚 Документация

### 📖 Основные документы

- 🤖 [**CLAUDE.md**](CLAUDE.md) - Инструкции для Claude Code (executor)
- 🏗️ [**ARCHITECTURE.md**](ARCHITECTURE.md) - Feature-Sliced Design архитектура
- 🔄 [**CHANGELOG.md**](CHANGELOG.md) - История изменений проекта

### 📁 Специализированная документация

| Раздел                      | Описание                                         | Ссылка                                       |
| --------------------------- | ------------------------------------------------ | -------------------------------------------- |
| ⚡ **Оптимизация**          | Гиды по производительности и оптимизации         | [docs/optimization/](docs/optimization/)     |
| 🔧 **Настройка**            | Инструкции по установке и конфигурации           | [docs/setup/](docs/setup/)                   |
| 🔄 **Миграции**             | Гайды по обновлению технологий                   | [docs/migrations/](docs/migrations/)         |
| 📊 **Анализ**               | Отчеты и метрики проекта                         | [docs/analysis/](docs/analysis/)             |
| 🏗️ **Архитектура**          | Feature-Sliced Design архитектура                | [docs/architecture.md](docs/architecture.md) |
| 📝 **Руководство по стилю** | Стандарты кодирования и именования               | [docs/style-guide.md](docs/style-guide.md)   |
| 📁 **Разработка**           | Руководство по работе с Git и внесению изменений | [docs/git.md](docs/git.md)                   |
| 📋 **ADR**                  | Architecture Decision Records                    | [docs/adrs/](docs/adrs/)                     |

## 🛠️ Технологический стек

### 🎯 Основные технологии

| Технология                                        | Версия    | Назначение                        |
| ------------------------------------------------- | --------- | --------------------------------- |
| **[Astro](https://astro.build/)**                 | `5.13.7`  | 🌟 Статический генератор сайтов   |
| **[Preact](https://preactjs.com/)**               | `10.27.1` | ⚡ Легковесная альтернатива React |
| **[TypeScript](https://www.typescriptlang.org/)** | `5.9.2`   | 🔒 Строгая типизация JavaScript   |
| **[Tailwind CSS](https://tailwindcss.com/)**      | `3.4.17`  | 🎨 Утилитарный CSS-фреймворк      |

### 🧪 Инструменты разработки

| Инструмент                                     | Версия    | Описание                         |
| ---------------------------------------------- | --------- | -------------------------------- |
| **[Vitest](https://vitest.dev/)**              | `3.2.4`   | 🧪 Современное unit-тестирование |
| **[Puppeteer](https://pptr.dev/)**             | `24.23.0` | 🤖 E2E тестирование              |
| **[ESLint](https://eslint.org/)**              | `9.36.0`  | 🔍 Линтинг кода                  |
| **[Prettier](https://prettier.io/)**           | `3.6.2`   | 💅 Форматирование кода           |
| **[Husky](https://github.com/typicode/husky)** | `9.1.7`   | 🪝 Git hooks                     |

### 🤖 AI и автоматизация

- **Claude Code** - Executor (git, сборка, деплой)
- **Model Context Protocol (MCP)** - Расширенная AI интеграция
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

# 🛡️ Проверка безопасности (Semgrep)
npx semgrep scan

# 🔍 Проверка утечки секретов (TruffleHog)
npx trufflehog .
```

## 🎨 Архитектура

### 🏗️ Feature-Sliced Design (FSD)

Проект использует современную **Feature-Sliced Design** архитектуру для
организации кода по слоям и функциям:

#### 📱 Слои FSD

| Слой         | Папка           | Назначение                                                | Зависимости                           |
| ------------ | --------------- | --------------------------------------------------------- | ------------------------------------- |
| **App**      | `src/app/`      | 🎯 Инициализация приложения, провайдеры, глобальные стили | ← Все остальные слои                  |
| **Pages**    | `src/pages/`    | 📄 Маршруты и страницы                                    | ← widgets, features, entities, shared |
| **Widgets**  | `src/widgets/`  | 🔧 Сложные UI-блоки (Header, Footer, FAQ)                 | ← features, entities, shared          |
| **Features** | `src/features/` | ⚡ Бизнес-функции (калькулятор, формы, модалы)            | ← entities, shared                    |
| **Entities** | `src/entities/` | 🗄️ Бизнес-сущности (blog, team, reviews)                  | ← shared                              |
| **Shared**   | `src/shared/`   | 🤝 Переиспользуемые ресурсы                               | Независимый                           |

#### 🔄 Правила зависимостей

- Слои могут использовать только **нижележащие** слои
- **Shared** не зависит ни от кого
- **Features** не знают друг о друге
- **Pages** объединяют все слои

#### 📦 Структура Shared слоя

Samый важный слой содержит:

- **`config/`** - Конфигурация приложения и переменные окружения
- **`hooks/`** - 12 custom React hooks для типовых задач
- **`lib/`** - Утилиты и хелперы (аналитика, валидация, логи)
- **`types/`** - Централизованные TypeScript типы
- **`ui/`** - Переиспользуемые UI компоненты
- **`api/`** - API клиенты и интеграции

### 🏝️ Islands Architecture + FSD

Интеграция Astro Islands с FSD:

- **Статические компоненты**: `src/shared/ui/`, `src/widgets/`
- **Интерактивные острова**: `src/islands/` с логикой из `src/features/`
- **Гидратация по требованию**: Только интерактивные части

### Основные принципы

- **Feature-Sliced Design** - Организация кода по бизнес-функциям и слоям
- **Islands Architecture** - Интерактивные компоненты только там, где они нужны
- **Статическая генерация** - Предварительный рендеринг HTML для максимальной
  производительности
- **Progressive Enhancement** - The site works without JavaScript
- **Visual Fidelity** - UI/UX should match the original production site
  (https://zerodolg.ru/) using only Tailwind CSS and built-in Astro/Preact
  capabilities
- **Компонентный подход** - Модульная и переиспользуемая архитектура

### 📺 Custom React Hooks

Проект содержит **12 кастомных hooks** в `src/shared/hooks/` для решения типовых
задач:

| Hook                          | Назначение                       | Пример использования                     |
| ----------------------------- | -------------------------------- | ---------------------------------------- |
| **`useAsyncEffect`**          | 🔄 Асинхронные эффекты           | API запросы, загрузка данных             |
| **`useClickOutside`**         | 🎯 Обработка кликов вне элемента | Закрытие модалов, выпадающих меню        |
| **`useDebounce`**             | ⏱️ Дебаунс значений              | Поиск, валидация форм в реальном времени |
| **`useFocusTrap`**            | 🌯 Ловушка фокуса                | Доступность модальных окон               |
| **`useIntersectionObserver`** | 🔎 Наблюдение за пересечением    | Lazy loading, анимации появления         |
| **`useLocalStorage`**         | 💾 Работа с localStorage         | Пользовательские настройки, кэширование  |
| **`useMediaQuery`**           | 📱 Медиа-запросы                 | Адаптивные компоненты, темы              |
| **`usePerformanceMonitor`**   | 📊 Мониторинг производительности | Core Web Vitals, метрики                 |
| **`usePrevious`**             | ⬅️ Предыдущие значения           | Сравнение состояний, анимации            |
| **`useReducedMotion`**        | ♿ Анимации с учетом доступности | Почтение `prefers-reduced-motion`        |
| **`useScrollLock`**           | 🔒 Блокировка скролла            | Модальные окна, меню                     |
| **`useThrottle`**             | 📟 Троттлинг вызовов             | Ограничение частоты событий              |

#### 🔧 Пример использования

```tsx
// Пример с модальным окном
import { useClickOutside, useFocusTrap, useScrollLock } from '@/shared/hooks';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  // Автоматическое закрытие по клику вне
  useClickOutside(modalRef, onClose);

  // Ловушка фокуса для доступности
  useFocusTrap(modalRef, isOpen);

  // Блокировка скролла фона
  useScrollLock(isOpen);

  return isOpen ? (
    <div className='modal-backdrop'>
      <div ref={modalRef} className='modal'>
        {children}
      </div>
    </div>
  ) : null;
}
```

### Стили

- **[Tailwind CSS v3.4](https://tailwindcss.com/)** - Утилитарный CSS-фреймворк
  для быстрой разработки с оптимизированной конфигурацией
- **Mobile First** - Дизайн сначала для мобильных устройств

## 🌍 Современные практики 2025

### 🔐 Безопасность (SAST)

- **Semgrep** - Static Analysis Security Testing
- **TruffleHog** - Проверка утечки секретов
- **CSP Headers** - Content Security Policy с nonce подходом
- **SRI** - Subresource Integrity для внешних ресурсов
- **Security Headers** - X-Frame-Options, X-Content-Type-Options и др.

### ⚡ Производительность

- **Core Web Vitals 2025**:
  - LCP < 1.0s
  - FID < 75ms (новый стандарт 2025)
  - CLS < 0.05 (новый стандарт 2025)
- **Image optimization** - WebP/AVIF форматы, lazy loading
- **Bundle optimization** - Tree-shaking, code splitting
- **Caching strategy** - Modern HTTP caching headers

### ♿ Доступность

- **WCAG 2.2** - Соответствие стандарту Web Content Accessibility Guidelines
- **ARIA атрибуты** - Пропертисы для доступности интерфейсов
- **Keyboard navigation** - Управление с клавиатуры
- **Screen reader support** - Совместимость с чтецами

### 🌱 Экологичность (Sustainability)

- **Энергоэффективный код** - Минимизация ресурсов
- **Оптимизация бандла** - Снижение объема загрузки
- **Эффективное кэширование** - Снижение количества запросов
- **Carbon-aware оптимизации** - Уменьшение углеродного следа

## ✅ Статус проекта

### 🚀 Production Deployment

**Проект размещен на продакшн сервере и работает в режиме реального времени!**

- **🌐 Live URL**: [https://zerodolg.ru](https://zerodolg.ru)
- **📅 Дата запуска**: Октябрь 2025
- **✨ Статус**: Полностью функционален и оптимизирован
- **🎯 Готовность**: 100%

### ✅ Реализованные возможности

Проект полностью завершен и работает в продакшене:

#### 📄 Основной функционал

- ✅ Все страницы реализованы и протестированы
- ✅ Все интерактивные компоненты работают корректно
- ✅ Формы проходят валидацию и отправляют данные
- ✅ Система модальных окон функционирует правильно
- ✅ Дизайн адаптирован для всех устройств

#### 🔍 SEO и аналитика

- ✅ SEO полностью оптимизирован с robots.txt и sitemap.xml
- ✅ Аналитика интегрирована и работает (Google Analytics, Yandex Metrica)
- ✅ Структурированные данные Schema.org реализованы

#### ⚡ Производительность и безопасность

- ✅ Производительность оптимизирована
- ✅ Core Web Vitals 2025 стандарты соблюдены
- ✅ Комплексная система безопасности с CSP заголовками реализована
- ✅ Современные практики безопасности 2025 (Semgrep, TruffleHog) внедрены

#### 🛠️ Технологический стек

- ✅ Стабильная Tailwind CSS v3.4 с оптимизированной конфигурацией
- ✅ Интеграция с Model Context Protocol (MCP) для расширенных возможностей AI
- ✅ WCAG 2.2 доступность реализована

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
| `npm run tools:diagnose-css`  | 🎨 Диагностика CSS               | Отчет о стилях            |
| `npm run tools:semgrep`       | 🛡️ Проверка безопасности         | SAST анализ               |
| `npm run tools:trufflehog`    | 🔍 Проверка утечки секретов      | Безопасность кода         |

## 🔧 Конфигурация и требования

### 💻 Системные требования

- **Node.js**: `>=18.17.1` (рекомендуется последняя LTS версия)
- **npm**: `>=9.0.0` (с поддержкой workspaces)
- **Git**: `>=2.34.0` (для корректной работы Husky)
- **Docker**: `>=20.10.0` (для локального запуска AI инструментов)

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

1. ** <<=FORK==> ** - Форкните репозиторий
2. ** <<=BRANCH==> ** - Создайте ветку:
   `git checkout -b feature/amazing-feature`
3. ** <<=DEVELOP==> ** - Используйте `npm run dev` для разработки
4. ** <<=QUALITY==> ** - Проверьте `npm run lint` и `npm run type-check`
5. ** <<=COMMIT==> ** - Используйте
   [Conventional Commits](https://conventionalcommits.org/):
   ```bash
   git commit -m "feat(component): add amazing feature"
   ```
6. ** <<=PUSH==> ** - Отправьте ветку: `git push origin feature/amazing-feature`
7. ** <<=PR==> ** - Откройте Pull Request с описанием изменений

Подробное руководство по внесению вклада см. в файле
[CONTRIBUTING.md](CONTRIBUTING.md).

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

- **🌐 Production сайт**: [zerodolg.ru](https://zerodolg.ru) ✨ **LIVE**
- **💻 Репозиторий**:
  [GitHub](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4)
- **📊 Статистика**:
  [![GitHub stars](https://img.shields.io/github/stars/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4)](https://github.com/rybkagreen/Zerodolg-astro-Preact-Tailwind-CSS-V4)
- **🚀 Статус**: Размещен на продакшн сервере и полностью функционален

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
