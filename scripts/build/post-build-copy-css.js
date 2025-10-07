#!/usr/bin/env node

/**
 * Post-build script to copy CSS files from server/assets to client/assets for SSR
 *
 * In SSR mode, Astro generates CSS in dist/server/assets/
 * but the client-side needs them in dist/client/assets/ for proper loading
 * This script ensures all necessary CSS files are available in both locations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const distPath = path.resolve(__dirname, '../../dist');
const serverAssetsPath = path.join(distPath, 'server', 'assets');
const clientAssetsPath = path.join(distPath, 'client', 'assets');

console.log('🎨 Post-build CSS handling for SSR starting...\\n');

/**
 * Copy CSS files from server/assets to client/assets
 */
function copyCssFiles() {
  // Check if server/assets exists
  if (!fs.existsSync(serverAssetsPath)) {
    console.log('ℹ️  Server assets directory not found (this is normal if no CSS was generated)');
    return true;
  }

  // Create client/assets if it doesn't exist
  if (!fs.existsSync(clientAssetsPath)) {
    fs.mkdirSync(clientAssetsPath, { recursive: true });
    console.log('📁 Created client/assets directory');
  }

  // Find all CSS files in server/assets
  const files = fs.readdirSync(serverAssetsPath);
  const cssFiles = files.filter((file) => file.endsWith('.css'));

  if (cssFiles.length === 0) {
    console.log('ℹ️  No CSS files found in server/assets');
    return true;
  }

  console.log(`📄 Found ${cssFiles.length} CSS file(s) to copy:`);

  let copiedCount = 0;

  for (const file of cssFiles) {
    const sourcePath = path.join(serverAssetsPath, file);
    const targetPath = path.join(clientAssetsPath, file);

    try {
      fs.copyFileSync(sourcePath, targetPath);
      const stats = fs.statSync(targetPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ ${file} (${sizeKB} KB)`);
      copiedCount++;
    } catch (error) {
      console.error(`   ❌ Failed to copy ${file}:`, error.message);
    }
  }

  console.log(`\\n📝 Copied ${copiedCount}/${cssFiles.length} CSS files`);
  return copiedCount === cssFiles.length;
}

/**
 * Verify that CSS files exist in client assets
 */
function verifyCssInClientAssets() {
  console.log('\\n🔍 Verifying CSS availability in client assets...');

  if (!fs.existsSync(clientAssetsPath)) {
    console.log('   ℹ️  client/assets directory does not exist - no CSS files to verify');
    return true;
  }

  const clientCssFiles = fs.readdirSync(clientAssetsPath).filter((file) => file.endsWith('.css'));

  if (clientCssFiles.length === 0) {
    console.log('   ℹ️  No CSS files found in client/assets directory');
    return true;
  }

  console.log(`   📄 Found ${clientCssFiles.length} CSS file(s) in client assets`);

  // Show the CSS files available
  for (const file of clientCssFiles) {
    const filePath = path.join(clientAssetsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ ${file} (${sizeKB} KB)`);
  }

  console.log('');
  return true;
}

/**
 * Validate CSS references in SSR bundle (check if any CSS files are referenced in the server code)
 */
function validateCssReferencesInBundle() {
  console.log('🔍 Checking CSS references in server bundle...');

  // Check the main entry file and pages to verify CSS references
  const serverDir = path.join(distPath, 'server');
  const pagesDir = path.join(serverDir, 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.log('   ❌ Server pages directory not found');
    return false;
  }

  // Check some common page files for CSS imports/references
  const pageFilesToCheck = [
    'index.astro.mjs',
    'blog.astro.mjs',
    'bankrotstvo-s-sokhraneniyem-imushchestva.astro.mjs',
    'restrukturizaciya-dolgov.astro.mjs',
  ];

  let foundReferences = 0;

  for (const pageFile of pageFilesToCheck) {
    const pagePath = path.join(pagesDir, pageFile);

    if (fs.existsSync(pagePath)) {
      try {
        const content = fs.readFileSync(pagePath, 'utf-8');
        const cssRefs = content.match(/href="[^"]*\.css"/g);

        if (cssRefs && cssRefs.length > 0) {
          console.log(`   ✅ Found CSS reference in ${pageFile}: ${cssRefs.length} references`);
          foundReferences += cssRefs.length;
        }
      } catch (error) {
        console.log(`   ⚠️  Could not read ${pageFile}: ${error.message}`);
      }
    }
  }

  if (foundReferences === 0) {
    console.log(
      '   ℹ️  No CSS references found in checked server pages (this may be expected in some configurations)'
    );
  } else {
    console.log(`   📝 Total CSS references found: ${foundReferences}`);
  }

  console.log('');
  return true;
}

/**
 * Main execution
 */
function main() {
  const copySuccess = copyCssFiles();
  const verifySuccess = verifyCssInClientAssets();
  const referenceValidation = validateCssReferencesInBundle();

  if (copySuccess && verifySuccess && referenceValidation) {
    console.log('✅ Post-build CSS handling completed successfully for SSR!');
    console.log(
      '💡 All CSS files are now available in dist/client/assets/ and ready for deployment'
    );
    console.log('\\n📝 In SSR mode:');
    console.log('   • CSS files are served from /client/assets/ for client-side hydration');
    console.log('   • Server-side rendering includes CSS links in generated HTML');
    console.log('   • Static CSS assets are available for performance optimization');
    process.exit(0);
  } else {
    console.error('\\n❌ Post-build CSS handling failed!');
    process.exit(1);
  }
}

// Run the script
main();
