#!/bin/bash

# ZeroDolg Astro Production Build Script
# This script runs the complete production build process

set -e  # Exit on any error

echo "🚀 ZeroDolg Astro - Production Build"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "🔧 Node.js version: $NODE_VERSION"

if [[ "$NODE_VERSION" < "v18" ]]; then
    echo "⚠️  Warning: Node.js version below 18.x detected. Consider upgrading."
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Running environment setup..."
    npm run env:setup
fi

# Validate environment
echo "🔍 Validating environment..."
npm run env:validate

# Run pre-build validation
echo "✅ Running pre-build validation..."
node scripts/build-production.js

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "🎉 Production build completed successfully!"
    echo "📂 Build output is located in the 'dist' directory"
    echo "👀 To preview locally: npm run preview"
else
    echo "❌ Production build failed!"
    exit 1
fi