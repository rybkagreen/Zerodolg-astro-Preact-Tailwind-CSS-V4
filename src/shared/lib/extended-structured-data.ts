// src/shared/lib/extended-structured-data.ts
// Дополнительные структурированные данные для изображений

interface ImageSchemaOptions {
  /** URL изображения */
  url: string;
  /** Название изображения */
  name: string;
  /** Описание изображения */
  description: string;
  /** Ключевые слова */
  keywords?: string[];
  /** Дополнительная информация об объекте, представленном на изображении */
  about?: {
    '@type': string;
    name: string;
    description: string;
  };
}

/**
 * Генерирует Schema.org для изображения
 * @param options Параметры для генерации Image Schema
 * @returns Структурированные данные для изображения
 */
export function generateImageSchema(options: ImageSchemaOptions) {
  const { url, name, description, keywords, about } = options;

  const imageSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name,
    description,
    url,
    contentUrl: url,
  };

  if (keywords && keywords.length > 0) {
    imageSchema.keywords = keywords.join(', ');
  }

  if (about) {
    imageSchema.about = about;
  }

  return imageSchema;
}

/**
 * Генерирует Image Schema для изображений команды
 * @param memberData Данные члена команды
 * @returns Структурированные данные для изображения члена команды
 */
export function generateTeamMemberImageSchema(memberData: {
  name: string;
  position: string;
  photo: string;
  role: string;
  description?: string;
  website?: string;
}) {
  return generateImageSchema({
    url: `https://zerodolg.ru${memberData.photo}`,
    name: memberData.name,
    description: `Фотография ${memberData.name}, ${memberData.position}`,
    keywords: [
      'арбитражный управляющий',
      'юрист по банкротству',
      'банкротство физических лиц',
      memberData.name,
      memberData.position,
      'команда юристов',
    ],
    about: {
      '@type': 'Person',
      name: memberData.name,
      description: `${memberData.name}, ${memberData.position}. ${memberData.description || 'Профессионал в области банкротства физических лиц'}`,
    },
  });
}

/**
 * Генерирует Image Schema для изображений документов/сертификатов
 * @param documentData Данные документа
 * @returns Структурированные данные для изображения документа
 */
export function generateDocumentImageSchema(documentData: {
  title: string;
  description: string;
  image: string;
  issuedBy: string;
  issueDate: string;
  validUntil?: string;
}) {
  return generateImageSchema({
    url: `https://zerodolg.ru${documentData.image}`,
    name: documentData.title,
    description: documentData.description,
    keywords: ['документ', 'сертификат', 'лицензия', 'диплом', documentData.issuedBy],
    about: {
      '@type': 'CreativeWork',
      name: documentData.title,
      description: `${documentData.description}. Выдан: ${documentData.issuedBy}, дата: ${documentData.issueDate}`,
    },
  });
}

/**
 * Генерирует Image Schema для изображений услуг/услуг банкротства
 * @param serviceData Данные услуги
 * @returns Структурированные данные для изображения услуги
 */
export function generateServiceImageSchema(serviceData: {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  provider: string;
}) {
  return generateImageSchema({
    url: `https://zerodolg.ru${serviceData.imageUrl}`,
    name: serviceData.name,
    description: serviceData.description,
    keywords: [
      serviceData.category,
      'банкротство',
      'услуги юриста',
      serviceData.name,
      serviceData.provider,
    ],
    about: {
      '@type': 'Service',
      name: serviceData.name,
      description: serviceData.description,
    },
  });
}
