// Puppeteer configuration for the zerodolg-astro project

export const puppeteerConfig = {
  // General Puppeteer launch options
  launchOptions: {
    headless: 'new', // Use new headless mode
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-ipc-flooding-protection',
    ],
  },

  // Common viewport settings for testing
  defaultViewport: {
    width: 1280,
    height: 720,
  },

  // Device emulation options (will be loaded when needed)
  deviceEmulations: {
    mobile: 'iPhone 14 Pro', // Device name, will be resolved at runtime
    tablet: 'iPad', // Device name, will be resolved at runtime
    desktop: null, // No emulation for desktop
  },

  // Timeout settings
  timeoutSettings: {
    navigation: 30000, // 30 seconds
    action: 10000, // 10 seconds
    media: 15000, // 15 seconds
  },

  // Common test configurations
  testConfig: {
    baseUrl: process.env.BASE_URL || 'http://localhost:4321',
    screenshotPath: './test-results/screenshots',
    reportPath: './test-results/reports',
  },

  // Custom user agent if needed
  userAgent: 'zerodolg-astro-bot/1.0 (Puppeteer automation)',
};
