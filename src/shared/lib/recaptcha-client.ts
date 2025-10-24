/**
 * Client-side reCaptcha v3 utilities
 */
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Load reCaptcha script if not already loaded
export function loadRecaptchaScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (typeof window.grecaptcha !== 'undefined') {
      window.grecaptcha.ready(() => resolve());
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src^=\'https://www.google.com/recaptcha/api.js\']'
    );
    if (existingScript) {
      // Wait for grecaptcha to be available
      const checkRecaptcha = setInterval(() => {
        if (typeof window.grecaptcha !== 'undefined') {
          clearInterval(checkRecaptcha);
          window.grecaptcha.ready(() => resolve());
        }
      }, 100);
      return;
    }

    // Create script tag
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => resolve());
    };
    script.onerror = () => {
      reject(new Error('Failed to load reCaptcha script'));
    };
    
    document.head.appendChild(script);
  });
}

// Execute reCaptcha and get token
export async function executeRecaptcha(siteKey: string, action: string = 'submit'): Promise<string> {
  try {
    // Ensure reCaptcha is loaded
    await loadRecaptchaScript(siteKey);
    
    // Execute reCaptcha
    const token = await window.grecaptcha.execute(siteKey, { action });
    return token;
  } catch (_error) {
    // reCaptcha execution failed
    throw new Error('Failed to execute reCaptcha');
  }
}