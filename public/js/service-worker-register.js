// Service Worker Registration Script for ZeroDolg.ru

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register the service worker
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('[Service Worker] Registration successful with scope:', registration.scope);
        
        // Check for updates
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              console.log('[Service Worker] New worker state:', newWorker.state);
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                console.log('[Service Worker] New content is available; please refresh.');
                // Optionally show a notification to the user
                showUpdateNotification();
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
  
  // Listen for controlling service worker changes
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
}

// Function to show update notification
function showUpdateNotification() {
  // Create a simple notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2563eb;
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
      <span>Доступно обновление контента</span>
      <button id="refresh-btn" style="
        background: white;
        color: #2563eb;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        font-size: 12px;
      ">Обновить</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add click event to refresh button
  const refreshBtn = notification.querySelector('#refresh-btn');
  refreshBtn.addEventListener('click', () => {
    // Send message to service worker to skip waiting
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  });
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
}