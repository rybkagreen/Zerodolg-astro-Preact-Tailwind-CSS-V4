// Puppeteer utility functions for the zerodolg-astro project
// This module is intended for server-side use only

// Import the actual config
import { puppeteerConfig } from '../../../config.puppeteer.js';

interface PuppeteerHelperOptions {
  [key: string]: any;
}

// Define Puppeteer types as any to avoid build errors
type Browser = any;
type Page = any;

// Helper function to safely import Puppeteer
async function importPuppeteer() {
  if (typeof window !== 'undefined') {
    throw new Error('Puppeteer is not available in the browser environment');
  }

  // In order to avoid TypeScript import errors during build time,
  // we're using dynamic import in a Node.js compatible way
  try {
    const puppeteer = await import('puppeteer');
    return puppeteer.default || puppeteer;
  } catch (_error) {
    throw new Error('Puppeteer is not available. Make sure it is installed as a dependency.');
  }
}

class PuppeteerHelper {
  private options: any;
  private browser: Browser | null;
  private page: Page | null;

  constructor(options: PuppeteerHelperOptions = {}) {
    this.options = { ...puppeteerConfig.launchOptions, ...options };
    this.browser = null;
    this.page = null;
  }

  // Initialize browser and page
  async init() {
    try {
      const puppeteer = await importPuppeteer();
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
  async navigateTo(url: string) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    await this.page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: puppeteerConfig.timeoutSettings.navigation,
    });
  }

  // Take a screenshot and save it
  async takeScreenshot(path: string, options?: any) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    await this.page.screenshot({
      path: path as `${string}.png` | `${string}.jpeg` | `${string}.webp`,
      fullPage: true,
      ...options,
    });
  }

  // Wait for an element to appear
  async waitForElement(selector: string, timeout: number = puppeteerConfig.timeoutSettings.action) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    return await this.page.waitForSelector(selector, { timeout });
  }

  // Click an element
  async clickElement(selector: string) {
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
  async getElementText(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    const element = await this.waitForElement(selector);
    if (element) {
      return await element.evaluate((el: Element) => (el.textContent || '').trim());
    } else {
      throw new Error(`Element with selector "${selector}" not found`);
    }
  }

  // Fill an input field
  async fillInput(selector: string, text: string) {
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
  getPage(): Page | null {
    return this.page;
  }

  // Get the browser instance for direct manipulation if needed
  getBrowser(): Browser | null {
    return this.browser;
  }
}

export default PuppeteerHelper;
