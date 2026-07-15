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
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru https://www.google.com https://www.gstatic.com; "
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru https://www.google.com https://www.gstatic.com; ";

  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; ${scriptSrc}style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' ws://localhost:* wss://localhost:* https://www.google-analytics.com https://region1.google-analytics.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru wss://mc.yandex.ru https://zerodolg.bitrix24.ru https://www.google.com; frame-src 'self' https://www.google.com https://www.googletagmanager.com https://yandex.ru https://*.yandex.ru; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`
  );

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}
