/**
 * Централизованная конфигурация SEO для zerodolg.ru
 * Автоматическое обновление года и месяца в мета-данных
 */

import {
  getCurrentYear,
  getCurrentMonthYear,
  getCurrentMonthGenitive,
} from '@shared/utils/date-helpers';

/**
 * Базовая конфигурация сайта
 */
export const SITE_CONFIG = {
  name: 'ZeroDolg',
  url: 'https://zerodolg.ru',
  phone: '+7 (905) 577-33-87',
  phoneRaw: '+79055773387',
  email: 'info@zerodolg.ru',
  location: 'Москва',
  fullAddress: 'ул. Минская, Москва, 119590',
  workTime: 'Пн-Пт: 9:00-19:00, Сб: 10:00-16:00',
  workTimeShort: 'Пн-Сб 9:00-19:00',
} as const;

/**
 * SEO-конфигурация с автообновлением дат
 */
export const SEO_CONFIG = {
  /**
   * Главная страница (index)
   */
  home: {
    title: `Банкротство физических лиц Москва: списание долгов ${getCurrentYear()} | ZeroDolg`,
    description:
      'Списание долгов под ключ от 50000₽ за 4 месяца ⚡ Опыт 15 лет ⚡ 98% успешных дел ⚡ Остановим проценты и приставов ⚡ Консультация бесплатно',
    keywords: `банкротство физических лиц москва, списание долгов, банкротство физлиц цена, банкротство под ключ, банкротство москва ${getCurrentYear()}`,
    canonical: 'https://zerodolg.ru/',
  },

  /**
   * Блог
   */
  blog: {
    title: `Блог о банкротстве физических лиц Москва ${getCurrentYear()} | ZeroDolg`,
    description: `Практические статьи о банкротстве физлиц от экспертов ⚡ Пошаговые инструкции по списанию долгов ⚡ Реальные кейсы и советы юристов ⚡ Опыт 15 лет ⚡ Обновлено в ${getCurrentMonthGenitive()} ${getCurrentYear()}`,
    keywords:
      'банкротство статьи, списание долгов советы, банкротство инструкция, блог о банкротстве, реструктуризация долгов москва',
    canonical: 'https://zerodolg.ru/blog/',
  },

  /**
   * Реструктуризация долгов
   */
  restructuring: {
    title: 'Реструктуризация долгов физических лиц Москва от 89000₽ | ZeroDolg',
    description: `Реструктуризация долгов через арбитражный суд ⚡ 100% сохранение имущества ⚡ Льготные условия выплат ⚡ Опыт 15 лет ⚡ 61% успешных дел ⚡ Актуально на ${getCurrentMonthYear()}`,
    keywords: `реструктуризация долгов москва, реструктуризация физических лиц, сохранение имущества при долгах, реструктуризация через арбитражный суд, план реструктуризации долгов, реструктуризация ${getCurrentYear()}`,
    canonical: 'https://zerodolg.ru/restrukturizaciya-dolgov',
  },

  /**
   * Банкротство с сохранением имущества
   */
  bankruptcyWithAssets: {
    title: `Банкротство с сохранением имущества Москва ${getCurrentYear()} | ZeroDolg`,
    description:
      'Законное банкротство с защитой имущества ⚡ Сохраните квартиру и автомобиль ⚡ Легальные способы ⚡ Опыт 15 лет ⚡ Консультация бесплатно',
    keywords: `банкротство с сохранением имущества, банкротство сохранить квартиру, защита имущества при банкротстве, банкротство москва ${getCurrentYear()}`,
    canonical: 'https://zerodolg.ru/bankrotstvo-s-sokhraneniyem-imushchestva',
  },

  /**
   * Политика конфиденциальности
   */
  privacy: {
    title: 'Политика конфиденциальности | ZeroDolg',
    description:
      'Политика конфиденциальности сайта zerodolg.ru. Обработка персональных данных, защита информации, права пользователей.',
    keywords: 'политика конфиденциальности, защита данных, персональные данные',
    canonical: 'https://zerodolg.ru/privacy',
  },

  /**
   * Условия использования
   */
  terms: {
    title: 'Условия использования | ZeroDolg',
    description:
      'Условия использования сайта zerodolg.ru. Правила предоставления услуг, ответственность сторон, порядок взаимодействия.',
    keywords: 'условия использования, правила сайта, пользовательское соглашение',
    canonical: 'https://zerodolg.ru/terms',
  },

  /**
   * Дефолтные значения
   */
  default: {
    title: 'Банкротство физических лиц в Москве — списание долгов | ZeroDolg',
    description:
      '⭐ 98% успешных дел! Законное списание долгов через банкротство физических лиц. ✅ Остановим проценты ✅ Защитим имущество ✅ Гарантия по договору.',
    keywords: `банкротство физических лиц, списание долгов, банкротство физлиц ${getCurrentYear()}, защита от коллекторов, реструктуризация долгов, арбитражный управляющий, Москва`,
    image: '/images/og-image.jpg',
  },
} as const;

/**
 * Open Graph конфигурация
 */
export const OG_CONFIG = {
  siteName: SITE_CONFIG.name,
  locale: 'ru_RU',
  type: 'website',
  defaultImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image',
} as const;

/**
 * Структурированные данные (Schema.org)
 */
export const SCHEMA_CONFIG = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Минская',
      addressLocality: 'Москва',
      addressCountry: 'RU',
      postalCode: '119590',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '55.724143',
      longitude: '37.504754',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
    },
    priceRange: '₽₽',
    openingHours: ['Mo-Fr 09:00-19:00', 'Sa 10:00-16:00'],
  },
} as const;

/**
 * Вспомогательная функция для генерации Title страницы статьи блога
 * @param articleTitle - Заголовок статьи
 * @returns Полный Title для страницы
 */
export const getBlogArticleTitle = (articleTitle: string): string => {
  return `${articleTitle} | Блог о банкротстве ZeroDolg`;
};

/**
 * Вспомогательная функция для генерации Description из содержимого статьи
 * @param content - Содержимое статьи
 * @param maxLength - Максимальная длина (по умолчанию 155 символов)
 * @returns Описание для мета-тега
 */
export const generateDescriptionFromContent = (
  content: string,
  maxLength: number = 155
): string => {
  // Убираем HTML-теги и лишние пробелы
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Обрезаем до нужной длины
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Обрезаем по последнему полному слову
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
};

/**
 * Генерация canonical URL
 * @param path - Путь страницы
 * @returns Полный canonical URL
 */
export const getCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
};

/**
 * Экспорт утилит для использования в компонентах
 */
export {
  getCurrentYear,
  getCurrentMonthYear,
  getCurrentMonthGenitive,
} from '@shared/utils/date-helpers';
