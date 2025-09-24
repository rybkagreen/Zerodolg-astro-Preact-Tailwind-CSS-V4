import { exec } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runLighthouseAudit() {
  try {
    console.log('Running Lighthouse audit on built site...');

    // Run lighthouse against a local server (you need to have it running on port 3000)
    const { stdout, stderr } = await execAsync(
      'npx lighthouse http://localhost:3000 --output json --output-path ./lighthouse-report.json --chrome-flags="--headless"'
    );

    if (stderr) {
      console.error(stderr);
    }

    console.log('Lighthouse audit completed!');

    // Read the results
    if (existsSync('./lighthouse-report.json')) {
      const report = JSON.parse(readFileSync('./lighthouse-report.json', 'utf8'));

      // Extract key metrics
      const categories = report.categories;
      const performance = categories.performance.score * 100;
      const accessibility = categories.accessibility.score * 100;
      const bestPractices = categories['best-practices'].score * 100;
      const seo = categories.seo.score * 100;

      // Print summary
      console.log('\n--- Lighthouse Audit Results ---');
      console.log(`Performance: ${performance.toFixed(2)}`);
      console.log(`Accessibility: ${accessibility.toFixed(2)}`);
      console.log(`Best Practices: ${bestPractices.toFixed(2)}`);
      console.log(`SEO: ${seo.toFixed(2)}`);
      console.log('--------------------------------\n');

      // Create a summary file
      const summary = {
        timestamp: new Date().toISOString(),
        url: 'http://localhost:3000',
        performance,
        accessibility,
        bestPractices,
        seo,
        fullReportPath: './lighthouse-report.json',
      };

      writeFileSync('./lighthouse-summary.json', JSON.stringify(summary, null, 2));
      console.log('Lighthouse summary saved to lighthouse-summary.json');
      console.log('Full report saved to lighthouse-report.json');

      return summary;
    } else {
      console.error('Lighthouse report file not found');
      throw new Error('Lighthouse report file not found');
    }
  } catch (error) {
    console.error('Error during Lighthouse audit:', error);
    throw error;
  }
}

// This script assumes you have a server running on localhost:3000
// You can start one with: npx serve ./dist -l 3000
console.log('Please make sure you have a server running on http://localhost:3000');
console.log('You can start one with: npx serve ./dist -l 3000');
console.log('Then run this script.');

// Uncomment this if you want to run it directly
// runLighthouseAudit();
