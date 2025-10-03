#!/usr/bin/env pwsh
# Скрипт деплоя проекта zerodolg-astro на удаленный сервер

# Настройки
$SSH_HOST = "zerodolg-server"
$REMOTE_PATH = "/var/www/zerodolg.ru/public_html"
$LOCAL_DIST = "dist"
$WEB_USER = "www-data"  # Измените на актуального пользователя (nginx, apache, www, и т.д.)

# Цвета для вывода
$COLOR_GREEN = "`e[32m"
$COLOR_YELLOW = "`e[33m"
$COLOR_RED = "`e[31m"
$COLOR_RESET = "`e[0m"

function Write-Success {
    param([string]$Message)
    Write-Host "${COLOR_GREEN}✓ $Message${COLOR_RESET}"
}

function Write-Warning {
    param([string]$Message)
    Write-Host "${COLOR_YELLOW}⚠ $Message${COLOR_RESET}"
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "${COLOR_RED}✗ $Message${COLOR_RESET}"
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n${COLOR_YELLOW}→ $Message${COLOR_RESET}`n"
}

# Проверка наличия папки dist
Write-Step "Проверка наличия папки dist..."
if (-not (Test-Path $LOCAL_DIST)) {
    Write-Error-Custom "Папка '$LOCAL_DIST' не найдена!"
    Write-Host "Возможно, нужно собрать проект командой: npm run build"
    exit 1
}
Write-Success "Папка dist найдена"

# Проверка подключения к серверу
Write-Step "Проверка подключения к серверу $SSH_HOST..."
$connectionTest = ssh $SSH_HOST "echo 'OK'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Не удалось подключиться к серверу $SSH_HOST"
    Write-Host "Ошибка: $connectionTest"
    exit 1
}
Write-Success "Подключение установлено"

# Подтверждение удаления
Write-Warning "Это действие удалит все файлы в $REMOTE_PATH на сервере!"
$confirmation = Read-Host "Продолжить? (yes/no)"
if ($confirmation -ne "yes" -and $confirmation -ne "y") {
    Write-Host "Деплой отменен пользователем."
    exit 0
}

# Шаг 1: Очистка директории на сервере
Write-Step "Шаг 1/3: Очистка директории на сервере..."
ssh $SSH_HOST "rm -rf $REMOTE_PATH/*"
if ($LASTEXITCODE -eq 0) {
    Write-Success "Директория очищена"
} else {
    Write-Error-Custom "Ошибка при очистке директории"
    exit 1
}

# Шаг 2: Копирование файлов
Write-Step "Шаг 2/3: Копирование файлов на сервер..."
scp -r "$LOCAL_DIST/*" "${SSH_HOST}:${REMOTE_PATH}/"
if ($LASTEXITCODE -eq 0) {
    Write-Success "Файлы скопированы"
} else {
    Write-Error-Custom "Ошибка при копировании файлов"
    exit 1
}

# Шаг 3: Установка прав доступа
Write-Step "Шаг 3/3: Установка прав доступа..."

# Установка владельца
Write-Host "Установка владельца $WEB_USER..."
ssh $SSH_HOST "sudo chown -R ${WEB_USER}:${WEB_USER} $REMOTE_PATH/"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Не удалось установить владельца (возможно, требуются sudo-права)"
}

# Установка прав на директории
Write-Host "Установка прав на директории (755)..."
ssh $SSH_HOST "find $REMOTE_PATH/ -type d -exec chmod 755 {} \;"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Не удалось установить права на директории"
}

# Установка прав на файлы
Write-Host "Установка прав на файлы (644)..."
ssh $SSH_HOST "find $REMOTE_PATH/ -type f -exec chmod 644 {} \;"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Не удалось установить права на файлы"
}

Write-Success "Права доступа установлены"

# Проверка деплоя
Write-Step "Проверка деплоя..."
$fileCount = ssh $SSH_HOST "find $REMOTE_PATH -type f | wc -l"
Write-Success "Деплой завершен! Загружено файлов: $fileCount"

Write-Host "`n${COLOR_GREEN}════════════════════════════════════════${COLOR_RESET}"
Write-Host "${COLOR_GREEN}   Деплой успешно завершен!${COLOR_RESET}"
Write-Host "${COLOR_GREEN}════════════════════════════════════════${COLOR_RESET}`n"
