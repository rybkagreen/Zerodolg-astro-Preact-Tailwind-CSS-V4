# Чеклист проверки фронтенда в SSR архитектуре (Staging)

## Назначение

Этот чеклист предназначен для автоматизированной или ручной проверки фронтенда
на staging сервере. Используется для валидации SSR (Server-Side Rendering)
архитектуры перед деплоем в production.

## Предварительные условия

### Запуск Staging окружения

```powershell
# Проверка Docker
docker --version
docker compose version

# Запуск staging среды
npm run staging:up

# Ожидание полной инициализации (30-40 секунд)
Start-Sleep -Seconds 40
```

### Проверка доступности сервисов

```powershell
# Проверка веб-приложения
curl http://localhost:3000 -UseBasicParsing | Select-Object StatusCode

# Проверка Lighthouse CI
curl http://localhost:9001 -UseBasicParsing | Select-Object StatusCode

# Проверка статуса контейнеров
docker compose ps
```

**Ожидаемый результат:**

- Веб-приложение: StatusCode = 200
- Lighthouse CI: StatusCode = 200
- Все контейнеры в статусе "running" (healthy)

---

## 1. Проверка SSR рендеринга

### 1.1 Проверка серверного HTML

```powershell
# Получить HTML главной страницы
$response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
$html = $response.Content

# Проверить наличие контента в HTML
$html -match '<title>.*</title>' # Должен быть title
$html -match '<meta name="description"' # Должны быть meta теги
$html.Length -gt 10000 # HTML должен быть достаточно большим (SSR контент)
```

**✅ Критерии успеха:**

- HTML содержит полный контент (не пустой shell)
- Присутствуют `<title>` и meta теги для SEO
- Размер HTML > 10KB (признак SSR, а не только client-side рендеринга)
- HTML содержит структурированный контент (заголовки, параграфы, секции)

### 1.2 Проверка времени первого рендеринга

```powershell
# Измерить время ответа сервера
Measure-Command { Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing }
```

**✅ Критерии успеха:**

- Time to First Byte (TTFB) < 500ms
- Полное время загрузки HTML < 1s

---

## 2. Проверка статических ресурсов

### 2.1 CSS стили и Tailwind

```powershell
# Проверить наличие Tailwind CSS
$response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
$html = $response.Content

# Поиск Tailwind утилит в HTML
$hasTailwind = $html -match 'class="[^"]*\b(flex|grid|bg-|text-|p-|m-|w-|h-)'
Write-Host "Tailwind CSS обнаружен: $hasTailwind"

# Проверка на кастомные стили с !important
$cssFiles = $response.Links | Where-Object { $_.href -match '\.css$' } | Select-Object -ExpandProperty href -First 3
foreach ($css in $cssFiles) {
    $url = if ($css -match '^http') { $css } else { "http://localhost:3000$css" }
    try {
        $cssContent = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
        $importantCount = ([regex]::Matches($cssContent, '!important')).Count
        Write-Host "CSS файл: $css - !important найдено: $importantCount"
    } catch {
        Write-Host "Ошибка загрузки CSS: $css"
    }
}

# Проверка inline styles
$inlineStyleCount = ([regex]::Matches($html, '<[^>]+style="')).Count
Write-Host "Inline styles найдено: $inlineStyleCount"
```

**✅ Критерии успеха:**

- Tailwind CSS утилиты присутствуют в классах
- Минимальное использование !important (< 10 на файл)
- Inline styles только для критических стилей (< 20)
- CSS файлы минифицированы

### 2.2 CSS загрузка

```powershell
# Найти все CSS файлы в HTML
$response = Invoke-WebRequest -Uri "http://localhost:3000"
$cssFiles = $response.Links | Where-Object { $_.href -match '\.css$' } | Select-Object -ExpandProperty href

# Проверить доступность каждого CSS файла
foreach ($css in $cssFiles) {
    $url = if ($css -match '^http') { $css } else { "http://localhost:3000$css" }
    $status = (Invoke-WebRequest -Uri $url -UseBasicParsing).StatusCode
    Write-Host "CSS: $css - Status: $status"
}
```

