/**
 * Fallback JavaScript для критических интеракций
 * Работает независимо от Preact компонентов как резервный вариант
 */
(function () {
  'use strict';

  // Дожидаемся полной загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFallbackInteractions);
  } else {
    initFallbackInteractions();
  }

  function initFallbackInteractions() {
    console.log('[Fallback] Инициализация fallback интеракций');

    // Обработка кнопок с data-action="scroll-to-form"
    setupScrollToFormButtons();

    // Обработка якорных ссылок
    setupAnchorLinks();

    // Обработка кнопок модальных окон
    setupModalButtons();

    // Периодически проверяем новые элементы
    setInterval(function () {
      setupScrollToFormButtons();
      setupAnchorLinks();
      setupModalButtons();
    }, 2000);
  }

  function setupScrollToFormButtons() {
    const buttons = document.querySelectorAll('[data-action="scroll-to-form"]');

    buttons.forEach(function (button) {
      // Проверяем, не добавлен ли уже обработчик
      if (button.dataset.fallbackHandlerAdded) {
        return;
      }

      button.dataset.fallbackHandlerAdded = 'true';

      button.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('[Fallback] Клик по кнопке scroll-to-form');

        // Ищем форму для скролла
        const targetForm =
          document.getElementById('consultation-form') ||
          document.querySelector('[data-form-type="hero_form"]') ||
          document.querySelector('.hero-form') ||
          document.querySelector('form');

        if (targetForm) {
          console.log('[Fallback] Найдена форма, скроллим к ней');
          scrollToElement(targetForm);
        } else {
          console.log('[Fallback] Форма не найдена');
          // Попробуем найти CTA секцию
          const ctaSection = document.querySelector('#cta, .cta, [data-section="cta"]');
          if (ctaSection) {
            scrollToElement(ctaSection);
          }
        }
      });
    });

    if (buttons.length > 0) {
      console.log('[Fallback] Обработчики добавлены к', buttons.length, 'кнопкам scroll-to-form');
    }
  }

  function setupAnchorLinks() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      // Пропускаем ссылки внутри выпадающих меню (они обрабатываются отдельно)
      if (anchor.closest('.nav-dropdown-menu')) {
        return;
      }

      // Проверяем, не добавлен ли уже обработчик
      if (anchor.dataset.fallbackHandlerAdded) {
        return;
      }

      anchor.dataset.fallbackHandlerAdded = 'true';

      anchor.addEventListener('click', function (e) {
        const href = anchor.getAttribute('href');

        if (!href || href === '#' || href.startsWith('#modal-')) {
          return; // Пропускаем пустые и модальные ссылки
        }

        e.preventDefault();
        console.log('[Fallback] Клик по якорной ссылке:', href);

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          console.log('[Fallback] Найден элемент с ID:', targetId);
          scrollToElement(targetElement);

          // Обновляем URL
          if (history.pushState) {
            history.pushState(null, '', href);
          }
        } else {
          console.log('[Fallback] Элемент не найден:', targetId);
        }
      });
    });

    if (anchors.length > 0) {
      console.log('[Fallback] Обработчики добавлены к', anchors.length, 'якорным ссылкам');
    }
  }

  function setupModalButtons() {
    const modalButtons = document.querySelectorAll('[data-modal]');

    modalButtons.forEach(function (button) {
      // Проверяем, не добавлен ли уже обработчик
      if (button.dataset.fallbackHandlerAdded) {
        return;
      }

      button.dataset.fallbackHandlerAdded = 'true';

      button.addEventListener('click', function (e) {
        e.preventDefault();
        const modalId = button.getAttribute('data-modal');
        console.log('[Fallback] Клик по кнопке модального окна:', modalId);

        // Пытаемся открыть модальное окно через глобальный modalManager
        if (window.modalManager && window.modalManager.open) {
          console.log('[Fallback] Using global modalManager');
          window.modalManager.open(modalId);
        } else {
          console.log('[Fallback] Modal manager not found, trying to find modal directly');
          console.log('[Fallback] window.modalManager exists:', !!window.modalManager);
          if (window.modalManager) {
            console.log('[Fallback] window.modalManager.open exists:', !!window.modalManager.open);
          }

          // Пытаемся найти и показать модальное окно напрямую
          const modal = document.querySelector(`[data-modal-container="${modalId}"]`);
          if (modal) {
            modal.setAttribute('data-open', 'true');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
          } else {
            console.warn(`Modal with id "${modalId}" not found`);
            console.log('[Fallback] Searched for:', `[data-modal-container="${modalId}"]`);
          }
        }
      });
    });

    if (modalButtons.length > 0) {
      console.log(
        '[Fallback] Обработчики добавлены к',
        modalButtons.length,
        'кнопкам модальных окон'
      );
    }
  }

  function scrollToElement(element) {
    const header = document.querySelector('.header-redesign, .header, header');
    const headerHeight = header ? header.offsetHeight : 80;
    const offset = 20;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  // Обработка хэша в URL при загрузке страницы
  if (window.location.hash) {
    setTimeout(function () {
      const hash = window.location.hash;
      if (hash && hash !== '#' && !hash.startsWith('#modal-')) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          console.log('[Fallback] Скролл к элементу из хэша:', targetId);
          scrollToElement(targetElement);
        }
      }
    }, 500);
  }

  // Слушаем изменения хэша
  window.addEventListener('hashchange', function () {
    const hash = window.location.hash;
    if (hash && hash !== '#' && !hash.startsWith('#modal-')) {
      const targetId = hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        console.log('[Fallback] Скролл к элементу при изменении хэша:', targetId);
        scrollToElement(targetElement);
      }
    }
  });

  console.log('[Fallback] Fallback интеракции загружены');
})();
