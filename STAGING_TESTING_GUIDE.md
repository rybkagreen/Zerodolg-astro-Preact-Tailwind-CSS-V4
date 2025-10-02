# 🐳 Руководство по тестированию на Staging сервере (Docker)

## 📋 Содержание

1. [Требования](#требования)
2. [Быстрый старт](#быстрый-старт)
3. [Тестирование](#тестирование)
4. [Доступные проверки](#доступные-проверки)
5. [Troubleshooting](#troubleshooting)

---

## 📦 Требования

### Необходимое ПО

- **Docker Desktop** (для Windows/Mac) или **Docker Engine** (для Linux)
- **Docker Compose** v2.0+
- **Node.js** 20+ (только для локальной разработки)
- **Git** (для клонирования репозитория)

### Проверка установки Docker

```bash
# Проверить версию Docker
docker --version
# Должно быть: Docker version 20.10+ или выше

# Проверить версию Docker Compose
docker compose version
# Должно быть: Docker Compose version v2.0+ или выше

# Проверить что Docker запущен
docker ps
# Должен вернуть список контейнеров (может быть пустым)
```

---

## 🚀 Быстрый старт

### 1. Подготовка environment файла

Создайте `.env.staging` файл на основе `.env.example`:

```bash
# Копирование примера
cp .env.example .env.staging

# Редактирование (укажите реальные значения)
# Windows PowerShell:
notepad .env.staging

# Linux/Mac:
nano .env.staging
```

Минимальная конфигурация для staging:

```env
# Staging Configuration
NODE_ENV=production
PUBLIC_SITE_URL=http://localhost:3000

# Analytics (можно использовать тестовые значения)
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_YM_ID=XXXXXXXXX

# Bitrix24 (опционально для staging)
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/test-webhook/

# Contact Info
PUBLIC_SITE_PHONE=+7 (905) 577-33-87
PUBLIC_SITE_EMAIL=info@zerodolg.ru
```

### 2. Запуск staging сервера

```bash
# Сборка и запуск контейнеров
docker compose up -d --build

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f zerodolg-web
```

### 3. Проверка доступности

Откройте браузер и перейдите по адресам:

- **Основной сайт**: http://localhost:3000
- **Health check**: http://localhost:3000/health
- **Lighthouse CI**: http://localhost:9001 (для performance тестов)

### 4. Остановка сервера

```bash
# Остановить контейнеры
docker compose down

# Остановить и удалить volumes
docker compose down -v

# Полная очистка (включая образы)
docker compose down --rmi all -v
```

---

## 🧪 Тестирование

### 1. ✅ Базовые проверки сайта

#### Проверка доступности страниц

```bash
# Health check
curl http://localhost:3000/health
# Ожидается: "healthy"

# Главная страница
curl -I http://localhost:3000/
# Ожидается: HTTP/1.1 200 OK

# Проверка robots.txt
curl http://localhost:3000/robots.txt

# Проверка sitemap.xml
curl http://localhost:3000/sitemap.xml
```

#### Ручная проверка в браузере

**Обязательные страницы:**

- ✅ Главная страница (/)
- ✅ Реструктуризация долгов (/restrukturizaciya-dolgov)
- ✅ Блог (/blog)
- ✅ Отдельная статья блога (/blog/[slug])
- ✅ Privacy Policy (/privacy)
- ✅ Terms of Service (/terms)

**Что проверять:**

- ✅ Страницы загружаются без ошибок
- ✅ Нет ошибок в консоли браузера (F12 → Console)
- ✅ Изображения загружаются корректно
- ✅ Навигация работает
- ✅ Мобильное меню открывается (тестировать в responsive режиме)

### 2. 📊 Performance Testing (Lighthouse)

#### Вариант A: Через Chrome DevTools

1. Откройте http://localhost:3000 в Chrome
2. Нажмите F12 (Developer Tools)
3. Перейдите на вкладку **Lighthouse**
4. Настройки:
   - ✅ Mode: Navigation
   - ✅ Device: Desktop и Mobile (тестировать оба)
   - ✅ Categories: All
5. Нажмите **Analyze page load**

**Целевые показатели:**

- Performance: **>90**
- Accessibility: **>95**
- Best Practices: **>95**
- SEO: **>95**

#### Вариант B: Через Lighthouse CI (автоматизированно)

```bash
# Установка Lighthouse CI глобально
npm install -g @lhci/cli

# Запуск теста для главной страницы
lhci autorun --collect.url=http://localhost:3000

# Запуск для нескольких страниц
lhci autorun \
  --collect.url=http://localhost:3000 \
  --collect.url=http://localhost:3000/blog \
  --collect.url=http://localhost:3000/restrukturizaciya-dolgov
```

#### Вариант C: Использование встроенного Lighthouse контейнера

Lighthouse CI сервер доступен по адресу: http://localhost:9001

Настройте `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://zerodolg-web/",
        "http://zerodolg-web/blog",
        "http://zerodolg-web/restrukturizaciya-dolgov"
      ],
      "numberOfRuns": 3
    },
    "upload": {
      "target": "lhci",
      "serverBaseUrl": "http://localhost:9001"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

### 3. ♿ Accessibility Testing

#### Автоматизированная проверка с axe DevTools

1. Установите
   [axe DevTools Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
2. Откройте http://localhost:3000
3. F12 → вкладка **axe DevTools**
4. Нажмите **Scan ALL of my page**

**Что проверять:**

- ✅ Нет Critical issues
- ✅ Нет Serious issues
- ⚠️ Moderate/Minor issues - оценить и исправить при возможности

#### Ручная проверка с клавиатурой

**Keyboard Navigation:**

- ✅ Tab - переход по интерактивным элементам
- ✅ Enter/Space - активация кнопок/ссылок
- ✅ Esc - закрытие модальных окон
- ✅ Arrow keys - навигация в меню/формах

**Что проверять:**

- ✅ Focus indicator виден на всех элементах
- ✅ Можно добраться до всех интерактивных элементов
- ✅ Логический порядок tab-навигации
- ✅ Skip links работают (если есть)

#### Screen Reader Testing (опционально)

**Windows:**

- NVDA (бесплатно): https://www.nvaccess.org/download/

**Mac:**

- VoiceOver (встроено): Cmd + F5

**Что тестировать:**

- ✅ Заголовки страниц читаются корректно
- ✅ Альтернативный текст для изображений
- ✅ ARIA labels для интерактивных элементов
- ✅ Формы с правильными labels

### 4. 🔍 SEO Validation

#### Meta Tags

Проверьте через DevTools или View Source:

```bash
# Просмотр HTML главной страницы
curl http://localhost:3000 | grep -E "<title>|<meta"
```

**Что проверять:**

- ✅ `<title>` уникален на каждой странице (50-60 символов)
- ✅ `<meta name="description">` уникален (150-160 символов)
- ✅ Open Graph tags (`og:title`, `og:description`, `og:image`)
- ✅ Twitter Card tags
- ✅ Canonical URL

#### Structured Data (Schema.org)

Проверка через
[Google Rich Results Test](https://search.google.com/test/rich-results):

1. Откройте https://search.google.com/test/rich-results
2. Введите `http://localhost:3000` или вставьте HTML код
3. Проверьте результаты

**Или через командную строку:**

```bash
# Извлечение JSON-LD из страницы
curl http://localhost:3000 | grep -A 50 'application/ld+json'
```

**Что проверять:**

- ✅ Organization schema присутствует
- ✅ Review schema на страницах с отзывами
- ✅ Breadcrumb schema
- ✅ Нет ошибок валидации

### 5. 📱 Responsive Design Testing

#### DevTools Responsive Mode

1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Тестировать на:
   - **Mobile**: iPhone 12 Pro (390x844)
   - **Mobile**: Samsung Galaxy S20 (360x800)
   - **Tablet**: iPad (768x1024)
   - **Desktop**: 1920x1080

**Что проверять:**

- ✅ Контент читаем на всех размерах
- ✅ Нет горизонтальной прокрутки
- ✅ Кнопки достаточно большие для тапа (min 44x44px)
- ✅ Мобильное меню работает корректно
- ✅ Изображения масштабируются

#### BrowserStack (опционально)

Если у вас есть доступ к BrowserStack:

1. Откройте https://www.browserstack.com/live
2. Настройте локальное тестирование
3. Тестируйте на реальных устройствах

### 6. 🔒 Security Testing

#### Security Headers

```bash
# Проверка security headers
curl -I http://localhost:3000

# Ожидаемые headers:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Content-Security-Policy: ...
# Referrer-Policy: strict-origin-when-cross-origin
```

#### SSL/TLS (для production)

На staging с HTTP это не применимо, но на production:

```bash
# Проверка SSL certificate
openssl s_client -connect zerodolg.ru:443 -servername zerodolg.ru

# Или через онлайн сервис:
# https://www.ssllabs.com/ssltest/
```

### 7. 📋 Forms Testing

#### Тестирование контактных форм

**Позитивные сценарии:**

- ✅ Заполнить форму валидными данными
- ✅ Отправить форму
- ✅ Проверить success message
- ✅ Проверить что данные дошли до Bitrix24 (если настроено)

**Негативные сценарии:**

- ✅ Отправить пустую форму → должна быть валидация
- ✅ Ввести невалидный email → должна быть ошибка
- ✅ Ввести невалидный телефон → должна быть ошибка
- ✅ Превысить лимит символов → должна быть ошибка

**Accessibility форм:**

- ✅ Labels связаны с inputs
- ✅ Ошибки валидации анонсируются screen reader
- ✅ Required поля помечены `aria-required`
- ✅ Можно заполнить форму только с клавиатуры

### 8. 🔗 Links Testing

#### Проверка на битые ссылки

```bash
# Установка linkchecker (если нужно)
# pip install linkchecker

# Проверка всех ссылок на сайте
linkchecker http://localhost:3000 --check-extern
```

**Или используйте онлайн инструменты:**

- [Broken Link Checker](https://www.brokenlinkcheck.com/)
- [W3C Link Checker](https://validator.w3.org/checklink)

### 9. 🌐 Cross-Browser Testing

#### Desktop Browsers

**Рекомендуется тестировать:**

- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions) - только на Mac
- ✅ Edge (latest 2 versions)

**Что проверять:**

- ✅ Основная функциональность работает
- ✅ Визуальные различия приемлемы
- ✅ Нет JavaScript ошибок в консоли

#### Mobile Browsers

**Рекомендуется тестировать:**

- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Samsung Internet

**Эмуляция через DevTools или BrowserStack**

---

## 📊 Доступные проверки на Staging

### ✅ Можно полноценно протестировать:

1. **Performance & Core Web Vitals**
   - Lighthouse scores
   - Bundle sizes
   - Load times
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

2. **SEO**
   - Meta tags
   - Structured data
   - Sitemap
   - Robots.txt
   - Canonical URLs
   - Internal links

3. **Accessibility (WCAG 2.2)**
   - Keyboard navigation
   - Screen reader support
   - Color contrast
   - Focus indicators
   - ARIA attributes

4. **Responsive Design**
   - Mobile layouts
   - Tablet layouts
   - Desktop layouts
   - Touch targets

5. **Security Headers**
   - CSP
   - X-Frame-Options
   - X-Content-Type-Options
   - etc.

6. **Forms**
   - Validation
   - UX
   - Accessibility
   - (API endpoints могут не работать без backend)

7. **Cross-Browser Compatibility**
   - Visual regression
   - Functionality
   - Performance

### ⚠️ Частично можно протестировать:

1. **Analytics**
   - ✅ Скрипты загружаются
   - ✅ События отправляются (можно увидеть в Network tab)
   - ⚠️ Данные могут не попадать в реальные GA4/YM (если используются production
     IDs)

2. **Bitrix24 Integration**
   - ✅ API calls происходят
   - ⚠️ Могут быть CORS ошибки если webhook не настроен для localhost
   - **Рекомендация**: Создать test webhook в Bitrix24

3. **Email Notifications**
   - ⚠️ Требуется настройка SMTP на staging
   - Можно использовать [MailHog](https://github.com/mailhog/MailHog) для
     тестирования

### ❌ Не можем протестировать на локальном staging:

1. **SSL/TLS** (staging на HTTP)
   - Используйте production-like staging с доменом и SSL

2. **CDN Performance**
   - Нет CDN на локальном staging

3. **Production Server Configuration**
   - Требуется реальный сервер

4. **Real User Monitoring (RUM)**
   - Требуются реальные пользователи

---

## 🛠️ Troubleshooting

### Проблема: Контейнер не запускается

```bash
# Проверить логи
docker compose logs zerodolg-web

# Проверить что порт 3000 свободен
# Windows PowerShell:
Get-NetTCPConnection -LocalPort 3000

# Linux/Mac:
lsof -i :3000

# Если порт занят, измените в docker-compose.yml:
ports:
  - "3001:80"  # Изменить на другой порт
```

### Проблема: Build падает с ошибкой

```bash
# Полная очистка Docker cache
docker builder prune -a

# Пересборка без cache
docker compose build --no-cache

# Проверка что .env файлы на месте
ls -la .env*
```

### Проблема: Не работают формы

1. Проверьте что API endpoints доступны:

   ```bash
   curl -X POST http://localhost:3000/api/form \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com"}'
   ```

2. Проверьте BITRIX24_WEBHOOK_URL в .env.staging

3. Проверьте логи nginx:
   ```bash
   docker compose logs zerodolg-web | grep api
   ```

### Проблема: Lighthouse не работает

```bash
# Перезапустить Lighthouse контейнер
docker compose restart lighthouse

# Проверить логи
docker compose logs lighthouse

# Проверить что порт 9001 доступен
curl http://localhost:9001
```

### Проблема: Медленная работа на Windows

Docker Desktop на Windows может быть медленнее. Рекомендации:

1. Используйте WSL 2 backend (Settings → General → Use WSL 2)
2. Храните проект в WSL filesystem, а не в /mnt/c/
3. Увеличьте ресурсы Docker (Settings → Resources)

---

## 📈 Рекомендуемый порядок тестирования

### Чек-лист для staging проверки:

```markdown
- [ ] 1. Запустить Docker containers
- [ ] 2. Проверить health endpoint
- [ ] 3. Визуальная проверка всех основных страниц
- [ ] 4. Lighthouse audit (Desktop & Mobile)
- [ ] 5. Accessibility audit с axe DevTools
- [ ] 6. Keyboard navigation на всех страницах
- [ ] 7. Responsive design на разных размерах экрана
- [ ] 8. Тестирование форм (positive & negative cases)
- [ ] 9. Проверка SEO meta tags и structured data
- [ ] 10. Проверка security headers
- [ ] 11. Cross-browser тестирование
- [ ] 12. Проверка на битые ссылки
- [ ] 13. Проверка логов на ошибки
- [ ] 14. Остановить containers
```

---

## 🎯 Следующие шаги после успешного staging тестирования

1. ✅ Документировать найденные проблемы
2. ✅ Исправить критические issues
3. ✅ Повторить staging тестирование
4. ✅ Обновить PRODUCTION_CHECKLIST.md
5. ✅ Подготовить deployment plan
6. ✅ Deploy to production

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте [Docker Documentation](https://docs.docker.com/)
2. Проверьте логи: `docker compose logs -f`
3. Создайте issue в репозитории проекта

---

**Last Updated**: 2025-10-02  
**Maintainer**: AI Assistant  
**Project**: ZeroDolg Astro - Corporate Website
