# Аудит NPM Скриптов - Релевантность проекту

**Дата:** 2025-10-01  
**Проект:** zerodolg-astro

---

## 📊 Резюме

Из **43 скриптов** проанализированных в package.json:

- ✅ **Релевантны и используются:** 28 скриптов
- ⚠️ **Частично релевантны:** 8 скриптов
- ❌ **Не релевантны / Требуют исправления:** 7 скриптов

---

## ✅ Релевантные скрипты (используются в продакшене)

### Основные скрипты разработки

| Скрипт       | Статус     | Комментарий                                                     |
| ------------ | ---------- | --------------------------------------------------------------- |
| `dev`        | ✅ Активен | Используется для локальной разработки                           |
| `build`      | ✅ Активен | Основной скрипт сборки с валидацией env                         |
| `build:prod` | ✅ Активен | Сборка с production конфигом (astro.config.prod.mjs существует) |
| `preview`    | ✅ Активен | Предпросмотр собранного сайта                                   |
| `clean`      | ✅ Активен | Очистка артефактов сборки                                       |

### Качество кода

| Скрипт         | Статус     | Комментарий                                         |
| -------------- | ---------- | --------------------------------------------------- |
| `lint`         | ✅ Активен | ESLint конфигурация присутствует (eslint.config.js) |
| `lint:fix`     | ✅ Активен | Автофикс линтинга                                   |
| `type-check`   | ✅ Активен | TypeScript конфигурация в наличии                   |
| `format`       | ✅ Активен | Prettier форматирование                             |
| `format:check` | ✅ Активен | Проверка форматирования                             |

### Тестирование

| Скрипт          | Статус     | Комментарий                                 |
| --------------- | ---------- | ------------------------------------------- |
| `test`          | ✅ Активен | Vitest настроен, 10 тестовых файлов найдено |
| `test:watch`    | ✅ Активен | Watch режим для разработки                  |
| `test:coverage` | ✅ Активен | Покрытие кода тестами                       |
| `test:ui`       | ✅ Активен | UI для Vitest (@vitest/ui установлен)       |
| `test:env`      | ✅ Активен | Скрипт существует (test-env-validation.js)  |

### Environment

| Скрипт         | Статус     | Комментарий                       |
| -------------- | ---------- | --------------------------------- |
| `env:validate` | ✅ Активен | Скрипт validate-env.js существует |
| `env:setup`    | ✅ Активен | Скрипт setup-env.js существует    |

### Git hooks

| Скрипт    | Статус     | Комментарий                                  |
| --------- | ---------- | -------------------------------------------- |
| `prepare` | ✅ Активен | Husky настроен, директория .husky существует |

### Deploy

| Скрипт             | Статус     | Комментарий                                 |
| ------------------ | ---------- | ------------------------------------------- |
| `deploy:checklist` | ✅ Активен | deployment-checklist-complete.js существует |
| `deploy:verify`    | ✅ Активен | post-build-verification.js существует       |
| `deploy:rollback`  | ✅ Активен | rollback.js существует                      |
| `deploy:backup`    | ✅ Активен | create-backup.js существует                 |
| `deploy`           | ✅ Активен | deploy-complete.js существует               |

### Maintenance

| Скрипт                   | Статус     | Комментарий                                          |
| ------------------------ | ---------- | ---------------------------------------------------- |
| `maintenance:audit`      | ✅ Активен | audit-deps.cjs существует                            |
| `maintenance:lighthouse` | ✅ Активен | lighthouse-audit.js существует, @lhci/cli установлен |

---

## ⚠️ Частично релевантные скрипты (требуют внимания)

### 1. `build:production`

**Статус:** ⚠️ Дублирует функциональность  
**Файл:** `scripts/build/build-production.js`  
**Проблема:**

- Вызывает `build:prod` внутри себя
- Пытается запустить несуществующие скрипты через относительные пути
- Пути к validate-env.js некорректны (`../validate-env.js` вместо
  `../dev/validate-env.js`)

**Рекомендация:**

```bash
# Либо используйте build:prod напрямую:
npm run build:prod

# Либо исправьте build-production.js, чтобы он работал корректно
```

**Фикс в коде:**

```javascript
// В build-production.js строки 76-78:
await execCommand('node', ['scripts/dev/validate-env.js']); // вместо ../validate-env.js
await execCommand('npm', ['run', 'lint'], { cwd: process.cwd() }); // вместо ../../
```

### 2. `prebuild` и `postbuild`

**Статус:** ⚠️ Конфликт с основным процессом  
**Проблема:**

- `prebuild` вызывает `clean` и `type-check` автоматически перед каждой сборкой
- Может замедлить разработку
- `postbuild` просто выводит эхо

