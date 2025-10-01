/**
 * Hash Utilities для Enhanced Conversions
 * Хеширование пользовательских данных с помощью SHA-256
 */

/**
 * Хеширование строки с использованием SHA-256
 * @param data - Строка для хеширования
 * @returns Promise с хешированной строкой в hex формате
 */
export async function hashSHA256(data: string): Promise<string> {
  if (!data) return '';

  try {
    // Нормализация: lowercase и trim
    const normalized = data.toLowerCase().trim();

    // Проверяем поддержку Web Crypto API
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      console.warn('Web Crypto API not supported, using fallback');
      return fallbackHash(normalized);
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

    // Преобразуем ArrayBuffer в hex строку
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  } catch (error) {
    console.error('Hashing error:', error);
    return '';
  }
}

/**
 * Fallback хеширование для старых браузеров (простейшая версия)
 * НЕ криптографически безопасно, только для совместимости
 */
function fallbackHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Хеширование email адреса
 * @param email - Email адрес
 * @returns Promise с хешированным email
 */
export async function hashEmail(email: string): Promise<string> {
  if (!email || !email.includes('@')) return '';
  return hashSHA256(email);
}

/**
 * Хеширование телефонного номера
 * Нормализует телефон в формат E.164 перед хешированием
 * @param phone - Номер телефона
 * @returns Promise с хешированным номером
 */
export async function hashPhone(phone: string): Promise<string> {
  if (!phone) return '';

  // Убираем все нечисловые символы, кроме '+'
  let normalized = phone.replace(/[^\d+]/g, '');

  // Если номер начинается с 8, заменяем на +7 (для России)
  if (normalized.startsWith('8')) {
    normalized = `+7${normalized.slice(1)}`;
  }

  // Если номер не начинается с +, добавляем +7 (для России)
  if (!normalized.startsWith('+')) {
    normalized = `+7${normalized}`;
  }

  return hashSHA256(normalized);
}

/**
 * Хеширование имени/фамилии
 * @param name - Имя или фамилия
 * @returns Promise с хешированным именем
 */
export async function hashName(name: string): Promise<string> {
  if (!name) return '';
  // Убираем лишние пробелы и нормализуем
  const normalized = name.trim().replace(/\s+/g, ' ');
  return hashSHA256(normalized);
}

/**
 * Интерфейс для пользовательских данных
 */
export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}

/**
 * Интерфейс для хешированных пользовательских данных
 */
export interface HashedUserData {
  email?: string;
  phone_number?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    city?: string;
    country?: string;
  };
}

/**
 * Хеширование всех пользовательских данных для Enhanced Conversions
 * @param userData - Объект с пользовательскими данными
 * @returns Promise с хешированными данными
 */
export async function hashUserData(userData: UserData): Promise<HashedUserData> {
  const hashedData: HashedUserData = {};

  // Хешируем email
  if (userData.email) {
    hashedData.email = await hashEmail(userData.email);
  }

  // Хешируем телефон
  if (userData.phone) {
    hashedData.phone_number = await hashPhone(userData.phone);
  }

  // Хешируем адресные данные
  if (userData.firstName || userData.lastName || userData.city || userData.country) {
    hashedData.address = {};

    if (userData.firstName) {
      hashedData.address.first_name = await hashName(userData.firstName);
    }

    if (userData.lastName) {
      hashedData.address.last_name = await hashName(userData.lastName);
    }

    if (userData.city) {
      hashedData.address.city = await hashSHA256(userData.city);
    }

    if (userData.country) {
      hashedData.address.country = userData.country.toUpperCase(); // ISO код страны НЕ хешируется
    }
  }

  return hashedData;
}

/**
 * Проверка поддержки Web Crypto API
 * @returns true если Web Crypto API поддерживается
 */
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}

/**
 * Проверка безопасного контекста (HTTPS)
 * Web Crypto API требует HTTPS
 * @returns true если сайт работает по HTTPS или localhost
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false;
  return window.isSecureContext || window.location.hostname === 'localhost';
}

/**
 * Валидация email
 * @param email - Email адрес
 * @returns true если email валиден
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация телефонного номера (базовая)
 * @param phone - Номер телефона
 * @returns true если номер содержит достаточно цифр
 */
export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}
