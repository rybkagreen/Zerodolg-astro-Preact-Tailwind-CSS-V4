// Environment variable declarations for TypeScript
interface ImportMetaEnv {
  readonly PUBLIC_YM_ID: string;
  readonly PUBLIC_GA_ID: string;
  readonly BITRIX24_WEBHOOK_URL: string;
  readonly DEBUG: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}