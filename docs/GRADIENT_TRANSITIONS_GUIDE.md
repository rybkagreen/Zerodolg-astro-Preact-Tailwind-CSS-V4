# 📘 Подробное руководство: Плавные градиентные переходы между секциями

## 🎯 Обзор

Данное руководство описывает полную реализацию плавных переходов между секциями
**Problems** и **SolutionChoice** с использованием CSS gradient masks и z-index
layering.

---

## 🏗️ Архитектура решения

### Концепция

Плавный переход достигается комбинацией трёх техник:

1. **CSS Gradient Masks** - создают плавное исчезновение/появление контента
2. **Z-index Layering** - управляют порядком наложения секций
3. **Negative Margins** - обеспечивают визуальное наложение секций друг на друга

---

## 📋 Структура реализации

### 1. Секция Problems (верхняя)

#### 1.1. HTML структура секции

```html
<section
  class:list="{`relative"
  py-20
  md:py-28
  lg:py-36
  pb-32
  md:pb-40
  lg:pb-48
  ${className}`}
  id="problems"
  aria-labelledby="problems-title"
  style="isolation: isolate; z-index: 10; mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%);"
>
  <!-- Background layers -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40"
  ></div>

  <div
    class="absolute inset-0 opacity-25"
    style='background-image: url("/patterns/problems-pattern.png"); background-size: cover; background-position: center; background-repeat: no-repeat;'
  ></div>

  <div
    class="absolute inset-0 opacity-10"
    style='background-image: url("/patterns/hero-dots.svg"); background-size: 100px 100px;'
  ></div>

  <!-- Content -->
  <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Your content here -->
  </div>
</section>
```

#### 1.2. Ключевые CSS-классы Problems

```css
/* Tailwind classes */
relative              /* Создаёт positioning context */
py-20 md:py-28 lg:py-36   /* Вертикальные отступы (responsive) */
pb-32 md:pb-40 lg:pb-48   /* УВЕЛИЧЕННЫЙ нижний padding для размещения градиента */
```

#### 1.3. Inline стили Problems

```css
isolation: isolate; /* Создаёт stacking context для корректной работы z-index */
z-index: 10; /* Высокий z-index - секция должна быть ПОВЕРХ следующей */

/* Gradient mask - главный эффект перехода */
mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%);
-webkit-mask-image: linear-gradient(
  to bottom,
  black 0%,
  black 85%,
  transparent 100%
);
```

**Расшифровка gradient mask:**

- `black 0%` - полностью видимо с начала
- `black 85%` - полностью видимо до 85% высоты
- `transparent 100%` - полностью прозрачно на 100% (создаёт fade-out)

#### 1.4. Фоновые слои Problems

**Важно:** Фоновые слои НЕ имеют градиентных масок - маска применяется ко всей
секции целиком.

```html
<!-- Базовый градиент -->
<div
  class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40"
></div>

<!-- Паттерн (watercolor) -->
<div
  class="absolute inset-0 opacity-25"
  style='background-image: url("/patterns/problems-pattern.png"); ...'
></div>

<!-- Точечный оверлей -->
<div
  class="absolute inset-0 opacity-10"
  style='background-image: url("/patterns/hero-dots.svg"); ...'
></div>
```

---

### 2. Секция SolutionChoice (нижняя)

#### 2.1. HTML структура секции

```html
<section
  class:list="{`solution-choice-section"
  section-padding
  relative
  overflow-hidden
  -mt-24
  md:-mt-32
  lg:-mt-40
  ${className}`}
  id="solution-choice"
  aria-labelledby="solution-choice-title"
  style="isolation: isolate; z-index: -1; mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%);"
>
  <!-- Background gradient with additional mask -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40"
    style="mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);"
  ></div>

  <!-- Watercolor pattern with fade-out -->
  <div
    class="absolute inset-0 opacity-25"
    style="background-image: url('/patterns/comparison-pattern-v1.png'); background-size: cover; background-position: center; background-repeat: no-repeat; mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);"
  ></div>

  <!-- Dot pattern with fade-out -->
  <div
    class="absolute inset-0 opacity-5"
    style="background-image: url('/patterns/hero-dots.svg'); background-size: 120px 120px; mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);"
  ></div>

  <!-- Content -->
  <div class="container-custom relative z-10">
    <!-- Your content here -->
  </div>
</section>
```

#### 2.2. Ключевые CSS-классы SolutionChoice

```css
/* Tailwind classes */
relative              /* Создаёт positioning context */
overflow-hidden       /* Скрывает выступающие части */
-mt-24 md:-mt-32 lg:-mt-40   /* ОТРИЦАТЕЛЬНЫЙ margin - поднимает секцию вверх */
section-padding       /* Стандартные отступы секции */
```

#### 2.3. Inline стили SolutionChoice

```css
isolation: isolate; /* Создаёт stacking context */
z-index: -1; /* ОТРИЦАТЕЛЬНЫЙ z-index - секция под Problems */

/* Gradient mask для всей секции */
mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%);
-webkit-mask-image: linear-gradient(
  to bottom,
  transparent 0%,
  black 15%,
  black 100%
);
```

