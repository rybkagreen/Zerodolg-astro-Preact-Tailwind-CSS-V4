# CSS Architecture Documentation

## Обзор архитектуры

Этот проект использует современную масштабируемую CSS архитектуру, построенную на основе Tailwind CSS v3 с дополнительными улучшениями для производственного использования.

## Структура файлов

```
src/app/styles/
├── globals.css              # Главный файл стилей
├── design-tokens.ts         # Design tokens (цвета, шрифты, отступы)
├── components/
│   └── components.css       # Модульные компоненты
├── modules/
│   ├── button.module.css    # CSS модули для кнопок
│   └── card.module.css      # CSS модули для карточек
├── animations/
│   ├── aos.css             # AOS анимации
│   └── backgrounds.css     # Фоновые анимации
├── utils/
│   └── tree-shake.css      # Утилиты для tree-shaking
└── critical.css            # Критический CSS (генерируется автоматически)
```

## Design Tokens

### Цветовая палитра
```typescript
const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a'
  },
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827'
  }
}
```

### Типографика
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter Variable', 'Inter', 'system-ui'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco']
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    // ... остальные размеры
  }
}
```

## CSS Modules

### Button Module
Изолированные стили для кнопок с различными вариантами:

```css
.button { /* базовые стили */ }
.primary { /* основная кнопка */ }
.secondary { /* вторичная кнопка */ }
.ghost { /* прозрачная кнопка */ }
.small, .large { /* размеры */ }
.loading, .disabled { /* состояния */ }
```

**Использование:**
```html
<button class="btn-primary">Основная кнопка</button>
<button class="btn-secondary btn-small">Маленькая вторичная</button>
```

### Card Module
Стили для карточек с различными эффектами:

```css
.card { /* базовая карточка */ }
.enhanced { /* улучшенная карточка с тенями */ }
.glass { /* стеклянный эффект */ }
.interactive { /* интерактивная карточка */ }
```

**Использование:**
```html
<div class="enhanced-card">
  <div class="card-header">Заголовок</div>
  <div class="card-body">Содержимое</div>
</div>
```

## Компонентная система

### Layout Components
- `.container-custom` - основной контейнер с адаптивными отступами
- `.section-padding` - стандартные отступы для секций
- `.grid-auto-fit` - автоматическая сетка с адаптивными колонками

### Typography Components
- `.section-title` - заголовки секций с градиентом
- `.section-subtitle` - подзаголовки секций
- `.lead-text` - выделенный текст

### Interactive Components
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` - кнопки
- `.enhanced-card` - улучшенные карточки
- `.hero-title` - заголовок героя

## Критический CSS

Система автоматически генерирует критический CSS для above-the-fold контента:

```bash
npm run generate-critical-css
```

Это создает `src/app/styles/critical.css` с минимальным набором стилей для быстрой отрисовки.

## Tree-shaking

Неиспользуемые CSS классы автоматически удаляются из финального бандла благодаря:

1. **Tailwind CSS purging** - удаляет неиспользуемые утилиты Tailwind
2. **CSS Modules** - изолирует стили компонентов
3. **Tree-shake utilities** - продвинутые утилиты, которые удаляются если не используются

## Оптимизация производительности

### 1. Critical CSS inlining
Критический CSS инлайнится в `<head>` для мгновенной отрисовки:

```html
<style is:inline>
  /* Critical above-the-fold styles */
  .hero-section{background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#3730a3 100%)}
</style>
```

### 2. Lazy loading
Некритический CSS загружается асинхронно:

```html
<link rel="preload" href="/assets/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### 3. CSS минификация
Все CSS минифицируется и сжимается во время сборки.

## Accessibility

### Focus states
Все интерактивные элементы имеют видимые focus состояния:

```css
:focus-visible {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
}
```

### Screen readers
Используются утилиты для скрытия контента от экрана, но доступного для screen readers:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  /* ... */
}
```

### Reduced motion
Респект к настройкам пользователя по уменьшению анимаций:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Dark Mode Support

Базовая поддержка темной темы через CSS переменные:

```css
[data-theme="dark"] .card {
  @apply bg-surface-dark border-border-dark;
}
```

## Responsive Design

### Breakpoints
```typescript
const screens = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

### Mobile-first approach
Все стили пишутся mobile-first с использованием min-width media queries.

## Maintenance

### Обновление Design Tokens
1. Отредактируйте `src/app/styles/design-tokens.ts`
2. Обновите `tailwind.config.js` если нужно
3. Перекомпилируйте стили

### Добавление нового CSS Module
1. Создайте файл в `src/app/styles/modules/`
2. Добавьте импорт в `globals.css`
3. Документируйте в этом файле

### Профилирование производительности
```bash
npm run build
npm run analyze-bundle  # анализ размера бандла
npm run lighthouse      # аудит производительности
```

## Лучшие практики

1. **Используйте design tokens** вместо хардкод значений
2. **Предпочитайте CSS Modules** для стилей компонентов
3. **Минимизируйте custom CSS**, используйте Tailwind утилиты где возможно
4. **Тестируйте accessibility** с помощью screen readers
5. **Оптимизируйте critical path** для быстрой загрузки
6. **Используйте CSS-in-JS** только когда необходима динамика

## Инструменты разработки

- **PostCSS** - обработка CSS
- **Autoprefixer** - автоматические префиксы
- **cssnano** - минификация
- **Puppeteer** - генерация критического CSS
- **Tailwind CSS** - утилитарный фреймворк

## Troubleshooting

### Стили не применяются
1. Проверьте правильность импорта в `globals.css`
2. Убедитесь что Tailwind компилируется корректно
3. Проверьте Service Worker кэширование

### Большой размер CSS бандла
1. Проверьте настройки purge в `tailwind.config.js`
2. Убедитесь что tree-shaking работает
3. Уберите неиспользуемые импорты

### Проблемы с критическим CSS
1. Запустите `npm run generate-critical-css`
2. Проверьте что dev сервер запущен на localhost:4321
3. Убедитесь что Puppeteer может получить доступ к странице