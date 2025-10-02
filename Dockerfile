# Multi-stage build для оптимизации размера образа

# Stage 1: Build
FROM node:20-alpine AS builder

# Установка системных зависимостей
RUN apk add --no-cache libc6-compat

# Установка рабочей директории
WORKDIR /app

# Копирование package files
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Копирование исходного кода
COPY . .

# Копирование .env файла для staging (если есть)
# В production используйте environment variables
COPY .env.example .env

# Build проекта
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS runner

# Метаданные образа
LABEL maintainer="info@zerodolg.ru"
LABEL description="ZeroDolg Astro - Production/Staging Build"
LABEL version="0.0.1"

# Установка дополнительных пакетов для тестирования
RUN apk add --no-cache curl

# Копирование nginx конфигурации
COPY nginx.conf /etc/nginx/nginx.conf

# Копирование built файлов из builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Создание директории для логов
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
