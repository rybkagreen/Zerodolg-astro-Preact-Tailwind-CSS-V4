// Global type definitions for the project

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    ym?: (id: number, method: string, ...args: any[]) => void;
    yaCounterId?: number;
    modalManager?: any;
    teamInteractive?: any;
  }
}

export {};