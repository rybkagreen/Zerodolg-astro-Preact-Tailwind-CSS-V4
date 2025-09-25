const fs = require('fs');
const path = require('path');

function analyzeStaticFiles() {
  console.log('🔍 Анализ статических файлов после миграции на Tailwind CSS...\n');

  const results = {
    errors: [],
    warnings: [],
    tests: [],
    summary: {},
  };

  try {
    // Проверяем существование dist директории
    const distPath = path.resolve('./dist');
    if (!fs.existsSync(distPath)) {
      results.errors.push('Директория dist не найдена');
      return results;
    }

    console.log('✅ Директория dist найдена');
    results.tests.push({ name: 'dist directory', status: 'success' });

    // Анализируем main HTML файл
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      const htmlContent = fs.readFileSync(indexPath, 'utf-8');

      console.log('📄 Анализируем index.html...');

      // Проверяем наличие Tailwind классов
      const tailwindClasses = [
        'bg-',
        'text-',
        'p-',
        'm-',
        'flex',
        'grid',
        'w-',
        'h-',
        'rounded',
        'shadow',
        'border',
        'hover:',
        'focus:',
      ];

      let tailwindFound = false;
      tailwindClasses.forEach((cls) => {
        if (htmlContent.includes(cls)) {
          tailwindFound = true;
        }
      });

      if (tailwindFound) {
        console.log('✅ Tailwind CSS классы найдены в HTML');
        results.tests.push({ name: 'Tailwind classes in HTML', status: 'success' });
      } else {
        console.log('⚠️  Tailwind CSS классы не найдены в HTML');
        results.warnings.push('Tailwind CSS классы не обнаружены в HTML файле');
        results.tests.push({ name: 'Tailwind classes in HTML', status: 'warning' });
      }

      // Проверяем на остатки BEM классов
      const bemPattern = /class="[^"]*(?:__|\-\-)[^"]*"/g;
      const bemMatches = htmlContent.match(bemPattern);

      if (bemMatches && bemMatches.length > 0) {
        console.log(
          `⚠️  Найдены возможные остатки BEM классов: ${bemMatches.slice(0, 5).join(', ')}${bemMatches.length > 5 ? '...' : ''}`
        );
        results.warnings.push(`Найдены BEM классы: ${bemMatches.length} штук`);
        results.tests.push({
          name: 'BEM classes removal',
          status: 'warning',
          details: `${bemMatches.length} BEM classes found`,
        });
      } else {
        console.log('✅ BEM классы успешно удалены');
        results.tests.push({ name: 'BEM classes removal', status: 'success' });
      }

      // Проверяем CSS файлы
      const cssLinkPattern = /<link[^>]+href="([^"]+\.css)"[^>]*>/g;
      const cssLinks = [];
      let match;
      while ((match = cssLinkPattern.exec(htmlContent)) !== null) {
        cssLinks.push(match[1]);
      }

      console.log(`📋 Найдено CSS файлов: ${cssLinks.length}`);
      cssLinks.forEach((link, i) => {
        console.log(`  ${i + 1}. ${link}`);

        // Проверяем существование CSS файла
        const cssPath = path.join(distPath, link.replace(/^\//, ''));
        if (fs.existsSync(cssPath)) {
          console.log(`    ✅ Файл существует`);

          // Читаем содержимое CSS файла
          const cssContent = fs.readFileSync(cssPath, 'utf-8');

          // Проверяем наличие Tailwind утилит
          const tailwindUtilities = [
            '.bg-',
            '.text-',
            '.flex',
            '.grid',
            '.p-',
            '.m-',
            '.w-',
            '.h-',
          ];
          let tailwindUtilitiesFound = 0;

          tailwindUtilities.forEach((utility) => {
            if (cssContent.includes(utility)) {
              tailwindUtilitiesFound++;
            }
          });

          if (tailwindUtilitiesFound > 0) {
            console.log(`    ✅ Найдено Tailwind утилит: ${tailwindUtilitiesFound}`);
          } else {
            console.log(`    ⚠️  Tailwind утилиты не найдены`);
          }
        } else {
          console.log(`    ❌ Файл не найден: ${cssPath}`);
          results.errors.push(`CSS файл не найден: ${link}`);
        }
      });

      results.tests.push({ name: 'CSS files', status: 'success', count: cssLinks.length });

      // Проверяем JavaScript файлы
      const jsScriptPattern = /<script[^>]+src="([^"]+\.js)"[^>]*>/g;
      const jsLinks = [];
      while ((match = jsScriptPattern.exec(htmlContent)) !== null) {
        jsLinks.push(match[1]);
      }

      console.log(`📋 Найдено JS файлов: ${jsLinks.length}`);
      let jsFilesExist = 0;

      jsLinks.forEach((link, i) => {
        const jsPath = path.join(distPath, link.replace(/^\//, ''));
        if (fs.existsSync(jsPath)) {
          jsFilesExist++;
          console.log(`  ✅ ${link}`);
        } else {
          console.log(`  ❌ ${link} (не найден)`);
          results.errors.push(`JS файл не найден: ${link}`);
        }
      });

      results.tests.push({
        name: 'JS files',
        status: jsFilesExist === jsLinks.length ? 'success' : 'partial',
        found: jsFilesExist,
        total: jsLinks.length,
      });

      // Проверяем структуру HTML
      const htmlStructure = {
        hasDoctype: htmlContent.includes('<!DOCTYPE html>'),
        hasHtml: htmlContent.includes('<html'),
        hasHead: htmlContent.includes('<head>'),
        hasBody: htmlContent.includes('<body>'),
        hasTitle: htmlContent.includes('<title>'),
        hasViewport: htmlContent.includes('viewport'),
      };

      Object.entries(htmlStructure).forEach(([key, value]) => {
        if (value) {
          console.log(`✅ ${key}: найден`);
          results.tests.push({ name: key, status: 'success' });
        } else {
          console.log(`⚠️  ${key}: не найден`);
          results.tests.push({ name: key, status: 'warning' });
          results.warnings.push(`HTML структура: ${key} не найден`);
        }
      });
    } else {
      console.log('❌ index.html не найден');
      results.errors.push('index.html файл не найден');
    }

    // Проверяем другие HTML страницы
    const htmlFiles = fs
      .readdirSync(distPath)
      .filter((file) => file.endsWith('.html') && file !== 'index.html');

    if (htmlFiles.length > 0) {
      console.log(`\n📄 Найдены дополнительные HTML файлы: ${htmlFiles.length}`);
      htmlFiles.forEach((file) => {
        console.log(`  📄 ${file}`);
        const filePath = path.join(distPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Быстрая проверка на Tailwind классы
        const hasTailwind = ['bg-', 'text-', 'flex', 'grid'].some((cls) => content.includes(cls));
        if (hasTailwind) {
          console.log(`    ✅ Содержит Tailwind классы`);
        } else {
          console.log(`    ⚠️  Не содержит Tailwind классы`);
          results.warnings.push(`${file} не содержит Tailwind классы`);
        }
      });
      results.tests.push({
        name: 'Additional HTML files',
        status: 'found',
        count: htmlFiles.length,
      });
    }

    // Суммарная статистика
    results.summary = {
      totalTests: results.tests.length,
      successfulTests: results.tests.filter((t) => t.status === 'success').length,
      warningTests: results.tests.filter((t) => t.status === 'warning').length,
      failedTests: results.tests.filter((t) => t.status === 'failed').length,
      totalErrors: results.errors.length,
      totalWarnings: results.warnings.length,
    };
  } catch (error) {
    console.error('❌ Ошибка при анализе:', error.message);
    results.errors.push(`Ошибка анализа: ${error.message}`);
  }

  return results;
}

