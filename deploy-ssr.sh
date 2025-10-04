#!/bin/bash
# Скрипт деплоя SSR приложения на продакшен сервер
# Usage: ./deploy-ssr.sh

set -e

echo "🚀 Starting SSR deployment to zerodolg.ru..."

# 1. Сборка проекта
echo ""
echo "📦 Building project..."
npm run build:prod

# 2. Создание архива
echo ""
echo "📦 Creating deployment archive..."
timestamp=$(date +%Y%m%d-%H%M%S)
archiveName="zerodolg-ssr-$timestamp.tar.gz"

# Упаковка dist и других необходимых файлов
tar -czf "$archiveName" dist/ package.json package-lock.json ecosystem.config.cjs

# 3. Загрузка на сервер
echo ""
echo "⬆️  Uploading to server..."
scp "$archiveName" zerodolg-server:/tmp/

# 4. Деплой на сервере
echo ""
echo "🔧 Deploying on server..."
ssh zerodolg-server << EOF
    set -e
    
    echo '📦 Extracting archive...'
    cd /var/www/zerodolg.ru/
    tar -xzf /tmp/$archiveName
    
    echo '📦 Installing dependencies...'
    npm ci --production
    
    echo '🔄 Restarting PM2 process...'
    if pm2 describe zerodolg-backend > /dev/null 2>&1; then
        pm2 reload zerodolg-backend --update-env
    else
        pm2 start ecosystem.config.cjs
        pm2 save
    fi
    
    echo '✅ Deployment completed!'
    pm2 status zerodolg-backend
    
    # Очистка
    rm /tmp/$archiveName
EOF

# 5. Очистка локального архива
rm "$archiveName"

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Site: https://zerodolg.ru"
