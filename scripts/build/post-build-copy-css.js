#!/usr/bin/env node

/**
 * Post-build script to copy CSS files from server/assets to client/assets
 *
 * Problem: In SSR mode, Astro generates CSS in dist/server/assets/
 * but HTML references them as /assets/xxx.css (expecting them in dist/client/assets/)
 *
 * Solution: Copy all CSS files from server/assets to client/assets after build
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

console.log('🎨 Post-build CSS copy starting...\n');

/**
 * Copy CSS files from server/assets to client/assets
 */
function copyCssFiles() {
  // Check if server/assets exists
  if (!fs.existsSync(serverAssetsPath)) {
    console.error('❌ Server assets directory not found:', serverAssetsPath);
    return false;
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

  console.log(`\n📝 Copied ${copiedCount}/${cssFiles.length} CSS files`);
  return copiedCount === cssFiles.length;
}

/**
 * Verify that CSS files are referenced in HTML
 */
function verifyCssReferences() {
  console.log('\n🔍 Verifying CSS references in HTML...');

  const clientIndexPath = path.join(distPath, 'client', 'index.html');

  if (!fs.existsSync(clientIndexPath)) {
    console.log('   ℹ️  client/index.html not found - skipping verification');
    return true;
  }

  const htmlContent = fs.readFileSync(clientIndexPath, 'utf-8');
  const cssReferences = htmlContent.match(/href="\/assets\/[^"]+\.css"/g);

  if (!cssReferences || cssReferences.length === 0) {
    console.log('   ℹ️  No CSS references found in HTML');
    return true;
  }

  console.log(`   📄 Found ${cssReferences.length} CSS reference(s) in HTML`);

  let allExist = true;

  for (const ref of cssReferences) {
    // Extract filename from href="/assets/filename.css"
    const match = ref.match(/href="\/assets\/([^"]+)"/);
    if (match) {
      const filename = match[1];
      const filePath = path.join(clientAssetsPath, filename);

      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${filename}`);
      } else {
        console.log(`   ❌ ${filename} - NOT FOUND!`);
        allExist = false;
      }
    }
  }

  return allExist;
}

/**
 * Main execution
 */
function main() {
  const copySuccess = copyCssFiles();
  const verifySuccess = verifyCssReferences();

  if (copySuccess && verifySuccess) {
    console.log('\n✅ Post-build CSS copy completed successfully!');
    console.log('💡 All CSS files are now in dist/client/assets/ and ready for deployment');
    process.exit(0);
  } else {
    console.error('\n❌ Post-build CSS copy failed!');
    process.exit(1);
  }
}

// Run the script
main();
