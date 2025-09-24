#!/bin/bash

# Build the production site
echo "Building production site..."
npm run build:prod

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Production build completed successfully!"
    echo "Files are located in the 'dist' directory."
    echo "You can now deploy these files to your production server."
else
    echo "Production build failed!"
    exit 1
fi