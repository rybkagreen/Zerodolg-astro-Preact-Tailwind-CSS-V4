# 🤖 Multi-Agent System Configuration

## Агенты проекта

### **Qwen Code Agent** - основной код-ассистент

- **Назначение**: Генерация кода, рефакторинг, написание тестов
- **Технология**: Qwen3-coder-plus
- **Интеграция**: VS Code extension, CLI
- **Специализация**: TypeScript, Astro, Preact, Tailwind CSS v4

### **Security Agent** - аудит безопасности

- **Назначение**: Поиск уязвимостей, проверка на утечку секретов, SAST анализ
- **Технология**: Semgrep, TruffleHog, ESLint security rules
- **Интеграция**: GitHub Actions, pre-commit hooks
- **Специализация**: XSS, CSRF, Secret Detection

### **Performance Agent** - мониторинг производительности

- **Назначение**: Проверка Core Web Vitals, оптимизация ресурсов
- **Технология**: Lighthouse CI, WebPageTest API
- **Интеграция**: GitHub Actions, PR checks
- **Специализация**: LCP, FID, CLS, INP метрики

### **Content Agent** - генерация юридического контента

- **Назначение**: Создание контента для юридической тематики
- **Технология**: Qwen3-content-plus
- **Интеграция**: CMS интеграции, контентные коллекции
- **Специализация**: SEO-оптимизированный юридический контент

## Workflow между агентами

### Основной цикл разработки:

1. **Разработчик** создает задачу
2. **Qwen Code Agent** генерирует базовый код
3. **Security Agent** проверяет на уязвимости
4. **Performance Agent** анализирует метрики
5. **Разработчик** вносит правки
6. **Команда** проходит CI/CD процесс

### Взаимодействие при создании нового компонента:

```
[Разработчик]
    ↓
[Qwen Code Agent: Генерация компонента]
    ↓
[Security Agent: Проверка безопасности]
    ↓
[Performance Agent: Оптимизация производительности]
    ↓
[Разработчик: Ручная проверка]
    ↓
[CI/CD: Комплексный аудит]
```

### Взаимодействие при контентной задаче:

```
[Маркетолог]
    ↓
[Content Agent: Генерация контента]
    ↓
[SEO Agent: Оптимизация под поисковые системы]
    ↓
[Performance Agent: Проверка влияния на метрики]
    ↓
[Редактор: Финальная проверка]
```

## Конфигурация агентов

### Qwen Code Agent

Файл конфигурации: `.qwenrc.json`

```json
{
  "model": "qwen3-coder-plus",
  "temperature": 0.2,
  "max_tokens": 8192,
  "context_window": 32768,
  "project_context": {
    "name": "ZeroDolg Astro",
    "type": "corporate-website",
    "tech_stack": ["Astro", "Preact", "TypeScript", "Tailwind CSS v4"],
    "domain": "legal-bankruptcy",
    "architecture": "feature-sliced-design",
    "ai_tools": ["qwen-code", "model-context-protocol"]
  },
  "custom_prompts": {
    "astro_component": "Создай компонент Astro с использованием Preact для интерактивных элементов",
    "tailwind_v4": "Используй синтаксис Tailwind CSS v4 с новым CSS-конфигурационным подходом",
    "ts_strict": "Генерируй TypeScript код с strict mode и полной типизацией",
    "security": "Обеспечь безопасность компонента, защиту от XSS, правильную валидацию"
  }
}
```

### Security Agent

Файл конфигурации: `.semgrep.yml`

```yaml
rules:
  - id: jsx-xss
    message: Potential XSS via JSX expression
    languages: [javascript, typescript]
    severity: ERROR
    pattern-either:
      - pattern: '<$X ... dangerouslySetInnerHTML={...} ... />'
      - pattern: '<$X ... dangerouslySetInnerHTML={...} />'
    metadata:
      category: security
      technology:
        - react
        - preact
      cwe:
        - "CWE-79: Improper Neutralization of Input During Web Page Generation
          ('Cross-site Scripting')"

  - id: secret-leak
    message: Potential secret in code
    languages: [javascript, typescript, json, yaml]
    severity: ERROR
    pattern-either:
      - pattern: 'password: "...'
      - pattern: 'apiKey: "...'
      - pattern: 'secret: "...'
    metadata:
      category: security
      technology:
        - secrets
      cwe:
        - 'CWE-798: Use of Hard-coded Credentials'
```

