# Руководство по оптимизации изображений для SEO

## Обзор

Это руководство содержит рекомендации по оптимизации изображений на сайте
zerodolg.ru для улучшения SEO и производительности. Руководство включает
реальные примеры из существующего кода проекта.

## Текущее состояние

Структурированные данные для изображений уже реализованы в
`src/shared/lib/section-semantics.ts` через функцию `generateImageSchema()`.
Также используются изображения команды в формате WebP
(`/images/team/mashulia.webp` и другие) и паттерны в `/patterns/`.

## Рекомендации по alt-атрибутам

### Общие правила

1. **Всегда указывайте alt-атрибут** для всех изображений
2. **Будьте описательны**, но лаконичны (до 125 символов)
3. **Используйте ключевые слова естественно**, не злоупотребляйте
4. **Не начинайте с "Изображение..." или "Картинка..."**
5. **Для декоративных изображений** используйте пустой alt=""

### Примеры правильных alt-атрибутов из проекта

#### Для команды юристов (на основе Hero.astro):

```astro
<!-- В Hero.astro -->
<img
  src='/images/team/mashulia.webp'
  alt='Масхулиа Леван Зурабович - Арбитражный управляющий'
  class='w-full h-full object-cover'
  style='object-position: center 25%'
/>
```

#### Для членов команды (на основе TeamInteractiveEnhanced.tsx):

```tsx
// В TeamInteractiveEnhanced.tsx
<img
  class='w-full h-full object-cover rounded-full'
  src={member.photo} // например, '/images/team/briancev.webp'
  alt={member.name} // например, 'Мария Брианцева'
  loading='lazy'
  decoding='async'
/>
```

#### Для документов специалистов:

```tsx
// В TeamInteractiveEnhanced.tsx
<img
  src={document.image}
  alt={document.alt || document.title}
  title={document.seoTitle || document.title}
  class='w-full h-full object-cover object-top'
  loading='lazy'
  decoding='async'
/>
```

#### Для паттернов в секциях (на основе SectionSemantics.astro):

```astro
// В SectionSemantics.astro
<img
  src={semantics.patternImage.url}
  alt={semantics.patternImage.alt}
  title={semantics.patternImage.title}
  style='display: none;'
  loading='lazy'
/>
```

## Форматы изображений

### Рекомендуемые форматы (по приоритету):

1. **AVIF** - наилучшее сжатие (~50% меньше JPEG)
2. **WebP** - отличное сжатие (~30% меньше JPEG), хорошая поддержка
3. **JPEG** - для фотографий (fallback)
4. **PNG** - для логотипов и изображений с прозрачностью (fallback)
5. **SVG** - для иконок и векторной графики

### Пример использования компонента OptimizedImage:

```astro
---
// Пример использования в компоненте
import OptimizedImage from '@/shared/ui/OptimizedImage';
---

<OptimizedImage
  src='/images/hero.avif'
  alt='Профессиональная помощь в банкротстве физических лиц в Москве'
  width={1200}
  height={800}
  loading='lazy'
  decoding='async'
  class='w-full h-auto'
/>
```

## Оптимизация размеров

### Целевые размеры файлов:

- **Hero-изображения**: < 200KB
- **Фотографии команды**: < 100KB (в проекте используются WebP)
- **Иконки и логотипы**: < 50KB
- **Thumbnails**: < 30KB

### Responsive изображения:

```astro
// Пример использования для фотографии специалиста
<img
  src='/images/team/mashulia-800.webp'
  srcset='
    /images/team/mashulia-400.webp 400w,
    /images/team/mashulia-800.webp 800w,
    /images/team/mashulia-1200.webp 1200w
  '
  sizes='(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px'
  alt='Масхулиа Леван Зурабович - Арбитражный управляющий'
  loading='lazy'
  width='400'
  height='400'
/>
```

## Lazy Loading

### Применяйте lazy loading для всех изображений ниже первого экрана:

```astro
<!-- Изображение на первом экране (НЕ lazy load) -->
<img src='/images/team/mashulia.webp' alt='...' width='400' height='400' />

<!-- Изображения ниже первого экрана (lazy load) -->
<img
  src={document.image}
  alt={document.alt || document.title}
  loading='lazy'
  width='300'
  height='400'
/>
```

## Использование Image Schema

### Для важных изображений добавьте структурированные данные (на основе section-semantics.ts):

```astro
---
// В SectionSemantics.astro
import { generateImageSchema } from '@shared/lib/section-semantics';

const imageSchema = includeImageSchema ? generateImageSchema(sectionId) : null;
---

{/* Структурированные данные для изображения секции */}
{
  imageSchema && (
    <script
      type='application/ld+json'
      set:text={JSON.stringify(imageSchema, null, 2)}
    />
  )
}
```

Пример генерации Image Schema для паттернов:

