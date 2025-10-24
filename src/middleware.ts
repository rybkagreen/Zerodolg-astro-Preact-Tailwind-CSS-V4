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

  // Set security headers - skip CSP for production since nginx handles it
  // В dev режиме добавляем unsafe-eval для zod и других библиотек разработки
  if (isDev) {
    // Development CSP with additional domains for reCaptcha and extended yandex services
    const scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://mc.yandex.com https://yandex.ru https://yandex.com https://*.yandex.ru https://*.yandex.com https://cdn.jsdelivr.net https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru https://apis.google.com https://googleapis.com https://recaptcha.net; ";
    response.headers.set(
      'Content-Security-Policy',
      `default-src 'self'; ${scriptSrc}style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' ws://localhost:* wss://localhost:* https://www.google-analytics.com https://region1.google-analytics.com https://mc.yandex.ru https://mc.yandex.com https://yandex.ru https://yandex.com https://*.yandex.ru https://*.yandex.com wss://mc.yandex.ru wss://mc.yandex.com https://zerodolg.bitrix24.ru https://www.google.com https://www.gstatic.com https://apis.google.com https://googleapis.com https://recaptcha.net; frame-src 'self' https://www.google.com https://www.googletagmanager.com https://yandex.ru https://yandex.com https://mc.yandex.ru https://mc.yandex.com https://*.yandex.ru https://*.yandex.com https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru https://recaptcha.net; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`
    );
  } else {
    // Production CSP - aligned with nginx configuration for consistency
    const scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://mc.yandex.com https://yandex.ru https://yandex.com https://*.yandex.ru https://*.yandex.com https://cdn.jsdelivr.net https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru https://apis.google.com https://googleapis.com https://recaptcha.net; ";
    response.headers.set(
      'Content-Security-Policy',
      `default-src 'self'; ${scriptSrc}style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://mc.yandex.ru https://mc.yandex.com https://yandex.ru https://yandex.com https://*.yandex.ru https://*.yandex.com wss://mc.yandex.ru wss://mc.yandex.com https://zerodolg.bitrix24.ru https://www.google.com https://www.gstatic.com https://apis.google.com https://googleapis.com https://recaptcha.net; frame-src 'self' https://www.google.com https://www.googletagmanager.com https://yandex.ru https://yandex.com https://mc.yandex.ru https://mc.yandex.com https://*.yandex.ru https://*.yandex.com https://cdn.bitrix24.ru https://cdn-ru.bitrix24.ru https://recaptcha.net; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`
    );
  }

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}
