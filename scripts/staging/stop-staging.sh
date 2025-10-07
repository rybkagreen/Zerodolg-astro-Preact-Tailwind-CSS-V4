#!/bin/bash

# Script to stop the staging environment
set -e  # Exit on any error

echo "🛑 Stopping staging environment..."

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
docker compose down

echo "✅ Staging environment stopped successfully!"