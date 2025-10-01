// Puppeteer utility functions for the zerodolg-astro project
// This module is intended for server-side use only

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import the actual config (try to import from the JS version)
let puppeteerConfig;
try {
  // Try loading the config as .js first, then as .cjs if needed
  puppeteerConfig = (await import('../../../config.puppeteer.js')).puppeteerConfig;
} catch {
  try {
    puppeteerConfig = (await import('../../../config.puppeteer.cjs')).puppeteerConfig;
  } catch {
    // If both fail, use a default config
    puppeteerConfig = {
      launchOptions: { headless: 'new' },
      defaultViewport: { width: 1280, height: 800 },
      timeoutSettings: { navigation: 30000, action: 5000 },
      userAgent: undefined,
    };
  }
}

// Helper function to safely import Puppeteer
function importPuppeteer() {
  if (typeof window !== 'undefined') {
    throw new Error('Puppeteer is not available in the browser environment');
  }

  // Using CommonJS require for better compatibility with Node.js
  try {
    return require('puppeteer');
  } catch (error) {
    throw new Error(
      'Puppeteer is not available. Make sure it is installed as a dependency. Error: ' +
        error.message
    );
  }
}

class PuppeteerHelper {
  constructor(options = {}) {
    this.options = { ...puppeteerConfig.launchOptions, ...options };
    this.browser = null;
    this.page = null;
  }

  // Initialize browser and page
  async init() {
    try {
      const puppeteer = importPuppeteer();
      this.browser = await puppeteer.launch(this.options);
      this.page = await this.browser.newPage();

      // Set default viewport
      await this.page.setViewport(puppeteerConfig.defaultViewport);

      // Set custom user agent if specified
      if (puppeteerConfig.userAgent) {
        await this.page.setUserAgent(puppeteerConfig.userAgent);
      }
    } catch (error) {
      console.error('Failed to initialize Puppeteer:', error);
      throw error;
    }
  }

  // Navigate to a URL with timeout
  async navigateTo(url) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    await this.page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: puppeteerConfig.timeoutSettings.navigation,
    });
  }

  // Take a screenshot and save it
  async takeScreenshot(path, options) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    await this.page.screenshot({
      path,
      fullPage: true,
      ...options,
    });
  }

  // Wait for an element to appear
  async waitForElement(selector, timeout = puppeteerConfig.timeoutSettings.action) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    return await this.page.waitForSelector(selector, { timeout });
  }

  // Click an element
  async clickElement(selector) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    const element = await this.waitForElement(selector);
    if (element) {
      await element.click();
    } else {
      throw new Error(`Element with selector "${selector}" not found`);
    }
  }

  // Get text content of an element
  async getElementText(selector) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    const element = await this.waitForElement(selector);
    if (element) {
      return await element.evaluate((el) => (el.textContent || '').trim());
    } else {
      throw new Error(`Element with selector "${selector}" not found`);
    }
  }

  // Fill an input field
  async fillInput(selector, text) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    const element = await this.waitForElement(selector);
    if (element) {
      await element.type(text);
    } else {
      throw new Error(`Element with selector "${selector}" not found`);
    }
  }

  // Close browser
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Get the page instance for direct manipulation if needed
  getPage() {
    return this.page;
  }

  // Get the browser instance for direct manipulation if needed
  getBrowser() {
    return this.browser;
  }
}

export default PuppeteerHelper;
