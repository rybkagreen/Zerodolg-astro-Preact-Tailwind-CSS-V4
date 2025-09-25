# Миграция на Tailwind CSS v4

## Обзор

В проекте используется гибридный подход с ITCSS архитектурой и Tailwind CSS v4. Цель миграции - перейти к полностью компонентно-ориентированному подходу на основе Tailwind CSS v4.

## Текущее состояние

Проект в настоящее время использует:

1. ITCSS архитектуру CSS в `src/styles/`
2. Tailwind CSS v4 с `@theme` и `@apply` в `src/styles/globals.css`
3. Прямые Tailwind утилиты в компонентах Astro
4. Традиционные CSS-классы BEM-методологии в некоторых компонентах

## Подход к миграции

### 1. Сопоставление классов

| Традиционный CSS | Tailwind CSS                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.btn`           | `inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2` |
| `.btn-primary`   | `btn bg-primary text-white hover:bg-primary-dark focus:ring-primary`                                                                                         |
| `.btn-secondary` | `btn bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary`                                                     |
| `.btn-accent`    | `btn bg-accent text-white hover:bg-accent-dark focus:ring-accent`                                                                                            |
| `.btn--sm`       | `px-4 py-2 text-sm`                                                                                                                                          |
| `.btn--lg`       | `px-8 py-4 text-lg`                                                                                                                                          |
| `.btn--block`    | `w-full`                                                                                                                                                     |
| `.form__input`   | `w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`                                |
| `.form__label`   | `block text-sm font-medium text-text mb-1`                                                                                                                   |
| `.form__error`   | `text-sm text-error mt-1`                                                                                                                                    |
| `.form__group`   | `mb-4` (или соответствующий отступ)                                                                                                                          |

### 2. Порядок миграции

1. Создать копии компонентов для миграции
2. Заменить традиционные CSS-классы на Tailwind утилиты
3. Обновить JavaScript логику для работы с новыми классами (например, для состояния загрузки)
4. Протестировать визуальное отображение
5. Заменить оригинальный компонент мигрированной версией
6. Удалить неиспользуемые CSS-правила из ITCSS структуры

### 3. Особые случаи

#### Состояния загрузки

- Традиционный подход: `.form__submit.loading .btn__text { visibility: hidden; }` и `.form__submit.loading .btn__loader { display: block; }`
- Tailwind подход: Использовать `invisible` для текста и `block` для лоадера, переключаемые через JavaScript

#### Адаптивный дизайн

- Традиционный подход: `@media` правила в CSS
- Tailwind подход: Использовать `sm:`, `md:`, `lg:`, `xl:`, `2xl:` префиксы

#### Темизация

- Традиционный подход: CSS-переменные в `:root`
- Tailwind подход: `@theme` блок в globals.css

## Пример миграции компонента

Пример миграции CallbackModal компонента:

**До:**

```astro
<div class="form__group">
  <label class="form__label" for="name">Ваше имя</label>
  <input class="form__input" id="name" name="name" placeholder="Введите имя" />
  <span class="form__error" data-error="name"></span>
</div>
```

**После:**

```astro
<div class="mb-4">
  <label class="block text-sm font-medium text-text mb-1" for="name">Ваше имя</label>
  <input
    class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
    id="name"
    name="name"
    placeholder="Введите имя"
  />
  <span class="text-sm text-error mt-1" data-error="name"></span>
</div>
```

## Рекомендации

1. Начинать с простых компонентов (кнопки, формы)
2. Мигрировать компоненты по одному, сохраняя визуальное соответствие
3. Обновлять глобальные стили (globals.css) параллельно с компонентами
4. Тестировать на разных устройствах для проверки адаптивности
5. Использовать `@apply` в globals.css для часто используемых комбинаций утилит
