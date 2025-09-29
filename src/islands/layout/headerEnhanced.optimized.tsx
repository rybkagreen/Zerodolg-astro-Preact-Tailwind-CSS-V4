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

    if (scrollTop > scrollThreshold && scrollTop > ((window as any).lastScrollY || 0)) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    (window as any).lastScrollY = scrollTop;
  }, 100);

  // Setup dropdowns
  const setupDropdowns = useCallback(() => {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach((dropdown) => {
      const dropdownId = dropdown.getAttribute('data-dropdown-id');
      const toggle = dropdown.querySelector('.nav-dropdown-toggle') as HTMLButtonElement;

      if (toggle) {
        const handleClick = (e: Event) => {
          e.preventDefault();
          setActiveDropdown(dropdownId === activeDropdown ? null : dropdownId);
        };

        toggle.removeEventListener('click', handleClick); // Remove previous listener
        toggle.addEventListener('click', handleClick);
      }

      // Handle clicks on dropdown menu links
      const dropdownLinks = dropdown.querySelectorAll('.nav-dropdown-menu a');
      dropdownLinks.forEach((link) => {
        const handleClick = (e: Event) => {
          const href = link.getAttribute('href');

          // Close dropdown with a small delay
          setTimeout(() => setActiveDropdown(null), 100);

          // Handle anchor links
          if (href && href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
              const header = document.querySelector('.header-redesign');
              const headerHeight = header ? (header as HTMLElement).offsetHeight : 72;
              const offset = 20; // Additional offset

              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });

              // Update URL without reloading
              history.pushState(null, '', href);
            } else {
              // If element not found, try to find it by query selector
              const targetElementBySelector = document.querySelector(href);
              if (targetElementBySelector) {
                const header = document.querySelector('.header-redesign');
                const headerHeight = header ? (header as HTMLElement).offsetHeight : 72;
                const offset = 20; // Additional offset

                const elementPosition = targetElementBySelector.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });

                // Update URL without reloading
                history.pushState(null, '', href);
              }
            }
          }
        };

        link.removeEventListener('click', handleClick); // Remove previous listener
        link.addEventListener('click', handleClick);
      });
    });
  }, [activeDropdown]);

  // Setup mobile menu
  const setupMobileMenu = useCallback(() => {
    const mobileToggle = document.querySelector('[data-mobile-toggle]') as HTMLButtonElement;
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileToggle || !mobileMenu) return;

    const toggleMenu = () => {
      const isOpen = mobileMenu.getAttribute('data-open') === 'true';
      setIsMobileMenuOpen(!isOpen);
    };

    mobileToggle.removeEventListener('click', toggleMenu);
    mobileToggle.addEventListener('click', toggleMenu);

    // Update attributes based on state
    mobileMenu.setAttribute('data-open', isMobileMenuOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isMobileMenuOpen ? 'false' : 'true');

    document.body.classList.toggle('menu-open', isMobileMenuOpen);

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', isMobileMenuOpen ? 'true' : 'false');
    }

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
    const anchors = document.querySelectorAll('a[href^=\"#\"]');
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
    if (!target.closest('.nav-dropdown') && !target.closest('.mobile-menu')) {
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

    // Handle consultation buttons
    const consultationBtns = document.querySelectorAll(
      '[data-modal="consultation"], [data-modal="callback"]'
    );
    consultationBtns.forEach((btn) => {
      const handleClick = () => {
        console.log('Opening consultation modal');
      };

      btn.removeEventListener('click', handleClick);
      btn.addEventListener('click', handleClick);
    });

    // Setup desktop hover behavior when applicable
    if (isDesktop) {
      const dropdowns = document.querySelectorAll('.nav-dropdown');
      dropdowns.forEach((dropdown) => {
        const handleMouseEnter = () => {
          const dropdownId = dropdown.getAttribute('data-dropdown-id');
          setActiveDropdown(dropdownId);
        };

        const handleMouseLeave = () => {
          // Add small timeout to allow for quick navigation between items
          setTimeout(() => {
            const newHovered = document.querySelectorAll('.nav-dropdown:hover');
            if (newHovered.length === 0) {
              setActiveDropdown(null);
            }
          }, 200);
        };

        dropdown.removeEventListener('mouseenter', handleMouseEnter);
        dropdown.removeEventListener('mouseleave', handleMouseLeave);

        dropdown.addEventListener('mouseenter', handleMouseEnter);
        dropdown.addEventListener('mouseleave', handleMouseLeave);
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

  // Effect to handle dropdown state changes
  useEffect(() => {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach((dropdown) => {
      const dropdownId = dropdown.getAttribute('data-dropdown-id');
      const menu = dropdown.querySelector('.nav-dropdown-menu') as HTMLElement;

      if (menu) {
        if (dropdownId === activeDropdown) {
          menu.style.display = 'block';
          setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.pointerEvents = 'auto';
          }, 10);
        } else {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.pointerEvents = 'none';
          setTimeout(() => {
            if (dropdownId !== activeDropdown) {
              menu.style.display = 'none';
            }
          }, 300);
        }
      }
    });
  }, [activeDropdown]);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  return null; // This component only adds behavior, no visual output
};

export default HeaderEnhanced;
