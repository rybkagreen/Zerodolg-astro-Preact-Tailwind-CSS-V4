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
    <div
      className={`inline-flex items-center gap-1 mb-6 bg-gradient-to-br from-slate-50 to-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/60 ${className}`}
    >
      <button
        className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-out ${
          activeTab === 'standard'
            ? 'bg-white text-blue-600 shadow-md shadow-blue-100/50 scale-[1.02]'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 active:scale-95'
        }`}
        onClick={() => handleTabSwitch('standard')}
        aria-pressed={activeTab === 'standard'}
        type='button'
      >
        <span className='relative z-10'>Стандартное</span>
        {activeTab === 'standard' && (
          <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-lg opacity-50' />
        )}
      </button>
      <button
        className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-out ${
          activeTab === 'preservation'
            ? 'bg-white text-blue-600 shadow-md shadow-blue-100/50 scale-[1.02]'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 active:scale-95'
        }`}
        onClick={() => handleTabSwitch('preservation')}
        aria-pressed={activeTab === 'preservation'}
        type='button'
      >
        <span className='relative z-10 flex items-center gap-1.5'>
          С сохранением
          <span className='text-base' role='img' aria-label='дом'>
            🏠
          </span>
        </span>
        {activeTab === 'preservation' && (
          <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-lg opacity-50' />
        )}
      </button>
    </div>
  );
};

export default BankruptcyTabSwitcher;
