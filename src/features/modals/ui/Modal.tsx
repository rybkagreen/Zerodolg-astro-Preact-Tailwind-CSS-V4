import { type VNode, type ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useModal } from '../model/modal-context';

interface ModalProps {
  id: string;
  title: string;
  onClose?: () => void;
  children: ComponentChildren;
}

export default function Modal({ id, title, onClose, children }: ModalProps): VNode | null {
  const { activeModal, closeModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpen = activeModal === id;

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    closeModal();
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div class='modal modal--visible' ref={modalRef}>
      <div class='modal__overlay'></div>
      <div class='modal__container'>
        <div class='modal__header'>
          <h3 class='modal__title'>{title}</h3>
          <button class='modal__close' onClick={handleClose}>
            &times;
          </button>
        </div>
        <div class='modal__body'>{children}</div>
      </div>
    </div>
  );
}
