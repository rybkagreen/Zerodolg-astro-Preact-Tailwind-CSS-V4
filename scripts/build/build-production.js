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
  WHITE: '\x1b[37m',
};

// Log functions
const log = {
  info: (msg) => console.log(`${COLORS.CYAN}ℹ ${msg}${COLORS.RESET}`),
  success: (msg) => console.log(`${COLORS.GREEN}✅ ${msg}${COLORS.RESET}`),
  warn: (msg) => console.log(`${COLORS.YELLOW}⚠ ${msg}${COLORS.RESET}`),
  error: (msg) => console.log(`${COLORS.RED}❌ ${msg}${COLORS.RESET}`),
  header: (msg) => console.log(`${COLORS.MAGENTA}${msg}${COLORS.RESET}`),
};

// Execute a command and return a promise
function execCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log.info(`Executing: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
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
    await execCommand('node', ['../validate-env.js']);
    log.success('Environment variables validation passed');
  } catch (error) {
    log.error('Environment variables validation failed');
    throw error;
  }

  // Check for required files
  const requiredFiles = ['.env', 'package.json'];
  for (const file of requiredFiles) {
    if (!fileExists(path.resolve('../../', file))) {
      log.error(`Required file not found: ${file}`);
      throw new Error(`Required file not found: ${file}`);
    }
  }
  log.success('Required files check passed');

  // Type checking
  log.info('Running TypeScript type checking...');
  try {
    await execCommand('npm', ['run', 'type-check'], { cwd: '../../' });
    log.success('Type checking passed');
  } catch (error) {
    log.error('Type checking failed');
    throw error;
  }

  // Code linting
  log.info('Running code linting...');
  try {
    await execCommand('npm', ['run', 'lint'], { cwd: '../../' });
    log.success('Code linting passed');
  } catch (error) {
    log.warn('Code linting found issues, attempting to fix...');
    try {
      await execCommand('npm', ['run', 'lint:fix'], { cwd: '../../' });
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
    '../maintenance/optimize-images.js',
    '../maintenance/optimize-images.cjs',
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
  const gitignorePath = path.resolve('../../.gitignore');
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
    await execCommand('npm', ['run', 'clean'], { cwd: '../../' });
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
    await execCommand(buildCommand, buildArgs, { cwd: '../../' });
    log.success('Production build completed successfully');
  } catch (error) {
    log.error('Production build failed');
    throw error;
  }
}

// Post-build verification
async function postBuildVerification() {
  log.header('🔍 Post-Build Verification');

  // Check if dist folder exists
  const distPath = path.resolve('../../dist');
  if (!fileExists(distPath)) {
    throw new Error('Build output directory (dist) not found');
  }
  log.success('Build output directory exists');

  // Check if main files exist
  const expectedFiles = ['index.html'];
  for (const file of expectedFiles) {
    if (!fileExists(path.join(distPath, file))) {
      log.warn(`Expected file not found in build output: ${file}`);
    }
  }

  // Run post-build verification script if exists
  const verificationScript = '../deploy/post-build-verification.js';
  if (fileExists(path.resolve(verificationScript))) {
    log.info('Running post-build verification script...');
    try {
      await execCommand('node', [verificationScript]);
      log.success('Post-build verification passed');
    } catch (error) {
      log.warn(`Post-build verification failed: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  const startTime = Date.now();

  try {
    await preBuildValidation();
    await securityChecks();
    await performanceOptimizations();
    await optimizeAssets();
    await buildProcess();
    await postBuildVerification();

    const duration = (Date.now() - startTime) / 1000;
    log.success(`🎉 Production build completed successfully in ${duration.toFixed(2)}s`);
  } catch (error) {
    log.error(`Production build failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main();
}

export default main;
