import { useState } from 'preact/hooks';

interface BankruptcyTabSwitcherProps {
  className?: string;
}

/**
 * Tab switcher component for bankruptcy types
 * Switches between standard bankruptcy and bankruptcy with property preservation
 */
const BankruptcyTabSwitcher = ({ className = '' }: BankruptcyTabSwitcherProps) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'preservation'>('standard');

  const handleTabSwitch = (tab: 'standard' | 'preservation') => {
    setActiveTab(tab);

    // Hide all content sections
    const allContent = document.querySelectorAll('.bankruptcy-content');
    allContent.forEach((content) => {
      (content as HTMLElement).classList.add('hidden');
    });

    // Show selected content
    const selectedContent = document.querySelector(`.bankruptcy-content[data-content="${tab}"]`);
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
    }

    // Track analytics
    trackTabSwitch(tab);
  };

  const trackTabSwitch = (tab: string) => {
    try {
      const win = window as typeof window & {
        gtag?: (command: string, ...args: unknown[]) => void;
        ym?: (id: number, command: string, ...args: unknown[]) => void;
      };

      if (win.gtag) {
        win.gtag('event', 'bankruptcy_tab_switch', {
          event_category: 'engagement',
          event_label: tab,
        });
      }

      if (win.ym) {
        win.ym(103604926, 'reachGoal', 'bankruptcy_tab_switch', {
          tab_type: tab,
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[BankruptcyTabSwitcher] Analytics tracking failed:', error);
      }
    }
  };

  return (
    <div className={`flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg ${className}`}>
      <button
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
          activeTab === 'standard'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        onClick={() => handleTabSwitch('standard')}
        aria-pressed={activeTab === 'standard'}
        type='button'
      >
        Стандартное
      </button>
      <button
        className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
          activeTab === 'preservation'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        onClick={() => handleTabSwitch('preservation')}
        aria-pressed={activeTab === 'preservation'}
        type='button'
      >
        С сохранением 🏠
      </button>
    </div>
  );
};

export default BankruptcyTabSwitcher;
