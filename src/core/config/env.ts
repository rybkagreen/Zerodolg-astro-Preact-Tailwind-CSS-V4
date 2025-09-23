// Environment variables validation
import { z } from 'zod';

const envSchema = z.object({
  // Public environment variables (available on the client)
  PUBLIC_SITE_URL: z.string().url(),
  PUBLIC_SITE_PHONE: z.string(),
  PUBLIC_SITE_EMAIL: z.string().email(),
  PUBLIC_GA_ID: z.string().optional(),
  PUBLIC_YM_ID: z.string().optional(),

  // Private environment variables (server-only)
  BITRIX24_WEBHOOK_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return {
      ...env,
      isProduction: env.NODE_ENV === 'production',
      isDevelopment: env.NODE_ENV === 'development',
      isTest: env.NODE_ENV === 'test',
    };
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Environment validation failed');
  }
}

export type Env = ReturnType<typeof validateEnv>;
