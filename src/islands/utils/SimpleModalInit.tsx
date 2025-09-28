import { useEffect } from 'preact/hooks';
import { ModalDebugger } from '../../shared/utils/modal-debug';

/**
 * Простой инициализатор модального менеджера
 * Убеждается, что модальные окна работают после полной загрузки компонентов
 */
export default function SimpleModalInit() {
  useEffect(() => {
    // Ждем полную загрузку
    const initializeModals = (): (() => void) | void => {
      console.log('[SimpleModalInit] 🚀 Инициализация модального менеджера...');
      
      try {
        // Простая реализация модального менеджера, если основной не работает
        if (!window.modalManager) {
          console.log('[SimpleModalInit] 🔧 Создаем простой модальный менеджер...');
          
          window.modalManager = {
            open: (modalId: string) => {
              console.log('[SimpleModalInit] 🔓 Открываем модаль:', modalId);
              const modal = document.getElementById(modalId);
              if (modal) {
                modal.style.display = 'block';
                modal.setAttribute('aria-hidden', 'false');
                modal.setAttribute('data-modal-open', 'true');
                document.body.style.overflow = 'hidden';
                
                // Фокус на первый интерактивный элемент
                const focusable = modal.querySelector<HTMLElement>('input, button, select, textarea, [href], [tabindex]:not([tabindex="-1"])');
                if (focusable) {
                  setTimeout(() => focusable.focus(), 100);
                }
              } else {
                console.warn('[SimpleModalInit] ⚠️ Модаль не найдена:', modalId);
              }
            },
            
            close: (modalId?: string) => {
              console.log('[SimpleModalInit] 🔒 Закрываем модаль:', modalId || 'текущую');
              const modal = modalId 
                ? document.getElementById(modalId) 
                : document.querySelector('[data-modal-open="true"]') as HTMLElement;
                
              if (modal) {
                (modal as HTMLElement).style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                modal.removeAttribute('data-modal-open');
                document.body.style.overflow = '';
              }
            },
            
            closeAll: () => {
              console.log('[SimpleModalInit] 🔒 Закрываем все модали');
              const openModals = document.querySelectorAll('[data-modal-open="true"]');
              openModals.forEach(modal => {
                (modal as HTMLElement).style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                modal.removeAttribute('data-modal-open');
              });
              document.body.style.overflow = '';
            },
            
            debug: () => ({
              totalModals: document.querySelectorAll('.modal').length,
              activeModal: document.querySelector('[data-modal-open="true"]')?.id || null,
              dynamicModals: 0
            })
          };
        }
        
        // Настраиваем обработчики событий
        const handleClick = (e: Event) => {
          const target = e.target as HTMLElement;
          
          // Обработка кнопок открытия модалей
          const modalTrigger = target.closest('[data-modal]') as HTMLElement;
          if (modalTrigger) {
            e.preventDefault();
            const modalId = modalTrigger.getAttribute('data-modal');
            if (modalId && window.modalManager) {
              console.log('[SimpleModalInit] 🎯 Клик по триггеру модали:', modalId);
              window.modalManager.open(modalId);
            }
            return;
          }
          
          // Обработка кнопок закрытия модалей
          const closeButton = target.closest('[data-modal-close]');
          if (closeButton) {
            e.preventDefault();
            console.log('[SimpleModalInit] ❌ Клик по кнопке закрытия');
            if (window.modalManager) {
              window.modalManager.close();
            }
            return;
          }
          
          // Закрытие по клику вне модали
          if (target.classList.contains('modal') || target.hasAttribute('data-modal-backdrop')) {
            console.log('[SimpleModalInit] 🌐 Клик по фону модали');
            if (window.modalManager) {
              window.modalManager.close();
            }
          }
        };
        
        // Обработка клавиши Escape
        const handleKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            const openModal = document.querySelector('[data-modal-open="true"]');
            if (openModal && window.modalManager) {
              console.log('[SimpleModalInit] ⌨️ Нажата клавиша Escape');
              window.modalManager.close();
            }
          }
        };
        
        // Добавляем слушатели событий
        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeydown);
        
        console.log('[SimpleModalInit] ✅ Инициализация завершена успешно');
        
        // Автоматическая отладка через 2 секунды после инициализации
        setTimeout(() => {
          ModalDebugger.autoCheck();
        }, 2000);
        
        // Cleanup function
        return () => {
          document.removeEventListener('click', handleClick);
          document.removeEventListener('keydown', handleKeydown);
        };
        
      } catch (error) {
        console.error('[SimpleModalInit] ❌ Ошибка при инициализации:', error);
      }
    };
    
    // Инициализируем после небольшой задержки, чтобы убедиться что все компоненты загружены
    const timer = setTimeout(initializeModals, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}