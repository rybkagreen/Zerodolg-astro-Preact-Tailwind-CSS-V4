import { useEffect, useState } from 'preact/hooks';

// Utility functions
type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Header = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on the client side
    setIsClient(true);

    const header = document.getElementById('main-header');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    const mobileToggle = document.querySelector('[data-mobile-toggle]') as HTMLButtonElement;
    const mobileMenu = document.getElementById('mobile-menu');
    const searchBtn = document.querySelector('[data-action="search"]') as HTMLButtonElement;
    const searchOverlay = document.querySelector('[data-search-overlay]') as HTMLElement;
    const searchClose = document.querySelector('[data-search-close]') as HTMLButtonElement;

    let activeDropdown: Element | null = null;
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    // Setup Dropdowns
    const setupDropdowns = () => {
      dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle') as HTMLButtonElement;
        if (toggle) {
          toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDropdown(dropdown);
          });
        }

        // Handle clicks on dropdown menu links
        const dropdownLinks = dropdown.querySelectorAll('.nav-dropdown-menu a');
        dropdownLinks.forEach((link) => {
          link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Закрываем dropdown в любом случае с небольшой задержкой
            setTimeout(() => closeDropdown(dropdown), 100);

            // Обрабатываем якорные ссылки
            if (href && href.startsWith('#')) {
              e.preventDefault();

              const targetId = href.substring(1);
              const targetElement = document.getElementById(targetId);

              if (targetElement) {
                const header = document.querySelector('.header-redesign');
                const headerHeight = header ? (header as HTMLElement).offsetHeight : 72;
                const offset = 20; // Дополнительный отступ

                // Используем более надежный метод скролла
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });

                // Обновляем URL без перезагрузки
                history.pushState(null, '', href);
              } else {
                // If element not found, try to find it by query selector
                const targetElementBySelector = document.querySelector(href);
                if (targetElementBySelector) {
                  const header = document.querySelector('.header-redesign');
                  const headerHeight = header ? (header as HTMLElement).offsetHeight : 72;
                  const offset = 20; // Дополнительный отступ

                  // Используем более надежный метод скролла
                  const elementPosition = targetElementBySelector.getBoundingClientRect().top;
                  const offsetPosition =
                    elementPosition + window.pageYOffset - headerHeight - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                  });

                  // Обновляем URL без перезагрузки
                  history.pushState(null, '', href);
                }
              }
            }
            // Для обычных ссылок (не якорных) ничего не делаем, браузер сам перейдет по ссылке
          });
        });

        // Hover behavior for desktop
        if (window.innerWidth > 1024) {
          let closeTimeout: NodeJS.Timeout;
          dropdown.addEventListener('mouseenter', () => {
            clearTimeout(closeTimeout);
            openDropdown(dropdown);
          });
          dropdown.addEventListener('mouseleave', () => {
            closeTimeout = setTimeout(() => closeDropdown(dropdown), 200);
          });
        }
      });
    };

    const toggleDropdown = (dropdown: Element) => {
      const isActive = dropdown.classList.contains('active');
      closeAllDropdowns();
      if (!isActive) {
        openDropdown(dropdown);
      }
    };

    const openDropdown = (dropdown: Element) => {
      closeAllDropdowns();
      dropdown.classList.add('active');
      activeDropdown = dropdown;

      const menu = dropdown.querySelector('.nav-dropdown-menu') as HTMLElement;
      if (menu) {
        menu.style.display = 'block';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.pointerEvents = 'auto';
      }
    };

    const closeDropdown = (dropdown: Element) => {
      dropdown.classList.remove('active');
      if (activeDropdown === dropdown) {
        activeDropdown = null;
      }

      const menu = dropdown.querySelector('.nav-dropdown-menu') as HTMLElement;
      if (menu) {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.pointerEvents = 'none';
        setTimeout(() => {
          if (!dropdown.classList.contains('active')) {
            menu.style.display = 'none';
          }
        }, 300);
      }
    };

    const closeAllDropdowns = () => {
      dropdowns.forEach((d) => closeDropdown(d));
    };

    // Setup Mobile Menu
    const setupMobileMenu = () => {
      if (!mobileToggle || !mobileMenu) return;

      mobileToggle.addEventListener('click', () => toggleMobileMenu());
      const closeBtn = mobileMenu.querySelector('[data-mobile-menu-close]') as HTMLButtonElement;
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeMobileMenu());
      }

      const overlay = mobileMenu.querySelector('[data-mobile-menu-overlay]');
      if (overlay) {
        overlay.addEventListener('click', () => closeMobileMenu());
      }

      // Close mobile menu on link click
      const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    };

    const toggleMobileMenu = () => {
      const isOpen = mobileMenu?.getAttribute('data-open') === 'true';
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    };

    const openMobileMenu = () => {
      if (!mobileMenu) return;
      mobileMenu.setAttribute('data-open', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    };

    const closeMobileMenu = () => {
      if (!mobileMenu) return;
      mobileMenu.setAttribute('data-open', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    };

    // Setup Search
    const setupSearch = () => {
      if (!searchBtn || !searchOverlay) return;

      searchBtn.addEventListener('click', () => openSearch());
      if (searchClose) {
        searchClose.addEventListener('click', () => closeSearch());
      }
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
      });

      // Handle ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
          closeSearch();
        }
      });
    };

    const openSearch = () => {
      if (!searchOverlay) return;
      searchOverlay.classList.add('active');
      const input = searchOverlay.querySelector('.search-input') as HTMLInputElement;
      if (input) setTimeout(() => input.focus(), 100);
      document.body.classList.add('search-open');
    };

    const closeSearch = () => {
      if (!searchOverlay) return;
      searchOverlay.classList.remove('active');
      document.body.classList.remove('search-open');
      if (searchBtn) searchBtn.focus();
    };

    // Setup Scroll Behavior
    const setupScrollBehavior = () => {
      const handleScroll = debounce(() => {
        if (!header) return;
        const scrollTop = window.pageYOffset;

        if (scrollTop > scrollThreshold) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop;
      }, 100);

      window.addEventListener('scroll', handleScroll);
    };

    // Setup Smooth Scroll
    const setupSmoothScroll = () => {
      const anchors = document.querySelectorAll('a[href^="#"]');
      anchors.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href && href !== '#') {
            // For ID links (starting with #), use getElementById for better reliability
            let target = null;
            if (href.startsWith('#')) {
              const targetId = href.substring(1);
              target = document.getElementById(targetId);
            } else {
              target = document.querySelector(href);
            }

            if (target) {
              e.preventDefault();
              const headerHeight = header ? header.offsetHeight : 80;
              const targetPosition =
                target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
              });
            }
          }
        });
      });
    };

    // Setup Keyboard Navigation
    const setupKeyboardNavigation = () => {
      document.addEventListener('keydown', (e) => {
        // Close dropdowns on ESC
        if (e.key === 'Escape') {
          closeAllDropdowns();
          if (mobileMenu?.getAttribute('data-open') === 'true') {
            closeMobileMenu();
          }
        }
      });

      // Focus trap for mobile menu
      if (mobileMenu) {
        const focusableElements = mobileMenu.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

        mobileMenu.addEventListener('keydown', (e) => {
          if (e.key === 'Tab' && mobileMenu.getAttribute('data-open') === 'true') {
            if (e.shiftKey) {
              if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
              }
            } else {
              if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
              }
            }
          }
        });
      }
    };

    // Setup Click Outside
    const setupClickOutside = () => {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.nav-dropdown')) {
          closeAllDropdowns();
        }
      });
    };

    // Initialize all features
    setupDropdowns();
    setupMobileMenu();
    setupSearch();
    setupScrollBehavior();
    setupSmoothScroll();
    setupKeyboardNavigation();
    setupClickOutside();

    // Handle consultation button
    const consultationBtns = document.querySelectorAll(
      '[data-modal="consultation"], [data-modal="callback"]'
    );
    consultationBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // This will be handled by modal component
        console.log('Opening consultation modal');
      });
    });

    // Cleanup
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  return null; // This component only adds behavior, no visual output
};

export default Header;
