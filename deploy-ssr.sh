#!/bin/bash
# Скрипт деплоя SSR приложения на продакшен сервер
# Usage: ./deploy-ssr.sh

set -e

echo "🚀 Starting SSR deployment to zerodolg.ru..."

# Проверка наличия необходимых утилит
if ! command -v ssh &> /dev/null; then
    echo "❌ Error: ssh is not installed or not in PATH"
    exit 1
fi

if ! command -v scp &> /dev/null; then
    echo "❌ Error: scp is not installed or not in PATH"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH"
    exit 1
fi

# Проверка подключения к серверу
echo "🌐 Checking connection to server..."
if ! ssh -q -o ConnectTimeout=10 zerodolg-server exit; then
    echo "❌ Error: Cannot connect to server 'zerodolg-server'. Please check your SSH configuration."
    exit 1
fi

# Проверка наличия .env файла
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  Warning: .env file not found locally. Make sure it exists on the server."
else
    echo "✅ .env file found locally"
fi

# Проверка, что мы находимся в корне проекта
if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

# 1. Сборка проекта
echo ""
echo "📦 Building project..."
npm run build:prod

# 2. Создание архива
echo ""
echo "📦 Creating deployment archive..."
timestamp=$(date +%Y%m%d-%H%M%S)
archiveName="zerodolg-ssr-$timestamp.tar.gz"
FINAL_ARCHIVE="$archiveName"

# Исправление ошибки: создание несжатого архива, затем сжатие
# Убираем .gz из имени временного архива
TEMP_ARCHIVE="temp_$(basename "$archiveName" .gz)"
FINAL_ARCHIVE="$archiveName"

# Создание несжатого архива с основными файлами
echo "📦 Creating deployment archive with all necessary files..."
tar -cf "$TEMP_ARCHIVE" dist/ package.json package-lock.json ecosystem.config.cjs

# Проверка и добавление .env файла
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    echo "🔒 Adding .env file to archive..."
    tar -rf "$TEMP_ARCHIVE" "$ENV_FILE"
else
    echo "⚠️  Warning: .env file not found locally. Make sure it exists on the server."
fi

# Проверка и добавление nginx конфигурации
NGINX_CONFIG="nginx-ssr.conf"
if [ -f "$NGINX_CONFIG" ]; then
    echo "⚙️ Adding nginx configuration to archive..."
    tar -rf "$TEMP_ARCHIVE" "$NGINX_CONFIG"
else
    echo "⚠️  Warning: nginx-ssr.conf file not found locally."
fi

# Сжатие архива
gzip "$TEMP_ARCHIVE"

# Переименование сжатого файла в окончательное имя
mv "${TEMP_ARCHIVE}.gz" "$FINAL_ARCHIVE"

# 3. Загрузка на сервер
echo ""
echo "⬆️  Uploading to server..."
scp "$FINAL_ARCHIVE" zerodolg-server:/tmp/

