# Руководство по работе с Alibaba CMS

## Общая информация

Alibaba CMS - это облачная система управления контентом, которая позволяет управлять контентом сайта без необходимости изменения кода.

## Структура контента

### Типы контента

1. **team** - информация о членах команды
2. **reviews** - отзывы клиентов
3. **blog** - блог посты

### Модели данных

#### Член команды (team)
```javascript
{
  name: string,           // Имя
  position: string,       // Должность
  photo: media,           // Фото (опционально)
  bio: text,              // Биография
  experience: string,     // Опыт работы
  specializations: array, // Специализации
  achievements: array,    // Достижения
  contacts: object        // Контактная информация
}
```

#### Отзыв (reviews)
```javascript
{
  author: string,         // Автор
  rating: number,         // Рейтинг (1-5)
  date: date,             // Дата
  text: text,             // Текст отзыва
  caseDetails: object     // Детали дела (опционально)
}
```

#### Блог пост (blog)
```javascript
{
  title: string,          // Заголовок
  description: text,      // Описание
  pubDate: date,          // Дата публикации
  updatedDate: date,      // Дата обновления
  heroImage: media,       // Главное изображение
  tags: array,            // Теги
  content: richtext       // Содержимое
}
```

## Интеграция с сайтом

### Сервисы

Интеграция осуществляется через сервисы, расположенные в `/src/lib/`:

1. **alibaba-cms.js** - низкоуровневое API взаимодействие
2. **content-service.js** - сервис для получения контента
3. **cms-content-models.js** - модели данных

### Получение данных

#### Получение всех записей типа
```javascript
import { getTeamMembers, getReviews, getBlogPosts } from '../../lib/content-service.js';

const teamMembers = await getTeamMembers();
const reviews = await getReviews();
const blogPosts = await getBlogPosts();
```

#### Получение одной записи
```javascript
import { getTeamMemberById, getBlogPostByIdentifier } from '../../lib/content-service.js';

const member = await getTeamMemberById('member-id');
const post = await getBlogPostByIdentifier('post-slug');
```

### Fallback данные

При недоступности CMS или отсутствии данных, компоненты используют fallback данные, определенные в коде.

## Работа с компонентами

### TeamInteractive.astro

Компонент использует данные из CMS для отображения информации о членах команды. При недоступности CMS отображаются статичные данные.

### Reviews.astro

Компонент использует данные из CMS для отображения отзывов клиентов. При недоступности CMS отображаются статичные данные.

## Добавление новых типов контента

1. Добавить модель в `cms-content-models.js`
2. Добавить функции получения данных в `alibaba-cms.js`
3. Добавить сервисные функции в `content-service.js`
4. Обновить компоненты для использования новых данных

## Отладка

### Проверка соединения с CMS
```javascript
// В консоли браузера
console.log('CMS API Base:', import.meta.env.CMS_API_BASE);
console.log('CMS API Key exists:', !!import.meta.env.CMS_API_KEY);
```

### Логирование ошибок
Все ошибки получения данных из CMS логируются в консоль с префиксом `[Alibaba CMS]`.

## Конфигурация

### Переменные окружения
```env
CMS_API_BASE=https://your-cms-endpoint.alibabacloud.com
CMS_API_KEY=your-api-key-here
```

### Настройка в коде
Файл `alibaba-cms.js` содержит конфигурацию для подключения к API CMS.