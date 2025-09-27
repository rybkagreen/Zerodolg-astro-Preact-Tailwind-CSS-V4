// Environment validation utility
import { logger } from '../config/env';

export function validateEnvironment(): boolean {
  const requiredVars: string[] = [
    'BITRIX24_WEBHOOK_URL',
    'PUBLIC_SITE_URL',
    'PUBLIC_SITE_PHONE',
    'PUBLIC_SITE_EMAIL',
  ];

  const missingVars: string[] = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    logger.warn('Missing required environment variables', { missingVars });
    return false;
  }

  // Validate URL format
  try {
    if (process.env['PUBLIC_SITE_URL']) {
      new URL(process.env['PUBLIC_SITE_URL']);
    }
    if (process.env['BITRIX24_WEBHOOK_URL']) {
      new URL(process.env['BITRIX24_WEBHOOK_URL']);
    }
  } catch (error: unknown) {
    logger.warn('Invalid URL in environment variables', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }

  // Validate email format
  if (process.env['PUBLIC_SITE_EMAIL']) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(process.env['PUBLIC_SITE_EMAIL'])) {
      logger.warn('Invalid email format in PUBLIC_SITE_EMAIL');
      return false;
    }
  }

  // Validate phone format
  if (process.env['PUBLIC_SITE_PHONE']) {
    const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    if (!phoneRegex.test(process.env['PUBLIC_SITE_PHONE'])) {
      logger.warn('Invalid phone format in PUBLIC_SITE_PHONE');
      return false;
    }
  }

  logger.info('Environment validation passed');
  return true;
}