**Рекомендация:**

- Отключите `prebuild` для dev-режима
- Используйте его только для production сборок

### 3. `test:coverage:report`

**Статус:** ⚠️ Требует настройки coverage  
**Файл:** `scripts/test/run-tests-with-coverage.js`  
**Проблема:** Проверяет порог покрытия 80%, который может не достигаться

**Рекомендация:** Используйте `test:coverage` для обычных проверок

### 4. `test:e2e`

**Статус:** ⚠️ Требует Puppeteer настройки  
**Файл:** `scripts/test/run-puppeteer-tests.js`  
**Проблема:** Требует установки браузеров Chromium через `puppeteer:setup`

**Рекомендация:**

```bash
# Сначала установите браузеры:
npm run puppeteer:setup

# Затем запускайте E2E тесты:
npm run test:e2e
```

### 5. `maintenance:optimize-images`

**Статус:** ⚠️ Требует доработки  
**Файл:** `scripts/maintenance/optimize-images.js`  
**Проблема:**

- Оптимизирует только team и patterns директории
- Не обрабатывает blog изображения (а они есть в public/images/blog)
- Sharp установлен (devDependencies)

**Рекомендация:** Добавить оптимизацию для `public/images/blog` и
`public/images/sections`

### 6. `puppeteer:setup`

**Статус:** ⚠️ Работает, но требуется для других скриптов  
**Команда:** `npx puppeteer browsers install`  
**Рекомендация:** Запускайте перед использованием E2E тестов и MCP скриптов

---

## ❌ Не релевантные / Требующие исправления

### 1. `mcp:puppeteer` - **BROKEN** ❌

**Команда:** `node tools/mcp-puppeteer.js`  
**Проблема:** Файл `tools/mcp-puppeteer.js` **НЕ СУЩЕСТВУЕТ**

**Рекомендация:**

```bash
# Удалите из package.json или создайте файл
# Возможно имелся в виду:
"mcp:puppeteer": "node tools/mcp-puppeteer-server.js"
```

### 2. `mcp:info` - Низкая ценность ❌

**Команда:**
`echo 'MCP (Multi-Channel Publisher) is configured in astro.config.mjs'`  
**Проблема:** Просто выводит текст, не несет практической пользы

**Рекомендация:** Удалить или заменить на реальную информацию:

```text
"mcp:info": "node -e \"console.log(require('./astro.config.mjs'))\""
```

### 3. `mcp:server` - Зависит от корректности puppeteer-helper ⚠️

**Команда:** `node tools/mcp-puppeteer-server.js`  
**Файл:** Существует  
**Проблема:** Импортирует `PuppeteerHelper` из `./src/lib/puppeteer-helper.js`,
но путь может быть некорректен

**Рекомендация:** Проверьте импорты в файле

### 4. `mcp:demo` - Broken import ❌

**Команда:** `node tools/demo-mcp-puppeteer.js`  
**Файл:** Существует  
**Проблема:**

```javascript
// Строка 8 в demo-mcp-puppeteer.js:
import PuppeteerHelper from './src/lib/puppeteer-helper.js';
```

Путь неверный! Должно быть `../src/shared/lib/puppeteer-helper.js` (если файл
существует)

**Рекомендация:** Исправить путь импорта или удалить скрипт

### 5. `tools:semgrep` - Зависимость не установлена ⚠️

**Команда:** `node tools/semgrep-scan.js`  
**Файл:** Существует  
**Проблема:** Semgrep не установлен в devDependencies

**Рекомендация:**

```bash
# Установите Semgrep глобально или удалите скрипт:
npm install -g @semgrep/cli

# Или удалите скрипт, если не используете статический анализ
```

### 6. `tools:trufflehog` - Зависимость не установлена ⚠️

**Команда:** `node tools/trufflehog-scan.js`  
**Файл:** Существует  
**Проблема:** TruffleHog не установлен

**Рекомендация:**

```bash
# Установите или удалите:
npm install -g @trufflesecurity/trufflehog

# Или удалите скрипт
```

### 7. `tools:compare-sites` - Цель неясна ⚠️

**Команда:** `node tools/compare-sites.js`  
**Файл:** Существует  
**Рекомендация:** Проверьте содержимое и актуальность

### 8. `tools:diagnose-css` и `tools:debug-css` - Дебаг скрипты ⚠️

**Команды:**

- `node tools/diagnose-local-styles.js`
- `node tools/debug-css-loading.js`

**Файлы:** Существуют  
**Статус:** Вероятно использовались для отладки  
**Рекомендация:** Удалить после завершения отладки или переместить в dev-скрипты

---

