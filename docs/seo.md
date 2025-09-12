# Руководство по SEO

## Общая информация

Это руководство описывает подход к поисковой оптимизации (SEO) проекта ZeroDolg Astro, включая технические аспекты, контентную оптимизацию и лучшие практики.

## Техническое SEO

### Структура URL
- **Человекочитаемые URL**: Использование понятных названий страниц
- **Иерархическая структура**: Логическая организация страниц
- **Канонические URL**: Предотвращение дубликатов контента
- **301 редиректы**: Правильная переадресация при изменении URL

### Структура страниц
```astro
---
// src/layouts/Layout.astro - базовый макет с SEO элементами
import { getTranslation } from '../i18n/index.js';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

const { 
  title = 'Банкротство физических лиц под ключ - ZeroDolg',
  description = 'Профессиональная помощь в процедуре банкротства физических лиц. Полное списание долгов, защита имущества, юридическое сопровождение.',
  image = '/images/og-image.jpg',
  canonical,
  noindex = false
} = Astro.props;
---

<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Основные мета-теги -->
    <title>{title}</title>
    <meta name="description" content={description} />
    
    <!-- Канонический URL -->
    {canonical && <link rel="canonical" href={canonical} />}
    
    <!-- Noindex для страниц, которые не нужно индексировать -->
    {noindex && <meta name="robots" content="noindex, nofollow" />}
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`https://zerodolg.ru${Astro.url.pathname}`} />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    <!-- Структурированные данные -->
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LegalService",
        "name": "Центр банкротства ZeroDolg",
        "description": description,
        "url": "https://zerodolg.ru",
        "logo": "https://zerodolg.ru/images/logo.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "ул. Примерная, 123",
          "addressLocality": "Москва",
          "postalCode": "123456",
          "addressCountry": "RU"
        },
        "telephone": "+7 (495) 123-45-67",
        "openingHours": "Mo-Fr 09:00-18:00"
      })}
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Sitemap.xml
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://zerodolg.ru/</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://zerodolg.ru/blog/</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... другие страницы -->
</urlset>
```

### Robots.txt
```
# public/robots.txt
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Sitemap: https://zerodolg.ru/sitemap.xml

# Разрешаем всем роботам индексировать сайт
User-agent: *
Allow: /
```

## Контентное SEO

### Заголовки (H1-H6)
- **H1**: Один уникальный заголовок на страницу
- **H2-H6**: Логическая структура контента
- **Ключевые слова**: Естественное включение в заголовки
- **Длина**: H1 - до 70 символов, H2-H6 - до 100 символов

### Мета-описания
```astro
---
// Пример мета-описания для страницы услуг
const serviceDescription = "Полное списание долгов по банкротству физических лиц. Юридическое сопровождение, защита имущества, минимальные расходы. Бесплатная консультация.";
---

<meta name="description" content={serviceDescription} />
```

### Alt-атрибуты изображений
```html
<!-- Хорошо -->
<img src="/images/bankruptcy-process.jpg" 
     alt="Процесс банкротства физических лиц: от подачи заявления до списания долгов" 
     loading="lazy">

<!-- Плохо -->
<img src="/images/bankruptcy-process.jpg" alt="банкротство">
```

### Внутренние ссылки
- **Релевантность**: Ссылки на связанные страницы
- **Анкоры**: Описательные тексты ссылок
- **Структура**: Логическая навигация между страницами

## Локальное SEO

### Структурированные данные
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Центр банкротства ZeroDolg",
  "image": "https://zerodolg.ru/images/logo.png",
  "telephone": "+7 (495) 123-45-67",
  "email": "info@zerodolg.ru",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Примерная, 123",
    "addressLocality": "Москва",
    "postalCode": "123456",
    "addressCountry": "RU"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "priceRange": "₽₽",
  "areaServed": "Москва и Московская область"
}
```

### Локальные страницы
- Создание страниц для разных регионов
- Использование геотаргетинга в контенте
- Получение локальных отзывов

## Мобильное SEO

### Адаптивный дизайн
- **Mobile-first**: Дизайн сначала для мобильных устройств
- **Touch-friendly**: Оптимизация для сенсорного управления
- **Скорость загрузки**: Оптимизация для мобильных сетей

