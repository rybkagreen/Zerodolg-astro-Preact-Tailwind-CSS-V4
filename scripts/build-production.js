#!/usr/bin/env node

/**
 * Production Build Script with All Optimizations
 * 
 * This script performs a complete production build with all optimizations enabled:
 * - Environment validation
 * - Code linting and type checking
 * - Asset optimization
 * - Security checks
 * - Performance optimizations
 */

import { spawn } from 'child_process';
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

// Execute a command and return a promise
function execCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log.info(`Executing: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Pre-build validation checks
async function preBuildValidation() {
  log.header('🔍 Pre-Build Validation Checks');
  
  // Check environment variables
  log.info('Validating environment variables...');
  try {
    await execCommand('node', ['scripts/validate-env.js']);
    log.success('Environment variables validation passed');
  } catch (error) {
    log.error('Environment variables validation failed');
    throw error;
  }
  
  // Check for required files
  const requiredFiles = ['.env', 'package.json'];
  for (const file of requiredFiles) {
    if (!fileExists(path.resolve(file))) {
      log.error(`Required file not found: ${file}`);
      throw new Error(`Required file not found: ${file}`);
    }
  }
  log.success('Required files check passed');
  
  // Type checking
  log.info('Running TypeScript type checking...');
  try {
    await execCommand('npm', ['run', 'type-check']);
    log.success('Type checking passed');
  } catch (error) {
    log.error('Type checking failed');
    throw error;
  }
  
  // Code linting
  log.info('Running code linting...');
  try {
    await execCommand('npm', ['run', 'lint']);
    log.success('Code linting passed');
  } catch (error) {
    log.warn('Code linting found issues, attempting to fix...');
    try {
      await execCommand('npm', ['run', 'lint:fix']);
      log.success('Code linting issues fixed');
    } catch (fixError) {
      log.error('Failed to fix code linting issues');
      throw fixError;
    }
  }
}

// Asset optimization
async function optimizeAssets() {
  log.header('🖼️ Asset Optimization');
  
  // Check if we have any image optimization scripts
  const optimizationScripts = [
    'scripts/optimize-images.js',
    'scripts/optimize-images.cjs'
  ];
  
  for (const script of optimizationScripts) {
    if (fileExists(path.resolve(script))) {
      log.info(`Running ${script}...`);
      try {
        await execCommand('node', [script]);
        log.success(`${script} completed`);
        return;
      } catch (error) {
        log.warn(`Failed to run ${script}: ${error.message}`);
      }
    }
  }
  
  log.info('No image optimization scripts found, skipping...');
}

// Security checks
async function securityChecks() {
  log.header('🔒 Security Checks');
  
  // Check for .env in .gitignore
  const gitignorePath = path.resolve('.gitignore');
  if (fileExists(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env')) {
      log.warn('.env file is not in .gitignore. This is a security risk!');
    } else {
      log.success('.env file is properly ignored');
    }
  }
  
  // Check for sensitive data in environment variables
  const sensitiveKeys = ['KEY', 'SECRET', 'PASSWORD', 'TOKEN'];
  for (const key of Object.keys(process.env)) {
    for (const sensitive of sensitiveKeys) {
      if (key.toUpperCase().includes(sensitive)) {
        log.warn(`Environment variable ${key} might contain sensitive data`);
      }
    }
  }
}

// Performance optimizations
async function performanceOptimizations() {
  log.header('⚡ Performance Optimizations');
  
  // Check if we're using the production config
  const useProdConfig = process.argv.includes('--prod-config');
  
  // Clean previous builds
  log.info('Cleaning previous build artifacts...');
  try {
    await execCommand('npm', ['run', 'clean']);
    log.success('Clean completed');
  } catch (error) {
    log.warn(`Clean failed: ${error.message}`);
  }
}

// Main build process
async function buildProcess() {
  log.header('🚀 Production Build Process');
  
  // Use production configuration
  const buildCommand = 'npm';
  const buildArgs = ['run', 'build:prod'];
  
  log.info('Starting production build...');
  try {
    await execCommand(buildCommand, buildArgs);
    log.success('Production build completed successfully');
  } catch (error) {
    log.error('Production build failed');
    throw error;
  }
}

// Post-build verification
async function postBuildVerification() {
  log.header('✅ Post-Build Verification');
  
  // Check if dist directory exists
  const distPath = path.resolve('dist');
  if (!fileExists(distPath)) {
    log.error('Build output directory (dist/) not found');
    throw new Error('Build output directory not found');
  }
  
  log.success('Build output directory exists');
  
  // Check for essential files
  const essentialFiles = [
    'index.html',
    '_astro'
  ];
  
  for (const file of essentialFiles) {
    const filePath = path.join(distPath, file);
    if (!fileExists(filePath)) {
      log.warn(`Essential file/directory not found in build output: ${file}`);
    } else {
      log.success(`Essential file/directory found: ${file}`);
    }
  }
  
  // Update robots.txt with additional directives
  const robotsTxtPath = path.join(distPath, 'robots.txt');
  if (fileExists(robotsTxtPath)) {
    log.info('Updating robots.txt with additional directives...');
    try {
      let robotsContent = fs.readFileSync(robotsTxtPath, 'utf-8');
      
      // Add additional directives for better SEO
      robotsContent += `
# Performance optimizations
Host: zerodolg.ru

# Sitemap
Sitemap: https://zerodolg.ru/sitemap-index.xml

# Crawl-delay for polite crawling
Crawl-delay: 10

# Directories
Disallow: /api/
Disallow: /cgi-bin/
Disallow: /tmp/
Disallow: /private/

# File types
Disallow: /*.log$
Disallow: /*.inc$
Disallow: /*.sql$
`;
      
      fs.writeFileSync(robotsTxtPath, robotsContent);
      log.success('robots.txt updated with additional directives');
    } catch (error) {
      log.warn(`Failed to update robots.txt: ${error.message}`);
    }
  }
  
  // Verify critical assets
  log.info('Verifying critical assets...');
  const criticalAssets = [
    'favicon.svg',
    'favicon.png',
    'apple-touch-icon.png',
    'manifest.json',
    '_astro/client.js',
    '_astro/main.css'
  ];
  
  for (const asset of criticalAssets) {
    const assetPath = path.join(distPath, asset);
    if (!fileExists(assetPath)) {
      log.warn(`Critical asset not found: ${asset}`);
    }
  }
  
  // Run post-build verification script if it exists
  const verificationScript = 'scripts/post-build-verification.js';
  if (fileExists(path.resolve(verificationScript))) {
    log.info('Running post-build verification...');
    try {
      await execCommand('node', [verificationScript]);
      log.success('Post-build verification passed');
    } catch (error) {
      log.error('Post-build verification failed');
      throw error;
    }
  }
}

// Main function
async function main() {
  log.header('🏭 ZeroDolg Astro - Production Build System');
  log.info('Starting comprehensive production build process...\n');
  
  try {
    // Record start time
    const startTime = Date.now();
    
    // Run all steps
    await preBuildValidation();
    await optimizeAssets();
    await securityChecks();
    await performanceOptimizations();
    await buildProcess();
    await postBuildVerification();
    
    // Calculate duration
    const duration = Date.now() - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(2);
    
    log.header('🎉 Production Build Completed Successfully!');
    log.success(`Build finished in ${minutes > 0 ? `${minutes} minute(s) and ` : ''}${seconds} second(s)`);
    log.info('Build output is available in the dist/ directory');
    log.info('To preview the build, run: npm run preview');
    
  } catch (error) {
    log.error('Production build process failed!');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;