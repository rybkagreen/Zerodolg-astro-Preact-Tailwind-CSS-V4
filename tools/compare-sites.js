#!/usr/bin/env node

/**
 * Site Comparison Script
 * Compares the visual appearance of production site vs localhost
 */

import PuppeteerHelper from '../src/lib/puppeteer-helper.js';
import { promises as fs } from 'fs';
import { join } from 'path';

const PRODUCTION_URL = 'https://zerodolg.ru/';
const LOCAL_URL = 'http://localhost:4321';

async function compareSites() {
  console.log('🔍 Starting site comparison...');
  console.log(`📍 Production: ${PRODUCTION_URL}`);
  console.log(`🏠 Local: ${LOCAL_URL}\n`);

  const browser = new PuppeteerHelper();
  const results = {
    production: {},
    local: {},
    comparison: {},
  };

  try {
    await browser.init();
    console.log('✅ Browser initialized\n');

    // === PRODUCTION SITE ANALYSIS ===
    console.log('🌐 Analyzing production site...');
    await browser.navigateTo(PRODUCTION_URL);

    // Wait for content to load
    await browser.getPage().waitForSelector('body', { timeout: 10000 });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    results.production = await analyzePageStructure(browser, 'production');
    await browser.takeScreenshot('../screenshots/production-zerodolg.png');
    console.log('   📸 Production screenshot saved');
    console.log(`   📊 Found ${results.production.elements.length} key elements`);
    console.log(`   📝 Page title: "${results.production.title}"`);
    console.log('✅ Production analysis complete\n');

    // === LOCAL SITE ANALYSIS ===
    console.log('🏠 Analyzing local site...');
    try {
      await browser.navigateTo(LOCAL_URL);

      // Wait for content to load
      await browser.getPage().waitForSelector('body', { timeout: 10000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      results.local = await analyzePageStructure(browser, 'local');
      await browser.takeScreenshot('../screenshots/local-zerodolg.png');
      console.log('   📸 Local screenshot saved');
      console.log(`   📊 Found ${results.local.elements.length} key elements`);
      console.log(`   📝 Page title: "${results.local.title}"`);
      console.log('✅ Local analysis complete\n');
    } catch (error) {
      console.log('   ❌ Local server not accessible');
      console.log(`   Error: ${error.message}`);
      results.local = { error: error.message };
    }

    // === COMPARISON ===
    if (!results.local.error) {
      console.log('🔄 Comparing sites...');
      results.comparison = compareSiteData(results.production, results.local);
      displayComparisonResults(results.comparison);
    }

    // === SAVE RESULTS ===
    const reportPath = '../screenshots/comparison-report.json';
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
    console.log(`📋 Detailed report saved: ${reportPath}`);
  } catch (error) {
    console.error('❌ Comparison failed:', error.message);
  } finally {
    await browser.close();
    console.log('🧹 Browser closed');
  }
}

async function analyzePageStructure(browser, siteName) {
  const page = browser.getPage();

  const analysis = await page.evaluate(() => {
    const data = {
      title: document.title,
      url: window.location.href,
      elements: [],
      styles: {},
      content: {},
    };

    // Analyze key elements
    const selectors = [
      'h1',
      'h2',
      'h3',
      '.hero',
      '.main',
      '.content',
      'header',
      'nav',
      'footer',
      'button',
      '.button',
      '.btn',
      '.card',
      '.section',
      '.container',
      'form',
      'input',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);

          data.elements.push({
            selector: `${selector}:nth-of-type(${index + 1})`,
            tagName: el.tagName.toLowerCase(),
            textContent: el.textContent ? el.textContent.trim().substring(0, 100) : '',
            className: el.className,
            id: el.id,
            position: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
            styles: {
              color: styles.color,
              backgroundColor: styles.backgroundColor,
              fontSize: styles.fontSize,
              fontFamily: styles.fontFamily,
              display: styles.display,
              position: styles.position,
            },
            visible:
              rect.width > 0 &&
              rect.height > 0 &&
              styles.opacity !== '0' &&
              styles.visibility !== 'hidden',
          });
        });
      }
    });

    // Get overall page metrics
    data.content = {
      bodyHeight: document.body.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      textLength: document.body.innerText ? document.body.innerText.length : 0,
      imageCount: document.images.length,
      linkCount: document.links.length,
    };

    // Color scheme analysis
    const bodyStyles = window.getComputedStyle(document.body);
    data.styles = {
      backgroundColor: bodyStyles.backgroundColor,
      color: bodyStyles.color,
      fontFamily: bodyStyles.fontFamily,
      fontSize: bodyStyles.fontSize,
    };

    return data;
  });

  console.log(`   🎨 ${siteName} site has ${analysis.content.textLength} characters of text`);
  console.log(`   🖼️  ${analysis.content.imageCount} images, ${analysis.content.linkCount} links`);
  console.log(`   📐 Page height: ${analysis.content.bodyHeight}px`);

  return analysis;
}

function compareSiteData(production, local) {
  const comparison = {
    titles: {
      match: production.title === local.title,
      production: production.title,
      local: local.title,
    },
    elements: {
      productionCount: production.elements.length,
      localCount: local.elements.length,
      missing: [],
      extra: [],
      different: [],
    },
    content: {
      textLengthDiff: Math.abs(production.content.textLength - local.content.textLength),
      imageDiff: Math.abs(production.content.imageCount - local.content.imageCount),
      linkDiff: Math.abs(production.content.linkCount - local.content.linkCount),
    },
    layout: {
      heightDiff: Math.abs(production.content.bodyHeight - local.content.bodyHeight),
    },
  };

  // Compare elements by selector
  const productionSelectors = new Set(production.elements.map((el) => el.selector));
  const localSelectors = new Set(local.elements.map((el) => el.selector));

  // Find missing elements (in production but not local)
  productionSelectors.forEach((selector) => {
    if (!localSelectors.has(selector)) {
      comparison.elements.missing.push(selector);
    }
  });

  // Find extra elements (in local but not production)
  localSelectors.forEach((selector) => {
    if (!productionSelectors.has(selector)) {
      comparison.elements.extra.push(selector);
    }
  });

  return comparison;
}

function displayComparisonResults(comparison) {
  console.log('📋 COMPARISON RESULTS:');
  console.log('==================');

  // Title comparison
  console.log(`📝 Title Match: ${comparison.titles.match ? '✅' : '❌'}`);
  if (!comparison.titles.match) {
    console.log(`   Production: "${comparison.titles.production}"`);
    console.log(`   Local: "${comparison.titles.local}"`);
  }

  // Element count comparison
  console.log(
    `🔢 Elements: Production (${comparison.elements.productionCount}) vs Local (${comparison.elements.localCount})`
  );

  if (comparison.elements.missing.length > 0) {
    console.log(`❌ Missing in local (${comparison.elements.missing.length}):`);
    comparison.elements.missing.forEach((selector) => console.log(`   - ${selector}`));
  }

  if (comparison.elements.extra.length > 0) {
    console.log(`➕ Extra in local (${comparison.elements.extra.length}):`);
    comparison.elements.extra.forEach((selector) => console.log(`   - ${selector}`));
  }

  // Content differences
  console.log(`📊 Content differences:`);
  console.log(`   Text length diff: ${comparison.content.textLengthDiff} characters`);
  console.log(`   Image count diff: ${comparison.content.imageDiff}`);
  console.log(`   Link count diff: ${comparison.content.linkDiff}`);
  console.log(`   Page height diff: ${comparison.layout.heightDiff}px`);

  console.log('==================\n');
}

// Run the comparison
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  compareSites();
}

export default compareSites;