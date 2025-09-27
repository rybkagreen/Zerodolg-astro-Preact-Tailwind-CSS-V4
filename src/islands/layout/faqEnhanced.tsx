import { useState, useEffect, useCallback } from 'preact/hooks';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
  initialExpandedId?: string;
  enableAnimations?: boolean;
  enableKeyboardNavigation?: boolean;
  enableSearch?: boolean;
}

const FAQEnhanced = ({
  items,
  title = 'Часто задаваемые вопросы',
  description = 'Ответы на популярные вопросы',
  initialExpandedId,
  enableAnimations = true,
  enableKeyboardNavigation = true,
  enableSearch = false
}: FAQProps) => {
  const [activeId, setActiveId] = useState<string | null>(initialExpandedId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<FAQItem[]>(items);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const prefersReducedMotion = useReducedMotion();
  const enhancedEnableAnimations = enableAnimations && !prefersReducedMotion;
  
  usePerformanceMonitor('FAQEnhanced');

  // Filter items based on search query
  useEffect(() => {
    if (enableSearch && searchQuery) {
      const filtered = items.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items, enableSearch]);

  const toggleItem = useCallback((id: string) => {
    setActiveId(prevId => prevId === id ? null : id);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent, index: number) => {
    if (!enableKeyboardNavigation) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(filteredItems.length - 1);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[index]) {
        toggleItem(filteredItems[index].id);
      }
    }
  }, [enableKeyboardNavigation, filteredItems, toggleItem]);

  // Reset focused index when items change
  useEffect(() => {
    setFocusedIndex(0);
  }, [filteredItems]);

  return (
    <section class="py-16 md:py-24 bg-gray-50" id="faq">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p class="text-lg text-gray-600">{description}</p>
        </div>

        {enableSearch && (
          <div class="mb-8 max-w-md mx-auto">
            <div class="relative">
              <input
                type="text"
                placeholder="Поиск по вопросам..."
                value={searchQuery}
                onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-3 pl-12 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Поиск по вопросам"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div class="space-y-4" role="tablist" aria-label="Список вопросов и ответов">
          {filteredItems.length === 0 ? (
            <div class="text-center py-8">
              <p class="text-gray-600">Нет вопросов, соответствующих поисковому запросу</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isActive = activeId === item.id;
              const isFocused = focusedIndex === index;

              return (
                <div
                  key={item.id}
                  class={`rounded-xl border ${
                    isActive ? 'border-blue-200 bg-white shadow-md' : 'border-gray-200 bg-white'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-expanded={isActive}
                  tabindex={isFocused ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e as KeyboardEvent, index)}
                  onClick={() => toggleItem(item.id)}
                >
                  <h3 class="font-semibold">
                    <button
                      class={`flex justify-between items-center w-full p-5 text-left font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-900'
                      }`}
                      aria-controls={`faq-content-${item.id}`}
                      aria-expanded={isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(item.id);
                      }}
                    >
                      <span>{item.question}</span>
                      <svg
                        class={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? 'transform rotate-180 text-blue-600' : 'text-gray-500'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`faq-content-${item.id}`}
                    role="tabpanel"
                    aria-labelledby={`faq-question-${item.id}`}
                    class={`overflow-hidden transition-all duration-300 ${
                      isActive && enhancedEnableAnimations
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                    style={{
                      transition: prefersReducedMotion ? 'none' : 'max-height 0.3s ease, opacity 0.3s ease'
                    }}
                  >
                    <div class="p-5 pt-0 border-t border-gray-100">
                      <p class="text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQEnhanced;