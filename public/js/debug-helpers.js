/**
 * Debug Helpers for ZeroDolg Interactive Elements
 * Утилиты для диагностики проблем с прокруткой и всплывающими элементами
 */

(function () {
  'use strict';

  // Создаем глобальный объект для дебага
  window.ZeroDolgDebug = window.ZeroDolgDebug || {};

  /**
   * Проверяет наличие всех элементов для прокрутки к FAQ
   */
  function checkFAQScrollElements() {
    console.group('📋 FAQ Scroll Elements Check');

    const faqElement = document.getElementById('faq');
    console.log('FAQ element found:', !!faqElement);
    if (faqElement) {
      const rect = faqElement.getBoundingClientRect();
      console.log('FAQ position:', {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        visible:
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth,
      });
    }

    const faqLinks = document.querySelectorAll('a[href="#faq"]');
    console.log(`FAQ links found: ${faqLinks.length}`);
    faqLinks.forEach((link, index) => {
      console.log(`Link ${index + 1}:`, {
        text: link.textContent?.trim(),
        href: link.href,
        classes: link.className,
        parent: link.closest('nav, header, .nav-dropdown-menu, .group')?.tagName || 'none',
      });
    });

    const headers = document.querySelectorAll('#main-header, .header-redesign, .header, header');
    console.log(`Headers found: ${headers.length}`);
    headers.forEach((header, index) => {
      console.log(`Header ${index + 1}:`, {
        id: header.id,
        classes: header.className,
        height: header.offsetHeight,
        position: getComputedStyle(header).position,
      });
    });

    console.groupEnd();
  }

  /**
   * Проверяет состояние всплывающего баннера
   */
  function checkSpecialOfferBanner() {
    console.group('🔥 Special Offer Banner Check');

    const banner = document.getElementById('special-offer-banner');
    console.log('Banner element found:', !!banner);

    if (banner) {
      const rect = banner.getBoundingClientRect();
      const styles = getComputedStyle(banner);
      console.log('Banner details:', {
        classes: banner.className,
        visibility: styles.visibility,
        opacity: styles.opacity,
        display: styles.display,
        transform: styles.transform,
        position: {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        },
        zIndex: styles.zIndex,
      });
    }

    // Проверяем SessionStorage
    try {
      const wasClosed = sessionStorage.getItem('offerBannerClosed');
      console.log('SessionStorage status:', {
        available: typeof sessionStorage !== 'undefined',
        offerBannerClosed: wasClosed,
      });
    } catch (error) {
      console.error('SessionStorage error:', error);
    }

    console.groupEnd();
  }

  /**
   * Тестирует прокрутку к элементу
   */
  function testScrollToElement(elementId) {
    console.group(`📜 Test Scroll to #${elementId}`);

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`);
      console.groupEnd();
      return;
    }

    const header = document.querySelector('#main-header, .header-redesign, .header, header');
    const headerHeight = header ? header.offsetHeight : 80;
    const offset = 20;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

    console.log('Scroll calculation:', {
      element: elementId,
      headerHeight,
      elementPosition,
      currentScroll: window.pageYOffset,
      targetScroll: offsetPosition,
      willMove: Math.abs(offsetPosition - window.pageYOffset) > 5,
    });

    // Выполняем прокрутку
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    console.groupEnd();
  }

  /**
   * Показывает все модальные окна на странице
   */
  function checkModalElements() {
    console.group('🪟 Modal Elements Check');

    const modalTriggers = document.querySelectorAll('[data-modal]');
    console.log(`Modal triggers found: ${modalTriggers.length}`);

    modalTriggers.forEach((trigger, index) => {
      const modalId = trigger.getAttribute('data-modal');
      const modal =
        document.querySelector(`[data-modal-container="${modalId}"]`) ||
        document.getElementById(modalId);

      console.log(`Trigger ${index + 1}:`, {
        modalId,
        triggerText: trigger.textContent?.trim(),
        modalExists: !!modal,
        modalClasses: modal?.className,
      });
    });

    console.log('Modal Manager:', {
      available: !!window.modalManager,
      methods: window.modalManager ? Object.keys(window.modalManager) : [],
    });

    console.groupEnd();
  }

  /**
   * Показывает информацию о всех активных интерактивных компонентах
   */
  function getInteractiveComponentsInfo() {
    console.group('⚡ Interactive Components Overview');

    checkFAQScrollElements();
    checkSpecialOfferBanner();
    checkModalElements();

    console.log('Available debug functions:', [
      'ZeroDolgDebug.checkFAQ()',
      'ZeroDolgDebug.checkBanner()',
      'ZeroDolgDebug.checkModals()',
      'ZeroDolgDebug.testScroll("elementId")',
      'ZeroDolgDebug.resetBanner()',
      'ZeroDolgDebug.info()',
    ]);

    console.groupEnd();
  }

  /**
   * Сбрасывает состояние баннера
   */
  function resetBannerState() {
    try {
      sessionStorage.removeItem('offerBannerClosed');
      console.log('✅ Banner state reset - refresh page to see banner again');
    } catch (error) {
      console.error('❌ Error resetting banner state:', error);
    }
  }

  // Экспортируем функции в глобальный объект
  Object.assign(window.ZeroDolgDebug, {
    checkFAQ: checkFAQScrollElements,
    checkBanner: checkSpecialOfferBanner,
    checkModals: checkModalElements,
    testScroll: testScrollToElement,
    resetBanner: resetBannerState,
    info: getInteractiveComponentsInfo,
  });

  // Показываем информацию при загрузке (только в dev режиме)
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    console.log('🚀 ZeroDolg Debug Helpers loaded!');
    console.log('💡 Use ZeroDolgDebug.info() to see all available debug functions');
  }
})();
