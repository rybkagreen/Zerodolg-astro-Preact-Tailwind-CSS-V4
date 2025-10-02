# 🎯 Production Action Plan - План действий

**Создано**: 2025-10-02  
**Приоритет**: Средний/Высокий  
**Статус**: В процессе

---

## 🔴 Критические исправления (ВЫПОЛНЕНО)

### ✅ 1. Установка lightningcss

**Статус**: ЗАВЕРШЕНО ✅

**Проблема**: Production сборка падала с ошибкой

**Решение**:

```bash
npm install lightningcss --save-dev
```

**Результат**: Сборка проходит успешно

---

## 🟠 Высокий приоритет (Рекомендуется до deploy)

### 1. Исправление console.log statements

**Проблема**: 48 console.log в production коде

**Файлы для исправления**:

- `src/features/analytics/analytics.ts`
- `src/islands/forms/FormEnhancedFinal.tsx`
- `src/islands/forms/form-logic.tsx`
- `src/islands/sections/ProblemsInteractive.tsx`
- `src/islands/sections/ReviewsEnhanced.tsx`
- `src/islands/shared/interactive/lead-magnets.tsx`
- `src/shared/analytics/tracking-config.ts`
- `src/shared/hooks/useLocalStorage.ts`
- `src/shared/hooks/usePerformanceMonitor.ts`
- `src/shared/lib/analytics.ts`
- `src/shared/lib/bitrix-callback-widget.ts`
- `src/shared/lib/bitrix-callback.ts`
- `src/shared/lib/hash-utils.ts`
- `src/shared/lib/logger.ts`
- `src/shared/lib/performance.ts`

**Решение**:

```typescript
// Было:
console.log('Debug message');

// Стало:
import { Logger } from '@/shared/lib/logger';
Logger.debug('Debug message');
```

**Автоматизация**:

```bash
# Уже есть скрипт для обертки console statements
node scripts/wrap-console-statements.cjs
```

**Оценка времени**: 2-3 часа

---

### 2. Удаление неиспользуемых CSS селекторов

**Проблема**: 14 неиспользуемых CSS селекторов

**Файлы**:

- `src/app/layouts/Layout.astro` (14 селекторов)
- `src/shared/ui/Cta.astro` (11 селекторов)

**Действия**:

1. Проверить, действительно ли селекторы не используются
2. Удалить неиспользуемые селекторы
3. Или добавить соответствующую разметку

**Примеры неиспользуемых селекторов**:

- `.hero-section`
- `.container-custom`
- `.hero-title`
- `.btn-primary`
- `.sr-only`
- `.form-on-gradient input`

**Оценка времени**: 1-2 часа

---

### 3. Безопасное использование set:html

**Проблема**: 6 предупреждений XSS для `set:html`

**Файлы**:

- `src/pages/restrukturizaciya-dolgov.astro`
- `src/shared/seo/OrganizationSchema.astro`
- `src/shared/seo/ReviewSchema.astro`
- `src/shared/ui/Breadcrumb/Breadcrumb.astro`

**Решение**:

```astro
<!-- Было: -->
<div set:html={unsafeContent} />

<!-- Стало (если контент статичный): -->
<div>{safeContent}</div>

<!-- Или (если динамический): -->
<div set:html={sanitizeHTML(content)} />
```

**Создать утилиту**:

```typescript
// src/shared/lib/sanitize-html.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
```

**Установка зависимости**:

```bash
npm install isomorphic-dompurify
```

**Оценка времени**: 2 часа

---

### 4. Обновление уязвимых зависимостей

**Проблема**: 4 low severity уязвимости в `tmp` пакете

**Анализ**:

- Уязвимость в dev-dependency (@lhci/cli)
- Не влияет на production код
- Но лучше исправить для security compliance

**Варианты решения**:

**Вариант 1**: Обновить @lhci/cli

```bash
npm update @lhci/cli
```

**Вариант 2**: Заменить @lhci/cli на альтернативу

```bash
npm uninstall @lhci/cli
npm install lighthouse --save-dev
# Обновить скрипт lighthouse-audit.cjs
```

**Вариант 3**: Игнорировать (low severity, dev only)

```bash
# Создать .npmrc
audit-level=moderate
```

