// Team members data for the interactive team section
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
}

export const teamMembers: TeamMember[] = [
  {
    id: 'mashulia',
    name: 'Масхулиа Л.З.',
    position: 'Руководитель компании',
    photo: '/images/team/mashulia.webp',
    role: 'Руководитель компании',
    quote:
      'Наша задача - не просто списать долги, а помочь вам начать новую жизнь без финансового бремени',
    description:
      'Более 12 лет специализируется на банкротстве физических лиц. Провела более 500 успешных дел. Эксперт в области финансового права и процедур банкротства.',
    stats: {
      experience: '12+',
      cases: '1000+',
      success: '100%',
    },
    specializations: [
      'Банкротство физических лиц',
      'Реструктуризация долгов',
      'Защита имущества',
      'Оспаривание сделок',
    ],
    achievements: [
      'Списано долгов на сумму более 2 млрд рублей',
      'Сохранено имущество в 89% случаев',
      'Средний срок процедуры - 6 месяцев',
      'Работа со сложными категориями дел',
    ],
    contacts: {
      phone: '+7 (495) 790-60-03',
      email: 'info@zerodolg.ru',
    },
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
      success: '94%',
    },
    specializations: [
      'Судебная защита',
      'Работа с кредиторами',
      'Сопровождение процедур',
      'Консультирование',
    ],
    achievements: [
      'Выиграно 95% судебных дел',
      'Специализация на ипотечных долгах',
      'Работа с долгами перед банками',
      'Защита от коллекторов',
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
      success: '93%',
    },
    specializations: [
      'Финансовый анализ',
      'Подготовка документов',
      'Экспертиза договоров',
      'Оценка рисков',
    ],
    achievements: [
      'Разработка стратегий защиты имущества',
      'Экспертиза более 1000 кредитных договоров',
      'Выявление незаконных начислений',
      'Оптимизация процедур банкротства',
    ],
    contacts: {
      phone: '+7 (495) 790-60-03',
      email: 'info@zerodolg.ru',
    },
  },
  {
    id: 'bryantsev',
    name: 'Брянцев А.',
    position: 'Финансовый управляющий',
    photo: '/images/team/briancev.webp',
    role: 'Арбитражный управляющий',
    quote: 'Моя цель - провести процедуру максимально быстро и с минимальными потерями для клиента',
    description:
      'Арбитражный управляющий с опытом работы более 6 лет. Член СРО арбитражных управляющих.',
    stats: {
      experience: '6+',
      cases: '400+',
      success: '97%',
    },
    specializations: [
      'Процедура реализации имущества',
      'Реструктуризация долгов',
      'Работа с судами',
      'Взаимодействие с кредиторами',
    ],
    achievements: [
      'Проведено более 400 процедур банкротства',
      'Средний срок процедуры - 5 месяцев',
      'Сохранение единственного жилья в 100% случаев',
      'Минимизация судебных расходов',
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
    if (expMatch && expMatch[1]) totalExperience += parseInt(expMatch[1], 10);

    // Extract numbers from cases string (e.g., "1000+" -> 1000)
    const casesMatch = member.stats.cases.match(/(\d+)/);
    if (casesMatch && casesMatch[1]) totalCases += parseInt(casesMatch[1], 10);

    // Extract success rate (e.g., "96%" -> 96)
    const successMatch = member.stats.success.match(/(\d+)/);
    if (successMatch && successMatch[1]) successRates.push(parseInt(successMatch[1], 10));
  });

  // Calculate average success rate
  const avgSuccessRate =
    successRates.length > 0
      ? Math.round(successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length)
      : 95;

  return {
    totalExperience: totalExperience > 0 ? `${totalExperience}+` : '22+',
    totalCases: totalCases > 0 ? `${totalCases}+` : '1450+',
    totalSaved: '2 млрд ₽',
    successRate: `${avgSuccessRate}%`,
  };
};
