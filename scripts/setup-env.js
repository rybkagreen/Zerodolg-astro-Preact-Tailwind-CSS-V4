#!/usr/bin/env node

/**
 * Environment Setup Helper Script
 * 
 * This script helps set up the environment by copying .env.example to .env
 * and providing guidance on configuration.
 */

import fs from 'fs';
import path from 'path';

const envExamplePath = path.resolve('.env.example');
const envPath = path.resolve('.env');

console.log('🔧 ZeroDolg Astro - Environment Setup Helper');
console.log('============================================\n');

// Check if .env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found!');
  console.error('Please make sure you are running this script from the project root directory.');
  process.exit(1);
}

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists.');
  console.log('   If you want to regenerate it from .env.example, please delete the existing .env file first.\n');
} else {
  // Copy .env.example to .env
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully from .env.example!\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
}

console.log('📝 Next steps:');
console.log('-------------');
console.log('1. Open the .env file in your editor');
console.log('2. Update the values with your actual configuration');
console.log('3. Run "npm run env:validate" to verify your configuration\n');

console.log('📋 Required variables to configure:');
console.log('----------------------------------');
console.log('• BITRIX24_WEBHOOK_URL - Your Bitrix24 webhook URL');
console.log('• PUBLIC_SITE_URL - Your site URL (e.g., https://zerodolg.ru)');
console.log('• PUBLIC_SITE_PHONE - Your contact phone number');
console.log('• PUBLIC_SITE_EMAIL - Your contact email\n');

console.log('💡 Tips:');
console.log('-------');
console.log('• Keep your .env file secure and never commit it to version control');
console.log('• Use strong, unique values for API keys and webhook URLs');
console.log('• Validate your configuration with "npm run env:validate"');
console.log('• For production, ensure NODE_ENV is set to "production"\n');