**✅ Критерии успеха:**

- Все CSS файлы загружаются (StatusCode = 200)
- CSS файлы минифицированы (размер оптимизирован)
- CSS содержит Tailwind утилиты
- Нет 404 ошибок для CSS

### 2.2 JavaScript бандлы

```powershell
# Найти JavaScript файлы
$response = Invoke-WebRequest -Uri "http://localhost:3000"
$jsFiles = $response.Links | Where-Object { $_.href -match '\.js$' } | Select-Object -ExpandProperty href

# Проверить доступность JS
foreach ($js in $jsFiles) {
    $url = if ($js -match '^http') { $js } else { "http://localhost:3000$js" }
    $status = (Invoke-WebRequest -Uri $url -UseBasicParsing).StatusCode
    Write-Host "JS: $js - Status: $status"
}
```

**✅ Критерии успеха:**

- Все JS файлы загружаются (StatusCode = 200)
- Preact бандлы загружаются только для интерактивных компонентов
- Vendor chunk отделен от основного кода
- JS файлы минифицированы

### 2.3 Изображения

```powershell
# Проверить загрузку изображений
$response = Invoke-WebRequest -Uri "http://localhost:3000"
$images = $response.Images | Select-Object -First 10 -ExpandProperty src

foreach ($img in $images) {
    $url = if ($img -match '^http') { $img } else { "http://localhost:3000$img" }
    try {
        $status = (Invoke-WebRequest -Uri $url -UseBasicParsing).StatusCode
        Write-Host "Image: $img - Status: $status"
    } catch {
        Write-Host "Image ERROR: $img"
    }
}
```

**✅ Критерии успеха:**

- Все изображения загружаются успешно
- Изображения оптимизированы (AVIF/WebP формат)
- Lazy loading применен где необходимо
- Нет битых изображений (404)

---

## 3. Проверка API endpoints

### 3.1 GET запрос к форме API

```powershell
# Проверить доступность API
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/form" -UseBasicParsing
$response.StatusCode
$response.Content | ConvertFrom-Json
```

**✅ Критерии успеха:**

- StatusCode = 200
- Ответ содержит JSON с полями: `status`, `message`, `endpoints`
- `status` = "ok"

### 3.2 POST запрос к форме (тестовый)

```powershell
# Тестовая отправка формы
$body = @{
    name = "Test User"
    phone = "+79999999999"
    email = "test@example.com"
    message = "Тестовое сообщение со staging"
    source = "staging-test"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/form" -Method POST -Body $body -ContentType "application/json"
$response
```

**✅ Критерии успеха:**

- StatusCode = 200 или 201
- Ответ содержит подтверждение отправки
- Данные валидируются на сервере
- Нет ошибок сервера (500)

**⚠️ Примечание:** Если Bitrix24 webhook не настроен, ожидается ошибка с
соответствующим сообщением.

---

## 4. Проверка Islands Architecture

### 4.1 Гидратация интерактивных компонентов

**Вручную в браузере:**

1. Открыть DevTools → Network
2. Перейти на `http://localhost:3000`
3. Проверить, что Preact бандлы загружаются ТОЛЬКО для интерактивных компонентов

**Автоматически с Puppeteer:**

```javascript
// Требует: npm run puppeteer:setup

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Отслеживание сетевых запросов
  const jsRequests = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.js')) {
      jsRequests.push(request.url());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  console.log('JavaScript бандлы загружены:');
  jsRequests.forEach((js) => console.log(js));

  // Проверить интерактивность форм
  const formExists = await page.$('form');
  console.log('Форма найдена:', formExists !== null);

  await browser.close();
})();
```

**✅ Критерии успеха:**

- Статический контент рендерится без JS
- Preact загружается только для islands (формы, модальные окна)
- Интерактивные компоненты гидратируются корректно
- Нет ошибок гидратации в консоли

