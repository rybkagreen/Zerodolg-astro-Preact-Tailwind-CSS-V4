# 🤖 Puppeteer MCP Server

Автоматизация браузера через протокол MCP для просмотра и взаимодействия с веб-страницами.

## 🚀 Быстрый старт

```bash
# 1. Запустить MCP сервер
npm run mcp:puppeteer

# 2. Подключить MCP клиент (Claude Desktop, VS Code с MCP, Qwen AI)

# 3. Использовать инструменты браузера
```

## 📋 Основные возможности

- ✅ **Навигация по сайтам** - `navigate_to_url`
- 📸 **Скриншоты страниц** - `take_screenshot`
- 📄 **Извлечение HTML** - `get_page_content`
- 🖱️ **Клик по элементам** - `click_element`
- ⌨️ **Ввод текста** - `type_text`
- 🧪 **Выполнение JS** - `evaluate_javascript`
- 📐 **Управление viewport** - `set_viewport_size`

## 🔧 Конфигурация

### Claude Desktop

Добавьте в `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "puppeteer-browser": {
      "command": "node",
      "args": ["D:\\path\\to\\your\\project\\mcp-puppeteer-server.js"],
      "cwd": "D:\\path\\to\\your\\project"
    }
  }
}
```

### VS Code MCP

Конфигурация в `.vscode/mcp.json` уже настроена.

### Qwen AI

Конфигурация в `.qwen/mcp.json` уже настроена.

## 💻 Команды

```bash
# Запуск с красивым выводом
npm run mcp:puppeteer

# Прямой запуск сервера
npm run mcp:server

# Тестирование сервера
node test-mcp-server.js
```

## 📂 Структура файлов

```
├── mcp-puppeteer-server.js     # Основной MCP сервер
├── scripts/
│   └── start-mcp-puppeteer.js  # Скрипт запуска
├── test-mcp-server.js          # Тестовый скрипт
├── screenshots/                # Папка для скриншотов
├── .vscode/mcp.json           # Конфигурация VS Code
├── .qwen/mcp.json             # Конфигурация Qwen
└── docs/puppeteer-mcp-guide.md # Подробная документация
```

## 🎯 Пример использования

1. **Откройте сайт:**

   ```
   navigate_to_url: https://example.com
   ```

2. **Сделайте скриншот:**

   ```
   take_screenshot: homepage
   ```

3. **Получите заголовок:**

   ```
   get_page_title
   ```

4. **Найдите элемент и кликните:**
   ```
   click_element: .button-primary
   ```

## 📖 Полная документация

Подробное руководство: [docs/puppeteer-mcp-guide.md](docs/puppeteer-mcp-guide.md)

## ⚠️ Требования

- Node.js 18.17.1+
- Puppeteer (установлен)
- MCP SDK (установлен)
- Chrome/Chromium (загружается автоматически)

---

**Готово! 🎉** Теперь у вас есть полнофункциональный браузер через MCP протокол.
