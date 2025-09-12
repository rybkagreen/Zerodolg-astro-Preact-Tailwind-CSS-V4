#!/bin/bash

# Generate placeholder SVG images for team members
team_members=("mashulia" "strukova" "pashkova" "bryantsev")

for member in "${team_members[@]}"; do
  cat > "public/images/team/${member}.jpg" << EOF
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#e5e7eb"/>
  <circle cx="150" cy="120" r="40" fill="#9ca3af"/>
  <ellipse cx="150" cy="220" rx="60" ry="40" fill="#9ca3af"/>
  <text x="150" y="260" font-family="Arial" font-size="14" text-anchor="middle" fill="#6b7280">${member}</text>
</svg>
EOF
done

# Create emblem placeholder
cat > "public/assets/icons/ui/emblem.webp" << 'EOF'
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="60" fill="#3b82f6" rx="8"/>
  <text x="30" y="35" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">ZD</text>
</svg>
EOF

# Create Judge image placeholder
cat > "public/assets/images/Judge.png" << 'EOF'
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <rect x="150" y="100" width="100" height="150" fill="#6b7280"/>
  <circle cx="200" cy="140" r="25" fill="#9ca3af"/>
  <text x="200" y="280" font-family="Arial" font-size="16" text-anchor="middle" fill="#4b5563">Judge</text>
</svg>
EOF

# Create pattern placeholders
patterns=(
  "Digital Artwork Of An Unbalanced Scale Representing Financial Relief.png"
  "pattern-2.png"
  "Pastel Paint Strokes Abstract Digital Art Social Media Post.png"
  "Pastel Paint Strokes Abstract Digital Art Social Media Post (1).png"
  "Pastel Paint Strokes Abstract Digital Art Social Media Post (2).png"
  "Pastel Paint Strokes Abstract Digital Art Social Media Post (3).png"
)

for pattern in "${patterns[@]}"; do
  cat > "public/assets/patterns/${pattern}" << EOF
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle cx="50" cy="50" r="30" fill="#3b82f6" opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#pattern)"/>
</svg>
EOF
done

# Copy team member placeholder to assets folder
cp "public/images/team/mashulia.jpg" "public/assets/images/team/mashulia.webp"

echo "Placeholder images created successfully!"