**Расшифровка gradient mask секции:**

- `transparent 0%` - полностью прозрачно сверху
- `black 15%` - становится видимым к 15% высоты (создаёт fade-in)
- `black 100%` - полностью видимо до конца

#### 2.4. Двойное маскирование фонов

**Важная особенность:** Фоновые слои SolutionChoice имеют СОБСТВЕННЫЕ
градиентные маски:

##### Основной фон (с верхним и нижним fade)

```css
mask-image: linear-gradient(
  to bottom,
  transparent 0%,
  black 15%,
  black 85%,
  transparent 100%
);
```

- Fade-in сверху: `0% → 15%`
- Fade-out снизу: `85% → 100%`

##### Паттерны (только нижний fade)

```css
mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
```

- Полностью видимо: `0% → 70%`
- Fade-out снизу: `70% → 100%`

---

### 3. Wrapper-контейнеры (index.astro)

#### 3.1. Структура wrapper'ов

```html
<main>
  <!-- Problems wrapper -->
  <div
    data-aos="fade-up"
    data-aos-duration="800"
    style="position: relative; z-index: 10;"
  >
    <Problems />
  </div>

  <!-- SolutionChoice wrapper -->
  <div
    data-aos="fade-up"
    data-aos-duration="800"
    data-aos-delay="200"
    style="position: relative; z-index: 1;"
  >
    <SolutionChoice />
  </div>
</main>
```

#### 3.2. Зачем нужны z-index на wrapper'ах?

**Проблема:** AOS (Animate On Scroll) обёртки создают собственный **stacking
context**, который перекрывает z-index внутри секций.

**Решение:** Применить z-index на сами wrapper div'ы:

```css
/* Problems wrapper */
position: relative;
z-index: 10; /* Выше SolutionChoice */

/* SolutionChoice wrapper */
position: relative;
z-index: 1; /* Ниже Problems */
```

**Важно:** Без `position: relative` z-index не работает!

---

## 🎨 Визуальная схема работы

```
┌─────────────────────────────────────────┐
│          Problems Section               │
│  z-index: 10 (wrapper)                  │
│  z-index: 10 (section)                  │
│                                         │
│  ┌─────────────────────────────┐       │
│  │   Контент полностью виден   │       │
│  │   0% → 85% высоты           │       │
│  └─────────────────────────────┘       │
│                                         │
│  ╔═════════════════════════════╗       │ ← Fade-out zone
│  ║ Gradient fade-out 85%→100% ║       │   (mask-image)
│  ╚═════════════════════════════╝       │
└─────────────────────────────────────────┘
        ↓ Negative margin -mt-24
        ↓ (визуальное наложение)
┌─────────────────────────────────────────┐
│  ╔═════════════════════════════╗       │ ← Fade-in zone
│  ║ Gradient fade-in 0%→15%    ║       │   (mask-image)
│  ╚═════════════════════════════╝       │
│                                         │
│  ┌─────────────────────────────┐       │
│  │   Контент полностью виден   │       │
│  │   15% → 70% высоты          │       │
│  └─────────────────────────────┘       │
│                                         │
│  ╔═════════════════════════════╗       │ ← Fade-out паттернов
│  ║ Pattern fade-out 70%→100%  ║       │   (на фоновых слоях)
│  ╚═════════════════════════════╝       │
│                                         │
│      SolutionChoice Section             │
│  z-index: 1 (wrapper)                   │
│  z-index: -1 (section)                  │
└─────────────────────────────────────────┘
```

---

## 🔧 Критические моменты реализации

### ✅ 1. Увеличенный padding снизу верхней секции

```css
/* Problems */
pb-32 md:pb-40 lg:pb-48
```

**Зачем:** Создаёт пространство для градиентного перехода. Без этого контент
будет обрезан.

### ✅ 2. Отрицательный margin у нижней секции

```css
/* SolutionChoice */
-mt-24 md:-mt-32 lg:-mt-40
```

**Зачем:** Поднимает секцию вверх, чтобы она визуально наложилась на область
fade-out верхней секции.

**Важно:** Значения должны коррелировать с padding снизу верхней секции!

### ✅ 3. Isolation contexts

```css
isolation: isolate;
```

**Зачем:** Создаёт новый stacking context, обеспечивая корректную работу z-index
внутри секции.

### ✅ 4. WebKit префиксы

```css
mask-image: ...;
-webkit-mask-image: ...;
```

**Зачем:** Поддержка Safari и других WebKit-браузеров.

### ✅ 5. Z-index порядок

```
Wrapper Problems (z-index: 10)
  └─ Section Problems (z-index: 10)

Wrapper SolutionChoice (z-index: 1)
  └─ Section SolutionChoice (z-index: -1)
```

**Логика:** Верхняя секция должна быть ВСЕГДА выше нижней.

---

## 📐 Формулы и расчёты

### Расчёт negative margin

```
negative_margin ≈ (bottom_padding × 0.75)

Пример:
pb-32 (128px) → -mt-24 (96px) ≈ 128px × 0.75
pb-40 (160px) → -mt-32 (128px) ≈ 160px × 0.8
pb-48 (192px) → -mt-40 (160px) ≈ 192px × 0.83
```

