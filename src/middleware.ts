import type { APIContext } from 'astro';

// Middleware for caching, security headers and performance
export async function onRequest(
  context: APIContext,
  next: () => Promise<Response>
): Promise<Response> {
  const response = await next();

  // Check if we're in development mode
  const isDev = import.meta.env.DEV || context.url.hostname === 'localhost';

  // Set cache control headers for static assets
  if (context.request.url.includes('/assets/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (response.headers.get('content-type')?.includes('text/html')) {
    // Short cache for HTML pages
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  } else {
    // Default cache for other resources
    response.headers.set('Cache-Control', 'public, max-age=86400');
  }

  // Set security headers
  // В dev режиме добавляем unsafe-eval для zod и других библиотек разработки
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru https://cdn.jsdelivr.net https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru; "
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru https://cdn.jsdelivr.net https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru; ";

  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; ${scriptSrc}style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' ws://localhost:* wss://localhost:* https://www.google-analytics.com https://region1.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru wss://mc.yandex.ru https://zerodolg.bitrix24.ru; frame-src 'self' https://www.google.com https://www.googletagmanager.com https://yandex.ru https://mc.yandex.ru https://*.yandex.ru https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`
  );

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}
