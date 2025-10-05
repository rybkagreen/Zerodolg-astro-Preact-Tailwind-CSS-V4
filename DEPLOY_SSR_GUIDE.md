# 🚀 Руководство по деплою SSR Astro приложения

## 📋 Содержание

1. [Что изменилось](#что-изменилось)
2. [Требования](#требования)
3. [Первоначальная настройка сервера](#первоначальная-настройка-сервера)
4. [Деплой приложения](#деплой-приложения)
5. [Обновление приложения](#обновление-приложения)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Что изменилось

### До (Static режим)

- ❌ Astro собирал только статические HTML файлы
- ❌ API endpoints не работали в продакшене
- ❌ POST запросы к `/api/form` возвращали 405 ошибку

### После (Hybrid/SSR режим)

- ✅ Astro собирает статические страницы + SSR сервер
- ✅ API endpoints полностью функциональны
- ✅ POST запросы обрабатываются Node.js сервером
- ✅ Формы работают корректно

---

## 📦 Требования

### На локальной машине:

- Node.js >= 18.17.1
- npm
- SSH доступ к продакшен серверу

### На продакшен сервере:

- Ubuntu Server (уже установлено ✅)
- Node.js v22.19.0 (уже установлено ✅)
- nginx 1.18.0 (уже установлено ✅)
- PM2 (для управления Node.js процессами)

---

## 🔧 Первоначальная настройка сервера

### Шаг 1: Установка PM2 (если не установлен)

```bash
ssh zerodolg-server
sudo npm install -g pm2
pm2 startup systemd
```

Выполните команду, которую выведет PM2, например:

```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u www-data --hp /home/www-data
```

### Шаг 2: Создание директорий для логов

```bash
ssh zerodolg-server
mkdir -p /var/www/zerodolg.ru/logs
chown -R www-data:www-data /var/www/zerodolg.ru/logs
```

### Шаг 3: Обновление конфигурации nginx

**На локальной машине:**

```powershell
# Скопировать новую конфигурацию на сервер
scp nginx-ssr.conf zerodolg-server:/tmp/zerodolg.ru.conf
```

**На сервере:**

```bash
ssh zerodolg-server

# Создать бэкап текущей конфигурации
sudo cp /etc/nginx/sites-available/zerodolg.ru /etc/nginx/sites-available/zerodolg.ru.backup

# Заменить конфигурацию
sudo mv /tmp/zerodolg.ru.conf /etc/nginx/sites-available/zerodolg.ru

# Проверить конфигурацию
sudo nginx -t

# Если всё OK, перезагрузить nginx
sudo systemctl reload nginx
```

### Шаг 4: Создать файл переменных окружения

**На сервере:**

```bash
ssh zerodolg-server
cd /var/www/zerodolg.ru/

# Создать .env файл
cat > .env << 'EOF'
NODE_ENV=production
HOST=127.0.0.1
PORT=4321
BITRIX24_WEBHOOK_URL=https://zerodolg.bitrix24.ru/rest/1/sn1lo90na6t13v1d/
PUBLIC_SITE_URL=https://zerodolg.ru
PUBLIC_SITE_PHONE=+7 (905) 577-33-87
PUBLIC_SITE_EMAIL=info@zerodolg.ru
EOF

# Установить правильные права
chmod 600 .env
chown www-data:www-data .env
```

---

## 🚀 Деплой приложения

### Вариант A: Автоматический деплой (PowerShell)

**На локальной машине:**

```powershell
# Убедитесь, что вы в директории проекта
cd D:\develop\zerodolg.ru\zerodolg-astro

# Запустить скрипт деплоя
.\deploy-ssr.ps1
```

### Вариант B: Автоматический деплой (Bash)

**На локальной машине (Linux/Mac):**

```bash
cd /path/to/zerodolg-astro
chmod +x deploy-ssr.sh
./deploy-ssr.sh
```

### Вариант C: Ручной деплой

**Шаг 1: Сборка проекта**

```powershell
npm run build:prod
```

**Шаг 2: Создание архива**

```powershell
tar -czf zerodolg-ssr.tar.gz dist/ package.json package-lock.json ecosystem.config.cjs
```

**Шаг 3: Загрузка на сервер**

```powershell
scp zerodolg-ssr.tar.gz zerodolg-server:/tmp/
```

**Шаг 4: Распаковка и установка на сервере**

```bash
ssh zerodolg-server

cd /var/www/zerodolg.ru/
tar -xzf /tmp/zerodolg-ssr.tar.gz

# Установка зависимостей для продакшена
npm ci --production

# Запуск через PM2
pm2 start ecosystem.config.cjs
pm2 save

# Проверка статуса
pm2 status zerodolg-backend
pm2 logs zerodolg-backend
```

---

## 🔄 Обновление приложения

Для обновления используйте тот же скрипт деплоя:

```powershell
.\deploy-ssr.ps1
```

Скрипт автоматически:

1. Соберёт новую версию
2. Загрузит на сервер
3. Обновит зависимости
4. Перезагрузит PM2 процесс без даунтайма

---

## 🧪 Проверка работоспособности

### 1. Проверить статус PM2 процесса

```bash
ssh zerodolg-server
pm2 status zerodolg-backend
pm2 logs zerodolg-backend --lines 50
```

### 2. Проверить API endpoint (GET)

```bash
curl https://zerodolg.ru/api/form
```

**Ожидаемый ответ:**

```json
{
  "status": "ok",
  "message": "Form API is working",
  "endpoints": {
    "POST": "/api/form - Submit form data to Bitrix24"
  }
}
```

### 3. Проверить API endpoint (POST)

```bash
curl -X POST https://zerodolg.ru/api/form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+79999999999",
    "email": "test@example.com",
    "formType": "callback"
  }'
```

**Ожидаемый ответ:**

```json
{
  "success": true,
  "leadId": 12345,
  "message": "Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.",
  "analytics": {
    "event": "purchase",
    "transaction_id": "12345",
    "value": 5000,
    "currency": "RUB",
    "form_type": "callback"
  }
}
```

### 4. Проверить через браузер

1. Откройте https://zerodolg.ru
2. Заполните любую форму на сайте
3. Отправьте форму
4. Должно появиться сообщение об успешной отправке
5. Проверьте Bitrix24 - там должен появиться новый лид

---

## 🎨 Важно: Проблема с CSS в SSR режиме

### Описание проблемы

В SSR режиме Astro генерирует CSS файлы в `dist/server/assets/`, но HTML
ссылается на них как `/assets/*.css`, предполагая, что они в
`dist/client/assets/`.

**Решение:** Автоматически добавлен post-build скрипт
`scripts/build/post-build-copy-css.js`, который копирует CSS файлы из
`dist/server/assets/` в `dist/client/assets/` после каждой сборки.

### Проверка после сборки

```powershell
# Проверить наличие CSS файлов
Get-ChildItem dist/client/assets/*.css
```

**Ожидаемый результат:**

```
Name                                                  Size
----                                                  ----
bankrotstvo-s-sokhraneniyem-imushchestva.CnkFIhhp.css 26 450 bytes
index.BP7G9qpC.css                                    12 922 bytes
```

Если CSS файлы отсутствуют, запустите вручную:

```powershell
node scripts/build/post-build-copy-css.js
```

**Подробности:** См. `SSR_CSS_FIX.md`

---

## 🐛 Troubleshooting

### Проблема: PM2 процесс не запускается

**Проверить логи:**

```bash
ssh zerodolg-server
pm2 logs zerodolg-backend --err
```

**Возможные причины:**

- Неправильный путь к `entry.mjs`
- Порт 4321 уже занят
- Нет прав на запись в директорию логов

**Решение:**

```bash
# Проверить, занят ли порт
ss -tlnp | grep 4321

# Убить процесс, если порт занят
kill -9 <PID>

# Проверить права
ls -la /var/www/zerodolg.ru/logs/

# Создать директорию логов
mkdir -p /var/www/zerodolg.ru/logs
chown -R www-data:www-data /var/www/zerodolg.ru/logs
```

### Проблема: 502 Bad Gateway

**Причина:** nginx не может подключиться к Node.js серверу

**Решение:**

```bash
# Проверить статус PM2
pm2 status zerodolg-backend

# Если процесс не запущен
pm2 start ecosystem.config.cjs

# Проверить логи nginx
tail -f /var/log/nginx/zerodolg-error.log

# Проверить, слушает ли Node.js на порту 4321
ss -tlnp | grep 4321
```

### Проблема: Формы не отправляются

**Проверить:**

1. Статус PM2 процесса
2. Логи приложения: `pm2 logs zerodolg-backend`
3. Переменные окружения в `.env`
4. Webhook URL для Bitrix24

**Тестовый запрос:**

```bash
ssh zerodolg-server
curl -X POST http://127.0.0.1:4321/api/form \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+79999999999","formType":"callback"}'
```

### Проблема: CORS ошибки

**Решение:** В `src/pages/api/form.ts` уже настроены правильные заголовки CORS.
Если проблема сохраняется, проверьте CSP заголовки в nginx конфигурации.

### Проблема: 405 Method Not Allowed всё ещё возникает

**Причина:** nginx конфигурация не обновлена

**Решение:**

```bash
ssh zerodolg-server

# Проверить, какая конфигурация активна
sudo nginx -T | grep -A 20 "server_name zerodolg.ru"

# Убедиться, что есть блок location /api/
sudo nginx -T | grep -A 10 "location /api/"

# Если блока нет, обновить конфигурацию
sudo nano /etc/nginx/sites-available/zerodolg.ru
# Вставить блок из файла nginx-ssr.conf

# Проверить и перезагрузить
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 Мониторинг

### Просмотр логов в реальном времени

```bash
# Логи приложения
pm2 logs zerodolg-backend --lines 100

# Логи nginx
tail -f /var/log/nginx/zerodolg-access.log
tail -f /var/log/nginx/zerodolg-error.log
```

### Статистика PM2

```bash
pm2 status
pm2 monit
pm2 describe zerodolg-backend
```

### Автозапуск при перезагрузке сервера

```bash
# Сохранить текущий список процессов
pm2 save

# Настроить автозапуск
pm2 startup systemd
```

---

## 🔒 Безопасность

### Переменные окружения

Никогда не коммитьте файл `.env` в Git! Он содержит чувствительные данные
(webhook URLs, API ключи).

### Права доступа

```bash
# Файлы и директории должны принадлежать www-data
sudo chown -R www-data:www-data /var/www/zerodolg.ru/

# .env файл должен быть доступен только владельцу
chmod 600 /var/www/zerodolg.ru/.env
```

---

## 📝 Дополнительные команды

### Перезапуск приложения

```bash
pm2 restart zerodolg-backend
```

### Остановка приложения

```bash
pm2 stop zerodolg-backend
```

### Удаление из PM2

```bash
pm2 delete zerodolg-backend
```

### Обновление PM2

```bash
npm install -g pm2@latest
pm2 update
```

---

## ✅ Чеклист успешного деплоя

- [ ] Node.js сервер запущен и работает
- [ ] PM2 показывает статус "online"
- [ ] nginx конфигурация обновлена и перезагружена
- [ ] GET запрос к `/api/form` возвращает JSON
- [ ] POST запрос к `/api/form` успешно обрабатывается
- [ ] Формы на сайте работают
- [ ] Лиды создаются в Bitrix24
- [ ] Логи не содержат ошибок
- [ ] PM2 настроен на автозапуск

---

**Дата создания:** 2025-10-04  
**Версия:** 1.0  
**Автор:** AI Assistant
