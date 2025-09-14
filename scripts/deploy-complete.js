#!/usr/bin/env node

/**
 * One-Command Deployment Script
 * 
 * This script performs a complete deployment process:
 * 1. Runs pre-deployment checklist
 * 2. Creates backup of current deployment
 * 3. Runs production build
 * 4. Verifies the build
 * 5. Provides deployment instructions
 */

import { spawn } from 'child_process';

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

// Main deployment function
async function deploy() {
  log.header('🚀 ZeroDolg Astro - One-Command Deployment');
  log.info('Starting complete deployment process...\\n');
  
  try {
    // Step 1: Run deployment checklist
    log.header('📋 Step 1: Running Deployment Checklist');
    await execCommand('npm', ['run', 'deploy:checklist']);
    
    // Step 2: Create backup
    log.header('\\n📦 Step 2: Creating Backup');
    await execCommand('npm', ['run', 'deploy:backup']);
    
    // Step 3: Run production build
    log.header('\\n🏭 Step 3: Running Production Build');
    await execCommand('npm', ['run', 'build:production']);
    
    // Step 4: Verify build
    log.header('\\n✅ Step 4: Verifying Build');
    await execCommand('npm', ['run', 'deploy:verify']);
    
    // Step 5: Provide deployment instructions
    log.header('\\n📥 Step 5: Deployment Instructions');
    log.success('Build completed successfully!');
    log.info('Next steps:');
    log.info('1. Deploy the contents of the "dist/" directory to your production server');
    log.info('2. Restart your web server if necessary');
    log.info('3. Verify the deployment by visiting your website');
    log.info('4. Monitor for any issues');
    
    log.header('\\n🎉 Deployment Process Completed Successfully!');
    log.info('Your site is now ready for production.');
    
  } catch (error) {
    log.error('Deployment process failed!');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the deployment
if (import.meta.url === `file://${process.argv[1]}`) {
  deploy();
}

export default deploy;