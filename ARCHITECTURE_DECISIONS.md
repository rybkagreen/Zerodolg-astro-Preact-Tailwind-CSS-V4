# Архитектурные решения для секций сайта

## 🎯 Единая стратегия масок и z-index

### Цель

Создать единое понимание и подход к построению визуальных слоёв для всех
компонентов секций сайта.

### Проблема

Ранее в проекте использовались противоречивые стратегии применения масок и
z-index, что приводило к:

- Нарушению интерактивности элементов
- Непредсказуемому наложению слоёв
- Сложности в поддержке кода

### Решение

#### 1. Структура слоёв (z-index)

```
Слой контента: z-index: 10 (var(--z-content))
Акварельные паттерны: z-index: -11 (var(--z-pattern))
Градиентные фоны: z-index: -12 (var(--z-background))
```

#### 2. Стратегия применения масок

- **Градиентные фоны (z-index: -12)**: НЕ имеют масок
- **Акварельные паттерны (z-index: -11)**: ВСЕГДА имеют маски
- **Контентные элементы (z-index: 10)**: НЕ имеют масок

#### 3. Типы масок

- **fade-out**:
  `linear-gradient(to bottom, black 0%, black 85%, transparent 100%)`
  - Для плавного исчезновения в нижней части
- **fade-in**:
  `linear-gradient(to bottom, transparent 0%, black 15%, black 100%)`
  - Для плавного появления с нижней части
- **двойная**:
  `linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)`
  - Для плавного исчезновения сверху и снизу

#### 4. Обработка pointer-events

- Все фоновые слои: `pointer-events: none`
- Все контентные элементы: `pointer-events: auto`
- Контентные элементы переопределяют наследование

### Файлы

- `/src/app/styles/mask-gradients.css` - содержит стандартизованные переменные и
  стили для масок
- `/src/app/styles/globals.css` - импортирует mask-gradients.css

### Затронутые компоненты

- `src/components/sections/Problems.astro`
- `src/components/sections/SolutionChoice.astro`
- `src/components/sections/Benefits.astro`
- `src/components/sections/Process.astro`
- `src/components/sections/PrivacyApproach.astro`
- `src/widgets/faq/Faq.astro`
- `src/components/sections/LeadMagnets.astro`
- `src/islands/interactive/TeamInteractiveEnhanced.tsx`

### Правила для новых компонентов

1. Использовать стандартный `section-padding` для отступов
2. Применять градиентный фон с z-index: -12 БЕЗ маски
3. Применять акварельный паттерн с z-index: -11 С маской
4. Контент размещать с z-index: 10 и `pointer-events: auto`
5. Использовать стандартизованные CSS переменные из `mask-gradients.css`
6. Убедиться в корректной работе AOS анимаций

### Проверки

- [x] Все интерактивные элементы кликабельны
- [x] Нет визуальных разрывов между секциями
- [x] AOS анимации работают на всех устройствах
- [x] FPS при прокрутке ≥ 50
- [x] Safari корректно отображает маски
- [x] Z-index конфликты отсутствуют
- [x] Формы можно заполнять и отправлять

### Совместимость

- Chrome: ✅
- Firefox: ✅
- Safari: ✅
- Mobile: ✅

### Стандартные CSS переменные

```css
:root {
  --mask-fade-out: linear-gradient(
    to bottom,
    black 0%,
    black 85%,
    transparent 100%
  );
  --mask-fade-in: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 100%
  );
  --mask-double: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );

  --z-content: 10;
  --z-pattern: -11;
  --z-background: -12;
}
```

### Дополнительные стили

```css
/* Обеспечение интерактивности контента */
.section-content * {
  pointer-events: auto !important;
}

.background-layer {
  pointer-events: none !important;
}

/* Сброс наследования для интерактивных элементов */
button,
a,
input,
textarea,
select,
[role='button'],
[data-modal],
[onclick],
.card,
.btn {
  pointer-events: auto !important;
}

/* Обеспечение корректной работы AOS анимаций */
[data-aos].aos-animate {
  z-index: var(--z-content);
  isolation: isolate;
}
```
