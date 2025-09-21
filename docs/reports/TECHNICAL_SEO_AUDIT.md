# Technical SEO Audit: ZeroDolg Astro Implementation Issues

## 1. Header Hierarchy Analysis

### 1.1. Main Page Header Structure Issues

**Current State (src/pages/index.astro):**
```astro
<Layout title="Банкротство физических лиц под ключ - ZeroDolg">
  <Header />
  
  <main>
    <Hero />     <!-- Contains H1 in component -->
    <Stats />    <!-- Contains H2 in component -->
    <Calculator /> <!-- Contains H2 in component -->
    <Benefits /> <!-- Contains H2 with H3 items -->
    <Timeline /> <!-- Contains H2 with H3-H4 sub-elements -->
    <Reviews />  <!-- Contains H2 in component -->
    <TeamInteractive /> <!-- Contains H2 in component -->
    <LeadMagnets /> <!-- Contains H2 in component -->
    <Faq />      <!-- Contains H2 in component -->
    <Cta />      <!-- Contains H2 in component -->
  </main>
  
  <Footer />
</Layout>
```

**Issues Identified:**
1. **No main H1 in page content**: The H1 is embedded within the Hero component, making it difficult for search engines to identify the main page topic
2. **Inconsistent header implementation**: Some components implement headers internally while others rely on external structure
3. **Lack of semantic flow**: The page lacks a clear semantic flow from H1 → H2 → H3

### 1.2. Recommended Header Structure Fix

**Improved Implementation:**
```astro
<Layout title="Банкротство физических лиц под ключ - ZeroDolg">
  <Header />
  
  <main>
    <section aria-labelledby="hero-heading">
      <h1 id="hero-heading" class="visually-hidden">
        Банкротство физических лиц под ключ - ZeroDolg
      </h1>
      <Hero />
    </section>
    
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" class="section__title">
        Статистика нашей работы
      </h2>
      <Stats />
    </section>
    
    <section aria-labelledby="calculator-heading">
      <h2 id="calculator-heading" class="section__title">
        Рассчитайте стоимость банкротства
      </h2>
      <Calculator />
    </section>
    
    <!-- Continue pattern for all sections -->
  </main>
  
  <Footer />
</Layout>
```

## 2. Missing SEO Infrastructure Files

### 2.1. robots.txt Implementation

**Current Status**: Missing

**Recommended robots.txt:**
```
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*?*
Allow: /api/sitemap.xml

Sitemap: https://zerodolg.ru/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Yandex
Allow: /
```

### 2.2. sitemap.xml Implementation

**Current Status**: Missing

**Recommended Dynamic Sitemap Generation (src/pages/sitemap.xml.ts):**
```typescript
import type { APIRoute } from 'astro';

const pages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/blog/', priority: 0.8, changefreq: 'weekly' },
  // Add other static pages
];

export const get: APIRoute = async () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>https://zerodolg.ru${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
```

## 3. Structured Data Implementation Issues

### 3.1. Current State
The project has minimal structured data implementation, with only basic Open Graph and Twitter Card metadata in the Layout component.

### 3.2. Recommended Enhancements

**1. Organization Schema (Layout.astro):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Центр банкротства ZeroDolg",
  "url": "https://zerodolg.ru",
  "logo": "https://zerodolg.ru/images/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+7-905-577-33-87",
    "contactType": "customer service",
    "availableLanguage": "Russian"
  },
  "sameAs": [
    "https://vk.com/zerodolg",
    "https://t.me/zerodolg"
  ]
}
</script>
```

**2. Local Business Schema (if applicable):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Центр банкротства ZeroDolg",
  "image": "https://zerodolg.ru/images/logo.png",
  "telephone": "+7-905-577-33-87",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Минская улица, 2Ж",
    "addressLocality": "Москва",
    "postalCode": "111111",
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
  }
}
</script>
```

**3. Article Schema (for blog posts):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Основы банкротства физических лиц в 2024 году",
  "description": "Подробное руководство по процедуре банкротства физических лиц: условия, этапы, документы",
  "author": {
    "@type": "Person",
    "name": "Масхулиа Л.З."
  },
  "publisher": {
    "@type": "Organization",
    "name": "Центр банкротства ZeroDolg",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zerodolg.ru/images/logo.png"
    }
  },
  "datePublished": "2024-01-20",
  "dateModified": "2024-01-20"
}
</script>
```

## 4. Meta Tag Enhancement Opportunities

### 4.1. Current Implementation Issues
The Layout component has basic meta tags but lacks several important elements:

1. **Missing canonical URLs**
2. **No hreflang tags**
3. **Limited robots meta tags**
4. **No mobile-specific meta tags**

### 4.2. Recommended Meta Tag Enhancements

**Enhanced Layout.astro meta tags:**
```astro
<!-- Canonical URL -->
{canonical && <link rel="canonical" href={canonical} />}

