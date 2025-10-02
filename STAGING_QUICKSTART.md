# 🚀 Quick Start: Staging через Docker

## Минимальные шаги для запуска

### 1. Убедитесь что Docker установлен и запущен

```powershell
# Проверка установки
docker --version
docker compose version

# Запуск Docker Desktop (если не запущен)
# Откройте Docker Desktop из меню Пуск
```

### 2. Запустите staging сервер

```powershell
# Из корня проекта
npm run staging:up

# Или напрямую через Docker Compose
docker compose up -d --build
```

**Время сборки**: ~2-3 минуты первый раз, затем быстрее

### 3. Откройте в браузере

- 🌐 **Сайт**: http://localhost:3000
- 💚 **Health Check**: http://localhost:3000/health
- 📊 **Lighthouse CI**: http://localhost:9001

### 4. Просмотр логов (опционально)

```powershell
# Просмотр логов в реальном времени
npm run staging:logs

# Или
docker compose logs -f zerodolg-web
```

### 5. Остановка сервера

```powershell
# Остановить контейнеры
npm run staging:down

# Или с очисткой всех данных
npm run staging:clean
```

---

## ✅ Что можно протестировать на Staging

### Полноценное тестирование:

✅ **Performance (Lighthouse)**

- Откройте http://localhost:3000 в Chrome
- F12 → вкладка Lighthouse
- Запустите анализ (Desktop + Mobile)
- Целевые показатели: Performance >90, Accessibility >95

✅ **Accessibility**

- Установите
  [axe DevTools Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
- F12 → вкладка axe DevTools → Scan
- Тестируйте keyboard navigation (Tab, Enter, Esc)

✅ **Responsive Design**

- F12 → Toggle device toolbar (Ctrl+Shift+M)
- Тестируйте Mobile (iPhone 12), Tablet (iPad), Desktop (1920x1080)

✅ **SEO**

- Проверьте robots.txt: http://localhost:3000/robots.txt
- Проверьте sitemap: http://localhost:3000/sitemap.xml
- View Source → проверьте meta tags
- Google Rich Results Test: вставьте HTML код страницы

✅ **Security Headers**

```powershell
curl -I http://localhost:3000
# Проверьте X-Frame-Options, CSP, X-Content-Type-Options
```

✅ **Forms**

- Тестируйте все формы на сайте
- Positive scenarios: валидные данные
- Negative scenarios: пустые поля, невалидный email/phone

✅ **Cross-Browser**

- Откройте http://localhost:3000 в Chrome, Firefox, Edge
- Проверьте что нет ошибок в консоли

---

## 🎯 Критичные проверки перед Production

### High Priority (обязательно):

1. **Lighthouse Scores**

   ```
   Performance: >90
   Accessibility: >95
   Best Practices: >95
   SEO: >95
   ```

2. **No Console Errors**
   - F12 → Console → не должно быть красных ошибок

3. **Forms Working**
   - Валидация работает
   - Success/error messages показываются

4. **Mobile Responsive**
   - Нет горизонтальной прокрутки
   - Все элементы кликабельны (min 44x44px)

5. **SEO Basics**
   - Все страницы имеют уникальный title
   - robots.txt и sitemap.xml доступны
   - Structured data валидна

### Medium Priority (рекомендуется):

6. **Accessibility**
   - Keyboard navigation работает
   - Screen reader friendly (если есть возможность протестировать)

7. **Security Headers**
   - CSP настроен
   - X-Frame-Options, X-Content-Type-Options присутствуют

8. **Performance**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## 📋 Быстрый чек-лист

```markdown
Staging Testing Checklist:

- [ ] Staging запущен: http://localhost:3000
- [ ] Health check работает: /health
- [ ] Lighthouse Desktop: Performance >90
- [ ] Lighthouse Mobile: Performance >90
- [ ] Lighthouse: Accessibility >95
- [ ] axe DevTools: No Critical/Serious issues
- [ ] Keyboard navigation работает (Tab, Enter, Esc)
- [ ] Mobile responsive (iPhone, iPad, Desktop)
- [ ] Forms: validation и submission работают
- [ ] SEO: title, description, robots.txt, sitemap
- [ ] Security headers присутствуют
- [ ] Console: нет критичных ошибок
- [ ] Cross-browser: Chrome, Firefox, Edge работают
```

---

## 🛟 Troubleshooting

### Проблема: "Port 3000 already in use"

**Решение**:

```powershell
# Найти процесс на порту 3000
Get-NetTCPConnection -LocalPort 3000

# Или измените порт в docker-compose.yml:
# ports:
#   - "3001:80"
```

### Проблема: "Cannot connect to Docker daemon"

**Решение**:

- Запустите Docker Desktop из меню Пуск
- Дождитесь пока Docker полностью запустится (иконка в трее зеленая)

### Проблема: Build падает с ошибкой

**Решение**:

```powershell
# Очистите Docker cache
docker builder prune -a

# Пересоберите без cache
docker compose build --no-cache
docker compose up -d
```

### Проблема: Медленная работа

**Решение** (для Windows):

1. Docker Desktop → Settings → General
2. Включите "Use WSL 2 based engine"
3. Docker Desktop → Settings → Resources
4. Увеличьте Memory до 4-6 GB

---

## 📚 Детальная документация

Для подробной информации см.
**[STAGING_TESTING_GUIDE.md](./STAGING_TESTING_GUIDE.md)**

В нём описаны:

- Все доступные тесты (9 категорий)
- Автоматизированные проверки (Lighthouse CI, linkchecker)
- Screen reader testing
- BrowserStack integration
- И многое другое...

---

## 🎉 Готово!

Теперь вы можете полноценно протестировать сайт перед деплоем в production.

**Следующий шаг**: Обновите **PRODUCTION_CHECKLIST.md** на основе результатов
staging тестирования.

---

**Last Updated**: 2025-10-02  
**Project**: ZeroDolg Astro
