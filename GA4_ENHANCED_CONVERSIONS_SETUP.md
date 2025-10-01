# Настройка Enhanced Conversions в Google Analytics 4

## Оглавление

- [Что такое Enhanced Conversions](#что-такое-enhanced-conversions)
- [Преимущества использования](#преимущества-использования)
- [Требования и ограничения](#требования-и-ограничения)
- [Настройка в интерфейсе GA4](#настройка-в-интерфейсе-ga4)
- [Техническая реализация](#техническая-реализация)
- [Тестирование](#тестирование)
- [Проверка работоспособности](#проверка-работоспособности)
- [Troubleshooting](#troubleshooting)

---

## Что такое Enhanced Conversions

**Enhanced Conversions** (расширенные конверсии) — это функция Google Analytics
4, которая позволяет передавать **хешированные данные первой стороны**
(first-party data) о пользователях для:

- Улучшения точности измерения конверсий
- Повышения качества атрибуции
- Компенсации потери данных из-за ограничений cookies и браузерных политик
- Лучшей связи онлайн и офлайн конверсий

### Какие данные передаются

Данные передаются в **хешированном виде** (SHA-256):

- Email
- Телефон
- Имя (first_name)
- Фамилия (last_name)
- Адрес (address, city, region, postal_code, country)

---

## Преимущества использования

1. **Более точная атрибуция** — GA4 может связать конверсии с правильными
   источниками трафика
2. **Восстановление потерянных конверсий** — за счет сопоставления данных на
   серверах Google
3. **Лучшая оптимизация рекламных кампаний** — особенно в Google Ads
4. **Соответствие требованиям конфиденциальности** — данные хешируются на
   клиенте перед отправкой
5. **Работа в условиях ограничений cookies** — менее зависим от браузерных
   cookies

---

## Требования и ограничения

### Требования:

- ✅ Активный аккаунт Google Analytics 4
- ✅ Доступ к редактированию настроек аккаунта GA4
- ✅ Согласие пользователя на обработку данных (GDPR, privacy policy)
- ✅ Легальное основание для сбора персональных данных

### Ограничения:

- ❌ Работает только для веб-событий (не для приложений)
- ❌ Требует хеширования данных на стороне клиента
- ❌ Необходимо явное согласие пользователя в ЕС

### Важно для проекта ZeroDolg:

- Юридические услуги требуют особой осторожности с персональными данными
- Необходимо четкое информирование пользователей
- Обновите Privacy Policy с упоминанием передачи хешированных данных в GA4

---

## Настройка в интерфейсе GA4

### Шаг 1: Включение Enhanced Conversions

1. Откройте [Google Analytics 4](https://analytics.google.com/)
2. Выберите нужный аккаунт и ресурс (property)
3. Перейдите в **Admin** (левый нижний угол, иконка шестеренки)
4. В колонке **Property** выберите **Data Streams**
5. Выберите ваш веб-поток данных
6. Прокрутите вниз до раздела **Enhanced measurement**
7. Нажмите на **Configure tag settings**
8. Найдите **Enhanced conversions** и включите переключатель

### Шаг 2: Настройка событий конверсии

1. В меню Admin → Property → **Events**
2. Найдите событие `form_submit_success` (или создайте новое)
3. Отметьте его как **conversion event** (галочка "Mark as conversion")
4. Повторите для других важных событий:
   - `phone_click`
   - `consultation_request`
   - `calculator_complete`

### Шаг 3: Проверка настроек тега

1. В **Admin → Property → Data Streams** → выберите поток
2. Нажмите **View tag instructions**
3. Проверьте, что **Google tag** настроен правильно
4. Убедитесь, что указан корректный **Measurement ID** (G-XXXXXXXXXX)

---

## Техническая реализация

### В проекте ZeroDolg уже реализовано:

1. **Analytics Manager** (`src/shared/lib/analytics-manager.ts`) - готов к
   передаче Enhanced Conversions
2. **Утилиты хеширования** - будут добавлены для SHA-256
3. **Интеграция в формы** - FormEnhancedFinal.tsx обновлен

### Что передается при конверсии:

```typescript
// Пример данных Enhanced Conversion
const enhancedConversionData = {
  email: 'hashed_email@example.com',
  phone_number: '+7XXXXXXXXXX',
  address: {
    first_name: 'Ivan',
    last_name: 'Ivanov',
    city: 'Moscow',
    country: 'RU',
  },
};
```

### Хеширование данных

Все чувствительные данные хешируются с помощью **SHA-256** перед отправкой:

```typescript
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

---

## Тестирование

### 1. Используйте Google Tag Assistant

1. Установите расширение
   [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Откройте ваш сайт и начните запись
3. Заполните и отправьте форму
4. Проверьте, что событие `form_submit_success` отправляется с параметрами
   `user_data`

### 2. Chrome DevTools

1. Откройте DevTools (F12) → **Network**
2. Фильтр: `google-analytics.com/g/collect`
3. Заполните форму и отправьте
4. Найдите запрос с параметром `&em=` (хешированный email)

### 3. GA4 DebugView

1. Включите режим отладки в коде:
   ```typescript
   window.gtag('config', 'G-XXXXXXXXXX', { debug_mode: true });
   ```
2. Откройте GA4 → **Admin → DebugView**
3. Откройте сайт в новой вкладке
4. Отправьте форму
5. Проверьте события в реальном времени

---

## Проверка работоспособности

### Через 24-48 часов после настройки:

1. **GA4 → Reports → Conversions**
   - Проверьте, что конверсии фиксируются
   - Сравните количество с предыдущим периодом

2. **GA4 → Reports → Attribution**
   - Проверьте модели атрибуции
   - Убедитесь, что Enhanced Conversions улучшают качество данных

3. **Google Ads (если используется)**
   - Проверьте импорт конверсий из GA4
   - Убедитесь, что данные передаются корректно

### Метрики для мониторинга:

- **Conversion rate** - не должен резко измениться
- **Attributed conversions** - может увеличиться за счет восстановленных
  конверсий
- **Data quality** - проверьте в GA4 → Admin → Data Quality

---

## Troubleshooting

### Проблема: События не отображаются в GA4

**Решения:**

1. Проверьте, что `gtag.js` загружается корректно
2. Убедитесь, что Measurement ID правильный
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что не блокируются запросы к google-analytics.com (AdBlock, VPN)

### Проблема: Enhanced Conversions не активированы

**Решения:**

1. Проверьте настройки в GA4 Admin → Data Streams
2. Убедитесь, что передаются хешированные данные
3. Проверьте формат данных (должен быть SHA-256 в lowercase)

### Проблема: Данные не хешируются

**Решения:**

1. Проверьте поддержку `crypto.subtle` в браузере
2. Убедитесь, что сайт работает по HTTPS (required для Web Crypto API)
3. Добавьте fallback для старых браузеров

### Проблема: GDPR/Privacy concerns

**Решения:**

1. Обновите Privacy Policy с информацией о передаче данных
2. Добавьте явное согласие пользователя перед сбором данных
3. Реализуйте механизм opt-out для пользователей
4. Проконсультируйтесь с юристом по GDPR

---

## Дополнительные ресурсы

- [Официальная документация Google: Enhanced Conversions](https://support.google.com/analytics/answer/9888656)
- [Руководство по настройке Enhanced Conversions для веб](https://support.google.com/analytics/answer/11062876)
- [GA4 - User-provided data](https://developers.google.com/analytics/devguides/collection/ga4/user-properties)
- [GDPR compliance для GA4](https://support.google.com/analytics/answer/9019185)

---

## Чек-лист финальной проверки

- [ ] Enhanced Conversions включены в GA4
- [ ] События конверсии настроены и помечены
- [ ] Данные хешируются на клиенте (SHA-256)
- [ ] Тестирование через Tag Assistant пройдено
- [ ] DebugView показывает корректные события
- [ ] Privacy Policy обновлена
- [ ] Согласие пользователя реализовано
- [ ] Мониторинг метрик настроен
- [ ] Документация обновлена для команды

---

**Дата создания:** 2025  
**Проект:** ZeroDolg Landing  
**Ответственный:** Team Analytics