**Рекомендация**: Вариант 1 или 3

**Оценка времени**: 30 минут - 1 час

---

### 5. Настройка Content-Security-Policy

**Проблема**: CSP headers не настроены, есть 'unsafe-inline'

**Решение**: Настроить CSP на сервере

**Для Nginx**:

```nginx
# /etc/nginx/sites-available/zerodolg.ru

add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM_NONCE}' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru;
  style-src 'self' 'nonce-{RANDOM_NONCE}' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://www.google-analytics.com https://mc.yandex.ru https://zerodolg.bitrix24.ru;
  frame-src 'self' https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
" always;
```

**Для Apache**:

```apache
Header set Content-Security-Policy "default-src 'self'; ..."
```

**Для Cloudflare Workers**:

```javascript
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);

  newResponse.headers.set('Content-Security-Policy', "default-src 'self'; ...");

  return newResponse;
}
```

**Обновить Astro middleware**:

```typescript
// src/middleware.ts
export const onRequest = async (context, next) => {
  const response = await next();

  response.headers.set(
    'Content-Security-Policy',
    `
    default-src 'self';
    script-src 'self' 'nonce-${generateNonce()}' https://www.googletagmanager.com;
    ...
  `
  );

  return response;
};
```

**Оценка времени**: 2-3 часа

---

## 🟡 Средний приоритет (После deploy)

### 6. Исправление упавших тестов

**Проблема**: 24 из 188 тестов не проходят

**Категории**:

#### Accessibility тесты (4 теста):

1. `should use semantic HTML correctly`
2. `should provide screen reader support correctly`
3. `should maintain sufficient color contrast`
4. `should implement ARIA attributes correctly`

**Файл**: `__tests__/accessibility.test.ts`

**Действия**:

- Обновить компоненты для соответствия WCAG 2.2
- Добавить недостающие ARIA атрибуты
- Исправить цветовой контраст
- Улучшить семантическую разметку

#### Security тесты (4 теста):

1. `should prevent XSS attacks correctly`
2. `should validate inputs correctly`
3. `should handle data encryption correctly`
4. `should generate CSP headers correctly`

**Файл**: `__tests__/security.test.ts`

**Действия**:

- Улучшить XSS защиту
- Улучшить валидацию входных данных
- Обновить тесты CSP
- Проверить encryption logic

#### Component тесты (16 тестов):

- Performance, Footer, Hero, Header
- Benefits, Calculator, Component isolation
- CTA, FAQ, Online sticker
- Process, Special offers, Trust badges

**Действия**:

- Обновить тесты для соответствия реализации
- Исправить edge cases
- Улучшить test fixtures

**Оценка времени**: 1-2 дня

---

### 7. Оптимизация FormEnhancedFinal bundle

**Проблема**: Bundle size 59.63 kB (близко к лимиту 50 kB)

**Текущий размер**:

- Uncompressed: 59.63 kB
- Gzipped: 17.60 kB

**Целевой размер**: < 50 kB uncompressed

**Решения**:

#### Вариант 1: Code Splitting

```typescript
// src/islands/forms/FormEnhancedFinal.tsx
import { lazy } from 'preact/compat';

const ValidationModule = lazy(() => import('./ValidationModule'));
const AnalyticsModule = lazy(() => import('./AnalyticsModule'));
```

#### Вариант 2: Tree Shaking

```bash
# Анализ bundle
npx vite-bundle-visualizer

# Найти неиспользуемый код
npx source-map-explorer dist/_astro/FormEnhancedFinal.*.js
```

#### Вариант 3: Lazy Loading

```typescript
// Загружать форму только при взаимодействии
<FormEnhancedFinal client:visible />
// или
<FormEnhancedFinal client:idle />
```

#### Вариант 4: Удалить дублирование

- Проверить дублирующиеся зависимости
- Переиспользовать общие утилиты
- Вынести константы в отдельные файлы

**Оценка времени**: 3-4 часа

---

### 8. Запуск E2E тестов

**Действия**:

```bash
# Установить Puppeteer (если нужно)
npm run puppeteer:setup

# Запустить E2E тесты
npm run test:e2e

# Проверить результаты
# test-results/puppeteer-test-report-*.html
```

