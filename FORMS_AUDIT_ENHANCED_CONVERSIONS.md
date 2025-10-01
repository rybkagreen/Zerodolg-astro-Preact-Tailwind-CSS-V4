# Аудит форм: Поддержка Enhanced Conversions

**Дата:** 2025  
**Проект:** ZeroDolg Landing  
**Проверка:** Все формы на сайте

---

## 📋 Executive Summary

После детальной проверки выявлено, что **Enhanced Conversions настроены только
для главных страниц**, но **НЕ работают в модальных окнах** и некоторых других
формах. Это критичная проблема, так как модальные окна — основной источник
лидов.

### ❌ Критическая проблема:

**Все модальные формы используют устаревший подход** (HTML-формы без
`FormEnhancedFinal.tsx`), что означает:

- ❌ Enhanced Conversions НЕ работают в модалках
- ❌ Данные пользователей НЕ хешируются
- ❌ user_data НЕ передается в GA4
- ❌ Теряется значительная часть данных для атрибуции

---

## ✅ Что работает правильно

### 1. **Главные страницы с FormEnhancedFinal.tsx**

Эти формы **правильно настроены** и поддерживают Enhanced Conversions:

| Страница                                    | Компонент формы                                               | Enhanced Conversions |
| ------------------------------------------- | ------------------------------------------------------------- | -------------------- |
| `/` (главная)                               | `BaseForm.astro` → `FormEnhancedFinal.tsx`                    | ✅ Работает          |
| `/bankrotstvo-s-sokhraneniyem-imushchestva` | `BaseForm.astro` → `FormEnhancedFinal.tsx`                    | ✅ Работает          |
| `/restrukturizaciya-dolgov`                 | `BaseForm.astro` → `FormEnhancedFinal.tsx`                    | ✅ Работает          |
| Hero секция                                 | `HeroForm.astro` → `BaseForm.astro` → `FormEnhancedFinal.tsx` | ✅ Работает          |
| CTA секции                                  | `CTAForm.astro` → `BaseForm.astro` → `FormEnhancedFinal.tsx`  | ✅ Работает          |

**Вывод:** Формы на страницах работают корректно через цепочку:

```
Страница → BaseForm.astro → FormEnhancedFinal.tsx (с поддержкой Enhanced Conversions)
```

---

## ❌ Что НЕ работает

### 2. **Модальные окна (КРИТИЧНО!)**

Все модальные формы используют **устаревший подход** и **НЕ поддерживают
Enhanced Conversions**:

#### `CallbackModal.astro`

- **Файл:** `src/features/modals/ui/CallbackModal.astro`
- **Проблема:** Использует HTML-форму вместо `FormEnhancedFinal.tsx`
- **Поля:** name, phone, time, message
- **Используется на страницах:**
  - `/blog/[slug]` (все статьи блога)
  - Другие страницы с кнопкой "Обратный звонок"
- **Статус:** ❌ Enhanced Conversions НЕ работают

#### `LeadMagnetsModals.astro`

**Файл:** `src/features/modals/ui/LeadMagnetsModals.astro`

Содержит **6 модальных форм**, все с проблемой:

| Модалка        | Форма ID       | Поля                                                | Enhanced Conversions |
| -------------- | -------------- | --------------------------------------------------- | -------------------- |
| Консультация   | `consultation` | name, phone, preferred_time, situation              | ❌ НЕ работают       |
| Калькулятор    | `calculator`   | debt_amount, creditors_count, property, name, phone | ❌ НЕ работают       |
| Скачать гид    | `guide`        | name, **email**                                     | ❌ НЕ работают       |
| Чек-лист       | `checklist`    | name, **email**                                     | ❌ НЕ работают       |
| Срочная помощь | `emergency`    | name, phone, emergency_situation                    | ❌ НЕ работают       |
| Тест           | `test`         | debt, name, phone                                   | ❌ НЕ работают       |

**Важно:** Модалки с `email` особенно критичны, так как email — ключевое поле
для Enhanced Conversions!

---

## 📊 Статистика проблемы

### Оценка потерь данных:

**Предположим:**

- 100 лидов в месяц с сайта
- 60% лидов приходит через модальные окна (типично для лендингов)
- 40% лидов через формы на страницах

**Текущая ситуация:**

- ✅ **40 лидов** с Enhanced Conversions (формы на страницах)
- ❌ **60 лидов БЕЗ Enhanced Conversions** (модалки)

