# Скрипт деплоя SSR приложения на продакшен сервер
# Usage: .\deploy-ssr.ps1

Write-Host "🚀 Starting SSR deployment to zerodolg.ru..." -ForegroundColor Green

# 1. Сборка проекта
Write-Host "`n📦 Building project..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# 2. Создание архива
Write-Host "`n📦 Creating deployment archive..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveName = "zerodolg-ssr-$timestamp.tar.gz"

# Создаем копию .env.production как .env для сервера
Copy-Item .env.production .env -Force

# Упаковка dist и других необходимых файлов
tar -czf $archiveName dist/ package.json package-lock.json ecosystem.config.cjs .env

# Удаляем временную копию
Remove-Item .env

# 3. Загрузка на сервер
Write-Host "`n⬆️  Uploading to server..." -ForegroundColor Yellow
scp $archiveName zerodolg-server:/tmp/

# 4. Деплой на сервере
Write-Host "`n🔧 Deploying on server..." -ForegroundColor Yellow
ssh zerodolg-server @"
    set -e
    
    echo '📦 Extracting archive...'
    cd /var/www/zerodolg.ru/
    
    # Создаем бэкап текущих файлов
    if [ -d dist ]; then
        echo '📦 Creating backup...'
        tar -czf backup-\$(date +%Y%m%d-%H%M%S).tar.gz dist/ .env 2>/dev/null || true
    fi
    
    tar -xzf /tmp/$archiveName
    
    echo '📦 Installing dependencies...'
    npm ci --production
    
    echo '🔄 Restarting PM2 process...'
    pm2 describe zerodolg-backend > /dev/null 2>&1
    if [ `$? -eq 0 ]; then
        pm2 reload zerodolg-backend --update-env
    else
        pm2 start ecosystem.config.cjs
        pm2 save
    fi
    
    echo '✅ Deployment completed!'
    pm2 status zerodolg-backend
    
    # Очистка
    rm /tmp/$archiveName
"@

# 5. Очистка локального архива
Remove-Item $archiveName

Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Site: https://zerodolg.ru" -ForegroundColor Cyan
