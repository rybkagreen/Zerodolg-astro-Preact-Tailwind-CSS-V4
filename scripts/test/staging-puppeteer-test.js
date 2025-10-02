#!/usr/bin/env node

/**
 * Advanced Puppeteer Testing Script for Staging Server
 * Tests UI, interactions, performance, and generates screenshots
 */

import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STAGING_URL = process.env.STAGING_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', '..', 'test-results', 'screenshots');
const REPORT_DIR = path.join(__dirname, '..', '..', 'test-results');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
  screenshots: [],
  performanceMetrics: {},
};

// Logging utilities
function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(`  ${title}`, COLORS.bright + COLORS.cyan);
  console.log('='.repeat(70) + '\n');
}

function logTest(name, status, details = '') {
  const statusSymbol = {
    pass: '✓',
    fail: '✗',
    warn: '⚠',
  }[status];

  const statusColor = {
    pass: COLORS.green,
    fail: COLORS.red,
    warn: COLORS.yellow,
  }[status];

  testResults.total++;
  if (status === 'pass') testResults.passed++;
  if (status === 'fail') testResults.failed++;
  if (status === 'warn') testResults.warnings++;

  testResults.tests.push({ name, status, details });

  log(`${statusSymbol} ${name}`, statusColor);
  if (details) {
    log(`  └─ ${details}`, COLORS.reset);
  }
}

// Create directories if they don't exist
async function ensureDirectories() {
  if (!existsSync(SCREENSHOT_DIR)) {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
  }
  if (!existsSync(REPORT_DIR)) {
    await mkdir(REPORT_DIR, { recursive: true });
  }
}

// Save screenshot
async function saveScreenshot(page, name) {
  const filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  testResults.screenshots.push({ name, path: filepath });
  return filepath;
}

// Test Suite 1: Page Load and Basic Rendering
async function test1_PageLoadAndRendering(page) {
  logSection('1. Page Load and Rendering Tests');

  try {
    // Navigate to page and measure load time
    const startTime = Date.now();
    const response = await page.goto(STAGING_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    const loadTime = Date.now() - startTime;

    testResults.performanceMetrics.pageLoadTime = loadTime;

    if (response.ok()) {
      logTest('Page loaded successfully', 'pass', `${loadTime}ms`);
    } else {
      logTest('Page loaded with errors', 'fail', `HTTP ${response.status()}`);
    }

    // Take initial screenshot
    const screenshotPath = await saveScreenshot(page, 'initial_page_load');
    logTest('Screenshot captured', 'pass', path.basename(screenshotPath));

    // Check page title
    const title = await page.title();
    if (title && title.length > 0) {
      logTest('Page title exists', 'pass', title.substring(0, 50));
    } else {
      logTest('Page title missing', 'fail');
    }

    // Check for main content
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.length > 100) {
      logTest('Page has content', 'pass', `${bodyText.length} characters`);
    } else {
      logTest('Page content seems empty', 'warn', `Only ${bodyText.length} characters`);
    }

    // Check for Russian text
    if (bodyText.includes('банкротство') || bodyText.includes('долг')) {
      logTest('Russian content present', 'pass');
    } else {
      logTest('Russian content not found', 'warn');
    }
  } catch (error) {
    logTest('Page load test failed', 'fail', error.message);
  }
}

// Test Suite 2: Interactive Elements
async function test2_InteractiveElements(page) {
  logSection('2. Interactive Elements Tests');

  try {
    // Check for buttons
    const buttons = await page.$$('button, a.button, a.btn, input[type="submit"]');
    if (buttons.length > 0) {
      logTest('Interactive buttons found', 'pass', `${buttons.length} buttons`);
    } else {
      logTest('No buttons found', 'warn');
    }

    // Check for forms
    const forms = await page.$$('form');
    if (forms.length > 0) {
      logTest('Forms present', 'pass', `${forms.length} forms`);
    } else {
      logTest('No forms found', 'warn');
    }

    // Check for links
    const links = await page.$$('a[href]');
    if (links.length > 0) {
      logTest('Navigation links found', 'pass', `${links.length} links`);
    } else {
      logTest('No links found', 'fail');
    }

    // Test phone number click (if exists)
    const phoneLinks = await page.$$('a[href^="tel:"]');
    if (phoneLinks.length > 0) {
      logTest('Phone links present', 'pass', `${phoneLinks.length} phone links`);
    } else {
      logTest('Phone links not found', 'warn');
    }

    // Test email links (if exists)
    const emailLinks = await page.$$('a[href^="mailto:"]');
    if (emailLinks.length > 0) {
      logTest('Email links present', 'pass', `${emailLinks.length} email links`);
    } else {
      logTest('Email links not found', 'warn');
    }
  } catch (error) {
    logTest('Interactive elements test failed', 'fail', error.message);
  }
}

