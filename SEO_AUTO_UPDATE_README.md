# 📅 Автоматическое обновление дат в SEO-метаданных

## Обзор

Реализована система автоматического обновления года и месяца в Title, Description и Keywords для всех страниц сайта zerodolg.ru.

**Преимущества:**

- ✅ Всегда актуальные даты без ручного обновления
- ✅ Улучшение SEO-показателей (актуальность контента)
- ✅ Централизованное управление через конфиг
- ✅ TypeScript поддержка с типизацией

## Структура файлов

```
src/
├── shared/
│   ├── config/
│   │   └── seo-config.ts          # Централизованный SEO-конфиг
│   └── utils/
│       └── date-helpers.ts        # Утилиты для работы с датами
└── pages/
    ├── index.astro                # Главная страница
    ├── blog/
    │   └── index.astro            # Страница блога
    └── restrukturizaciya-dolgov.astro  # Реструктуризация
```

## Использование

### 1. Использование SEO-конфига (рекомендуется)

**Пример для главной страницы (`src/pages/index.astro`):**

```astro
---
import Layout from '@app/layouts/Layout.astro';
import { SEO_CONFIG } from '@shared/config/seo-config';

const { title, description, keywords, canonical } = SEO_CONFIG.home;
---

<Layout
  title={title}
  description={description}
  keywords={keywords}
  canonical={canonical}
>
  <!-- Контент страницы -->
</Layout>
```

**Результат:**

- Title: `Банкротство физических лиц Москва: списание долгов 2025 | ZeroDolg`
- Год обновляется автоматически каждый 1 января

### 2. Прямое использование утилит

**Пример для кастомной страницы:**

```astro
---
import Layout from '@app/layouts/Layout.astro';
import { getCurrentYear, getCurrentMonthGenitive } from '@shared/utils/date-helpers';

const currentYear = getCurrentYear(); // 2025
const monthGenitive = getCurrentMonthGenitive(); // "октября"

const pageTitle = `Моя страница ${currentYear} | ZeroDolg`;
const pageDescription = `Обновлено в ${monthGenitive} ${currentYear}`;
---

<Layout title={pageTitle} description={pageDescription}>
  <!-- Контент -->
</Layout>
```

### 3. Для страницы блога

**Файл: `src/pages/blog/index.astro`**

```astro
---
import { SEO_CONFIG } from '@shared/config/seo-config';
import { getCurrentMonthYear } from '@shared/utils/date-helpers';

const { title, description, keywords, canonical } = SEO_CONFIG.blog;
const currentMonth = getCurrentMonthYear(); // "октябрь 2025"
---

<Layout title={title} description={description} keywords={keywords} canonical={canonical}>
  <main>
    <div class="hero">
      <h1>Блог о банкротстве</h1>
      <p>Обновлено в {currentMonth}</p>
    </div>
  </main>
</Layout>
```

### 4. Для отдельных статей блога

**Файл: `src/pages/blog/[slug].astro`**

```astro
---
import { getBlogArticleTitle, generateDescriptionFromContent } from '@shared/config/seo-config';

const post = await getPost(Astro.params.slug);

const pageTitle = getBlogArticleTitle(post.title);
const pageDescription = post.description || generateDescriptionFromContent(post.content);
---

<Layout
  title={pageTitle}
  description={pageDescription}
  type="article"
>
  <!-- Статья -->
</Layout>
```

## Доступные утилиты

### 📅 Функции для работы с датами

```typescript
import {
  getCurrentYear,           // Текущий год (2025)
  getCurrentMonth,          // Месяц именительный ("октябрь")
  getCurrentMonthGenitive,  // Месяц родительный ("октября")
  getCurrentMonthYear,      // "октябрь 2025"
  getCurrentMonthShort,     // "окт"
  getCurrentQuarter,        // Квартал (4)
  getCurrentSeason,         // Сезон ("осень")
  formatDate,               // "03.10.2025"
  getDailyCacheKey,         // "20251003"
} from '@shared/utils/date-helpers';
```

### 📊 SEO-конфигурация

```typescript
import {
  SEO_CONFIG,              // Конфиг для всех страниц
  SITE_CONFIG,             // Базовая информация о сайте
  OG_CONFIG,               // Open Graph настройки
  SCHEMA_CONFIG,           // Schema.org разметка
  getBlogArticleTitle,     // Генератор Title для статей
  generateDescriptionFromContent,  // Генератор Description
  getCanonicalUrl,         // Генератор canonical URL
} from '@shared/config/seo-config';
```

## Примеры использования в разных случаях

### Пример 1: Динамический текст с датой

```astro
---
import { getCurrentYear, getCurrentMonthGenitive } from '@shared/utils/date-helpers';
---

<section>
  <h2>Актуальные услуги {getCurrentYear()} года</h2>
  <p>Информация обновлена в {getCurrentMonthGenitive()} {getCurrentYear()}</p>
</section>
```

### Пример 2: Сезонные предложения

```astro
---
import { getCurrentSeason, getCurrentYear } from '@shared/utils/date-helpers';

const season = getCurrentSeason(); // "осень"
const year = getCurrentYear();     // 2025
---

<div class="promo">
  <h3>Специальное предложение {season} {year}</h3>
</div>
```

### Пример 3: Квартальные отчеты

```astro
---
import { getCurrentQuarter, getCurrentYear } from '@shared/utils/date-helpers';

const quarter = getCurrentQuarter(); // 4
const year = getCurrentYear();       // 2025
---

<section>
  <h2>Статистика за {quarter} квартал {year} года</h2>
</section>
```