<!-- Hreflang tags (if multilingual) -->
{hreflang && Object.entries(hreflang).map(([lang, url]) => (
  <link rel="alternate" hreflang={lang} href={url} />
))}

<!-- Mobile-specific meta tags -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#2563eb" />

<!-- Enhanced robots meta tags -->
{noindex && <meta name="robots" content="noindex, nofollow" />}
{robots && <meta name="robots" content={robots} />}

<!-- Additional social media meta tags -->
<meta property="og:locale" content="ru_RU" />
<meta property="og:site_name" content="Центр банкротства ZeroDolg" />
<meta name="twitter:site" content="@zerodolg" />
<meta name="twitter:creator" content="@zerodolg" />

<!-- Favicon and PWA meta tags -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
```

## 5. Content Optimization Issues

### 5.1. Alt Text Improvements Needed

**Current Issues:**
- Some images lack descriptive alt attributes
- Generic alt text like "image" or "photo" used
- Missing alt text for decorative images

**Recommendations:**
1. Ensure all informative images have descriptive alt text
2. Use empty alt attributes (`alt=""`) for decorative images
3. Implement alt text for team member photos with professional details
4. Add alt text for icon images with functional descriptions

### 5.2. Internal Linking Opportunities

**Current Issues:**
- Limited internal linking between related content
- Blog posts don't link to relevant service pages
- Service pages don't cross-reference related services

**Recommendations:**
1. Add contextual links from blog posts to relevant service pages
2. Create service page interlinking for related bankruptcy procedures
3. Link FAQ answers to detailed service explanations
4. Add related content sections to blog posts

## 6. Technical Implementation Recommendations

### 6.1. Performance Optimization for SEO

**Current Issues:**
- Large CSS files without critical path optimization
- Potential render-blocking resources
- Missing lazy loading for non-critical images

**Recommendations:**
1. Implement critical CSS extraction for above-the-fold content
2. Add `loading="lazy"` to non-critical images
3. Optimize font loading with `font-display: swap`
4. Implement resource hints (preconnect, prefetch, preload)

### 6.2. Accessibility Enhancements for SEO

**Current Issues:**
- Some components lack proper ARIA attributes
- Limited skip navigation functionality
- Insufficient focus management

**Recommendations:**
1. Add skip navigation links
2. Implement proper ARIA landmarks
3. Ensure all interactive elements are keyboard accessible
4. Add proper focus indicators

## 7. Implementation Priority Matrix

### High Priority (Immediate - 1-2 weeks)
1. Create robots.txt and sitemap.xml files
2. Implement canonical URL system
3. Add organization schema markup
4. Fix header hierarchy issues
5. Enhance meta tag implementation

### Medium Priority (2-4 weeks)
1. Add local business schema markup
2. Implement article schema for blog posts
3. Improve alt text for all images
4. Add internal linking strategy
5. Optimize critical CSS

### Low Priority (1-3 months)
1. Implement hreflang tags (if multilingual)
2. Add advanced structured data (FAQ, HowTo, etc.)
3. Implement comprehensive internal linking
4. Add advanced performance optimizations
5. Implement comprehensive accessibility enhancements

## 8. Monitoring and Maintenance

### 8.1. SEO Monitoring Tools
1. Google Search Console
2. Yandex.Webmaster
3. Bing Webmaster Tools
4. Ahrefs or SEMrush for competitive analysis

### 8.2. Regular Maintenance Tasks
1. Monthly sitemap updates
2. Quarterly content audits
3. Biannual technical SEO audits
4. Annual structured data validation

## Conclusion

The ZeroDolg Astro website has a solid technical foundation but requires several critical SEO improvements to maximize search visibility. Addressing the missing infrastructure files, header hierarchy issues, and structured data implementation will significantly improve the site's search engine performance.

The recommended implementation approach prioritizes critical issues first, followed by enhancements that will provide long-term SEO benefits. Regular monitoring and maintenance will ensure continued SEO success.