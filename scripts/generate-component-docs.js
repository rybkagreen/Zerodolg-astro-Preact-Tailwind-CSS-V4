#!/usr/bin/env node

/**
 * Скрипт для генерации документации по компонентам
 * 
 * Этот скрипт сканирует директорию src/components и создает
 * документацию по каждому компоненту на основе JSDoc комментариев.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к директориям
const srcComponentsDir = path.join(__dirname, '..', 'src', 'components');
const docsDir = path.join(__dirname, '..', 'docs');
const componentsDocFile = path.join(docsDir, 'components-auto.md');

// Функция для извлечения JSDoc комментариев из файла
function extractJSDoc(content) {
  const jsDocRegex = /\/\*\*\s*\n([\s\S]*?)\s*\*\//;
  const match = content.match(jsDocRegex);
  
  if (!match) return null;
  
  const jsDocContent = match[1];
  const lines = jsDocContent.split('\n').map(line => line.trim().replace(/^\*\s?/, ''));
  
  const componentInfo = {
    name: '',
    description: '',
    example: '',
    props: []
  };
  
  let currentSection = '';
  let currentProp = null;
  
  for (const line of lines) {
    if (line.startsWith('@component')) {
      componentInfo.name = line.replace('@component ', '').trim();
    } else if (line.startsWith('@description')) {
      currentSection = 'description';
      componentInfo.description = line.replace('@description ', '').trim();
    } else if (line.startsWith('@example')) {
      currentSection = 'example';
      componentInfo.example = line.replace('@example', '').trim();
    } else if (line.startsWith('@prop')) {
      currentSection = 'props';
      const propMatch = line.match(/@prop\s+{([^}]+)}\s+([^\\s]+)\s*-\s*(.*)/);
      if (propMatch) {
        currentProp = {
          type: propMatch[1],
          name: propMatch[2],
          description: propMatch[3]
        };
        componentInfo.props.push(currentProp);
      }
    } else {
      // Продолжение предыдущей секции
      if (currentSection === 'description') {
        componentInfo.description += ' ' + line;
      } else if (currentSection === 'example') {
        componentInfo.example += '\n' + line;
      } else if (currentSection === 'props' && currentProp) {
        currentProp.description += ' ' + line;
      }
    }
  }
  
  return componentInfo;
}

// Функция для сканирования директории компонентов
async function scanComponents(dir, prefix = '') {
  const components = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      const subComponents = await scanComponents(itemPath, `${prefix}${item}/`);
      components.push(...subComponents);
    } else if (item.endsWith('.astro')) {
      const content = await fs.readFile(itemPath, 'utf8');
      const jsDocInfo = extractJSDoc(content);
      
      if (jsDocInfo) {
        components.push({
          ...jsDocInfo,
          filePath: itemPath.replace(srcComponentsDir, '').substring(1),
          relativePath: `${prefix}${item}`
        });
      }
    }
  }
  
  return components;
}

// Функция для генерации Markdown документации
function generateMarkdown(components) {
  let markdown = `# Автоматически сгенерированная документация по компонентам

Эта документация была автоматически сгенерирована на основе JSDoc комментариев в компонентах.

## Содержание

`;
  
  // Добавляем содержание
  components.forEach((component, index) => {
    markdown += `${index + 1}. [${component.name || component.relativePath}](#${component.name ? component.name.toLowerCase() : component.relativePath.replace(/\//g, '-').replace('.astro', '')})\n`;
  });
  
  markdown += '\n';
  
  // Добавляем документацию по каждому компоненту
  components.forEach((component, index) => {
    markdown += `## ${index + 1}. ${component.name || component.relativePath}\n\n`;
    markdown += `**Путь:** \`${component.filePath}\`\n\n`;
    
    if (component.description) {
      markdown += `**Описание:** ${component.description}\n\n`;
    }
    
    if (component.props && component.props.length > 0) {
      markdown += `**Props:**\n\n`;
      markdown += `| Название | Тип | Описание |\n`;
      markdown += `|----------|-----|----------|\n`;
      
      component.props.forEach(prop => {
        markdown += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.description} |\n`;
      });
      
      markdown += '\n';
    }
    
    if (component.example) {
      markdown += `**Пример использования:**\n\n`;
      markdown += '```astro\n';
      markdown += component.example;
      markdown += '\n```\n\n';
    }
    
    markdown += '---\n\n';
  });
  
  return markdown;
}

// Основная функция
async function main() {
  try {
    console.log('Сканирование компонентов...');
    const components = await scanComponents(srcComponentsDir);
    
    console.log(`Найдено ${components.length} компонентов с JSDoc комментариями`);
    
    if (components.length === 0) {
      console.log('Компоненты с JSDoc комментариями не найдены');
      return;
    }
    
    console.log('Генерация Markdown документации...');
    const markdown = generateMarkdown(components);
    
    console.log(`Сохранение документации в ${componentsDocFile}...`);
    await fs.writeFile(componentsDocFile, markdown);
    
    console.log('Документация успешно сгенерирована!');
  } catch (error) {
    console.error('Ошибка при генерации документации:', error);
    process.exit(1);
  }
}

// Запуск скрипта
main();
