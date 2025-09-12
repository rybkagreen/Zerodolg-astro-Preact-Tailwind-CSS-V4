# Руководство по тестированию

## Общая информация

Это руководство описывает подход к тестированию проекта ZeroDolg Astro, включая виды тестов, инструменты и процессы.

## Виды тестов

### Unit тесты
Тестирование отдельных функций и утилит.

**Инструменты**:
- Jest для JavaScript/TypeScript
- Astro testing utilities

**Что тестируем**:
- Утилиты в `/src/lib/`
- Функции обработки данных
- Хелперы и вспомогательные функции

**Пример**:
```javascript
import { calculateReviewStats } from '../src/lib/content-service.js';

describe('calculateReviewStats', () => {
  test('should calculate correct average rating', () => {
    const reviews = [
      { rating: 5 },
      { rating: 4 },
      { rating: 3 }
    ];
    const stats = calculateReviewStats(reviews);
    expect(stats.average_rating).toBe(4);
  });
});
```

### Интеграционные тесты
Тестирование взаимодействия компонентов и сервисов.

**Инструменты**:
- Playwright для тестирования компонентов
- Интеграционные тесты для API

**Что тестируем**:
- Взаимодействие компонентов
- Интеграцию с Alibaba CMS
- Работу форм и интерактивных элементов

### E2E тесты
Тестирование пользовательских сценариев.

**Инструменты**:
- Playwright
- Тестирование в реальных браузерах

**Что тестируем**:
- Основные пользовательские сценарии
- Навигацию по сайту
- Отправку форм
- Отображение контента

### Тесты доступности
Проверка соответствия требованиям доступности.

**Инструменты**:
- axe-core
- Lighthouse
- Ручное тестирование с клавиатуры

**Что проверяем**:
- Навигация с клавиатуры
- ARIA атрибуты
- Контрастность текста
- Скринридеры

### Тесты производительности
Проверка скорости работы и оптимизации.

**Инструменты**:
- Lighthouse
- WebPageTest
- Chrome DevTools

**Что измеряем**:
- Время загрузки
- Core Web Vitals
- Использование ресурсов
- Оптимизация изображений

## Инструменты тестирования

### Jest
Фреймворк для unit тестирования JavaScript/TypeScript кода.

**Конфигурация** (`jest.config.js`):
```javascript
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
```

### Playwright
Фреймворк для E2E и интеграционного тестирования.

**Конфигурация** (`playwright.config.js`):
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Lighthouse
Инструмент для аудита качества веб-приложений.

**Использование**:
```bash
# Установка
npm install -g @lhci/cli

# Запуск аудита
lhci autorun
```

## Написание тестов

### Структура тестов
Тесты организуются по следующей структуре:
```
tests/
├── unit/           # Unit тесты
├── integration/    # Интеграционные тесты
├── e2e/            # E2E тесты
└── accessibility/  # Тесты доступности
```

### Unit тесты
```javascript
// src/lib/__tests__/content-service.test.js
import { calculateReviewStats } from '../content-service.js';

describe('content-service', () => {
  describe('calculateReviewStats', () => {
    it('should calculate correct statistics', () => {
      const reviews = [
        { rating: 5, verified: true },
        { rating: 4, verified: true },
        { rating: 3, verified: false }
      ];
      
      const stats = calculateReviewStats(reviews);
      
      expect(stats.total_reviews).toBe(3);
      expect(stats.average_rating).toBeCloseTo(4);
      expect(stats.verified_percent).toBe(67);
    });
  });
});
```

### Интеграционные тесты
```javascript
// tests/integration/team-interactive.test.js
import { test, expect } from '@playwright/test';

test('TeamInteractive should display team members', async ({ page }) => {
  await page.goto('/');

  // Проверяем, что секция команды отображается
  const teamSection = page.locator('#team');
  await expect(teamSection).toBeVisible();

  // Проверяем, что отображаются вкладки с членами команды
  const teamTabs = page.locator('.team-tab');
  await expect(teamTabs).toHaveCount(4);

  // Проверяем переключение между членами команды
  const firstTab = teamTabs.first();
  await firstTab.click();
  
  const activeMember = page.locator('.team-member.active');
  await expect(activeMember).toBeVisible();
});
```

### E2E тесты
```javascript
// tests/e2e/navigation.test.js
import { test, expect } from '@playwright/test';

test('User can navigate to all main pages', async ({ page }) => {
  await page.goto('/');

  // Проверяем переход на главную страницу
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toContainText('Банкротство физических лиц');

  // Проверяем переход по навигации
  await page.click('text=Отзывы');
  await expect(page).toHaveURL('/#reviews');

  // Проверяем переход к форме обратного звонка
  await page.click('text=Получить консультацию');
  const modal = page.locator('.modal');
  await expect(modal).toBeVisible();
});
```

