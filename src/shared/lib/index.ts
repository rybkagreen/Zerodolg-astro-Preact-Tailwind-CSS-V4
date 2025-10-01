/**
 * Shared utilities and components for Russian Bankruptcy Services
 * Export file for TypeScript
 */

// Export specific utilities
export * from './analytics';
export * from './performance';
export * from './logger';
export * from './structured-data';
export * from './form-utils';
export * from './bitrix-callback';

// Export analytics manager and hash utilities
export { analytics, AnalyticsManager, SERVICE_VALUES } from './analytics-manager';
export type { ConversionData, EventParams } from './analytics-manager';
export {
  hashSHA256,
  hashEmail,
  hashPhone,
  hashName,
  hashUserData,
  isWebCryptoSupported,
  isSecureContext,
  isValidEmail,
  isValidPhone,
} from './hash-utils';
export type { UserData, HashedUserData } from './hash-utils';

// Export types if they exist
