#!/usr/bin/env node

/**
 * Script to start the Puppeteer MCP Server
 * This script provides a convenient way to launch the MCP server for browser automation
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const serverPath = join(projectRoot, 'mcp-puppeteer-server.js');

console.log('🚀 Starting Puppeteer MCP Server...');
console.log(`📍 Server path: ${serverPath}`);

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: projectRoot,
});

server.on('error', (error) => {
  console.error('❌ Failed to start MCP server:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ MCP server exited with code: ${code}`);
  } else {
    console.log('✅ MCP server stopped gracefully');
  }
});

// Handle graceful shutdown
const cleanup = () => {
  console.log('\n🔄 Shutting down MCP server...');
  server.kill('SIGTERM');
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('✅ Puppeteer MCP Server is running');
console.log('📝 Available tools:');
console.log('   • navigate_to_url - Navigate to any URL');
console.log('   • take_screenshot - Capture page screenshots');
console.log('   • get_page_content - Extract HTML content');
console.log('   • get_page_title - Get page title');
console.log('   • click_element - Click on page elements');
console.log('   • type_text - Type in input fields');
console.log('   • evaluate_javascript - Run JavaScript code');
console.log('   • set_viewport_size - Change browser viewport');
console.log('\n💡 Press Ctrl+C to stop the server');
