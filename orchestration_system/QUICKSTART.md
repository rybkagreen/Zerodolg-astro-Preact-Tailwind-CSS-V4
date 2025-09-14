# 🚀 Quick Start Guide - Qwen Orchestration System

## Самый быстрый способ запуска

### 1. Используйте демо-скрипт (рекомендуется)

```powershell
cd orchestration_system
.\demo.ps1
```

Выберите один из вариантов:
- **[1]** Quick Demo - 2 воркера, 2 минуты
- **[2]** Standard Demo - 3 воркера, 5 минут
- **[3]** Interactive Mode - настроить параметры вручную

### 2. Ручной запуск с qwen-cli

#### Шаг 1: Запустите воркеров с qwen-cli
Откройте 2-3 вкладки терминала и в каждой запустите:

```powershell
# Вкладка 1 - Воркер с интерактивной сессией qwen-cli
.\start_qwen_worker.ps1 -WorkerName "Qwen-Alpha" -Interactive

# Вкладка 2 - Еще один воркер
.\start_qwen_worker.ps1 -WorkerName "Qwen-Beta" -Interactive

# Вкладка 3 (опционально) - Третий воркер
.\start_qwen_worker.ps1 -WorkerName "Qwen-Gamma" -Interactive
```

#### Шаг 2: Запустите оркестратор
В новой вкладке:

```powershell
.\start_orchestrator.ps1 -Duration 5
```

## 📊 Что происходит?

1. **Воркеры** подключаются к qwen и регистрируются в системе
2. **Оркестратор** создает начальные задачи и распределяет их
3. **Воркеры** обрабатывают задачи через qwen
4. **Результаты** возвращаются оркестратору
5. **Новые задачи** генерируются на основе результатов

## 🔍 Мониторинг

### Проверка статуса воркеров:
```powershell
Get-Content .\workers\*.json | ConvertFrom-Json | Format-Table id, name, status, tasks_completed
```

### Просмотр последних результатов:
```powershell
Get-ChildItem .\results\archive\*.json -ErrorAction SilentlyContinue | Select-Object -Last 3 | ForEach-Object { Get-Content $_ | ConvertFrom-Json | Format-List task_id, status, execution_time }
```

### Проверка логов:
```powershell
Get-Content .\logs\orchestrator.log -Tail 20
```

## ⚙️ Режимы работы воркеров

### Standard Mode (worker.py)
- Вызывает qwen-cli для каждой задачи отдельно
- Подходит для редких задач
- Меньше потребляет ресурсов

### Interactive Mode (worker_interactive.py)
- Держит постоянную сессию qwen-cli
- Быстрее обрабатывает задачи
- Подходит для интенсивной работы

## 🧹 Очистка

После работы очистите временные файлы:

```powershell
.\cleanup.ps1 -KeepLogs  # Сохранить логи
# или
.\cleanup.ps1            # Удалить все
```

## ❓ Проблемы?

### qwen не найден
Система работает в режиме симуляции. Убедитесь, что qwen установлен и доступен в PATH.

### Воркеры не регистрируются
Проверьте, что Python установлен и доступен в PATH.

### Задачи не выполняются
Убедитесь, что папки tasks/, results/, workers/ созданы и доступны для записи.

## 💡 Советы

1. **Начните с demo.ps1** - это самый простой способ
2. **Используйте Interactive mode** для лучшей производительности
3. **Запускайте 2-3 воркера** для оптимальной демонстрации
4. **Следите за логами** для понимания процессов

---

Готово к запуску! 🎯