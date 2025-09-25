const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testJavaScriptFunctionality() {
  let browser;
  const results = {
    errors: [],
    warnings: [],
    tests: []
  };

  try {
    console.log('🚀 Запуск автоматизированной проверки JavaScript функций...\n');

    // Запускаем браузер
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Включаем логирование консоли
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        results.errors.push({
          type: 'console_error',
          message: text,
          url: page.url()
        });
        console.log(`❌ Ошибка JavaScript: ${text}`);
      } else if (type === 'warning') {
        results.warnings.push({
          type: 'console_warning',
          message: text,
          url: page.url()
        });
        console.log(`⚠️  Предупреждение: ${text}`);
      }
    });

    // Слушаем ошибки страницы
    page.on('pageerror', error => {
      results.errors.push({
        type: 'page_error',
        message: error.message,
        stack: error.stack,
        url: page.url()
      });
      console.log(`💥 Ошибка страницы: ${error.message}`);
    });

    // Проверяем главную страницу
    console.log('🔍 Проверка главной страницы...');
    await page.goto('file://' + path.resolve('./dist/index.html'), { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Ждем загрузки всех скриптов
    await page.waitForTimeout(2000);

    // Проверяем, что Tailwind CSS загружен
    const tailwindTest = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.className = 'bg-red-500';
      document.body.appendChild(testEl);
      const computedStyle = window.getComputedStyle(testEl);
      const hasRed = computedStyle.backgroundColor.includes('rgb(239, 68, 68)') || 
                     computedStyle.backgroundColor.includes('rgb(220, 38, 38)') ||
                     computedStyle.backgroundColor.includes('#ef4444') ||
                     computedStyle.backgroundColor.includes('#dc2626');
      document.body.removeChild(testEl);
      return hasRed;
    });

    if (tailwindTest) {
      console.log('✅ Tailwind CSS успешно загружен и работает');
      results.tests.push({ name: 'Tailwind CSS', status: 'success' });
    } else {
      console.log('❌ Tailwind CSS не загружен или не работает');
      results.tests.push({ name: 'Tailwind CSS', status: 'failed' });
    }

    // Проверяем интерактивные элементы
    console.log('🔍 Проверка интерактивных элементов...');

    // Проверяем кнопки
    const buttons = await page.$$('button');
    console.log(`Найдено кнопок: ${buttons.length}`);

    // Проверяем формы
    const forms = await page.$$('form');
    console.log(`Найдено форм: ${forms.length}`);

    // Проверяем скрипты
    const scripts = await page.$$('script[src]');
    console.log(`Найдено внешних скриптов: ${scripts.length}`);

    // Проверяем Astro islands (элементы с astro-island атрибутом)
    const astroIslands = await page.$$('[astro-island]');
    console.log(`Найдено Astro islands: ${astroIslands.length}`);
    
    if (astroIslands.length > 0) {
      results.tests.push({ name: 'Astro Islands', status: 'found', count: astroIslands.length });
    }

    // Проверяем наличие критических DOM элементов
    const criticalElements = await page.evaluate(() => {
      const checks = {
        hasNavigation: !!document.querySelector('nav'),
        hasHeader: !!document.querySelector('header'),
        hasFooter: !!document.querySelector('footer'),
        hasMainContent: !!document.querySelector('main') || !!document.querySelector('.main'),
        hasLinks: document.querySelectorAll('a').length > 0,
        hasImages: document.querySelectorAll('img').length > 0
      };
      return checks;
    });

    Object.entries(criticalElements).forEach(([key, value]) => {
      if (value) {
        console.log(`✅ ${key}: найден`);
        results.tests.push({ name: key, status: 'success' });
      } else {
        console.log(`⚠️  ${key}: не найден`);
        results.tests.push({ name: key, status: 'warning' });
      }
    });

    // Проверяем CSS файлы
    const cssLinks = await page.$$('link[rel="stylesheet"]');
    console.log(`Найдено CSS файлов: ${cssLinks.length}`);
    
    for (let i = 0; i < cssLinks.length; i++) {
      const href = await cssLinks[i].evaluate(el => el.href);
      console.log(`CSS файл ${i + 1}: ${href}`);
    }

    // Проверяем, что нет старых BEM классов
    const bemClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const bemPatterns = [];
      
      elements.forEach(el => {
        const classes = Array.from(el.classList);
        classes.forEach(cls => {
          if (cls.includes('__') || cls.includes('--')) {
            bemPatterns.push(cls);
          }
        });
      });
      
      return [...new Set(bemPatterns)]; // убираем дубликаты
    });

    if (bemClasses.length > 0) {
      console.log(`⚠️  Найдены остатки BEM классов: ${bemClasses.join(', ')}`);
      results.warnings.push({
        type: 'bem_classes_found',
        message: `Найдены BEM классы: ${bemClasses.join(', ')}`,
        classes: bemClasses
      });
    } else {
      console.log('✅ BEM классы успешно удалены');
      results.tests.push({ name: 'BEM Classes Removal', status: 'success' });
    }

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    results.errors.push({
      type: 'test_error',
      message: error.message,
      stack: error.stack
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Выводим итоговый отчет
  console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ:');
  console.log('==================');
  
  if (results.errors.length === 0) {
    console.log('✅ Критических ошибок не найдено');
  } else {
    console.log(`❌ Найдено ошибок: ${results.errors.length}`);
    results.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. [${error.type}] ${error.message}`);
    });
  }

  if (results.warnings.length === 0) {
    console.log('✅ Предупреждений нет');
  } else {
    console.log(`⚠️  Найдено предупреждений: ${results.warnings.length}`);
    results.warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. [${warning.type}] ${warning.message}`);
    });
  }

  console.log(`\nВыполнено тестов: ${results.tests.length}`);
  results.tests.forEach(test => {
    const icon = test.status === 'success' ? '✅' : test.status === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}${test.count ? ` (${test.count})` : ''}`);
  });

  // Сохраняем детальный отчет в файл
  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Детальный отчет сохранен в test-results.json');

  return results;
}

// Запускаем тестирование
testJavaScriptFunctionality().then(results => {
  const hasErrors = results.errors.length > 0;
  const hasWarnings = results.warnings.length > 0;
  
  if (!hasErrors && !hasWarnings) {
    console.log('\n🎉 Все тесты пройдены успешно! Миграция на Tailwind CSS завершена.');
    process.exit(0);
  } else if (!hasErrors) {
    console.log('\n⚠️  Тесты завершены с предупреждениями. Проверьте детали выше.');
    process.exit(0);
  } else {
    console.log('\n❌ Найдены критические ошибки. Необходимо исправление.');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Критическая ошибка при выполнении тестов:', error);
  process.exit(1);
});