# Быстрый старт: Тестирование фронтенда на Staging

## Для быстрого использования

### 1. Запустить staging сервер

```powershell
npm run staging:up
```

Подождите 30-40 секунд для полной инициализации.

### 2. Запустить автоматические тесты

```powershell
# Базовое тестирование
npm run staging:test

# Детальный вывод
npm run staging:test:verbose
```

### 3. Проверить результаты

Скрипт автоматически проверит:

- ✅ SSR рендеринг
- ✅ Статические ресурсы (CSS, JS, изображения)
- ✅ API endpoints
- ✅ Маршрутизацию
- ✅ SEO метаданные
- ✅ Безопасность
- ✅ Производительность
- ✅ Логи Docker

### 4. Остановить staging

```powershell
npm run staging:down
```

---

## Интерпретация результатов

### ✅ Успешный тест

```
🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! Staging готов к использованию.
```

**Действие:** Можно продолжать работу или деплоить в production.

### ⚠️ Предупреждения

```
⚠️ STAGING РАБОТАЕТ С ЗАМЕЧАНИЯМИ. Проверьте провалившиеся тесты.
```

**Действие:** Проверьте конкретные предупреждения, но staging работоспособен.

### ❌ Критические ошибки

```
❌ КРИТИЧЕСКИЕ ПРОБЛЕМЫ ОБНАРУЖЕНЫ! Необходимо исправление.
```

**Действие:** Исправьте ошибки перед продолжением работы.

---

## Примеры вывода

### Успешная проверка

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Проверка SSR рендеринга
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ HTML содержит <title>
✅ HTML содержит meta description
✅ HTML размер указывает на SSR
   Размер: 45.23 KB
✅ TTFB приемлемый (< 1000ms)
   TTFB: 234ms
```

### Провальная проверка

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  3. Проверка API endpoints
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GET /api/form доступен
❌ POST /api/form принимает данные
   Ошибка: Connection refused
```

---

## Расширенные опции

### Пропустить проверку производительности

```powershell
powershell -ExecutionPolicy Bypass -File scripts/staging/test-frontend.ps1 -SkipPerformance
```

### Указать другой URL

```powershell
powershell -ExecutionPolicy Bypass -File scripts/staging/test-frontend.ps1 -BaseUrl "http://192.168.1.100:3000"
```

### Комбинированные опции

```powershell
powershell -ExecutionPolicy Bypass -File scripts/staging/test-frontend.ps1 -Verbose -SkipPerformance
```

---

## Что проверяется?

### 🔍 SSR Рендеринг

- HTML содержит полный контент
- Title и meta теги присутствуют
- TTFB < 1000ms

### 📦 Статические ресурсы

- CSS файлы загружаются
- JavaScript бандлы доступны
- Изображения отображаются

### 🔌 API Endpoints

- GET /api/form работает
- POST /api/form принимает данные
- Корректная валидация

### 🗺️ Маршрутизация

- Все страницы доступны
- 404 страница настроена
- Нет битых ссылок

### 🎯 SEO

- Meta теги на месте
- Sitemap доступен
- Robots.txt настроен
- Open Graph теги

### 🔒 Безопасность

- Security headers установлены
- XSS защита
- Санитизация данных

### ⚡ Производительность

- Время загрузки < 2s
- Размер страницы оптимизирован
- Бандлы разделены

### 📊 Логи

- Нет критических ошибок
- Минимум warnings
- Корректная работа

---

## Часто встречающиеся проблемы

### Staging сервер недоступен

**Ошибка:**

```
❌ Staging сервер недоступен. Запустите: npm run staging:up
```

**Решение:**

```powershell
npm run staging:up
Start-Sleep -Seconds 40
npm run staging:test
```

### Docker не запущен

**Ошибка:**

```
⚠️ Docker контейнеры запущены
   Docker Compose недоступен
```

**Решение:**

1. Запустите Docker Desktop
2. Проверьте: `docker version`
3. Перезапустите staging: `npm run staging:up`

### Bitrix24 webhook не настроен

**Ошибка:**

```
⚠️ POST /api/form принимает данные
   Bitrix24 webhook не настроен (ожидаемо)
```

**Решение:** Это нормально для локального staging. Настройте `.env` файл с
реальным webhook для полного тестирования.

### Медленный TTFB

**Предупреждение:**

```
❌ TTFB приемлемый (< 1000ms)
   TTFB: 1543ms
```

**Решение:**

1. Проверьте нагрузку системы
2. Перезапустите Docker: `npm run staging:restart`
3. Проверьте логи: `npm run staging:logs`

---

## Интеграция с CI/CD

### GitHub Actions

```yaml
name: Staging Tests

on:
  push:
    branches: [staging, main]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Start staging
        run: npm run staging:up

      - name: Wait for startup
        run: Start-Sleep -Seconds 40

      - name: Run tests
        run: npm run staging:test

      - name: Stop staging
        if: always()
        run: npm run staging:down
```

---

## Для ИИ моделей

### Как использовать этот чеклист

1. **Перед деплоем:** Всегда запускайте `npm run staging:test`
2. **После изменений:** Тестируйте затронутые области
3. **Регулярно:** Запускайте полный чеклист из
   `docs/FRONTEND_SSR_TESTING_CHECKLIST.md`

### Автоматизация

Этот скрипт идеален для:

- Автоматических CI/CD пайплайнов
- Pre-commit hooks (если staging доступен)
- Регулярного мониторинга
- Проверки перед релизом

### Расширение

Для добавления новых проверок:

1. Отредактируйте `scripts/staging/test-frontend.ps1`
2. Добавьте новую секцию с функцией `Write-Section`
3. Используйте `Write-TestResult` для вывода
4. Обновите документацию в этом файле

---

## Полезные команды

```powershell
# Полный цикл тестирования
npm run staging:up && Start-Sleep -Seconds 40 && npm run staging:test && npm run staging:down

# Тестирование с логами
npm run staging:test:verbose

# Проверка статуса
docker compose ps

# Просмотр логов
npm run staging:logs

# Перезапуск при проблемах
npm run staging:restart

# Полная очистка
npm run staging:clean
```

---

## Дополнительные ресурсы

- 📘 [Полный чеклист](./FRONTEND_SSR_TESTING_CHECKLIST.md)
- 📗 [Руководство по staging](../STAGING_DEPLOYMENT_GUIDE.md)
- 📕 [WARP.md](../WARP.md) - Основная документация
- 📙 [Архитектура](./architecture.md)

---

**Последнее обновление:** 2025-10-04

Для вопросов и предложений создавайте issue в репозитории проекта.
