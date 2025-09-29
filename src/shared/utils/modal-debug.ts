/**
 * Отладочная утилита для диагностики проблем с модальными окнами
 */
export class ModalDebugger {
  static debug(): void {
    console.group('🔍 Modal Manager Debug Information');

    try {
      // Проверяем наличие модального менеджера
      const hasModalManager = typeof window !== 'undefined' && 'modalManager' in window;
      console.log('✅ Modal Manager доступен:', hasModalManager);

      if (hasModalManager) {
        const stats = window.modalManager?.debug?.();
        console.log('📊 Статистика модалей:', stats);
      }

      // Проверяем DOM элементы
      const modalElements = document.querySelectorAll('.modal');
      console.log('🏠 Найдено модальных элементов:', modalElements.length);

      modalElements.forEach((modal, index) => {
        console.log(`📋 Модаль ${index + 1}:`, {
          id: modal.id,
          classes: modal.className,
          visible: window.getComputedStyle(modal).display !== 'none',
          ariaHidden: modal.getAttribute('aria-hidden'),
          hasContainer: modal.querySelector('[data-modal-container]') !== null,
        });
      });

      // Проверяем триггеры
      const triggers = document.querySelectorAll('[data-modal]');
      console.log('🔘 Найдено триггеров:', triggers.length);

      triggers.forEach((trigger, index) => {
        console.log(`🎯 Триггер ${index + 1}:`, {
          modalId: trigger.getAttribute('data-modal'),
          modalType: trigger.getAttribute('data-modal-type'),
          element: trigger.tagName,
          text: `${trigger.textContent?.trim().substring(0, 30)}...`,
        });
      });

      // Проверяем кнопки закрытия
      const closeButtons = document.querySelectorAll('[data-modal-close]');
      console.log('❌ Найдено кнопок закрытия:', closeButtons.length);

      // Проверяем состояние документа
      console.log('📄 Состояние документа:', {
        readyState: document.readyState,
        bodyOverflow: document.body.style.overflow,
        activeElement: document.activeElement?.tagName,
      });
    } catch (error) {
      console.error('❌ Ошибка при отладке:', error);
    }

    console.groupEnd();
  }

  /**
   * Простой тест открытия модального окна
   */
  static testModal(modalId: string): void {
    console.group(`🧪 Тест модального окна: ${modalId}`);

    try {
      const modalElement = document.getElementById(modalId);

      if (!modalElement) {
        console.error(`❌ Модальное окно с ID "${modalId}" не найдено`);
        console.groupEnd();
        return;
      }

      console.log('✅ Элемент модали найден:', modalElement);

      if (typeof window !== 'undefined' && window.modalManager) {
        console.log('🔄 Попытка открыть через Modal Manager...');
        window.modalManager.open(modalId);

        setTimeout(() => {
          const isVisible = window.getComputedStyle(modalElement).display !== 'none';
          console.log(`${isVisible ? '✅' : '❌'} Модаль ${isVisible ? 'открыта' : 'не открыта'}`);
          console.groupEnd();
        }, 100);
      } else {
        console.warn('⚠️ Modal Manager недоступен, пробуем прямое открытие...');
        modalElement.style.display = 'block';
        modalElement.setAttribute('aria-hidden', 'false');
        console.log('✅ Модаль открыта напрямую');
        console.groupEnd();
      }
    } catch (error) {
      console.error('❌ Ошибка при тестировании модали:', error);
      console.groupEnd();
    }
  }

  /**
   * Автоматическая диагностика при загрузке страницы
   */
  static autoCheck(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.debug(), 1000);
      });
    } else {
      setTimeout(() => this.debug(), 1000);
    }
  }
}

// Глобальный доступ для отладки в консоли
if (typeof window !== 'undefined') {
  (window as typeof window & { modalDebug: typeof ModalDebugger }).modalDebug = ModalDebugger;
}
