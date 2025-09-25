import { useState } from 'preact/hooks';

interface Modal {
  id: string;
  type: string;
}

interface DynamicModalsContextType {
  loadModal: (modalId: string) => Promise<void>;
  modals: Modal[];
}

export const useDynamicModals = (): DynamicModalsContextType => {
  const [modals, setModals] = useState<Modal[]>([]);

  const loadModal = async (modalId: string) => {
    // Implementation for loading dynamic modals
    // Add modal to state
    setModals(prev => [...prev, { id: modalId, type: 'dynamic' }]);
  };

  return { loadModal, modals };
};