---

## 5. Проверка маршрутизации

### 5.1 Основные страницы

```powershell
# Массив страниц для проверки
$pages = @(
    "/",
    "/bankrotstvo-s-sokhraneniyem-imushchestva",
    "/restrukturizaciya-dolgov",
    "/privacy",
    "/terms"
)

foreach ($page in $pages) {
    $url = "http://localhost:3000$page"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Host "✅ $page - Status: $($response.StatusCode)"
    } catch {
        Write-Host "❌ $page - FAILED"
    }
}
```

**✅ Критерии успеха:**

- Все страницы возвращают 200
- Нет 404 ошибок
- Каждая страница имеет уникальный `<title>`
- Контент SSR рендерится корректно

### 5.2 Проверка 404 страницы

```powershell
# Запрос несуществующей страницы
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/non-existent-page" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
} catch {
    Write-Host "Ожидаемая ошибка: $($_.Exception.Response.StatusCode.value__)"
}
```

**✅ Критерии успеха:**

- StatusCode = 404
- Отображается кастомная 404 страница
- 404 страница имеет навигацию на главную

---

## 6. Проверка SEO

### 6.1 Meta теги

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000"
$html = $response.Content

# Проверка обязательных meta тегов
$html -match '<title>' # Title
$html -match '<meta name="description"' # Description
$html -match '<meta property="og:' # Open Graph
$html -match '<link rel="canonical"' # Canonical URL
```

**✅ Критерии успеха:**

- Присутствует уникальный `<title>` на каждой странице
- Есть `meta description` (50-160 символов)
- Open Graph теги настроены
- Canonical URL установлен
- Lang атрибут указан (`<html lang="ru">`)

### 6.2 Sitemap и robots.txt

```powershell
# Проверить sitemap
$sitemap = Invoke-WebRequest -Uri "http://localhost:3000/sitemap-index.xml" -UseBasicParsing
$sitemap.StatusCode
$sitemap.Content -match '<urlset'

# Проверить robots.txt
$robots = Invoke-WebRequest -Uri "http://localhost:3000/robots.txt" -UseBasicParsing
$robots.StatusCode
$robots.Content
```

**✅ Критерии успеха:**

- `/sitemap-index.xml` доступен (StatusCode = 200)
- Sitemap содержит валидный XML
- `/robots.txt` доступен
- Robots.txt содержит корректные директивы

---

## 7. Проверка производительности

### 7.1 Lighthouse CI

```powershell
# Запустить Lighthouse тест через CLI
npm run maintenance:lighthouse
```

**Или вручную через браузер:**

1. Открыть Chrome DevTools
2. Lighthouse → Generate report
3. Проверить метрики

**✅ Критерии успеха:**

- Performance Score ≥ 90
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 300ms

### 7.2 Bundle Size Analysis

```powershell
# Проверить размеры бандлов
Get-ChildItem -Path "dist/_astro" -Filter "*.js" | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    Write-Host "$($_.Name): $sizeKB KB"
}

