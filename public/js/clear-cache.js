// Clear Cache Script for Development
// This script clears all caches and service workers for fresh development experience

console.log('[Cache Clear] Starting cache cleanup...');

// Clear all caches
if ('caches' in window) {
  caches
    .keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Cache Clear] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      console.log('[Cache Clear] All caches cleared');
    })
    .catch((error) => {
      console.error('[Cache Clear] Error clearing caches:', error);
    });
}

// Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        console.log('[Cache Clear] Unregistering service worker:', registration.scope);
        registration.unregister();
      });
    })
    .catch((error) => {
      console.error('[Cache Clear] Error unregistering service workers:', error);
    });
}

// Clear localStorage and sessionStorage
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log('[Cache Clear] Local and session storage cleared');
} catch (error) {
  console.error('[Cache Clear] Error clearing storage:', error);
}

// Force reload after cleanup
setTimeout(() => {
  console.log('[Cache Clear] Performing hard refresh...');
  window.location.reload(true);
}, 1000);
