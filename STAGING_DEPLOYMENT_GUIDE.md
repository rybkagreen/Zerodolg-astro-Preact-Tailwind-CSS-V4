# 🚀 Подробное руководство по развертыванию Staging сервера с Docker

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Требования для развертывания](#требования-для-развертывания)
3. [Локальная настройка Docker](#локальная-настройка-docker)
4. [Развертывание Staging среды](#развертывание-staging-среды)
5. [Тестирование фронтенда](#тестирование-фронтенда)
6. [Тестирование бэкенда](#тестирование-бэкенда)
7. [Управление Staging средой](#управление-staging-средой)
8. [Устранение неполадок](#устранение-неполадок)

---

## 🎯 Обзор архитектуры

### Гибридная архитектура (Static + SSR)

- Astro собирает статические страницы + SSR сервер
- API endpoints полностью функциональны
- POST запросы обрабатываются Node.js сервером
- Формы работают корректно через `/api/form` endpoint

### Docker контейнеры в Staging

1. **zerodolg-web** - основное приложение (Nginx + Astro SSR)
2. **zerodolg-lighthouse** - сервер для тестирования производительности

---

## 📦 Требования для развертывания

### На локальной машине:

- Docker Desktop (Windows) или Docker Engine (Linux/Mac)
- Node.js >= 18.17.1
- npm
- PowerShell (для Windows) или Bash (для Linux/Mac)
- Git

### Переменные окружения (для стейджинга):

- `BITRIX24_WEBHOOK_URL` - URL для интеграции с Bitrix24
- `PUBLIC_GA_ID` - Google Analytics ID (опционально)
- `PUBLIC_YM_ID` - Яндекс.Метрика ID (опционально)

---

## 🔧 Локальная настройка Docker

### Установка и проверка Docker

1. Установите Docker Desktop (Windows) или Docker Engine (Linux/Mac)
2. Запустите Docker
3. Проверьте установку:

```powershell
# На Windows PowerShell
docker --version
docker compose version
```

```bash
# На Linux/Mac
docker --version
docker-compose version
```

### Проверка доступности Docker в текущей сессии

```powershell
# Для Windows
$env:PATH = "D:\Program Files\Docker\resources\bin;"+$env:PATH
docker version
```

---

## 🚀 Развертывание Staging среды

### Вариант A: Использование скриптов npm (рекомендуется)

#### 1. Запуск Staging среды

```powershell
# Убедитесь, что вы в директории проекта
cd D:\develop\zerodolg.ru\zerodolg-astro

# Запустить staging среду с Docker
npm run staging:up
```

#### 2. Проверка запуска

После запуска:

- Веб-приложение будет доступно по адресу: `http://localhost:3000`
- Lighthouse CI будет доступен по адресу: `http://localhost:9001`

#### 3. Просмотр логов

```powershell
# Просмотреть логи в реальном времени
npm run staging:logs
```

### Вариант B: Использование Docker Compose напрямую

#### 1. Сборка и запуск вручную

```powershell
# Убедитесь, что вы в директории проекта
cd D:\develop\zerodolg.ru\zerodolg-astro

# Сборка и запуск
docker compose up -d --build
```

#### 2. Проверка состояния контейнеров

```powershell
docker compose ps
```

#### 3. Просмотр логов

```powershell
docker compose logs -f zerodolg-web
```

### Вариант C: Использование PowerShell скриптов

#### 1. Запуск через скрипт

```powershell
# Убедитесь, что вы в директории проекта
cd D:\develop\zerodolg.ru\zerodolg-astro

# Запуск staging среды
.\scripts\staging\start-staging.ps1
```

---

## 🧪 Тестирование фронтенда

### 1. Проверка доступности сайта

1. Откройте браузер
2. Перейдите на `http://localhost:3000`
3. Проверьте загрузку главной страницы
4. Перейдите по нескольким внутренним ссылкам
5. Убедитесь, что стили и интерактивные компоненты работают корректно

### 2. Проверка CSS и стилей

1. Убедитесь, что все стили загружаются корректно
2. Проверьте отсутствие broken CSS ссылок в консоли браузера
3. Убедитесь, что дизайн соответствует ожиданиям

### 3. Проверка интерактивных компонентов

1. Протестируйте интерактивные элементы (кнопки, формы, меню)
2. Проверьте работу Preact компонентов
3. Убедитесь, что JavaScript работает корректно

### 4. Проверка SEO элементов

1. Проверьте заголовки страниц (title, meta description)
2. Убедитесь, что sitemap.xml доступен
3. Проверьте robots.txt

---

## 🔧 Тестирование бэкенда

### 1. Проверка API endpoints

#### GET запрос к API:

```bash
curl http://localhost:3000/api/form
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

#### POST запрос к API:

```bash
curl -X POST http://localhost:3000/api/form \
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

### 2. Проверка обработки форм

1. Зайдите на страницу с формой на `http://localhost:3000`
2. Заполните тестовые данные
3. Отправьте форму
4. Убедитесь, что получаете сообщение об успешной отправке
5. (Если подключено к реальному Bitrix24) проверьте появление лида в системе

### 3. Проверка переменных окружения

Контейнер использует следующие переменные окружения:

- `NODE_ENV=production`
- `PUBLIC_SITE_URL=http://localhost:3000`
- `BITRIX24_WEBHOOK_URL` (если определена)
- `PUBLIC_SITE_PHONE=+7 (905) 577-33-87`
- `PUBLIC_SITE_EMAIL=info@zerodolg.ru`

---

## 🎛️ Управление Staging средой

### Просмотр состояния контейнеров

```powershell
docker compose ps
```

### Перезапуск контейнеров

```powershell
npm run staging:restart
# или
docker compose restart zerodolg-web
```

### Остановка среды

```powershell
# Используя npm скрипт
npm run staging:down

# Или напрямую через docker compose
docker compose down

# Или через PowerShell скрипт
.\scripts\staging\stop-staging.ps1
```

### Очистка среды (удаление всех контейнеров, volumes и images)

```powershell
npm run staging:clean
# или
.\scripts\staging\clean-staging.ps1
```

### Проверка состояния после изменений

После внесения изменений в код:

1. Остановите текущую среду: `npm run staging:down`
2. Пересоберите образы: `npm run staging:up` (автоматически включает --build)
3. Проверьте логи и функциональность

---

## 🐛 Устранение неполадок

### Проблема: Контейнер не запускается

**Проверить логи:**

```powershell
docker compose logs zerodolg-web --tail=50
```

**Возможные причины:**

- Ошибка в сборке приложения
- Проблемы с зависимостями
- Ошибка в конфигурации nginx

### Проблема: Сайт не доступен по http://localhost:3000

**Проверить:**

```powershell
# Проверить статус контейнеров
docker compose ps

# Проверить логи
docker compose logs zerodolg-web

# Проверить, слушает ли порт
netstat -an | findstr :3000
```

### Проблема: API endpoint не отвечает

**Проверить:**

1. Убедиться, что SSR режим включен в конфигурации
2. Проверить логи контейнера на ошибки
3. Убедиться, что API route корректно определен

### Проблема: Ошибка в CSS (отсутствуют стили)

**Решение:** Автоматически добавлен post-build скрипт
`scripts/build/post-build-copy-css.js`, который копирует CSS файлы из
`dist/server/assets/` в `dist/client/assets/` после каждой сборки.

Проверить наличие CSS файлов в контейнере:

```powershell
docker exec -it zerodolg-staging ls -la /usr/share/nginx/html/assets/
```

### Проблема: Docker не может собрать образ

**Решение:**

1. Очистите кэш Docker:

```powershell
docker builder prune
```

2. Удалите все неиспользуемые образы:

```powershell
docker image prune -a
```

3. Перезапустите Docker Desktop/Engine

---

## 📊 Мониторинг и отладка

### Просмотр логов в реальном времени

```powershell
# Логи веб-приложения
npm run staging:logs

# Или напрямую
docker compose logs -f --tail=100 zerodolg-web
```

### Проверка здоровья контейнера

Docker контейнер включает health check, который проверяет доступность главной
страницы каждые 30 секунд:

```bash
docker inspect --format='{{json .State.Health}}' zerodolg-staging
```

### Тестирование производительности через Lighthouse

Lighthouse CI доступен на `http://localhost:9001`

- Позволяет проводить аудит производительности
- Используется для сравнения изменений производительности
- Может интегрироваться в CI/CD pipeline

---

## 🔒 Безопасность

### Переменные окружения

Никогда не коммитьте чувствительные данные в Git! Используйте `.env` файлы,
которые исключены из git.

### Права доступа

В Docker контейнере:

- Веб-файлы находятся в `/usr/share/nginx/html`
- Логи находятся в `/var/log/nginx`
- Пользователь: `nginx`

---

## ✅ Чеклист успешного развертывания

- [ ] Docker контейнеры запущены и работают
- [ ] Сайт доступен по адресу `http://localhost:3000`
- [ ] GET запрос к `/api/form` возвращает JSON
- [ ] POST запрос к `/api/form` успешно обрабатывается
- [ ] Формы на сайте работают корректно
- [ ] CSS и JS файлы загружаются без ошибок
- [ ] Логи не содержат критических ошибок
- [ ] Lighthouse CI доступен по адресу `http://localhost:9001`

---

## 🛠️ Дополнительные команды

### Сборка проекта локально

```powershell
npm run build:prod
```

### Проверка типов

```powershell
npm run type-check
```

### Линтинг кода

```powershell
npm run lint
```

### Форматирование кода

```powershell
npm run format
```

---

**Дата создания:** 2025-10-04  
**Версия:** 1.0  
**Автор:** AI Assistant
