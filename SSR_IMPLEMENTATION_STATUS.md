# ✅ Статус реализации SSR для zerodolg.ru

**Дата:** 2025-10-04  
**Статус:** 🟢 Готово к деплою на сервер

---

## 📊 Что было реализовано

### 1. ✅ Конфигурация проекта

#### `astro.config.mjs` (development)

- ✅ Добавлен `@astrojs/node` adapter
- ✅ Изменен режим с `static` на `server`
- ✅ Настроен `standalone` mode для PM2

#### `astro.config.prod.mjs` (production)

- ✅ Настроен `server` output mode
- ✅ Добавлен Node.js adapter
- ✅ Отключен lightningcss для избежания ошибок минификации
- ✅ Оптимизирована сборка с terser

### 2. ✅ API Endpoints

#### `src/pages/api/form.ts`

- ✅ Полностью рабочий endpoint для отправки форм
- ✅ Интеграция с Bitrix24
- ✅ Поддержка JSON и FormData
- ✅ Валидация данных
- ✅ GET endpoint для проверки работоспособности

### 3. ✅ Файлы конфигурации

#### `.env.production`

- ✅ Создан файл с production переменными окружения
- ⚠️ **ВАЖНО:** Заполните реальные значения для `PUBLIC_GA_ID` и `PUBLIC_YM_ID`

#### `ecosystem.config.cjs`

- ✅ Настроен для PM2
- ✅ Добавлена загрузка `.env` файла
- ✅ Настроен graceful shutdown
- ✅ Указан правильный путь к `entry.mjs`

#### `nginx-ssr.conf`

- ✅ Готовая конфигурация для nginx
- ✅ Проксирование `/api/` на Node.js сервер
- ✅ Обработка статических файлов
- ✅ Fallback на SSR для динамических страниц

### 4. ✅ Скрипты деплоя

#### `deploy-ssr.ps1`

- ✅ Автоматическая сборка проекта
- ✅ Создание архива с dist, package.json, ecosystem.config.cjs и .env
- ✅ Загрузка на сервер
- ✅ Автоматическое обновление зависимостей
- ✅ Перезапуск PM2 без даунтайма
- ✅ Создание бэкапов перед деплоем

#### `deploy-ssr.sh`

- ✅ Bash версия скрипта для Linux/Mac

### 5. ✅ Prerendering

#### `src/pages/index.astro`

- ✅ Добавлена директива `export const prerender = true`
- ✅ Главная страница будет генерироваться статически

---

## 🚀 Следующие шаги (на сервере)

### Шаг 1: Установка PM2 (если не установлен)

```bash
ssh zerodolg-server
sudo npm install -g pm2
pm2 startup systemd
# Выполните команду, которую выведет PM2
```

### Шаг 2: Создание директорий

```bash
ssh zerodolg-server
mkdir -p /var/www/zerodolg.ru/logs
chown -R www-data:www-data /var/www/zerodolg.ru/logs
```

### Шаг 3: Обновление nginx конфигурации

**На локальной машине:**

```powershell
scp nginx-ssr.conf zerodolg-server:/tmp/zerodolg.ru.conf
```

**На сервере:**

```bash
ssh zerodolg-server

# Создать бэкап
sudo cp /etc/nginx/sites-available/zerodolg.ru /etc/nginx/sites-available/zerodolg.ru.backup

# Заменить конфигурацию
sudo mv /tmp/zerodolg.ru.conf /etc/nginx/sites-available/zerodolg.ru

# Проверить
sudo nginx -t

# Если OK, перезагрузить
sudo systemctl reload nginx
```

### Шаг 4: Первый деплой

**На локальной машине:**

```powershell
.\deploy-ssr.ps1
```

Скрипт автоматически:

1. Соберет проект
2. Создаст архив
3. Загрузит на сервер
4. Установит зависимости
5. Запустит PM2 процесс

---

## 🧪 Проверка после деплоя

### 1. Проверить PM2 процесс

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
  -d '{"name":"Test User","phone":"+79999999999","formType":"callback"}'
```

### 4. Проверить главную страницу

```bash
curl -I https://zerodolg.ru
```

Убедитесь, что возвращается статус 200.

---

## 📝 Дополнительные заметки

### Переменные окружения

Не забудьте заполнить реальные значения в `.env.production`:

- `PUBLIC_GA_ID` - Google Analytics ID
- `PUBLIC_YM_ID` - Яндекс.Метрика ID

### Обновление приложения

Для последующих обновлений просто запускайте:

```powershell
.\deploy-ssr.ps1
```

Скрипт автоматически создаст бэкап и обновит приложение без даунтайма.

### Мониторинг

```bash
# Статус процесса
pm2 status

# Логи в реальном времени
pm2 logs zerodolg-backend

# Детальная информация
pm2 describe zerodolg-backend

# Мониторинг ресурсов
pm2 monit
```

### Перезапуск приложения

```bash
# Перезапуск с нулевым даунтаймом
pm2 reload zerodolg-backend

# Обычный перезапуск
pm2 restart zerodolg-backend
```

---

## ⚠️ Важные замечания

1. **Безопасность:**
   - Файл `.env` не должен быть в Git
   - Права на `.env` должны быть 600
   - Владелец файлов должен быть www-data

2. **PM2:**
   - Настроен автозапуск при перезагрузке сервера
   - Используется fork mode (можно переключить на cluster при необходимости)
   - Настроен автоматический рестарт при ошибках

3. **Nginx:**
   - API запросы проксируются на Node.js (порт 4321)
   - Статические файлы отдаются напрямую из `/var/www/zerodolg.ru/public_html`
   - Fallback на SSR только для динамических страниц

---

## 📚 Полезные ссылки

- [DEPLOY_SSR_GUIDE.md](./DEPLOY_SSR_GUIDE.md) - Полное руководство по деплою
- [Astro SSR Documentation](https://docs.astro.build/en/guides/server-side-rendering/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## ✅ Чеклист готовности к деплою

- [x] Конфигурация Astro обновлена
- [x] API endpoints реализованы
- [x] `.env.production` создан
- [x] `ecosystem.config.cjs` настроен
- [x] `nginx-ssr.conf` готов
- [x] Скрипты деплоя готовы
- [x] Prerender директивы добавлены
- [x] Локальная сборка успешна
- [ ] PM2 установлен на сервере
- [ ] Nginx конфигурация обновлена
- [ ] Первый деплой выполнен
- [ ] API endpoints проверены
- [ ] Формы на сайте работают

---

**Готово к деплою! 🚀**