**Итого:** Теряется **60% потенциального улучшения атрибуции**!

---

## 🔧 Технические детали проблемы

### Почему модалки не работают:

#### Текущая структура модалок:

```astro
<Modal id='consultation'>
  <BaseForm formId='consultation' formType='consultation'>
    <div class='form__group'>
      <input type='text' name='name' />
      <!-- Обычный HTML -->
    </div>
    <button type='submit'>Отправить</button>
  </BaseForm>
</Modal>
```

**Проблема:** `BaseForm.astro` здесь используется **как обертка**, но внутри —
чистый HTML без логики `FormEnhancedFinal.tsx`.

#### Правильная структура (как на страницах):

```astro
<BaseForm
  formId='consultation'
  formType='consultation'
  showNameField={true}
  showPhoneField={true}
  showEmailField={false}
/>
```

Это автоматически создает `FormEnhancedFinal.tsx` с полной поддержкой Enhanced
Conversions.

---

## 🛠️ План исправления

### Приоритет 1: КРИТИЧНО (делать в первую очередь)

#### 1. Переписать `CallbackModal.astro`

**Где используется:** Блог, все страницы с кнопкой "Обратный звонок"

**Было:**

```astro
<Modal id='callback'>
  <BaseForm formId='callback' formType='callback'>
    <!-- HTML форма вручную -->
  </BaseForm>
</Modal>
```

**Должно быть:**

```astro
<Modal id='callback'>
  <BaseForm
    formId='callback'
    formType='callback'
    showNameField={true}
    showPhoneField={true}
    showEmailField={false}
    submitText='Заказать звонок'
  />
</Modal>
```

---

#### 2. Переписать модалки в `LeadMagnetsModals.astro`

Нужно переписать **6 модальных форм**:

##### 2.1. Consultation Modal

```astro
<Modal id='consultation'>
  <BaseForm
    formId='consultation'
    formType='consultation'
    showNameField={true}
    showPhoneField={true}
    showEmailField={false}
    showDebtField={false}
    submitText='Получить консультацию'
  />
</Modal>
```

##### 2.2. Calculator Modal

```astro
<Modal id='calculator'>
  <BaseForm
    formId='calculator'
    formType='calculator'
    showNameField={true}
    showPhoneField={true}
    showEmailField={false}
    showDebtField={true}
    submitText='Рассчитать стоимость'
  />
</Modal>
```

##### 2.3. Guide Download Modal (с EMAIL!)

```astro
<Modal id='guide-download'>
  <BaseForm
    formId='guide'
    formType='guide'
    showNameField={true}
    showPhoneField={false}
    showEmailField={true}
    <!--
    ВАЖНО
    для
    Enhanced
    Conversions!
    --
  >
    submitText="Скачать гид бесплатно" />
  </BaseForm></Modal
>
```

##### 2.4. Checklist Download Modal (с EMAIL!)

```astro
<Modal id='checklist-download'>
  <BaseForm
    formId='checklist'
    formType='checklist'
    showNameField={true}
    showPhoneField={false}
    showEmailField={true}
    <!--
    ВАЖНО
    для
    Enhanced
    Conversions!
    --
  >
    submitText="Получить чек-лист" />
  </BaseForm></Modal
>
```

##### 2.5. Emergency Modal

```astro
<Modal id='emergency'>
  <BaseForm
    formId='emergency'
    formType='emergency'
    showNameField={true}
    showPhoneField={true}
    showEmailField={false}
    submitText='Получить помощь сейчас'
  />
</Modal>
```

##### 2.6. Test Modal

```astro
<Modal id='test'>
  <BaseForm
    formId='test'
    formType='test'
    showNameField={true}
    showPhoneField={true}
    showEmailField={false}
    showDebtField={true}
    submitText='Получить результат теста'
  />
</Modal>
```

---

### Приоритет 2: Расширение функционала

#### Добавить дополнительные поля в `BaseForm.astro`

Некоторые модалки имеют специфические поля (например, "предпочитаемое время",
"описание ситуации"). Нужно расширить `BaseForm.astro`:

```typescript
export interface Props {
  // ... существующие поля ...
  showCommentField?: boolean; // Для описания ситуации
  showTimeField?: boolean; // Для выбора времени звонка
  showCreditorsField?: boolean; // Для калькулятора
  showPropertyField?: boolean; // Для калькулятора
  commentPlaceholder?: string;
}
```

---

## 📝 Чек-лист исправлений

