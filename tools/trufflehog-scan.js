#!/usr/bin/env node

/**
 * TruffleHog Security Scan Script
 *
 * This script runs TruffleHog security analysis on the project
 * to detect secrets and sensitive information in the codebase.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Check if TruffleHog is installed
function isTruffleHogInstalled() {
  try {
    // Try to run TruffleHog to see if it's installed
    execSync('npx trufflehog --version', { stdio: 'pipe', encoding: 'utf8' });
    return true;
  } catch (error) {
    // TruffleHog may not have a version command or may not be installed
    try {
      // Alternative check - try to run help command
      execSync('npx trufflehog --help', { stdio: 'pipe', encoding: 'utf8' });
      return true;
    } catch (secondError) {
      console.error('❌ TruffleHog is not installed or not accessible via npx');
      console.error('💡 Install TruffleHog CLI: https://github.com/trufflesecurity/truffleHog');
      console.error('💡 Alternative: npm install -g @trufflehq/trufflehog');
      return false;
    }
  }
}

// Run TruffleHog scan
function runTruffleHogScan() {
  console.log('🔍 Starting TruffleHog secrets scan...');

  try {
    // Execute TruffleHog scan on the current directory
    const result = execSync('npx trufflehog .', {
      stdio: 'inherit',
      encoding: 'utf8',
      timeout: 300000, // 5 minute timeout
    });

    console.log('✅ TruffleHog scan completed successfully');
    return true;
  } catch (error) {
    if (error.status === 1) {
      // Status 1 in TruffleHog usually means findings were detected
      console.log('⚠️ TruffleHog scan completed with findings (secrets detected)');
      console.log('💡 Review the findings and remove any sensitive information');
      return true; // Still return true as scan completed
    } else {
      console.error('❌ Error running TruffleHog scan:', error.message);
      return false;
    }
  }
}

// Alternative approach if npx trufflehog doesn't work
function runTruffleHogAlternative() {
  console.log('🔍 Trying alternative TruffleHog approach...');

  try {
    // Execute TruffleHog scan using the alternative command structure
    const result = execSync('npx @trufflehq/trufflehog .', {
      stdio: 'inherit',
      encoding: 'utf8',
      timeout: 300000, // 5 minute timeout
    });

    console.log('✅ TruffleHog scan completed successfully');
    return true;
  } catch (error) {
    if (error.status === 1) {
      // Status 1 in TruffleHog usually means findings were detected
      console.log('⚠️ TruffleHog scan completed with findings (secrets detected)');
      console.log('💡 Review the findings and remove any sensitive information');
      return true; // Still return true as scan completed
    } else {
      console.error('❌ Error running TruffleHog scan:', error.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  console.log('🔍 Running secrets detection with TruffleHog...');

  // Check if we're in the correct project directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Not in the project root directory');
    process.exit(1);
  }

  // Try standard TruffleHog installation first
  if (isTruffleHogInstalled()) {
    const scanSuccess = runTruffleHogScan();

    if (scanSuccess) {
      console.log('\n📋 TruffleHog scan finished');
      console.log('🔗 Learn more: https://trufflesecurity.com/docs');
    } else {
      console.log('\n⚠️ Standard TruffleHog failed, trying alternative...');
      runTruffleHogAlternative();
    }
  } else {
    // Try alternative installation
    console.log('\n⚠️ Standard TruffleHog not found, trying alternative...');
    runTruffleHogAlternative();
  }
}

// Execute main function
main().catch((error) => {
  console.error('💥 Error running TruffleHog scan:', error.message);
  process.exit(1);
});