// Запускаем анализ
const results = analyzeStaticFiles();

// Выводим итоговый отчет
console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ АНАЛИЗА:');
console.log('='.repeat(50));

if (results.errors.length === 0) {
  console.log('✅ Критических ошибок не найдено');
} else {
  console.log(`❌ Найдено ошибок: ${results.errors.length}`);
  results.errors.forEach((error, i) => {
    console.log(`  ${i + 1}. ${error}`);
  });
}

if (results.warnings.length === 0) {
  console.log('✅ Предупреждений нет');
} else {
  console.log(`⚠️  Найдено предупреждений: ${results.warnings.length}`);
  results.warnings.forEach((warning, i) => {
    console.log(`  ${i + 1}. ${warning}`);
  });
}

console.log(`\n📈 СТАТИСТИКА ТЕСТОВ:`);
console.log(`Всего тестов: ${results.summary.totalTests}`);
console.log(`Успешных: ${results.summary.successfulTests} ✅`);
console.log(`Предупреждений: ${results.summary.warningTests} ⚠️`);
console.log(`Провальных: ${results.summary.failedTests} ❌`);

// Оценка качества миграции
const migrationScore =
  (results.summary.successfulTests / Math.max(results.summary.totalTests, 1)) * 100;
console.log(`\n🎯 ОЦЕНКА КАЧЕСТВА МИГРАЦИИ: ${migrationScore.toFixed(1)}%`);

if (migrationScore >= 90) {
  console.log('🎉 ОТЛИЧНО! Миграция выполнена успешно!');
} else if (migrationScore >= 75) {
  console.log('👍 ХОРОШО! Миграция выполнена с минорными проблемами.');
} else if (migrationScore >= 50) {
  console.log('⚠️  УДОВЛЕТВОРИТЕЛЬНО. Есть проблемы, требующие внимания.');
} else {
  console.log('❌ ТРЕБУЕТСЯ ДОРАБОТКА. Множественные проблемы.');
}

// Сохраняем отчет
fs.writeFileSync('migration-analysis.json', JSON.stringify(results, null, 2));
console.log('\n📄 Детальный отчет сохранен в migration-analysis.json');

// Выход с соответствующим кодом
process.exit(results.errors.length > 0 ? 1 : 0);
