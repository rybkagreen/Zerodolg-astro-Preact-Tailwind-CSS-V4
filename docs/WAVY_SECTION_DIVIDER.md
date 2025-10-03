# Волнистый разделитель секций (Wavy Section Divider)

## 📋 Обзор

Реализация волнистого перехода между секциями `Problems` и `SolutionChoice` с
использованием CSS `clip-path` и SVG.

## 🎯 Реализация

### 1. SVG ClipPath Definition

В секции `Problems.astro` добавлен SVG с определением clip-path:

```html
<svg width="0" height="0" aria-hidden="true" class="absolute">
  <defs>
    <clipPath id="waveClipProblems" clipPathUnits="objectBoundingBox">
      <path d="M0,0 L0,0.85 Q0.25,0.95 0.5,0.85 T1,0.85 L1,0 Z" />
    </clipPath>
  </defs>
</svg>
```

**Ключевые моменты:**

- `clipPathUnits='objectBoundingBox'` - нормализует координаты в диапазоне [0,
  1]
- Путь создает волнистую форму внизу секции
- `width='0' height='0'` - SVG невидим, используется только для определения

### 2. Применение Clip-Path

Секция Problems:

```html
<section
  class="relative py-20 md:py-28 lg:py-36 pb-32 md:pb-40 lg:pb-48"
  style="clip-path: url(#waveClipProblems);"
></section>
```

**Важные классы:**

- `pb-32 md:pb-40 lg:pb-48` - дополнительный padding снизу для размещения волны
- `style='clip-path: url(#waveClipProblems)'` - применение clip-path

### 3. Наложение следующей секции

Секция SolutionChoice:

```html
<section
  class="section-padding relative overflow-hidden -mt-24 md:-mt-32 lg:-mt-40"
></section>
```

**Отрицательный margin:**

- `-mt-24 md:-mt-32 lg:-mt-40` - поднимает секцию вверх, чтобы она заполнила
  пространство под волной

## 🎨 Как настроить волну

### Изменение формы волны

Путь SVG определяет форму волны:

```
M0,0 L0,0.85 Q0.25,0.95 0.5,0.85 T1,0.85 L1,0 Z
```

**Параметры:**

- `M0,0` - начальная точка (левый верхний угол)
- `L0,0.85` - прямая линия до точки на 85% высоты
- `Q0.25,0.95 0.5,0.85` - квадратичная кривая Безье (волна вниз)
- `T1,0.85` - продолжение кривой до правого края
- `L1,0` - закрытие пути

### Примеры вариаций

**Более выраженная волна:**

```html
<path d="M0,0 L0,0.8 Q0.25,1 0.5,0.8 T1,0.8 L1,0 Z" />
```

**Мягкая волна:**

```html
<path d="M0,0 L0,0.9 Q0.25,0.95 0.5,0.9 T1,0.9 L1,0 Z" />
```

**Несколько волн:**

```html
<path d="M0,0 L0,0.85 Q0.17,0.95 0.33,0.85 T0.67,0.85 T1,0.85 L1,0 Z" />
```

## 🐛 Решение проблем

### Белая область под волной

**Проблема:** Между секциями видна белая полоса.

**Решение:**

1. Убедитесь, что `pb-*` padding достаточно большой
2. Проверьте, что отрицательный margin `-mt-*` соответствует padding
3. Убедитесь, что overflow не обрезает секцию

### Волна не отображается

**Проверьте:**

1. SVG определен перед секцией
2. ID в `clipPath` и `url()` совпадают
3. Путь SVG корректен (замкнут)

### Responsive проблемы

**Рекомендация:**

- Используйте относительные единицы в пути SVG (0-1)
- Добавьте breakpoint-specific padding: `pb-32 md:pb-40 lg:pb-48`
- Синхронизируйте отрицательный margin: `-mt-24 md:-mt-32 lg:-mt-40`

## 🎯 Преимущества этого подхода

✅ **Нет дополнительных элементов** - чистый HTML ✅ **Производительность** -
CSS clip-path аппаратно ускорен ✅ **Responsive** - автоматически масштабируется
✅ **Легко настроить** - изменение пути SVG ✅ **Нет проблем с z-index** -
естественное наложение секций

## 📚 Альтернативные подходы

### Mask-Image (не реализовано)

```html
<div
  class="absolute inset-0"
  style="
    mask-image: url(#waveMask);
    mask-size: cover;
    mask-position: center top;
    mask-repeat: no-repeat;
  "
></div>
```

**Плюсы:** Более гибкий контроль над прозрачностью **Минусы:** Хуже поддержка
браузерами

## 🔗 Полезные ресурсы

- [Clippy - CSS clip-path maker](https://bennettfeely.com/clippy/)
- [SVG Path Visualizer](https://svg-path-visualizer.netlify.app/)
- [Get Waves - SVG Wave Generator](https://getwaves.io/)
- [MDN: clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)

## 📝 Примечания

- Clip-path не создает тень - используйте псевдо-элементы для теней
- При печати clip-path может вести себя непредсказуемо - добавьте `@media print`
- Для IE11 необходим полифилл
