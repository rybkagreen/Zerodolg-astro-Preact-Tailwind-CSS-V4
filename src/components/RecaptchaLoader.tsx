import { useEffect } from 'preact/hooks';

interface RecaptchaLoaderProps {
  siteKey: string;
}

export default function RecaptchaLoader({ siteKey }: RecaptchaLoaderProps) {
  useEffect(() => {
    console.log('[RecaptchaLoader] Mounting - loading reCaptcha script');

    // Динамический импорт для загрузки reCaptcha
    import('../shared/lib/recaptcha-client')
      .then(({ loadRecaptchaScript }) => {
        console.log('[RecaptchaLoader] Loading reCaptcha script with site key:', siteKey);
        loadRecaptchaScript(siteKey)
          .then(() => {
            console.info(
              '🛡️ reCaptcha v3 инициализирован с site key:',
              `${siteKey.substring(0, 15)}...`
            );
            console.log('[RecaptchaLoader] reCaptcha script loaded and ready');
          })
          .catch((error) => {
            console.error('[RecaptchaLoader] Failed to load reCaptcha script:', error);
          });
      })
      .catch((error) => {
        console.error('[RecaptchaLoader] Failed to import reCaptcha client:', error);
      });
  }, [siteKey]);

  return null;
}
