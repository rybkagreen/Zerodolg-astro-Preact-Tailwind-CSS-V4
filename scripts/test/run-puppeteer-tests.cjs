#!/usr/bin/env node

// Script to run Puppeteer tests for the Astro site with MCP
const { spawn } = require('child_process');
const path = require('path');

// Function to start the Astro dev server
function startAstroDevServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Astro development server...');

    const server = spawn('npx', ['astro', 'dev'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Astro Server] ${output}`);

      // Check if the server is ready
      if (output.includes('Local') && output.includes('Network')) {
        serverReady = true;
        console.log('Astro development server is ready!');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`[Astro Server Error] ${data}`);
    });

    server.on('close', (code) => {
      if (!serverReady) {
        reject(new Error(`Astro server exited with code ${code} before becoming ready`));
      }
    });

    // Wait up to 30 seconds for the server to start
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Timeout: Astro server did not start within 30 seconds'));
      }
    }, 30000);
  });
}

// Function to run Puppeteer tests
async function runPuppeteerTests() {
  console.log('Running Puppeteer tests...');

  try {
    const { exampleMcpUsage, testPage } = require('./puppeteer-mcp-example.js');

    // Test the homepage
    await exampleMcpUsage();

    // Test other important pages
    const pagesToTest = ['/', '/o-nas', '/uslugi', '/kontakty', '/reviews'];

    for (const page of pagesToTest) {
      await testPage(page);
    }

    console.log('All Puppeteer tests completed successfully!');
  } catch (error) {
    console.error('Error running Puppeteer tests:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  let server;

  try {
    // Start the Astro dev server
    server = await startAstroDevServer();

    // Wait a bit more to ensure the server is fully ready
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Run Puppeteer tests
    await runPuppeteerTests();
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  } finally {
    // Clean up: kill the server if it was started
    if (server) {
      server.kill();
      console.log('Astro development server stopped.');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  startAstroDevServer,
  runPuppeteerTests,
};
