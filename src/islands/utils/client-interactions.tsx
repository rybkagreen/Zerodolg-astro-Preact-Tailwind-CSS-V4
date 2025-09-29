import { type VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Extended Element interface for custom properties
interface ExtendedElement extends Element {
  _scrollHandler?: (e: Event) => void;
  _anchorHandler?: (e: Event) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ClientInteractionsProps {}

export default function ClientInteractions({}: ClientInteractionsProps): VNode | null {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on the client side
    setIsClient(true);

    // Setup all client interactions
    setupScrollToActions();
    setupAnchorNavigation();
    setupDynamicElementHandling();
    setupFormInteractions();

    // Re-run when DOM content changes (but avoid interfering with form hydration)
    const observer = new MutationObserver((mutations) => {
      // Only re-setup if there are actual node additions/removals, not just attribute changes
      const hasStructuralChanges = mutations.some((mutation) => {
        if (mutation.type !== 'childList') return false;

        // Skip mutations in form elements to avoid hydration issues
        const target = mutation.target as Element;
        if (
          target.tagName === 'FORM' ||
          target.closest('form') ||
          target.closest('[data-preact]')
        ) {
          return false;
        }

        return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
      });

      if (hasStructuralChanges) {
        // Debounce to avoid excessive re-runs
        setTimeout(() => {
          setupScrollToActions();
          setupAnchorNavigation();
          setupDynamicElementHandling();
          // Don't re-setup form interactions as they're handled by React/Preact
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Handle initial page load hash navigation (but not on first page load)
    if (typeof window !== 'undefined' && window.location.hash && document.referrer) {
      // Only auto-scroll if coming from another page, not on initial load
      setTimeout(() => {
        handleHashNavigation(window.location.hash);
      }, 100);
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  return null;
}

/**
 * Handle hash navigation
 */
function handleHashNavigation(hash: string) {
  if (typeof window === 'undefined') return;

  if (hash && hash !== '#' && !hash.startsWith('#modal-')) {
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const header = document.querySelector('.header-redesign, .header');
      const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
      const offset = 20;

      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}

/**
 * Setup scroll-to actions for buttons with data-action attributes
 */
function setupScrollToActions() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Handle scroll-to-form buttons
  const scrollButtons = document.querySelectorAll('[data-action="scroll-to-form"]');
  scrollButtons.forEach((button) => {
    // Check if we've already added the handler
    if (!(button as ExtendedElement)._scrollHandler) {
      (button as ExtendedElement)._scrollHandler = function (e: Event) {
        e.preventDefault();
        const targetForm =
          document.getElementById('consultation-form') ||
          document.querySelector('[data-form-type="hero_form"]') ||
          document.querySelector('.hero-form');

        if (targetForm) {
          const header = document.querySelector('.header-redesign, .header');
          const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
          const offset = 20;

          const elementPosition = targetForm.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      };

      button.addEventListener('click', (button as ExtendedElement)._scrollHandler!);
    }
  });

  // Handle other scroll actions
  const otherScrollButtons = document.querySelectorAll('[data-scroll-target]');
  otherScrollButtons.forEach((button) => {
    if (!(button as ExtendedElement)._scrollHandler) {
      (button as ExtendedElement)._scrollHandler = function (e: Event) {
        e.preventDefault();
        const targetSelector = button.getAttribute('data-scroll-target');
        if (targetSelector) {
          const targetElement =
            document.querySelector(targetSelector) || document.getElementById(targetSelector);

          if (targetElement) {
            const header = document.querySelector('.header-redesign, .header');
            const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
            const offset = 20;

            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }
      };

      button.addEventListener('click', (button as ExtendedElement)._scrollHandler!);
    }
  });
}

/**
 * Setup anchor navigation for all anchor links
 * Skip links that are inside dropdown menus as they're handled by the header component
 */
function setupAnchorNavigation() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    // Skip anchor links inside dropdown menus as they're handled by the header component
    if (anchor.closest('.nav-dropdown-menu')) {
      return;
    }

    if (!(anchor as ExtendedElement)._anchorHandler) {
      (anchor as ExtendedElement)._anchorHandler = function (e: Event) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#modal-')) {
          // Don't interfere with modal links
          e.preventDefault();
          handleHashNavigation(href);

          // Update URL without page reload
          if (history.pushState) {
            history.pushState(null, '', href);
          }
        }
      };

      anchor.addEventListener('click', (anchor as ExtendedElement)._anchorHandler!);
    }
  });

  // Handle hash changes for SPA-like navigation
  window.addEventListener('hashchange', () => {
    handleHashNavigation(window.location.hash);
  });
}

/**
 * Setup handling for dynamically generated elements
 */
function setupDynamicElementHandling() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Handle dynamically created buttons and links with event delegation
  document.removeEventListener('click', handleDynamicClick); // Remove previous listener if exists
  document.addEventListener('click', handleDynamicClick);
}

/**
 * Handle clicks on dynamically generated elements
 */
function handleDynamicClick(e: Event) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const target = e.target as HTMLElement;

  // Handle data-action buttons that might be created dynamically
  const actionButton = target.closest('[data-action]') as HTMLElement;
  if (actionButton && actionButton.getAttribute('data-action') === 'scroll-to-form') {
    e.preventDefault();
    const targetForm =
      document.getElementById('consultation-form') ||
      document.querySelector('[data-form-type="hero_form"]') ||
      document.querySelector('.hero-form');

    if (targetForm) {
      const header = document.querySelector('.header-redesign, .header');
      const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
      const offset = 20;

      const elementPosition = targetForm.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  // Handle data-scroll-target elements
  const scrollTargetButton = target.closest('[data-scroll-target]') as HTMLElement;
  if (scrollTargetButton) {
    e.preventDefault();
    const targetSelector = scrollTargetButton.getAttribute('data-scroll-target');
    if (targetSelector) {
      const targetElement =
        document.querySelector(targetSelector) || document.getElementById(targetSelector);

      if (targetElement) {
        const header = document.querySelector('.header-redesign, .header');
        const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
        const offset = 20;

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  }

  // Handle dynamically created anchor links (but skip dropdown menu links)
  const anchorLink = target.closest('a[href^="#"]') as HTMLAnchorElement;
  if (anchorLink && !anchorLink.closest('.nav-dropdown-menu')) {
    const href = anchorLink.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('#modal-')) {
      e.preventDefault();
      handleHashNavigation(href);

      // Update URL without page reload
      if (history.pushState) {
        history.pushState(null, '', href);
      }
    }
  }
}

/**
 * Setup form interactions
 */
function setupFormInteractions() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Handle form submissions for forms that might be added dynamically
  document.removeEventListener('submit', handleFormSubmit); // Remove previous listener if exists
  document.addEventListener('submit', handleFormSubmit);
}

/**
 * Handle form submissions
 */
function handleFormSubmit(e: Event) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const form = e.target as HTMLFormElement;
  if (form && form.tagName === 'FORM') {
    // Add any form-specific handling here if needed
    // For now, we're just ensuring the event handlers are properly attached
  }
}