// Test Suite 3: Visual Regression and Layout
async function test3_VisualAndLayout(page) {
  logSection('3. Visual and Layout Tests');

  try {
    // Check viewport rendering
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await saveScreenshot(page, 'desktop_1920x1080');
    logTest('Desktop viewport screenshot', 'pass', '1920x1080');

    await page.setViewport({ width: 1366, height: 768 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await saveScreenshot(page, 'desktop_1366x768');
    logTest('Laptop viewport screenshot', 'pass', '1366x768');

    await page.setViewport({ width: 768, height: 1024 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await saveScreenshot(page, 'tablet_768x1024');
    logTest('Tablet viewport screenshot', 'pass', '768x1024');

    await page.setViewport({ width: 375, height: 667 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await saveScreenshot(page, 'mobile_375x667');
    logTest('Mobile viewport screenshot', 'pass', '375x667');

    // Reset to desktop view
    await page.setViewport({ width: 1920, height: 1080 });

    // Check for images
    const images = await page.$$('img');
    if (images.length > 0) {
      logTest('Images present on page', 'pass', `${images.length} images`);

      // Check if images are loaded
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter((img) => !img.complete || img.naturalHeight === 0).length;
      });

      if (brokenImages === 0) {
        logTest('All images loaded successfully', 'pass');
      } else {
        logTest('Some images failed to load', 'warn', `${brokenImages} broken images`);
      }
    } else {
      logTest('No images found', 'warn');
    }

    // Check for layout shifts
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(cls), 2000);
      });
    });

    testResults.performanceMetrics.cumulativeLayoutShift = cls;
    if (cls < 0.1) {
      logTest('Cumulative Layout Shift', 'pass', `CLS: ${cls.toFixed(4)}`);
    } else if (cls < 0.25) {
      logTest('Cumulative Layout Shift', 'warn', `CLS: ${cls.toFixed(4)} (needs improvement)`);
    } else {
      logTest('Cumulative Layout Shift', 'fail', `CLS: ${cls.toFixed(4)} (poor)`);
    }
  } catch (error) {
    logTest('Visual and layout test failed', 'fail', error.message);
  }
}

// Test Suite 4: JavaScript Execution and Console Errors
async function test4_JavaScriptAndConsole(page) {
  logSection('4. JavaScript and Console Tests');

  const consoleMessages = [];
  const jsErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', (error) => {
    jsErrors.push(error.message);
  });

  try {
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check for JavaScript errors
    if (jsErrors.length === 0) {
      logTest('No JavaScript errors', 'pass');
    } else {
      logTest('JavaScript errors detected', 'fail', `${jsErrors.length} errors`);
      jsErrors.forEach((err, i) => {
        if (i < 3) log(`    • ${err}`, COLORS.red);
      });
    }

    // Check console warnings
    const warnings = consoleMessages.filter((m) => m.type === 'warning');
    if (warnings.length === 0) {
      logTest('No console warnings', 'pass');
    } else {
      logTest('Console warnings found', 'warn', `${warnings.length} warnings`);
    }

    // Check console errors
    const errors = consoleMessages.filter((m) => m.type === 'error');
    if (errors.length === 0) {
      logTest('No console errors', 'pass');
    } else {
      logTest('Console errors found', 'fail', `${errors.length} errors`);
    }
  } catch (error) {
    logTest('JavaScript test failed', 'fail', error.message);
  }
}

