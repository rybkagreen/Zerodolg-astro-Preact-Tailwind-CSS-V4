export default defineConfig({
  site: 'https://zerodolg.ru',
  integrations: [
    preact(),
    mcp(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api'],
        },
      ],
    }),
  ],
