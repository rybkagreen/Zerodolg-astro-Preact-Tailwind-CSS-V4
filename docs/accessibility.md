# Руководство по доступности (Accessibility)

## Общая информация

Это руководство описывает подход к обеспечению доступности проекта ZeroDolg Astro, включая стандарты, лучшие практики и процессы проверки.

## Стандарты доступности

### WCAG 2.1
Проект следует рекомендациям [WCAG 2.1](https://www.w3.org/TR/WCAG21/) уровня AA:

- **Уровень A**: Основные требования доступности
- **Уровень AA**: Улучшенные стандарты доступности (целевой уровень)
- **Уровень AAA**: Наивысший уровень доступности (рекомендуется где возможно)

### ARIA
Используются [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) роли, состояния и свойства для улучшения доступности интерактивных компонентов.

## Семантическая разметка

### HTML5 семантические элементы
```html
<!-- Хорошо -->
<header>
  <nav>...</nav>
</header>
<main>
  <section>
    <article>...</article>
  </section>
</main>
<footer>...</footer>

<!-- Плохо -->
<div>
  <div>...</div>
</div>
<div>
  <div>
    <div>...</div>
  </div>
</div>
<div>...</div>
```

### Заголовки
```html
<!-- Правильная иерархия заголовков -->
<h1>Главная страница</h1>
<section>
  <h2>Наши услуги</h2>
  <article>
    <h3>Банкротство физических лиц</h3>
    <p>...</p>
  </article>
</section>
<section>
  <h2>Отзывы клиентов</h2>
  <article>
    <h3>Отзыв Ивана Петрова</h3>
    <p>...</p>
  </article>
</section>
```

### Списки
```html
<!-- Навигационное меню как список -->
<nav>
  <ul>
    <li><a href="/">Главная</a></li>
    <li><a href="/services/">Услуги</a></li>
    <li><a href="/reviews/">Отзывы</a></li>
  </ul>
</nav>

<!-- Список преимуществ -->
<ul>
  <li>Полное списание долгов</li>
  <li>Защита имущества</li>
  <li>Минимальные расходы</li>
</ul>
```

## ARIA атрибуты

### Роли
```html
<!-- Роли для сложных компонентов -->
<div role="tablist">
  <button role="tab" aria-selected="true">Вкладка 1</button>
  <button role="tab" aria-selected="false">Вкладка 2</button>
</div>
<div role="tabpanel">Содержимое вкладки 1</div>

<!-- Роли для уведомлений -->
<div role="alert" aria-live="assertive">
  Произошла ошибка при отправке формы
</div>
```

### Состояния и свойства
```html
<!-- Состояния переключателей -->
<button aria-pressed="true">Избранное</button>

<!-- Свойства для форм -->
<label for="email">Email</label>
<input type="email" id="email" aria-describedby="email-error" required>
<div id="email-error" role="alert">Пожалуйста, введите корректный email</div>

<!-- Свойства для сложных компонентов -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Подтверждение действия</h2>
  <p>Вы уверены, что хотите продолжить?</p>
</div>
```

## Навигация с клавиатуры

### Фокусировка
```css
/* Видимые индикаторы фокуса */
:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Стили для фокуса в компонентах */
.button:focus,
.link:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Скрытие фокуса при использовании мыши */
.js-focus-visible :focus:not(.focus-visible) {
  outline: none;
}
```

### Порядок табуляции
```html
<!-- Логичный порядок табуляции -->
<form>
  <input type="text" name="name" tabindex="1">
  <input type="email" name="email" tabindex="2">
  <textarea name="message" tabindex="3"></textarea>
  <button type="submit" tabindex="4">Отправить</button>
</form>
```

### Пропуск навигации
```html
<!-- Пропуск навигации для клавиатурных пользователей -->
<a href="#main-content" class="skip-link">
  Перейти к основному содержимому
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
</style>
```

## Контрастность

### Минимальные значения контраста
- **Текст**: 4.5:1 (обычный текст), 3:1 (крупный текст)
- **Интерактивные элементы**: 3:1
- **Графические элементы**: 3:1

### Проверка контраста
```css
/* Хороший контраст */
.text-primary {
  color: #333; /* Черный на белом фоне - контраст 12.63:1 */
  background: #fff;
}

.text-secondary {
  color: #666; /* Тёмно-серый на белом - контраст 7.07:1 */
  background: #fff;
}

/* Плохой контраст */
.text-poor {
  color: #999; /* Светло-серый на белом - контраст 2.85:1 */
  background: #fff;
}
```

## Изображения и медиа

### Альтернативный текст
```html
<!-- Информативные изображения -->
<img src="bankruptcy-process.jpg" 
     alt="Процесс банкротства: от подачи заявления до списания долгов">

<!-- Декоративные изображения -->
<img src="decoration.jpg" alt="" role="presentation">

<!-- Изображения с описанием в тексте -->
<figure>
  <img src="statistics.jpg" alt="Диаграмма: 95% успешных банкротств">
  <figcaption>Статистика успешных процедур банкротства за 2024 год</figcaption>
</figure>
```

### Видео и аудио
```html
<!-- Видео с субтитрами -->
<video controls>
  <source src="bankruptcy-explanation.mp4" type="video/mp4">
  <track kind="subtitles" src="subtitles.vtt" srclang="ru" label="Русские">
  Ваш браузер не поддерживает видео.
</video>

<!-- Аудио с транскрипцией -->
<audio controls>
  <source src="consultation-call.mp3" type="audio/mpeg">
  Ваш браузер не поддерживает аудио.
</audio>
<p><a href="consultation-call-transcript.txt">Транскрипт аудио</a></p>
```

## Формы

### Метки и подписи
```html
<!-- Явные метки -->
<label for="phone">Номер телефона</label>
<input type="tel" id="phone" name="phone">

<!-- Неявные метки -->
<label>
  Имя
  <input type="text" name="name">
</label>

<!-- Группы полей -->
<fieldset>
  <legend>Контактная информация</legend>
  <label for="email">Email</label>
  <input type="email" id="email" name="email">
  
  <label for="phone">Телефон</label>
  <input type="tel" id="phone" name="phone">
</fieldset>
```

### Валидация и ошибки
```html
<!-- Визуальная и программная индикация ошибок -->
<label for="email">Email *</label>
<input type="email" 
       id="email" 
       name="email" 
       aria-describedby="email-error"
       aria-invalid="true"
       required>
<div id="email-error" role="alert">
  Пожалуйста, введите корректный email адрес
</div>
```

## Компоненты

### Модальные окна
```astro
---
// src/components/ui/Modal.astro
interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const { isOpen, title, onClose } = Astro.props;
---

{isOpen && (
  <div 
    role="dialog" 
    aria-labelledby="modal-title" 
    aria-modal="true"
    aria-hidden={!isOpen}
    class="modal"
  >
    <div class="modal-content">
      <button 
        type="button" 
        onclick={onClose}
        aria-label="Закрыть модальное окно"
        class="modal-close"
      >
        ×
      </button>
      <h2 id="modal-title">{title}</h2>
      <slot />
    </div>
  </div>
)}
```

### Аккордеоны
```astro
---
// src/components/ui/Accordion.astro
interface Props {
  items: Array<{ title: string; content: string }>;
}

const { items } = Astro.props;
---

<div class="accordion">
  {items.map((item, index) => (
    <div class="accordion-item">
      <h3>
        <button
          type="button"
          aria-expanded="false"
          aria-controls={`section-${index}`}
          class="accordion-button"
        >
          {item.title}
        </button>
      </h3>
      <div 
        id={`section-${index}`} 
        role="region" 
        aria-labelledby={`accordion-title-${index}`}
        class="accordion-content"
      >
        {item.content}
      </div>
    </div>
  ))}
</div>
```

### Карусели
```astro
---
// src/components/ui/Carousel.astro
interface Props {
  slides: Array<{ title: string; content: string }>;
}

const { slides } = Astro.props;
---

<div class="carousel" role="region" aria-label="Карусель отзывов" aria-roledescription="carousel">
  <div class="carousel-wrapper">
    <div class="carousel-track" role="list">
      {slides.map((slide, index) => (
        <div 
          class="carousel-slide" 
          role="listitem"
          aria-label={`Слайд ${index + 1} из ${slides.length}`}
        >
          <h3>{slide.title}</h3>
          <p>{slide.content}</p>
        </div>
      ))}
    </div>
  </div>
  
  <button 
    type="button" 
    aria-label="Предыдущий слайд"
    class="carousel-prev"
  >
    ←
  </button>
  <button 
    type="button" 
    aria-label="Следующий слайд"
    class="carousel-next"
  >
    →
  </button>
</div>
```

## Цвета и темы

### Предпочтения пользователя
```css
/* Поддержка prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Поддержка prefers-contrast */
@media (prefers-contrast: high) {
  :root {
    --color-text: #000;
    --color-background: #fff;
  }
}

@media (prefers-contrast: low) {
  :root {
    --color-text: #333;
    --color-background: #f5f5f5;
  }
}
```

### Темный режим
```css
/* Поддержка prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #fff;
    --color-background: #1a1a1a;
    --color-primary: #4d9eff;
  }
}
```

## Тестирование доступности

### Автоматические инструменты

#### axe-core
```javascript
// tests/accessibility.test.js
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
    
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

#### Lighthouse
```bash
# Запуск аудита доступности
npx lighthouse http://localhost:4321 --view --only-categories=accessibility
```

### Ручное тестирование

#### Скринридеры
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)

#### Клавиатурная навигация
- [ ] Все интерактивные элементы доступны с клавиатуры
- [ ] Логичный порядок табуляции
- [ ] Видимые индикаторы фокуса
- [ ] Возможность активации всех элементов с клавиатуры

#### Цветовая слепота
- [ ] Проверка симуляторами цветовой слепоты
- [ ] Альтернативные способы передачи информации
- [ ] Соответствие требованиям контраста

## Лучшие практики

### Разработка
- [ ] Использовать семантические HTML элементы
- [ ] Добавлять ARIA атрибуты где необходимо
- [ ] Обеспечить навигацию с клавиатуры
- [ ] Проверять контрастность текста
- [ ] Добавлять альтернативный текст для изображений
- [ ] Обрабатывать фокус и состояния элементов

### Тестирование
- [ ] Автоматическое тестирование с axe-core
- [ ] Ручное тестирование с клавиатуры
- [ ] Тестирование со скринридерами
- [ ] Проверка на цветовую слепоту
- [ ] Тестирование на различных устройствах

### Документация
- [ ] Добавлять комментарии о доступности в коде
- [ ] Документировать ARIA паттерны
- [ ] Создавать руководства по доступности для команды

## Инструменты разработчика

### Browser Extensions
- **axe DevTools** - расширение для Chrome/Firefox
- **WAVE** - веб-инструмент для оценки доступности
- **Accessibility Insights** - расширение от Microsoft

### CLI инструменты
- **pa11y** - командная строка для тестирования доступности
- **axe-cli** - CLI версия axe-core
- **Lighthouse CLI** - аудит производительности и доступности

### Интеграция в CI/CD
```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run accessibility tests
      run: npm run test:accessibility
```

## Регулярные задачи

### Еженедельные
- Проверка новых компонентов на доступность
- Обновление автоматических тестов
- Мониторинг отчетов о доступности

### Ежемесячные
- Полный аудит доступности сайта
- Тестирование с различными вспомогательными технологиями
- Обновление документации по доступности

### Ежеквартальные
- Обучение команды по вопросам доступности
- Анализ пользовательских отзывов
- Обновление стандартов и практик

## Ресурсы

### Документация
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)

### Сообщества
- **W3C Web Accessibility Initiative**
- **A11y Project**
- **Accessibility Slack Communities**

## Контакты

Для вопросов по доступности обращайтесь: [accessibility@zerodolg.ru]

Для сообщений о проблемах доступности: [a11y-bugs@zerodolg.ru]