const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function optimizeImage(inputPath, outputPath, width, height, quality) {
  return new Promise((resolve, reject) => {
    // Check if ImageMagick convert is available
    exec('convert -version', (error, stdout, stderr) => {
      if (error) {
        console.log('ImageMagick not found, skipping image optimization');
        resolve(null);
        return;
      }
      
      // Optimize the image
      const command = `convert "${inputPath}" -resize ${width}x${height} -quality ${quality} "${outputPath}"`;
      console.log(`Running: ${command}`);
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error optimizing ${inputPath}:`, error.message);
          reject(error);
          return;
        }
        
        // Get file sizes
        fs.stat(inputPath, (err, originalStats) => {
          if (err) {
            console.error(`Error getting stats for ${inputPath}:`, err.message);
            resolve(null);
            return;
          }
          
          fs.stat(outputPath, (err, newStats) => {
            if (err) {
              console.error(`Error getting stats for ${outputPath}:`, err.message);
              resolve(null);
              return;
            }
            
            const saved = originalStats.size - newStats.size;
            const percent = ((saved / originalStats.size) * 100).toFixed(1);
            
            console.log(`Optimized ${path.basename(inputPath)}: ${originalStats.size} -> ${newStats.size} bytes (${percent}% saved)`);
            resolve({ originalSize: originalStats.size, newSize: newStats.size, saved });
          });
        });
      });
    });
  });
}

async function optimizeAllImages() {
  console.log('Starting image optimization...');
  
  // Optimize team images
  const teamDir = path.join(__dirname, '..', 'public', 'images', 'team');
  
  try {
    const teamFiles = fs.readdirSync(teamDir);
    
    for (const file of teamFiles) {
      if (file.endsWith('.webp')) {
        const inputPath = path.join(teamDir, file);
        const outputPath = path.join(teamDir, file.replace('.webp', '-opt.webp'));
        
        await optimizeImage(inputPath, outputPath, 200, 200, 80);
      }
    }
  } catch (error) {
    console.error('Error optimizing team images:', error.message);
  }
  
  console.log('Image optimization complete!');
}

optimizeAllImages().catch(console.error);