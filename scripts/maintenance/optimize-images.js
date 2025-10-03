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

    // Create WebP version
    const webpPath = outputPath.replace(path.extname(outputPath), '.webp');
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: options.quality || 80 })
      .toFile(webpPath);

    // Create AVIF version (smaller file size, slightly lower quality but much faster encoding)
    const avifPath = outputPath.replace(path.extname(outputPath), '.avif');
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .avif({
        quality: Math.max(40, (options.quality || 80) - 10),
        speed: 5,
        chromaSubsampling: '4:2:0',
      })
      .toFile(avifPath);

    // Also keep optimized original for fallback (JPEG format)
    const jpegPath = outputPath.replace(path.extname(outputPath), '.jpg');
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: options.quality || 80, mozjpeg: true })
      .toFile(jpegPath);

    const webpStats = await fs.stat(webpPath);
    const saved = stats.size - webpStats.size;
    const percent = ((saved / stats.size) * 100).toFixed(1);

    console.log(
      `  Optimized to ${(webpStats.size / 1024).toFixed(2)} KB, saved ${saved} bytes (${percent}%)`
    );

    return { originalSize: stats.size, newSize: webpStats.size, saved };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeAllImages() {
  console.log('Starting image optimization with WebP and AVIF support...');

  // Optimize team images
  const teamDir = path.join(process.cwd(), 'public', 'images', 'team');
  try {
    await fs.access(teamDir);
    const teamFiles = await fs.readdir(teamDir);

    for (const file of teamFiles) {
      if (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')) {
        const inputPath = path.join(teamDir, file);
        const ext = path.extname(file);
        const basePath = file.replace(ext, '');
        const outputPath = path.join(teamDir, `${basePath}-opt${ext}`);

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

  // Optimize blog images
  const blogDir = path.join(process.cwd(), 'public', 'images', 'blog');
  try {
    await fs.access(blogDir);
    const blogFiles = await fs.readdir(blogDir);

    for (const file of blogFiles) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
        const inputPath = path.join(blogDir, file);
        const ext = path.extname(file);
        const basePath = file.replace(ext, '');
        const outputPath = path.join(blogDir, `${basePath}-opt${ext}`);

        await optimizeImage(inputPath, outputPath, {
          width: 800,
          height: 600,
          quality: 80,
        });
      }
    }
  } catch (error) {
    console.error('Error accessing blog directory:', error.message);
  }

  // Optimize proof images
  const proofDir = path.join(process.cwd(), 'public', 'images', 'proof');
  try {
    await fs.access(proofDir);
    const proofFiles = await fs.readdir(proofDir);

    for (const file of proofFiles) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
        const inputPath = path.join(proofDir, file);
        const ext = path.extname(file);
        const basePath = file.replace(ext, '');
        const outputPath = path.join(proofDir, `${basePath}-opt${ext}`);

        await optimizeImage(inputPath, outputPath, {
          width: 1200,
          quality: 75,
        });
      }
    }
  } catch (error) {
    console.error('Error accessing proof directory:', error.message);
  }

  console.log('Image optimization complete!');
}

optimizeAllImages().catch(console.error);
