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

# Создание архива с файлами для деплоя
echo "📦 Creating deployment archive with all necessary files..."
TEMP_ARCHIVE="temp_$(basename "$archiveName" .gz)"

# Создаем несжатый архив
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

# Сжимаем архив
gzip "$TEMP_ARCHIVE"
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
    
    # Директория приложения
    APP_DIR="/var/www/zerodolg.ru"
    BACKUP_DIR="/var/backups/zerodolg-\$(date +%Y%m%d_%H%M%S)"
    
    echo "💾 Creating backup of current deployment..."
    mkdir -p "\$BACKUP_DIR"
    
    # Архивируем текущую версию приложения (если она существует)
    if [ -d "\$APP_DIR" ] && [ "\$(ls -A \$APP_DIR)" ]; then
        cd "\$APP_DIR"
        tar --exclude='node_modules' --exclude='logs' --exclude='dist' -czf "\$BACKUP_DIR/backup-\$(date +%Y%m%d_%H%M%S).tar.gz" . 2>/dev/null || echo "⚠️ Warning: Could not create full backup, creating empty backup"
    else
        echo "⚠️ Warning: Application directory is empty or does not exist, creating empty backup"
        touch "\$BACKUP_DIR/empty-backup-\$(date +%Y%m%d_%H%M%S).txt"
    fi
    
    echo "📦 Backup created at: \$BACKUP_DIR"
    
    # Создание временной директории для новой версии
    TEMP_DEPLOY_DIR="/tmp/zerodolg-deploy-\$(date +%s)"
    mkdir -p "\$TEMP_DEPLOY_DIR"
    
    # Извлечение архива во временный каталог
    cd "\$TEMP_DEPLOY_DIR"
    tar -xzf "/tmp/$archiveName"
    
    # Создание структуры директорий приложения
    mkdir -p "\$APP_DIR/client" "\$APP_DIR/server" "\$APP_DIR/logs"
    
    # Копируем конфигурационные файлы
    for file in package.json package-lock.json ecosystem.config.cjs nginx-ssr.conf; do
        if [ -f "\$file" ]; then
            cp "\$file" "\$APP_DIR/"
        fi
    done
    
    # Копируем .env файл, если он есть
    if [ -f .env ]; then
        echo "🔐 Configuring environment variables..."
        cp .env "\$APP_DIR/.env"
    else
        echo "⚠️  Warning: .env file not found in archive. Please ensure it exists on server."
    fi
    
    # Копируем файлы клиента и сервера
    if [ -d dist/client ]; then
        cp -r dist/client/* "\$APP_DIR/client/"
    fi
    
    if [ -d dist/server ]; then
        cp -r dist/server/* "\$APP_DIR/server/"
    fi
    
    # Устанавливаем зависимости
    echo '📦 Installing dependencies...'
    cd "\$APP_DIR"
    if [ -f "package-lock.json" ]; then
        npm ci --omit=dev --no-optional --no-prepare
    else
        npm install --omit=dev --no-optional --no-prepare
    fi
    
    # Проверяем, что приложение успешно установлено
    if [ -d "\$APP_DIR/server" ] && [ -d "\$APP_DIR/client" ]; then
        echo '✅ Application files successfully installed'
    else
        echo '❌ Error: Application files were not properly installed'
        exit 1
    fi
    
    # Обновление конфигурации nginx при необходимости
    echo '⚙️  Checking nginx configuration...'
    if [ -f "\$APP_DIR/nginx-ssr.conf" ]; then
        echo '🔄 Updating nginx configuration...'
        sudo cp "\$APP_DIR/nginx-ssr.conf" /etc/nginx/sites-available/zerodolg.ru
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
    
    # Запуск или перезапуск PM2 процесса
    echo '🔄 Starting PM2 process...'
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
        echo '❌ Error: Application is not running properly'
        exit 1
    fi
    
    echo '✅ Deployment completed!'
    pm2 status zerodolg-backend
    
    # Удаляем временные файлы
    rm -rf "\$TEMP_DEPLOY_DIR"
    rm /tmp/"$archiveName"
    
    # Очистка старых бэкапов (оставить только последние 5)
    ls -td /var/backups/zerodolg-* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
    
    echo '✅ Server cleanup completed!'
EOF

# 5. Очистка локального архива
rm "$FINAL_ARCHIVE"

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Site: https://zerodolg.ru"
