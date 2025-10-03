#!/bin/bash
# Скрипт деплоя проекта zerodolg-astro на удаленный сервер

# Настройки
SSH_HOST="zerodolg-server"
REMOTE_PATH="/var/www/zerodolg.ru/public_html"
LOCAL_DIST="dist"
WEB_USER="www-data"  # Измените на актуального пользователя (nginx, apache, www, и т.д.)

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Функции для вывода
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_step() {
    echo -e "\n${YELLOW}→ $1${NC}\n"
}

# Проверка наличия папки dist
print_step "Проверка наличия папки dist..."
if [ ! -d "$LOCAL_DIST" ]; then
    print_error "Папка '$LOCAL_DIST' не найдена!"
    echo "Возможно, нужно собрать проект командой: npm run build"
    exit 1
fi
print_success "Папка dist найдена"

# Проверка подключения к серверу
print_step "Проверка подключения к серверу $SSH_HOST..."
if ! ssh $SSH_HOST "echo 'OK'" > /dev/null 2>&1; then
    print_error "Не удалось подключиться к серверу $SSH_HOST"
    exit 1
fi
print_success "Подключение установлено"

# Подтверждение удаления
print_warning "Это действие удалит все файлы в $REMOTE_PATH на сервере!"
read -p "Продолжить? (yes/no): " confirmation
if [[ "$confirmation" != "yes" && "$confirmation" != "y" ]]; then
    echo "Деплой отменен пользователем."
    exit 0
fi

# Шаг 1: Очистка директории на сервере
print_step "Шаг 1/3: Очистка директории на сервере..."
if ssh $SSH_HOST "rm -rf $REMOTE_PATH/*"; then
    print_success "Директория очищена"
else
    print_error "Ошибка при очистке директории"
    exit 1
fi

# Шаг 2: Копирование файлов
print_step "Шаг 2/3: Копирование файлов на сервер..."
if scp -r $LOCAL_DIST/* $SSH_HOST:$REMOTE_PATH/; then
    print_success "Файлы скопированы"
else
    print_error "Ошибка при копировании файлов"
    exit 1
fi

# Шаг 3: Установка прав доступа
print_step "Шаг 3/3: Установка прав доступа..."

# Установка владельца
echo "Установка владельца $WEB_USER..."
if ! ssh $SSH_HOST "sudo chown -R $WEB_USER:$WEB_USER $REMOTE_PATH/"; then
    print_warning "Не удалось установить владельца (возможно, требуются sudo-права)"
fi

# Установка прав на директории
echo "Установка прав на директории (755)..."
ssh $SSH_HOST "find $REMOTE_PATH/ -type d -exec chmod 755 {} \;"

# Установка прав на файлы
echo "Установка прав на файлы (644)..."
ssh $SSH_HOST "find $REMOTE_PATH/ -type f -exec chmod 644 {} \;"

print_success "Права доступа установлены"

# Проверка деплоя
print_step "Проверка деплоя..."
FILE_COUNT=$(ssh $SSH_HOST "find $REMOTE_PATH -type f | wc -l")
print_success "Деплой завершен! Загружено файлов: $FILE_COUNT"

echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}   Деплой успешно завершен!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}\n"
