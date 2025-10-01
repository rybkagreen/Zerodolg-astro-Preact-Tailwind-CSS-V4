/**
 * Единые константы для всего сайта
 * Все цифры, даты и ключевые показатели в одном месте для консистентности
 */

export const SITE_CONSTANTS = {
  // === ОСНОВНАЯ ИНФОРМАЦИЯ О КОМПАНИИ ===
  company: {
    name: 'ZeroDolg',
    fullName: 'ООО "ЮРИДИЧЕСКАЯ КОМПАНИЯ МАСХУЛИА"',
    brandName: 'zerodolg.ru',
    established: 2008,
    inn: '9729317468',
    ogrn: '1217700631697',
  },

  // === КОНТАКТНЫЕ ДАННЫЕ ===
  contacts: {
    phone: '+7 (905) 577-33-87',
    phoneClean: '+79055773387',
    email: 'info@zerodolg.ru',
    workTime: 'Ежедневно с 9:00 до 21:00',
    workTimeShort: '9:00-21:00',
    address: {
      street: 'Минская ул., 2Ж, Victory Park Plaza, офис 10/3-7',
      office: 'офис 10/3-7',
      city: 'Москва',
      metro: 'Минская',
      walkTime: '3 минуты от метро',
    },
  },

  // === СТАТИСТИКА КОМПАНИИ (АКТУАЛЬНАЯ НА 2025) ===
  stats: {
    // Основные показатели (консистентные)
    clients: {
      count: 1200,
      label: 'Довольных клиентов',
      display: '1200+',
    },
    experience: {
      years: 17, // с 2008 года до 2025
      label: 'На рынке юруслуг',
      display: '17 лет',
    },
    debtCleared: {
      amount: 1.2,
      unit: 'млрд ₽',
      label: 'Списанных долгов',
      display: '1.2 млрд ₽',
      shortDisplay: '1.2M+',
    },
    successRate: {
      percent: 98, // Реалистичная цифра
      label: 'Успешных дел',
      display: '98%',
    },
    averageTime: {
      months: '4-6',
      label: 'Средний срок процедуры',
      display: '4-6 мес.',
      detailed: '4-6 месяцев в среднем',
    },
  },

  // === ИНФОРМАЦИЯ О РУКОВОДИТЕЛЕ ===
  manager: {
    name: 'Масхулиа Леван Зурабович',
    shortName: 'Масхулиа Л.З.',
    position: 'Арбитражный финансовый управляющий (ИНН 505014806562)',
    fullPosition: 'Руководитель компании, Арбитражный финансовый управляющий',
    personalInn: '505014806562',
    experience: {
      years: 12,
      display: '12+ лет опыта',
    },
    cases: {
      count: 1000,
      display: '1000+ успешных дел',
    },
    photo: '/images/team/mashulia.webp',
  },

  // === УСЛУГИ И ЦЕНЫ ===
  services: {
    // Сроки процедур (стандартизированные)
    timeline: {
      extrajudicial: {
        min: 3,
        max: 6,
        display: '3-6 месяцев',
        description: 'Внесудебное банкротство через МФЦ',
      },
      judicial: {
        min: 6,
        max: 12,
        display: '6-12 месяцев',
        description: 'Судебное банкротство через Арбитражный суд',
      },
      average: {
        months: '4-6',
        display: '4-6 месяцев в среднем',
        note: 'С нашей профессиональной помощью',
      },
    },

    // Цены (актуальные)
    pricing: {
      extrajudicial: {
        from: 10000,
        display: 'от 10 000 ₽',
        description: 'Внесудебное банкротство',
      },
      judicial: {
        monthly: 5900,
        display: 'от 5 900 ₽/мес',
        description: 'Судебное банкротство',
        installment: 'Рассрочка до 24 месяцев',
      },
      consultation: {
        price: 0,
        display: 'БЕСПЛАТНО',
        note: 'Первичная консультация',
      },
    },
  },

  // === ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ ===
  legal: {
    law: {
      number: '№127-ФЗ',
      name: 'О несостоятельности (банкротстве)',
      fullName: 'Федеральный закон №127-ФЗ «О несостоятельности»',
    },
    fedresurs: {
      url: 'https://old.bankrot.fedresurs.ru/ArbitrManagerCard.aspx?ID=0fe01101-9000-45a5-9a14-31d86002b6ba',
      title: 'Единый федеральный реестр сведений о банкротстве',
    },
  },

  // === ПРЕИМУЩЕСТВА ===
  benefits: {
    protection: {
      property: 'Единственное жилье защищено законом',
      collectors: 'Защита от коллекторов с первого дня',
      interests: 'Остановка начисления процентов и штрафов',
    },
    timeline: {
      fastResponse: 'Ответ в течение 5 минут',
      consultation: 'Консультация в день обращения',
      process: 'Процедура 4-6 месяцев',
    },
    guarantee: {
      success: 'Гарантия результата по договору',
      refund: 'Возврат средств при неуспехе',
      full_support: 'Полное юридическое сопровождение',
    },
  },

  // === SEO И МЕТА-ДАННЫЕ ===
  seo: {
    title:
      '💰 Банкротство физических лиц в Москве - Списание долгов от 50 000₽ за 4-6 месяцев | ZeroDolg',
    description:
      '⭐ 98% успешных дел в Москве! Законное списание долгов через банкротство физических лиц. ✅ Остановим проценты ✅ Защитим имущество ✅ Гарантия по договору. 🎯 Консультация БЕСПЛАТНО!',
    keywords:
      'банкротство физических лиц Москва, списание долгов через суд Москва, банкротство физлиц 2025 Московская область',
  },

  // === ПРОМО И АКЦИИ ===
  promo: {
    consultation: {
      title: 'Консультация БЕСПЛАТНО',
      description: 'Получите бесплатную консультацию и план действий',
      availability: 'Ограниченное количество мест',
      note: 'Без обязательств',
    },
    discount: {
      percent: 30,
      description: 'Скидка на услуги при заключении договора в день консультации',
    },
  },

  // === СОЦИАЛЬНЫЕ ДОКАЗАТЕЛЬСТВА ===
  testimonials: {
    examples: [
      { name: 'Анна К.', amount: '1.8 млн ₽', time: '4 месяца' },
      { name: 'Дмитрий П.', amount: '3.2 млн ₽', time: '5 месяцев' },
      { name: 'Елена С.', amount: '2.4 млн ₽', time: '4 месяца' },
      { name: 'Максим В.', amount: '4.7 млн ₽', time: '6 месяцев' },
      { name: 'Ольга Р.', amount: '1.6 млн ₽', time: '4 месяца' },
      { name: 'Игорь Л.', amount: '5.1 млн ₽', time: '5 месяцев' },
    ],
  },
} as const;

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

