import { useState, useEffect, useCallback } from 'preact/hooks';
import { type VNode } from 'preact';

// Icon mapping for different process steps
const getStepIcon = (icon: string): VNode => {
  switch (icon) {
    case 'analysis':
      return (
        <svg
          class='w-6 h-6 md:w-8 md:h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      );
    case 'documents':
      return (
        <svg
          class='w-6 h-6 md:w-8 md:h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      );
    case 'court':
      return (
        <svg
          class='w-6 h-6 md:w-8 md:h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
          />
        </svg>
      );
    case 'gavel':
      return (
        <svg
          class='w-6 h-6 md:w-8 md:h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-1m3 1l3-1'
          />
        </svg>
      );
    case 'discharge':
      return (
        <svg
          class='w-6 h-6 md:w-8 md:h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      );
    default:
      return (
        <svg
          class='w-6 h-6 md:w-8 md:h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
          />
        </svg>
      );
  }
};

interface Step {
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
  gradient: string;
  hoverColor: string;
  bgGradient: string;
  details: string[];
  documents?: string[];
  warning?: string;
}

interface ProcessData {
  title: string;
  subtitle: string;
  steps: Step[];
}

interface ProcessInteractiveProps {
  processData: ProcessData;
}

const ProcessInteractive = ({ processData }: ProcessInteractiveProps): VNode | null => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get current step data
  const getCurrentStep = useCallback(() => {
    return processData.steps[currentStep] || processData.steps[0];
  }, [currentStep, processData.steps]);

  // Navigate to specific step
  const goToStep = useCallback(
    async (stepIndex: number) => {
      if (
        isAnimating ||
        stepIndex < 0 ||
        stepIndex >= processData.steps.length ||
        stepIndex === currentStep
      ) {
        return;
      }

      setIsAnimating(true);
      setCurrentStep(stepIndex);

      // Update UI elements
      updateStepUI(stepIndex);

      // Wait for animation to complete
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating, currentStep, processData.steps.length]
  );

  // Update UI elements based on current step
  const updateStepUI = useCallback(
    (stepIndex: number) => {
      const step = processData.steps[stepIndex];
      if (!step) return;

      // Update step indicator
      const stepNumberEl = document.getElementById('process-step-number');
      if (stepNumberEl) {
        stepNumberEl.textContent = step.number.toString();
      }

      // Update accent border gradient
      const accentBorderEl = document.getElementById('process-accent-border');
      if (accentBorderEl) {
        accentBorderEl.className = `absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${step.gradient} transition-all duration-500 rounded-t-3xl`;
      }

      // Update hover background
      const hoverBgEl = document.getElementById('process-hover-bg');
      if (hoverBgEl) {
        hoverBgEl.className = `absolute inset-0 ${step.bgGradient} opacity-0 transition-opacity duration-500 -z-10 pointer-events-none`;
      }

      // Update navigation buttons
      const navButtons = document.querySelectorAll('.process-nav-btn');
      navButtons.forEach((btn, index) => {
        const button = btn as HTMLButtonElement;
        if (index === stepIndex) {
          button.className = `process-nav-btn px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 border-2 bg-gradient-to-r ${step.gradient} text-white border-transparent shadow-md`;
        } else {
          button.className =
            'process-nav-btn px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 border-2 bg-white/50 text-slate-600 border-white/30 hover:bg-white/70 hover:text-slate-800';
        }
      });

      // Update progress dots
      const progressDots = document.querySelectorAll('.process-progress-dot');
      progressDots.forEach((dot, index) => {
        const dotEl = dot as HTMLElement;
        if (index === stepIndex) {
          dotEl.className = `w-3 h-3 rounded-full transition-all duration-300 process-progress-dot active bg-gradient-to-r ${step.gradient}`;
        } else if (index < stepIndex) {
          dotEl.className =
            'w-2 h-2 rounded-full transition-all duration-300 process-progress-dot bg-green-500';
        } else {
          dotEl.className =
            'w-2 h-2 rounded-full transition-all duration-300 process-progress-dot bg-slate-300';
        }
      });

      // Update prev/next buttons
      const prevBtn = document.getElementById('process-prev-btn') as HTMLButtonElement;
      const nextBtn = document.getElementById('process-next-btn') as HTMLButtonElement;

      if (prevBtn) {
        prevBtn.disabled = stepIndex === 0;
        prevBtn.className = `flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-all duration-300 ${stepIndex === 0 ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`;
      }

      if (nextBtn) {
        if (stepIndex === processData.steps.length - 1) {
          nextBtn.innerHTML = `
          <span>Готово</span>
          <svg class='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' />
          </svg>
        `;
          nextBtn.className =
            'flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all duration-300';
        } else {
          nextBtn.innerHTML = `
          <span>Далее</span>
          <svg class='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' />
          </svg>
        `;
          nextBtn.className = `flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${step.gradient} text-white hover:shadow-lg transition-all duration-300`;
        }
      }
    },
    [processData.steps]
  );

  // Render current step content
  const renderStepContent = useCallback(() => {
    const step = getCurrentStep();
    if (!step) return <div>Загрузка...</div>;

    return (
      <div class='process-step-content fade-in' data-step={currentStep}>
        {/* Step header */}
        <div class='flex items-start gap-4 mb-6'>
          <div
            class={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            {getStepIcon(step.icon)}
          </div>
          <div>
            <h3 class='text-2xl md:text-3xl font-bold text-slate-900 mb-2'>{step.title}</h3>
            <div class='flex items-center gap-3 mb-4'>
              <span
                class={`px-3 py-1 bg-gradient-to-r ${step.gradient} bg-opacity-10 text-slate-700 rounded-full text-sm font-medium`}
              >
                {step.duration}
              </span>
              <span class='text-slate-500'>•</span>
              <span class='text-slate-600'>
                Этап {step.number} из {processData.steps.length}
              </span>
            </div>
            <p class='text-lg text-slate-700 leading-relaxed'>{step.description}</p>
          </div>
        </div>

        {/* Details */}
        <div class='space-y-6'>
          <div>
            <h4 class='text-lg font-semibold text-slate-900 mb-4'>Что включает:</h4>
            <ul class='space-y-3'>
              {step.details.map((detail, idx) => (
                <li key={idx} class='flex items-start gap-3'>
                  <div class='mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                    <svg
                      class='w-3 h-3 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='3'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <span class='text-slate-700'>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents (if available) */}
          {step.documents && (
            <div class='rounded-2xl bg-slate-50/80 p-6'>
              <h4 class='mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900'>
                <svg
                  class='h-5 w-5 text-slate-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                Необходимые документы:
              </h4>
              <ul class='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {step.documents.map((doc, idx) => (
                  <li key={idx} class='flex items-center gap-2 text-sm text-slate-600'>
                    <div class='h-1.5 w-1.5 rounded-full bg-slate-400' />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning (if available) */}
          {step.warning && (
            <div class='rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200'>
              <div class='flex gap-3'>
                <div class='mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10'>
                  <svg
                    class='h-4 w-4 text-amber-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <p class='text-amber-800 font-medium'>{step.warning}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [currentStep, getCurrentStep, processData.steps.length]);

  // Handle navigation
  const handleNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      if (direction === 'prev' && currentStep > 0) {
        goToStep(currentStep - 1);
      } else if (direction === 'next' && currentStep < processData.steps.length - 1) {
        goToStep(currentStep + 1);
      }
    },
    [currentStep, goToStep, processData.steps.length]
  );

  // Set up event listeners
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      // Handle navigation button clicks
      const navBtn = target.closest('.process-nav-btn') as HTMLButtonElement;
      if (navBtn) {
        e.preventDefault();
        const stepIndex = parseInt(navBtn.getAttribute('data-step') || '0');
        goToStep(stepIndex);
        return;
      }

      // Handle prev/next buttons
      const prevBtn = target.closest('#process-prev-btn');
      const nextBtn = target.closest('#process-next-btn');

      if (prevBtn) {
        e.preventDefault();
        handleNavigation('prev');
        return;
      }

      if (nextBtn) {
        e.preventDefault();
        if (currentStep === processData.steps.length - 1) {
          // Last step - trigger completion
          console.log('Process completed!');
          // You can add completion logic here
        } else {
          handleNavigation('next');
        }
        return;
      }

      // Handle progress dot clicks
      const progressDot = target.closest('.process-progress-dot') as HTMLElement;
      if (progressDot) {
        e.preventDefault();
        const stepIndex = parseInt(progressDot.getAttribute('data-step') || '0');
        goToStep(stepIndex);
        return;
      }
    };

    // Handle keyboard navigation
    const handleKeyboard = (e: KeyboardEvent) => {
      // Only handle if process section is focused or visible
      const processSection = document.getElementById('process');
      if (!processSection || !processSection.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          handleNavigation('prev');
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          handleNavigation('next');
          break;
        case 'Home':
          e.preventDefault();
          goToStep(0);
          break;
        case 'End':
          e.preventDefault();
          goToStep(processData.steps.length - 1);
          break;
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyboard);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [currentStep, handleNavigation, goToStep, processData.steps.length]);

  // Update content when step changes
  useEffect(() => {
    const contentEl = document.getElementById('process-content');
    if (contentEl) {
      // Fade out current content
      contentEl.style.opacity = '0';
      contentEl.style.transform = 'translateY(20px)';

      setTimeout(() => {
        // Update content
        const newContent = document.createElement('div');
        newContent.innerHTML = renderStepContent().props.children as string;
        contentEl.innerHTML = '';
        contentEl.appendChild(newContent);

        // Fade in new content
        requestAnimationFrame(() => {
          contentEl.style.opacity = '1';
          contentEl.style.transform = 'translateY(0)';
        });
      }, 250);
    }

    // Update UI elements
    updateStepUI(currentStep);
  }, [currentStep, renderStepContent, updateStepUI]);

  // Initial setup
  useEffect(() => {
    updateStepUI(0);
  }, [updateStepUI]);

  return null; // This component only manages DOM interactions
};

export default ProcessInteractive;
