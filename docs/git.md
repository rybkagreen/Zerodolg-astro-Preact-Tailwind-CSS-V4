# Руководство по работе с Git

## Общая информация

Это руководство описывает правила и процессы работы с Git в проекте ZeroDolg Astro, включая структуру ветвления, формат коммитов и процессы ревью кода.

## Структура ветвления

### Основные ветки
- **main** - основная ветка с production кодом
- **develop** - ветка для разработки следующей версии

### Типы веток
- **feature/** - новые функции (`feature/new-component`)
- **bugfix/** - исправление багов (`bugfix/fix-header-styling`)
- **hotfix/** - срочные исправления в production (`hotfix/critical-security-patch`)
- **release/** - подготовка релизов (`release/v1.2.0`)

### Пример структуры
```
main
├── develop
    ├── feature/new-contact-form
    ├── feature/improve-seo
    ├── bugfix/fix-mobile-menu
    └── release/v1.2.0
```

## Формат коммитов

### Структура сообщений
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Типы коммитов
- **feat**: Новая функция
- **fix**: Исправление бага
- **docs**: Изменения в документации
- **style**: Форматирование, отсутствие изменений в коде
- **refactor**: Рефакторинг кода
- **test**: Добавление или изменение тестов
- **chore**: Технические задачи, обслуживание

### Области (scope)
- **component**: Компоненты (`feat(component): add new button component`)
- **style**: Стили (`fix(style): fix header alignment`)
- **api**: API (`feat(api): add new endpoint`)
- **docs**: Документация (`docs: update installation guide`)
- **build**: Сборка (`chore(build): update dependencies`)

### Примеры коммитов
```bash
# Хорошие примеры
feat(component): add team member card component
fix(style): resolve mobile menu overlap issue
docs: update component documentation
refactor(api): optimize data fetching logic
test: add unit tests for content service
chore(deps): update astro to v5.13.5

# Плохие примеры
fixed stuff
updated code
made changes
```

## Рабочий процесс

### Feature Branch Workflow
1. Создать ветку от `develop`
```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature-name
```

2. Работать в ветке, делая коммиты
```bash
git add .
git commit -m "feat(component): implement new feature"
```

3. Отправить ветку в удаленный репозиторий
```bash
git push origin feature/new-feature-name
```

4. Создать Pull Request в `develop`

5. После ревью и одобрения - слить в `develop`

### Hotfix Workflow
1. Создать ветку от `main`
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
```

2. Внести исправления и закоммитить
```bash
git add .
git commit -m "hotfix: fix critical security vulnerability"
```

3. Отправить ветку и создать Pull Request в `main`

4. После слияния в `main`, слить изменения в `develop`

## Pull Requests

### Создание PR
- Название должно отражать суть изменений
- Добавить описание с объяснением изменений
- Указать, какие проблемы решает PR
- Добавить скриншоты, если есть визуальные изменения
- Привязать к задачам в трекере (если используется)

### Ревью кода
- Минимум 1 апрув от коллеги
- Проверка соответствия кодгайдам
- Проверка тестов
- Проверка документации
- Проверка производительности

### Мерж стратегии
- **Squash and merge**: Для feature веток (объединяет все коммиты в один)
- **Merge commit**: Для релизов и hotfixes
- **Rebase and merge**: Для мелких багфиксов

## Теги и релизы

### Формат тегов
Используется семантическое версионирование: `v{MAJOR}.{MINOR}.{PATCH}`

```bash
# Примеры тегов
v1.0.0  # Релиз первой версии
v1.0.1  # Патч-релиз
v1.1.0  # Минорный релиз
v2.0.0  # Мажорный релиз
```

### Создание релиза
1. Создать ветку релиза
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

2. Обновить версию в `package.json`

3. Создать и отправить тег
```bash
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

4. Слить в `main` и `develop`

## Конфликты

### Разрешение конфликтов
1. Получить последние изменения
```bash
git fetch origin
git pull origin develop
```

2. Если есть конфликты:
```bash
git status  # Посмотреть конфликтные файлы
# Редактировать конфликтные файлы
git add .
git commit
```

3. Продолжить работу

### Предотвращение конфликтов
- Регулярно обновлять свою ветку из `develop`
- Коммитить часто и маленькими порциями
- Следить за изменениями в параллельных ветках

## Полезные команды

### Ежедневная работа
```bash
# Получить последние изменения
git pull origin develop

# Посмотреть статус
git status

# Добавить изменения
git add .

# Сделать коммит
git commit -m "feat: add new feature"

# Отправить изменения
git push origin feature/branch-name

# Посмотреть историю коммитов
git log --oneline -10
```

### Работа с ветками
```bash
# Посмотреть все ветки
git branch -a

# Создать новую ветку
git checkout -b feature/new-feature

# Переключиться на ветку
git checkout develop

# Удалить локальную ветку
git branch -d feature/old-feature

# Удалить удаленную ветку
git push origin --delete feature/old-feature
```

### Работа с историей
```bash
# Отменить последний коммит (сохраняя изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удаляя изменения)
git reset --hard HEAD~1

# Исправить последний коммит
git commit --amend -m "Updated commit message"

# Посмотреть изменения в последнем коммите
git show
```

### Поиск и отладка
```bash
# Найти коммит по содержимому
git grep "search-term"

# Посмотреть, кто изменил строку
git blame filename

# Найти коммит, который сломал тест
git bisect start
git bisect bad
git bisect good v1.0.0
```

## Хуки Git

### Pre-commit хуки
Используются для проверки кода перед коммитом:
- Форматирование кода
- Запуск линтеров
- Проверка типов
- Запуск тестов

### Pre-push хуки
Используются для финальной проверки перед отправкой:
- Полный запуск тестов
- Проверка сборки
- Валидация сообщений коммитов

## Игнорируемые файлы

### .gitignore
```
# Зависимости
node_modules/

# Сборка
dist/
.build/

# Временные файлы
*.tmp
*.log

# Окружение
.env
.env.local

# IDE
.vscode/
.idea/

# ОС
.DS_Store
Thumbs.db
```

## Лучшие практики

### Коммиты
- [ ] Делать коммиты часто и маленькими порциями
- [ ] Писать осмысленные сообщения коммитов
- [ ] Следовать соглашению о формате коммитов
- [ ] Не коммитить чувствительные данные
- [ ] Не коммитить сгенерированные файлы

### Ветки
- [ ] Создавать ветки для каждой задачи
- [ ] Использовать описательные имена для веток
- [ ] Регулярно обновлять ветки из основной ветки
- [ ] Удалять неиспользуемые ветки
- [ ] Не работать напрямую в `main` или `develop`

### Pull Requests
- [ ] Писать подробные описания PR
- [ ] Добавлять скриншоты для визуальных изменений
- [ ] Запрашивать ревью у коллег
- [ ] Отвечать на комментарии в PR
- [ ] Тестировать изменения перед мержем

### Общее
- [ ] Регулярно делать `git pull`
- [ ] Использовать теги для релизов
- [ ] Следить за историей изменений
- [ ] Документировать важные изменения
- [ ] Соблюдать конвенции проекта

## Интрументы

### Git GUI
- **GitKraken** - визуальный клиент Git
- **SourceTree** - клиент от Atlassian
- **GitHub Desktop** - клиент от GitHub

### Расширения IDE
- **GitLens** (VS Code) - расширенные возможности Git
- **Git Integration** (WebStorm) - интеграция Git в IDE

### CLI инструменты
- **git-delta** - улучшенный вывод diff
- **gitui** - терминальный интерфейс для Git
- **tig** - текстовый интерфейс для Git

## Регулярные задачи

### Ежедневные
- Синхронизация с удаленным репозиторием
- Проверка открытых PR
- Обновление локальных веток

### Еженедельные
- Чистка старых веток
- Обновление зависимостей Git hooks
- Ревью документации по Git

### Ежемесячные
- Аудит истории коммитов
- Обновление процессов работы с Git
- Обучение команды новым практикам

## Контакты

Для вопросов по работе с Git обращайтесь: [git@zerodolg.ru]

Для проблем с репозиторием: [devops@zerodolg.ru]