## Запуск тестов

### Unit тесты
```bash
# Запуск всех unit тестов
npm run test:unit

# Запуск конкретного теста
npm run test:unit -- src/lib/__tests__/content-service.test.js

# Запуск тестов в режиме watch
npm run test:unit -- --watch
```

### Интеграционные тесты
```bash
# Запуск всех интеграционных тестов
npm run test:integration

# Запуск с определенным браузером
npm run test:integration -- --project=chromium
```

### E2E тесты
```bash
# Запуск всех E2E тестов
npm run test:e2e

# Запуск в headed режиме (с открытием браузера)
npm run test:e2e -- --headed

# Запуск конкретного теста
npm run test:e2e -- tests/e2e/navigation.test.js
```

### Тесты доступности
```bash
# Запуск тестов доступности
npm run test:accessibility

# Запуск Lighthouse аудита
npm run audit:lighthouse
```

### Все тесты
```bash
# Запуск всех тестов
npm run test

# Запуск тестов с покрытием кода
npm run test:coverage
```

## CI/CD интеграция

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run unit tests
      run: npm run test:unit
      
    - name: Run integration tests
      run: npm run test:integration
      
    - name: Run E2E tests
      run: npm run test:e2e
      
    - name: Run accessibility tests
      run: npm run test:accessibility
```

## Покрытие кода

### Конфигурация покрытия
```javascript
// jest.config.js
export default {
  // ... другие настройки
  collectCoverage: true,
  collectCoverageFrom: [
    'src/lib/**/*.js',
    'src/components/**/*.astro',
    '!src/**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Цели покрытия
- **Unit тесты**: 80% покрытие критических функций
- **Интеграционные тесты**: 70% покрытие основных сценариев
- **E2E тесты**: 60% покрытие пользовательских сценариев

## Ручное тестирование

### Чек-листы

#### Тестирование компонентов
- [ ] Отображение компонента
- [ ] Работа интерактивных элементов
- [ ] Адаптивность
- [ ] Доступность
- [ ] Производительность

#### Тестирование контента
- [ ] Корректное отображение данных из CMS
- [ ] Fallback данные при недоступности CMS
- [ ] Обновление контента без перезагрузки страницы

#### Тестирование форм
- [ ] Валидация полей
- [ ] Отправка данных
- [ ] Обработка ошибок
- [ ] Подтверждение отправки

### Браузеры для тестирования
- **Chrome** (последняя версия)
- **Firefox** (последняя версия)
- **Safari** (последняя версия)
- **Edge** (последняя версия)

### Устройства для тестирования
- **Десктоп**: 1920x1080, 1366x768
- **Планшет**: 1024x768, 768x1024
- **Мобильные**: 375x667, 414x896

## Отчеты о тестировании

### Формат отчетов
Отчеты генерируются в следующих форматах:
- **HTML**: Для детального анализа
- **JSON**: Для автоматической обработки
- **LCOV**: Для интеграции с CI/CD

### Хранение отчетов
- **Локально**: В директории `coverage/`
- **CI/CD**: В виде артефактов сборки
- **Дашборды**: Для мониторинга трендов

## Лучшие практики

### Написание тестов
1. **Один assert на тест** - делает тесты более понятными
2. **Описательные названия** - помогают понять, что тестируется
3. **Изолированные тесты** - тесты не должны зависеть друг от друга
4. **Быстрые тесты** - unit тесты должны выполняться быстро

### Поддержка тестов
1. **Регулярный рефакторинг** - поддержание актуальности тестов
2. **Обновление при изменениях** - тесты должны обновляться вместе с кодом
3. **Удаление устаревших** - удаление тестов для удаленного функционала
4. **Мониторинг покрытия** - отслеживание изменений в покрытии кода

## Проблемы и решения

### Частые проблемы
1. **Медленные тесты** - оптимизация моков и фикстур
2. **Flaky тесты** - устранение зависимостей от внешних факторов
3. **Низкое покрытие** - регулярный аудит и написание новых тестов
4. **Сложные настройки** - упрощение конфигурации тестов

### Мониторинг качества
- **Покрытие кода** - отслеживание метрик покрытия
- **Время выполнения** - мониторинг производительности тестов
- **Стабильность** - отслеживание flaky тестов
- **Тренды** - анализ изменений во времени

## Контакты

Для вопросов по тестированию обращайтесь к команде QA: [qa@zerodolg.ru]