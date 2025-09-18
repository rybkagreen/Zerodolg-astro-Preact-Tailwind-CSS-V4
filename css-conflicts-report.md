# Отчет о конфликтующих стилях для элемента timeline__cta

## Анализируемый HTML:
```html
<div class="timeline__cta-wrapper">
  <div class="timeline__cta-content">
    <h3 class="timeline__cta-title">Готовы начать процедуру банкротства?</h3>
    <p class="timeline__cta-text">Оставьте заявку и мы поможем на каждом этапе</p>
  </div>
  <button class="timeline__cta-button btn btn--primary btn--lg" data-modal="consultation">
    Начать процедуру
  </button>
</div>
```

## Найденные конфликты стилей:

### 1. Конфликт стилей для `.timeline__cta-wrapper`

#### Мобильная версия (базовые стили):
- **Файл:** `_timeline.css`, строки 615-625
- **Стили:**
  ```css
  .timeline__cta-wrapper {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 16px;
    box-shadow: var(--timeline-shadow-lg);
    padding: var(--space-xl, 2rem) var(--space-lg, 1.5rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg, 1.5rem);
    align-items: center;
    text-align: center;
  }
  ```

#### Планшетная версия (640px+):
- **Файл:** `_timeline.css`, строки 729-737
- **Переопределяет:**
  ```css
  .timeline__cta-wrapper {
    flex-direction: row;  /* Конфликт: было column */
    justify-content: space-between;
    text-align: left;  /* Конфликт: было center */
    padding: clamp(1.5rem, 3vw, 3rem);  /* Конфликт: другой padding */
    gap: clamp(1rem, 2vw, 2rem);  /* Конфликт: другой gap */
    align-items: center;
    flex-wrap: wrap;
  }
  ```

#### Большой десктоп (1280px+):
- **Файл:** `_timeline.css`, строки 1221-1224
- **Переопределяет:**
  ```css
  .timeline__cta-wrapper {
    padding: clamp(2rem, 4vw, 4rem);  /* Конфликт: еще больший padding */
    gap: clamp(1.5rem, 3vw, 3rem);  /* Конфликт: еще больший gap */
  }
  ```

#### Мобильная версия (max-width: 479px):
- **Файл:** `_timeline.css`, строки 1307-1312
- **Переопределяет обратно:**
  ```css
  .timeline__cta-wrapper {
    flex-direction: column;  /* Возврат к column */
    text-align: center;  /* Возврат к center */
    padding: var(--space-lg, 1.5rem) var(--space-md, 1rem);
    gap: var(--space-md, 1rem);
  }
  ```

#### Очень маленькие экраны (max-width: 360px):
- **Файл:** `_timeline.css`, строки 1338-1341
- **Переопределяет:**
  ```css
  .timeline__cta-wrapper {
    padding: var(--space-md, 1rem) var(--space-sm, 0.75rem);
    gap: var(--space-sm, 0.75rem);
  }
  ```

### 2. Дублирование стилей для `.timeline__cta` элементов

**ОБНАРУЖЕНА ПРОБЛЕМА:** Дублирование идентичных стилей в строках 1162-1202 файла `_timeline.css`. Эти стили полностью дублируют стили из строк 1118-1158.

### 3. Конфликт стилей для `.timeline__cta-button`

#### Базовые стили timeline:
- **Файл:** `_timeline.css`, строки 649-664
- **Стили:**
  ```css
  .timeline__cta-button {
    background: white;
    color: var(--color-primary, #3b82f6);
    padding: var(--space-md, 1rem) var(--space-xl, 2rem);
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    font-weight: var(--font-semibold, 600);
    border-radius: 12px;
    border: none;
    cursor: pointer;
    /* ... */
  }
  ```

