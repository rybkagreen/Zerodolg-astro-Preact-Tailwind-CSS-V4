#!/usr/bin/env node

/**
 * CSS and Styling Diagnostic Script
 * Detailed analysis of local development issues
 */

import PuppeteerHelper from './src/lib/puppeteer-helper.js';
import { promises as fs } from 'fs';

const LOCAL_URL = 'http://localhost:4321';

async function diagnoseLocalSite() {
  console.log('🔍 Starting detailed CSS diagnostic...');
  console.log(`🏠 Local site: ${LOCAL_URL}\n`);

  const browser = new PuppeteerHelper();

  try {
    await browser.init();
    console.log('✅ Browser initialized\n');

    console.log('🌐 Navigating to local site...');
    await browser.navigateTo(LOCAL_URL);

    // Wait for page to load
    await browser.getPage().waitForSelector('body', { timeout: 10000 });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const page = browser.getPage();

    // === CSS DIAGNOSTIC ===
    console.log('🎨 CSS Diagnostic Analysis:');

    const cssAnalysis = await page.evaluate(() => {
      const data = {
        stylesheets: [],
        computedStyles: {},
        loadErrors: [],
        cssRules: 0,
        hasInlineStyles: false,
        bodyStyles: {},
        networkResources: [],
      };

      // Check stylesheets
      const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
      linkElements.forEach((link, index) => {
        data.stylesheets.push({
          href: link.href,
          loaded: link.sheet !== null,
          disabled: link.disabled,
          media: link.media,
          crossOrigin: link.crossOrigin,
          integrity: link.integrity,
        });
      });

      // Check style tags
      const styleTags = document.querySelectorAll('style');
      data.hasInlineStyles = styleTags.length > 0;

      // Count CSS rules
      try {
        for (const sheet of document.styleSheets) {
          if (sheet.cssRules) {
            data.cssRules += sheet.cssRules.length;
          }
        }
      } catch (e) {
        data.loadErrors.push('Cannot access CSS rules: ' + e.message);
      }

      // Body computed styles
      const bodyStyles = window.getComputedStyle(document.body);
      data.bodyStyles = {
        backgroundColor: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily,
        fontSize: bodyStyles.fontSize,
        margin: bodyStyles.margin,
        padding: bodyStyles.padding,
        display: bodyStyles.display,
        width: bodyStyles.width,
        height: bodyStyles.height,
      };

      // Check if styles are actually applied
      data.computedStyles = {
        hasCustomFont: !bodyStyles.fontFamily.includes('Times'),
        hasCustomColors:
          bodyStyles.color !== 'rgb(0, 0, 0)' ||
          (bodyStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            bodyStyles.backgroundColor !== 'rgb(255, 255, 255)'),
        hasLayout:
          bodyStyles.display !== 'block' ||
          bodyStyles.margin !== '8px' ||
          bodyStyles.padding !== '0px',
      };

      return data;
    });

    // === NETWORK REQUESTS ANALYSIS ===
    console.log('\n📡 Network Requests Analysis:');

    // Get all network requests
    const networkLogs = [];
    page.on('response', (response) => {
      if (response.url().includes('.css') || response.url().includes('style')) {
        networkLogs.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          contentType: response.headers()['content-type'] || 'unknown',
        });
      }
    });

    // === SCREENSHOT FOR VISUAL COMPARISON ===
    await browser.takeScreenshot('./screenshots/diagnostic-local-unstyled.png');
    console.log('📸 Diagnostic screenshot saved\n');

    // === DETAILED REPORTING ===
    console.log('📋 DETAILED DIAGNOSTIC RESULTS:\n');

    // Stylesheets check
    console.log('🔗 Stylesheets Found:');
    if (cssAnalysis.stylesheets.length === 0) {
      console.log('   ❌ NO STYLESHEETS FOUND - This is the problem!');
    } else {
      cssAnalysis.stylesheets.forEach((sheet, index) => {
        console.log(`   ${sheet.loaded ? '✅' : '❌'} ${index + 1}. ${sheet.href}`);
        console.log(`      Status: ${sheet.loaded ? 'Loaded' : 'Failed to load'}`);
        console.log(`      Media: ${sheet.media || 'all'}`);
        if (!sheet.loaded) {
          console.log('      🚨 This stylesheet failed to load!');
        }
      });
    }
    console.log('');

    // CSS Rules count
    console.log('📐 CSS Rules Analysis:');
    console.log(`   Total CSS rules: ${cssAnalysis.cssRules}`);
    if (cssAnalysis.cssRules === 0) {
      console.log('   ❌ NO CSS RULES FOUND - Styles are not loading!');
    } else {
      console.log('   ✅ CSS rules are present');
    }
    console.log('');

    // Inline styles
    console.log('🎨 Inline Styles:');
    console.log(`   Has inline <style> tags: ${cssAnalysis.hasInlineStyles ? '✅' : '❌'}`);
    console.log('');

    // Applied styles check
    console.log('🎯 Applied Styles Check:');
    console.log(
      `   Custom font applied: ${cssAnalysis.computedStyles.hasCustomFont ? '✅' : '❌'}`
    );
    console.log(
      `   Custom colors applied: ${cssAnalysis.computedStyles.hasCustomColors ? '✅' : '❌'}`
    );
    console.log(`   Custom layout applied: ${cssAnalysis.computedStyles.hasLayout ? '✅' : '❌'}`);
    console.log('');

    console.log('🖼️ Body Element Styles:');
    Object.entries(cssAnalysis.bodyStyles).forEach(([prop, value]) => {
      console.log(`   ${prop}: ${value}`);
    });
    console.log('');

    // Load errors
    if (cssAnalysis.loadErrors.length > 0) {
      console.log('🚨 Load Errors:');
      cssAnalysis.loadErrors.forEach((error) => {
        console.log(`   ❌ ${error}`);
      });
      console.log('');
    }

    // === POTENTIAL SOLUTIONS ===
    console.log('🔧 POTENTIAL SOLUTIONS:\n');

    if (cssAnalysis.stylesheets.length === 0) {
      console.log('1. ❌ NO STYLESHEETS DETECTED');
      console.log("   Problem: HTML doesn't include CSS files");
      console.log('   Solutions:');
      console.log('   • Check Astro component head section');
      console.log('   • Verify CSS imports in layout files');
      console.log('   • Check build configuration');
      console.log('');
    }

    if (cssAnalysis.cssRules === 0 && cssAnalysis.stylesheets.length > 0) {
      console.log('2. ❌ STYLESHEETS FOUND BUT NO RULES');
      console.log('   Problem: CSS files exist but are empty or failed to load');
      console.log('   Solutions:');
      console.log('   • Check network tab in browser dev tools');
      console.log('   • Verify CSS file paths');
      console.log('   • Check for CORS issues');
      console.log('');
    }

    if (!cssAnalysis.computedStyles.hasCustomFont && !cssAnalysis.computedStyles.hasCustomColors) {
      console.log('3. ❌ DEFAULT BROWSER STYLES ONLY');
      console.log('   Problem: Only default browser styles are applied');
      console.log('   Solutions:');
      console.log('   • Check CSS preprocessing (if using Sass/Less)');
      console.log('   • Verify Astro CSS integration');
      console.log('   • Check for build errors in console');
      console.log('');
    }

    // === GET HTML SOURCE ===
    console.log('📄 HTML Head Analysis:');
    const headContent = await page.evaluate(() => {
      return document.head.innerHTML;
    });

    const cssLinks = headContent.match(/<link[^>]*rel=["\']stylesheet["\'][^>]*>/g) || [];
    const styleBlocks = headContent.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];

    console.log(`   Found ${cssLinks.length} CSS <link> tags`);
    console.log(`   Found ${styleBlocks.length} <style> blocks`);

    if (cssLinks.length === 0 && styleBlocks.length === 0) {
      console.log('   🚨 CRITICAL: No CSS references found in HTML head!');
    }
    console.log('');

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      url: LOCAL_URL,
      cssAnalysis,
      headContent: headContent.substring(0, 1000) + '...',
      cssLinks: cssLinks.map((link) => link.substring(0, 200)),
      styleBlocks: styleBlocks.map((style) => style.substring(0, 200)),
      networkLogs,
    };

    await fs.writeFile('./screenshots/css-diagnostic-report.json', JSON.stringify(report, null, 2));
    console.log('📋 Detailed diagnostic report saved to ./screenshots/css-diagnostic-report.json');
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
    console.log('🧹 Browser closed');
  }
}

// Run diagnostic
diagnoseLocalSite().catch(console.error);