```ts
// В section-semantics.ts
export function generateImageSchema(sectionId: string) {
  const semantics = getSectionSemantics(sectionId);
  if (!semantics) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: semantics.patternImage.title,
    description: semantics.patternImage.alt,
    url: `https://zerodolg.ru${semantics.patternImage.url}`,
    contentUrl: `https://zerodolg.ru${semantics.patternImage.url}`,
    keywords: semantics.keywords.join(', '),
    about: {
      '@type': semantics.schemaType,
      name: semantics.title,
      description: semantics.description,
    },
  };
}
```

## Технические требования

### Обязательные атрибуты:

1. **alt** - описание изображения
2. **width** и **height** - предотвращает layout shift
3. **loading** - "lazy" для изображений ниже fold
4. **decoding** - "async" для улучшения производительности

### Пример оптимального тега:

```tsx
// В TeamInteractiveEnhanced.tsx - использование изображений команды
<img
  class='w-full h-full object-cover rounded-full'
  src={member.photo}
  alt={member.name}
  loading='lazy'
  decoding='async'
  width='64'
  height='64'
/>
```

## Инструменты для оптимизации

### Рекомендуемые инструменты:

1. **Sharp** - для автоматической оптимизации в build процессе
2. **ImageOptim** (Mac) или **Squoosh** (веб) - для ручной оптимизации
3. **AVIF/WebP конвертеры**:
   - https://squoosh.app/
   - https://avif.io/
   - Sharp CLI

### Интеграция Astro Image (опционально)

Проект может использовать интеграцию Astro Image для автоматической оптимизации
изображений. Для этого установите пакет и добавьте в конфигурацию:

```bash
npm install @astrojs/image
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
  ],
});
```

Однако в текущей реализации проекта используется собственный компонент
OptimizedImage, который обеспечивает оптимизацию изображений без дополнительной
интеграции.

````

### Пример команды с Sharp (Node.js):

```javascript
const sharp = require('sharp');

await sharp('input.jpg')
  .resize(800, 600, { fit: 'cover' })
  .webp({ quality: 85 })
  .toFile('output.webp');

await sharp('input.jpg')
  .resize(800, 600, { fit: 'cover' })
  .avif({ quality: 80 })
  .toFile('output.avif');
````

## Контрольный список для каждого изображения

- [ ] Alt-атрибут заполнен описательно
- [ ] Указаны width и height
- [ ] Применен lazy loading (если не на первом экране)
- [ ] Размер файла оптимизирован
- [ ] Используются современные форматы (WebP/AVIF)
- [ ] Для важных изображений добавлена Image Schema
- [ ] Responsive версии созданы при необходимости

## Приоритетные задачи

### 1. Аудит всех изображений (Высокий приоритет)

```bash
# Найти все изображения без alt-атрибутов
grep -r "<img" src/ | grep -v "alt="

# Найти все изображения без width/height
grep -r "<img" src/ | grep -v "width=" | grep -v "height="
```

### 2. Конвертация в WebP/AVIF (Средний приоритет)

- Конвертировать все JPEG/PNG в WebP
- Добавить AVIF версии для критических изображений
- Использовать `<picture>` element для поддержки fallback

### 3. Оптимизация размеров (Высокий приоритет)

- Сжать все изображения > 200KB
- Создать responsive версии для больших изображений
- Удалить неиспользуемые изображения

## Тестирование

### Проверьте оптимизацию с помощью:

1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **WebPageTest**: https://www.webpagetest.org/
3. **Lighthouse** в Chrome DevTools
4. **Google Rich Results Test** для Image Schema

### Целевые метрики:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Размер страницы**: снижение на 30-50%

## Пример компонента с оптимальными изображениями

```astro
---
// src/shared/ui/OptimizedImage/OptimizedImage.astro
import type { OptimizedImageProps } from './type';

interface Props extends OptimizedImageProps {}

const {
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  class: className = '',
  sizes,
  priority = false,
} = Astro.props;

// Определяем пути для современных форматов
const baseSrc = src.replace(/\.(jpg|jpeg|png)$/, '');
const hasWebP = /\.(jpg|jpeg|png)$/.test(src);
const webpSrc = hasWebP ? `${baseSrc}.webp` : src;
const avifSrc = hasWebP ? `${baseSrc}.avif` : src;

// Проверяем, есть ли изображение в формате WebP и AVIF
const webpExists = hasWebP;
const avifExists = /\.(jpg|jpeg|png)$/.test(src);
---

{
  priority ? (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding={decoding}
      class={className}
      sizes={sizes}
      priority
    />
  ) : (
    <picture>
      {avifExists && <source srcset={avifSrc} type='image/avif' />}
      {webpExists && <source srcset={webpSrc} type='image/webp' />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        class={className}
        sizes={sizes}
      />
    </picture>
  )
}
```

### Использование компонента OptimizedImage

```astro
---
// Пример использования в компоненте
import OptimizedImage from '@/shared/ui/OptimizedImage';
---

<OptimizedImage
  src='/images/team/mashulia.webp'
  alt='Масхулиа Леван Зурабович - Арбитражный управляющий'
  width={400}
  height={400}
  loading='lazy'
  decoding='async'
  class='rounded-full object-cover'
/>
```

## Дополнительные ресурсы

- [Google Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Astro Image Integration](https://docs.astro.build/en/guides/assets/)

---

**Статус**: Рекомендации готовы к внедрению  
**Приоритет**: Высокий (влияет на Core Web Vitals и SEO)  
**Ответственный**: Frontend Developer + SEO Specialist
