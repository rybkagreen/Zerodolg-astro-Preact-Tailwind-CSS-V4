#!/usr/bin/env node

/**
 * Simple test script for the Puppeteer MCP Server
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMCPServer() {
  console.log('🧪 Testing Puppeteer MCP Server...');

  const serverPath = join(__dirname, 'mcp-puppeteer-server.js');

  console.log('📍 Server path:', serverPath);
  console.log('🚀 Starting server in test mode...');

  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: __dirname,
  });

  // Give the server a moment to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test basic functionality by sending an MCP message
  try {
    // Send a ListTools request
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
    };

    server.stdin.write(JSON.stringify(listToolsRequest) + '\\n');

    // Listen for response
    server.stdout.on('data', (data) => {
      console.log('📨 Server response:', data.toString());
    });

    // Give it time to process
    setTimeout(() => {
      console.log('✅ Test completed');
      server.kill('SIGTERM');
      process.exit(0);
    }, 3000);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    server.kill('SIGTERM');
    process.exit(1);
  }

  server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    process.exit(1);
  });
}

testMCPServer().catch(console.error);
