// Team members data for the interactive team section
import { SITE_CONSTANTS } from '../shared/config/constants';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  role: string;
  quote: string;
  description: string;
  stats: {
    experience: string;
    cases: string;
    success: string;
  };
  specializations: string[];
  achievements: string[];
  contacts: {
    phone: string;
    email: string;
  };
  documents?: {
    title: string;
    type: string;
    image: string;
    description: string;
    alt: string;
    keywords: string[];
    hashtags: string[];
    issuedBy?: string;
    issueDate?: string;
    validUntil?: string;
    documentNumber?: string;
    seoTitle: string;
    seoDescription: string;
  }[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'mashulia',
    name: SITE_CONSTANTS.manager.name,
    position: SITE_CONSTANTS.manager.fullPosition,
    photo: SITE_CONSTANTS.manager.photo,
    role: SITE_CONSTANTS.manager.fullPosition,
    quote:
      'Наши клиенты — наш главный приоритет. Мы прилагаем все усилия, чтобы обеспечить их успех и облегчить процесс банкротства',
    description: `Более ${SITE_CONSTANTS.manager.experience.years} лет специализируется на банкротстве физических лиц. Провел более ${SITE_CONSTANTS.manager.cases.count} успешных дел. Эксперт в области финансового права и процедур банкротства. Арбитражный финансовый управляющий (ИНН ${SITE_CONSTANTS.manager.personalInn}).`,
    stats: {
      experience: `${SITE_CONSTANTS.manager.experience.years}+`,
      cases: `${SITE_CONSTANTS.manager.cases.count}+`,
      success: '100%',
    },
    specializations: [
      'Банкротство физических лиц',
      'Реструктуризация долгов',
      'Защита имущества',
      'Оспаривание сделок',
      'Антикризисное управление',
    ],
    achievements: [
      'Списано долгов на 500+ млн рублей',
      'Сохранено имущество в 90% случаев',
      'Средний срок процедуры 6 мес.',
      'Активный арбитражный управляющий',
    ],
    contacts: {
      phone: '+7 (495) 790-60-03',
      email: 'info@zerodolg.ru',
    },
    documents: [
      {
        title: 'Диплом по антикризисному управлению',
        type: 'Диплом',
        image: '/images/proof/diplom_antikrizisnoe_upravlenie_page_1.webp',
        description:
          'Диплом о профессиональной переподготовке по программе "Антикризисное управление"',
        alt: 'Диплом о профессиональной переподготовке по антикризисному управлению - подтверждение квалификации арбитражного управляющего',
        keywords: [
          'диплом антикризисное управление',
          'профессиональная переподготовка',
          'арбитражный управляющий',
          'квалификация банкротство',
          'образование финансовое право',
          'сертификация управляющий',
          'документ об образовании',
        ],
        hashtags: [
          '#дипломантикризисноеуправление',
          '#профессиональнаяпереподготовка',
          '#арбитражныйуправляющий',
          '#квалификациябанкротство',
          '#образованиефинансовоеправо',
          '#сертификацияуправляющий',
          '#документобобразовании',
        ],
        seoTitle: 'Диплом по антикризисному управлению - Леван Масхулиа',
        seoDescription:
          'Официальный диплом о профессиональной переподготовке по программе Антикризисное управление. Подтверждение квалификации арбитражного управляющего для процедур банкротства физических лиц.',
      },
      {
        title: 'Диплом по антикризисному управлению (стр. 2)',
        type: 'Диплом',
        image: '/images/proof/diplom_antikrizisnoe_upravlenie_page_2.webp',
        description: 'Продолжение диплома с указанием изученных дисциплин и квалификации',
        alt: 'Вторая страница диплома по антикризисному управлению с перечнем дисциплин и полученной квалификацией',
        keywords: [
          'дисциплины антикризисное управление',
          'учебный план банкротство',
          'квалификация специалист',
          'образовательная программа',
          'профессиональное обучение',
          'документ об образовании',
          'сертификат специалиста',
        ],
        hashtags: [
          '#дисциплиныантикризисноеуправление',
          '#учебныйпланбанкротство',
          '#квалификацияспециалист',
          '#образовательнаяпрограмма',
          '#профессиональноеобучение',
          '#документобобразовании',
          '#сертификатспециалиста',
        ],
        seoTitle: 'Программа обучения по антикризисному управлению - Леван Масхулиа',
        seoDescription:
          'Детальная информация о программе обучения по антикризисному управлению: перечень дисциплин, квалификация специалиста по банкротству физических лиц.',
      },
      {
        title: 'Повышение квалификации',
        type: 'Сертификат',
        image: '/images/proof/povishenie_kvalifikacii.webp',
        description:
          'Удостоверение о повышении квалификации в области банкротства и арбитражного управления',
        alt: 'Удостоверение о повышении квалификации арбитражного управляющего по банкротству физических лиц',
        keywords: [
          'повышение квалификации банкротство',
          'удостоверение арбитражный управляющий',
          'обучение банкротство физлиц',
          'квалификация юрист',
          'официальный сертификат',
          'непрерывное образование',
          'профессиональное развитие',
        ],
        hashtags: [
          '#повышениеквалификациибанкротство',
          '#удостоверениеарбитражныйуправляющий',
          '#обучениебанкротствофизлиц',
          '#квалификацияюрист',
          '#официальныйсертификат',
          '#непрерывноеобразование',
          '#профессиональноеразвитие',
        ],
        seoTitle: 'Сертификат о повышении квалификации - Леван Масхулиа',
        seoDescription:
          'Официальное удостоверение о повышении квалификации арбитражного управляющего в области банкротства физических лиц. Непрерывное профессиональное обучение юриста.',
      },
      {
        title: 'Свидетельство о стажировке',
        type: 'Свидетельство',
        image: '/images/proof/svidetelstvo_o_stazhirovke_arbitr_ruller.png',
        description: 'Свидетельство о прохождении стажировки арбитражного управляющего',
        alt: 'Официальное свидетельство о прохождении стажировки арбитражного управляющего для работы с банкротством физических лиц',
        keywords: [
          'стажировка арбитражный управляющий',
          'практика банкротство',
          'обучение на практике',
          'официальное свидетельство',
          'профессиональная подготовка',
          'практические навыки',
          'менторство юристов',
        ],
        hashtags: [
          '#стажировкаарбитражныйуправляющий',
          '#практикабанкротство',
          '#обучениенапрактике',
          '#официальноесвидетельство',
          '#профессиональнаяподготовка',
          '#практическиенавыки',
          '#менторствоюристов',
        ],
        seoTitle: 'Свидетельство о стажировке - Леван Масхулиа',
        seoDescription:
          'Официальное свидетельство о прохождении практической стажировки арбитражного управляющего. Подтверждение профессиональной подготовки в области банкротства.',
      },
    ],
  },
  {
    id: 'strukova',
    name: 'Струкова А.',
    position: 'Ведущий юрист',
    photo: '/images/team/angelika.webp',
    role: 'Ведущий юрист по банкротству',
    quote: 'Каждый случай уникален, и мы находим индивидуальное решение для каждого клиента',
    description:
      'Специалист по сложным делам банкротства. Опыт работы более 5 лет. Успешно провела более 300 процедур банкротства.',
    stats: {
      experience: '5+',
      cases: '300+',
      success: '100%',
    },
    specializations: [
      'Судебная защита',
      'Работа с кредиторами',
      'Сопровождение процедур',
      'Консультирование',
    ],
    achievements: [
      'Списано долгов на 300+ млн ₽',
      'Специалист по ипотечным долгам',
      'Защита от коллекторов',
      'Эксперт по судебной защите',
    ],
    contacts: {
      phone: '+7 (495) 790-60-03',
      email: 'info@zerodolg.ru',
    },
  },
  {
    id: 'pashkova',
    name: 'Пашкова Д.К.',
    position: 'Юрист-аналитик',
    photo: '/images/team/pashkova.webp',
    role: 'Юрист-аналитик',
    quote: 'Правильный анализ ситуации - это 50% успеха в деле о банкротстве',
    description:
      'Эксперт по анализу финансовой документации и подготовке дел к банкротству. Опыт работы 4 года.',
    stats: {
      experience: '4+',
      cases: '250+',
      success: '100%',
    },
    specializations: [
      'Финансовый анализ',
      'Подготовка документов',
      'Экспертиза договоров',
      'Оценка рисков',
    ],
    achievements: [
      'Списано долгов на 250+ млн ₽',
      'Экспертиза 1000+ договоров',
      'Выявление незаконных начислений',
      'Оптимизация процессов',
    ],
    contacts: {
      phone: '+7 (495) 790-60-03',
      email: 'info@zerodolg.ru',
    },
  },
  {
    id: 'bryantsev',
    name: 'Брянцев Александр',
    position: 'Юрист',
    photo: '/images/team/briancev.webp',
    role: 'Юрист-консультант',
    quote:
      'Качественное юридическое сопровождение — это основа успешного решения любых правовых вопросов',
    description:
      'Юрист с 10-летним опытом юридической практики. Специализируется на юридическом сопровождении компаний и частных лиц по вопросам корпоративного, гражданского, налогового и трудового права.',
    stats: {
      experience: '10+',
      cases: '500+',
      success: '95%',
    },
    specializations: [
      'Корпоративное право',
      'Гражданское право',
      'Налоговое право',
      'Трудовое право',
      'Юридическое сопровождение бизнеса',
    ],
    achievements: [
      'Проведено 500+ юридических консультаций',
      'Сопровождение компаний разных отраслей',
      'Эксперт по налоговому планированию',
      'Консультант по трудовым спорам',
    ],
    contacts: {
      phone: '+7 (495) 790-60-03',
      email: 'info@zerodolg.ru',
    },
  },
];