// Test Suite 5: Performance Metrics
async function test5_PerformanceMetrics(page) {
  logSection('5. Performance Metrics Tests');

  try {
    const performanceMetrics = await page.evaluate(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0];
      const paintEntries = window.performance.getEntriesByType('paint');

      return {
        domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
        loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart,
        domInteractive: perfData?.domInteractive - perfData?.fetchStart,
        firstPaint: paintEntries.find((e) => e.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintEntries.find((e) => e.name === 'first-contentful-paint')
          ?.startTime,
      };
    });

    Object.assign(testResults.performanceMetrics, performanceMetrics);

    // DOM Content Loaded
    if (performanceMetrics.domContentLoaded < 1000) {
      logTest('DOM Content Loaded', 'pass', `${performanceMetrics.domContentLoaded.toFixed(0)}ms`);
    } else {
      logTest(
        'DOM Content Loaded',
        'warn',
        `${performanceMetrics.domContentLoaded.toFixed(0)}ms (slow)`
      );
    }

    // First Contentful Paint
    if (performanceMetrics.firstContentfulPaint < 1500) {
      logTest(
        'First Contentful Paint',
        'pass',
        `${performanceMetrics.firstContentfulPaint.toFixed(0)}ms`
      );
    } else if (performanceMetrics.firstContentfulPaint < 3000) {
      logTest(
        'First Contentful Paint',
        'warn',
        `${performanceMetrics.firstContentfulPaint.toFixed(0)}ms`
      );
    } else {
      logTest(
        'First Contentful Paint',
        'fail',
        `${performanceMetrics.firstContentfulPaint.toFixed(0)}ms (too slow)`
      );
    }

    // Get Core Web Vitals
    const cwv = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
          }
        }).observe({ type: 'first-input', buffered: true });

        setTimeout(() => resolve(vitals), 3000);
      });
    });

    if (cwv.fid !== undefined) {
      testResults.performanceMetrics.firstInputDelay = cwv.fid;
      if (cwv.fid < 100) {
        logTest('First Input Delay', 'pass', `${cwv.fid.toFixed(0)}ms`);
      } else {
        logTest('First Input Delay', 'warn', `${cwv.fid.toFixed(0)}ms`);
      }
    } else {
      logTest('First Input Delay', 'warn', 'Not measured (no user interaction)');
    }
  } catch (error) {
    logTest('Performance metrics test failed', 'fail', error.message);
  }
}

// Test Suite 6: Accessibility Basics
async function test6_AccessibilityBasics(page) {
  logSection('6. Accessibility Basics Tests');

  try {
    // Check for alt texts on images
    const imagesWithoutAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter((img) => !img.alt || img.alt.trim() === '').length;
    });

    if (imagesWithoutAlt === 0) {
      logTest('All images have alt text', 'pass');
    } else {
      logTest('Images without alt text', 'warn', `${imagesWithoutAlt} images`);
    }

    // Check for form labels
    const inputsWithoutLabels = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll('input:not([type="hidden"]), textarea, select')
      );
      return inputs.filter((input) => {
        const id = input.id;
        if (!id) return true;
        const label = document.querySelector(`label[for="${id}"]`);
        return !label && !input.getAttribute('aria-label');
      }).length;
    });

    if (inputsWithoutLabels === 0) {
      logTest('All form inputs have labels', 'pass');
    } else {
      logTest('Form inputs without labels', 'warn', `${inputsWithoutLabels} inputs`);
    }

    // Check for headings structure
    const headings = await page.evaluate(() => {
      const h1s = document.querySelectorAll('h1').length;
      const h2s = document.querySelectorAll('h2').length;
      const h3s = document.querySelectorAll('h3').length;
      return { h1s, h2s, h3s };
    });

    if (headings.h1s === 1) {
      logTest('Single H1 heading', 'pass');
    } else if (headings.h1s === 0) {
      logTest('No H1 heading found', 'fail');
    } else {
      logTest('Multiple H1 headings', 'warn', `${headings.h1s} H1s`);
    }

    if (headings.h2s > 0) {
      logTest('H2 headings present', 'pass', `${headings.h2s} H2s`);
    } else {
      logTest('No H2 headings', 'warn');
    }

    // Check for ARIA landmarks
    const landmarks = await page.evaluate(() => {
      return {
        nav: document.querySelectorAll('nav, [role="navigation"]').length,
        main: document.querySelectorAll('main, [role="main"]').length,
        footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
      };
    });

    if (landmarks.main > 0) {
      logTest('Main landmark present', 'pass');
    } else {
      logTest('Main landmark missing', 'warn');
    }

    if (landmarks.nav > 0) {
      logTest('Navigation landmark present', 'pass');
    } else {
      logTest('Navigation landmark missing', 'warn');
    }
  } catch (error) {
    logTest('Accessibility test failed', 'fail', error.message);
  }
}

