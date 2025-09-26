# ИНСТРУКЦИЯ ПО МИГРАЦИИ НА TAILWIND CSS ДЛЯ AI-АССИСТЕНТА

## 📌 КОНТЕКСТ ПРОЕКТА

**Проект:** zerodolg-astro - сайт услуг банкротства физических лиц
**Фреймворк:** Astro 5.13.7 с Preact **Текущая структура стилей:** ITCSS
архитектура, 8,357 строк CSS **Окружение:** Windows, PowerShell 7.5.3 **Путь
проекта:** `D:\develop\zerodolg.ru\zerodolg-astro`

## ⚠️ КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА

1. **НЕ УДАЛЯЙ существующие CSS файлы до полной миграции компонента**
2. **НЕ ИЗМЕНЯЙ функциональность - только стили**
3. **СОХРАНЯЙ все data-атрибуты и JavaScript хуки**
4. **ТЕСТИРУЙ каждое изменение через `npm run dev`**
5. **СОЗДАВАЙ резервные копии перед изменением файлов**

## 📋 ПОШАГОВАЯ ИНСТРУКЦИЯ

### ШАГ 1: УСТАНОВКА И БАЗОВАЯ НАСТРОЙКА

#### 1.1 Установи необходимые пакеты:

```bash
npm install -D tailwindcss @astrojs/tailwind
npm install -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio @tailwindcss/container-queries
```

#### 1.2 Создай файл `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './src/components/**/*.{astro,tsx,jsx}',
    './src/features/**/*.{astro,tsx,jsx}',
    './src/widgets/**/*.{astro,tsx,jsx}',
    './src/shared/**/*.{astro,tsx,jsx}',
    './src/pages/**/*.{astro,md}',
  ],
  theme: {
    extend: {
      colors: {
        // Точное соответствие существующим CSS переменным
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#60a5fa',
        },
        accent: {
          DEFAULT: '#ea580c',
          dark: '#c2410c',
          light: '#fb923c',
          gold: '#ffd700',
          orange: '#fb923c',
        },
        success: {
          DEFAULT: '#059669',
          light: '#10b981',
        },
        error: {
          DEFAULT: '#dc2626',
          light: '#ef4444',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#f59e0b',
        },
        // Дополнительные цвета из проекта
        nav: {
          text: '#333333',
          hover: '#2c5aa0',
        },
        text: {
          DEFAULT: '#1e293b',
          muted: '#64748b',
          light: '#94a3b8',
          inverse: '#ffffff',
        },
        bg: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          dark: '#f1f5f9',
          accent: '#eff6ff',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#cbd5e1',
          light: 'rgba(0, 0, 0, 0.05)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        xl: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
  // Важно для production
  safelist: [
    // Динамические классы, которые генерируются в JS
    'hidden',
    'block',
    'opacity-0',
    'opacity-100',
    // Классы для модалок
    'modal-open',
    'modal-backdrop',
  ],
};
```

#### 1.3 Обнови `postcss.config.cjs`:

```javascript
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production'
      ? [require('cssnano')({ preset: 'default' })]
      : []),
  ],
};
```

#### 1.4 Добавь Tailwind интеграцию в `astro.config.mjs`:

```javascript
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // ... другие настройки
  integrations: [
    preact(),
    tailwind({
      applyBaseStyles: false, // Важно! Не применяем базовые стили автоматически
      config: { path: './tailwind.config.mjs' },
    }),
    mcp(),
    sitemap(),
    robotsTxt(),
  ],
  // ... остальная конфигурация
});
```

#### 1.5 Создай новый главный CSS файл `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Слой базовых стилей */
@layer base {
  /* Сохраняем CSS переменные для обратной совместимости */
  :root {
    --color-primary: theme('colors.primary.DEFAULT');
    --color-primary-dark: theme('colors.primary.dark');
    --color-primary-light: theme('colors.primary.light');
    /* Добавь остальные переменные по необходимости */
  }

  /* Базовая типографика */
  html {
    @apply scroll-smooth;
  }

  body {
    @apply antialiased text-text bg-bg;
  }

  h1 {
    @apply text-4xl lg:text-5xl font-bold leading-tight;
  }

  h2 {
    @apply text-3xl lg:text-4xl font-semibold leading-tight;
  }

  h3 {
    @apply text-2xl lg:text-3xl font-semibold;
  }

  h4 {
    @apply text-xl lg:text-2xl font-medium;
  }

  p {
    @apply leading-relaxed;
  }

  a {
    @apply transition-colors duration-200;
  }
}

