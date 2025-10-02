# 🚀 Быстрый старт: Тестирование Staging Сервера

## Автоматизированное тестирование

### Вариант 1: Полностью автоматический тест (рекомендуется)

```powershell
# Запустит сервер, проведет все тесты и остановит сервер
npm run staging:test:full
```

Этот скрипт:

1. ✅ Проверит Docker
2. ✅ Соберет и запустит staging сервер
3. ✅ Дождется готовности сервера
4. ✅ Выполнит все автоматизированные тесты
5. ✅ Остановит сервер после тестов

### Вариант 2: Тесты для уже запущенного сервера

```powershell
# 1. Запустить staging сервер
npm run staging:up

# 2. Запустить только тесты
npm run staging:test

# 3. Остановить сервер (когда закончите)
npm run staging:down
```

### Вариант 3: Ручной запуск с опциями

```powershell
# Запустить с автозапуском сервера
.\scripts\test\run-staging-tests.ps1 -StartServer -Verbose

# Только тесты (сервер уже запущен)
.\scripts\test\run-staging-tests.ps1 -Verbose

# С автоостановкой после тестов
.\scripts\test\run-staging-tests.ps1 -StartServer -StopAfter
```

---

## Что проверяют автоматизированные тесты?

### ✅ 1. Prerequisites Check

- Docker установлен и запущен
- Node.js версия ≥18
- Контейнеры zerodolg работают

### ✅ 2. Server Accessibility

- Главная страница доступна (HTTP 200)
- Health check endpoint работает
- robots.txt существует
- sitemap.xml доступен

### ✅ 3. Critical Pages

- `/` - Главная
- `/restrukturizaciya-dolgov` - Услуга
- `/blog` - Блог
- `/privacy` - Политика конфиденциальности
- `/terms` - Условия использования

### ✅ 4. Content Validation

- DOCTYPE declaration
- UTF-8 charset
- Viewport meta tag
- Title tags
- Meta descriptions
- Open Graph tags
- Canonical URLs
- Russian content presence

### ✅ 5. Security Headers

- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Strict-Transport-Security (для HTTPS)

### ✅ 6. Performance Basics

- Response time (<1s идеально)
- HTML size (<100KB идеально)
- Content compression (gzip/brotli)
- Caching headers

### ✅ 7. Form Endpoints

- /api/contact
- /api/callback
- /api/consultation

### ✅ 8. Static Assets

- /favicon.ico
- /icons/logo.svg
- /images/og-image.jpg

---

## Интерпретация результатов

### Символы статусов

- ✓ (зеленый) = **PASS** - Тест пройден успешно
- ✗ (красный) = **FAIL** - Критическая ошибка, требует исправления
- ⚠ (желтый) = **WARN** - Предупреждение, рекомендуется исправить
- ○ (синий) = **SKIP** - Тест пропущен (не применим)

### Пример хорошего результата

```
Total Tests:    45
Passed:         42
Failed:         0
Warnings:       3
Pass Rate:      93.3%

✓ All tests passed successfully!
```

### Пример с проблемами

```
Total Tests:    45
Passed:         38
Failed:         2
Warnings:       5
Pass Rate:      84.4%

⚠️  FAILED TESTS:
  • Main page not accessible
    └─ Connection refused

⚠️  WARNINGS:
  • Health check endpoint missing
    └─ HTTP 404
```

---

## Ручное тестирование

После автоматизированных тестов используйте чеклист:

📋
**[STAGING_MANUAL_TESTING_CHECKLIST.md](./STAGING_MANUAL_TESTING_CHECKLIST.md)**

### Основные проверки вручную:

1. **Откройте в браузере:** http://localhost:3000
2. **Проверьте консоль:** F12 → Console (не должно быть ошибок)
3. **Протестируйте формы:** Попробуйте отправить контактную форму
4. **Мобильная версия:** F12 → Toggle device toolbar (Ctrl+Shift+M)
5. **Lighthouse:** F12 → Lighthouse → Analyze page load

### Критические проверки:

- [ ] Главная страница загружается без ошибок
- [ ] Мобильное меню открывается
- [ ] Формы работают (валидация + отправка)
- [ ] Все изображения загружаются
- [ ] Performance score >85 в Lighthouse

---

## Troubleshooting

### Проблема: "Docker is not running"

**Решение:**

```powershell
# Windows: Запустите Docker Desktop
# Проверьте:
docker --version
docker ps
```

### Проблема: "Server is not accessible"

**Решение:**

```powershell
# Проверьте логи
npm run staging:logs

# Перезапустите сервер
npm run staging:restart

# Полная пересборка
npm run staging:clean
npm run staging:up
```

### Проблема: "Port 3000 is already in use"

**Решение:**

```powershell
# Остановите существующие контейнеры
npm run staging:down

# Или найдите и убейте процесс
# PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Проблема: Тесты падают с timeout

**Решение:**

```powershell
# Увеличьте timeout, если сервер медленно стартует
$env:STAGING_TIMEOUT = 60  # секунды
npm run staging:test
```

---

## Дополнительные команды

### Docker операции

```powershell
# Просмотр запущенных контейнеров
docker ps

# Логи конкретного контейнера
docker logs zerodolg-web

# Вход в контейнер
docker exec -it zerodolg-web sh

# Статистика ресурсов
docker stats zerodolg-web
```

### Lighthouse тестирование

```powershell
# Установить Lighthouse CLI
npm install -g @lhci/cli

# Запустить аудит
lhci autorun --collect.url=http://localhost:3000

# С сохранением отчета
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### Performance профилирование

```powershell
# 1. Откройте Chrome DevTools (F12)
# 2. Перейдите на вкладку Performance
# 3. Нажмите Record
# 4. Обновите страницу (Ctrl+R)
# 5. Остановите запись
# 6. Анализируйте результаты
```

---

## Следующие шаги

1. ✅ Прочитайте результаты автоматических тестов
2. ✅ Исправьте все FAILED тесты
3. ✅ Проверьте WARNINGS (если критично)
4. ✅ Выполните ручное тестирование по чеклисту
5. ✅ Запустите Lighthouse для performance проверки
6. ✅ Проверьте на разных устройствах/браузерах
7. ✅ Заполните отчет о тестировании

---

## Быстрые ссылки

- 📋
  [Полный чеклист ручного тестирования](./STAGING_MANUAL_TESTING_CHECKLIST.md)
- 📚 [Подробное руководство по staging](./STAGING_TESTING_GUIDE.md)
- 🐛 [Отчет об исправлении тестов](./TEST_FIXES_SUMMARY.md)
- 📦 [Docker Compose конфигурация](./docker-compose.yml)

---

## Поддержка

Если возникли проблемы:

1. Проверьте логи: `npm run staging:logs`
2. Посмотрите раздел Troubleshooting выше
3. Создайте issue с описанием проблемы и логами