Get-ChildItem -Path "dist/_astro" -Filter "*.css" | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    Write-Host "$($_.Name): $sizeKB KB"
}
```

**✅ Критерии успеха:**

- Главный JS бандл < 100KB (gzipped)
- CSS бандл < 50KB (gzipped)
- Vendor chunk отделен и кэшируется
- Нет дублирования кода между бандлами

---

## 8. Проверка доступности (A11y)

### 8.1 ARIA атрибуты и семантика

```powershell
# Проверка через Lighthouse accessibility или axe-core
```

**Вручную в браузере:**

1. Открыть Lighthouse → Accessibility
2. Проверить score

**✅ Критерии успеха:**

- Accessibility Score ≥ 95
- Все интерактивные элементы имеют правильные ARIA атрибуты
- Семантические HTML теги используются корректно
- Формы имеют labels
- Изображения имеют alt атрибуты

### 8.2 Навигация с клавиатуры

**Вручную:**

1. Использовать Tab для навигации
2. Проверить focus indicators
3. Убедиться, что все интерактивные элементы доступны

**✅ Критерии успеха:**

- Все интерактивные элементы доступны через Tab
- Focus indicators видимы
- Логичный порядок табуляции
- Модальные окна ловят фокус

---

## 9. Проверка форм

### 9.1 Валидация на клиенте

**Вручную в браузере:**

1. Открыть форму на главной странице
2. Попробовать отправить пустую форму
3. Ввести некорректные данные (невалидный email, короткий телефон)

**✅ Критерии успеха:**

- Клиентская валидация работает до отправки
- Показываются понятные сообщения об ошибках
- Валидация в реальном времени (при вводе)
- HTML5 валидация включена

### 9.2 Интеграция с Bitrix24

```powershell
# Тестовая отправка с валидными данными
$body = @{
    name = "Иван Петров"
    phone = "+79161234567"
    email = "ivan@example.com"
    message = "Нужна консультация по банкротству"
    source = "staging-form-test"
    formType = "consultation"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/form" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Форма отправлена: $($response.status)"
} catch {
    Write-Host "⚠️ Ошибка (возможно Bitrix webhook не настроен): $($_.Exception.Message)"
}
```

**✅ Критерии успеха:**

- Форма успешно отправляется в Bitrix24
- Пользователь получает подтверждение
- Данные корректно валидируются на сервере
- При ошибке показывается понятное сообщение

---

## 10. Проверка безопасности

### 10.1 HTTP заголовки

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
$response.Headers
```

**✅ Критерии успеха:**

- `Content-Security-Policy` настроен (если применимо)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` или `SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

### 10.2 XSS защита

**Тест инъекции:**

```powershell
$xssPayload = @{
    name = "<script>alert('XSS')</script>"
    phone = "+79161234567"
    email = "test@example.com"
    message = "<img src=x onerror=alert('XSS')>"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/form" -Method POST -Body $xssPayload -ContentType "application/json"
```

**✅ Критерии успеха:**

- HTML теги экранируются
- Скрипты не выполняются
- Сервер возвращает ошибку валидации или санитизирует ввод

---

## 11. Проверка респонсивности

### 11.1 Различные viewport'ы

**Вручную в браузере:**

1. Открыть DevTools → Device Toolbar
2. Проверить на разных устройствах:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**✅ Критерии успеха:**

- Дизайн адаптируется под все разрешения
- Нет горизонтального скролла
- Текст читаем на всех устройствах
- Интерактивные элементы доступны на тач-устройствах
- Меню работает на мобильных

---

## 12. Проверка логов и ошибок

### 12.1 Логи контейнера

```powershell
# Просмотр логов в реальном времени
npm run staging:logs

# Или напрямую через Docker
docker compose logs -f zerodolg-web
```

**✅ Критерии успеха:**

- Нет критических ошибок (ERROR)
- Нет необработанных исключений
- Requests логируются корректно
- Нет memory leaks

### 12.2 Браузерная консоль

**Вручную:**

1. Открыть DevTools → Console
2. Перезагрузить страницу
3. Проверить наличие ошибок

**✅ Критерии успеха:**

- Нет JavaScript ошибок
- Нет 404 для ресурсов
- Нет CORS ошибок
- Warnings минимальны

---

## 13. Проверка кэширования

