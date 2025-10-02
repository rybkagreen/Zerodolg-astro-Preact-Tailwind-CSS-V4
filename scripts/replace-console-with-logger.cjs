#!/usr/bin/env node

/**
 * Скрипт для замены console.* на Logger
 * Использование: node scripts/replace-console-with-logger.cjs
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Файлы и директории для исключения
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.astro/**',
  '**/build/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/logger.ts', // Сам logger может использовать console
  '**/*.optimized.*',
  '**/modal-debug.ts',
  '**/puppeteer-helper.*',
  '**/fix-*.js',
  '**/fix-*.cjs',
  'scripts/**', // Скрипты сборки могут использовать console
  '**/vitest.setup.ts',
  '**/__tests__/**',
];

// Паттерны для замены
const CONSOLE_PATTERNS = {
  log: /console\.log\(/g,
  warn: /console\.warn\(/g,
  error: /console\.error\(/g,
  info: /console\.info\(/g,
  debug: /console\.debug\(/g,
};

/**
 * Проверяет, нужен ли import Logger
 */
function needsLoggerImport(content) {
  return (
    content.includes('console.') &&
    !content.includes("from '@/shared/lib/logger'") &&
    !content.includes('from "../shared/lib/logger"') &&
    !content.includes('from "../../shared/lib/logger"')
  );
}

/**
 * Добавляет import Logger в начало файла
 */
function addLoggerImport(content, filePath) {
  const ext = path.extname(filePath);

  // Для TypeScript/TSX файлов
  if (ext === '.ts' || ext === '.tsx') {
    // Проверяем, есть ли уже другие импорты
    const importMatch = content.match(/^import\s+/m);

    if (importMatch) {
      // Добавляем после первого блока импортов
      const firstImportIndex = content.indexOf(importMatch[0]);
      const importLine = "import { logger } from '@/shared/lib/logger';\n";

      // Находим конец блока импортов
      const lines = content.split('\n');
      let insertIndex = 0;
      let inImportBlock = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('import ')) {
          inImportBlock = true;
        } else if (inImportBlock && line === '') {
          insertIndex = i;
          break;
        }
      }

      if (insertIndex > 0) {
        lines.splice(insertIndex, 0, importLine.trim());
        return lines.join('\n');
      }
    }

    // Если нет импортов, добавляем в начало после комментариев
    const lines = content.split('\n');
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
        insertIndex = i;
        break;
      }
    }

    lines.splice(insertIndex, 0, "import { logger } from '@/shared/lib/logger';", '');
    return lines.join('\n');
  }

  // Для Astro файлов
  if (ext === '.astro') {
    // Добавляем в <script> секцию
    if (content.includes('<script>')) {
      return content.replace(
        '<script>',
        "<script>\nimport { logger } from '@/shared/lib/logger';\n"
      );
    } else if (content.includes('---\n')) {
      return content.replace('---\n', "---\nimport { logger } from '@/shared/lib/logger';\n");
    }
  }

  return content;
}

/**
 * Заменяет console.* на logger.*
 */
function replaceConsoleWithLogger(content) {
  let modified = content;

  // Заменяем console.log на logger.debug в dev или убираем в prod
  modified = modified.replace(/console\.log\(/g, 'logger.debug(');
  modified = modified.replace(/console\.info\(/g, 'logger.info(');
  modified = modified.replace(/console\.warn\(/g, 'logger.warn(');
  modified = modified.replace(/console\.error\(/g, 'logger.error(');
  modified = modified.replace(/console\.debug\(/g, 'logger.debug(');

  return modified;
}

/**
 * Обрабатывает один файл
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Проверяем, есть ли console statements
  if (!content.includes('console.')) {
    return false;
  }

  let modified = content;

  // Добавляем import если нужно
  if (needsLoggerImport(content)) {
    modified = addLoggerImport(modified, filePath);
  }

  // Заменяем console.* на logger.*
  modified = replaceConsoleWithLogger(modified);

  // Удаляем eslint-disable комментарии для console
  modified = modified.replace(/\/\/ eslint-disable-next-line no-console\n/g, '');
  modified = modified.replace(/\/\* eslint-disable no-console \*\/\n/g, '');

  // Удаляем DEV обертки если они были
  modified = modified.replace(/if \(import\.meta\.env\.DEV\) \{\s*\n\s*logger\./g, 'logger.');
  modified = modified.replace(/\s*\n\s*\}/g, '');

  if (modified !== content) {
    fs.writeFileSync(filePath, modified, 'utf8');
    return true;
  }

  return false;
}

/**
 * Основная функция
 */
async function main() {
  console.log('🔍 Поиск файлов с console statements...\n');

  // Ищем все файлы
  const files = await glob('src/**/*.{ts,tsx,js,jsx,astro}', {
    ignore: EXCLUDE_PATTERNS,
  });

  console.log(`📁 Найдено файлов: ${files.length}\n`);

  let totalModified = 0;
  const modifiedFiles = [];

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);

    try {
      const modified = processFile(file);

      if (modified) {
        totalModified++;
        modifiedFiles.push(relativePath);
        console.log(`  ✅ ${relativePath}`);
      }
    } catch (error) {
      console.error(`  ❌ Ошибка в ${relativePath}:`, error.message);
    }
  }

  console.log(`\n\n✨ Обработка завершена!`);
  console.log(`📊 Статистика:`);
  console.log(`   - Всего файлов проверено: ${files.length}`);
  console.log(`   - Файлов изменено: ${totalModified}`);
  console.log(`   - console.* заменены на logger.* ✓`);

  if (modifiedFiles.length > 0) {
    console.log(`\n📝 Измененные файлы:`);
    modifiedFiles.forEach((file) => console.log(`   - ${file}`));
  }

  console.log(`\n💡 Рекомендуется запустить:`);
  console.log(`   npm run format`);
  console.log(`   npm run lint`);
  console.log(`   npm run type-check`);
}

// Запуск
main().catch((error) => {
  console.error('❌ Ошибка:', error);
  process.exit(1);
});
