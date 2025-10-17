#!/bin/bash

# Скрипт для настройки reverse SSH tunnel
# Запускается на локальном компьютере для предоставления доступа к нему через удаленный сервер

REMOTE_HOST="37.252.21.175"  # IP-адрес удаленного сервера
REMOTE_USER="root"
REMOTE_PORT="2222"  # Порт, который будет использоваться на удаленном сервере
LOCAL_PORT="22"     # Порт SSH на локальном компьютере

echo "Установка reverse SSH tunnel..."
echo "Доступ к локальному SSH будет через $REMOTE_HOST:$REMOTE_PORT"

# Устанавливаем постоянное соединение с автоматическим восстановлением
autossh -M 0 -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" \
    -R $REMOTE_PORT:localhost:$LOCAL_PORT $REMOTE_USER@$REMOTE_HOST -N &

echo "Reverse SSH tunnel установлен. Подключение будет поддерживаться автоматически."