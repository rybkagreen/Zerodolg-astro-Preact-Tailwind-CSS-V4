// Global type definitions for the project

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    ym?: (id: number, command: string, ...args: unknown[]) => void;
    yaCounterId?: number;
    modalManager?: {
      open: (modalId: string) => void;
      close: (modal?: HTMLElement) => void;
      closeAll: () => void;
    };
  }
  // Extend the HTMLElement interface to include dataLayer
  var dataLayer: unknown[];
}

export {};
