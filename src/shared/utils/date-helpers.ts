/**
 * Утилиты для работы с датами в SEO-метаданных
 * Автоматическое обновление года и месяца для Title и Description
 */

/**
 * Получить текущий год
 * @returns Текущий год (например, 2025)
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Получить текущий месяц и год в формате "октябрь 2025"
 * @returns Месяц и год на русском языке
 */
export const getCurrentMonthYear = (): string => {
  return new Date().toLocaleString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Получить название месяца в родительном падеже
 * Для использования в фразах типа "Обновлено в октября 2025"
 * @returns Название месяца в родительном падеже
 */
export const getCurrentMonthGenitive = (): string => {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  return months[new Date().getMonth()];
};

/**
 * Получить название месяца в именительном падеже
 * @returns Название месяца (например, "октябрь")
 */
export const getCurrentMonth = (): string => {
  return new Date().toLocaleString('ru-RU', { month: 'long' });
};

/**
 * Получить короткое название месяца
 * @returns Короткое название (например, "окт")
 */
export const getCurrentMonthShort = (): string => {
  return new Date().toLocaleString('ru-RU', { month: 'short' });
};

/**
 * Получить квартал текущего года
 * @returns Номер квартала (1, 2, 3, 4)
 */
export const getCurrentQuarter = (): number => {
  const month = new Date().getMonth();
  return Math.floor(month / 3) + 1;
};

/**
 * Получить сезон года
 * @returns Название сезона на русском
 */
export const getCurrentSeason = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'весна';
  if (month >= 5 && month <= 7) return 'лето';
  if (month >= 8 && month <= 10) return 'осень';
  return 'зима';
};

/**
 * Форматирует дату в формате "DD.MM.YYYY"
 * @param date Дата для форматирования
 * @returns Отформатированная дата
 */
export const formatDate = (date: Date = new Date()): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Генерирует timestamp для кеширования
 * Обновляется раз в день
 * @returns Timestamp в формате YYYYMMDD
 */
export const getDailyCacheKey = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