### 13.1 Cache headers

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/_astro/main.js" -UseBasicParsing
$response.Headers['Cache-Control']
$response.Headers['ETag']
```

**✅ Критерии успеха:**

- Статические ресурсы имеют `Cache-Control` заголовки
- Версионированные файлы кэшируются агрессивно
- HTML страницы имеют разумный TTL
- ETag установлен для валидации

---

## 14. Health Check

### 14.1 Проверка endpoint'а здоровья

```powershell
# Если реализован /health endpoint
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    $response.StatusCode
    $response.Content
} catch {
    Write-Host "Health endpoint не реализован"
}
```

**✅ Критерии успеха:**

- `/health` возвращает 200
- Ответ содержит статус сервиса
- Docker healthcheck проходит

---

## Финальная проверка перед Production

### Checklist

#### Стили и CSS

- [ ] Нет кастомных стилей CSS с !important
- [ ] Tailwind CSS v3 стили обнаружены и работают
- [ ] CSS бандлы минифицированы
- [ ] Нет inline styles (кроме критических)

#### Производительность

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] TTFB < 500ms
- [ ] LCP < 2.5s

#### Функциональность

- [ ] Все тесты из разделов 1-14 пройдены
- [ ] Нет критических ошибок в логах
- [ ] Формы работают корректно
- [ ] API endpoints отвечают корректно

#### Архитектура

- [ ] SSR рендеринг работает
- [ ] Islands гидратируются правильно
- [ ] Preact компоненты загружаются только для интерактивных элементов

#### SEO и Доступность

- [ ] SEO теги на месте
- [ ] Sitemap доступен
- [ ] Robots.txt настроен
- [ ] Meta описания уникальны
- [ ] Alt атрибуты для изображений

#### Безопасность

- [ ] Безопасность проверена
- [ ] Security headers установлены
- [ ] XSS защита активна
- [ ] Нет уязвимостей в зависимостях

#### Респонсивность

- [ ] Респонсивность подтверждена
- [ ] Mobile (375px) работает корректно
- [ ] Tablet (768px) работает корректно
- [ ] Desktop (1920px) работает корректно

### Остановка staging

```powershell
# Остановить staging среду
npm run staging:down

# Или полная очистка
npm run staging:clean
```

---

## Автоматизация чеклиста

### Скрипт для автоматической проверки

Создать файл `scripts/staging/test-frontend.ps1`:

```powershell
# Автоматическая проверка фронтенда на staging

Write-Host "🚀 Запуск проверки фронтенда на Staging..." -ForegroundColor Cyan

# 1. Проверка доступности
$webStatus = (Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing).StatusCode
if ($webStatus -eq 200) {
    Write-Host "✅ Веб-приложение доступно" -ForegroundColor Green
} else {
    Write-Host "❌ Веб-приложение недоступно" -ForegroundColor Red
    exit 1
}

# 2. Проверка API
try {
    $apiResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/form"
    Write-Host "✅ API endpoint работает" -ForegroundColor Green
} catch {
    Write-Host "❌ API endpoint недоступен" -ForegroundColor Red
}

# 3. Проверка страниц
$pages = @("/", "/privacy", "/terms")
$failedPages = @()
foreach ($page in $pages) {
    try {
        $status = (Invoke-WebRequest -Uri "http://localhost:3000$page" -UseBasicParsing).StatusCode
        if ($status -eq 200) {
            Write-Host "✅ $page" -ForegroundColor Green
        } else {
            $failedPages += $page
        }
    } catch {
        $failedPages += $page
        Write-Host "❌ $page" -ForegroundColor Red
    }
}

# 4. Итоги
Write-Host "`n📊 Результаты проверки:" -ForegroundColor Cyan
if ($failedPages.Count -eq 0) {
    Write-Host "✅ Все проверки пройдены успешно!" -ForegroundColor Green
} else {
    Write-Host "❌ Провалено страниц: $($failedPages.Count)" -ForegroundColor Red
    Write-Host "Проблемные страницы: $($failedPages -join ', ')" -ForegroundColor Yellow
}
```

Запуск:

```powershell
.\scripts\staging\test-frontend.ps1
```

---

## Заключение

Этот чеклист покрывает все критические аспекты SSR приложения на staging
сервере:

- SSR рендеринг и гидратация
- Статические ресурсы и оптимизация
- API endpoints и формы
- SEO и доступность
- Производительность и безопасность
- Респонсивность и пользовательский опыт

Используйте этот чеклист как руководство для проверки перед каждым деплоем в
production.
