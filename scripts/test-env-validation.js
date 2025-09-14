#!/usr/bin/env node

/**
 * Test script for environment validation
 * 
 * This script tests the environment validation functionality
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testEnvValidation() {
  console.log('🧪 Testing environment validation script...\\n');
  
  try {
    // Test with current environment
    console.log('1. Testing with current .env file:');
    const { stdout, stderr } = await execAsync('node scripts/validate-env.js');
    console.log(stdout);
    if (stderr) console.error(stderr);
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
  }
}

// Run the test
testEnvValidation();
