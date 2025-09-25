/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

declare const __DATE__: string;
declare const __NAMESPACE__: unknown;

// Type declarations for Astro components
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro';
  const component: AstroComponentFactory;
  export default component;
}
