# План реализации SEO улучшений для сайта zerodolg.ru

## Обзор

Этот план описывает шаги, необходимые для реализации рекомендованных SEO улучшений на сайте zerodolg.ru. План включает:

- Immediate Actions (немедленные действия)
- Medium-term Improvements (улучшения среднесрочной перспективы)

## Текущее состояние

На основе анализа кодовой базы, было установлено, что:

1. Сайт использует Astro.js с компонентами Preact для интерактивных элементов
2. Существует централизованный SEO компонент в `src/shared/ui/SEO/SEO.astro`
3. Конфигурация SEO находится в `src/shared/config/seo-config.ts`
4. Структурированные данные реализованы в `src/shared/lib/structured-data.ts`
5. Существуют компоненты для отзывов и FAQ в папках `src/widgets/reviews` и `src/widgets/faq`
6. Интерактивные компоненты находятся в папке `src/islands`

## Immediate Actions

### 1. Implement Article Schema for blog posts to enhance rich snippets

#### Задачи:

- [ ] Создать специфичную функцию для генерации Article Schema в `src/shared/lib/structured-data.ts`
- [ ] Обновить SEO компонент (`src/shared/ui/SEO/SEO.astro`) для условной вставки Article Schema на страницах блога
- [ ] Обновить конфигурацию SEO (`src/shared/config/seo-config.ts`) для включения данных, необходимых для Article Schema
- [ ] Протестировать отображение rich snippets в Google Search Console

#### Файлы для изменения:

- `src/shared/lib/structured-data.ts` - добавить функцию `articleSchema`
- `src/shared/ui/SEO/SEO.astro` - добавить Article Schema на страницы блога
- `src/shared/config/seo-config.ts` - обновить конфигурацию для блога

### 2. Verify Breadcrumb Schema implementation across all pages

#### Задачи:

- [ ] Проверить текущую функцию `breadcrumbSchema` в `src/shared/lib/structured-data.ts`
- [ ] Убедиться, что Breadcrumb Schema вставлен на все страницы сайта
- [ ] Обновить все страницы в `src/pages` чтобы передавать нужные данные для Breadcrumb Schema
- [ ] Создать вспомогательный компонент для генерации навигационной цепочки

#### Файлы для изменения:

- `src/shared/lib/structured-data.ts` - проверить функцию `breadcrumbSchema`
- `src/shared/ui/SEO/SEO.astro` - убедиться в правильной вставке Breadcrumb Schema
- `src/pages/**/*.astro` - обновить страницы для передачи данных навигационной цепочки

### 3. Add LocalBusiness Schema with more detailed location information

#### Задачи:

- [ ] Обновить существующий Organization Schema или добавить отдельный LocalBusiness Schema в `src/shared/lib/structured-data.ts`
- [ ] Добавить более подробную информацию о локальном бизнесе (часы работы, географические координаты, цены, отзывы и т.д.)
- [ ] Обновить SEO компонент для включения LocalBusiness Schema

#### Файлы для изменения:

- `src/shared/lib/structured-data.ts` - обновить/добавить LocalBusiness Schema
- `src/shared/ui/SEO/SEO.astro` - включить LocalBusiness Schema

### 4. Enhance Review Schema with more customer testimonials

#### Задачи:

- [ ] Анализ компонента отзывов в `src/widgets/reviews/Reviews.astro`
- [ ] Обновить интерактивный компонент отзывов в `src/islands/sections/ReviewsEnhanced.tsx` для добавления структурированных данных
- [ ] Добавить Review Schema к каждому отдельному отзыву на странице
- [ ] Обеспечить правильное форматирование данных для поисковых систем
- [ ] Протестировать отображение отзывов как rich snippets

#### Файлы для изменения:

- `src/widgets/reviews/Reviews.astro` - обновить для включения Review Schema
- `src/islands/sections/ReviewsEnhanced.tsx` - обновить для правильной разметки отзывов
- `src/shared/data/reviews-data.ts` - убедиться, что данные отзывов подходят для структурированных данных

## Medium-term Improvements