**Проверить**:

- Навигация по сайту
- Отправка форм
- Модальные окна
- Адаптивность
- Интерактивные компоненты

**Оценка времени**: 1-2 часа

---

### 9. Lighthouse аудит

**Действия**:

```bash
# Запустить Lighthouse
npm run maintenance:lighthouse

# Проверить результаты
# lighthouse-report.html
```

**Целевые метрики**:

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

**При необходимости**:

- Оптимизировать изображения
- Добавить lazy loading
- Минифицировать CSS/JS
- Улучшить кэширование

**Оценка времени**: 2 часа

---

### 10. Security сканирование

**Semgrep**:

```bash
npm run tools:semgrep
```

**TruffleHog**:

```bash
npm run tools:trufflehog
```

**Действия при обнаружении проблем**:

- Исправить security issues
- Удалить secrets из кода
- Обновить .gitignore

**Оценка времени**: 1-2 часа

---

## 🟢 Низкий приоритет (Опционально)

### 11. Настройка мониторинга

**Error Tracking**:

```bash
npm install @sentry/astro
```

```typescript
// astro.config.mjs
import sentry from '@sentry/astro';

export default defineConfig({
  integrations: [
    sentry({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    }),
  ],
});
```

**Performance Monitoring**:

- Google Analytics 4 (уже настроено ✓)
- Yandex Metrica (уже настроено ✓)
- Custom RUM metrics

**Uptime Monitoring**:

- UptimeRobot
- Pingdom
- StatusCake

**Оценка времени**: 3-4 часа

---

### 12. Кроссбраузерное тестирование

**Браузеры для тестирования**:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Safari Mobile (iOS)
- Chrome Mobile (Android)

**Инструменты**:

- BrowserStack
- LambdaTest
- Manual testing

**Оценка времени**: 2-3 часа

---

### 13. Performance Optimization

**Lazy Loading**:

```typescript
// Изображения
<img loading="lazy" src="..." alt="..." />

// Компоненты
<Component client:visible />
<Component client:idle />
<Component client:media="(max-width: 768px)" />
```

**Resource Hints**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
<link rel="preload" href="/critical.css" as="style" />
```

**Image Optimization**:

```bash
npm run maintenance:optimize-images
```

**Оценка времени**: 2-3 часа

---

## 📊 Приоритизация

### Немедленно (перед deploy):

1. ✅ lightningcss - ВЫПОЛНЕНО
2. Console.log statements (2-3 часа)
3. Неиспользуемые CSS селекторы (1-2 часа)
4. set:html безопасность (2 часа)

**Итого**: ~6 часов работы

### В течение недели после deploy:

5. Уязвимые зависимости (1 час)
6. CSP headers (2-3 часа)
7. Упавшие тесты (1-2 дня)
8. Bundle optimization (3-4 часа)

**Итого**: ~2-3 дня работы

### В течение месяца:

9. E2E тесты (1-2 часа)
10. Lighthouse аудит (2 часа)
11. Security сканирование (1-2 часа)
12. Мониторинг (3-4 часа)
13. Кроссбраузерное тестирование (2-3 часа)
14. Performance optimization (2-3 часа)

**Итого**: ~2 недели периодической работы

---

## 🎯 Выводы

**Текущий статус**: Проект готов к deploy с оговорками

**Критические блокеры**: Нет (все исправлены)

**Рекомендуемые действия перед deploy**:

1. Убрать console.log
2. Очистить неиспользуемый CSS
3. Обезопасить set:html

**Оценка времени до production-ready**: 6-8 часов

**После deploy**:

- Мониторить производительность
- Собирать feedback
- Постепенно исправлять некритичные проблемы

---

## ✅ Checklist выполнения

### Перед deploy:

- [x] lightningcss установлен
- [ ] console.log заменены на Logger
- [ ] Неиспользуемые CSS удалены
- [ ] set:html безопасно используется

### После deploy:

- [ ] CSP headers настроены
- [ ] Упавшие тесты исправлены
- [ ] Bundle размеры оптимизированы
- [ ] Security сканирование выполнено
- [ ] Мониторинг настроен

---

**Подготовлено**: AI Agent (Warp)  
**Дата**: 2025-10-02  
**Обновлено**: -
