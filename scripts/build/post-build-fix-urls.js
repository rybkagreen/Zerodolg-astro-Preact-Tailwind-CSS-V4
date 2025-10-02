#!/usr/bin/env node

/**
 * Post-build script to fix URLs for clean paths without .html extensions
 *
 * This script:
 * 1. Creates index.html in /blog/ directory from blog.html
 * 2. Can be extended to handle other pages that need similar treatment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to dist directory
const distPath = path.resolve(__dirname, '../../dist');

console.log('🔧 Post-build URL fixes starting...\n');

/**
 * Create index.html in a directory by copying from source file
 */
function createIndexFromFile(sourceFile, targetDir) {
  const sourcePath = path.join(distPath, sourceFile);
  const targetPath = path.join(distPath, targetDir);
  const indexPath = path.join(targetPath, 'index.html');

  // Check if source file exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourceFile}`);
    return false;
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    console.log(`📁 Created directory: ${targetDir}`);
  }

  // Copy the file
  try {
    fs.copyFileSync(sourcePath, indexPath);
    console.log(`✅ Created ${targetDir}/index.html from ${sourceFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create ${targetDir}/index.html:`, error.message);
    return false;
  }
}

/**
 * Process all blog post HTML files to create directory structure
 */
function processBlogPosts() {
  const blogDir = path.join(distPath, 'blog');

  if (!fs.existsSync(blogDir)) {
    console.error('❌ Blog directory not found');
    return false;
  }

  // Find all HTML files in blog directory (except index.html)
  const blogFiles = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.html') && file !== 'index.html');

  console.log(`📄 Found ${blogFiles.length} blog post(s) to process`);

  let processedCount = 0;

  for (const file of blogFiles) {
    // Extract slug from filename (remove .html)
    const slug = file.replace('.html', '');
    const sourceFile = path.join(blogDir, file);
    const targetDir = path.join(blogDir, slug);
    const targetFile = path.join(targetDir, 'index.html');

    try {
      // Create directory for the blog post
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Copy the HTML file as index.html
      fs.copyFileSync(sourceFile, targetFile);
      processedCount++;
      console.log(`   ✅ Created /blog/${slug}/index.html`);
    } catch (error) {
      console.error(`   ❌ Failed to process ${file}:`, error.message);
    }
  }

  console.log(`   📝 Processed ${processedCount}/${blogFiles.length} blog posts`);
  return processedCount === blogFiles.length;
}

/**
 * Main execution
 */
function main() {
  let success = true;

  // Check if blog directory exists
  const blogDir = path.join(distPath, 'blog');
  if (!fs.existsSync(blogDir)) {
    console.log('ℹ️  Blog directory not found - skipping blog URL fixes');
    console.log('✅ Post-build completed (no fixes needed)');
    return;
  }

  // Check if blog/index.html already exists (created by Astro)
  const blogIndexPath = path.join(blogDir, 'index.html');
  if (fs.existsSync(blogIndexPath)) {
    console.log('✅ Blog index already exists at /blog/index.html');
  } else {
    // Try to create from blog.html if it exists
    console.log('🔧 Processing main blog page...');
    if (createIndexFromFile('blog.html', 'blog')) {
      console.log('   📝 /blog/ will now work correctly\n');
    } else {
      console.log(
        '   ℹ️  blog.html not found, assuming /blog/index.html already created by Astro\n'
      );
    }
  }

  // Process all blog posts (optional - only if needed)
  console.log('🔧 Checking blog posts...');
  const blogFiles = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.html') && file !== 'index.html');

  if (blogFiles.length > 0) {
    console.log(`📄 Found ${blogFiles.length} blog post file(s) to check`);
    processBlogPosts();
  } else {
    console.log('   ℹ️  No blog post files to process (clean directory structure)');
  }

  console.log('\n✅ Post-build URL fixes completed successfully!');
}

// Run the script
main();
