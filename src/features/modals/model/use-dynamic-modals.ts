import { useState, useCallback } from 'preact/hooks';
import { useModal } from './modal-context';

interface DynamicModal {
  id: string;
  type: string;
  data?: any;
}

export const useDynamicModals = () => {
  const { openModal } = useModal();
  const [modals, setModals] = useState<DynamicModal[]>([]);

  const createModal = useCallback(
    (id: string, type: string, data?: any) => {
      setModals((prev) => {
        // Check if modal already exists
        if (prev.some((modal) => modal.id === id)) {
          return prev;
        }
        return [...prev, { id, type, data }];
      });
      openModal(id);
    },
    [openModal]
  );

  const removeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  return { modals, createModal, removeModal };
};
