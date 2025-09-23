#!/usr/bin/env node

/**
 * Backup Script
 *
 * This script creates a backup of the current dist directory
 * before deployment to enable easy rollback.
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

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
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

// Create backup
async function createBackup() {
  log.header('📦 ZeroDolg Astro - Backup System');

  const distDir = path.resolve('dist');
  const backupDir = path.resolve('backups');

  // Check if dist directory exists
  if (!fileExists(distDir)) {
    log.error('dist/ directory not found. Nothing to backup.');
    process.exit(1);
  }

  // Create backups directory if it doesn't exist
  if (!fileExists(backupDir)) {
    log.info('Creating backups directory...');
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Generate backup name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `dist-${timestamp}`;
  const backupPath = path.join(backupDir, backupName);

  try {
    log.info(`Creating backup: ${backupName}`);
    copyDirectory(distDir, backupPath);
    log.success(`Backup created successfully: ${backupPath}`);

    // Log backup action
    const backupLog = path.join(backupDir, 'backup.log');
    const logEntry = `[${new Date().toISOString()}] Created backup ${backupName}\n`;

    if (fileExists(backupLog)) {
      fs.appendFileSync(backupLog, logEntry);
    } else {
      fs.writeFileSync(backupLog, logEntry);
    }

    // List all backups
    const backups = fs
      .readdirSync(backupDir)
      .filter((entry) => entry.startsWith('dist-'))
      .sort()
      .reverse();

    log.info(`Total backups: ${backups.length}`);

    // Keep only the last 10 backups
    if (backups.length > 10) {
      log.info('Cleaning up old backups...');
      for (let i = 10; i < backups.length; i++) {
        const oldBackup = path.join(backupDir, backups[i]);
        fs.rmSync(oldBackup, { recursive: true, force: true });
        log.info(`Removed old backup: ${backups[i]}`);
      }
    }
  } catch (error) {
    log.error('Backup creation failed!');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the backup
if (import.meta.url === `file://${process.argv[1]}`) {
  createBackup();
}

export default createBackup;