/* Слой компонентов - для сложных повторяющихся паттернов */
@layer components {
  /* Кнопки */
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply btn bg-primary text-white hover:bg-primary-dark focus:ring-primary;
  }

  .btn-secondary {
    @apply btn bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary;
  }

  .btn-accent {
    @apply btn bg-accent text-white hover:bg-accent-dark focus:ring-accent;
  }

  /* Карточки */
  .card {
    @apply bg-white rounded-xl shadow-card p-6 transition-shadow hover:shadow-lg;
  }

  .card-bordered {
    @apply card border border-border;
  }

  /* Формы */
  .form-input {
    @apply w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors;
  }

  .form-label {
    @apply block text-sm font-medium text-text mb-1;
  }

  .form-error {
    @apply text-sm text-error mt-1;
  }

  /* Контейнеры */
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section {
    @apply py-12 sm:py-16 lg:py-24;
  }
}

/* Утилиты - кастомные однократные стили */
@layer utilities {
  /* Скрытие для скринридеров */
  .sr-only {
    @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  }

  /* Градиенты */
  .gradient-primary {
    @apply bg-gradient-to-r from-primary to-primary-light;
  }

  .gradient-accent {
    @apply bg-gradient-to-r from-accent to-accent-light;
  }

  /* Анимации */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
}

/* Критические стили, которые должны загружаться первыми */
@layer critical {
  /* Здесь размести стили для above-the-fold контента */
}
```

#### 1.6 Обнови Layout.astro:

```astro
---
// src/layouts/Layout.astro
import '../styles/globals.css'; // Новый импорт
// import '../styles/main.css'; // Закомментируй старый импорт временно
---
```

### ШАГ 2: ПЛАН МИГРАЦИИ КОМПОНЕНТОВ

## 📂 ПОРЯДОК МИГРАЦИИ (СТРОГО СОБЛЮДАЙ)

### ФАЗА 1: Простые компоненты (начни с них!)

#### 1. Button.astro (`src/shared/ui/Button/Button.astro`)

**Текущие классы для замены:**

```css
/* Старый CSS */
.button {
  @apply px-6 py-3 rounded-lg font-semibold transition-colors;
}
.button--primary {
  @apply bg-primary text-white hover:bg-primary-dark;
}
.button--secondary {
  @apply bg-white text-primary border-2 border-primary;
}
```

**Пример миграции:**

```astro
<!-- ДО -->
<button class='button button--primary'>Текст</button>

<!-- ПОСЛЕ -->
<button
  class='px-6 py-3 rounded-lg font-semibold transition-colors bg-primary text-white hover:bg-primary-dark'
>
  Текст
</button>

<!-- ИЛИ используй компонентный класс -->
<button class='btn-primary'>Текст</button>
```

#### 2. Card.astro (`src/shared/ui/Card/Card.astro`)

```astro
<!-- ДО -->
<div class='card'>...</div>

<!-- ПОСЛЕ -->
<div
  class='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow'
>
  ...
</div>
```

### ФАЗА 2: Формы

#### BaseForm.astro (`src/features/forms/ui/BaseForm.astro`)

**Ключевые замены:**

```astro
<!-- Поля ввода -->class="form__input" -> class="w-full px-4 py-2 border
border-border rounded-lg focus:ring-2 focus:ring-primary
focus:border-transparent"

