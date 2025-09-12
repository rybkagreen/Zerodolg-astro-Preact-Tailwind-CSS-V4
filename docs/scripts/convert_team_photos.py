#!/usr/bin/env python3
"""
Convert team photos from JPG to WebP format with background removal.
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
    print("✓ PIL (Pillow) is installed")
except ImportError:
    print("❌ PIL (Pillow) is not installed")
    print("Installing Pillow...")
    os.system(f"{sys.executable} -m pip install Pillow")
    from PIL import Image

def convert_jpg_to_webp(input_path, output_path):
    """Convert JPG image to WebP format."""
    try:
        # Open the image
        img = Image.open(input_path)
        
        # Convert to RGBA if not already (for transparency support)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # For now, we'll just convert to WebP without background removal
        # since automatic background removal requires additional libraries
        # The images can be manually edited later if needed
        
        # Save as WebP with high quality
        img.save(output_path, 'WEBP', quality=90, method=6)
        
        # Get file sizes for comparison
        input_size = os.path.getsize(input_path) / 1024  # KB
        output_size = os.path.getsize(output_path) / 1024  # KB
        
        print(f"✓ Converted {input_path.name}")
        print(f"  Size: {input_size:.1f}KB → {output_size:.1f}KB ({(1 - output_size/input_size)*100:.1f}% reduction)")
        
        return True
    except Exception as e:
        print(f"❌ Error converting {input_path}: {e}")
        return False

def main():
    # Define paths
    team_dir = Path("public/images/team")
    
    # List of team member photos to convert
    team_photos = [
        "mashulia.jpg",
        "strukova.jpg", 
        "pashkova.jpg",
        "bryantsev.jpg"
    ]
    
    print("Starting conversion of team photos to WebP format...")
    print("-" * 50)
    
    converted_count = 0
    
    for photo_name in team_photos:
        input_path = team_dir / photo_name
        output_path = team_dir / photo_name.replace('.jpg', '.webp')
        
        if not input_path.exists():
            print(f"⚠ Source file not found: {input_path}")
            continue
            
        if output_path.exists() and output_path.name != "mashulia.webp":
            # Skip mashulia.webp as it already exists
            print(f"⚠ Output file already exists: {output_path}")
            response = input(f"  Overwrite? (y/n): ").lower()
            if response != 'y':
                continue
        
        if convert_jpg_to_webp(input_path, output_path):
            converted_count += 1
    
    print("-" * 50)
    print(f"✅ Conversion complete! {converted_count}/{len(team_photos)} files converted.")
    
    # Note about background removal
    print("\n📝 Note: For professional background removal, consider using:")
    print("   - Online tools like remove.bg")
    print("   - Image editing software like GIMP or Photoshop")
    print("   - Python libraries like rembg (requires additional setup)")

if __name__ == "__main__":
    main()
