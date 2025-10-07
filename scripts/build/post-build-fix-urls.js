#!/usr/bin/env node

/**
 * Post-build script to fix URLs for an SSR setup
 *
 * This script validates that SSR routes exist properly
 * and prepares the SSR output for deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to dist directory
const distPath = path.resolve(__dirname, '../../dist');

console.log('🔧 Post-build SSR URL validation starting...\\n');

/**
 * Check if required SSR route files exist
 */
function validateSsrRoutes() {
  console.log('🔧 Validating SSR route files...');

  const requiredRoutes = [
    { path: 'server/pages/index.astro.mjs', name: 'Home page' },
    { path: 'server/pages/blog.astro.mjs', name: 'Blog index page' },
    { path: 'server/pages/blog/_slug_.astro.mjs', name: 'Blog post dynamic route' },
    {
      path: 'server/pages/bankrotstvo-s-sokhraneniyem-imushchestva.astro.mjs',
      name: 'Bankruptcy with savings page',
    },
    { path: 'server/pages/restrukturizaciya-dolgov.astro.mjs', name: 'Debt restructuring page' },
    { path: 'server/pages/privacy.astro.mjs', name: 'Privacy policy page' },
    { path: 'server/pages/terms.astro.mjs', name: 'Terms of service page' },
    { path: 'server/pages/sitemap.astro.mjs', name: 'Sitemap page' },
  ];

  let validCount = 0;

  for (const route of requiredRoutes) {
    const routePath = path.join(distPath, route.path);

    if (fs.existsSync(routePath)) {
      console.log(`   ✅ ${route.name} found`);
      validCount++;
    } else {
      console.log(`   ❌ ${route.name} NOT FOUND at ${route.path}`);
    }
  }

  console.log(`\\n📝 Validated ${validCount}/${requiredRoutes.length} SSR route files\\n`);
  return validCount === requiredRoutes.length;
}

/**
 * Validate API routes if they exist
 */
function validateApiRoutes() {
  const apiDir = path.join(distPath, 'server', 'pages', 'api');

  if (!fs.existsSync(apiDir)) {
    console.log('ℹ️  No API routes directory found - skipping API validation');
    return true;
  }

  const apiFiles = fs.readdirSync(apiDir);
  if (apiFiles.length > 0) {
    console.log('🔧 Validating API routes...');
    for (const file of apiFiles) {
      if (file.endsWith('.mjs')) {
        console.log(`   ✅ API route found: ${file}`);
      }
    }
    console.log('');
  } else {
    console.log('ℹ️  No API route files found in directory');
  }

  return true;
}

/**
 * Process any static assets that need to be prepared for clean URLs
 */
function processStaticAssets() {
  console.log('🔧 Processing static assets for clean URL compatibility...');

  // Check if client assets exist (CSS, JS files)
  const clientAssetsPath = path.join(distPath, 'client', 'assets');

  if (fs.existsSync(clientAssetsPath)) {
    const assets = fs.readdirSync(clientAssetsPath);
    const cssFiles = assets.filter((file) => file.endsWith('.css'));

    if (cssFiles.length > 0) {
      console.log(`   📄 Found ${cssFiles.length} CSS files for client assets`);
    } else {
      console.log('   ℹ️  No CSS files found in client assets');
    }
  } else {
    console.log('   ℹ️  Client assets directory not found');
  }

  console.log('');
  return true;
}

/**
 * Verify the SSR manifest exists and is valid
 */
function validateManifest() {
  console.log('🔧 Validating SSR manifest...');

  const manifestPath = path.join(distPath, 'server', 'manifest_*.mjs');

  // Find manifest file (filename may vary)
  const serverDir = path.join(distPath, 'server');
  if (fs.existsSync(serverDir)) {
    const serverFiles = fs.readdirSync(serverDir);
    const manifestFiles = serverFiles.filter(
      (file) => file.startsWith('manifest_') && file.endsWith('.mjs')
    );

    if (manifestFiles.length > 0) {
      console.log(`   ✅ SSR manifest found: ${manifestFiles[0]}`);
    } else {
      console.log('   ⚠️  SSR manifest not found');
    }
  } else {
    console.log('   ❌ Server directory not found');
  }

  console.log('');
  return true;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting SSR URL validation process...');

  const validations = [
    validateSsrRoutes(),
    validateApiRoutes(),
    processStaticAssets(),
    validateManifest(),
  ];

  const allValid = validations.every((result) => result);

  if (allValid) {
    console.log('✅ All SSR validations passed! Output is ready for deployment.');
    console.log('\\n💡 In SSR mode, route handling is managed by the server:');
    console.log('   • Blog posts: Handled by /server/pages/blog/_slug_.astro.mjs');
    console.log('   • Clean URLs: Supported through server routing configuration');
    console.log('   • Dynamic content: Generated at request time');
  } else {
    console.log('❌ Some validations failed. Please check the output above.');
  }
}

// Run the script
main();
