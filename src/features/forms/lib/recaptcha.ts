import { logger } from '@shared/lib/logger';
import { isTestingEnv } from '@shared/config/testing-mode';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const DEFAULT_THRESHOLD = 0.3;

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Verifies a reCAPTCHA v3 token server-side. Skips verification (returns
 * true) if testing mode is on, or either the site key or secret is unset
 * — same shape as prod. Fails closed (returns false) on a missing token
 * or any network/parse error.
 */
export async function verifyRecaptcha(token: string, remoteip?: string): Promise<boolean> {
  const secret = process.env['RECAPTCHA_SECRET'];
  const siteKey = process.env['PUBLIC_RECAPTCHA_SITE_KEY'];

  if (isTestingEnv() || !secret || !siteKey) {
    return true;
  }

  if (!token) {
    logger.warn('reCAPTCHA verification skipped: no token provided');
    return false;
  }

  const threshold = Number(process.env['RECAPTCHA_THRESHOLD'] ?? DEFAULT_THRESHOLD);

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteip) {
      params.set('remoteip', remoteip);
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = (await response.json()) as RecaptchaVerifyResponse;

    logger.info('reCAPTCHA verification result', {
      success: data.success,
      score: data.score,
      action: data.action,
    });

    const passed = data.success && (data.score === undefined || data.score >= threshold);

    if (!passed) {
      logger.warn('reCAPTCHA verification failed', { score: data.score });
    }

    return passed;
  } catch (error) {
    logger.error(
      'reCAPTCHA verification error',
      undefined,
      error instanceof Error ? error : new Error(String(error))
    );
    return false;
  }
}

// Captured at module load, which — under Vite's static replacement of
// `import.meta.env.X` — freezes this to whatever PUBLIC_RECAPTCHA_SITE_KEY
// was set to when `npm run build`/`build:prod` ran, NOT the current
// process's environment. This is intentional: it's the client bundle's
// actual baked-in capability, used below to catch a build/runtime mismatch.
const BUILD_TIME_SITE_KEY = import.meta.env['PUBLIC_RECAPTCHA_SITE_KEY'];

/**
 * Guards against a real deploy footgun: if RECAPTCHA_SECRET is set at
 * runtime (server-side verification is ON) but the client bundle was built
 * without PUBLIC_RECAPTCHA_SITE_KEY, browsers can never obtain a token —
 * verifyRecaptcha then fails closed on every submission (422), silently
 * dropping every lead until the site is rebuilt with the key set. Call
 * once at server startup (module load), not per-request — this is a
 * deploy-config problem, not a request-time one.
 */
export function checkRecaptchaConfigConsistency(): void {
  const secretConfiguredAtRuntime = Boolean(process.env['RECAPTCHA_SECRET']);
  const siteKeyBakedAtBuildTime = Boolean(BUILD_TIME_SITE_KEY);

  if (secretConfiguredAtRuntime && !siteKeyBakedAtBuildTime) {
    logger.error(
      'RECAPTCHA CONFIG MISMATCH: RECAPTCHA_SECRET is set at runtime but ' +
        'PUBLIC_RECAPTCHA_SITE_KEY was empty at BUILD time. The client bundle ' +
        'cannot obtain a reCAPTCHA token, so every /api/form submission will ' +
        'be rejected with 422 until the site is rebuilt with ' +
        'PUBLIC_RECAPTCHA_SITE_KEY set. See infra/README.md.'
    );
  }
}