/**
 * Получить текущий год
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Вычислить опыт работы компании
 */
export const getCompanyExperience = (): number => {
  return getCurrentYear() - SITE_CONSTANTS.company.established;
};

/**
 * Получить актуальную статистику с учетом текущего года
 */
export const getActualStats = () => {
  const currentExperience = getCompanyExperience();

  return {
    ...SITE_CONSTANTS.stats,
    experience: {
      ...SITE_CONSTANTS.stats.experience,
      years: currentExperience,
      display: `${currentExperience} лет`,
    },
  };
};

/**
 * Форматировать номер телефона для отображения
 */
export const formatPhoneForDisplay = (phone: string = SITE_CONSTANTS.contacts.phone): string => {
  return phone;
};

/**
 * Форматировать номер телефона для ссылок tel:
 */
export const formatPhoneForLink = (phone: string = SITE_CONSTANTS.contacts.phoneClean): string => {
  return phone;
};

/**
 * Получить актуальные даты для промо акций
 */
export const getPromoInfo = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('ru', { month: 'long' });
  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).toLocaleString('ru', { month: 'long' });

  return {
    currentMonth,
    nextMonth,
    availability: `Ограниченное количество мест на ${currentMonth}`,
    deadline: `до конца ${currentMonth}`,
  };
};

// === ЭКСПОРТ ТИПОВ ===
export type SiteConstants = typeof SITE_CONSTANTS;
export type CompanyStats = typeof SITE_CONSTANTS.stats;
export type ContactInfo = typeof SITE_CONSTANTS.contacts;
export type ManagerInfo = typeof SITE_CONSTANTS.manager;
