import { useEffect } from 'preact/hooks';

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    ym?: (id: number, method: string, ...args: any[]) => void;
    yaCounterId?: number;
  }
}

export default function SocialLinksLogic() {
  useEffect(() => {
    const handleSocialClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const link = (mouseEvent.target as HTMLElement).closest('.social-link');
      if (!link) return;

      const platform = link.getAttribute('data-platform');
      const index = link.getAttribute('data-index');
      const url = (link as HTMLAnchorElement).href;

      // Track with Google Analytics
      if (window.gtag) {
        window.gtag('event', 'social_link_click', {
          social_platform: platform,
          link_position: index,
          link_url: url
        });
      }

      // Track with Yandex.Metrica
      if (window.ym && window.yaCounterId) {
        window.ym(window.yaCounterId, 'reachGoal', 'social_link_click', {
          platform: platform,
          position: index
        });
      }

      // Custom event for other integrations
      document.dispatchEvent(new CustomEvent('social-link-click', {
        detail: { platform, index, url, link }
      }));
    };

    // Add event listeners to all social link containers
    const containers = document.querySelectorAll('.social-links');
    containers.forEach(container => {
      const enableTracking = container.getAttribute('data-enable-tracking') === 'true';
      if (enableTracking) {
        container.addEventListener('click', handleSocialClick as EventListener);
      }
    });

    return () => {
      containers.forEach(container => {
        container.removeEventListener('click', handleSocialClick as EventListener);
      });
    };
  }, []);

  return null;
}
