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

Создайте файл `.env` в корне проекта:

```env
# Alibaba CMS
CMS_API_BASE=https://your-cms-endpoint.alibabacloud.com
CMS_API_KEY=your-api-key-here

# Другие переменные при необходимости
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск локального сервера разработки |
| `npm run build` | Сборка проекта для продакшена |
| `npm run preview` | Предварительный просмотр собранного сайта |
| `npm run astro ...` | Запуск команд Astro CLI |

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