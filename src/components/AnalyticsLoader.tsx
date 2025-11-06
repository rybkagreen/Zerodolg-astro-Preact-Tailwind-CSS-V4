import { useEffect } from 'preact/hooks';

export default function AnalyticsLoader() {
  useEffect(() => {
    console.log('[AnalyticsLoader] Mounting - checking consent');

    // Динамический импорт гарантирует выполнение только на клиенте
    import('../features/analytics/analytics')
      .then(() => {
        console.log('[AnalyticsLoader] Analytics module loaded');
        // The analytics module handles initialization itself when loaded
        // It checks for consent and initializes accordingly
      })
      .catch((error) => {
        console.error('[AnalyticsLoader] Failed to load analytics:', error);
      });
  }, []); // Empty array = run once after mounting

  return null;
}