<!-- Лейблы -->
class="form__label" -> class="block text-sm font-medium text-text mb-1"

<!-- Ошибки -->
class="form__error" -> class="text-sm text-error mt-1"

<!-- Группы полей -->
class="form__group" -> class="mb-4"
```

### ФАЗА 3: Навигация и Layout

#### Header.astro (`src/widgets/header/Header.astro`)

**Важно:** Сохрани все data-атрибуты и JS-хуки!

```astro
<!-- Навигационное меню -->class="nav__menu" -> class="flex items-center
space-x-8" class="nav__link" -> class="text-nav-text hover:text-nav-hover
transition-colors" class="nav__link--active" -> class="text-primary
font-semibold"

<!-- Мобильное меню -->
class="mobile-menu" -> class="lg:hidden fixed inset-0 z-50 bg-white" class="mobile-menu__toggle"
-> class="lg:hidden p-2"
```

### ФАЗА 4: Секции страниц

#### Hero.astro (`src/components/islands/Hero.astro`)

```astro
<!-- Контейнер героя -->class="hero" -> class="relative min-h-screen flex
items-center" class="hero__content" -> class="container-custom py-20"
class="hero__title" -> class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
class="hero__subtitle" -> class="text-xl text-text-muted mb-8"
```

## 🔄 ТАБЛИЦА СООТВЕТСТВИЯ КЛАССОВ

| Старый класс     | Новые Tailwind классы                                  | Примечания                        |
| ---------------- | ------------------------------------------------------ | --------------------------------- |
| `.container`     | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`               | Или используй `.container-custom` |
| `.text-primary`  | `text-primary`                                         | Прямое соответствие               |
| `.bg-accent`     | `bg-accent`                                            | Прямое соответствие               |
| `.shadow-card`   | `shadow-md hover:shadow-lg`                            | С эффектом при наведении          |
| `.hidden-mobile` | `hidden sm:block`                                      | Mobile-first подход               |
| `.flex-center`   | `flex items-center justify-center`                     |                                   |
| `.grid-auto`     | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |                                   |
| `.section`       | `py-12 sm:py-16 lg:py-24`                              |                                   |
| `.text-large`    | `text-lg lg:text-xl`                                   |                                   |

## 🛠️ УТИЛИТЫ ДЛЯ МИГРАЦИИ

### Команда для поиска использований класса:

```powershell
# Найти все использования конкретного CSS класса
Select-String -Path "src\**\*.astro","src\**\*.tsx","src\**\*.jsx" -Pattern "className.*button" -CaseSensitive

# Или более простой поиск
Get-ChildItem -Recurse -Include *.astro,*.tsx,*.jsx | Select-String "button--primary"
```

### Создание резервной копии:

```powershell
# Перед изменением компонента
Copy-Item "src\components\islands\Hero.astro" "src\components\islands\Hero.astro.backup"
```

### Проверка изменений:

```powershell
# После изменения компонента
npm run dev
# Открой http://localhost:4321 и визуально проверь компонент
```

## ⚡ ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ

### После каждой фазы выполняй:

1. **Проверка размера CSS:**

```powershell
npm run build
Get-ChildItem dist\**\*.css | Measure-Object -Property Length -Sum
```

2. **Проверка неиспользуемых стилей:**

```powershell
# Установи PurgeCSS CLI если нужно
npm install -g purgecss
purgecss --css dist/**/*.css --content dist/**/*.html --output analyzed.css
```

## 🚨 ЧАСТЫЕ ОШИБКИ И КАК ИХ ИЗБЕЖАТЬ

### ❌ НЕ ДЕЛАЙ ТАК:

```astro
<!-- Неправильно: смешивание старых и новых классов -->
<div class='card px-4 py-6'>
  <!-- Неправильно: забыл про респонсивность -->
  <div class='text-6xl'>
    <!-- Слишком большой на мобилке -->

    <!-- Неправильно: удалил data-атрибуты -->
    <button class='btn-primary'> <!-- Был data-modal-trigger --></button>
  </div>
</div>
```