interface TeamStats {
  totalExperience: string;
  totalCases: string;
  totalSaved: string;
  successRate: string;
}

// Calculate team statistics
export const calculateTeamStats = (members: TeamMember[]): TeamStats => {
  let totalExperience = 0;
  let totalCases = 0;
  const successRates: number[] = [];

  members.forEach((member) => {
    // Extract numbers from experience string (e.g., "7+" -> 7)
    const expMatch = member.stats.experience.match(/(\d+)/);
    if (expMatch?.[1]) {
      totalExperience += parseInt(expMatch[1], 10);
    }

    // Extract numbers from cases string (e.g., "1000+" -> 1000)
    const casesMatch = member.stats.cases.match(/(\d+)/);
    if (casesMatch?.[1]) {
      totalCases += parseInt(casesMatch[1], 10);
    }

    // Extract success rate (e.g., "96%" -> 96)
    const successMatch = member.stats.success.match(/(\d+)/);
    if (successMatch?.[1]) {
      successRates.push(parseInt(successMatch[1], 10));
    }
  });

  // Calculate average success rate
  const avgSuccessRate =
    successRates.length > 0
      ? Math.round(successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length)
      : 95;

  return {
    totalExperience: totalExperience > 0 ? `${totalExperience}+` : '27+',
    totalCases: totalCases > 0 ? `${totalCases}+` : '1950+',
    totalSaved: '1.2 млрд ₽',
    successRate: `${avgSuccessRate}%`,
  };
};
