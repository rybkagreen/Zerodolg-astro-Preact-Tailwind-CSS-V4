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

      // Track with Yandex Metrika
      if (window.ym && window.yaCounterId) {
        window.ym(window.yaCounterId, 'reachGoal', 'social_link_click', {
          platform: platform,
          position: index,
          url: url
        });
      }

      // Open in new tab for social links
      if (link.getAttribute('target') === '_blank') {
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    // Add event listeners to social link containers
    const containers = document.querySelectorAll('[data-social-links]');
    containers.forEach(container => {
      container.addEventListener('click', handleSocialClick as EventListener);
    });

    // Cleanup function
    return () => {
      containers.forEach(container => {
        container.removeEventListener('click', handleSocialClick as EventListener);
      });
    };
  }, []);

  return null;
}