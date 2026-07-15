declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (window.grecaptcha) {
    return Promise.resolve();
  }
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Obtains a reCAPTCHA v3 token for the given action. Resolves to an empty
 * string (never rejects) if the site key isn't configured or the script
 * fails to load. Note: an empty token does NOT necessarily mean the
 * submission proceeds unchecked — if the server has both recaptcha keys
 * configured, an empty token is treated as a failed verification (422),
 * not a skip. This function only guarantees the client itself doesn't
 * hang or throw; see src/features/forms/lib/recaptcha.ts for the
 * server-side pass/fail logic.
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = import.meta.env['PUBLIC_RECAPTCHA_SITE_KEY'];
  if (!siteKey || typeof window === 'undefined') {
    return '';
  }

  try {
    await loadRecaptchaScript(siteKey);

    // Capture into a local const so the closure below has a narrowed,
    // guaranteed-defined reference — avoids a hung Promise (never
    // resolved or rejected) if `window.grecaptcha` were ever unset here.
    const { grecaptcha } = window;
    if (!grecaptcha) {
      return '';
    }

    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject);
      });
    });
  } catch {
    return '';
  }
}
