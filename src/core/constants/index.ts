// Application constants
export const APP_CONSTANTS = {
  PHONE_FORMAT: '+7 (___) ___-__-__',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  FORM_DEBOUNCE_DELAY: 300,
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  BLOG: '/blog',
  CONTACTS: '/contacts',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};

export const API_ENDPOINTS = {
  FORM_SUBMIT: '/api/form',
  CALCULATOR_DATA: '/api/calculator',
};
