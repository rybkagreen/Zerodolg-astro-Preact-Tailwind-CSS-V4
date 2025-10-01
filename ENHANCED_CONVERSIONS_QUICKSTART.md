# 🚀 Enhanced Conversions - Быстрый старт

## ✅ Что уже сделано в коде

### 1. Утилиты хеширования (`src/shared/lib/hash-utils.ts`)

- ✅ SHA-256 хеширование данных
- ✅ Нормализация email, телефона, имени
- ✅ Проверка поддержки Web Crypto API
- ✅ Fallback для старых браузеров

### 2. Analytics Manager (`src/shared/lib/analytics-manager.ts`)

- ✅ Поддержка Enhanced Conversions в GA4
- ✅ Автоматическое хеширование user_data
- ✅ Отправка конверсий с хешированными данными
- ✅ Проверка на дубликаты событий

### 3. Форма (`src/islands/forms/FormEnhancedFinal.tsx`)

- ✅ Сбор данных пользователя (email, phone, name)
- ✅ Передача user_data при конверсии
- ✅ Автоматическая отправка в Analytics Manager

---

## 📋 Шаги настройки (5 минут)

### Шаг 1: Включить Enhanced Conversions в GA4

1. Откройте [Google Analytics 4](https://analytics.google.com/)
2. **Admin** → **Data Streams** → выберите веб-поток
3. Нажмите **Configure tag settings**
4. Найдите **Enhanced conversions** → включите переключатель ✓

### Шаг 2: Настроить события конверсии

1. **Admin** → **Events**
2. Найдите событие `purchase` (или создайте)
3. Отметьте **Mark as conversion** ✓
4. Дополнительно настройте:
   - `form_submit_success`
   - `phone_click`
   - `consultation_request`

### Шаг 3: Проверить настройки счетчиков

Убедитесь, что в `.env` файле заполнены:

```env
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_YM_ID=103604926
```

### Шаг 4: Проверить работу (Debug Mode)

#### Chrome DevTools:

1. Откройте DevTools (F12) → **Network**
2. Фильтр: `google-analytics.com/g/collect`
3. Заполните и отправьте форму
4. Проверьте параметр `&em=` (хешированный email)

#### GA4 DebugView:

1. GA4 → **Admin** → **DebugView**
2. Откройте сайт в режиме отладки
3. Отправьте форму
4. Проверьте события в реальном времени

---

## 🔧 Техническая проверка

### Проверка поддержки Web Crypto API

Откройте консоль браузера на вашем сайте и выполните:

```javascript
console.log(
  'Web Crypto supported:',
  typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined'
);
console.log('Secure context:', window.isSecureContext);
console.log(
  'Enhanced Conversions enabled:',
  analyticsManager.isEnhancedConversionsEnabled()
);
```

✅ **Все должно быть `true`** (на production с HTTPS)

### Тест хеширования

```javascript
import { hashEmail, hashPhone } from './src/shared/lib/hash-utils';

// Тестируем хеширование
const testEmail = await hashEmail('test@example.com');
console.log('Hashed email:', testEmail);

const testPhone = await hashPhone('8 (900) 123-45-67');
console.log('Hashed phone:', testPhone);
```

---

## 📊 Передаваемые данные

### Автоматически собираются из формы:

| Поле формы             | Параметр user_data   | Хешируется         |
| ---------------------- | -------------------- | ------------------ |
| `email`                | `email`              | ✅ SHA-256         |
| `phone` или `tel`      | `phone_number`       | ✅ SHA-256         |
| `name` или `firstName` | `address.first_name` | ✅ SHA-256         |
| `lastName`             | `address.last_name`  | ✅ SHA-256         |
| `city`                 | `address.city`       | ✅ SHA-256         |
| Константа              | `address.country`    | ❌ (ISO код: 'RU') |

### Пример передаваемых данных (до хеширования):

```javascript
{
  email: "ivan@mail.ru",
  phone: "+79001234567",
  firstName: "Иван",
  lastName: "Иванов",
  city: "Москва",
  country: "RU"
}
```

### После хеширования:

```javascript
{
  email: "a8f5f167f44f4964e6c998dee827110c284e52f7d5c1234567890abcdef12345",
  phone_number: "f1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
  address: {
    first_name: "c1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    last_name: "d1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    city: "e1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    country: "RU"
  }
}
```

---

## 🎯 Отслеживание конверсий

### Автоматически отправляется при успешной форме:

```typescript
analytics.trackConversion({
  transaction_id: 'lead_1234567890',
  value: 150000, // Стоимость лида
  currency: 'RUB',
  form_type: 'bankruptcy', // Тип формы
  lead_id: 'CRM_ID_12345', // ID из CRM
  user_data: {
    // Данные пользователя (автоматически хешируются)
    email: 'user@example.com',
    phone: '+79001234567',
    firstName: 'Иван',
    country: 'RU',
  },
});
```

### Стоимость услуг (настроено в коде):

```javascript
SERVICE_VALUES = {
  bankruptcy: 150000, // Полное банкротство
  restructuring: 80000, // Реструктуризация
  consultation: 5000, // Консультация
  callback: 2000, // Обратный звонок
  calculator: 3000, // Калькулятор
  general: 10000, // Общая заявка
};
```

---

## 🐛 Troubleshooting

### События не отправляются

**Проверьте:**

- ✅ Сайт работает по HTTPS (Web Crypto API требует)
- ✅ GA4 Measurement ID правильный в `.env`
- ✅ Скрипты GA4 загружаются (не блокируются AdBlock)
- ✅ Консоль браузера: ошибок нет

**Решение:**

```javascript
// Проверка в консоли
console.log('Analytics initialized:', typeof window.gtag !== 'undefined');
console.log('GA ID:', import.meta.env.PUBLIC_GA_ID);
```

### Enhanced Conversions отключены

**Ошибка в консоли:**

```
Enhanced Conversions disabled: Web Crypto API not supported or not in secure context
```

**Причины:**

- ❌ Сайт работает по HTTP (должен HTTPS)
- ❌ Браузер не поддерживает Web Crypto API (очень старый)

**Решение:**

- Используйте HTTPS на production
- На localhost всё работает (localhost считается secure context)

### Данные не хешируются

**Проверка:**

```javascript
import { isWebCryptoSupported, isSecureContext } from '@/shared/lib/hash-utils';

console.log('Web Crypto:', isWebCryptoSupported());
console.log('Secure:', isSecureContext());
```

**Если `false`:**

- Переключитесь на HTTPS
- Проверьте браузер (должен быть современный)

---

## 📈 Мониторинг после внедрения

### Через 24-48 часов проверьте:

1. **GA4 → Conversions**
   - Количество конверсий
   - Conversion rate

2. **GA4 → Attribution**
   - Модели атрибуции
   - Качество данных

3. **Google Ads** (если используется)
   - Импорт конверсий
   - Matching rate

### Ожидаемые улучшения:

- ✅ +10-30% восстановленных конверсий
- ✅ Лучшая атрибуция источников
- ✅ Более точные данные для оптимизации рекламы

---

## 📚 Полезные ссылки

- [Полное руководство](./GA4_ENHANCED_CONVERSIONS_SETUP.md)
- [Инструкция по Яндекс.Метрике](./YANDEX_METRIKA_GOALS_SETUP.md)
- [Аудит аналитики](./ANALYTICS_AUDIT_REPORT.md)

---

## ✅ Финальный чек-лист

- [ ] Enhanced Conversions включены в GA4
- [ ] События помечены как конверсии
- [ ] `.env` файл настроен (GA_ID, YM_ID)
- [ ] Сайт работает по HTTPS
- [ ] Тест в Chrome DevTools пройден
- [ ] GA4 DebugView показывает события
- [ ] Privacy Policy обновлена (упоминание передачи данных)
- [ ] Мониторинг настроен

---

**Дата создания:** 2025  
**Проект:** ZeroDolg Landing  
**Время внедрения:** ~5 минут

✨ **Готово! Enhanced Conversions работают!**
