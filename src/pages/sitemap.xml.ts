// sitemap.xml.ts - Динамическая карта сайта с автогенерацией из блога
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

const SITE_URL = 'https://zerodolg.ru';

export const GET: APIRoute = async () => {
  // Получаем все статьи блога динамически
  const posts = await getCollection('blog');

  // Статические страницы с приоритетами
  const staticPages = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/blog/',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/restrukturizaciya-dolgov/',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/bankrotstvo-s-sokhraneniyem-imushchestva/',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/privacy/',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/terms/',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: new Date().toISOString().split('T')[0],
    },
  ];

  // Динамические страницы (статьи блога)
  const blogPages = posts
    .filter((post: CollectionEntry<'blog'>) => !post.data.draft) // Исключаем черновики
    .map((post: CollectionEntry<'blog'>) => ({
      url: `/blog/${post.slug}/`,
      changefreq: 'monthly',
      priority: post.data.featured ? '0.8' : '0.7', // Популярные статьи имеют больший приоритет
      lastmod: (post.data.updatedDate || post.data.pubDate).toISOString().split('T')[0],
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
    <lastmod>${page.lastmod}</lastmod>
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
