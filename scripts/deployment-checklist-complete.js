#!/usr/bin/env node

/**
 * Comprehensive Deployment Checklist
 * 
 * This script provides a detailed checklist for production deployment
 * with automatic validation where possible.
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
  header: (msg) => console.log(`${COLORS.MAGENTA}${msg}${COLORS.RESET}`),
  item: (status, msg) => {
    const statusIcon = status === 'success' ? '✅' : status === 'warn' ? '⚠' : '❌';
    const statusColor = status === 'success' ? COLORS.GREEN : status === 'warn' ? COLORS.YELLOW : COLORS.RED;
    console.log(`${statusColor}${statusIcon} ${msg}${COLORS.RESET}`);
  }
};

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Read file content
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Check environment variables
function checkEnvVars() {
  const requiredVars = [
    'BITRIX24_WEBHOOK_URL',
    'PUBLIC_SITE_URL',
    'PUBLIC_SITE_PHONE',
    'PUBLIC_SITE_EMAIL'
  ];
  
  const missingVars = [];
  for (const envVar of requiredVars) {
    if (!process.env[envVar] || process.env[envVar].trim() === '') {
      missingVars.push(envVar);
    }
  }
  
  return missingVars;
}

// Validate URL format
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validate phone number format (Russian format)
function validatePhone(phone) {
  const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  return phoneRegex.test(phone);
}

// Validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Comprehensive deployment checklist
async function deploymentChecklist() {
  log.header('🚀 ZeroDolg Astro - Comprehensive Deployment Checklist');
  log.info('Performing pre-deployment validation...\n');
  
  let allChecksPassed = true;
  
  // 1. Environment Variables
  log.header('1. Environment Variables');
  
  // Check if .env file exists
  if (fileExists(path.resolve('.env'))) {
    log.item('success', '.env file exists');
  } else {
    log.item('warn', '.env file not found (will be created during setup)');
  }
  
  // Check required environment variables
  const missingEnvVars = checkEnvVars();
  if (missingEnvVars.length === 0) {
    log.item('success', 'All required environment variables are set');
  } else {
    log.item('error', `Missing required environment variables: ${missingEnvVars.join(', ')}`);
    allChecksPassed = false;
  }
  
  // Validate specific environment variables
  if (process.env.BITRIX24_WEBHOOK_URL) {
    if (validateUrl(process.env.BITRIX24_WEBHOOK_URL)) {
      log.item('success', 'BITRIX24_WEBHOOK_URL format is valid');
    } else {
      log.item('error', 'BITRIX24_WEBHOOK_URL format is invalid');
      allChecksPassed = false;
    }
  }
  
  if (process.env.PUBLIC_SITE_URL) {
    if (validateUrl(process.env.PUBLIC_SITE_URL)) {
      log.item('success', 'PUBLIC_SITE_URL format is valid');
    } else {
      log.item('error', 'PUBLIC_SITE_URL format is invalid');
      allChecksPassed = false;
    }
  }
  
  if (process.env.PUBLIC_SITE_PHONE) {
    if (validatePhone(process.env.PUBLIC_SITE_PHONE)) {
      log.item('success', 'PUBLIC_SITE_PHONE format is valid');
    } else {
      log.item('error', 'PUBLIC_SITE_PHONE format is invalid');
      allChecksPassed = false;
    }
  }
  
  if (process.env.PUBLIC_SITE_EMAIL) {
    if (validateEmail(process.env.PUBLIC_SITE_EMAIL)) {
      log.item('success', 'PUBLIC_SITE_EMAIL format is valid');
    } else {
      log.item('error', 'PUBLIC_SITE_EMAIL format is invalid');
      allChecksPassed = false;
    }
  }
  
  // 2. Code & Dependencies
  log.header('\n2. Code & Dependencies');
  
  // Check package.json
  if (fileExists(path.resolve('package.json'))) {
    log.item('success', 'package.json file exists');
  } else {
    log.item('error', 'package.json file not found');
    allChecksPassed = false;
  }
  
  // Check node_modules
  if (fileExists(path.resolve('node_modules'))) {
    log.item('success', 'Dependencies installed (node_modules exists)');
  } else {
    log.item('warn', 'Dependencies not installed (run npm install)');
  }
  
  // 3. Build Process
  log.header('\n3. Build Process');
  
  // Check build scripts
  try {
    const packageJson = JSON.parse(readFile(path.resolve('package.json')));
    const buildScripts = ['build', 'build:prod', 'build:production'];
    const missingScripts = [];
    
    for (const script of buildScripts) {
      if (!packageJson.scripts[script]) {
        missingScripts.push(script);
      }
    }
    
    if (missingScripts.length === 0) {
      log.item('success', 'All required build scripts are defined');
    } else {
      log.item('warn', `Missing build scripts: ${missingScripts.join(', ')}`);
    }
  } catch (error) {
    log.item('error', 'Failed to parse package.json');
    allChecksPassed = false;
  }
  
  // 4. Security
  log.header('\n4. Security');
  
  // Check .env in .gitignore
  if (fileExists(path.resolve('.gitignore'))) {
    const gitignoreContent = readFile(path.resolve('.gitignore'));
    if (gitignoreContent.includes('.env')) {
      log.item('success', '.env file is properly ignored');
    } else {
      log.item('error', '.env file is not in .gitignore');
      allChecksPassed = false;
    }
  } else {
    log.item('warn', '.gitignore file not found');
  }
  
  // Check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    log.item('success', 'NODE_ENV is set to "production"');
  } else {
    log.item('warn', 'NODE_ENV is not set to "production"');
  }
  
  // 5. Performance
  log.header('\n5. Performance');
  
  // Check for performance optimization scripts
  const perfScripts = [
    'scripts/build-production.js',
    'scripts/post-build-verification.js'
  ];
  
  for (const script of perfScripts) {
    if (fileExists(path.resolve(script))) {
      log.item('success', `Performance script exists: ${script}`);
    } else {
      log.item('warn', `Performance script missing: ${script}`);
    }
  }
  
  // 6. Analytics & Monitoring
  log.header('\n6. Analytics & Monitoring');
  
  const analyticsVars = ['PUBLIC_GA_ID', 'PUBLIC_YM_ID'];
  const configuredAnalytics = [];
  
  for (const envVar of analyticsVars) {
    if (process.env[envVar]) {
      configuredAnalytics.push(envVar);
    }
  }
  
  if (configuredAnalytics.length > 0) {
    log.item('success', `Analytics configured: ${configuredAnalytics.join(', ')}`);
  } else {
    log.item('warn', 'No analytics services configured');
  }
  
  // 7. Content & SEO
  log.header('\n7. Content & SEO');
  
  // Check for essential SEO files
  const seoFiles = ['robots.txt', 'sitemap.xml'];
  for (const file of seoFiles) {
    const filePath = path.resolve('public', file);
    if (fileExists(filePath)) {
      log.item('success', `SEO file exists: ${file}`);
    } else {
      log.item('warn', `SEO file missing: ${file}`);
    }
  }
  
  // 8. Deployment
  log.header('\n8. Deployment');
  
  // Check deployment scripts
  const deployScripts = [
    'scripts/rollback.js',
    'scripts/create-backup.js'
  ];
  
  for (const script of deployScripts) {
    if (fileExists(path.resolve(script))) {
      log.item('success', `Deployment script exists: ${script}`);
    } else {
      log.item('warn', `Deployment script missing: ${script}`);
    }
  }
  
  // Final status
  log.header('\n📋 Final Status');
  
  if (allChecksPassed) {
    log.success('All critical checks passed! Ready for deployment.');
    log.info('\n📝 Next steps:');
    log.info('  1. Run "npm run build:production" to create production build');
    log.info('  2. Run "npm run deploy:verify" to verify the build');
    log.info('  3. Deploy the contents of the "dist/" directory');
    log.info('  4. Run "npm run deploy:backup" to create a backup');
  } else {
    log.error('Some checks failed. Please address the issues before deployment.');
    log.info('\n🔧 Recommended actions:');
    log.info('  1. Run "npm run env:setup" to set up environment variables');
    log.info('  2. Run "npm run env:validate" to validate configuration');
    log.info('  3. Fix any reported errors');
    log.info('  4. Re-run this checklist');
  }
}

// Run the checklist
if (import.meta.url === `file://${process.argv[1]}`) {
  deploymentChecklist();
}

export default deploymentChecklist;