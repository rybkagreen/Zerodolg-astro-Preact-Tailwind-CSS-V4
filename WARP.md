# ⚡ Warp Terminal Configuration

## Профиль проекта

### Custom commands для Astro разработки

Создайте в Warp следующие snippet-ы для быстрого доступа к командам проекта:

**astro-dev** - Запуск локального сервера разработки

```bash
npm run dev
```

**astro-build** - Сборка проекта для продакшена

```bash
npm run build
```

**astro-preview** - Предварительный просмотр собранного сайта

```bash
npm run preview
```

**astro-check** - Проверка качества кода

```bash
npm run type-check && npm run lint
```

**astro-test** - Запуск всех тестов

```bash
npm run test
```

### Workflow с Qwen Code интеграцией

**qwen-setup** - Команды для настройки Qwen Code

```bash
# Проверка конфигурации Qwen
# cat .qwenrc.json

# Запуск анализа проекта
# npx qwen analyze
```

**qwen-security** - Запуск безопасности

```bash
npx semgrep scan
```

**qwen-performance** - Запуск аудита производительности

```bash
npm run maintenance:lighthouse
```

## Интеграция с AI

### Warp AI + Qwen Code синергия

1. Используйте Warp AI для быстрых команд в терминале
2. Используйте Qwen Code для генерации сложных команд
3. Сохраняйте часто используемые команды как snippet-ы

### Быстрые команды для генерации кода

**gen-component** - Генерация компонента Astro

```bash
# Используйте для генерации нового компонента через Qwen Code
# Скопируйте результат в соответствующую директорию
```

**gen-feature** - Генерация новой фичи

```bash
# Создание новой фичи по архитектуре Feature-Sliced Design
# npm run generate:feature [название-фичи]
```

### Дебаггинг через терминал

**debug-astro** - Запуск Astro в режиме отладки

```bash
DEBUG=* npm run dev
```

**debug-security** - Подробный аудит безопасности

```bash
npx semgrep scan --verbose
```

**debug-performance** - Подробный аудит производительности

```bash
npx lighthouse http://localhost:4321 --output json --output-path reports/lh-report.json
```

## Пользовательские настройки Warp

### Тема и внешний вид

Рекомендуемая тема: `One Dark Pro` или `Dracula` для лучшей читаемости кода

### Шрифты

- **Основной шрифт**: JetBrains Mono или FiraCode (с поддержкой ligatures)
- **Размер**: 14px для комфортной работы
- **Высота строки**: 1.4 для лучшей читаемости

### Цветовая схема для AI-разработки

```json
{
  "ui": {
    "accent": "#FF6B00",
    "background": {
      "one": "#282c34",
      "two": "#21252b"
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#abb2bf"
    },
    "terminal": {
      "background": "#1e2127",
      "cursor": "#528bff"
    }
  }
}
```

### Плагины для AI-разработки

- **Warp AI** - Встроенный помощник для команд
- **Git** - Интеграция с Git
- **Node.js** - Подсветка команд Node.js
- **NPM** - Подсказки для npm команд

## Автодополнение для команд проекта

### Astro команды

```
dev        | Запуск локального сервера разработки
build      | Сборка проекта для продакшена
build:prod | Сборка с продакшен-оптимизациями
preview    | Предварительный просмотр собранного сайта
```

### Qwen Code команды

```
qwen:setup    | Настройка Qwen Code
qwen:analyze  | Анализ проекта с помощью Qwen
qwen:security | Проверка безопасности
qwen:perf     | Анализ производительности
```

### Тестирование команды

```
test          | Запуск всех тестов
test:watch    | Запуск тестов в watch режиме
test:coverage | Запуск тестов с покрытием
test:ui       | UI для тестов
test:e2e      | E2E тестирование
```

### Обслуживания команды

```
maintenance:audit       | Аудит зависимостей
maintenance:lighthouse  | Lighthouse аудит
tools:compare-sites     | Сравнение сайтов
tools:diagnose-css      | Диагностика CSS
tools:semgrep           | Проверка безопасности
tools:trufflehog        | Проверка утечки секретов
```

## Шаблоны команд для Warp AI

### Генерация отчетов

```
Command: npm run tools:generate-report
Template: Генерация полного отчета о состоянии проекта
Parameters: [report-type] (security, performance, accessibility)
```

### Обновление зависимостей

```
Command: npm run maintenance:update-deps
Template: Обновление зависимостей с проверкой безопасности
Parameters: [dep-type] (prod, dev, all)
```

### Запуск CI цикла локально

```
Command: npm run ci:local
Template: Запуск полного CI цикла локально
Parameters: none
```

## Профиль разработчика

### Активация профиля

Создайте в корне проекта файл `.env.warp` с командами для быстрого запуска:

```bash
# Быстрая активация разработки
alias astro-dev='npm run dev'

# Быстрая проверка качества
alias astro-check='npm run type-check && npm run lint'

# Быстрая сборка
alias astro-build='npm run build'

# Быстрое тестирование
alias astro-test='npm run test'

# Быстрая проверка безопасности
alias security-check='npx semgrep scan && npx trufflehog .'

# Быстрая проверка производительности
alias perf-check='npm run maintenance:lighthouse'
```

### Интеграция с Git

```
# Быстрая проверка изменений с AI-анализом
git ai-status    # Анализ изменений с помощью AI
git ai-commit    # Автогенерация сообщения коммита с AI
git ai-branch    # Автогенерация названия ветки с AI
```

## Рабочие сценарии

### Сценарий 1: Быстрый запуск разработки

1. Откройте Warp Terminal
2. Перейдите в директорию проекта
3. Выполните `astro-dev` для запуска сервера
4. В другом табе выполните `astro-check` для проверки качества

### Сценарий 2: Полная проверка перед коммитом

1. `astro-check` - Проверка качества кода
2. `security-check` - Проверка безопасности
3. `perf-check` - Проверка производительности
4. `astro-test` - Запуск тестов
5. `git add . && git commit -m "feat: add amazing feature"`

### Сценарий 3: Отладка производительности

1. `astro-dev` - Запуск в режиме разработки
2. `debug-performance` - Подробный аудит
3. Анализ результатов в `reports/lh-report.json`

## Полезные сочетания клавиш

### Для работы с AI

- `Cmd+Shift+I` - Включение AI-интеграции
- `Cmd+Shift+C` - Копирование результата в буфер обмена
- `Cmd+Shift+S` - Сохранение вывода в файл

### Навигация

- `Cmd+Shift+T` - Новый таб
- `Cmd+Shift+P` - Командная палитра
- `Cmd+Shift+F` - Поиск по выводу терминала

### Работа с проектом

- `F1` - Показать сниппеты проекта
- `F2` - Быстрая вставка часто используемых команд
- `F3` - Переключение между профилями разработки
