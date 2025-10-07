#!/bin/bash

# Script to restart the staging environment
set -e  # Exit on any error

echo "🔄 Restarting staging environment..."

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
docker compose down

# Start Docker containers in detached mode
echo "🐳 Starting Docker containers..."
docker compose up --build -d

echo "⏳ Waiting for containers to be ready..."
sleep 40

# Check if containers are running
echo "🔍 Checking container status..."
docker compose ps

echo "✅ Staging environment restarted successfully!"