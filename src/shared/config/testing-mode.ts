import { logger } from '../lib/logger';

/**
 * Testing mode bypasses the live Bitrix24 call and reCAPTCHA verification.
 * It must never be silently active in production — every check logs at
 * WARN (the level prod's logger floor always lets through).
 */
export function isTestingEnv(): boolean {
  const enabled =
    process.env['NODE_ENV'] === 'test' ||
    process.env['TESTING'] === 'true' ||
    process.env['STAGING'] === 'true';

  if (enabled) {
    logger.warn(
      'TESTING MODE ACTIVE — Bitrix24 webhook calls and reCAPTCHA verification are bypassed'
    );
  }

  return enabled;
}
