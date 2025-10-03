# Инструкция по деплою проекта zerodolg-astro

## Автоматический деплой

### Использование PowerShell скрипта (Windows)

Выполните команду:

```powershell
.\deploy.ps1
```

Скрипт автоматически:

1. Очистит содержимое `/var/www/zerodolg.ru/public_html/` на сервере
2. Загрузит содержимое папки `dist` на сервер
3. Установит правильные права доступа

---

## Ручной деплой (пошаговая инструкция)

### Шаг 1: Очистка директории на сервере

Очистите содержимое директории `public_html` на удаленном сервере:

```powershell
ssh zerodolg-server "rm -rf /var/www/zerodolg.ru/public_html/*"
```

> **Внимание:** Эта команда удалит все файлы и папки в указанной директории!

### Шаг 2: Копирование файлов на сервер

Скопируйте содержимое папки `dist` на удаленный сервер:

```powershell
scp -r dist/* zerodolg-server:/var/www/zerodolg.ru/public_html/
```

**Альтернативный вариант с rsync** (если установлен):

```powershell
rsync -avz --delete dist/ zerodolg-server:/var/www/zerodolg.ru/public_html/
```

### Шаг 3: Установка правильных прав доступа

Установите права на файлы и директории:

```powershell
# Установить владельца (замените www-data на актуального пользователя веб-сервера)
ssh zerodolg-server "chown -R www-data:www-data /var/www/zerodolg.ru/public_html/"

# Установить права на директории (755)
ssh zerodolg-server "find /var/www/zerodolg.ru/public_html/ -type d -exec chmod 755 {} \;"

# Установить права на файлы (644)
ssh zerodolg-server "find /var/www/zerodolg.ru/public_html/ -type f -exec chmod 644 {} \;"
```

---

## Одной командой

Все три шага можно выполнить одной командой:

```powershell
ssh zerodolg-server "rm -rf /var/www/zerodolg.ru/public_html/*" && scp -r dist/* zerodolg-server:/var/www/zerodolg.ru/public_html/ && ssh zerodolg-server "chown -R www-data:www-data /var/www/zerodolg.ru/public_html/ && find /var/www/zerodolg.ru/public_html/ -type d -exec chmod 755 {} \; && find /var/www/zerodolg.ru/public_html/ -type f -exec chmod 644 {} \;"
```

---

## Проверка деплоя

После деплоя проверьте, что файлы успешно загружены:

```powershell
ssh zerodolg-server "ls -la /var/www/zerodolg.ru/public_html/"
```

---

## Настройка SSH-подключения

Для упрощения работы рекомендуется настроить SSH-алиас в файле `~/.ssh/config`:

```
Host zerodolg-server
    HostName your-server-ip-or-domain
    User your-username
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

Это позволит использовать короткое имя `zerodolg-server` вместо полного адреса.

---

## Примечания

- **Пользователь веб-сервера**: Убедитесь, что используете правильного
  пользователя вместо `www-data` (может быть `nginx`, `apache`, `www`, и т.д.)
- **Бэкап**: Рекомендуется создавать бэкап перед деплоем
- **Права sudo**: Для команды `chown` может потребоваться sudo-доступ
- **SSH-ключи**: Убедитесь, что настроена аутентификация по ключу для избежания
  ввода пароля

---

## Решение проблем

### Ошибка прав доступа

Если возникают проблемы с правами, выполните на сервере:

```bash
sudo chown -R www-data:www-data /var/www/zerodolg.ru/public_html/
sudo chmod -R 755 /var/www/zerodolg.ru/public_html/
```

### Ошибка подключения SSH

Проверьте подключение:

```powershell
ssh zerodolg-server "echo 'Connection successful'"
```

### Файлы не копируются

Убедитесь, что папка `dist` существует и содержит файлы:

```powershell
ls dist
```
