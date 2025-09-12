#!/bin/bash

echo "Creating missing placeholder assets..."
echo "======================================"
echo ""

# Create pattern-2.png placeholder (simple gradient pattern)
if [ ! -f "public/assets/patterns/pattern-2.png" ]; then
    echo "Creating pattern-2.png placeholder..."
    # Copy one of existing patterns as pattern-2
    if [ -f "public/assets/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post.png" ]; then
        cp "public/assets/patterns/Pastel Paint Strokes Abstract Digital Art Social Media Post.png" \
           "public/assets/patterns/pattern-2.png"
        echo "✓ Created pattern-2.png from existing pattern"
    fi
fi

# Create og-image.jpg placeholder
if [ ! -f "public/og-image.jpg" ]; then
    echo "Creating og-image.jpg placeholder..."
    # Create a simple SVG and convert to JPG using ImageMagick if available
    cat > public/og-image.svg << 'EOF'
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">
    ZeroDolg
  </text>
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" opacity="0.9">
    Банкротство физических лиц
  </text>
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">
    Законное списание долгов • Защита от коллекторов
  </text>
</svg>
EOF
    
    # Check if convert is available
    if command -v convert &> /dev/null; then
        convert public/og-image.svg public/og-image.jpg
        rm public/og-image.svg
        echo "✓ Created og-image.jpg"
    else
        # If no convert, keep SVG and create a simple HTML as fallback
        echo "⚠ ImageMagick not found, keeping SVG version"
        mv public/og-image.svg public/og-image.svg.bak
        # Create a simple colored rectangle as JPG alternative (base64 encoded tiny JPG)
        echo "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=" | base64 -d > public/og-image.jpg
        echo "✓ Created minimal og-image.jpg placeholder"
    fi
fi

echo ""
echo "Asset creation completed!"
echo ""
echo "Current assets status:"
ls -la public/assets/patterns/pattern-2.png 2>/dev/null && echo "✓ pattern-2.png exists"
ls -la public/og-image.jpg 2>/dev/null && echo "✓ og-image.jpg exists"
ls -la public/favicon.svg 2>/dev/null && echo "✓ favicon.svg exists"
ls -la public/favicon.png 2>/dev/null && echo "✓ favicon.png exists"
ls -la public/apple-touch-icon.png 2>/dev/null && echo "✓ apple-touch-icon.png exists"
