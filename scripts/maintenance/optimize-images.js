import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const stats = await fs.stat(inputPath);
    console.log(`Optimizing ${path.basename(inputPath)} (${(stats.size / 1024).toFixed(2)} KB)`);

    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: options.quality || 80 })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const saved = stats.size - newStats.size;
    const percent = ((saved / stats.size) * 100).toFixed(1);

    console.log(
      `  Optimized to ${(newStats.size / 1024).toFixed(2)} KB, saved ${saved} bytes (${percent}%)`
    );

    return { originalSize: stats.size, newSize: newStats.size, saved };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeAllImages() {
  console.log('Starting image optimization...');

  // Optimize team images
  const teamDir = path.join(__dirname, '..', 'public', 'images', 'team');
  try {
    await fs.access(teamDir);
    const teamFiles = await fs.readdir(teamDir);

    for (const file of teamFiles) {
      if (file.endsWith('.webp')) {
        const inputPath = path.join(teamDir, file);
        const outputPath = path.join(teamDir, file.replace('.webp', '-opt.webp'));

        await optimizeImage(inputPath, outputPath, {
          width: 200,
          height: 200,
          quality: 80,
        });
      }
    }
  } catch (error) {
    console.error('Error accessing team directory:', error.message);
  }

  // Optimize pattern images
  const patternsDir = path.join(__dirname, '..', 'public', 'patterns');
  try {
    await fs.access(patternsDir);
    const patternFiles = await fs.readdir(patternsDir);

    for (const file of patternFiles) {
      if (file.endsWith('.png') || file.endsWith('.jpg')) {
        const inputPath = path.join(patternsDir, file);
        const ext = path.extname(file);
        const outputPath = path.join(patternsDir, file.replace(ext, '-opt.webp'));

        await optimizeImage(inputPath, outputPath, {
          width: 800,
          quality: 70,
        });
      }
    }
  } catch (error) {
    console.error('Error accessing patterns directory:', error.message);
  }

  console.log('Image optimization complete!');
}

optimizeAllImages().catch(console.error);
