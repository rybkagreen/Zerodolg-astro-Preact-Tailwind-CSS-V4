import { logger } from '../lib/logger';

/**
 * Testing mode bypasses the live Bitrix24 call and reCAPTCHA verification.
 * It must never be silently active in production — every check logs at
 * ERROR (not WARN) specifically so it surfaces in log-level-based
 * monitoring/alerting, not just the console. There is no code-level guard
 * tied to NODE_ENV: this repo's own staging convention (docker-compose.yml,
 * STAGING_TESTING_GUIDE.md) always sets NODE_ENV=production for staging
 * too, and local verification runs of the built server also use
 * NODE_ENV=production — so NODE_ENV cannot distinguish "real production"
 * from those legitimate cases. Logging loudly, and documenting that
 * TESTING/STAGING must never be set on the real prod host, is the
 * practical mitigation here (see infra/README.md).
 */
export function isTestingEnv(): boolean {
  const enabled =
    process.env['NODE_ENV'] === 'test' ||
    process.env['TESTING'] === 'true' ||
    process.env['STAGING'] === 'true';

  if (enabled) {
    logger.error(
      'TESTING MODE ACTIVE — Bitrix24 webhook calls and reCAPTCHA verification are bypassed'
    );
  }

  return enabled;
}
