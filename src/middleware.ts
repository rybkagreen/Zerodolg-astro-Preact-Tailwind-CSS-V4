// Middleware for caching, security headers and performance
export async function onRequest({ request }, next) {
  const response = await next();
  
  // Set cache control headers for static assets
  if (request.url.includes('/assets/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (response.headers.get('content-type')?.includes('text/html')) {
    // Short cache for HTML pages
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  } else {
    // Default cache for other resources
    response.headers.set('Cache-Control', 'public, max-age=86400');
  }
  
  // Set security headers
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "connect-src 'self' https://www.google-analytics.com; " +
    "frame-src 'self' https://www.google.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests;"
  );
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}