#### Конфликт с базовыми стилями кнопок:
- **Файл:** `_button.css`, строки 7-26
- **Классы:** `.btn`
  ```css
  .btn {
    padding: var(--space-sm, 0.5rem) var(--space-lg, 1.5rem);  /* Конфликт padding */
    font-size: var(--text-base, 1rem);  /* Конфликт font-size */
    font-weight: 500;  /* Конфликт font-weight */
    border: 2px solid transparent;  /* Конфликт border */
    border-radius: var(--radius-md, 0.5rem);  /* Конфликт border-radius */
  }
  ```

#### Конфликт с модификатором --primary:
- **Файл:** `_button.css`, строки 60-64
- **Классы:** `.btn--primary`
  ```css
  .btn--primary {
    background-color: var(--color-primary);  /* Конфликт: timeline задает white */
    color: var(--color-white, #ffffff);  /* Конфликт: timeline задает color-primary */
    border-color: var(--color-primary);
  }
  ```

#### Конфликт с модификатором --lg:
- **Файл:** `_button.css`, строки 149-152
- **Классы:** `.btn--lg`
  ```css
  .btn--lg {
    padding: var(--space-md, 1rem) var(--space-xl, 2rem);  /* Частично совпадает с timeline */
    font-size: var(--text-lg, 1.125rem);  /* Конфликт с timeline clamp */
  }
  ```

### 4. Конфликт стилей в FAQ секции

- **Файл:** `_faq.css`, строки 577-611
- Определяет свои собственные стили для `.faq__cta .btn` и `.faq__cta .btn--primary`, которые могут конфликтовать если элементы используются внутри FAQ секции.

## Рекомендации по устранению конфликтов:

### 1. **Удалить дублирование кода**
   - Удалить дублированные стили в строках 1162-1202 файла `_timeline.css`

### 2. **Увеличить специфичность селекторов**
   - Для `.timeline__cta-button` стоит использовать более специфичные селекторы или !important для критичных стилей
   - Альтернативно: не использовать классы `.btn`, `.btn--primary`, `.btn--lg` вместе с `.timeline__cta-button`

### 3. **Реорганизовать медиа-запросы**
   - Устранить конфликтующие медиа-запросы для мобильных устройств
   - Сейчас есть конфликт между базовыми стилями и `@media (max-width: 479px)`

### 4. **Создать отдельный компонент**
   - Рассмотреть создание отдельного компонента `.timeline-cta-button` без использования общих классов кнопок

### 5. **Использовать CSS-переменные**
   - Вынести общие значения в CSS-переменные для консистентности

## Приоритетность стилей (каскад):

1. Inline стили (нет в данном случае)
2. Стили с !important (не обнаружено)
3. Более специфичные селекторы:
   - `.timeline__cta-button.btn.btn--primary.btn--lg` (специфичность: 0,0,4,0)
   - `.timeline__cta-button` (специфичность: 0,0,1,0)
   - `.btn--primary` (специфичность: 0,0,1,0)
   - `.btn--lg` (специфичность: 0,0,1,0)
   - `.btn` (специфичность: 0,0,1,0)

## Итоговые применяемые стили для кнопки:

Из-за одинаковой специфичности, побеждают стили, объявленные последними в порядке подключения CSS файлов. Если `_timeline.css` подключается после `_button.css`, то стили из timeline будут иметь приоритет для свойств с одинаковой специфичностью.

**Результирующие стили для `.timeline__cta-button.btn.btn--primary.btn--lg`:**
- `background: white` (из `.timeline__cta-button`)
- `color: var(--color-primary)` (из `.timeline__cta-button`)
- `padding: var(--space-md, 1rem) var(--space-xl, 2rem)` (совпадает в `.timeline__cta-button` и `.btn--lg`)
- `font-size: clamp(0.875rem, 2.5vw, 1rem)` (из `.timeline__cta-button`)
- `border-radius: 12px` (из `.timeline__cta-button`)
- `border: none` (из `.timeline__cta-button`)

## Визуальные проблемы:

1. **Кнопка будет белой вместо синей** - так как `.timeline__cta-button` переопределяет стили `.btn--primary`
2. **Непоследовательные отступы** на разных разрешениях экрана
3. **Дублирование кода** увеличивает размер CSS файла