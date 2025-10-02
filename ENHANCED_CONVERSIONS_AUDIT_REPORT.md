# 📊 Аудит Enhanced Conversions для zerodolg.ru

**Дата проверки:** 02.10.2025  
**Проверяющий:** AI Assistant  
**GA4 Property ID:** G-BDDN306E94

---

## ✅ Статус настроек в Google Analytics 4

### Проверка по скриншотам

Вы показали настройки в GA4:

**✅ НАСТРОЙКА ПРАВИЛЬНАЯ:**

1. ✅ **Функция включена** - "Использовать данные, предоставленные
   пользователями" активирована
2. ✅ **Автоматический сбор включен** - отмечены все три типа данных:
   - Электронная почта
   - Номер телефона
   - Имя и адрес
3. ✅ **Опция для добавления фрагмента кода** доступна для ручной настройки
4. ✅ **Exclusions (исключения)** настроены для CSS-селекторов

---

## 🔍 Анализ кода проекта

### ✅ Что реализовано ПРАВИЛЬНО:

#### 1. Analytics Manager с поддержкой Enhanced Conversions

**Файл:** `src/shared/lib/analytics-manager.ts`

```typescript
// ✅ Реализована поддержка Enhanced Conversions
private enhancedConversionsEnabled = false;

// ✅ Проверка поддержки WebCrypto API
this.enhancedConversionsEnabled = isWebCryptoSupported() && isSecureContext();

// ✅ Хеширование данных пользователя
if (user_data && this.enhancedConversionsEnabled) {
  hashedUserData = await hashUserData(user_data);
}

// ✅ Передача user_data в GA4
if (userData && this.enhancedConversionsEnabled) {
  eventParams['user_data'] = userData;
}
```

#### 2. Утилиты хеширования SHA-256

**Файл:** `src/shared/lib/hash-utils.ts`

```typescript
// ✅ Правильная реализация SHA-256
export async function hashSHA256(data: string): Promise<string> {
  const normalized = data.toLowerCase().trim();
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return hashHex;
}

// ✅ Нормализация телефонов в формат E.164
if (normalized.startsWith('8')) {
  normalized = `+7${normalized.slice(1)}`;
}
```

#### 3. Интеграция в формы

**Файл:** `src/islands/forms/FormEnhancedFinal.tsx`

```typescript
// ✅ Сбор данных пользователя при отправке формы
const userData = {
  email: formData['email'] ?? '',
  phone: formData['phone'] ?? formData['tel'] ?? '',
  firstName: formData['name'] ?? formData['firstName'] ?? '',
  lastName: formData['lastName'] ?? '',
  city: formData['city'] ?? '',
  country: 'RU',
};

// ✅ Передача данных в Analytics Manager
analytics.trackConversion({
  transaction_id: result.analytics.transaction_id,
  value: result.analytics.value,
  currency: result.analytics.currency || 'RUB',
  form_type: result.analytics.form_type,
  lead_id: result.leadId,
  user_data: userData, // 👈 Данные пользователя для Enhanced Conversions
});
```

---

## ⚠️ Что нужно УЛУЧШИТЬ

### 1. 🔴 КРИТИЧНО: Согласие пользователя (GDPR)

#### Проблема:

Автоматический сбор данных в GA4 включен, но **НЕ ПРОВЕРЯЕТСЯ согласие
пользователя** перед отправкой персональных данных для Enhanced Conversions.

#### Текущее состояние:

- ✅ В формах есть чекбокс согласия на обработку персональных данных
- ✅ Есть Privacy Policy (страница `/privacy`)
- ❌ Но согласие НЕ проверяется перед отправкой данных в GA4

#### Что нужно сделать:

**1. Обновить Privacy Policy:**

Добавить в файл `src/pages/privacy.astro` упоминание о Enhanced Conversions:

