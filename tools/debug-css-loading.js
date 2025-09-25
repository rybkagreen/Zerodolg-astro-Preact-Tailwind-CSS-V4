#!/usr/bin/env node

/**
 * CSS Loading Debug Script
 * Analyzes why styles are loaded but not applied
 */

import PuppeteerHelper from './src/lib/puppeteer-helper.js';
import { promises as fs } from 'fs';

const LOCAL_URL = 'http://localhost:4321';

async function debugCSSLoading() {
  console.log('🔍 CSS Loading Debug Analysis...');
  console.log(`🏠 Target: ${LOCAL_URL}\n`);

  const browser = new PuppeteerHelper();

  try {
    await browser.init();
    const page = browser.getPage();

    // Track network requests
    const networkRequests = [];
    const failedRequests = [];

    page.on('request', (request) => {
      if (request.url().includes('.css') || request.resourceType() === 'stylesheet') {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          resourceType: request.resourceType(),
        });
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('.css') || response.url().includes('style')) {
        const request = {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          ok: response.ok(),
        };

        if (!response.ok()) {
          failedRequests.push(request);
        }
      }
    });

    page.on('requestfailed', (request) => {
      if (request.url().includes('.css')) {
        failedRequests.push({
          url: request.url(),
          error: request.failure()?.errorText,
          resourceType: request.resourceType(),
        });
      }
    });

    console.log('🌐 Navigating to local site...');
    await browser.navigateTo(LOCAL_URL);
    await page.waitForSelector('body', { timeout: 10000 });

    // Wait for additional resources to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('\n📡 Network Analysis:');
    console.log(`   CSS requests made: ${networkRequests.length}`);
    console.log(`   Failed CSS requests: ${failedRequests.length}`);

    if (failedRequests.length > 0) {
      console.log('\n❌ Failed CSS Requests:');
      failedRequests.forEach((req) => {
        console.log(`   • ${req.url}`);
        console.log(`     Status: ${req.status || 'Failed'} - ${req.statusText || req.error}`);
      });
    }

    // Detailed CSS analysis
    const cssAnalysis = await page.evaluate(() => {
      const analysis = {
        stylesheets: [],
        computedStyles: {},
        bodyStyles: {},
        cssRules: [],
        domReady: document.readyState,
        hasCustomStyles: false,
        issues: [],
      };

      // Check all stylesheets
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        const sheetInfo = {
          href: sheet.href,
          title: sheet.title,
          media: sheet.media ? Array.from(sheet.media) : [],
          disabled: sheet.disabled,
          type: sheet.type,
          rules: 0,
          accessible: true,
        };

        try {
          if (sheet.cssRules) {
            sheetInfo.rules = sheet.cssRules.length;
            // Sample a few rules
            const sampleRules = [];
            for (let j = 0; j < Math.min(5, sheet.cssRules.length); j++) {
              const rule = sheet.cssRules[j];
              sampleRules.push({
                selector: rule.selectorText || rule.type,
                cssText: rule.cssText ? rule.cssText.substring(0, 100) : '',
              });
            }
            sheetInfo.sampleRules = sampleRules;
            analysis.cssRules.push(...sampleRules);
          }
        } catch (e) {
          sheetInfo.accessible = false;
          sheetInfo.error = e.message;
          analysis.issues.push(`Cannot access rules for ${sheet.href}: ${e.message}`);
        }

        analysis.stylesheets.push(sheetInfo);
      }

      // Body styles analysis
      const bodyEl = document.body;
      const bodyStyles = window.getComputedStyle(bodyEl);

      analysis.bodyStyles = {
        backgroundColor: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily,
        fontSize: bodyStyles.fontSize,
        margin: bodyStyles.margin,
        padding: bodyStyles.padding,
        width: bodyStyles.width,
        height: bodyStyles.height,
        display: bodyStyles.display,
        position: bodyStyles.position,
      };

      // Check if any custom styles are applied
      analysis.hasCustomStyles =
        bodyStyles.fontFamily.toLowerCase().includes('inter') ||
        bodyStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
        bodyStyles.color !== 'rgb(0, 0, 0)' ||
        bodyStyles.margin !== '8px';

      // Check specific elements that should be styled
      const testElements = [
        { selector: 'h1', expected: 'custom font or color' },
        { selector: '.hero', expected: 'should exist and be styled' },
        { selector: 'header', expected: 'should have background or padding' },
        { selector: 'button', expected: 'should have custom styling' },
      ];

      analysis.elementTests = [];
      testElements.forEach((test) => {
        const elements = document.querySelectorAll(test.selector);
        if (elements.length > 0) {
          const element = elements[0];
          const styles = window.getComputedStyle(element);
          analysis.elementTests.push({
            selector: test.selector,
            found: true,
            count: elements.length,
            styles: {
              color: styles.color,
              backgroundColor: styles.backgroundColor,
              fontFamily: styles.fontFamily,
              fontSize: styles.fontSize,
              padding: styles.padding,
              margin: styles.margin,
            },
            hasCustomStyling:
              styles.fontFamily.toLowerCase().includes('inter') ||
              styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
              styles.color !== 'rgb(0, 0, 0)' ||
              styles.padding !== '0px' ||
              styles.fontSize !== '16px',
          });
        } else {
          analysis.elementTests.push({
            selector: test.selector,
            found: false,
            count: 0,
          });
        }
      });

      // Check for FOUC (Flash of Unstyled Content)
      analysis.fouc = {
        hasHiddenElements:
          document.querySelectorAll('[style*="visibility: hidden"], [style*="opacity: 0"]').length >
          0,
        hasLoadingClasses: document.querySelectorAll('.loading, .load, .spinner').length > 0,
      };

      // Check CSS media queries
      analysis.mediaQueries = [];
      try {
        for (const sheet of document.styleSheets) {
          if (sheet.cssRules) {
            for (const rule of sheet.cssRules) {
              if (rule.type === CSSRule.MEDIA_RULE) {
                analysis.mediaQueries.push({
                  media: rule.media.mediaText,
                  rules: rule.cssRules.length,
                });
              }
            }
          }
        }
      } catch (e) {
        analysis.issues.push('Cannot analyze media queries: ' + e.message);
      }

      return analysis;
    });

    // Take screenshots for comparison
    await browser.takeScreenshot('./screenshots/debug-css-current-state.png');
    console.log('📸 Current state screenshot saved');

    // Generate detailed report
    console.log('\n📋 DETAILED CSS DEBUG REPORT:\n');

    console.log('🔗 Stylesheet Analysis:');
    cssAnalysis.stylesheets.forEach((sheet, index) => {
      console.log(`   ${index + 1}. ${sheet.href || 'Inline styles'}`);
      console.log(
        `      Rules: ${sheet.rules} | Disabled: ${sheet.disabled} | Accessible: ${sheet.accessible}`
      );
      console.log(`      Media: ${sheet.media.join(', ') || 'all'}`);

      if (!sheet.accessible) {
        console.log(`      ❌ Error: ${sheet.error}`);
      }

      if (sheet.sampleRules && sheet.sampleRules.length > 0) {
        console.log(`      Sample rules: ${sheet.sampleRules[0].selector || 'N/A'}`);
      }
    });

    console.log(`\n🎨 Body Element Styles:`);
    console.log(`   Font: ${cssAnalysis.bodyStyles.fontFamily}`);
    console.log(`   Background: ${cssAnalysis.bodyStyles.backgroundColor}`);
    console.log(`   Color: ${cssAnalysis.bodyStyles.color}`);
    console.log(`   Margin: ${cssAnalysis.bodyStyles.margin}`);
    console.log(`   Custom styles applied: ${cssAnalysis.hasCustomStyles ? '✅' : '❌'}`);

    console.log(`\n🧪 Element Tests:`);
    cssAnalysis.elementTests.forEach((test) => {
      if (test.found) {
        console.log(`   ${test.selector}: Found ${test.count} elements`);
        console.log(`      Custom styling: ${test.hasCustomStyling ? '✅' : '❌'}`);
        console.log(`      Font: ${test.styles.fontFamily}`);
        console.log(`      Color: ${test.styles.color}`);
      } else {
        console.log(`   ${test.selector}: ❌ Not found`);
      }
    });

    console.log(`\n⚡ Performance & Loading:`);
    console.log(`   DOM Ready State: ${cssAnalysis.domReady}`);
    console.log(
      `   FOUC indicators: ${cssAnalysis.fouc.hasHiddenElements || cssAnalysis.fouc.hasLoadingClasses ? '⚠️' : '✅'}`
    );
    console.log(`   Media queries: ${cssAnalysis.mediaQueries.length}`);

    if (cssAnalysis.issues.length > 0) {
      console.log(`\n🚨 Issues Found:`);
      cssAnalysis.issues.forEach((issue) => {
        console.log(`   • ${issue}`);
      });
    }

    // Diagnosis and recommendations
    console.log(`\n🔍 DIAGNOSIS:\n`);

    if (cssAnalysis.stylesheets.length === 0) {
      console.log('❌ CRITICAL: No stylesheets found at all');
    } else if (cssAnalysis.stylesheets.every((s) => s.rules === 0)) {
      console.log('❌ CRITICAL: Stylesheets found but contain no rules');
      console.log('   → CSS files might be empty or failed to load content');
    } else if (!cssAnalysis.hasCustomStyles) {
      console.log('❌ PROBLEM: CSS rules exist but not applied to body');
      console.log('   → Possible causes:');
      console.log('     • CSS specificity issues');
      console.log('     • Wrong CSS selectors');
      console.log('     • CSS syntax errors preventing execution');
      console.log('     • Missing CSS reset/normalize');
      console.log('     • FOUC (Flash of Unstyled Content)');
    } else {
      console.log('✅ CSS appears to be loading and applying correctly');
    }

    // Save detailed JSON report
    const fullReport = {
      timestamp: new Date().toISOString(),
      url: LOCAL_URL,
      networkRequests,
      failedRequests,
      cssAnalysis,
    };

    await fs.writeFile(
      './screenshots/css-debug-detailed.json',
      JSON.stringify(fullReport, null, 2)
    );
    console.log(`\n📄 Full report saved to: ./screenshots/css-debug-detailed.json`);
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugCSSLoading().catch(console.error);
