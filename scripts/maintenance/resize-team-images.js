// scripts/maintenance/resize-team-images.js
// Скрипт для уменьшения размера изображений команды на 15%

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resizeTeamImages() {
  try {
    // Путь к папке с изображениями команды
    const imagesDir = join(__dirname, '..', '..', 'public', 'images', 'team');

    // Получаем список файлов в директории
    const files = await fs.readdir(imagesDir);

    // Фильтруем только изображения
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));

    console.log(`Найдено ${imageFiles.length} изображений для обработки`);

    for (const imageFile of imageFiles) {
      const imagePath = join(imagesDir, imageFile);

      try {
        // Получаем метаданные изображения
        const metadata = await sharp(imagePath).metadata();
        console.log(`Обработка ${imageFile}: ${metadata.width}x${metadata.height}`);

        // Вычисляем новые размеры (уменьшаем на 15%)
        const newWidth = Math.round(metadata.width * 0.85);
        const newHeight = Math.round(metadata.height * 0.85);

        console.log(`  Новые размеры: ${newWidth}x${newHeight}`);

        // Изменяем размер изображения
        const resizedBuffer = await sharp(imagePath)
          .resize(newWidth, newHeight, {
            fit: 'cover',
            position: 'center',
          })
          .toBuffer();

        // Сохраняем измененное изображение
        await fs.writeFile(imagePath, resizedBuffer);

        const originalSize = metadata.size || (await fs.stat(imagePath)).size;
        const newSize = resizedBuffer.length;

        console.log(
          `  Размер файла: ${originalSize} -> ${newSize} байт (${(((originalSize - newSize) / originalSize) * 100).toFixed(2)}% сжато)`
        );
      } catch (error) {
        console.error(`Ошибка при обработке ${imageFile}:`, error.message);
      }
    }

    console.log('Обработка изображений завершена');
  } catch (error) {
    console.error('Ошибка при выполнении скрипта:', error.message);
  }
}

// Проверка, запускается ли файл напрямую
import process from 'process';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  resizeTeamImages().catch(console.error);
}

export default resizeTeamImages;