```astro
<h3>Использование Google Analytics 4</h3>
<p>
  Мы используем Google Analytics 4 для анализа посещаемости сайта и улучшения
  качества услуг. При вашем согласии мы передаем в Google Analytics хешированные
  (зашифрованные) данные:
</p>
<ul>
  <li>Email (в зашифрованном виде)</li>
  <li>Номер телефона (в зашифрованном виде)</li>
  <li>Имя и фамилия (в зашифрованном виде)</li>
</ul>
<p>
  Эти данные используются только для улучшения качества аналитики и не
  передаются третьим лицам в открытом виде. Вы можете отозвать согласие в любой
  момент.
</p>
```

**2. Создать Cookie Consent баннер:**

Создайте компонент для получения согласия:

```typescript
// src/shared/lib/consent-manager.ts

export class ConsentManager {
  private static CONSENT_KEY = 'user_consent';

  static hasAnalyticsConsent(): boolean {
    const consent = localStorage.getItem(this.CONSENT_KEY);
    return consent === 'granted';
  }

  static grantConsent(): void {
    localStorage.setItem(this.CONSENT_KEY, 'granted');

    // Обновляем согласие в GA4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied', // Рекламные cookies отключены
      });
    }
  }

  static denyConsent(): void {
    localStorage.setItem(this.CONSENT_KEY, 'denied');

    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  }
}
```

**3. Обновить Analytics Manager:**

```typescript
// src/shared/lib/analytics-manager.ts

import { ConsentManager } from './consent-manager';

async trackConversion(data: ConversionData): Promise<void> {
  // ✅ ПРОВЕРЯЕМ СОГЛАСИЕ ПЕРЕД ОТПРАВКОЙ
  if (!ConsentManager.hasAnalyticsConsent()) {
    this.log('Conversion tracking skipped: no user consent');
    return;
  }

  const { user_data } = data;
  let hashedUserData: HashedUserData | undefined;

  // Хешируем данные только если есть согласие
  if (user_data && this.enhancedConversionsEnabled) {
    hashedUserData = await hashUserData(user_data);
  }

  // ... остальной код
}
```

**4. Создать Cookie Banner UI компонент:**

```typescript
// src/shared/ui/CookieBanner.tsx

import { useState, useEffect } from 'preact/hooks';
import { ConsentManager } from '../lib/consent-manager';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Показываем баннер, если согласие еще не получено
    const hasConsent = localStorage.getItem('user_consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    ConsentManager.grantConsent();
    setIsVisible(false);
  };

  const handleDecline = () => {
    ConsentManager.denyConsent();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm">
            Мы используем cookies и собираем обезличенные данные для улучшения работы сайта.
            <a href="/privacy" className="underline ml-1">Подробнее</a>
          </p>
        </div>
        <div className="flex gap-4 ml-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Отклонить
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
```

**5. Добавить баннер в Layout:**

```astro
<!-- src/app/layouts/Layout.astro -->
<body>
  <slot />

  <!-- Cookie Consent Banner -->
  <CookieBanner client:load />

  <script is:inline defer src='/js/service-worker-register.js'></script>
  <!-- ... остальной код -->
</body>
```

---

### 2. ⚠️ Инициализация GA4 с Consent Mode

#### Проблема:

GA4 инициализируется без учета Consent Mode v2

#### Решение:

Обновите `src/features/analytics/analytics.ts`:

```typescript
// Инициализация Google Analytics с Consent Mode
function initGoogleAnalytics(): void {
  if (!CONFIG.GOOGLE_ANALYTICS_ID) {
    debugLog('Google Analytics ID not configured');
    return;
  }

  // ✅ СНАЧАЛА устанавливаем значения по умолчанию (denied)
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]): void {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500, // Ждем 500ms перед отправкой
  });

  // Загрузка gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ANALYTICS_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', CONFIG.GOOGLE_ANALYTICS_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  debugLog('Google Analytics initialized with Consent Mode');
}
```

---

### 3. 🟡 Автоматический сбор в GA4 vs Ручная реализация

#### Текущая ситуация:

- ✅ В GA4 включен **автоматический сбор** (ищет поля email, phone, name
  автоматически)
- ✅ В коде реализована **ручная передача** через `user_data`

#### Рекомендация: **Используйте РУЧНУЮ реализацию**

**Почему?**