// Generate HTML Report
async function generateHTMLReport() {
  const reportHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staging Test Report - ${new Date().toISOString()}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-top: 0; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
    .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card h3 { margin: 0; font-size: 2em; }
    .summary-card p { margin: 5px 0 0; color: #666; }
    .pass { background: #d4edda; color: #155724; }
    .fail { background: #f8d7da; color: #721c24; }
    .warn { background: #fff3cd; color: #856404; }
    .test-list { margin: 20px 0; }
    .test-item { padding: 10px; margin: 5px 0; border-left: 4px solid #ccc; background: #f9f9f9; }
    .test-item.pass { border-color: #28a745; }
    .test-item.fail { border-color: #dc3545; }
    .test-item.warn { border-color: #ffc107; }
    .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
    .screenshot { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
    .screenshot img { width: 100%; height: auto; border-radius: 4px; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
    .metric { padding: 15px; background: #f0f0f0; border-radius: 4px; }
    .metric h4 { margin: 0 0 5px; color: #333; }
    .metric p { margin: 0; font-size: 1.2em; font-weight: bold; color: #0066cc; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 Staging Server Test Report</h1>
    <p><strong>URL:</strong> ${STAGING_URL}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString('ru-RU')}</p>
    
    <h2>Summary</h2>
    <div class="summary">
      <div class="summary-card">
        <h3>${testResults.total}</h3>
        <p>Total Tests</p>
      </div>
      <div class="summary-card pass">
        <h3>${testResults.passed}</h3>
        <p>Passed</p>
      </div>
      <div class="summary-card fail">
        <h3>${testResults.failed}</h3>
        <p>Failed</p>
      </div>
      <div class="summary-card warn">
        <h3>${testResults.warnings}</h3>
        <p>Warnings</p>
      </div>
    </div>

    <h2>Performance Metrics</h2>
    <div class="metrics">
      ${Object.entries(testResults.performanceMetrics)
        .map(
          ([key, value]) => `
        <div class="metric">
          <h4>${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</h4>
          <p>${typeof value === 'number' ? value.toFixed(2) : value}</p>
        </div>
      `
        )
        .join('')}
    </div>

    <h2>Test Results</h2>
    <div class="test-list">
      ${testResults.tests
        .map(
          (test) => `
        <div class="test-item ${test.status}">
          <strong>${test.name}</strong>
          ${test.details ? `<br><small>${test.details}</small>` : ''}
        </div>
      `
        )
        .join('')}
    </div>

    <h2>Screenshots</h2>
    <div class="screenshots">
      ${testResults.screenshots
        .map(
          (screenshot) => `
        <div class="screenshot">
          <h4>${screenshot.name}</h4>
          <img src="${path.basename(screenshot.path)}" alt="${screenshot.name}" loading="lazy">
        </div>
      `
        )
        .join('')}
    </div>
  </div>
</body>
</html>`;

  const reportPath = path.join(REPORT_DIR, `staging-test-report-${Date.now()}.html`);
  await writeFile(reportPath, reportHTML);
  return reportPath;
}

// Print Summary
function printSummary() {
  logSection('Test Summary');

  const passRate =
    testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(1) : 0;

  console.log(`Total Tests:    ${testResults.total}`);
  log(`Passed:         ${testResults.passed}`, COLORS.green);
  log(`Failed:         ${testResults.failed}`, COLORS.red);
  log(`Warnings:       ${testResults.warnings}`, COLORS.yellow);
  log(`Pass Rate:      ${passRate}%`, passRate >= 80 ? COLORS.green : COLORS.yellow);
  log(`Screenshots:    ${testResults.screenshots.length}`, COLORS.cyan);

  console.log('\n' + '='.repeat(70) + '\n');

  if (testResults.failed === 0 && testResults.warnings === 0) {
    log('✓ All tests passed successfully!', COLORS.green + COLORS.bright);
  } else if (testResults.failed === 0) {
    log('⚠ Tests passed with warnings', COLORS.yellow + COLORS.bright);
  } else {
    log('✗ Some tests failed', COLORS.red + COLORS.bright);
  }
}

// Main execution
async function main() {
  log('\n🚀 Starting Advanced Puppeteer Staging Tests', COLORS.bright + COLORS.cyan);
  log(`Testing URL: ${STAGING_URL}\n`, COLORS.blue);

  await ensureDirectories();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();

    await test1_PageLoadAndRendering(page);
    await test2_InteractiveElements(page);
    await test3_VisualAndLayout(page);
    await test4_JavaScriptAndConsole(page);
    await test5_PerformanceMetrics(page);
    await test6_AccessibilityBasics(page);

    printSummary();

    // Generate HTML report
    const reportPath = await generateHTMLReport();
    log(`\n📊 HTML Report generated: ${reportPath}`, COLORS.cyan);
    log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}`, COLORS.cyan);

    await browser.close();

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, COLORS.red);
    console.error(error);
    await browser.close();
    process.exit(1);
  }
}

main();