### ✅ ДЕЛАЙ ТАК:

```astro
<!-- Правильно: полная миграция -->
<div class='bg-white rounded-xl shadow-card p-6'>
  <!-- Правильно: респонсивные размеры -->
  <div class='text-3xl md:text-4xl lg:text-6xl'>
    <!-- Правильно: сохранены data-атрибуты -->
    <button class='btn-primary' data-modal-trigger='callback'></button>
  </div>
</div>
```

## 📝 КОНТРОЛЬНЫЙ СПИСОК ДЛЯ КАЖДОГО КОМПОНЕНТА

- [ ] Создана резервная копия файла
- [ ] Идентифицированы все CSS классы в компоненте
- [ ] Найдены соответствующие Tailwind утилиты
- [ ] Сохранены все data-атрибуты и id
- [ ] Проверена респонсивность (sm:, md:, lg:, xl:)
- [ ] Добавлены hover/focus/active состояния
- [ ] Протестирован в браузере на всех разрешениях
- [ ] Проверена работа JavaScript функциональности
- [ ] Удалены старые CSS классы из HTML
- [ ] Обновлена документация компонента (если есть)

## 🎯 КРИТЕРИИ УСПЕШНОЙ МИГРАЦИИ

1. **Визуальное соответствие:** Компонент выглядит идентично до и после
2. **Функциональность:** Все интерактивные элементы работают
3. **Производительность:** Размер CSS уменьшился или остался прежним
4. **Респонсивность:** Компонент корректно отображается на всех устройствах
5. **Доступность:** Сохранены все ARIA-атрибуты и семантика

## 🔧 ОТЛАДКА ПРОБЛЕМ

### Если стили не применяются:

1. Проверь, что файл включен в `content` в tailwind.config.mjs
2. Перезапусти dev сервер: `Ctrl+C` затем `npm run dev`
3. Очисти кэш: `npm run clean && npm run dev`

### Если компонент сломался визуально:

1. Проверь специфичность CSS - возможно старые стили перебивают новые
2. Используй `!important` временно: `!bg-primary`
3. Проверь порядок импортов в Layout.astro

### Если не работает JavaScript:

1. Убедись, что сохранены все классы, используемые в JS
2. Проверь консоль браузера на ошибки
3. Добавь классы в safelist в tailwind.config.mjs

## 📊 ОТЧЕТ О ПРОГРЕССЕ

После завершения каждой фазы создай файл с отчетом:

```markdown
# Отчет о миграции - Фаза 1

## Мигрированные компоненты:

- [x] Button.astro
- [x] Card.astro
- [x] ...

## Метрики:

- Размер CSS до: X KB
- Размер CSS после: Y KB
- Уменьшение: Z%

## Проблемы и решения:

1. Проблема: ... Решение: ...

## Следующие шаги:

- Начать Фазу 2
```

## 🚀 КОМАНДЫ ДЛЯ ЗАПУСКА

```powershell
# Разработка
npm run dev

# Сборка
npm run build

# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Форматирование
npm run format

# Тесты
npm run test
```

## ✅ ФИНАЛЬНАЯ ПРОВЕРКА ПЕРЕД КОММИТОМ

1. Все тесты проходят: `npm run test`
2. Нет ошибок TypeScript: `npm run type-check`
3. Код отформатирован: `npm run format`
4. Нет ошибок линтера: `npm run lint`
5. Сборка проходит успешно: `npm run build`
6. Визуальная проверка в браузере пройдена

---

**ВАЖНО:** Эта инструкция - твой главный гайд. Следуй ей пошагово, не пропускай
этапы. При возникновении вопросов или нестандартных ситуаций - документируй их и
решения в отдельном файле `MIGRATION_NOTES.md`.

Удачи в миграции! 🎯
