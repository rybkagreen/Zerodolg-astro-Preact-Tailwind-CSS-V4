#!/bin/bash

# Script to find all asset references in the Astro project

echo "Finding all asset references in the project..."
echo "==========================================="
echo ""

# Create temporary file for results
TEMP_FILE=$(mktemp)

# Search for asset references in all source files
echo "Searching in source files..."

# Find direct asset references
grep -r -h -o -E '(src=|href=|url\()["\047]?(/assets/[^"\047\)]+)["\047\)]?' \
    --include="*.astro" \
    --include="*.tsx" \
    --include="*.jsx" \
    --include="*.ts" \
    --include="*.js" \
    --include="*.css" \
    src/ 2>/dev/null | \
    sed -E 's/.*(\/assets\/[^"\047\)]+).*/\1/' | \
    sed 's/["\047)]$//' >> $TEMP_FILE

# Also find patterns like /og-image.jpg, /favicon.svg etc
grep -r -h -o -E '(src=|href=|content=)["\047](/[^/][^"\047]+\.(svg|png|jpg|jpeg|webp|ico))["\047]' \
    --include="*.astro" \
    --include="*.tsx" \
    --include="*.jsx" \
    --include="*.ts" \
    --include="*.js" \
    --include="*.css" \
    src/ 2>/dev/null | \
    sed -E 's/.*([\/][^"\047]+\.(svg|png|jpg|jpeg|webp|ico)).*/\1/' >> $TEMP_FILE

# Sort and remove duplicates
sort -u $TEMP_FILE > used-assets.txt

# Clean up
rm $TEMP_FILE

echo "Found $(wc -l < used-assets.txt) unique asset references:"
echo ""
cat used-assets.txt

echo ""
echo "Results saved to: used-assets.txt"
