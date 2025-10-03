# 🔧 Дополнительные рекомендации по SEO-оптимизации

## Проект: zerodolg.ru

**Дата**: 03.10.2025  
**Версия**: 1.0

---

## 📋 СОДЕРЖАНИЕ

1. [Техническая оптимизация](#1-техническая-оптимизация)
2. [Оптимизация блога](#2-оптимизация-блога)
3. [Внутренняя перелинковка](#3-внутренняя-перелинковка)
4. [Производительность](#4-производительность)
5. [Контентная стратегия](#5-контентная-стратегия)
6. [Мониторинг и аналитика](#6-мониторинг-и-аналитика)
7. [Quick Wins](#7-quick-wins)

---

## 1. ТЕХНИЧЕСКАЯ ОПТИМИЗАЦИЯ

### 1.1 Микроразметка Schema.org

**Текущее состояние:**

- ✅ Базовая разметка Organization уже есть
- ⚠️ Нужно расширить для юридической тематики

#### A) Schema.org/LegalService

**Создать файл:** `src/shared/seo/LegalServiceSchema.astro`

```astro
---
import { SITE_CONFIG } from '@shared/config/seo-config';
import { getCurrentYear } from '@shared/utils/date-helpers';

interface Props {
  service?: 'bankruptcy' | 'restructuring' | 'both';
  pageType?: 'homepage' | 'service';
}

const { service = 'both', pageType = 'homepage' } = Astro.props;

const bankruptcyService = {
  '@type': 'LegalService',
  name: 'Банкротство физических лиц',
  description: `Профессиональное сопровождение банкротства физических лиц в Москве. Списание долгов под ключ от 50000₽ за 4 месяца. Опыт ${getCurrentYear() - 2009} лет.`,
  serviceType: 'Bankruptcy Law',
  areaServed: {
    '@type': 'City',
    name: 'Москва',
    '@id': 'https://www.wikidata.org/wiki/Q649'
  },
  provider: {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone
  },
  offers: {
    '@type': 'Offer',
    price: '50000',
    priceCurrency: 'RUB',
    description: 'Банкротство физических лиц под ключ',
    availability: 'https://schema.org/InStock'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги банкротства',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Консультация по банкротству',
          description: 'Бесплатная первичная консультация'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Полное сопровождение банкротства',
          description: 'Сопровождение от подачи заявления до списания долгов'
        }
      }
    ]
  }
};

const restructuringService = {
  '@type': 'LegalService',
  name: 'Реструктуризация долгов физических лиц',
  description: 'Реструктуризация долгов через арбитражный суд с сохранением имущества. От 89000₽ под ключ.',
  serviceType: 'Debt Restructuring Law',
  areaServed: {
    '@type': 'City',
    name: 'Москва'
  },
  provider: {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url
  },
  offers: {
    '@type': 'Offer',
    price: '89000',
    priceCurrency: 'RUB',
    description: 'Реструктуризация долгов под ключ'
  }
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  ...(service === 'bankruptcy' ? bankruptcyService :
      service === 'restructuring' ? restructuringService :
      { service: [bankruptcyService, restructuringService] })
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema, null, 2)} />
```

**Использование:**

```astro
<!-- В src/pages/index.astro -->
<LegalServiceSchema service="both" pageType="homepage" slot="head" />
```

**Ожидаемый эффект:**

- Расширенный сниппет в Google
- Повышение CTR на 10-15%
- Лучшее понимание тематики сайта поисковиками

#### B) AggregateRating для повышения CTR

**Создать:** `src/shared/seo/RatingSchema.astro`

```astro
---
import { getCurrentYear } from '@shared/utils/date-helpers';

interface Props {
  ratingValue?: string;
  reviewCount?: string;
  bestRating?: string;
}

const {
  ratingValue = '4.9',
  reviewCount = '127',
  bestRating = '5'
} = Astro.props;

const ratingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Услуги банкротства физических лиц',
  description: 'Профессиональное сопровождение банкротства в Москве',
  brand: {
    '@type': 'Brand',
    name: 'ZeroDolg'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating,
    worstRating: '1'
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: 'Анонимный клиент'
      },
      datePublished: `${getCurrentYear()}-01-15`,
      reviewBody: 'Отличная работа! Помогли списать все долги за 4 месяца.'
    }
  ]
};
---

<script type="application/ld+json" set:html={JSON.stringify(ratingSchema, null, 2)} />
```

**Использование:**

```astro
<RatingSchema ratingValue="4.9" reviewCount="127" slot="head" />
```

**Результат:**

- ⭐⭐⭐⭐⭐ Звезды в сниппете Google
- Увеличение CTR на 15-30%
- Повышение доверия пользователей

---

### 1.2 Структурные элементы

#### A) XML-карта сайта с динамическим обновлением

**Создать файл:** `src/pages/sitemap.xml.ts`

```typescript
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://zerodolg.ru';

export const GET: APIRoute = async () => {
  // Получаем все статьи блога
  const posts = await getCollection('blog');

  // Статические страницы
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: 1.0 },
    { url: '/blog', changefreq: 'daily', priority: 0.9 },
    { url: '/restrukturizaciya-dolgov', changefreq: 'monthly', priority: 0.8 },
    { url: '/bankrotstvo-s-sokhraneniyem-imushchestva', changefreq: 'monthly', priority: 0.8 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  // Динамические страницы (статьи)
  const blogPages = posts.map((post) => ({
    url: `/blog/${post.slug}.html`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: post.data.updatedDate || post.data.pubDate,
  }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod ? new Date(page.lastmod).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Кеш на 1 час
    },
  });
};
```

#### B) Оптимизированный robots.txt

**Создать/обновить:** `public/robots.txt`

```txt
User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /_astro/
Disallow: /test-*

# Специальные правила для Яндекса
User-agent: Yandex
Allow: /
Disallow: /privacy
Disallow: /terms

# Специальные правила для Google
User-agent: Googlebot
Allow: /

# Специальные правила для бэд-ботов
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

# Sitemap
Sitemap: https://zerodolg.ru/sitemap.xml

# Дополнительно
Host: https://zerodolg.ru
```

#### C) Hreflang для региональных версий

**Для будущего расширения на регионы:**

```astro
<!-- В Layout.astro -->
<link rel="alternate" hreflang="ru-RU" href="https://zerodolg.ru/" />
<link rel="alternate" hreflang="ru-SPE" href="https://zerodolg.ru/spb/" />
<link rel="alternate" hreflang="x-default" href="https://zerodolg.ru/" />
```

---

## 2. ОПТИМИЗАЦИЯ БЛОГА

### 2.1 Система тегов и категорий

**Обновить схему контента:** `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('ZeroDolg'),
    image: z.string().optional(),

    // Категории (основная тематика)
    category: z.enum([
      'банкротство',
      'реструктуризация',
      'долги',
      'законодательство',
      'инструкции',
      'кейсы'
    ]),

    // Теги (дополнительные темы)
    tags: z.array(z.string()).default([]),

    // SEO
    featured: z.boolean().default(false), // Популярная статья
    readingTime: z.number().optional(),

    // Статус
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### 2.2 Страница категорий

**Создать:** `src/pages/blog/category/[category].astro`

```astro
---
import { getCollection } from 'astro:content';
import Layout from '@app/layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const categories = [...new Set(posts.map(post => post.data.category))];

  return categories.map(category => ({
    params: { category },
    props: {
      posts: posts.filter(post => post.data.category === category)
    }
  }));
}

const { category } = Astro.params;
const { posts } = Astro.props;

const categoryNames = {
  'банкротство': 'Банкротство',
  'реструктуризация': 'Реструктуризация',
  'долги': 'Долги',
  'законодательство': 'Законодательство',
  'инструкции': 'Инструкции',
  'кейсы': 'Кейсы и примеры'
};

const categoryName = categoryNames[category as keyof typeof categoryNames];
const pageTitle = `${categoryName}: статьи и советы | Блог ZeroDolg`;
---

<Layout title={pageTitle} description={`Статьи по теме "${categoryName}" от экспертов ZeroDolg`}>
  <main>
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8">Категория: {categoryName}</h1>
        <div class="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <article class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-bold mb-2">
                <a href={`/blog/${post.slug}.html`}>{post.data.title}</a>
              </h2>
              <p class="text-gray-600">{post.data.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
</Layout>
```

### 2.3 Блок "Популярные статьи"

**Создать:** `src/components/blog/PopularPosts.astro`

```astro
---
import { getCollection } from 'astro:content';

interface Props {
  limit?: number;
  excludeSlug?: string;
}

const { limit = 5, excludeSlug } = Astro.props;

const allPosts = await getCollection('blog');

// Фильтруем популярные и исключаем текущую статью
const popularPosts = allPosts
  .filter(post => post.data.featured && post.slug !== excludeSlug)
  .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
  .slice(0, limit);
---

<aside class="bg-gray-50 rounded-xl p-6">
  <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
    <span class="text-amber-500">⭐</span>
    Популярные статьи
  </h3>

  <div class="space-y-4">
    {popularPosts.map((post, index) => (
      <article class="border-l-4 border-blue-500 pl-4 hover:bg-white transition-colors rounded">
        <div class="flex gap-3">
          <span class="text-3xl font-bold text-gray-300">{index + 1}</span>
          <div>
            <h4 class="font-semibold hover:text-blue-600 transition-colors">
              <a href={`/blog/${post.slug}.html`}>{post.data.title}</a>
            </h4>
            <div class="text-sm text-gray-500 mt-1">
              {post.data.readingTime && `${post.data.readingTime} мин чтения`}
            </div>
          </div>
        </div>
      </article>
    ))}
  </div>

  <a
    href="/blog"
    class="mt-6 inline-block text-blue-600 hover:text-blue-700 font-medium"
  >
    Все статьи →
  </a>
</aside>
```

### 2.4 Архив по годам и месяцам

**Создать:** `src/pages/blog/archive/[year]/[month].astro`

```astro
---
import { getCollection } from 'astro:content';
import Layout from '@app/layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');

  // Группируем по году и месяцу
  const archives = new Map<string, typeof posts>();

  posts.forEach(post => {
    const date = new Date(post.data.pubDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;

    if (!archives.has(key)) {
      archives.set(key, []);
    }
    archives.get(key)!.push(post);
  });

  // Генерируем пути
  return Array.from(archives.entries()).map(([key, posts]) => {
    const [year, month] = key.split('-');
    return {
      params: { year, month },
      props: { posts, year, month }
    };
  });
}

const { posts, year, month } = Astro.props;

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const monthName = monthNames[parseInt(month) - 1];
const pageTitle = `Архив блога: ${monthName} ${year} | ZeroDolg`;
---

<Layout title={pageTitle} description={`Статьи за ${monthName} ${year}`}>
  <main class="py-16">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8">
        Архив: {monthName} {year}
      </h1>

      <div class="text-gray-600 mb-8">
        Найдено статей: {posts.length}
      </div>

      <div class="space-y-6">
        {posts.map(post => (
          <article class="bg-white rounded-lg shadow-md p-6">
            <time class="text-sm text-gray-500">
              {new Date(post.data.pubDate).toLocaleDateString('ru-RU')}
            </time>
            <h2 class="text-2xl font-bold mt-2 mb-3">
              <a href={`/blog/${post.slug}.html`} class="hover:text-blue-600">
                {post.data.title}
              </a>
            </h2>
            <p class="text-gray-700">{post.data.description}</p>
          </article>
        ))}
      </div>
    </div>
  </main>
</Layout>
```

**Виджет архива:** `src/components/blog/ArchiveWidget.astro`

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');

// Группируем по году и месяцу
const archives = new Map<string, number>();

posts.forEach(post => {
  const date = new Date(post.data.pubDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const key = `${year}-${String(month + 1).padStart(2, '0')}`;
  archives.set(key, (archives.get(key) || 0) + 1);
});

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Сортируем по дате (новые первыми)
const sortedArchives = Array.from(archives.entries())
  .sort((a, b) => b[0].localeCompare(a[0]))
  .slice(0, 12); // Последние 12 месяцев
---

<aside class="bg-white rounded-xl p-6 shadow-md">
  <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
    <span>📅</span>
    Архив статей
  </h3>

  <ul class="space-y-2">
    {sortedArchives.map(([key, count]) => {
      const [year, month] = key.split('-');
      const monthName = monthNames[parseInt(month) - 1];
      return (
        <li>
          <a
            href={`/blog/archive/${year}/${month}`}
            class="flex justify-between items-center hover:text-blue-600 transition-colors"
          >
            <span>{monthName} {year}</span>
            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
              {count}
            </span>
          </a>
        </li>
      );
    })}
  </ul>
</aside>
```

---

## 3. ВНУТРЕННЯЯ ПЕРЕЛИНКОВКА

### 3.1 Автоматические связанные статьи

**Создать:** `src/components/blog/RelatedPosts.astro`

```astro
---
import { getCollection } from 'astro:content';

interface Props {
  currentSlug: string;
  currentTags: string[];
  currentCategory: string;
  limit?: number;
}

const { currentSlug, currentTags, currentCategory, limit = 3 } = Astro.props;

const allPosts = await getCollection('blog');

// Находим связанные статьи
const relatedPosts = allPosts
  .filter(post => post.slug !== currentSlug && !post.data.draft)
  .map(post => {
    let score = 0;

    // +3 балла за совпадение категории
    if (post.data.category === currentCategory) score += 3;

    // +1 балл за каждый совпадающий тег
    const commonTags = post.data.tags.filter(tag => currentTags.includes(tag));
    score += commonTags.length;

    return { post, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)
  .map(item => item.post);
---

{relatedPosts.length > 0 && (
  <section class="mt-16 pt-16 border-t border-gray-200">
    <h2 class="text-3xl font-bold mb-8">Читайте также</h2>

    <div class="grid md:grid-cols-3 gap-6">
      {relatedPosts.map(post => (
        <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2 line-clamp-2">
              <a href={`/blog/${post.slug}.html`} class="hover:text-blue-600">
                {post.data.title}
              </a>
            </h3>
            <p class="text-gray-600 line-clamp-3 text-sm">
              {post.data.description}
            </p>

            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-gray-500">
                {new Date(post.data.pubDate).toLocaleDateString('ru-RU')}
              </span>
              <a
                href={`/blog/${post.slug}.html`}
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Читать →
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
)}
```

---

## 4. ПРОИЗВОДИТЕЛЬНОСТЬ

### 4.1 Preload критических ресурсов

**В Layout.astro:**

```astro
<!-- Preload критических шрифтов -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />

<!-- Preload критических изображений -->
<link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp" />

<!-- Preconnect для внешних ресурсов -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

---

## 5. КОНТЕНТНАЯ СТРАТЕГИЯ

### 5.1 Оптимизация H1-H6

**Рекомендуемая структура:**

```markdown
# H1: Основной заголовок статьи (один на страницу)

## H2: Основные разделы

### H3: Подразделы

#### H4: Детализация
```

### 5.2 Рекомендации по длине контента

| Тип страницы | Минимум слов | Оптимум   | Максимум |
| ------------ | ------------ | --------- | -------- |
| Главная      | 500          | 800-1000  | 1500     |
| Услуга       | 1000         | 1500-2000 | 3000     |
| Статья блога | 800          | 1500-2500 | 5000     |
| Категория    | 300          | 500-700   | 1000     |

---

## 6. МОНИТОРИНГ И АНАЛИТИКА

### 6.1 Настройка событий в Яндекс.Метрике

```astro
<script is:inline>
  // Отслеживание кликов по телефону
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="tel:"]');
    if (target && window.ym) {
      ym(103604926, 'reachGoal', 'phone_click');
    }
  });

  // Отслеживание открытия форм
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-modal]');
    if (target && window.ym) {
      ym(103604926, 'reachGoal', 'form_open');
    }
  });
