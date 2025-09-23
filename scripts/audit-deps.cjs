#!/usr/bin/env node

// Dependency audit script
const { execSync } = require('child_process');

console.log('Running dependency audit...');

try {
  // Run npm audit
  const auditResult = execSync('npm audit --audit-level=moderate', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('Audit completed successfully');
  console.log(auditResult);
} catch (error) {
  if (error.stdout) {
    console.log('Audit found vulnerabilities:');
    console.log(error.stdout);
    
    // Try to fix automatically
    try {
      console.log('Attempting to fix vulnerabilities...');
      const fixResult = execSync('npm audit fix', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('Fix attempt completed');
      console.log(fixResult);
    } catch (fixError) {
      console.log('Some vulnerabilities could not be automatically fixed');
      console.log('Please review and fix manually');
      process.exit(1);
    }
  } else {
    console.error('Audit failed:', error.message);
    process.exit(1);
  }
}