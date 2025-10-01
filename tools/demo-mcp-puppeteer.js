#!/usr/bin/env node

/**
 * Demo script for Puppeteer MCP Server
 * Demonstrates various browser automation capabilities
 */

import PuppeteerHelper from '../src/shared/lib/puppeteer-helper.js';

async function runDemo() {
  console.log('🎬 Starting Puppeteer MCP Demo...\n');

  const browser = new PuppeteerHelper();

  try {
    // Initialize browser
    console.log('🚀 Initializing browser...');
    await browser.init();
    console.log('✅ Browser initialized\n');

    // Demo 1: Navigate to example.com
    console.log('📍 Demo 1: Navigation');
    console.log('   Navigating to example.com...');
    await browser.navigateTo('https://example.com');

    const title = await browser.getElementText('title');
    console.log(`   Page title: ${title}`);
    console.log('✅ Navigation completed\n');

    // Demo 2: Take screenshot
    console.log('📸 Demo 2: Screenshot');
    await browser.takeScreenshot('./screenshots/demo-example-com.png');
    console.log('✅ Screenshot saved to ./screenshots/demo-example-com.png\n');

    // Demo 3: Get page content
    console.log('📄 Demo 3: Page content');
    const page = browser.getPage();
    const content = await page.evaluate(() => document.body.innerText);
    console.log('   First 100 chars of page content:');
    console.log(`   "${content.substring(0, 100)}..."`);
    console.log('✅ Content extracted\n');

    // Demo 4: JavaScript evaluation
    console.log('🧪 Demo 4: JavaScript evaluation');
    const jsResult = await page.evaluate(() => {
      return {
        url: window.location.href,
        userAgent: navigator.userAgent.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
      };
    });
    console.log('   JavaScript execution result:');
    console.log(`   URL: ${jsResult.url}`);
    console.log(`   User Agent: ${jsResult.userAgent}`);
    console.log(`   Timestamp: ${jsResult.timestamp}`);
    console.log('✅ JavaScript executed\n');

    // Demo 5: Viewport management
    console.log('📐 Demo 5: Viewport management');
    const currentViewport = page.viewport();
    console.log(`   Current viewport: ${currentViewport.width}x${currentViewport.height}`);

    await page.setViewport({ width: 800, height: 600 });
    console.log('   Viewport changed to 800x600');

    await browser.takeScreenshot('./screenshots/demo-viewport-800x600.png');
    console.log('✅ Viewport screenshot saved\n');

    // Demo 6: Test local development server (if running)
    console.log('🏠 Demo 6: Local development test');
    try {
      await browser.navigateTo('http://localhost:4321');
      const localTitle = await browser.getElementText('title');
      console.log(`   Local site title: ${localTitle}`);
      await browser.takeScreenshot('./screenshots/demo-localhost.png');
      console.log('✅ Local site screenshot saved');
    } catch (error) {
      console.log('   ⚠️  Local development server not running or not accessible');
      console.log(`   Error: ${error.message}`);
    }
    console.log('');

    console.log('🎉 Demo completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   • Browser automation ✅');
    console.log('   • Page navigation ✅');
    console.log('   • Screenshot capture ✅');
    console.log('   • Content extraction ✅');
    console.log('   • JavaScript execution ✅');
    console.log('   • Viewport management ✅');
    console.log('');
    console.log('🚀 Your MCP Puppeteer server is ready for use!');
    console.log('   Start it with: npm run mcp:puppeteer');
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Clean up
    await browser.close();
    console.log('🧹 Browser closed');
  }
}

// Run demo if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname.replace(/^\//, '').replace(/\//g, '\\')) {
  runDemo().catch(console.error);
}

export default runDemo;