## Проверка работы

### Тест 1: Проверка утилит

```typescript
// В консоли браузера или Node.js
import { getCurrentYear, getCurrentMonthYear } from '@shared/utils/date-helpers';

console.log(getCurrentYear());      // 2025
console.log(getCurrentMonthYear()); // "октябрь 2025"
```

### Тест 2: Проверка SEO-конфига

```typescript
import { SEO_CONFIG } from '@shared/config/seo-config';

console.log(SEO_CONFIG.home.title);
// "Банкротство физических лиц Москва: списание долгов 2025 | ZeroDolg"

console.log(SEO_CONFIG.blog.description);
// "Практические статьи... ⚡ Обновлено в октября 2025"
```

### Тест 3: Проверка в HTML

После сборки проекта откройте `view-source:` любой страницы и найдите:

```html
<title>Банкротство физических лиц Москва: списание долгов 2025 | ZeroDolg</title>
<meta name="description" content="...Обновлено в октября 2025">
```

## Обновление контента

### Когда обновляются даты?

| Что обновляется | Когда                     | Автоматически? |
| --------------- | ------------------------- | -------------- |
| **Год**         | 1 января каждого года     | ✅ Да          |
| **Месяц**       | 1-го числа каждого месяца | ✅ Да          |
| **Квартал**     | 1-го числа квартала       | ✅ Да          |
| **Сезон**       | По календарным сезонам    | ✅ Да          |

### Как это работает?

1. При сборке проекта (`npm run build`) все даты вычисляются
2. Генерируется статический HTML с актуальными датами
3. Даты "запекаются" в HTML до следующей сборки

**Важно:** Для обновления дат на продакшене нужно:

- Пересобрать проект: `npm run build`
- Задеплоить новую версию

### Автоматизация обновлений

**Рекомендуется настроить автоматическую пересборку:**

#### Вариант 1: GitHub Actions (ежемесячно)

```yaml
# .github/workflows/monthly-rebuild.yml
name: Monthly SEO Update

on:
  schedule:
    - cron: '0 0 1 * *'  # 1-го числа каждого месяца в 00:00
  workflow_dispatch:      # Ручной запуск

jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy
        run: |
          # Ваш скрипт деплоя
```

#### Вариант 2: Cron на сервере

```bash
# Добавить в crontab
0 0 1 * * cd /var/www/zerodolg.ru && npm run build && systemctl reload nginx
```

#### Вариант 3: Vercel/Netlify (Webhook)

Настройте webhook для ежемесячной пересборки через сервис типа [cron-job.org](https://cron-job.org/).

## Миграция существующих страниц

### Шаг 1: Определить текущие Title

```bash
# Найти все статичные годы в проекте
grep -r "2024\|2025" src/pages/**/*.astro | grep -i "title\|description"
```

### Шаг 2: Заменить статичные даты

**Было:**

```astro
---
const pageTitle = 'Банкротство физлиц 2024 | ZeroDolg';
---
```

**Стало:**

```astro
---
import { getCurrentYear } from '@shared/utils/date-helpers';
const pageTitle = `Банкротство физлиц ${getCurrentYear()} | ZeroDolg`;
---
```

### Шаг 3: Использовать SEO-конфиг

**Еще лучше:**

```astro
---
import { SEO_CONFIG } from '@shared/config/seo-config';
const { title, description } = SEO_CONFIG.home;
---
```

## FAQ

### Q: Нужно ли вручную обновлять даты?

**A:** Нет! Даты обновляются автоматически при каждой сборке проекта.

### Q: Как часто нужно пересобирать проект?

**A:** Рекомендуется раз в месяц для обновления месяца в descriptions. Год обновится автоматически 1 января.

### Q: Можно ли использовать для динамических страниц (SSR)?

**A:** Да! При SSR даты будут обновляться при каждом запросе автоматически.

### Q: Влияет ли на производительность?

**A:** Нет. Вычисление даты — очень быстрая операция (< 1мс). Для SSG все вычисляется один раз при сборке.

### Q: Как добавить новую страницу с автообновлением?

**A:**

1. Добавьте конфигурацию в `SEO_CONFIG` в файле `seo-config.ts`
2. Используйте `SEO_CONFIG.yourPage` в компоненте страницы

### Q: Можно ли кастомизировать формат даты?

**A:** Да! Создайте свою функцию в `date-helpers.ts`:

```typescript
export const getCustomFormat = (): string => {
  return new Date().toLocaleString('ru-RU', {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  });
};
```

## Чеклист внедрения

- [ ] Создан файл `src/shared/utils/date-helpers.ts`
- [ ] Создан файл `src/shared/config/seo-config.ts`
- [ ] Обновлена главная страница (`index.astro`)
- [ ] Обновлена страница блога (`blog/index.astro`)
- [ ] Обновлена страница реструктуризации
- [ ] Проверены все Title в исходном коде HTML
- [ ] Настроен автоматический rebuild (опционально)
- [ ] Запрошен переобход в Яндекс.Вебмастер

## Полезные ссылки

- [Отчет по SEO-оптимизации](./SEO_META_TITLES_REPORT.md)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
- [Google Search Console](https://search.google.com/search-console)

---

**Версия**: 1.0  
**Дата**: 03.10.2025  
**Автор**: Разработка для zerodolg.ru
