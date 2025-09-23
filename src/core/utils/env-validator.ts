// Environment validation utility
export function validateEnvironment() {
  const requiredVars = [
    'BITRIX24_WEBHOOK_URL',
    'PUBLIC_SITE_URL',
    'PUBLIC_SITE_PHONE',
    'PUBLIC_SITE_EMAIL'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
    return false;
  }
  
  // Validate URL format
  try {
    new URL(process.env.PUBLIC_SITE_URL!);
    new URL(process.env.BITRIX24_WEBHOOK_URL!);
  } catch (error) {
    console.warn('Invalid URL in environment variables');
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(process.env.PUBLIC_SITE_EMAIL!)) {
    console.warn('Invalid email format in PUBLIC_SITE_EMAIL');
    return false;
  }
  
  // Validate phone format
  const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  if (!phoneRegex.test(process.env.PUBLIC_SITE_PHONE!)) {
    console.warn('Invalid phone format in PUBLIC_SITE_PHONE');
    return false;
  }
  
  console.log('Environment validation passed');
  return true;
}