#!/bin/bash

# Script to start the staging environment
set -e  # Exit on any error

echo "🚀 Starting staging environment..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Start Docker containers in detached mode
echo "🐳 Starting Docker containers..."
docker compose up --build -d

echo "⏳ Waiting for containers to be ready..."
sleep 40

# Check if containers are running
echo "🔍 Checking container status..."
docker compose ps

echo "✅ Staging environment started successfully!"
echo "🌐 Application should be available at http://localhost:3000"
echo ""
echo "💡 To run tests, use: npm run staging:test"
echo "💡 To stop staging, use: npm run staging:down"