### Процентные значения gradient

**Для fade-out (верхняя секция):**

```css
black 0%, black 85%, transparent 100%
       ↑        ↑              ↑
   начало   конец видимого   полная прозрачность
```

**Для fade-in (нижняя секция):**

```css
transparent 0%, black 15%, black 100%
         ↑            ↑           ↑
  полная прозрачность  начало видимого  полностью видно
```

---

## 🎯 Шаблон для новых переходов

### Верхняя секция (Section A)

```html
<section
  class:list="{`relative"
  py-20
  md:py-28
  lg:py-36
  pb-32
  md:pb-40
  lg:pb-48
  ${className}`}
  style="isolation: isolate; z-index: 10; mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%);"
>
  <!-- Backgrounds without masks -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-[color1] to-[color2]"
  ></div>

  <!-- Content -->
  <div class="relative max-w-6xl mx-auto px-4">
    <!-- Your content -->
  </div>
</section>
```

### Нижняя секция (Section B)

```html
<section
  class:list="{`section-padding"
  relative
  overflow-hidden
  -mt-24
  md:-mt-32
  lg:-mt-40
  ${className}`}
  style="isolation: isolate; z-index: -1; mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%);"
>
  <!-- Background with double mask -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-[color1] to-[color2]"
    style="mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);"
  ></div>

  <!-- Patterns with fade-out -->
  <div
    class="absolute inset-0 opacity-25"
    style='background-image: url("/patterns/your-pattern.png"); mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);'
  ></div>

  <!-- Content -->
  <div class="container-custom relative z-10">
    <!-- Your content -->
  </div>
</section>
```

### Wrapper'ы в index.astro

```html
<div
  data-aos="fade-up"
  data-aos-duration="800"
  style="position: relative; z-index: 10;"
>
  <SectionA />
</div>

<div
  data-aos="fade-up"
  data-aos-duration="800"
  data-aos-delay="200"
  style="position: relative; z-index: 1;"
>
  <SectionB />
</div>
```

---

## 🐛 Troubleshooting

### Проблема: Секция B перекрывает секцию A

**Причина:** Неправильный z-index или отсутствие `position: relative` на
wrapper'ах.

**Решение:**

```css
/* Section A wrapper */
position: relative;
z-index: 10;

/* Section B wrapper */
position: relative;
z-index: 1;
```

### Проблема: Резкая граница вместо плавного перехода

**Причина:** Отсутствует WebKit префикс или неправильные процентные значения.

**Решение:**

```css
mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent 100%);
-webkit-mask-image: linear-gradient(
  to bottom,
  black 0%,
  black 85%,
  transparent 100%
);
```

### Проблема: Контент обрезан снизу

**Причина:** Недостаточный padding снизу верхней секции.

**Решение:**

```css
pb-32 md:pb-40 lg:pb-48  /* Увеличьте значения */
```

### Проблема: Слишком большой зазор между секциями

**Причина:** Отрицательный margin слишком мал.

**Решение:**

```css
-mt-32 md:-mt-40 lg:-mt-48  /* Увеличьте negative margin */
```

---

## 📊 Performance considerations

### ✅ Оптимизация

1. **GPU Acceleration:** `mask-image` использует GPU
2. **No Reflow:** Изменения касаются только визуала, не layout
3. **No JavaScript:** Чистый CSS - максимальная производительность

### ⚠️ Поддержка браузеров

- Chrome/Edge: ✅ Полная поддержка
- Firefox: ✅ Полная поддержка
- Safari: ✅ С `-webkit-` префиксом
- IE11: ❌ Не поддерживается (fallback - жёсткая граница)

---

## 📝 Checklist внедрения

- [ ] Верхняя секция имеет `pb-32 md:pb-40 lg:pb-48`
- [ ] Верхняя секция имеет `mask-image` с fade-out внизу
- [ ] Верхняя секция имеет `isolation: isolate; z-index: 10;`
- [ ] Нижняя секция имеет `-mt-24 md:-mt-32 lg:-mt-40`
- [ ] Нижняя секция имеет `mask-image` с fade-in вверху
- [ ] Нижняя секция имеет `isolation: isolate; z-index: -1;`
- [ ] Оба wrapper'а в index.astro имеют `position: relative`
- [ ] Wrapper верхней секции имеет `z-index: 10`
- [ ] Wrapper нижней секции имеет `z-index: 1`
- [ ] Добавлены WebKit префиксы для всех `mask-image`
- [ ] Проверена работа на всех breakpoints (mobile, tablet, desktop)

---

## 🎓 Заключение

Эта техника создаёт профессиональные, плавные переходы между секциями без
использования JavaScript. Ключевые принципы:

1. **Gradient Masks** - основа плавности
2. **Z-index Layering** - контроль порядка наложения
3. **Negative Margins** - визуальное наложение
4. **Isolation Contexts** - корректная работа z-index
5. **Responsive Design** - адаптация под все устройства

При правильной реализации результат выглядит естественно и профессионально! 🚀
