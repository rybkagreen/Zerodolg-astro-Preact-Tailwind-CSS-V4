#!/usr/bin/env node

/**
 * Automated Staging Server Testing Script
 * Проводит комплексное тестирование staging сервера
 */

import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';

const execAsync = promisify(exec);

const STAGING_URL = process.env.STAGING_URL || 'http://localhost:3000';
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
    skip: '○',
  }[status];

  const statusColor = {
    pass: COLORS.green,
    fail: COLORS.red,
    warn: COLORS.yellow,
    skip: COLORS.blue,
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

// Utility functions
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isUrlAccessible(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
    return { accessible: true, status: response.status, statusText: response.statusText };
  } catch (error) {
    return { accessible: false, error: error.message };
  }
}

async function getPageContent(url) {
  try {
    const response = await fetch(url, { timeout: 10000 });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

async function checkDockerStatus() {
  try {
    const { stdout } = await execAsync('docker ps --format "{{.Names}}"');
    const containers = stdout.trim().split('\n').filter(Boolean);
    return {
      running: true,
      containers: containers,
      zerodolgRunning: containers.some((c) => c.includes('zerodolg')),
    };
  } catch (error) {
    return { running: false, error: error.message };
  }
}

// Test suites
async function test1_PrerequisitesCheck() {
  logSection('1. Prerequisites Check');

  // Check Docker
  const dockerStatus = await checkDockerStatus();
  if (dockerStatus.running) {
    if (dockerStatus.zerodolgRunning) {
      logTest(
        'Docker is running with zerodolg containers',
        'pass',
        dockerStatus.containers.join(', ')
      );
    } else {
      logTest(
        'Docker is running but zerodolg containers not found',
        'warn',
        'Containers: ' + dockerStatus.containers.join(', ')
      );
    }
  } else {
    logTest('Docker check failed', 'fail', dockerStatus.error);
  }

  // Check Node.js version
  try {
    const { stdout } = await execAsync('node --version');
    const version = stdout.trim();
    const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
    if (majorVersion >= 18) {
      logTest('Node.js version check', 'pass', version);
    } else {
      logTest('Node.js version check', 'warn', `${version} (recommended: 18+)`);
    }
  } catch (error) {
    logTest('Node.js check failed', 'fail', error.message);
  }
}

async function test2_ServerAccessibility() {
  logSection('2. Server Accessibility Tests');

  // Test main URL
  const mainUrl = await isUrlAccessible(STAGING_URL);
  if (mainUrl.accessible && mainUrl.status === 200) {
    logTest('Main page accessible', 'pass', `HTTP ${mainUrl.status}`);
  } else if (mainUrl.accessible) {
    logTest('Main page accessible with issues', 'warn', `HTTP ${mainUrl.status}`);
  } else {
    logTest('Main page not accessible', 'fail', mainUrl.error);
    return; // Stop if main page is not accessible
  }

  // Test health endpoint
  const healthUrl = await isUrlAccessible(`${STAGING_URL}/health`);
  if (healthUrl.accessible && healthUrl.status === 200) {
    logTest('Health check endpoint', 'pass', `HTTP ${healthUrl.status}`);
  } else {
    logTest('Health check endpoint', 'warn', healthUrl.error || `HTTP ${healthUrl.status}`);
  }

  // Test robots.txt
  const robotsUrl = await isUrlAccessible(`${STAGING_URL}/robots.txt`);
  if (robotsUrl.accessible && robotsUrl.status === 200) {
    logTest('robots.txt accessible', 'pass');
  } else {
    logTest('robots.txt not accessible', 'warn');
  }

  // Test sitemap.xml
  const sitemapUrl = await isUrlAccessible(`${STAGING_URL}/sitemap.xml`);
  if (sitemapUrl.accessible && sitemapUrl.status === 200) {
    logTest('sitemap.xml accessible', 'pass');
  } else {
    logTest('sitemap.xml not accessible', 'warn');
  }
}

async function test3_CriticalPages() {
  logSection('3. Critical Pages Tests');

  const criticalPages = [
    { path: '/', name: 'Главная страница' },
    { path: '/restrukturizaciya-dolgov', name: 'Реструктуризация долгов' },
    { path: '/blog', name: 'Блог' },
    { path: '/privacy', name: 'Privacy Policy' },
    { path: '/terms', name: 'Terms of Service' },
  ];

  for (const page of criticalPages) {
    const url = `${STAGING_URL}${page.path}`;
    const result = await isUrlAccessible(url);

    if (result.accessible && result.status === 200) {
      logTest(`${page.name} (${page.path})`, 'pass', `HTTP ${result.status}`);
    } else if (result.accessible) {
      logTest(`${page.name} (${page.path})`, 'warn', `HTTP ${result.status}`);
    } else {
      logTest(`${page.name} (${page.path})`, 'fail', result.error);
    }

    await delay(100); // Small delay between requests
  }
}

async function test4_ContentValidation() {
  logSection('4. Content Validation Tests');

  try {
    const content = await getPageContent(STAGING_URL);

    // Check for DOCTYPE
    if (content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>')) {
      logTest('DOCTYPE declaration present', 'pass');
    } else {
      logTest('DOCTYPE declaration missing', 'fail');
    }

    // Check for charset
    if (content.includes('charset="utf-8"') || content.includes("charset='utf-8'")) {
      logTest('UTF-8 charset declared', 'pass');
    } else {
      logTest('UTF-8 charset not found', 'warn');
    }

    // Check for viewport meta tag
    if (content.includes('name="viewport"')) {
      logTest('Viewport meta tag present', 'pass');
    } else {
      logTest('Viewport meta tag missing', 'fail');
    }

    // Check for title tag
    if (content.includes('<title>') && content.includes('</title>')) {
      const titleMatch = content.match(/<title>(.*?)<\/title>/);
      if (titleMatch && titleMatch[1].trim().length > 0) {
        logTest('Title tag present', 'pass', titleMatch[1].substring(0, 50));
      } else {
        logTest('Title tag empty', 'warn');
      }
    } else {
      logTest('Title tag missing', 'fail');
    }

    // Check for description meta tag
    if (content.includes('name="description"')) {
      logTest('Meta description present', 'pass');
    } else {
      logTest('Meta description missing', 'warn');
    }

    // Check for Open Graph tags
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
    const foundOgTags = ogTags.filter((tag) => content.includes(`property="${tag}"`));
    if (foundOgTags.length >= 4) {
      logTest('Open Graph tags', 'pass', `${foundOgTags.length}/5 tags found`);
    } else if (foundOgTags.length > 0) {
      logTest('Open Graph tags incomplete', 'warn', `${foundOgTags.length}/5 tags found`);
    } else {
      logTest('Open Graph tags missing', 'fail');
    }

    // Check for canonical URL
    if (content.includes('rel="canonical"')) {
      logTest('Canonical URL present', 'pass');
    } else {
      logTest('Canonical URL missing', 'warn');
    }

    // Check for no JavaScript errors indicators
    if (content.includes('onerror') || content.includes('window.error')) {
      logTest('JavaScript error handlers found', 'warn', 'Check console for actual errors');
    } else {
      logTest('No obvious error handlers in HTML', 'pass');
    }

    // Check for Russian content
    if (content.includes('банкротство') || content.includes('долг')) {
      logTest('Russian content detected', 'pass');
    } else {
      logTest('Russian content not detected', 'warn', 'Check if content is loading correctly');
    }
  } catch (error) {
    logTest('Content validation failed', 'fail', error.message);
  }
}

async function test5_SecurityHeaders() {
  logSection('5. Security Headers Tests');

  try {
    const response = await fetch(STAGING_URL);
    const headers = response.headers;

    // Content-Security-Policy
    if (headers.has('content-security-policy')) {
      logTest('Content-Security-Policy header', 'pass');
    } else {
      logTest('Content-Security-Policy header missing', 'warn');
    }

    // X-Content-Type-Options
    if (headers.get('x-content-type-options') === 'nosniff') {
      logTest('X-Content-Type-Options header', 'pass');
    } else {
      logTest('X-Content-Type-Options header missing/incorrect', 'warn');
    }

    // X-Frame-Options
    if (headers.has('x-frame-options')) {
      logTest('X-Frame-Options header', 'pass', headers.get('x-frame-options'));
    } else {
      logTest('X-Frame-Options header missing', 'warn');
    }

    // Strict-Transport-Security (only for HTTPS)
    if (STAGING_URL.startsWith('https://')) {
      if (headers.has('strict-transport-security')) {
        logTest('Strict-Transport-Security header', 'pass');
      } else {
        logTest('Strict-Transport-Security header missing', 'warn');
      }
    } else {
      logTest('HSTS check skipped', 'skip', 'Not HTTPS');
    }

    // X-XSS-Protection
    if (headers.has('x-xss-protection')) {
      logTest('X-XSS-Protection header', 'pass', headers.get('x-xss-protection'));
    } else {
      logTest('X-XSS-Protection header missing', 'warn');
    }

    // Referrer-Policy
    if (headers.has('referrer-policy')) {
      logTest('Referrer-Policy header', 'pass', headers.get('referrer-policy'));
    } else {
      logTest('Referrer-Policy header missing', 'warn');
    }
  } catch (error) {
    logTest('Security headers check failed', 'fail', error.message);
  }
}

async function test6_PerformanceBasics() {
  logSection('6. Performance Basics Tests');

  try {
    const startTime = Date.now();
    const response = await fetch(STAGING_URL);
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Response time
    if (loadTime < 1000) {
      logTest('Server response time', 'pass', `${loadTime}ms`);
    } else if (loadTime < 3000) {
      logTest('Server response time', 'warn', `${loadTime}ms (slow)`);
    } else {
      logTest('Server response time', 'fail', `${loadTime}ms (too slow)`);
    }

    // Content size
    const content = await response.text();
    const sizeKb = (content.length / 1024).toFixed(2);
    if (sizeKb < 100) {
      logTest('HTML size', 'pass', `${sizeKb} KB`);
    } else if (sizeKb < 200) {
      logTest('HTML size', 'warn', `${sizeKb} KB (consider optimization)`);
    } else {
      logTest('HTML size', 'fail', `${sizeKb} KB (too large)`);
    }

    // Compression
    if (
      response.headers.get('content-encoding') === 'gzip' ||
      response.headers.get('content-encoding') === 'br'
    ) {
      logTest('Content compression', 'pass', response.headers.get('content-encoding'));
    } else {
      logTest('Content compression', 'warn', 'Not detected');
    }

    // Caching headers
    if (response.headers.has('cache-control') || response.headers.has('etag')) {
      logTest('Caching headers present', 'pass');
    } else {
      logTest('Caching headers missing', 'warn');
    }
  } catch (error) {
    logTest('Performance check failed', 'fail', error.message);
  }
}

async function test7_FormEndpoints() {
  logSection('7. Form Endpoints Tests');

  // Note: We're only checking if endpoints exist, not actually submitting
  const formEndpoints = ['/api/contact', '/api/callback', '/api/consultation'];

  for (const endpoint of formEndpoints) {
    const url = `${STAGING_URL}${endpoint}`;
    const result = await isUrlAccessible(url);

    if (result.accessible) {
      logTest(`Form endpoint ${endpoint}`, 'pass', `HTTP ${result.status}`);
    } else {
      logTest(`Form endpoint ${endpoint}`, 'skip', 'Endpoint may not exist or requires POST');
    }

    await delay(100);
  }
}

async function test8_StaticAssets() {
  logSection('8. Static Assets Tests');

  const assets = ['/favicon.ico', '/icons/logo.svg', '/images/og-image.jpg'];

  for (const asset of assets) {
    const url = `${STAGING_URL}${asset}`;
    const result = await isUrlAccessible(url);

    if (result.accessible && result.status === 200) {
      logTest(`Asset ${asset}`, 'pass');
    } else if (result.accessible) {
      logTest(`Asset ${asset}`, 'warn', `HTTP ${result.status}`);
    } else {
      logTest(`Asset ${asset}`, 'skip', 'Not found or optional');
    }

    await delay(100);
  }
}

// Summary report
function printSummary() {
  logSection('Test Summary');

  const passRate =
    testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(1) : 0;

  console.log(`Total Tests:    ${testResults.total}`);
  log(`Passed:         ${testResults.passed}`, COLORS.green);
  log(`Failed:         ${testResults.failed}`, COLORS.red);
  log(`Warnings:       ${testResults.warnings}`, COLORS.yellow);
  log(`Pass Rate:      ${passRate}%`, passRate >= 80 ? COLORS.green : COLORS.yellow);

  console.log('\n' + '='.repeat(70) + '\n');

  if (testResults.failed > 0) {
    log('⚠️  FAILED TESTS:', COLORS.red + COLORS.bright);
    testResults.tests
      .filter((t) => t.status === 'fail')
      .forEach((t) => {
        log(`  • ${t.name}`, COLORS.red);
        if (t.details) log(`    └─ ${t.details}`, COLORS.reset);
      });
    console.log('');
  }

  if (testResults.warnings > 0) {
    log('⚠️  WARNINGS:', COLORS.yellow + COLORS.bright);
    testResults.tests
      .filter((t) => t.status === 'warn')
      .forEach((t) => {
        log(`  • ${t.name}`, COLORS.yellow);
        if (t.details) log(`    └─ ${t.details}`, COLORS.reset);
      });
    console.log('');
  }

  // Final verdict
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
  log('\n🚀 Starting Automated Staging Server Tests', COLORS.bright + COLORS.cyan);
  log(`Testing URL: ${STAGING_URL}\n`, COLORS.blue);

  try {
    await test1_PrerequisitesCheck();
    await test2_ServerAccessibility();
    await test3_CriticalPages();
    await test4_ContentValidation();
    await test5_SecurityHeaders();
    await test6_PerformanceBasics();
    await test7_FormEndpoints();
    await test8_StaticAssets();

    printSummary();

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, COLORS.red);
    console.error(error);
    process.exit(1);
  }
}

main();
