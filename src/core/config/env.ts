import { z } from 'zod';

const envSchema = z.object({
  PUBLIC_SITE_URL: z.string().url(),
  PUBLIC_SITE_PHONE: z.string(),
  PUBLIC_SITE_EMAIL: z.string().email(),
  BITRIX24_WEBHOOK_URL: z.string().url(),
  PUBLIC_GA_ID: z.string().optional(),
  PUBLIC_YM_ID: z.string().optional(),
  PUBLIC_ASTRO_TOOLBAR: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});

export const validateEnv = (): z.infer<typeof envSchema> => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
};