### Performance Agent

Файл конфигурации: `.lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      staticDistDir: './dist',
      settings: {
        chromeFlags: '--no-sandbox',
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
        maxWaitForFcp: 15 * 1000,
        maxWaitForLoad: 35 * 1000,
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'first-contentful-paint': ['warn', { maxNumericValue: 1000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'max-potential-fid': ['error', { maxNumericValue: 75 }],
        'total-blocking-time': ['error', { maxNumericValue: 0 }],
        interactive: ['error', { maxNumericValue: 1000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## Обмен контекстом между агентами

### Общие правила:

1. **Контекст запроса** должен передаваться между агентами
2. **История изменений** сохраняется в Git
3. **Результаты анализа** сохраняются в артефакты CI/CD
4. **Промежуточные результаты** хранятся во временных файлах

### Поток контекста при анализе компонента:

```
1. Qwen Code Agent создает компонент
2. Контекст: тип, назначение, зависимости передается Security Agent
3. Security Agent анализирует и возвращает: безопасен/требует изменений
4. Контекст: безопасный компонент передается Performance Agent
5. Performance Agent анализирует и возвращает: производительность OK/требует оптимизации
6. Все результаты агентов доступны в CI/CD артефактах
```

## Разрешение конфликтов

### Приоритеты агентов:

1. **Security Agent** - имеет наивысший приоритет
2. **Performance Agent** - критические метрики
3. **Qwen Code Agent** - функциональность
4. **Content Agent** - содержание

### Пример конфликта и разрешения:

**Ситуация**: Qwen Code Agent предлагает использовать `dangerouslySetInnerHTML`
для отображения динамического HTML, но Security Agent блокирует это.

**Решение**:

1. Security Agent предоставляет информацию о риске
2. Qwen Code Agent переписывает компонент с безопасной альтернативой
3. Performance Agent проверяет производительность нового решения
4. Результаты фиксируются в промптах для будущих задач

## AI-ассистенты команды

### Для разработчиков:

- **Qwen Code** - основной ассистент для написания кода
- **Security Agent** - обязательная проверка для всех PR
- **Performance Agent** - автоматические метрики в CI/CD

### Для контент-менеджеров:

- **Content Agent** - генерация SEO-оптимизированного контента
- **Performance Agent** - оценка влияния контента на метрики

### Для архитекторов:

- **Qwen Code** - анализ архитектурных решений
- **Security Agent** - оценка архитектурных рисков
- **Performance Agent** - оценка влияния архитектуры на метрики

## Мониторинг эффективности агентов

### Метрики для Qwen Code Agent:

- Время генерации кода
- Качество (ошибки в сгенерированном коде)
- Соответствие архитектуре проекта
- Удовлетворенность разработчиков

### Метрики для Security Agent:

- Количество обнаруженных уязвимостей
- Время сканирования
- Количество ложных срабатываний
- Время на устранение уязвимостей

### Метрики для Performance Agent:

- Изменение Core Web Vitals
- Время выполнения проверки
- Количество рекомендаций
- Реализация рекомендаций

### Метрики для Content Agent:

- SEO-рейтинг сгенерированного контента
- Вовлеченность пользователей
- Качество (ошибки, несоответствие тематике)
- Время генерации

## Обновление и обучение агентов

### Периодичность обновлений:

- **Qwen Code Agent**: Ежеквартально обновляется промпт-база
- **Security Agent**: Обновляется при выпуске новых правил
- **Performance Agent**: При изменении метрик производительности
- **Content Agent**: При изменении SEO-требований

### Обратная связь:

- Разработчики могут добавлять шаблоны промптов в `.qwen/prompts/`
- Результаты работы агентов анализируются после каждого релиза
- Новые паттерны интегрируются в обучение агентов