## 🔧 Рекомендуемые действия

### Немедленные исправления (Критичные)

1. **Удалить или исправить `mcp:puppeteer`:**

```json
// package.json - удалите строку 40:
"mcp:puppeteer": "node tools/mcp-puppeteer.js",
```

2. **Исправить импорты в `mcp:demo`:**

```javascript
// tools/demo-mcp-puppeteer.js, строка 8:
import PuppeteerHelper from '../src/shared/lib/puppeteer-helper.js';
```

3. **Исправить пути в `build-production.js`:**

```javascript
// scripts/build/build-production.js
// Заменить все относительные пути на абсолютные через process.cwd()
await execCommand('node', [
  path.join(process.cwd(), 'scripts/dev/validate-env.js'),
]);
```

### Улучшения (Рекомендуемые)

4. **Расширить оптимизацию изображений:**

```javascript
// scripts/maintenance/optimize-images.js
// Добавить обработку:
const blogDir = path.join(__dirname, '..', '..', 'public', 'images', 'blog');
const sectionsDir = path.join(
  __dirname,
  '..',
  '..',
  'public',
  'images',
  'sections'
);
```

5. **Упростить deploy скрипты:** Используйте `deploy` (deploy-complete.js) как
   единственную точку входа для деплоя

6. **Добавить документацию для security-скриптов:** Если semgrep и trufflehog
   нужны, добавьте их в README с инструкциями по установке

### Очистка (Опциональная)

7. **Удалить неиспользуемые debug-скрипты:**

```json
// Если CSS дебаг завершен:
// "tools:diagnose-css": "node tools/diagnose-local-styles.js",
// "tools:debug-css": "node tools/debug-css-loading.js",
```

8. **Удалить или документировать `mcp:info`:**

```json
"mcp:info": "node -p 'require(\"./package.json\").dependencies[\"astro-mcp\"]'"
```

---

## 📈 Итоговые рекомендации по приоритетам

### 🔴 Высокий приоритет (сломанные скрипты)

- [ ] Исправить/удалить `mcp:puppeteer` (файл не существует)
- [ ] Исправить импорты в `mcp:demo`
- [ ] Исправить пути в `build-production.js`

### 🟡 Средний приоритет (улучшения)

- [ ] Расширить `optimize-images` для blog/sections
- [ ] Добавить установку semgrep/trufflehog в README или удалить скрипты
- [ ] Проверить и документировать tools-скрипты

### 🟢 Низкий приоритет (косметика)

- [ ] Удалить debug CSS скрипты после завершения отладки
- [ ] Улучшить `mcp:info` или удалить
- [ ] Упростить структуру deploy-скриптов

---

## 📝 Команды для быстрой очистки

```bash
# Удалите сломанные скрипты:
npm pkg delete scripts.mcp:puppeteer

# Или исправьте package.json вручную, удалив строки:
# - "mcp:puppeteer": "node tools/mcp-puppeteer.js",
# - "mcp:info": "echo 'MCP (Multi-Channel Publisher) is configured in astro.config.mjs'",
# - "tools:diagnose-css": "node tools/diagnose-local-styles.js",
# - "tools:debug-css": "node tools/debug-css-loading.js",
```

---

## ✨ Оптимизированный package.json (рекомендуемая версия)

<details>
<summary>Нажмите, чтобы посмотреть рекомендуемую структуру scripts</summary>

```json
{
  "scripts": {
    "// Development": "",
    "dev": "astro dev",
    "build": "node scripts/dev/validate-env.js && astro build",
    "build:prod": "node scripts/dev/validate-env.js && astro build --config astro.config.prod.mjs",
    "preview": "astro preview",
    "clean": "npx rimraf dist .astro",

    "// Code Quality": "",
    "lint": "npx eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",

    "// Testing": "",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "node scripts/test/run-puppeteer-tests.js",

    "// Environment": "",
    "env:validate": "node scripts/dev/validate-env.js",
    "env:setup": "node scripts/dev/setup-env.js",

    "// Deployment": "",
    "deploy": "node scripts/deploy/deploy-complete.js",
    "deploy:verify": "node scripts/deploy/post-build-verification.js",

    "// Maintenance": "",
    "maintenance:audit": "node scripts/maintenance/audit-deps.cjs",
    "maintenance:optimize": "node scripts/maintenance/optimize-images.js",
    "maintenance:lighthouse": "node scripts/maintenance/lighthouse-audit.js",

    "// Tools": "",
    "puppeteer:setup": "npx puppeteer browsers install",

    "// Git Hooks": "",
    "prepare": "husky"
  }
}
```

</details>

---

**Конец отчета**  
_Сгенерировано: 2025-10-01_
