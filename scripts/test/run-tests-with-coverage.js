#!/usr/bin/env node

/**
 * Test Runner Script
 * Runs tests with coverage reporting and generates detailed reports
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const COVERAGE_THRESHOLD = 80;
const REPORT_DIR = 'coverage';

console.log('🚀 Starting test suite with coverage...\n');

try {
  // Run tests with coverage
  console.log('Running tests with coverage...\n');
  execSync('npm run test:coverage', { stdio: 'inherit' });

  // Check if coverage directory exists
  if (fs.existsSync(REPORT_DIR)) {
    console.log('\n✅ Tests completed successfully!');

    // Read coverage summary
    const coverageFile = path.join(REPORT_DIR, 'coverage-summary.json');
    if (fs.existsSync(coverageFile)) {
      const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

      console.log('\n📊 Coverage Summary:');
      console.log('====================');

      // Display coverage for each metric
      const metrics = ['lines', 'statements', 'functions', 'branches'];
      let allMetricsAboveThreshold = true;

      metrics.forEach((metric) => {
        const coverage = coverageData.total[metric];
        if (coverage) {
          const pct = coverage.pct;
          const status = pct >= COVERAGE_THRESHOLD ? '✅' : '❌';
          console.log(`${status} ${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${pct}%`);

          if (pct < COVERAGE_THRESHOLD) {
            allMetricsAboveThreshold = false;
          }
        }
      });

      console.log('\n📁 Detailed reports available in:');
      console.log(`   - ${path.join(REPORT_DIR, 'lcov-report', 'index.html')} (HTML report)`);
      console.log(`   - ${path.join(REPORT_DIR, 'lcov.info')} (LCov report)`);

      if (allMetricsAboveThreshold) {
        console.log('\n🎉 Coverage target achieved! All metrics above 80% threshold.');
        process.exit(0);
      } else {
        console.log('\n⚠️  Some coverage metrics are below the 80% threshold.');
        console.log('   Please improve test coverage to meet the target.');
        process.exit(1);
      }
    } else {
      console.log('\n⚠️  Coverage summary file not found.');
      process.exit(1);
    }
  } else {
    console.log('\n❌ Coverage directory not found.');
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Tests failed or coverage check failed:');
  console.error(error.message);
  process.exit(1);
}
