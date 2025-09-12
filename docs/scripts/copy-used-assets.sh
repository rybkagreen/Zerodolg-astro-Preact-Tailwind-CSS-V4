#!/bin/bash

# Script to copy only used assets from the original project

SOURCE_DIR="/d/develop/zerodolg.ru/zerodolg-astro/../public_html/src/assets"
DEST_DIR="/d/develop/zerodolg.ru/zerodolg-astro/public/assets"

echo "Copying only used assets from original project..."
echo "================================================="
echo ""

# Create directories structure
mkdir -p "$DEST_DIR/icons/process"
mkdir -p "$DEST_DIR/icons/solution"
mkdir -p "$DEST_DIR/icons/ui"
mkdir -p "$DEST_DIR/images/team"
mkdir -p "$DEST_DIR/patterns"
mkdir -p "$DEST_DIR/badges"

# Function to copy file if exists
copy_if_exists() {
    local src="$1"
    local dest="$2"
    if [ -f "$src" ]; then
        cp "$src" "$dest"
        echo "✓ Copied: $(basename "$src")"
    else
        echo "✗ Not found: $src"
    fi
}

# Copy logo files
echo "Copying logo files..."
copy_if_exists "$SOURCE_DIR/icons/logo.svg" "$DEST_DIR/icons/logo.svg"
copy_if_exists "$SOURCE_DIR/images/logo.svg" "$DEST_DIR/images/logo.svg"
copy_if_exists "$SOURCE_DIR/images/logo-white.svg" "$DEST_DIR/images/logo-white.svg"

# If logo files don't exist in images, try to find them elsewhere
if [ ! -f "$DEST_DIR/images/logo.svg" ]; then
    copy_if_exists "$SOURCE_DIR/icons/logo.svg" "$DEST_DIR/images/logo.svg"
fi
if [ ! -f "$DEST_DIR/images/logo-white.svg" ]; then
    # Create a copy if not found
    if [ -f "$DEST_DIR/icons/logo.svg" ]; then
        cp "$DEST_DIR/icons/logo.svg" "$DEST_DIR/images/logo-white.svg"
        echo "✓ Created logo-white.svg from logo.svg"
    fi
fi

# Copy favicon files to public root
echo ""
echo "Copying favicon files..."
copy_if_exists "$SOURCE_DIR/icons/favicon.svg" "/d/develop/zerodolg.ru/zerodolg-astro/public/favicon.svg"
copy_if_exists "$SOURCE_DIR/icons/favicon-32x32.png" "/d/develop/zerodolg.ru/zerodolg-astro/public/favicon.png"
copy_if_exists "$SOURCE_DIR/icons/apple-touch-icon.png" "/d/develop/zerodolg.ru/zerodolg-astro/public/apple-touch-icon.png"

# Copy UI icons
echo ""
echo "Copying UI icons..."
copy_if_exists "$SOURCE_DIR/icons/ui/emblem.webp" "$DEST_DIR/icons/ui/emblem.webp"
copy_if_exists "$SOURCE_DIR/icons/ui/emblem.png" "$DEST_DIR/icons/ui/emblem.png"

# Copy process icons (for Timeline component)
echo ""
echo "Copying process icons..."
copy_if_exists "$SOURCE_DIR/icons/process/01-analysis.svg" "$DEST_DIR/icons/process/01-analysis.svg"
copy_if_exists "$SOURCE_DIR/icons/process/02-docs.svg" "$DEST_DIR/icons/process/02-docs.svg"
copy_if_exists "$SOURCE_DIR/icons/process/03-court.svg" "$DEST_DIR/icons/process/03-court.svg"
copy_if_exists "$SOURCE_DIR/icons/process/04-restruct.svg" "$DEST_DIR/icons/process/04-restruct.svg"
copy_if_exists "$SOURCE_DIR/icons/process/05-liquidation.svg" "$DEST_DIR/icons/process/05-liquidation.svg"
copy_if_exists "$SOURCE_DIR/icons/process/06-discharge.svg" "$DEST_DIR/icons/process/06-discharge.svg"