### AMP (Accelerated Mobile Pages)
Рассмотреть возможность создания AMP версий для ключевых страниц.

## Отслеживание и аналитика

### Google Analytics
```javascript
// public/js/analytics.js
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');

// Отслеживание событий
document.addEventListener('click', function(e) {
  if (e.target.matches('[data-analytics]')) {
    gtag('event', 'click', {
      event_category: 'engagement',
      event_label: e.target.dataset.analytics
    });
  }
});
```

### Яндекс.Метрика
```javascript
// public/js/yandex-metrica.js
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(YANDEX_METRIKA_ID, "init", {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});
```

### Search Console
- Регулярный мониторинг ошибок
- Анализ поисковых запросов
- Отслеживание индексации страниц

## Контентная стратегия

### Блог
- **Регулярные публикации**: 1-2 статьи в неделю
- **Ключевые темы**: банкротство, долги, законодательство
- **SEO-оптимизация**: ключевые слова, внутренние ссылки
- **Пользовательская ценность**: практическая польза

### Длинный контент
- **Глубокие руководства**: подробные статьи по ключевым темам
- **Чек-листы**: практические материалы
- **Кейсы**: реальные истории клиентов

### Микроконтент
- **FAQ**: ответы на частые вопросы
- **Определения**: объяснения терминов
- **Советы**: краткие рекомендации

## Лучшие практики

### Технические аспекты
- [ ] Правильная структура заголовков
- [ ] Уникальные мета-теги для каждой страницы
- [ ] Быстрая загрузка страниц (< 3 секунды)
- [ ] Мобильная оптимизация
- [ ] Безопасное соединение (HTTPS)
- [ ] Структурированные данные
- [ ] XML Sitemap
- [ ] Robots.txt

### Контентные аспекты
- [ ] Уникальный и ценный контент
- [ ] Правильное использование ключевых слов
- [ ] Внутренние ссылки
- [ ] Альтернативный текст для изображений
- [ ] Читаемые URL
- [ ] Описание для каждого изображения
- [ ] Регулярное обновление контента

### Локальное SEO
- [ ] Локальные бизнес-карточки
- [ ] Отзывы клиентов
- [ ] Локальные ключевые слова
- [ ] Геотаргетинг контента
- [ ] Локальные ссылки

## Инструменты SEO

### Анализ
- **Google Search Console**: мониторинг индексации и ошибок
- **Ahrefs**: анализ обратных ссылок и ключевых слов
- **SEMrush**: комплексный SEO аудит
- **Moz**: анализ доменного авторитета

### Тестирование
- **Google PageSpeed Insights**: анализ скорости загрузки
- **GTmetrix**: детальный анализ производительности
- **Lighthouse**: аудит качества веб-приложений

### Мониторинг
- **Google Alerts**: отслеживание упоминаний бренда
- **Mention**: мониторинг в социальных сетях
- **Rank Tracker**: отслеживание позиций в поиске

## Регулярные задачи

### Еженедельные
- Проверка новых страниц в Search Console
- Анализ трафика и поведения пользователей
- Мониторинг позиций по ключевым запросам

### Ежемесячные
- Аудит технического SEO
- Анализ обратных ссылок
- Обновление контента
- Проверка скорости загрузки

### Ежеквартальные
- Полный SEO аудит
- Анализ конкурентов
- Обновление стратегии
- Отчет по результатам

## Проблемы и решения

### Частые SEO проблемы

#### Дублированный контент
**Решение**:
- Использование канонических URL
- Правильная настройка 301 редиректов
- Уникальные мета-теги для каждой страницы

#### Медленная загрузка страниц
**Решение**:
- Оптимизация изображений
- Минификация CSS и JavaScript
- Использование CDN
- Ленивая загрузка

#### Отсутствие мобильной оптимизации
**Решение**:
- Адаптивный дизайн
- Тестирование на мобильных устройствах
- Оптимизация touch элементов

## Контакты

Для вопросов по SEO обращайтесь: [seo@zerodolg.ru]

Для предложений по улучшению: [marketing@zerodolg.ru]