// sitemap.xml.ts - Обновленная карта сайта с реструктуризацией
import type { APIRoute } from 'astro';

const SITE_URL = 'https://zerodolg.ru';

// Статические страницы
const staticPages = [
  {
    url: '',
    lastmod: '2024-10-01',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    url: '/restrukturizaciya-dolgov',
    lastmod: '2024-10-01',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    url: '/bankrotstvo-s-sokhraneniyem-imushchestva',
    lastmod: '2024-10-01',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    url: '/stoimost-bankrotstva-fizicheskikh-lits',
    lastmod: '2024-10-01',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    url: '/bankrotstvo-cherez-arbitrazh',
    lastmod: '2024-10-01',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    url: '/privacy',
    lastmod: '2024-10-01',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    url: '/terms',
    lastmod: '2024-10-01',
    changefreq: 'yearly',
    priority: '0.3',
  },
];

// Blog страницы
const blogPages = [
  {
    url: '/blog',
    lastmod: '2024-10-01',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    url: '/blog/restructuring-vs-bankruptcy',
    lastmod: '2024-10-01',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    url: '/blog/bankruptcy-guide',
    lastmod: '2024-09-15',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    url: '/blog/bankruptcy-consequences',
    lastmod: '2024-09-01',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    url: '/blog/bankruptcy-through-mfc',
    lastmod: '2024-08-15',
    changefreq: 'monthly',
    priority: '0.5',
  },
];

function generateSitemap(): string {
  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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

  return sitemap;
}

export const GET: APIRoute = () => {
  const sitemap = generateSitemap();

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // 24 часа
    },
  });
};
