#!/bin/bash

echo "Starting full production optimization process..."

# 1. Test configuration
echo "1. Testing configuration..."
./scripts/test-config.sh
if [ $? -ne 0 ]; then
    echo "Configuration test failed!"
    exit 1
fi

# 2. Build production site
echo "2. Building production site..."
./scripts/build-prod.sh
if [ $? -ne 0 ]; then
    echo "Production build failed!"
    exit 1
fi

echo "Production optimization process completed successfully!"
echo "Site is ready for deployment in the 'dist' directory."