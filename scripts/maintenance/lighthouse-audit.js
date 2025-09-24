const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run lighthouse audit
function runLighthouseAudit() {
  return new Promise((resolve, reject) => {
    // Ensure the dist folder exists
    if (!fs.existsSync('./dist')) {
      console.error('Error: dist folder does not exist. Please run "npm run build" first.');
      process.exit(1);
    }

    // Create a temporary server to serve the dist folder
    console.log('Starting local server to serve dist folder...');

    // Use serve to host the dist folder
    const serveProcess = exec('npx serve -l 3000 ./dist', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error}`);
        reject(error);
        return;
      }
    });

    // Wait a moment for the server to start
    setTimeout(() => {
      console.log('Running Lighthouse audit... This may take a minute...');

      // Run lighthouse against the local server
      const lighthouseProcess = exec(
        'npx lighthouse http://localhost:3000 --output json --output-path ./lighthouse-report.json --chrome-flags="--headless"',
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Lighthouse error: ${error}`);
            serveProcess.kill();
            reject(error);
            return;
          }

          console.log('Lighthouse audit completed successfully!');

          // Kill the serve process
          serveProcess.kill();

          // Read the results
          if (fs.existsSync('./lighthouse-report.json')) {
            const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

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

            fs.writeFileSync('./lighthouse-summary.json', JSON.stringify(summary, null, 2));
            console.log('Lighthouse summary saved to lighthouse-summary.json');
            console.log('Full report saved to lighthouse-report.json');

            resolve(summary);
          } else {
            console.error('Lighthouse report file not found');
            reject(new Error('Lighthouse report file not found'));
          }
        }
      );
    }, 3000); // Wait 3 seconds for server to start
  });
}

// Check if lighthouse is available
function checkLighthouse() {
  return new Promise((resolve) => {
    exec('npx lighthouse --version', (error, stdout) => {
      if (error) {
        console.log('Lighthouse not found. Installing...');
        exec('npm install -g @lhci/cli', (installError) => {
          if (installError) {
            console.error('Error installing lighthouse:', installError);
            resolve(false);
          } else {
            console.log('Lighthouse installed successfully');
            resolve(true);
          }
        });
      } else {
        console.log('Lighthouse is available:', stdout.trim());
        resolve(true);
      }
    });
  });
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
if (require.main === module) {
  main();
}
