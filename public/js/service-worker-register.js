// Service Worker Removal Script for ZeroDolg.ru
// This script unregisters any existing service workers

console.log('[Service Worker] Attempting to unregister existing service workers...');

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Get all registered service workers
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (registrations.length === 0) {
        console.log('[Service Worker] No service workers found to unregister.');
        return;
      }

      // Unregister all service workers
      const unregisterPromises = registrations.map(async (registration) => {
        console.log('[Service Worker] Unregistering:', registration.scope);
        return await registration.unregister();
      });

      const results = await Promise.all(unregisterPromises);
      const successCount = results.filter(Boolean).length;

      console.log(`[Service Worker] Successfully unregistered ${successCount} service worker(s).`);

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        if (cacheNames.length > 0) {
          console.log('[Service Worker] Clearing caches:', cacheNames);
          const deletePromises = cacheNames.map((cacheName) => caches.delete(cacheName));
          await Promise.all(deletePromises);
          console.log('[Service Worker] All caches cleared.');
        }
      }

      // Show notification that service worker has been disabled
      if (successCount > 0) {
        showRemovalNotification();
      }
    } catch (error) {
      console.error('[Service Worker] Error during unregistration:', error);
    }
  });
}

// Function to show removal notification
function showRemovalNotification() {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #dc2626;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;

  notification.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
      <span>Service Worker отключен</span>
      <button id="close-btn" style="
        background: white;
        color: #dc2626;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        font-size: 12px;
      ">OK</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Add click event to close button
  const closeBtn = notification.querySelector('#close-btn');
  closeBtn.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}
