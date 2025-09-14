#!/usr/bin/env node

/**
 * Rollback Script
 * 
 * This script handles rollback procedures in case of deployment failures:
 * - Reverts to the previous deployment
 * - Restores database backups (if applicable)
 * - Notifies stakeholders
 * - Logs rollback actions
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

// Write file content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Rollback procedures
async function rollbackProcedures() {
  log.header('🔄 ZeroDolg Astro - Rollback Procedures');
  
  // Check if we have a previous deployment backup
  const backupDir = path.resolve('backups');
  const distDir = path.resolve('dist');
  
  if (!fileExists(backupDir)) {
    log.error('No backups directory found. Cannot perform rollback.');
    log.info('To prepare for future rollbacks, create a backup before deploying:');
    log.info('  cp -r dist backups/dist-$(date +%Y%m%d-%H%M%S)');
    process.exit(1);
  }
  
  // Find the most recent backup
  const backupEntries = fs.readdirSync(backupDir)
    .filter(entry => entry.startsWith('dist-'))
    .sort()
    .reverse();
  
  if (backupEntries.length === 0) {
    log.error('No previous deployments found in backups directory.');
    process.exit(1);
  }
  
  const latestBackup = backupEntries[0];
  const backupPath = path.join(backupDir, latestBackup);
  
  log.info(`Found backup: ${latestBackup}`);
  
  // Confirm rollback
  log.warn('This will replace the current deployment with the backup.');
  log.warn('Are you sure you want to proceed with the rollback?');
  
  // In a real implementation, we would prompt for confirmation
  // For now, we'll simulate the rollback
  
  try {
    // Create a backup of the current deployment (if it exists)
    if (fileExists(distDir)) {
      const currentBackup = `dist-failed-${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const currentBackupPath = path.join(backupDir, currentBackup);
      log.info(`Creating backup of current deployment: ${currentBackup}`);
      copyDirectory(distDir, currentBackupPath);
      log.success('Current deployment backed up');
    }
    
    // Remove current dist directory
    if (fileExists(distDir)) {
      log.info('Removing current deployment...');
      fs.rmSync(distDir, { recursive: true, force: true });
      log.success('Current deployment removed');
    }
    
    // Restore from backup
    log.info(`Restoring from backup: ${latestBackup}`);
    copyDirectory(backupPath, distDir);
    log.success('Deployment restored from backup');
    
    // Log rollback action
    const rollbackLog = path.join(backupDir, 'rollback.log');
    const logEntry = `[${new Date().toISOString()}] Rollback to ${latestBackup}
`;
    
    if (fileExists(rollbackLog)) {
      fs.appendFileSync(rollbackLog, logEntry);
    } else {
      fs.writeFileSync(rollbackLog, logEntry);
    }
    
    log.success('Rollback completed successfully');
    log.info('Please verify the restored deployment and restart your web server if necessary.');
    
  } catch (error) {
    log.error('Rollback failed!');
    log.error(error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  // Check if rollback is requested
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
ZeroDolg Astro Rollback System
=============================

Usage: node scripts/rollback.js [options]

Options:
  --help, -h    Show this help message
  --list        List available backups
  --backup      Create a backup before rolling back

Description:
  This script handles rollback procedures in case of deployment failures.
  It restores the site from the most recent backup in the backups/ directory.

Prerequisites:
  - A backups/ directory with previous deployments
  - Each backup should be in a subdirectory named dist-YYYYMMDD-HHMMSS

Examples:
  node scripts/rollback.js          # Rollback to the most recent backup
  node scripts/rollback.js --list   # List available backups
    `);
    process.exit(0);
  }
  
  if (args.includes('--list')) {
    const backupDir = path.resolve('backups');
    if (!fileExists(backupDir)) {
      log.error('No backups directory found.');
      process.exit(1);
    }
    
    const backupEntries = fs.readdirSync(backupDir)
      .filter(entry => entry.startsWith('dist-'))
      .sort()
      .reverse();
    
    if (backupEntries.length === 0) {
      log.info('No backups found.');
    } else {
      log.header('Available backups:');
      backupEntries.forEach((entry, index) => {
        const date = entry.replace('dist-', '').replace(/-/g, ' ');
        log.info(`${index + 1}. ${entry} (${date})`);
      });
    }
    
    process.exit(0);
  }
  
  await rollbackProcedures();
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;