# Copy solution icons (if used)
echo ""
echo "Copying solution icons..."
copy_if_exists "$SOURCE_DIR/icons/solution/01-shield-check.svg" "$DEST_DIR/icons/solution/01-shield-check.svg"
copy_if_exists "$SOURCE_DIR/icons/solution/02-bell-off.svg" "$DEST_DIR/icons/solution/02-bell-off.svg"
copy_if_exists "$SOURCE_DIR/icons/solution/03-home-shield.svg" "$DEST_DIR/icons/solution/03-home-shield.svg"
copy_if_exists "$SOURCE_DIR/icons/solution/04-chain-broken.svg" "$DEST_DIR/icons/solution/04-chain-broken.svg"
copy_if_exists "$SOURCE_DIR/icons/solution/05-family.svg" "$DEST_DIR/icons/solution/05-family.svg"
copy_if_exists "$SOURCE_DIR/icons/solution/06-check.svg" "$DEST_DIR/icons/solution/06-check.svg"

# Copy pattern images (check in different possible locations)
echo ""
echo "Copying pattern images..."
# Try patterns folder
copy_if_exists "$SOURCE_DIR/patterns/Digital Artwork Of An Unbalanced Scale Representing Financial Relief.png" "$DEST_DIR/patterns/Digital Artwork Of An Unbalanced Scale Representing Financial Relief.png"
copy_if_exists "$SOURCE_DIR/patterns/pattern-2.png" "$DEST_DIR/patterns/pattern-2.png"
copy_if_exists "$SOURCE_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post (1).png" "$DEST_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post (1).png"
copy_if_exists "$SOURCE_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post (2).png" "$DEST_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post (2).png"
copy_if_exists "$SOURCE_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post (3).png" "$DEST_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post (3).png"
copy_if_exists "$SOURCE_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post.png" "$DEST_DIR/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post.png"

# Try images folder if not found in patterns
if [ ! -f "$DEST_DIR/patterns/pattern-2.png" ]; then
    copy_if_exists "$SOURCE_DIR/images/patterns/pattern-2.png" "$DEST_DIR/patterns/pattern-2.png"
fi

# Copy team photos
echo ""
echo "Copying team photos..."
copy_if_exists "$SOURCE_DIR/images/team/mashulia.webp" "$DEST_DIR/images/team/mashulia.webp"
copy_if_exists "$SOURCE_DIR/images/team/mashulia.jpg" "$DEST_DIR/images/team/mashulia.jpg"

# Copy other images
echo ""
echo "Copying other images..."
copy_if_exists "$SOURCE_DIR/images/Judge.png" "$DEST_DIR/images/Judge.png"

# Create og-image.jpg placeholder if not exists
echo ""
echo "Checking for og-image..."
if [ ! -f "/d/develop/zerodolg.ru/zerodolg-astro/public/og-image.jpg" ]; then
    echo "Creating placeholder og-image.jpg..."
    # Try to find an existing og-image
    copy_if_exists "$SOURCE_DIR/images/og-image.jpg" "/d/develop/zerodolg.ru/zerodolg-astro/public/og-image.jpg"
    if [ ! -f "/d/develop/zerodolg.ru/zerodolg-astro/public/og-image.jpg" ]; then
        copy_if_exists "$SOURCE_DIR/../images/og-image.jpg" "/d/develop/zerodolg.ru/zerodolg-astro/public/og-image.jpg"
    fi
fi

echo ""
echo "Asset copying completed!"
echo ""
echo "Summary:"
echo "--------"
ls -la "$DEST_DIR/icons/" 2>/dev/null | grep -E '\.svg|\.png|\.webp' | wc -l | xargs echo "Icons copied:"
ls -la "$DEST_DIR/images/" 2>/dev/null | grep -E '\.svg|\.png|\.jpg|\.webp' | wc -l | xargs echo "Images copied:"
ls -la "$DEST_DIR/patterns/" 2>/dev/null | grep -E '\.png|\.jpg' | wc -l | xargs echo "Patterns copied:"
ls -la "/d/develop/zerodolg.ru/zerodolg-astro/public/" | grep -E 'favicon|apple-touch|og-image' | wc -l | xargs echo "Root files copied:"
