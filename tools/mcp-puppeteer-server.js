#!/usr/bin/env node

/**
 * MCP Server with Puppeteer Integration
 * Provides web browsing capabilities through the MCP protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PuppeteerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'puppeteer-browser',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.page = null;
    this.screenshots = new Map(); // Store screenshots metadata

    this.setupToolHandlers();
    this.setupShutdownHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'navigate_to_url',
            description: 'Navigate to a specific URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to navigate to',
                },
                waitUntil: {
                  type: 'string',
                  enum: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
                  description: 'When to consider navigation succeeded',
                  default: 'networkidle2',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name for the screenshot file',
                  default: 'screenshot',
                },
                fullPage: {
                  type: 'boolean',
                  description: 'Capture the full scrollable page',
                  default: true,
                },
                element: {
                  type: 'string',
                  description: 'CSS selector for specific element to screenshot',
                },
              },
            },
          },
          {
            name: 'get_page_content',
            description: 'Get the HTML content of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector to get specific element content',
                },
              },
            },
          },
          {
            name: 'get_page_title',
            description: 'Get the title of the current page',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_page_url',
            description: 'Get the current page URL',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'click_element',
            description: 'Click on an element on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element to click',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'type_text',
            description: 'Type text into an input field',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input field',
                },
                text: {
                  type: 'string',
                  description: 'Text to type',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'wait_for_element',
            description: 'Wait for an element to appear on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element to wait for',
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds',
                  default: 10000,
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'evaluate_javascript',
            description: 'Execute JavaScript code in the browser context',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'JavaScript code to execute',
                },
              },
              required: ['code'],
            },
          },
          {
            name: 'get_viewport_size',
            description: 'Get current viewport dimensions',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'set_viewport_size',
            description: 'Set viewport dimensions',
            inputSchema: {
              type: 'object',
              properties: {
                width: {
                  type: 'number',
                  description: 'Viewport width in pixels',
                },
                height: {
                  type: 'number',
                  description: 'Viewport height in pixels',
                },
              },
              required: ['width', 'height'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Initialize browser if not already done
        if (!this.browser) {
          await this.initBrowser();
        }

        switch (name) {
          case 'navigate_to_url':
            return await this.navigateToUrl(args.url, args.waitUntil);

          case 'take_screenshot':
            return await this.takeScreenshot(args.name, args.fullPage, args.element);

          case 'get_page_content':
            return await this.getPageContent(args.selector);

          case 'get_page_title':
            return await this.getPageTitle();

          case 'get_page_url':
            return await this.getPageUrl();

          case 'click_element':
            return await this.clickElement(args.selector);

          case 'type_text':
            return await this.typeText(args.selector, args.text);

          case 'wait_for_element':
            return await this.waitForElement(args.selector, args.timeout);

          case 'evaluate_javascript':
            return await this.evaluateJavaScript(args.code);

          case 'get_viewport_size':
            return await this.getViewportSize();

          case 'set_viewport_size':
            return await this.setViewportSize(args.width, args.height);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: 'new', // Use new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  async navigateToUrl(url, waitUntil = 'networkidle2') {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    await this.page.goto(url, { waitUntil, timeout: 30000 });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to: ${url}`,
        },
      ],
    };
  }

  async takeScreenshot(name = 'screenshot', fullPage = true, element = null) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const screenshotPath = join(__dirname, 'screenshots', filename);

    // Ensure screenshots directory exists
    await fs.mkdir(join(__dirname, 'screenshots'), { recursive: true });

    const options = {
      path: screenshotPath,
      fullPage: fullPage,
    };

    if (element) {
      const elementHandle = await this.page.$(element);
      if (elementHandle) {
        await elementHandle.screenshot({ path: screenshotPath });
      } else {
        throw new Error(`Element with selector '${element}' not found`);
      }
    } else {
      await this.page.screenshot(options);
    }

    // Store metadata
    this.screenshots.set(filename, {
      path: screenshotPath,
      url: this.page.url(),
      timestamp: new Date(),
      element: element || null,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved: ${filename}`,
        },
        {
          type: 'text',
          text: `Path: ${screenshotPath}`,
        },
      ],
    };
  }

  async getPageContent(selector = null) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    let content;
    if (selector) {
      const element = await this.page.$(selector);
      if (!element) {
        throw new Error(`Element with selector '${selector}' not found`);
      }
      content = await element.evaluate((el) => el.outerHTML);
    } else {
      content = await this.page.content();
    }

    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  async getPageTitle() {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const title = await this.page.title();
    return {
      content: [
        {
          type: 'text',
          text: `Page title: ${title}`,
        },
      ],
    };
  }

  async getPageUrl() {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const url = this.page.url();
    return {
      content: [
        {
          type: 'text',
          text: `Current URL: ${url}`,
        },
      ],
    };
  }

  async clickElement(selector) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const element = await this.page.waitForSelector(selector, { timeout: 10000 });
    if (!element) {
      throw new Error(`Element with selector '${selector}' not found`);
    }

    await element.click();

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`,
        },
      ],
    };
  }

  async typeText(selector, text) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const element = await this.page.waitForSelector(selector, { timeout: 10000 });
    if (!element) {
      throw new Error(`Element with selector '${selector}' not found`);
    }

    await element.type(text);

    return {
      content: [
        {
          type: 'text',
          text: `Typed '${text}' into element: ${selector}`,
        },
      ],
    };
  }

  async waitForElement(selector, timeout = 10000) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const element = await this.page.waitForSelector(selector, { timeout });

    return {
      content: [
        {
          type: 'text',
          text: `Element found: ${selector}`,
        },
      ],
    };
  }

  async evaluateJavaScript(code) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const result = await this.page.evaluate(code);

    return {
      content: [
        {
          type: 'text',
          text: `JavaScript result: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  async getViewportSize() {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const viewport = this.page.viewport();

    return {
      content: [
        {
          type: 'text',
          text: `Viewport: ${viewport.width}x${viewport.height}`,
        },
      ],
    };
  }

  async setViewportSize(width, height) {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    await this.page.setViewport({ width, height });

    return {
      content: [
        {
          type: 'text',
          text: `Viewport set to: ${width}x${height}`,
        },
      ],
    };
  }

  setupShutdownHandlers() {
    const cleanup = async () => {
      if (this.browser) {
        await this.browser.close();
      }
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('beforeExit', cleanup);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Puppeteer MCP server running on stdio');
  }
}

// Start the server
const server = new PuppeteerMCPServer();
server.run().catch(console.error);
