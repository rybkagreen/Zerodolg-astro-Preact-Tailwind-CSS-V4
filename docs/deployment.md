# Руководство по развертыванию

## Требования

- Node.js >= 18.x
- npm >= 8.x

## Установка зависимостей

```bash
npm install
```

## Разработка

### Запуск локального сервера
```bash
npm run dev
```
Сервер будет доступен по адресу `http://localhost:4321`

### Сборка проекта
```bash
npm run build
```
Результат сборки будет в директории `dist/`

### Предварительный просмотр
```bash
npm run preview
```
Предварительный просмотр собранного сайта

## Структура проекта

```
zerodolg-astro/
├── dist/                # Собранный сайт
├── docs/                # Документация
├── public/              # Статические файлы
├── src/                 # Исходный код
│   ├── components/      # Компоненты
│   ├── content/         # Контент
│   ├── data/            # Данные
│   ├── layouts/         # Макеты
│   ├── lib/             # Библиотеки
│   ├── pages/           # Страницы
│   └── styles/          # Стили
├── package.json         # Зависимости и скрипты
└── astro.config.mjs     # Конфигурация Astro
```

## Переменные окружения

### Файл .env.example

Проект содержит файл `.env.example`, который служит шаблоном для создания файла `.env` с необходимыми переменными окружения. Скопируйте `.env.example` в `.env` и настройте значения переменных:

```bash
cp .env.example .env
```

### Обязательные переменные

| Переменная | Описание | Пример значения |
|------------|----------|-----------------|
| `BITRIX24_WEBHOOK_URL` | URL вебхука Bitrix24 для отправки заявок | `https://your-domain.bitrix24.ru/rest/1/your-webhook-key/` |
| `PUBLIC_SITE_URL` | URL сайта | `https://your-domain.ru` |
| `PUBLIC_SITE_PHONE` | Контактный телефон | `+7 (905) 577-33-87` |
| `PUBLIC_SITE_EMAIL` | Контактный email | `info@your-domain.ru` |

### Опциональные переменные

| Переменная | Описание | Значение по умолчанию |
|------------|----------|------------------------|
| `PUBLIC_GA_ID` | Google Analytics ID | Не задан |
| `PUBLIC_YM_ID` | Yandex Metrika ID | Не задан |
| `PUBLIC_ASTRO_TOOLBAR` | Отображение Astro Dev Toolbar | `false` |
| `NODE_ENV` | Режим работы приложения | `production` |
| `CMS_API_BASE` | Базовый URL Alibaba CMS | Не задан |
| `CMS_API_KEY` | API ключ для Alibaba CMS | Не задан |

### Валидация переменных окружения

Для проверки корректности настройки переменных окружения используйте скрипт:

```bash
npm run env:validate
```

Этот скрипт проверяет наличие обязательных переменных и корректность форматов значений.

### Пример файла .env

```env
# Bitrix24 Configuration
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-webhook-key/

# Google Analytics
PUBLIC_GA_ID=G-XXXXXXXXXX

# Yandex Metrika
PUBLIC_YM_ID=XXXXXXXXX

# Site URL
PUBLIC_SITE_URL=https://your-domain.ru

# Contact Information
PUBLIC_SITE_PHONE=+7 (905) 577-33-87
PUBLIC_SITE_EMAIL=info@your-domain.ru

# Astro Dev Toolbar (disable in production)
PUBLIC_ASTRO_TOOLBAR=false

# CMS Configuration (if using Alibaba CMS)
CMS_API_BASE=https://your-cms-endpoint.alibabacloud.com
CMS_API_KEY=your-api-key-here

# Security Settings
NODE_ENV=production
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск локального сервера разработки |
| `npm run build` | Сборка проекта для продакшена |
| `npm run build:prod` | Сборка проекта с production конфигурацией |
| `npm run preview` | Предварительный просмотр собранного сайта |
| `npm run astro ...` | Запуск команд Astro CLI |
| `npm run env:validate` | Валидация переменных окружения |
| `npm run env:setup` | Помощник по настройке переменных окружения |
| `npm run deploy:checklist` | Отображение чеклиста для деплоя |

## Настройка переменных окружения

Для помощи в настройке переменных окружения используйте скрипт:

```bash
npm run env:setup
```

Этот скрипт:
1. Создаст файл `.env` из шаблона `.env.example`, если он еще не существует
2. Предоставит инструкции по настройке переменных
3. Даст рекомендации по безопасности

## Валидация конфигурации

Перед развертыванием рекомендуется провести валидацию конфигурации:

```bash
npm run env:validate
```

Этот скрипт проверит:
- Наличие всех обязательных переменных окружения
- Корректность форматов URL, телефонных номеров и email
- Соответствие форматам идентификаторов аналитики

## Чеклист для деплоя

Для отображения подробного чеклиста перед деплоем используйте команду:

```bash
npm run deploy:checklist
```

Этот чеклист включает проверку:
- Переменных окружения
- Зависимостей и кода
- Процесса сборки
- Настроек безопасности
- Производительности
- Аналитики и мониторинга
- Контента и SEO
- Процедуры деплоя

## Развертывание

### Настройка хостинга

Проект может быть развернут на любом статическом хостинге, поддерживающем Node.js:

1. Vercel
2. Netlify
3. GitHub Pages
4. Собственный сервер

### Процесс развертывания

1. Сборка проекта:
   ```bash
   npm run build
   ```

2. Загрузка содержимого директории `dist/` на хостинг

### CI/CD

Пример конфигурации для GitHub Actions:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Отладка

### Ошибки сборки

Проверьте логи консоли для выявления ошибок:

```bash
npm run build --verbose
```

### Проблемы с контентом

1. Проверьте подключение к Alibaba CMS
2. Убедитесь, что API ключ действителен
3. Проверьте структуру данных в CMS

### Проблемы с производительностью

1. Оптимизируйте изображения
2. Минимизируйте CSS и JavaScript
3. Используйте ленивую загрузку для изображений
4. Проверьте оценку Lighthouse

## Обслуживание

### Обновление зависимостей
```bash
npm outdated
npm update
```

### Тестирование после обновлений
1. Запустите локальный сервер
2. Проверьте все страницы
3. Проверьте мобильную версию
4. Проверьте кроссбраузерность

## Резервное копирование

### Код
- Регулярные коммиты в Git
- Резервные копии репозитория

### Контент
- Контент хранится в Alibaba CMS
- Регулярные резервные копии CMS
- Локальные fallback данные в `/src/content/`

## Мониторинг

### Логирование
- Ошибки CMS логируются в консоль
- Ошибки сборки отображаются в терминале

### Аналитика
- Google Analytics (если настроен)
- Другие системы аналитики (при необходимости)