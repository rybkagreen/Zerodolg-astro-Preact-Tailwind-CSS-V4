#!/usr/bin/env node

/**
 * Fix Dependencies Script
 * Устанавливает недостающие зависимости для корректной работы Tailwind CSS и PostCSS
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const requiredDependencies = ['postcss-import', 'postcss-nesting', 'autoprefixer', 'cssnano'];

const requiredDevDependencies = ['@tailwindcss/postcss'];

console.log('🔧 Проверка и установка недостающих зависимостей...\n');

// Проверяем, что мы в корне проекта
if (!existsSync('package.json')) {
  console.error('❌ package.json не найден. Запустите скрипт из корня проекта.');
  process.exit(1);
}

// Читаем package.json
let packageJson;
try {
  const packageJsonPath = path.resolve('package.json');
  packageJson = JSON.parse(execSync(`type "${packageJsonPath}"`, { encoding: 'utf8' }));
} catch (err) {
  console.error('❌ Ошибка чтения package.json:', err.message);
  process.exit(1);
}

// Проверяем зависимости
const missingDependencies = [];
const missingDevDependencies = [];

requiredDependencies.forEach((dep) => {
  if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
    missingDependencies.push(dep);
  }
});

requiredDevDependencies.forEach((dep) => {
  if (!packageJson.devDependencies?.[dep]) {
    missingDevDependencies.push(dep);
  }
});

// Устанавливаем недостающие зависимости
if (missingDependencies.length > 0) {
  console.log('📦 Установка обычных зависимостей:', missingDependencies.join(', '));
  try {
    execSync(`npm install ${missingDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Обычные зависимости установлены successfully!\n');
  } catch (err) {
    console.error('❌ Ошибка установки обычных зависимостей:', err.message);
    process.exit(1);
  }
}

if (missingDevDependencies.length > 0) {
  console.log('🛠️  Установка dev зависимостей:', missingDevDependencies.join(', '));
  try {
    execSync(`npm install --save-dev ${missingDevDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dev зависимости установлены successfully!\n');
  } catch (err) {
    console.error('❌ Ошибка установки dev зависимостей:', err.message);
    process.exit(1);
  }
}

if (missingDependencies.length === 0 && missingDevDependencies.length === 0) {
  console.log('✅ Все необходимые зависимости уже установлены!\n');
}

// Очистка кэша и пересборка
console.log('🧹 Очистка кэша и пересборка...');
try {
  execSync('npm run clean', { stdio: 'inherit' });
  console.log('✅ Кэш очищен!\n');
} catch {
  console.log('⚠️  Команда clean не найдена, продолжаем...\n');
}

console.log('🎉 Настройка завершена! Теперь запустите:');
console.log('   npm run dev');
