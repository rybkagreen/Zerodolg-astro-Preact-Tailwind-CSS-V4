// Example usage of Puppeteer with Astro MCP functionality
// This script demonstrates how to integrate Puppeteer with your Astro site
import PuppeteerHelper from '../src/lib/puppeteer-helper.js';

async function exampleMcpUsage() {
  const browserHelper = new PuppeteerHelper();

  try {
    // Initialize Puppeteer
    await browserHelper.init();

    // Navigate to the local development site
    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    await browserHelper.navigateTo(baseUrl);

    console.log('Successfully navigated to the site');

    // Perform some actions to test the site
    const title = await browserHelper.getElementText('title');
    console.log('Page title:', title);

    // Take a screenshot of the homepage
    await browserHelper.takeScreenshot('./test-results/screenshots/homepage.png');
    console.log('Screenshot taken');

    // Example of how you might test an MCP-related feature
    // This would depend on your specific MCP configuration
    const page = browserHelper.getPage();
    const mcpElements = await page.$('.mcp-content, [data-mcp], .content-published');
    console.log(`Found ${mcpElements.length} MCP-related elements on the page`);
  } catch (error) {
    console.error('Error during Puppeteer test:', error);
  } finally {
    // Close the browser
    await browserHelper.close();
  }
}

// Function to test specific pages
async function testPage(urlPath) {
  const browserHelper = new PuppeteerHelper();

  try {
    await browserHelper.init();
    const baseUrl = process.env.BASE_URL || 'http://localhost:4321';
    await browserHelper.navigateTo(`${baseUrl}${urlPath}`);

    // Take screenshot of specific page
    const pageName = urlPath.replace(/\//g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'homepage';
    await browserHelper.takeScreenshot(`./test-results/screenshots/${pageName}.png`);
    console.log(`Screenshot of ${urlPath} taken`);
  } catch (error) {
    console.error(`Error testing ${urlPath}:`, error);
  } finally {
    await browserHelper.close();
  }
}

// Run examples if this file is executed directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (fileURLToPath(import.meta.url) === __filename) {
  exampleMcpUsage()
    .then(() => console.log('Example completed successfully'))
    .catch(console.error);
}

export { exampleMcpUsage, testPage };
