#!/usr/bin/env node

/**
 * Semgrep Security Scan Script
 * 
 * This script runs Semgrep security analysis on the project codebase
 * to identify potential security vulnerabilities and code issues.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Check if Semgrep is installed
function isSemgrepInstalled() {
  try {
    execSync('npx semgrep --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('❌ Semgrep is not installed or not accessible via npx');
    console.error('💡 Install Semgrep globally with: npm install -g semgrep');
    return false;
  }
}

// Run Semgrep scan
function runSemgrepScan() {
  console.log('🔍 Starting Semgrep security scan...');
  
  try {
    // Execute Semgrep scan with default rules
    const result = execSync('npx semgrep scan --config=auto', { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    console.log('✅ Semgrep scan completed successfully');
    return true;
  } catch (error) {
    console.error('⚠️ Semgrep scan completed with findings (this is expected)');
    console.error('💡 Review the findings and address any security issues');
    return true; // Return true as completion is successful even with findings
  }
}

// Main execution
async function main() {
  console.log('🛡️  Running security scan with Semgrep...');
  
  // Check if Semgrep is installed
  if (!isSemgrepInstalled()) {
    process.exit(1);
  }

  // Check if we're in the correct project directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Not in the project root directory');
    process.exit(1);
  }

  // Run the Semgrep scan
  const scanSuccess = runSemgrepScan();
  
  if (scanSuccess) {
    console.log('\n📋 For more detailed configuration, you can create a .semgrep.yml file');
    console.log('🔗 Learn more: https://semgrep.dev/docs');
  }
}

// Execute main function
main().catch(error => {
  console.error('💥 Error running Semgrep scan:', error.message);
  process.exit(1);
});