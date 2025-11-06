/**
 * Webvisor Consent Handler
 * Handles Yandex.Metrica Webvisor initialization with proper consent management
 */

import { consentManager } from '../../shared/lib/consent-manager';

/**
 * Initialize Webvisor only after user consent is given
 */
export function initWebvisorWithConsent(): void {
  // Check if user has given consent for analytics
  if (!consentManager.hasAnalyticsConsent()) {
    console.log('Webvisor not initialized - no user consent');
    // Set up listener for when consent is granted
    setupConsentListener();
    return;
  }

  // Initialize Webvisor with consent
  initializeWebvisor();
}

/**
 * Set up listener for consent changes
 */
function setupConsentListener(): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('consent-changed', (event: Event) => {
      // Type assertion for CustomEvent
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.status === 'granted') {
        console.log('Consent granted, initializing Webvisor');
        // Reinitialize consent manager to ensure latest state
        import('../../shared/lib/consent-manager')
          .then(({ consentManager }) => {
            if (consentManager.hasAnalyticsConsent()) {
              initializeWebvisor();
            }
          })
          .catch((error) => {
            console.error('Failed to import consent-manager:', error);
          });
      }
    });
  }
}

/**
 * Initialize the actual Webvisor functionality
 */
function initializeWebvisor(): void {
  if (typeof window === 'undefined') return;

  const YM_ID = import.meta.env['PUBLIC_YM_ID'];
  if (!YM_ID) {
    console.log('Yandex Metrika ID not configured');
    return;
  }

  // Check if Yandex Metrika is available
  if (typeof window.ym === 'undefined') {
    console.log('Yandex Metrika not loaded yet, waiting...');
    // Wait for Yandex Metrika to be loaded
    const checkYmInterval = setInterval(() => {
      if (typeof window.ym !== 'undefined') {
        clearInterval(checkYmInterval);
        enableWebvisor();
      }
    }, 100);
    return;
  }

  enableWebvisor();
}

/**
 * Enable Webvisor functionality
 */
function enableWebvisor(): void {
  const YM_ID = import.meta.env['PUBLIC_YM_ID'];
  if (!YM_ID) return;

  try {
    const ymId = parseInt(YM_ID, 10);
    if (!isNaN(ymId) && typeof window.ym !== 'undefined') {
      // Initialize Webvisor
      window.ym(ymId, 'params', {
        webvisor: true,
        trustedParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'],
      });
      console.log('Webvisor enabled with consent');
    }
  } catch (error) {
    console.error('Error enabling Webvisor:', error);
  }
}

// Export the main function
export default initWebvisorWithConsent;