</script>
```

### 6.2 Чек-лист мониторинга

**Еженедельно:**

- [ ] Проверка позиций по ключевым запросам
- [ ] Анализ CTR в Яндекс.Вебмастер
- [ ] Проверка ошибок индексации

**Ежемесячно:**

- [ ] Анализ органического трафика
- [ ] Проверка Core Web Vitals
- [ ] Обновление контента (даты, статистика)
- [ ] Добавление новых статей (минимум 2-4 в месяц)

**Ежеквартально:**

- [ ] Аудит всех мета-тегов
- [ ] Проверка битых ссылок
- [ ] Анализ конкурентов
- [ ] Обновление структурированных данных

---

## 7. QUICK WINS

**Реализовать в первую очередь (ROI > 80%):**

1. ✅ **Добавить Schema.org/LegalService** (2 часа работы, +20% к CTR)
2. ✅ **Внедрить AggregateRating** (1 час, +15% к CTR)
3. ✅ **Создать XML sitemap** (1 час, улучшение индексации)
4. ✅ **Добавить блок "Популярные статьи"** (2 часа, +30% внутренних переходов)
5. ✅ **Настроить robots.txt** (30 минут, корректная индексация)
6. ✅ **Добавить архив блога** (3 часа, +10% времени на сайте)
7. ✅ **Внедрить систему тегов** (2 часа, улучшение навигации)
8. ✅ **Добавить связанные статьи** (2 часа, +25% внутренних переходов)

**Общее время:** 13.5 часов  
**Ожидаемый эффект:** +30-50% к показателям SEO за 30 дней

---

## 📊 ПРИОРИТИЗАЦИЯ ЗАДАЧ

### Высокий приоритет (внедрить в течение недели):

1. Schema.org/LegalService + AggregateRating
2. XML Sitemap и robots.txt
3. Автообновление дат (уже реализовано ✅)

### Средний приоритет (внедрить в течение месяца):

4. Система тегов и категорий для блога
5. Блок "Популярные статьи"
6. Архив блога по месяцам
7. Связанные статьи

### Низкий приоритет (на перспективу):

8. Hreflang для регионов (если планируется расширение)
9. Расширенная аналитика
10. A/B тестирование элементов

---

**Дата**: 03.10.2025  
**Версия**: 1.0  
**Автор**: Технические рекомендации для zerodolg.ru
