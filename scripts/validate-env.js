#!/usr/bin/env node

/**
 * Production Environment Validation Script
 * 
 * This script validates that all required environment variables are set
 * and have appropriate values for production deployment.
 */

import fs from 'fs';
import path from 'path';

// Function to validate URL format
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Function to validate phone number format (Russian format)
function validatePhone(phone) {
  const phoneRegex = /^(\+7|8)\s?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/;
  return phoneRegex.test(phone);
}

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate Google Analytics ID format
function validateGAId(id) {
  const gaRegex = /^G-[A-Z0-9]{10}$/;
  return gaRegex.test(id);
}

// Function to validate Yandex Metrika ID format
function validateYMId(id) {
  const ymRegex = /^\d{8,9}$/;
  return ymRegex.test(id);
}

// Load environment variables from .env file if it exists
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  console.log('🔍 Loading environment variables from .env file...');
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('
').forEach(line => {
    // Skip comments and empty lines
    if (line.trim() === '' || line.startsWith('#')) return;
    
    const matches = line.match(/^([^=]+)=(.*)$/);
    if (matches) {
      const key = matches[1].trim();
      let value = matches[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = value;
      }
    }
  });
}

// Required environment variables for production
const requiredEnvVars = [
  'BITRIX24_WEBHOOK_URL',
  'PUBLIC_SITE_URL',
  'PUBLIC_SITE_PHONE',
  'PUBLIC_SITE_EMAIL'
];

// Optional environment variables with validation
const optionalEnvVars = {
  'PUBLIC_GA_ID': { validator: validateGAId, description: 'Google Analytics ID' },
  'PUBLIC_YM_ID': { validator: validateYMId, description: 'Yandex Metrika ID' },
  'PUBLIC_ASTRO_TOOLBAR': { validator: (val) => val === 'true' || val === 'false', description: 'Astro Dev Toolbar flag' },
  'NODE_ENV': { validator: (val) => val === 'production' || val === 'development', description: 'Node environment' }
};

console.log('🚀 Starting production environment validation...\n');

// Validate required environment variables
const missingEnvVars = [];
const validationErrors = [];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] || process.env[envVar].trim() === '') {
    missingEnvVars.push(envVar);
  } else {
    // Validate specific required variables
    switch (envVar) {
      case 'BITRIX24_WEBHOOK_URL':
        if (!validateUrl(process.env[envVar])) {
          validationErrors.push(`Invalid BITRIX24_WEBHOOK_URL format: ${process.env[envVar]}`);
        }
        break;
      case 'PUBLIC_SITE_URL':
        if (!validateUrl(process.env[envVar])) {
          validationErrors.push(`Invalid PUBLIC_SITE_URL format: ${process.env[envVar]}`);
        }
        break;
      case 'PUBLIC_SITE_PHONE':
        if (!validatePhone(process.env[envVar])) {
          validationErrors.push(`Invalid phone number format: ${process.env[envVar]}`);
        }
        break;
      case 'PUBLIC_SITE_EMAIL':
        if (!validateEmail(process.env[envVar])) {
          validationErrors.push(`Invalid email format: ${process.env[envVar]}`);
        }
        break;
    }
  }
});

// Report missing required variables
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease set these variables in your .env file or environment.');
  process.exit(1);
}

// Validate optional environment variables
Object.keys(optionalEnvVars).forEach(envVar => {
  if (process.env[envVar]) {
    const validator = optionalEnvVars[envVar].validator;
    if (!validator(process.env[envVar])) {
      validationErrors.push(`Invalid ${optionalEnvVars[envVar].description} format: ${process.env[envVar]}`);
    }
  }
});

// Report validation errors
if (validationErrors.length > 0) {
  console.error('❌ Environment variable validation errors:');
  validationErrors.forEach(error => {
    console.error(`   - ${error}`);
  });
  process.exit(1);
}

// All validations passed
console.log('✅ Environment validation passed!');
console.log('\n📋 Environment variables summary:');
console.log('================================');

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  // Mask sensitive values
  const maskedValue = envVar.includes('WEBHOOK') || envVar.includes('KEY') ? 
    value.substring(0, 10) + '...' + value.substring(value.length - 5) : 
    value;
  console.log(`✅ ${envVar}: ${maskedValue}`);
});

Object.keys(optionalEnvVars).forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`ℹ️  ${envVar}: ${process.env[envVar]}`);
  } else {
    console.log(`⚠️  ${envVar}: Not set (using defaults)`);
  }
});

console.log('\n🔧 Additional checks:');
console.log('====================');

// Check NODE_ENV
if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  NODE_ENV is not set to "production". Consider setting it for production builds.');
}

// Check Astro toolbar
if (process.env.PUBLIC_ASTRO_TOOLBAR === 'true') {
  console.warn('⚠️  PUBLIC_ASTRO_TOOLBAR is enabled. Consider disabling it in production.');
}

console.log('\n🎉 Production environment is ready for deployment!');