### 1. Create FAQ Schema for all FAQ content

#### Задачи:

- [ ] Создать функцию для генерации FAQ Schema в `src/shared/lib/structured-data.ts`
- [ ] Обновить компонент FAQ в `src/widgets/faq/Faq.astro` для включения FAQ Schema
- [ ] Проверить, что структура данных FAQ подходит для структурированных данных
- [ ] Протестировать отображение FAQ rich snippets

#### Файлы для изменения:

- `src/shared/lib/structured-data.ts` - добавить функцию `faqSchema`
- `src/widgets/faq/Faq.astro` - обновить для включения FAQ Schema
- `src/islands/utils/faq-accordion.tsx` - проверить, что интерактивность не мешает структурированным данным

### 2. Add HowTo Schema for process-related content

#### Задачи:

- [ ] Создать функцию для генерации HowTo Schema в `src/shared/lib/structured-data.ts`
- [ ] Определить все страницы с пошаговыми процессами (банкротство, реструктуризация и т.д.)
- [ ] Обновить соответствующие компоненты и страницы для включения HowTo Schema
- [ ] Убедиться, что формат контента соответствует требованиям поисковых систем для HowTo Schema

#### Файлы для изменения:

- `src/shared/lib/structured-data.ts` - добавить функцию `howToSchema`
- `src/shared/ui/SEO/SEO.astro` - обновить для условной вставки HowTo Schema
- `src/pages/**/*.astro` - обновить страницы с процессами
- `src/widgets/**/*.astro` - обновить виджеты с процессами

### 3. Improve Image SEO with descriptive alt attributes and structured data

#### Задачи:

- [ ] Провести аудит всех изображений на сайте
- [ ] Обновить все изображения с содержательными alt атрибутами
- [ ] Добавить Image Schema к важным изображениям (например, изображения команды)
- [ ] Оптимизировать форматы изображений для производительности (WebP/AVIF)

#### Файлы для изменения:

- `src/components/**/*.astro` - обновить alt атрибуты для изображений
- `src/widgets/**/*.astro` - обновить alt атрибуты для изображений
- `src/pages/**/*.astro` - обновить alt атрибуты для изображений
- `src/shared/lib/structured-data.ts` - добавить Image Schema

### 4. Optimize for Core Web Vitals despite static generation benefits

#### Задачи:

- [ ] Провести аудит Core Web Vitals с помощью Web.dev, PageSpeed Insights
- [ ] Оптимизировать критические CSS и стили для улучшения Largest Contentful Paint (LCP)
- [ ] Оптимизировать шрифты и их загрузку для улучшения Cumulative Layout Shift (CLS)
- [ ] Обновить стратегию загрузки ресурсов (изображения, скрипты)
- [ ] Добавить предварительные подсказки (preload hints) для критических ресурсов

#### Файлы для изменения:

- `src/app/layouts/Layout.astro` - оптимизировать критические CSS, подсказки загрузки
- `src/app/styles/globals.css` - оптимизировать критические стили
- `src/pages/**/*.astro` - добавить подсказки загрузки для критических ресурсов
- `astro.config.mjs` - настройки оптимизации сборки

## Тестирование и валидация

### Задачи:

- [ ] Использовать Google Rich Results Test для проверки структурированных данных
- [ ] Проверить валидацию с помощью Schema Markup Validator
- [ ] Выполнить тестирование в Google Search Console
- [ ] Провести аудит Core Web Vitals
- [ ] Протестировать адаптивность и доступность изменений

## Ресурсы и документация

- [Schema.org documentation](https://schema.org/)
- [Google's Rich Results documentation](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Core Web Vitals documentation](https://web.dev/vitals/)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials SEO basics)

## Сроки реализации

- Immediate Actions: 1-2 недели
- Medium-term Improvements: 3-4 недели
- Тестирование и валидация: 1 неделя

## Ответственные

- Frontend Developer: Реализация компонентов и структурированных данных
- SEO Specialist: Тестирование и валидация, оптимизация
- QA Engineer: Тестирование и проверка корректности реализации
