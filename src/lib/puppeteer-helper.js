// Puppeteer utility functions for the zerodolg-astro project
import puppeteer from 'puppeteer';
import { puppeteerConfig } from '../../config.puppeteer.js';

class PuppeteerHelper {
  constructor(options = {}) {
    this.options = { ...puppeteerConfig.launchOptions, ...options };
    this.browser = null;
    this.page = null;
  }

  // Initialize browser and page
  async init() {
    this.browser = await puppeteer.launch(this.options);
    this.page = await this.browser.newPage();

    // Set default viewport
    await this.page.setViewport(puppeteerConfig.defaultViewport);

    // Set custom user agent if specified
    if (puppeteerConfig.userAgent) {
      await this.page.setUserAgent(puppeteerConfig.userAgent);
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
  async takeScreenshot(path) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    await this.page.screenshot({
      path,
      fullPage: true,
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
    await element.click();
  }

  // Get text content of an element
  async getElementText(selector) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    const element = await this.waitForElement(selector);
    return await element.evaluate((el) => el.textContent.trim());
  }

  // Fill an input field
  async fillInput(selector, text) {
    if (!this.page) {
      throw new Error('Puppeteer page not initialized. Call init() first.');
    }

    const element = await this.waitForElement(selector);
    await element.type(text);
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
