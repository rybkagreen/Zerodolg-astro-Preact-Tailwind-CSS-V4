#!/usr/bin/env node

/**
 * Скрипт для автоматического обертывания console statements в DEV проверки
 * Использование: node scripts/wrap-console-statements.cjs
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Паттерны для поиска console statements
const CONSOLE_PATTERNS = [/^(\s*)console\.(log|warn|error|info|debug)\(/gm];

// Файлы и директории для исключения
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.astro/**',
  '**/build/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/logger.ts', // Сам logger может использовать console
  '**/*.optimized.*', // Оптимизированные файлы
  '**/modal-debug.ts', // Debug утилиты
  '**/puppeteer-helper.*',
  '**/fix-*.js',
  '**/fix-*.cjs',
  'scripts/**', // Скрипты сборки могут использовать console
];

/**
 * Проверяет, находится ли строка внутри блока if (import.meta.env.DEV)
 */
function isInsideDevCheck(lines, lineIndex) {
  let openBraces = 0;
  let insideDevCheck = false;

  // Ищем назад от текущей строки
  for (let i = lineIndex; i >= 0; i--) {
    const line = lines[i];

    // Проверяем, есть ли if (import.meta.env.DEV)
    if (line.includes('if (import.meta.env.DEV)') || line.includes('if(import.meta.env.DEV)')) {
      insideDevCheck = true;
    }

    // Подсчитываем фигурные скобки
    const openCount = (line.match(/{/g) || []).length;
    const closeCount = (line.match(/}/g) || []).length;
    openBraces += closeCount - openCount;

    // Если мы вышли за пределы блока
    if (openBraces > 0) {
      break;
    }
  }

  return insideDevCheck && openBraces === 0;
}

/**
 * Обрабатывает один файл
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Проверяем, есть ли console statement
    const consoleMatch = line.match(/^(\s*)console\.(log|warn|error|info|debug)\(/);

    if (consoleMatch) {
      // Проверяем, не обернут ли уже
      if (isInsideDevCheck(newLines, newLines.length - 1)) {
        newLines.push(line);
        continue;
      }

      // Проверяем, есть ли уже eslint-disable comment
      const hasEslintDisable =
        i > 0 && lines[i - 1].includes('eslint-disable-next-line no-console');

      if (!hasEslintDisable) {
        const indent = consoleMatch[1];
        const consoleStatement = line.trim();

        // Добавляем обертку
        newLines.push(`${indent}if (import.meta.env.DEV) {`);
        newLines.push(`${indent}  // eslint-disable-next-line no-console`);
        newLines.push(`${indent}  ${consoleStatement}`);
        newLines.push(`${indent}}`);

        modified = true;
        console.log(`  ✓ Обернута строка ${i + 1}: ${consoleStatement.substring(0, 50)}...`);
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    return true;
  }

  return false;
}

/**
 * Основная функция
 */
async function main() {
  console.log('🔍 Поиск файлов с console statements...\n');

  // Ищем все TypeScript и JavaScript файлы
  const files = await glob('src/**/*.{ts,tsx,js,jsx,astro}', {
    ignore: EXCLUDE_PATTERNS,
  });

  console.log(`📁 Найдено файлов: ${files.length}\n`);

  let processedCount = 0;
  let totalModified = 0;

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);

    // Проверяем, есть ли в файле console statements
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('console.')) {
      console.log(`\n📄 Обработка: ${relativePath}`);

      const modified = processFile(file);
      if (modified) {
        processedCount++;
        totalModified++;
        console.log(`  ✅ Файл модифицирован`);
      } else {
        console.log(`  ℹ️  Изменений не требуется (уже обернут)`);
      }
    }
  }

  console.log(`\n\n✨ Обработка завершена!`);
  console.log(`📊 Статистика:`);
  console.log(`   - Всего файлов проверено: ${files.length}`);
  console.log(`   - Файлов изменено: ${totalModified}`);
  console.log(`   - Console statements обернуты в DEV проверки ✓`);
  console.log(`\n💡 Рекомендуется запустить:`);
  console.log(`   npm run format`);
  console.log(`   npm run lint`);
}

// Запуск
main().catch((error) => {
  console.error('❌ Ошибка:', error);
  process.exit(1);
});
