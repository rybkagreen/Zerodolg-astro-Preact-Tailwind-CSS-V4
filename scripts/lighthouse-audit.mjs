import { exec } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to run lighthouse audit
async function runLighthouseAudit() {
  // Ensure the dist folder exists
  if (!existsSync('./dist')) {
    console.error('Error: dist folder does not exist. Please run "npm run build" first.');
    process.exit(1);
  }

  console.log('Starting local server to serve dist folder...');
  
  // Use serve to host the dist folder
  const serveProcess = exec('npx serve -l 3000 ./dist', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error}`);
      return;
    }
  });

  // Wait a moment for the server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Running Lighthouse audit... This may take a minute...');
  
  try {
    // Run lighthouse against the local server
    const { stdout, stderr } = await execAsync(
      'npx lighthouse http://localhost:3000 --output json --output-path ./lighthouse-report.json --chrome-flags="--headless"'
    );
    
    console.log('Lighthouse audit completed successfully!');
    
    // Kill the serve process
    serveProcess.kill();
    
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
        fullReportPath: './lighthouse-report.json'
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
    console.error(`Lighthouse error: ${error}`);
    serveProcess.kill();
    throw error;
  }
}

// Check if lighthouse is available
async function checkLighthouse() {
  try {
    const { stdout } = await execAsync('npx lighthouse --version');
    console.log('Lighthouse is available:', stdout.trim());
    return true;
  } catch (error) {
    console.log('Lighthouse not found. Installing...');
    try {
      await execAsync('npm install -D @lhci/cli');
      console.log('Lighthouse installed successfully');
      return true;
    } catch (installError) {
      console.error('Error installing lighthouse:', installError);
      return false;
    }
  }
}

// Main function
async function main() {
  console.log('Starting Lighthouse audit process...');
  
  // Check if lighthouse is available
  const hasLighthouse = await checkLighthouse();
  
  if (!hasLighthouse) {
    console.error('Unable to install or access Lighthouse. Please install it manually:');
    console.log('npm install -g @lhci/cli');
    process.exit(1);
  }
  
  try {
    await runLighthouseAudit();
    console.log('Lighthouse audit completed successfully!');
  } catch (error) {
    console.error('Error during Lighthouse audit:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}