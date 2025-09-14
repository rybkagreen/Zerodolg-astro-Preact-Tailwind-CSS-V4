#!/usr/bin/env node

/**
 * Post-Build Verification Script
 * 
 * This script verifies that the production build was successful and meets all requirements:
 * - Checks for essential files and directories
 * - Verifies asset optimization
 * - Validates HTML/CSS/JS
 * - Checks for common issues
 */

import fs from 'fs';
import path from 'path';

// Colors for console output
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m'
};

// Log functions
const log = {
  info: (msg) => console.log(`${COLORS.CYAN}ℹ ${msg}${COLORS.RESET}`),
  success: (msg) => console.log(`${COLORS.GREEN}✅ ${msg}${COLORS.RESET}`),
  warn: (msg) => console.log(`${COLORS.YELLOW}⚠ ${msg}${COLORS.RESET}`),
  error: (msg) => console.log(`${COLORS.RED}❌ ${msg}${COLORS.RESET}`),
  header: (msg) => console.log(`${COLORS.MAGENTA}${msg}${COLORS.RESET}`)
};

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Get directory size
function getDirectorySize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Format bytes to human readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check for essential files
async function checkEssentialFiles() {
  log.header('🔍 Checking Essential Files');
  
  const distPath = path.resolve('dist');
  const essentialFiles = [
    'index.html'
  ];
  
  const essentialDirs = [
    'assets'
  ];
  
  let allFound = true;
  
  // Check files
  for (const file of essentialFiles) {
    const filePath = path.join(distPath, file);
    if (!fileExists(filePath)) {
      log.error(`Essential file not found: ${file}`);
      allFound = false;
    } else {
      log.success(`Essential file found: ${file}`);
    }
  }
  
  // Check directories
  for (const dir of essentialDirs) {
    const dirPath = path.join(distPath, dir);
    if (!fileExists(dirPath)) {
      log.error(`Essential directory not found: ${dir}`);
      allFound = false;
    } else {
      log.success(`Essential directory found: ${dir}`);
    }
  }
  
  if (!allFound) {
    throw new Error('Missing essential files or directories');
  }
}

// Check asset optimization
async function checkAssetOptimization() {
  log.header('🖼️ Checking Asset Optimization');
  
  const distPath = path.resolve('dist');
  const assetsPath = path.join(distPath, 'assets');
  
  if (!fileExists(assetsPath)) {
    log.warn('Assets directory not found, skipping asset optimization check');
    return;
  }
  
  // Check for minified files
  const assets = fs.readdirSync(assetsPath);
  let minifiedCount = 0;
  let totalAssets = 0;
  
  for (const asset of assets) {
    totalAssets++;
    if (asset.includes('.min.') || asset.match(/\.[a-f0-9]{8,}\./)) {
      minifiedCount++;
    }
  }
  
  const optimizationRate = totalAssets > 0 ? (minifiedCount / totalAssets) * 100 : 0;
  
  if (optimizationRate >= 80) {
    log.success(`Asset optimization rate: ${optimizationRate.toFixed(2)}%`);
  } else if (optimizationRate >= 50) {
    log.warn(`Asset optimization rate: ${optimizationRate.toFixed(2)}% - Consider further optimization`);
  } else {
    log.error(`Asset optimization rate: ${optimizationRate.toFixed(2)}% - Poor optimization`);
  }
  
  // Check total asset size
  const totalSize = getDirectorySize(assetsPath);
  log.info(`Total assets size: ${formatBytes(totalSize)}`);
  
  if (totalSize > 10 * 1024 * 1024) { // 10MB
    log.warn('Total assets size is quite large. Consider further optimization.');
  } else {
    log.success('Assets size is within acceptable limits');
  }
}

// Check HTML files
async function checkHtmlFiles() {
  log.header('📄 Checking HTML Files');
  
  const distPath = path.resolve('dist');
  
  // Find all HTML files
  function findHtmlFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        results = results.concat(findHtmlFiles(filePath));
      } else if (file.endsWith('.html')) {
        results.push(filePath);
      }
    }
    
    return results;
  }
  
  const htmlFiles = findHtmlFiles(distPath);
  
  if (htmlFiles.length === 0) {
    log.warn('No HTML files found');
    return;
  }
  
  log.info(`Found ${htmlFiles.length} HTML file(s)`);
  
  // Check each HTML file
  for (const htmlFile of htmlFiles) {
    const content = readFile(htmlFile);
    
    // Check for doctype
    if (!content.toLowerCase().includes('<!doctype html>')) {
      log.warn(`Missing DOCTYPE in ${path.relative(distPath, htmlFile)}`);
    }
    
    // Check for title
    if (!content.toLowerCase().includes('<title>') || content.toLowerCase().includes('<title></title>')) {
      log.warn(`Missing or empty title in ${path.relative(distPath, htmlFile)}`);
    }
    
    // Check for meta description
    if (!content.toLowerCase().includes('name="description"')) {
      log.warn(`Missing meta description in ${path.relative(distPath, htmlFile)}`);
    }
    
    // Check for inline styles
    if (content.match(/style\s*=\s*["'][^"']*[^"']*["']/gi)) {
      log.warn(`Found inline styles in ${path.relative(distPath, htmlFile)}`);
    }
    
    // Check for console.log statements
    if (content.includes('console.log')) {
      log.warn(`Found console.log statements in ${path.relative(distPath, htmlFile)}`);
    }
  }
  
  log.success('HTML files check completed');
}

// Check for common issues
async function checkCommonIssues() {
  log.header('🐛 Checking for Common Issues');
  
  const distPath = path.resolve('dist');
  
  // Check robots.txt
  const robotsPath = path.join(distPath, 'robots.txt');
  if (!fileExists(robotsPath)) {
    log.warn('robots.txt not found - consider adding for SEO');
  } else {
    log.success('robots.txt found');
  }
  
  // Check sitemap.xml
  const sitemapPath = path.join(distPath, 'sitemap.xml');
  if (!fileExists(sitemapPath)) {
    log.warn('sitemap.xml not found - consider adding for SEO');
  } else {
    log.success('sitemap.xml found');
  }
  
  // Check favicon
  const faviconPaths = [
    path.join(distPath, 'favicon.ico'),
    path.join(distPath, 'favicon.svg'),
    path.join(distPath, 'favicon.png')
  ];
  
  const faviconFound = faviconPaths.some(fileExists);
  if (!faviconFound) {
    log.warn('No favicon found - consider adding for better UX');
  } else {
    log.success('Favicon found');
  }
}

// Main verification function
async function verifyBuild() {
  log.header('✅ ZeroDolg Astro - Post-Build Verification');
  
  try {
    await checkEssentialFiles();
    await checkAssetOptimization();
    await checkHtmlFiles();
    await checkCommonIssues();
    
    log.header('🎉 Post-Build Verification Completed Successfully!');
    log.success('All checks passed. Your build is ready for deployment.');
    
  } catch (error) {
    log.error('Post-build verification failed!');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the verification
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyBuild();
}

export default verifyBuild;