# Руководство по деплою

## Общая схема деплоя

Проект использует гибридную архитектуру Astro (SSG + SSR) с Node.js адаптером в режиме standalone. Это позволяет эффективно разворачивать как статический контент, так и динамические API-маршруты для обработки форм и интеграции с Bitrix24.

## Подготовка к деплою

### Переменные окружения

Для корректного функционирования приложения требуются следующие переменные:

**Обязательные:**
```
NODE_ENV=production
PUBLIC_SITE_URL=https://zerodolg.ru
BITRIX24_DOMAIN=your-domain.bitrix24.ru
BITRIX24_ACCESS_TOKEN=your_access_token
BITRIX24_REFRESH_TOKEN=your_refresh_token
```

**Необязательные:**
```
BITRIX24_WEBHOOK_SECRET=your_webhook_secret
ANALYTICS_ID=your_analytics_id
YANDEX_METRICS_ID=your_yandex_metrics_id
TEST_MODE=true/false (для отладки без отправки в CRM)
```

### Проверка перед деплоем

Выполните следующие проверки перед деплоем:

```bash
# Проверка типов
npm run type-check

# Линтинг кода
npm run lint

# Запуск тестов
npm run test

# Проверка сборки
npm run build
```

## Процесс деплоя

### Сборка проекта

Для сборки проекта используйте:

```bash
npm run build
```

Это создаст:
- Серверную часть в `dist/server/entry.mjs`
- Статические ресурсы в `dist/client/`
- Пререндеренные HTML-страницы

### Запуск в продакшене

Проект использует SSR с Node.js адаптером:

```bash
# Установка зависимостей для продакшена
npm ci --only=production

# Сборка
npm run build

# Запуск сервера
node dist/server/entry.mjs
```

## CI/CD Pipeline

### GitHub Actions

Используются следующие workflows:

1. **PR-валидация** - запускает тесты и проверки при создании Pull Request
2. **Стейджинг деплой** - автоматический деплой на стейджинг при мерже в develop
3. **Продакшн деплой** - деплой на продакшн при мерже в main

### Запуск вручную

Для инициации деплоя вручную:

```bash
# Деплой на стейджинг
npm run deploy:staging

# Деплой на продакшн
npm run deploy:production
```

## Docker-деплой

Для контейнеризированного деплоя используйте:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
```

Затем:
```bash
# Сборка образа
docker build -t zerodolg-astro .

# Запуск контейнера
docker run -d -p 4321:4321 --env-file .env zerodolg-astro
```

## SSR конфигурация

### astro.config.mjs

Проект использует следующую конфигурацию:

```js
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // остальные настройки
});
```

### PM2

Для управления процессом в продакшене используется PM2:

```json
{
  "apps": [{
    "name": "zerodolg-astro",
    "script": "dist/server/entry.mjs",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production",
      "PORT": 4321
    }
  }]
}
```

### Nginx

Пример конфигурации nginx:

```
upstream zerodolg_backend {
    server 127.0.0.1:4321;
}

server {
    listen 80;
    server_name zerodolg.ru www.zerodolg.ru;

    location / {
        proxy_pass http://zerodolg_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Статические ресурсы могут быть размещены напрямую
    location /_astro/ {
        alias /path/to/dist/client/_astro/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Мониторинг деплоя

### Автоматические проверки

После деплоя автоматически запускаются:

- Проверка доступности основных страниц
- Тестирование форм обратной связи
- Проверка интеграции с Bitrix24
- Аудит безопасности

### Заголовки безопасности и кэширования

Middleware.ts обеспечивает следующие заголовки:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Настройки кэширования:
- HTML: 5 минут
- Статические ресурсы: 1 год (с immutable для версионированных файлов)
- API маршруты: кэширование по необходимости

## Откат версии

В случае проблем с новой версией:

1. Определите предыдущую стабильную версию
2. Запустите процесс отката через CI/CD
3. Проверьте работоспособность после отката
4. Документируйте причину отката

## Особенности продакшн конфигурации

### SSR режим

Проект развернут в SSR режиме для:
- Улучшенного SEO
- Корректной работы динамического контента
- Обработки форм и интеграции с Bitrix24

### Производительность

- Предзагрузка при скролле для улучшения производительности
- Оптимизация изображений с поддержкой WebP/AVIF
- CSS tree-shaking и минификация

### Безопасность

- CSP заголовки для предотвращения XSS
- CSRF защита для форм
- Валидация всех входящих данных
- Таймауты для внешних API запросов (включая Bitrix24)