### Файлы для обновления:

- [ ] `src/features/modals/ui/CallbackModal.astro` - переписать
- [ ] `src/features/modals/ui/LeadMagnetsModals.astro` - переписать все 6
      модалок
- [ ] `src/components/forms/BaseForm.astro` - добавить новые props (опционально)
- [ ] Тестирование всех модальных форм
- [ ] Проверка Enhanced Conversions в GA4 DebugView

---

## 🧪 Тестирование после исправлений

### 1. Локальное тестирование

Для каждой модалки:

1. Открыть страницу с модалкой
2. Открыть Chrome DevTools → Console
3. Заполнить и отправить форму
4. Проверить в консоли:
   ```javascript
   console.log(
     'Enhanced Conversions enabled:',
     analytics.isEnhancedConversionsEnabled()
   );
   ```

### 2. Проверка в GA4 DebugView

1. Включить debug mode: добавить `?debug_mode=true` в URL
2. Открыть GA4 → Admin → DebugView
3. Для каждой модалки:
   - Открыть модалку
   - Заполнить форму
   - Отправить
   - Проверить событие `purchase` с параметром `user_data`

### 3. Chrome DevTools Network

1. DevTools → Network → фильтр `google-analytics.com/g/collect`
2. Отправить форму
3. Проверить параметры:
   - `&em=` (хешированный email)
   - `&ph=` (хешированный phone)

---

## 📈 Ожидаемые результаты после исправлений

### До исправлений:

- ✅ 40% лидов с Enhanced Conversions (формы на страницах)
- ❌ 60% лидов БЕЗ Enhanced Conversions (модалки)

### После исправлений:

- ✅ **100% лидов с Enhanced Conversions**
- 📈 Улучшение атрибуции на 10-30% (по всем лидам, а не только 40%)
- 🎯 Более точные данные для оптимизации рекламы
- 💰 Лучший ROAS в Google Ads

---

## ⏱️ Оценка времени

| Задача                                           | Время          | Приоритет   |
| ------------------------------------------------ | -------------- | ----------- |
| Переписать `CallbackModal.astro`                 | 15 мин         | 🔴 КРИТИЧНО |
| Переписать 6 модалок в `LeadMagnetsModals.astro` | 1-1.5 часа     | 🔴 КРИТИЧНО |
| Расширить `BaseForm.astro` (опционально)         | 30 мин         | 🟡 Средний  |
| Тестирование всех форм                           | 30 мин         | 🔴 КРИТИЧНО |
| **ИТОГО**                                        | **2.5-3 часа** | -           |

---

## 🚨 Рекомендации

### Немедленно:

1. ✅ **Переписать `CallbackModal.astro`** - используется на всех страницах
   блога
2. ✅ **Переписать модалки `guide` и `checklist`** - они собирают email
   (критично для Enhanced Conversions)
3. ✅ **Переписать остальные модалки**

### В течение недели:

4. Расширить `BaseForm.astro` для специфических полей
5. Провести полное тестирование
6. Мониторинг в GA4 после внедрения

---

## 📊 Приоритетность модалок

### По критичности для Enhanced Conversions:

1. 🔴 **КРИТИЧНО** - содержат email:
   - `guide-download` (email)
   - `checklist-download` (email)

2. 🟠 **ВЫСОКИЙ** - основные источники лидов:
   - `callback` (используется везде)
   - `consultation` (главная CTA)
   - `calculator` (высокая вовлеченность)

3. 🟡 **СРЕДНИЙ** - дополнительные лид-магниты:
   - `emergency` (срочная помощь)
   - `test` (тест на банкротство)
   - `assessment` (оценка дела)

---

## 📝 Выводы

### Текущая ситуация:

- ❌ **60% лидов теряют преимущества Enhanced Conversions**
- ❌ Модальные формы используют устаревший подход
- ❌ Данные пользователей НЕ хешируются в модалках
- ❌ Значительная потеря качества атрибуции

### После исправлений:

- ✅ **100% лидов с Enhanced Conversions**
- ✅ Единый подход ко всем формам на сайте
- ✅ Улучшение атрибуции на 10-30%
- ✅ Более точные данные для маркетинга

### Время внедрения:

- **2.5-3 часа** полной работы
- **Критичность:** 🔴 ВЫСОКАЯ

---

**Дата создания:** 2025  
**Статус:** ⚠️ Требуются исправления  
**Следующий шаг:** Переписать модальные формы
