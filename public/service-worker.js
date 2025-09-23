// Service Worker for ZeroDolg.ru - Offline Support and Caching

const CACHE_NAME = 'zerodolg-v1.0.0';
const STATIC_CACHE_NAME = 'zerodolg-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'zerodolg-dynamic-v1.0.0';

// URLs to cache on install (critical assets)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.svg',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/manifest.json',
  // Critical images
  '/images/logo.svg',
  '/images/logo-white.svg',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing service worker...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] All static assets cached successfully');
      })
      .catch((error) => {
        console.warn('[Service Worker] Failed to cache some static assets:', error);
        // Continue installation even if some assets fail to cache
      })
  );

  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME &&
            cacheName.startsWith('zerodolg')
          ) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Claim clients to activate the service worker for all pages
  return self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and requests to other origins
  if (event.request.method !== 'GET') {
    return;
  }

  // For same-origin requests, implement cache-then-network strategy
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            console.log('[Service Worker] Serving cached response for:', event.request.url);
            return cachedResponse;
          }

          // Clone the request for network fetch
          const fetchRequest = event.request.clone();

          // Fetch from network
          return fetch(fetchRequest)
            .then((response) => {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response for caching
              const responseToCache = response.clone();

              // Cache the response
              caches
                .open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  console.log('[Service Worker] Caching new response for:', event.request.url);
                  cache.put(event.request, responseToCache);
                })
                .catch((error) => {
                  console.warn('[Service Worker] Failed to cache response:', error);
                });

              return response;
            })
            .catch((error) => {
              console.warn('[Service Worker] Network fetch failed:', error);
              // Return a fallback page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches
                  .match('/offline.html')
                  .catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }));
              }
              // For other requests, re-throw the error
              throw error;
            });
        })
        .catch((error) => {
          console.warn('[Service Worker] Cache lookup failed:', error);
          // If cache lookup fails, try network directly
          return fetch(event.request).catch(() => {
            // If network also fails and it's a navigation request, return offline page
            if (event.request.mode === 'navigate') {
              return caches
                .match('/offline.html')
                .catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }));
            }
          });
        })
    );
  }
});

// Message event - handle communication from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push event - handle push notifications (if implemented)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');

  // Extract data from the push message
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  // Show notification
  const title = data.title || 'ZeroDolg Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
    tag: data.tag || 'zerodolg-notification',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received');

  event.notification.close();

  // Open the URL associated with the notification
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

// Sync event - handle background sync (if implemented)
self.addEventListener('sync', (event) => {
  if (event.tag === 'zerodolg-background-sync') {
    event.waitUntil(
      // Perform background sync tasks here
      performBackgroundSync()
    );
  }
});

// Function to perform background sync tasks
async function performBackgroundSync() {
  console.log('[Service Worker] Performing background sync');
  // Add background sync logic here if needed
}