1. **Больше контроля** - вы точно знаете, какие данные отправляются
2. **Лучше для GDPR** - можете легко отключить отправку при отсутствии согласия
3. **Более надежно** - не зависит от структуры HTML форм

**Что сделать:**

1. **Оставьте ручную реализацию в коде** ✅
2. **Отключите автоматический сбор в GA4** (необязательно, но рекомендуется для
   большей прозрачности)

Если хотите отключить автоматический сбор:

1. GA4 → Admin → Data Streams → Ваш поток
2. "Использовать данные, предоставленные пользователями"
3. **Снимите галочки** с "Автоматически определять данные"
4. Используйте только **"Добавить фрагмент кода на сайт"** (ваша ручная
   реализация)

---

### 4. 🟢 Проверка CSS-селекторов (Exclusions)

#### Что это:

В настройках GA4 есть раздел "Exclusions" для указания CSS-селекторов полей,
которые **НЕ нужно** собирать автоматически.

#### Рекомендация:

Если используете автоматический сбор, добавьте исключения для чувствительных
полей:

```
input[name="password"]
input[type="password"]
.sensitive-field
[data-no-analytics]
```

Но если используете только ручную реализацию, это не критично.

---

## 📋 Чек-лист действий

### Обязательные (КРИТИЧНО):

- [ ] **1. Создать Cookie Consent баннер** (`src/shared/ui/CookieBanner.tsx`)
- [ ] **2. Создать Consent Manager** (`src/shared/lib/consent-manager.ts`)
- [ ] **3. Обновить Privacy Policy** - добавить информацию о Enhanced
      Conversions
- [ ] **4. Интегрировать проверку согласия в Analytics Manager**
- [ ] **5. Добавить Consent Mode v2 в инициализацию GA4**
- [ ] **6. Протестировать работу с согласием и без**

### Рекомендуемые:

- [ ] **7. Отключить автоматический сбор в GA4** (оставить только ручную
      реализацию)
- [ ] **8. Добавить exclusions для чувствительных полей**
- [ ] **9. Добавить логирование для отладки Enhanced Conversions**
- [ ] **10. Создать документацию для команды**

### Проверка после внедрения:

- [ ] **11. Тест через Google Tag Assistant**
- [ ] **12. Проверка в GA4 DebugView**
- [ ] **13. Проверка Network запросов (параметр `&em=` должен быть
      хешированным)**
- [ ] **14. Юридическая проверка соответствия GDPR/152-ФЗ**

---

## 🎯 Итоговые рекомендации

### ✅ Хорошие новости:

1. **Техническая реализация отличная** - код правильно хеширует данные и
   передает в GA4
2. **Enhanced Conversions правильно включены в GA4**
3. **Утилиты хеширования написаны корректно** (SHA-256, нормализация)
4. **Формы собирают правильные данные**

### ⚠️ Требует внимания:

1. **КРИТИЧНО: Нет проверки согласия пользователя** перед отправкой персональных
   данных
2. **Нужен Cookie Consent баннер** для соответствия GDPR/152-ФЗ
3. **Нужен Consent Mode v2** для правильной работы с Google
4. **Privacy Policy нужно обновить** с упоминанием Enhanced Conversions

---

## 📞 Дополнительная помощь

Если нужна помощь с реализацией:

1. **Создать Cookie Banner** - могу предоставить полный готовый компонент
2. **Настроить Consent Mode** - пошаговая инструкция
3. **Тестирование** - помочь с проверкой через DevTools
4. **Юридическая консультация** - рекомендую проконсультироваться с юристом по
   GDPR

---

## 🔗 Полезные ссылки

- [Google: Enhanced Conversions](https://support.google.com/analytics/answer/9888656)
- [Google: Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent)
- [152-ФЗ "О персональных данных"](http://www.consultant.ru/document/cons_doc_LAW_61801/)
- [GDPR для веб-сайтов](https://gdpr.eu/)

---

**Вывод:**  
Настройка Enhanced Conversions в GA4 **технически правильная**, но **требует
добавления механизма получения согласия пользователя** для полного соответствия
законодательству о персональных данных.

Хотите, чтобы я создал готовые компоненты Cookie Banner и Consent Manager прямо
сейчас?