# 4. Деплой на сервере
echo ""
echo "🔧 Deploying on server..."
ssh zerodolg-server << EOF
    set -e
    
    # Создание резервной копии текущей версии
    echo '💾 Creating backup of current deployment...'
    BACKUP_DIR="/var/backups/zerodolg-\$(date +%Y%m%d_%H%M%S)"
    mkdir -p "\$BACKUP_DIR"
    
    # Архивируем текущую версии приложения (кроме node_modules и логов)
    cd /var/www/zerodolg.ru/
    tar --exclude='node_modules' --exclude='logs' --exclude='dist' -czf "\$BACKUP_DIR/backup-\$(date +%Y%m%d_%H%M%S).tar.gz" .
    
    echo "📦 Backup created at: \$BACKUP_DIR"
    
    # Очистка директории перед извлечением нового архива
    echo '🧹 Cleaning current deployment directory...'
    # Удаляем все файлы, кроме node_modules (чтобы не переустанавливать зависимости заново) и .env
    find /var/www/zerodolg.ru/ -mindepth 1 -maxdepth 1 \( ! -name 'node_modules' -a ! -name '.env' -a ! -name 'logs' \) -exec rm -rf {} + || true
    
    echo '📦 Extracting new archive...'
    tar -xzf /tmp/$archiveName
    
    # Извлечение архива во временный каталог для правильной сортировки
    cd /tmp
    mkdir -p deploy_temp
    cd deploy_temp
    tar -xzf "/tmp/$FINAL_ARCHIVE"
    
    # Создание основных директорий
    mkdir -p /var/www/zerodolg.ru/public_html
    mkdir -p /var/www/zerodolg.ru/server
    
    # Перемещение .env файла в корень приложения (вне публичной директории)
    if [ -f .env ]; then
        echo '🔐 Configuring environment variables...'
        if [ -f "/var/www/zerodolg.ru/.env" ]; then
            mv .env /var/www/zerodolg.ru/.env.tmp
            # Объединяем содержимое файлов, если .env уже существует
            cat /var/www/zerodolg.ru/.env.tmp >> /var/www/zerodolg.ru/.env
            rm /var/www/zerodolg.ru/.env.tmp
        else
            mv .env /var/www/zerodolg.ru/.env
        fi
    else
        echo '⚠️  Warning: .env file not found in archive. Please ensure it exists on server.'
    fi
    
    # Перемещение файлов конфигурации в корень
    for file in package.json package-lock.json ecosystem.config.cjs nginx-ssr.conf; do
        if [ -f "$file" ]; then
            mv "$file" /var/www/zerodolg.ru/
        fi
    done
    
    # Перемещение директории dist
    if [ -d dist ]; then
        # Если в dist есть client и server директории (для SSR)
        if [ -d dist/client ]; then
            # Копируем статические файлы в client директорию
            mkdir -p /var/www/zerodolg.ru/client
            cp -r dist/client/* /var/www/zerodolg.ru/client/
        else
            # Если client директории нет, копируем всё содержимое dist в client
            mkdir -p /var/www/zerodolg.ru/client
            cp -r dist/* /var/www/zerodolg.ru/client/ 2>/dev/null || true
        fi
        
        # Копируем server файлы в server директорию
        if [ -d dist/server ]; then
            cp -r dist/server/* /var/www/zerodolg.ru/server/
        fi
    fi
    
    # Очистка содержимого директории, но сохранение важных файлов и директорий
    echo '🧹 Cleaning application directory...'
    # Сохраняем .env файл, если он существует
    if [ -f "/var/www/zerodolg.ru/.env" ]; then
        mv /var/www/zerodolg.ru/.env /tmp/.env.backup
    fi
    
    # Сохраняем директорию logs
    if [ -d "/var/www/zerodolg.ru/logs" ]; then
        mv /var/www/zerodolg.ru/logs /tmp/logs.backup
    fi
    
    # Удаляем всё содержимое, кроме важных файлов
    find /var/www/zerodolg.ru/ -mindepth 1 -maxdepth 1 \( ! -name '.env' -a ! -name 'logs' \) -exec rm -rf {} + || true
    
    # Восстанавливаем .env и logs, если они были
    if [ -f "/tmp/.env.backup" ]; then
        mv /tmp/.env.backup /var/www/zerodolg.ru/.env
    fi
    
    if [ -d "/tmp/logs.backup" ]; then
        mv /tmp/logs.backup /var/www/zerodolg.ru/logs
    else
        # Создаем директорию logs, если её не было
        mkdir -p /var/www/zerodolg.ru/logs
    fi
    
    # Возврат в директорию приложения
    cd /var/www/zerodolg.ru/
    
    # Удаление временной директории
    rm -rf /tmp/deploy_temp
    
    # Создание необходимых директорий
    echo '📁 Creating required directories...'
    mkdir -p /var/www/zerodolg.ru/logs
    
    echo '📦 Installing dependencies...'
    npm ci --production
    
    # Обновление конфигурации nginx при необходимости
    echo '⚙️  Checking nginx configuration...'
    if [ -f "/var/www/zerodolg.ru/nginx-ssr.conf" ]; then
        echo '🔄 Updating nginx configuration...'
        sudo cp /var/www/zerodolg.ru/nginx-ssr.conf /etc/nginx/sites-available/zerodolg.ru
        if [ ! -L "/etc/nginx/sites-enabled/zerodolg.ru" ]; then
            sudo ln -sf /etc/nginx/sites-available/zerodolg.ru /etc/nginx/sites-enabled/
        fi
        
        # Проверка конфигурации nginx
        if sudo nginx -t; then
            echo '✅ Nginx configuration is valid'
            # Перезагрузка nginx (без прерывания соединений)
            sudo nginx -s reload
            echo '🔄 Nginx configuration reloaded'
        else
            echo '❌ Warning: Nginx configuration has errors, skipping reload'
        fi
    else
        echo 'ℹ️  Nginx configuration file not found in deployment, skipping nginx update'
    fi
    
    echo '🔄 Restarting PM2 process...'
    if pm2 describe zerodolg-backend > /dev/null 2>&1; then
        pm2 reload zerodolg-backend --update-env
    else
        pm2 start ecosystem.config.cjs
        pm2 save
    fi
    
    # Проверка состояния приложения
    echo '🔍 Checking application status...'
    sleep 5  # Даем время приложению запуститься
    
    if pm2 status zerodolg-backend | grep -q "online"; then
        echo '✅ Application is running'
    else
        echo '❌ Warning: Application may not be running properly'
    fi
    
    echo '✅ Deployment completed!'
    pm2 status zerodolg-backend
    
    # Очистка старых архивов (оставить только последние 5 бэкапов)
    find /var/backups/ -name "zerodolg-*" -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
    
    # Очистка
    rm /tmp/$FINAL_ARCHIVE
EOF

# 5. Очистка локального архива
rm "$FINAL_ARCHIVE"

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Site: https://zerodolg.ru"
