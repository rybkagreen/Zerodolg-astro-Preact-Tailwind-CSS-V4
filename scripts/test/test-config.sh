#!/bin/bash

echo "Testing Astro configuration..."

# Check if required files exist
if [ ! -f "astro.config.mjs" ]; then
    echo "Error: astro.config.mjs not found"
    exit 1
fi

if [ ! -f "astro.config.prod.mjs" ]; then
    echo "Error: astro.config.prod.mjs not found"
    exit 1
fi

# Check if required dependencies are in package.json
if ! grep -q "terser" package.json; then
    echo "Error: terser not found in package.json dependencies"
    exit 1
fi

if ! grep -q "lightningcss" package.json; then
    echo "Error: lightningcss not found in package.json dependencies"
    exit 1
fi

# Check if build scripts exist
if ! grep -q "build:prod" package.json; then
    echo "Error: build:prod script not found in package.json"
    exit 1
fi

echo "All tests passed! Configuration is ready for production."