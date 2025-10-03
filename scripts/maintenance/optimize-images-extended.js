// scripts/maintenance/optimize-images-extended.js
// Расширенный скрипт оптимизации изображений для проекта ZeroDolg

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Целевые размеры из IMAGE_SEO_GUIDE.md
const TARGET_SIZES = {
  hero: 200 * 1024, // 200KB
  team: 100 * 1024, // 100KB
  icons: 50 * 1024, // 50KB
  thumbnails: 30 * 1024, // 30KB
};

// Папки с изображениями в проекте
const IMAGE_DIRS = [
  'public/images/team',
  'public/images/blog',
  'public/images/proof',
  'public/images/sections',
  'public/patterns',
];

async function getImages(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    let images = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        images = images.concat(await getImages(fullPath));
      } else if (isImageFile(entry.name)) {
        const stats = await fs.stat(fullPath);
        images.push({
          path: fullPath,
          size: stats.size,
          name: entry.name,
        });
      }
    }

    return images;
  } catch (error) {
    console.warn(`Не удалось прочитать директорию ${dir}:`, error.message);
    return [];
  }
}

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'].includes(ext);
}

function getTargetSize(imagePath) {
  if (imagePath.includes('/team/')) {
    return TARGET_SIZES.team;
  } else if (imagePath.includes('/blog/')) {
    return TARGET_SIZES.hero; // большие изображения для статей
  } else if (imagePath.includes('/patterns/') || imagePath.includes('/sections/')) {
    return TARGET_SIZES.hero; // фоновые изображения
  } else if (imagePath.includes('/proof/')) {
    return TARGET_SIZES.hero; // документы и доказательства
  } else {
    return TARGET_SIZES.hero; // fallback
  }
}

async function optimizeImage(imagePath, targetSize) {
  try {
    const buffer = await fs.readFile(imagePath);
    const metadata = await sharp(buffer).metadata();

    console.log(`Оптимизация: ${imagePath} (оригинал: ${buffer.length} байт)`);

    // Определить параметры оптимизации в зависимости от типа изображения
    let optimizedBuffer;

    if (path.extname(imagePath).toLowerCase() === '.svg') {
      // SVG файлы не оптимизируем, просто проверяем размер
      if (buffer.length <= targetSize) {
        console.log(`✓ ${path.basename(imagePath)} уже оптимизирован`);
        return buffer.length;
      }
      console.log(`⚠ ${path.basename(imagePath)} превышает размер, но SVG не оптимизируется`);
      return buffer.length;
    }

    // Настройка оптимизации для изображений
    const quality = calculateQuality(buffer.length, targetSize);

    if (metadata.format === 'jpeg') {
      optimizedBuffer = await sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer();
    } else if (metadata.format === 'png') {
      optimizedBuffer = await sharp(buffer).png({ quality }).toBuffer();
    } else if (metadata.format === 'webp') {
      optimizedBuffer = await sharp(buffer).webp({ quality }).toBuffer();
    } else {
      // Для других форматов используем webp как целевой формат
      optimizedBuffer = await sharp(buffer).webp({ quality }).toBuffer();
    }

    // Если оптимизированное изображение все еще больше целевого размера,
    // уменьшаем разрешение
    let resizeFactor = 1;
    if (optimizedBuffer.length > targetSize) {
      resizeFactor = Math.sqrt(targetSize / optimizedBuffer.length);
      resizeFactor = Math.min(resizeFactor, 0.9); // Максимальное уменьшение на 10%

      optimizedBuffer = await sharp(buffer)
        .resize(
          Math.round(metadata.width * resizeFactor),
          Math.round(metadata.height * resizeFactor)
        )
        .webp({ quality: quality > 70 ? 70 : quality }) // Уменьшаем качество при уменьшении размера
        .toBuffer();
    }

    // Сохраняем оптимизированное изображение
    if (optimizedBuffer.length < buffer.length) {
      await fs.writeFile(imagePath, optimizedBuffer);
      console.log(
        `✓ ${path.basename(imagePath)} оптимизировано: ${buffer.length} -> ${optimizedBuffer.length} байт (${Math.round((1 - optimizedBuffer.length / buffer.length) * 100)}% сжато)`
      );
      return optimizedBuffer.length;
    } else {
      console.log(
        `✓ ${path.basename(imagePath)} уже оптимизирован (новый размер: ${optimizedBuffer.length} байт)`
      );
      return optimizedBuffer.length;
    }
  } catch (error) {
    console.error(`Ошибка при оптимизации ${imagePath}:`, error.message);
    return -1;
  }
}

function calculateQuality(currentSize, targetSize) {
  // Вычисляем качество на основе соотношения текущего и целевого размера
  const ratio = currentSize / targetSize;

  if (ratio <= 1) {
    // Если файл уже меньше целевого размера, оставляем его как есть
    return 85; // стандартное качество
  } else if (ratio < 1.5) {
    return 80; // среднее качество
  } else if (ratio < 2) {
    return 70; // низкое качество
  } else {
    return 60; // самое низкое качество
  }
}

async function main() {
  console.log('Запуск скрипта оптимизации изображений...\n');

  let totalSavings = 0;
  let totalOptimized = 0;

  for (const dir of IMAGE_DIRS) {
    const fullPath = path.join(__dirname, '..', '..', dir);
    console.log(`\nОбработка директории: ${fullPath}`);

    const images = await getImages(fullPath);
    console.log(`Найдено изображений: ${images.length}`);

    for (const image of images) {
      const targetSize = getTargetSize(image.path);

      if (image.size > targetSize) {
        console.log(`⚠ ${image.name} превышает целевой размер (${image.size} > ${targetSize})`);
        const newSize = await optimizeImage(image.path, targetSize);

        if (newSize > 0) {
          const savings = image.size - newSize;
          if (savings > 0) {
            totalSavings += savings;
          }
          totalOptimized++;
        }
      } else {
        console.log(
          `✓ ${image.name} уже соответствует целевому размеру (${image.size} <= ${targetSize})`
        );
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Оптимизация завершена!`);
  console.log(`Оптимизировано: ${totalOptimized} изображений`);
  console.log(`Экономия: ${Math.round(totalSavings / 1024)} KB`);
  console.log('='.repeat(50));
}

// Запуск скрипта
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  getImages,
  isImageFile,
  getTargetSize,
  optimizeImage,
  calculateQuality,
};
