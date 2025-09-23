#!/usr/bin/env node

/**
 * Скрипт для автоматической миграции Handlebars компонентов в Astro
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComponentMigrator {
  constructor() {
    this.sourceDir = 'd:/develop/zerodolg.ru/public_html';
    this.targetDir = path.join(__dirname, '..');
  }

  async migrate(componentName) {
    console.log(`\n📦 Миграция компонента: ${componentName}`);

    // Пути к файлам
    const hbsPath = path.join(this.sourceDir, `src/templates/partials/${componentName}.hbs`);
    const jsPath = path.join(this.sourceDir, `src/js/components/${componentName}.js`);
    const cssPath = path.join(this.sourceDir, `src/styles/04-sections/_${componentName}.css`);

    // Проверяем существование файлов
    const hasHbs = await fs.pathExists(hbsPath);
    const hasJs = await fs.pathExists(jsPath);
    const hasCss = await fs.pathExists(cssPath);

    console.log(`  • HBS шаблон: ${hasHbs ? '✅' : '❌'}`);
    console.log(`  • JS логика: ${hasJs ? '✅' : '❌'}`);
    console.log(`  • CSS стили: ${hasCss ? '✅' : '❌'}`);

    if (!hasHbs) {
      console.log(`  ⚠️ Шаблон ${componentName}.hbs не найден, пропускаем...`);
      return;
    }

    // Читаем содержимое
    const hbsContent = await fs.readFile(hbsPath, 'utf-8');

    // Определяем тип компонента
    const componentType = this.detectComponentType(componentName, hasJs);
    console.log(`  • Тип компонента: ${componentType}`);

    // Конвертируем в Astro
    const astroContent = this.convertToAstro(hbsContent, componentName, hasJs);

    // Определяем путь для сохранения
    const targetPath = path.join(
      this.targetDir,
      'src/components',
      componentType,
      `${this.capitalize(componentName)}.astro`
    );

    // Создаем директорию если нужно
    await fs.ensureDir(path.dirname(targetPath));

    // Сохраняем Astro компонент
    await fs.writeFile(targetPath, astroContent);
    console.log(`  ✅ Создан: ${targetPath}`);

    // Если есть JS логика, создаем интерактивный компонент
    if (hasJs && componentType === 'islands') {
      await this.createIslandLogic(componentName, jsPath);
    }

    // Копируем CSS если есть
    if (hasCss) {
      const targetCssPath = path.join(this.targetDir, 'src/styles', `${componentName}.css`);
      await fs.copy(cssPath, targetCssPath);
      console.log(`  ✅ Скопированы стили: ${targetCssPath}`);
    }
  }

  detectComponentType(componentName, hasJs) {
    // Статические компоненты (без JS)
    const staticComponents = ['footer', 'header', 'benefits', 'contacts'];
    // Динамические компоненты (полностью клиентские)
    const dynamicComponents = ['sticky-cta', 'exit-intent', 'modal'];

    if (staticComponents.includes(componentName.toLowerCase())) {
      return 'static';
    }
    if (dynamicComponents.includes(componentName.toLowerCase())) {
      return 'dynamic';
    }
    // По умолчанию - island (частично интерактивные)
    return hasJs ? 'islands' : 'static';
  }

  convertToAstro(hbsContent, componentName, hasJs) {
    let astroContent = hbsContent;

    // Базовые замены Handlebars -> Astro

    // {{variable}} -> {variable}
    astroContent = astroContent.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      // Пропускаем специальные хелперы
      if (variable.includes('#') || variable.includes('/')) {
        return match;
      }
      return `{${variable.trim()}}`;
    });

    // {{#if condition}} -> {condition && (
    astroContent = astroContent.replace(/\{\{#if\s+([^}]+)\}\}/g, '{$1 && (');
    astroContent = astroContent.replace(/\{\{\/if\}\}/g, ')}');

    // {{#unless condition}} -> {!condition && (
    astroContent = astroContent.replace(/\{\{#unless\s+([^}]+)\}\}/g, '{!$1 && (');
    astroContent = astroContent.replace(/\{\{\/unless\}\}/g, ')}');

    // {{#each items}} -> {items.map(item => (
    astroContent = astroContent.replace(/\{\{#each\s+([^}]+)\}\}/g, '{$1.map((item, index) => (');
    astroContent = astroContent.replace(/\{\{\/each\}\}/g, '))}');

    // {{@index}} -> {index}
    astroContent = astroContent.replace(/\{\{@index\}\}/g, '{index}');

    // {{this}} -> {item}
    astroContent = astroContent.replace(/\{\{this\}\}/g, '{item}');

    // Создаем frontmatter
    const frontmatter = `---
// ${this.capitalize(componentName)}.astro
export interface Props {
  title?: string;
  data?: any;
  [key: string]: any;
}

const props = Astro.props;
${hasJs ? `\n// Import interactive logic\nimport ${this.capitalize(componentName)}Logic from './${this.capitalize(componentName)}Logic.tsx';` : ''}
---

`;

    // Добавляем интерактивную логику если нужно
    const interactiveLogic = hasJs
      ? `\n<!-- Load interactive logic when visible -->\n<${this.capitalize(componentName)}Logic client:visible {...props} />`
      : '';

    return frontmatter + astroContent + interactiveLogic;
  }

  async createIslandLogic(componentName, jsPath) {
    const jsContent = await fs.readFile(jsPath, 'utf-8');

    // Простая конвертация JS в TSX компонент
    const tsxContent = `// ${this.capitalize(componentName)}Logic.tsx
import { useEffect } from 'preact/hooks';

export interface ${this.capitalize(componentName)}Props {
  data?: any;
  [key: string]: any;
}

export default function ${this.capitalize(componentName)}Logic(props: ${this.capitalize(componentName)}Props) {
  useEffect(() => {
    // Миграция логики из ${componentName}.js
    // TODO: Адаптировать под React/Preact синтаксис
    
${this.extractJsLogic(jsContent)}
  }, []);
  
  return null;
}`;

    const targetPath = path.join(
      this.targetDir,
      'src/components/islands',
      `${this.capitalize(componentName)}Logic.tsx`
    );

    await fs.writeFile(targetPath, tsxContent);
    console.log(`  ✅ Создана логика: ${targetPath}`);
  }

  extractJsLogic(jsContent) {
    // Извлекаем основную логику из JS файла
    // Убираем определения классов и экспорты
    let logic = jsContent
      .replace(/class\s+\w+\s*{[\s\S]*?^}/gm, '')
      .replace(/export\s+(default\s+)?/g, '')
      .replace(/import\s+.*?;/g, '');

    // Добавляем отступы
    logic = logic
      .split('\n')
      .map((line) => '    ' + line)
      .join('\n');

    return logic;
  }

  capitalize(str) {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    );
  }

  async listAvailableComponents() {
    const partialsDir = path.join(this.sourceDir, 'src/templates/partials');

    console.log(`Проверяем путь: ${partialsDir}`);

    if (!(await fs.pathExists(partialsDir))) {
      console.log('❌ Директория partials не найдена');
      return [];
    }

    const files = await fs.readdir(partialsDir);
    const components = files
      .filter((file) => file.endsWith('.hbs'))
      .map((file) => file.replace('.hbs', ''));

    return components;
  }
}

// Запуск миграции
async function main() {
  const migrator = new ComponentMigrator();

  console.log('🚀 Начинаем миграцию компонентов из Handlebars в Astro\n');

  // Получаем список доступных компонентов
  const availableComponents = await migrator.listAvailableComponents();

  if (availableComponents.length === 0) {
    console.log('❌ Компоненты не найдены');
    return;
  }

  console.log(`📋 Найдено компонентов: ${availableComponents.length}`);
  console.log(availableComponents.map((c) => `  • ${c}`).join('\n'));

  // Мигрируем все компоненты
  for (const component of availableComponents) {
    try {
      await migrator.migrate(component);
    } catch (error) {
      console.error(`❌ Ошибка при миграции ${component}:`, error.message);
    }
  }

  console.log('\n✅ Миграция завершена!');
  console.log('\n📝 Не забудьте:');
  console.log('  1. Проверить и адаптировать TSX логику в islands компонентах');
  console.log('  2. Обновить импорты в страницах');
  console.log('  3. Протестировать функциональность');
}

// Обработка ошибок
main().catch((error) => {
  console.error('❌ Ошибка при миграции:', error);
  process.exit(1);
});
