#!/bin/bash

# Скрипт для удаления всех блоков <style> из .astro файлов

echo "🧹 Удаление inline стилей из Astro компонентов..."

# Находим все .astro файлы с блоками <style>
files_with_styles=$(grep -l "<style>" src/components/**/*.astro 2>/dev/null)

if [ -z "$files_with_styles" ]; then
    echo "✅ Inline стили не найдены"
    exit 0
fi

# Счетчик обработанных файлов
count=0

# Обрабатываем каждый файл
for file in $files_with_styles; do
    echo "📝 Обработка: $file"
    
    # Создаем резервную копию
    cp "$file" "$file.backup"
    
    # Удаляем блок <style>...</style>
    # Используем awk для удаления многострочных блоков
    awk '
    /<style[^>]*>/ { 
        in_style = 1
        next
    }
    /<\/style>/ { 
        if (in_style) {
            in_style = 0
            next
        }
    }
    !in_style { print }
    ' "$file.backup" > "$file"
    
    # Удаляем резервную копию если все прошло успешно
    if [ $? -eq 0 ]; then
        rm "$file.backup"
        ((count++))
        echo "   ✅ Очищено"
    else
        echo "   ❌ Ошибка! Восстановление из резервной копии..."
        mv "$file.backup" "$file"
    fi
done

echo ""
echo "🎉 Готово! Обработано файлов: $count"
echo ""
echo "📋 Список обработанных файлов:"
echo "$files_with_styles" | while read file; do
    echo "   - $file"
done

echo ""
echo "⚠️  Важно: Убедитесь, что main.css подключен в Layout.astro"
echo "    и содержит все необходимые стили из public_html/src/styles/"
