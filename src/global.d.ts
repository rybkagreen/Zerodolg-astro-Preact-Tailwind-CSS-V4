// Global type declarations for the zerodolg-astro project

interface AnalyticsConfig {
  YANDEX_METRIKA_ID: string | undefined;
  GOOGLE_ANALYTICS_ID: string | undefined;
  BITRIX24_WEBHOOK_URL: string | undefined;
  DEBUG: boolean;
}

interface EventParameters {
  [key: string]: any;
}

declare global {
  interface Window {
    ym: ((id: number, command: string, ...args: unknown[]) => void) | undefined;
    gtag?: ((command: string, ...args: unknown[]) => void) | undefined;
    dataLayer: unknown[];
    ZeroDolgAnalytics: {
      trackEvent: (eventName: string, parameters?: EventParameters) => void;
      setDebug: (enabled: boolean) => void;
      getConfig: () => AnalyticsConfig;
    };
    yaCounterId?: string;
    modalManager?: {
      open: (modalId: string, modalType?: string) => void;
      close: (modalId?: string) => void;
      closeAll: () => void;
      debug: () => { totalModals: number; activeModal: string | null; dynamicModals: number };
    };
  }
}

export {};