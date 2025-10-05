# Автоматическая проверка фронтенда на Staging сервере
# Этот скрипт выполняет полную проверку SSR архитектуры

param(
    [switch]$Verbose,
    [switch]$SkipPerformance,
    [string]$BaseUrl = "http://localhost:3000"
)

# Цвета для вывода
$script:PassedCount = 0
$script:FailedCount = 0
$script:WarningCount = 0

function Write-TestResult {
    param(
        [string]$TestName,
        [bool]$Passed,
        [string]$Message = "",
        [bool]$IsWarning = $false
    )
    
    if ($IsWarning) {
        Write-Host "⚠️  $TestName" -ForegroundColor Yellow
        $script:WarningCount++
    }
    elseif ($Passed) {
        Write-Host "✅ $TestName" -ForegroundColor Green
        $script:PassedCount++
    }
    else {
        Write-Host "❌ $TestName" -ForegroundColor Red
        $script:FailedCount++
    }
    
    if ($Message -and ($Verbose -or -not $Passed)) {
        Write-Host "   $Message" -ForegroundColor Gray
    }
}

function Write-Section {
    param([string]$Title)
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

# ============================================================================
# 0. Предварительные проверки
# ============================================================================

Write-Host "`n🚀 Запуск автоматической проверки фронтенда на Staging" -ForegroundColor Magenta
Write-Host "Base URL: $BaseUrl`n" -ForegroundColor Gray

Write-Section "0. Предварительные проверки"

# Проверка доступности staging сервера
try {
    $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing -TimeoutSec 10
    Write-TestResult "Staging сервер доступен" $true "StatusCode: $($response.StatusCode)"
}
catch {
    Write-TestResult "Staging сервер доступен" $false "Ошибка: $($_.Exception.Message)"
    Write-Host "`n❌ Staging сервер недоступен. Запустите: npm run staging:up" -ForegroundColor Red
    exit 1
}

# Проверка Docker контейнеров
try {
    $containers = docker compose ps --format json 2>$null | ConvertFrom-Json
    $runningContainers = ($containers | Where-Object { $_.State -eq "running" }).Count
    Write-TestResult "Docker контейнеры запущены" ($runningContainers -gt 0) "$runningContainers контейнер(ов) работает"
}
catch {
    Write-TestResult "Docker контейнеры запущены" $false "Docker Compose недоступен" $true
}

# ============================================================================
# 1. Проверка SSR рендеринга
# ============================================================================

Write-Section "1. Проверка SSR рендеринга"

try {
    $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing
    $html = $response.Content
    
    # Проверка наличия title
    $hasTitle = $html -match '<title>.*</title>'
    Write-TestResult "HTML содержит <title>" $hasTitle
    
    # Проверка meta description
    $hasDescription = $html -match '<meta name="description"'
    Write-TestResult "HTML содержит meta description" $hasDescription
    
    # Проверка размера HTML (признак SSR)
    $htmlSize = $html.Length
    $isSsr = $htmlSize -gt 10000
    Write-TestResult "HTML размер указывает на SSR" $isSsr "Размер: $($htmlSize/1KB) KB"
    
    # Проверка времени первого байта (TTFB)
    $ttfb = Measure-Command { 
        Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing | Out-Null
    }
    $ttfbMs = $ttfb.TotalMilliseconds
    Write-TestResult "TTFB приемлемый (< 1000ms)" ($ttfbMs -lt 1000) "TTFB: $([math]::Round($ttfbMs, 0))ms"
}
catch {
    Write-TestResult "SSR рендеринг" $false "Ошибка: $($_.Exception.Message)"
}

# ============================================================================
# 2. Проверка статических ресурсов
# ============================================================================

Write-Section "2. Проверка статических ресурсов"

try {
    $response = Invoke-WebRequest -Uri $BaseUrl
    $html = $response.Content
    
    # Проверка Tailwind CSS
    $hasTailwind = $html -match 'class="[^"]*\b(flex|grid|bg-|text-|p-|m-|w-|h-)'
    Write-TestResult "Tailwind CSS утилиты обнаружены" $hasTailwind
    
    # Проверка inline styles
    $inlineStyleCount = ([regex]::Matches($html, '<[^>]+style="')).Count
    $hasMinimalInlineStyles = $inlineStyleCount -lt 20
    Write-TestResult "Минимально inline styles" $hasMinimalInlineStyles "Найдено: $inlineStyleCount" ($inlineStyleCount -gt 0)
    
    # CSS файлы
    $cssFiles = $response.Links | Where-Object { $_.href -match '\\.css$' } | Select-Object -ExpandProperty href -First 5
    $cssSuccess = 0
    $cssTotal = 0
    $totalImportantCount = 0
    
    foreach ($css in $cssFiles) {
        $cssTotal++
        $url = if ($css -match '^http') { $css } else { "$BaseUrl$css" }
        try {
            $cssResponse = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            if ($cssResponse.StatusCode -eq 200) {
                $cssSuccess++
                
                # Проверка на !important
                $cssContent = $cssResponse.Content
                $importantCount = ([regex]::Matches($cssContent, '!important')).Count
                $totalImportantCount += $importantCount
                
                if ($Verbose -and $importantCount -gt 10) {
                    $cssName = $css
                    Write-Host "   ⚠️  ${cssName}: $importantCount !important" -ForegroundColor Yellow
                }
            }
        }
        catch {
            # Игнорируем ошибки отдельных файлов
        }
    }
    
    if ($cssTotal -gt 0) {
        Write-TestResult "CSS файлы загружаются" ($cssSuccess -eq $cssTotal) "$cssSuccess/$cssTotal файлов OK"
        
        # Проверка на !important
        $hasMinimalImportant = $totalImportantCount -lt 50
        Write-TestResult "Минимально !important в CSS" $hasMinimalImportant "Всего: $totalImportantCount" ($totalImportantCount -gt 20)
    }
    else {
        Write-TestResult "CSS файлы загружаются" $false "CSS файлы не найдены" $true
    }
    
    # JS файлы
    $jsFiles = $response.Links | Where-Object { $_.href -match '\.js$' } | Select-Object -ExpandProperty href -First 5
    $jsSuccess = 0
    $jsTotal = 0
    
    foreach ($js in $jsFiles) {
        $jsTotal++
        $url = if ($js -match '^http') { $js } else { "$BaseUrl$js" }
        try {
            $jsResponse = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            if ($jsResponse.StatusCode -eq 200) {
                $jsSuccess++
            }
        }
        catch {
            # Игнорируем ошибки отдельных файлов
        }
    }
    
    if ($jsTotal -gt 0) {
        Write-TestResult "JavaScript файлы загружаются" ($jsSuccess -eq $jsTotal) "$jsSuccess/$jsTotal файлов OK"
    }
    else {
        Write-TestResult "JavaScript файлы загружаются" $false "JS файлы не найдены" $true
    }
    
    # Изображения
    $images = $response.Images | Select-Object -First 5 -ExpandProperty src
    $imgSuccess = 0
    $imgTotal = 0
    
    foreach ($img in $images) {
        $imgTotal++
        $url = if ($img -match '^http') { $img } else { "$BaseUrl$img" }
        try {
            $imgResponse = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            if ($imgResponse.StatusCode -eq 200) {
                $imgSuccess++
            }
        }
        catch {
            # Игнорируем ошибки отдельных изображений
        }
    }
    
    if ($imgTotal -gt 0) {
        Write-TestResult "Изображения загружаются" ($imgSuccess -eq $imgTotal) "$imgSuccess/$imgTotal изображений OK"
    }
    else {
        Write-TestResult "Изображения загружаются" $false "Изображения не найдены" $true
    }
}
catch {
    Write-TestResult "Статические ресурсы" $false "Ошибка: $($_.Exception.Message)"
}

# ============================================================================
# 3. Проверка API endpoints
# ============================================================================

Write-Section "3. Проверка API endpoints"

# GET запрос к /api/form
try {
    $apiResponse = Invoke-WebRequest -Uri "$BaseUrl/api/form" -UseBasicParsing -TimeoutSec 10
    $apiJson = $apiResponse.Content | ConvertFrom-Json
    
    Write-TestResult "GET /api/form доступен" ($apiResponse.StatusCode -eq 200)
    Write-TestResult "API возвращает корректный JSON" ($null -ne $apiJson.status) "Status: $($apiJson.status)"
}
catch {
    Write-TestResult "GET /api/form доступен" $false "Ошибка: $($_.Exception.Message)"
}

# POST запрос (тестовый)
try {
    $body = @{
        name = "Test User"
        phone = "+79999999999"
        email = "test@staging.local"
        message = "Automated staging test"
        source = "staging-automated-test"
    } | ConvertTo-Json
    
    $postResponse = Invoke-RestMethod -Uri "$BaseUrl/api/form" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-TestResult "POST /api/form принимает данные" $true "Response: $($postResponse.status)"
}
catch {
    $errorMessage = $_.Exception.Message
    # Если Bitrix24 не настроен, это ожидаемо
    if ($errorMessage -match "webhook" -or $errorMessage -match "BITRIX") {
        Write-TestResult "POST /api/form принимает данные" $false "Bitrix24 webhook не настроен (ожидаемо)" $true
    }
    else {
        Write-TestResult "POST /api/form принимает данные" $false "Ошибка: $errorMessage"
    }
}

# ============================================================================
# 4. Проверка маршрутизации
# ============================================================================

Write-Section "4. Проверка маршрутизации"

$pages = @(
    "/",
    "/bankrotstvo-s-sokhraneniyem-imushchestva",
    "/restrukturizaciya-dolgov",
    "/privacy",
    "/terms"
)

$pageSuccess = 0
foreach ($page in $pages) {
    $url = "$BaseUrl$page"
    try {
        $pageResponse = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        if ($pageResponse.StatusCode -eq 200) {
            $pageSuccess++
            if ($Verbose) {
                Write-TestResult "Страница $page" $true
            }
        }
    }
    catch {
        Write-TestResult "Страница $page" $false "StatusCode: $($_.Exception.Response.StatusCode.value__)"
    }
}

Write-TestResult "Все основные страницы доступны" ($pageSuccess -eq $pages.Count) "$pageSuccess/$($pages.Count) страниц OK"

# Проверка 404 страницы
try {
    $notFoundResponse = Invoke-WebRequest -Uri "$BaseUrl/non-existent-page-12345" -UseBasicParsing -TimeoutSec 10
    Write-TestResult "404 страница настроена" $false "Несуществующая страница вернула 200"
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-TestResult "404 страница настроена" ($statusCode -eq 404) "StatusCode: $statusCode"
}

# ============================================================================
# 5. Проверка SEO
# ============================================================================

Write-Section "5. Проверка SEO"

try {
    $response = Invoke-WebRequest -Uri $BaseUrl
    $html = $response.Content
    
    # Проверка meta тегов
    $hasTitle = $html -match '<title>.*</title>'
    Write-TestResult "Страница имеет <title>" $hasTitle
    
    $hasDescription = $html -match '<meta name="description"'
    Write-TestResult "Страница имеет meta description" $hasDescription
    
    $hasOg = $html -match '<meta property="og:'
    Write-TestResult "Настроены Open Graph теги" $hasOg
    
    $hasCanonical = $html -match '<link rel="canonical"'
    Write-TestResult "Установлен canonical URL" $hasCanonical
    
    $hasLang = $html -match '<html[^>]*lang='
    Write-TestResult "Атрибут lang установлен" $hasLang
}
catch {
    Write-TestResult "SEO метаданные" $false "Ошибка: $($_.Exception.Message)"
}

# Sitemap
try {
    $sitemapResponse = Invoke-WebRequest -Uri "$BaseUrl/sitemap-index.xml" -UseBasicParsing -TimeoutSec 10
    $hasSitemap = ($sitemapResponse.StatusCode -eq 200) -and ($sitemapResponse.Content -match '<urlset')
    Write-TestResult "Sitemap доступен" $hasSitemap
}
catch {
    Write-TestResult "Sitemap доступен" $false "Sitemap не найден"
}

# Robots.txt
try {
    $robotsResponse = Invoke-WebRequest -Uri "$BaseUrl/robots.txt" -UseBasicParsing -TimeoutSec 10
    $hasRobots = ($robotsResponse.StatusCode -eq 200) -and ($robotsResponse.Content.Length -gt 0)
    Write-TestResult "Robots.txt доступен" $hasRobots
}
catch {
    Write-TestResult "Robots.txt доступен" $false "Robots.txt не найден"
}

# ============================================================================
# 6. Проверка безопасности
# ============================================================================

Write-Section "6. Проверка безопасности"

try {
    $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing
    $headers = $response.Headers
    
    # Проверка security headers
    $hasXContentType = $headers.ContainsKey('X-Content-Type-Options')
    Write-TestResult "X-Content-Type-Options установлен" $hasXContentType "" (-not $hasXContentType)
    
    $hasXFrame = $headers.ContainsKey('X-Frame-Options')
    Write-TestResult "X-Frame-Options установлен" $hasXFrame "" (-not $hasXFrame)
    
    # CSP может отсутствовать - это не критично для staging
    $hasCsp = $headers.ContainsKey('Content-Security-Policy')
    if ($Verbose) {
        Write-TestResult "Content-Security-Policy установлен" $hasCsp "" $true
    }
}
catch {
    Write-TestResult "Заголовки безопасности" $false "Ошибка: $($_.Exception.Message)"
}

# ============================================================================
# 7. Проверка производительности (опционально)
# ============================================================================

if (-not $SkipPerformance) {
    Write-Section "7. Проверка производительности"
    
    # Проверка времени загрузки
    $loadTimes = @()
    for ($i = 0; $i -lt 3; $i++) {
        $loadTime = Measure-Command {
            Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing | Out-Null
        }
        $loadTimes += $loadTime.TotalMilliseconds
    }
    
    $avgLoadTime = ($loadTimes | Measure-Object -Average).Average
    Write-TestResult "Среднее время загрузки приемлемо" ($avgLoadTime -lt 2000) "Среднее: $([math]::Round($avgLoadTime, 0))ms"
    
    # Проверка размера страницы
    try {
        $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing
        $pageSize = $response.RawContentLength / 1KB
        Write-TestResult "Размер страницы оптимизирован" ($pageSize -lt 500) "Размер: $([math]::Round($pageSize, 2)) KB"
    }
    catch {
        Write-TestResult "Размер страницы оптимизирован" $false "Не удалось определить размер" $true
    }
}

# ============================================================================
# 8. Проверка логов Docker
# ============================================================================

Write-Section "8. Проверка логов Docker"

try {
    $logs = docker compose logs --tail=50 zerodolg-web 2>&1
    $hasErrors = ($logs | Select-String -Pattern "ERROR" -SimpleMatch).Count
    $hasCritical = ($logs | Select-String -Pattern "CRITICAL" -SimpleMatch).Count
    
    Write-TestResult "Нет критических ошибок в логах" ($hasCritical -eq 0) "Найдено критических: $hasCritical"
    Write-TestResult "Минимум ошибок в логах" ($hasErrors -lt 5) "Найдено ошибок: $hasErrors" ($hasErrors -gt 0)
}
catch {
    Write-TestResult "Логи Docker" $false "Не удалось прочитать логи" $true
}

# ============================================================================
# Итоги
# ============================================================================

Write-Host "`n" -NoNewline
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "  📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta

Write-Host "`n✅ Успешно:        $script:PassedCount" -ForegroundColor Green
Write-Host "❌ Провалено:      $script:FailedCount" -ForegroundColor Red
Write-Host "⚠️  Предупреждения: $script:WarningCount" -ForegroundColor Yellow

$totalTests = $script:PassedCount + $script:FailedCount + $script:WarningCount
$successRate = if ($totalTests -gt 0) { [math]::Round(($script:PassedCount / $totalTests) * 100, 1) } else { 0 }

Write-Host "`nПроцент успешных: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

# Финальная оценка
Write-Host "`n"
if ($script:FailedCount -eq 0 -and $script:WarningCount -le 3) {
    Write-Host "🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! Staging готов к использованию." -ForegroundColor Green
    exit 0
}
elseif ($script:FailedCount -le 2 -and $successRate -ge 80) {
    Write-Host "⚠️  STAGING РАБОТАЕТ С ЗАМЕЧАНИЯМИ. Проверьте провалившиеся тесты." -ForegroundColor Yellow
    exit 0
}
else {
    Write-Host "❌ КРИТИЧЕСКИЕ ПРОБЛЕМЫ ОБНАРУЖЕНЫ! Необходимо исправление." -ForegroundColor Red
    exit 1
}
