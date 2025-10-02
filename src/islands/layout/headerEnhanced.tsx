import { useEffect, useState, useCallback } from 'preact/hooks';
import { useThrottle } from '../../shared/hooks/useThrottle';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';

const HeaderEnhanced = (): null => {
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isDesktop = useMediaQuery('(min-width: 1025px)');
  usePerformanceMonitor('HeaderEnhanced');

  // Throttle scroll handler
  const throttledScrollHandler = useThrottle(() => {
    const header = document.getElementById('main-header');
    if (!header) return;

    const scrollTop = window.pageYOffset;
    const scrollThreshold = 100;

    if (scrollTop > scrollThreshold) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    const lastScrollY = (window as Window & { lastScrollY?: number }).lastScrollY || 0;
    if (scrollTop > scrollThreshold && scrollTop > lastScrollY) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    (window as Window & { lastScrollY?: number }).lastScrollY = scrollTop;
  }, 100);

  // Setup dropdowns
  const setupDropdowns = useCallback(() => {
    const dropdownButtons = document.querySelectorAll('[data-dropdown]');

    dropdownButtons.forEach((button) => {
      const dropdownId = button.getAttribute('data-dropdown');
      const dropdownMenu = document.querySelector(
        `[data-dropdown-menu="${dropdownId}"]`
      ) as HTMLElement;

      if (button && dropdownMenu) {
        // Update button state
        button.setAttribute('aria-expanded', activeDropdown === dropdownId ? 'true' : 'false');

        // Update menu visibility
        if (activeDropdown === dropdownId) {
          dropdownMenu.classList.remove('hidden');
          dropdownMenu.classList.add('block');
        } else {
          dropdownMenu.classList.add('hidden');
          dropdownMenu.classList.remove('block');
        }

        // Handle button clicks
        const handleClick = (e: Event) => {
          e.preventDefault();
          setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
        };

        button.removeEventListener('click', handleClick);
        button.addEventListener('click', handleClick);
      }

      // Handle clicks on dropdown menu links
      if (dropdownMenu) {
        const dropdownLinks = dropdownMenu.querySelectorAll('a');
        dropdownLinks.forEach((link) => {
          const handleClick = (e: Event) => {
            const href = link.getAttribute('href');

            // Close dropdown with a small delay
            setTimeout(() => setActiveDropdown(null), 100);

            // Handle anchor links (both #section and /#section)
            if (href) {
              const isHashLink = href.startsWith('#');
              const isHomeHashLink = href.startsWith('/#');

              if (isHashLink) {
                // If we're already on the home page, use smooth scroll
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath === '') {
                  e.preventDefault();

                  const targetId = href.substring(1);
                  const targetElement = document.getElementById(targetId);

                  if (targetElement) {
                    const header = document.querySelector('#main-header, .header-redesign');
                    const headerHeight = header ? (header as HTMLElement).offsetHeight : 72;
                    const offset = 20; // Additional offset

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - headerHeight - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth',
                    });

                    // Update URL without reloading
                    history.pushState(null, '', href);
                  }
                }
              } else if (isHomeHashLink) {
                // Navigate to home page with hash
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath === '') {
                  // Already on home page, just scroll
                  e.preventDefault();

                  const targetId = href.substring(2); // Remove /#
                  const targetElement = document.getElementById(targetId);

                  if (targetElement) {
                    const header = document.querySelector('#main-header, .header-redesign');
                    const headerHeight = header ? (header as HTMLElement).offsetHeight : 72;
                    const offset = 20;

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - headerHeight - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth',
                    });

                    // Update URL
                    history.pushState(null, '', href);
                  }
                }
                // Otherwise, let the browser navigate normally
              }
            }
          };

          link.removeEventListener('click', handleClick);
          link.addEventListener('click', handleClick);
        });
      }
    });
  }, [activeDropdown]);

  // Setup mobile menu
  const setupMobileMenu = useCallback(() => {
    const mobileToggle = document.querySelector('[data-mobile-toggle]') as HTMLButtonElement;
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.querySelector('[data-mobile-menu-overlay]') as HTMLElement;
    const mobileMenuClose = document.querySelector('[data-mobile-menu-close]') as HTMLButtonElement;

    if (!mobileToggle || !mobileMenu) return;

    const toggleMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Remove existing listeners
    mobileToggle.removeEventListener('click', toggleMenu);
    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu handlers
    if (mobileMenuOverlay) {
      const handleOverlayClick = () => setIsMobileMenuOpen(false);
      mobileMenuOverlay.removeEventListener('click', handleOverlayClick);
      mobileMenuOverlay.addEventListener('click', handleOverlayClick);
    }

    if (mobileMenuClose) {
      const handleCloseClick = () => setIsMobileMenuOpen(false);
      mobileMenuClose.removeEventListener('click', handleCloseClick);
      mobileMenuClose.addEventListener('click', handleCloseClick);
    }

    // Update DOM based on state
    if (isMobileMenuOpen) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('mobile-menu-open');
      document.body.classList.add('menu-open');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('mobile-menu-open');
      document.body.classList.remove('menu-open');
    }

    // Update ARIA attributes
    mobileMenu.setAttribute('aria-hidden', isMobileMenuOpen ? 'false' : 'true');
    mobileToggle.setAttribute('aria-expanded', isMobileMenuOpen ? 'true' : 'false');

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('[data-mobile-link]');
    mobileLinks.forEach((link) => {
      const handleClick = () => {
        setIsMobileMenuOpen(false);
      };

      link.removeEventListener('click', handleClick);
      link.addEventListener('click', handleClick);
    });
  }, [isMobileMenuOpen]);

  // Setup smooth scroll
  const setupSmoothScroll = useCallback(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      const handleClick = (e: Event) => {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          let target = null;
          if (href.startsWith('#')) {
            const targetId = href.substring(1);
            target = document.getElementById(targetId);
          } else {
            target = document.querySelector(href);
          }

          if (target) {
            e.preventDefault();
            const header = document.getElementById('main-header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition =
              target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }
        }
      };

      anchor.removeEventListener('click', handleClick); // Remove previous listener
      anchor.addEventListener('click', handleClick);
    });
  }, []);

  // Define event handlers outside useCallback
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Close dropdowns and mobile menu on ESC
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    },
    [isMobileMenuOpen]
  );

  const handleClickOutside = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (
      !target.closest('[data-dropdown]') &&
      !target.closest('[data-dropdown-menu]') &&
      !target.closest('#mobile-menu')
    ) {
      setActiveDropdown(null);
    }
  }, []);

  // Setup keyboard navigation
  const setupKeyboardNavigation = useCallback(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Setup click outside
  const setupClickOutside = useCallback(() => {
    document.removeEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  // Initialize all features
  useEffect(() => {
    // Only run on the client side
    setIsClient(true);

    setupDropdowns();
    setupMobileMenu();
    setupSmoothScroll();
    setupKeyboardNavigation();
    setupClickOutside();

    // Add scroll listener
    window.removeEventListener('scroll', throttledScrollHandler);
    window.addEventListener('scroll', throttledScrollHandler);

    // Setup desktop hover behavior when applicable
    if (isDesktop) {
      const dropdownContainers = document.querySelectorAll('li.group');
      dropdownContainers.forEach((container) => {
        const button = container.querySelector('[data-dropdown]');
        const menu = container.querySelector('[data-dropdown-menu]');

        if (button && menu) {
          const dropdownId = button.getAttribute('data-dropdown');

          const handleMouseEnter = () => {
            setActiveDropdown(dropdownId);
          };

          const handleMouseLeave = () => {
            // Add small timeout to allow for quick navigation between items
            setTimeout(() => {
              if (!container.matches(':hover')) {
                setActiveDropdown(null);
              }
            }, 150);
          };

          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);

          container.addEventListener('mouseenter', handleMouseEnter);
          container.addEventListener('mouseleave', handleMouseLeave);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isDesktop,
    setupDropdowns,
    setupMobileMenu,
    setupSmoothScroll,
    setupKeyboardNavigation,
    setupClickOutside,
    throttledScrollHandler,
    handleClickOutside,
    handleKeyDown,
  ]);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  return null; // This component only adds behavior, no visual output
};

export default HeaderEnhanced;
