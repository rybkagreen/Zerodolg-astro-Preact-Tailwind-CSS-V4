// Simple test to verify Puppeteer is working correctly
import PuppeteerHelper from './src/lib/puppeteer-helper.js';

async function testPuppeteer() {
  const browserHelper = new PuppeteerHelper();

  try {
    console.log('Initializing Puppeteer...');
    await browserHelper.init();
    console.log('Puppeteer initialized successfully!');

    console.log('Navigating to example.com...');
    await browserHelper.navigateTo('https://example.com');
    console.log('Successfully navigated to example.com');

    const title = await browserHelper.getElementText('title');
    console.log(`Page title: ${title}`);

    // Take a screenshot
    await browserHelper.takeScreenshot('./test-results/screenshots/test.png');
    console.log('Screenshot saved to ./test-results/screenshots/test.png');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browserHelper.close();
    console.log('Browser closed.');
  }
}

testPuppeteer()
  .then(() => console.log('Test completed successfully!'))
  .catch(console.error);
