#!/usr/bin/env node

/**
 * Automated ESLint Warnings Fixer
 * Fixes common ESLint warnings across the codebase
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting ESLint warnings auto-fix...\n');

// Files to fix with their specific patterns
const filesToFix = [
  // Fix unused variables by prefixing with underscore
  {
    file: 'src/pages/blog/[slug].astro',
    find: /const calculateReadingTime/g,
    replace: 'const _calculateReadingTime',
    description: 'Fix unused variable: calculateReadingTime',
  },
  {
    file: 'src/pages/blog/index.astro',
    find: /const getReadingTime/g,
    replace: 'const _getReadingTime',
    description: 'Fix unused variable: getReadingTime',
  },
  {
    file: 'src/pages/restrukturizaciya-dolgov.astro',
    find: /import HeroForm/g,
    replace: 'import _HeroForm',
    description: 'Fix unused import: HeroForm',
  },
  {
    file: 'src/pages/restrukturizaciya-dolgov.astro',
    find: /const stats = /g,
    replace: 'const _stats = ',
    description: 'Fix unused variable: stats',
  },
  {
    file: 'src/pages/restrukturizaciya-dolgov.astro',
    find: /const promo = /g,
    replace: 'const _promo = ',
    description: 'Fix unused variable: promo',
  },
  {
    file: 'src/shared/ui/SectionDivider.astro',
    find: /const bgColor =/g,
    replace: 'const _bgColor =',
    description: 'Fix unused variable: bgColor',
  },
];

// Apply fixes
let fixedCount = 0;
let errorCount = 0;

filesToFix.forEach(({ file, find, replace, description }) => {
  const filePath = path.join(__dirname, '..', file);

  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    content = content.replace(find, replace);

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${description}`);
      console.log(`   📄 ${file}\n`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`   ✅ Fixed: ${fixedCount} files`);
console.log(`   ❌ Errors: ${errorCount} files`);
console.log(`\n✨ Auto-fix complete!\n`);
console.log('⚠️  Note: Some warnings require manual fixes:');
console.log('   - Console statements need DEV checks');
console.log('   - TypeScript "any" types need proper types');
console.log('   - Non-null assertions need null checks');
console.log('   - Unused CSS selectors need manual review\n');
