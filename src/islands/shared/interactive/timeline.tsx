import { useEffect } from 'preact/hooks';
import { type VNode } from 'preact';

// Utility function for debouncing
type DebouncedFunction<T extends (...args: Parameters<T>) => ReturnType<T>> = (
  ...args: Parameters<T>
) => void;

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>): void {
    const later = (): void => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const Timeline = (): VNode | null => {
  useEffect(() => {
    // State management
    const state = {
      currentStep: 0,
      totalSteps: 0, // Will be set dynamically
      completed: [] as number[],
      isAnimating: false,
      isComplete: false,
      previousStep: 0,
    };

    // Configuration
    const config = {
      animationDuration: 500,
      autoSaveProgress: true,
      storageKey: 'timeline_progress',
      enableKeyboardNav: true,
      enableSwipeGestures: true,
      mobileBreakpoint: 1024,
    };

    // Get DOM elements
    const section = document.querySelector('.timeline');
    if (!section) {
      console.warn('Timeline section not found');
      return;
    }

    const steps = Array.from(section.querySelectorAll('.timeline__step')) as HTMLElement[];
    const navItems = Array.from(section.querySelectorAll('.timeline__nav-item')) as HTMLElement[];
    const progressDots = Array.from(
      section.querySelectorAll('.timeline__progress-dot')
    ) as HTMLElement[];
    const progressFill = section.querySelector('.timeline__progress-fill') as HTMLElement;
    const lineProgress = section.querySelector('.timeline__line-progress') as HTMLElement;
    const completeScreen = section.querySelector('.timeline__complete') as HTMLElement;

    // Set total steps
    state.totalSteps = steps.length;

    if (state.totalSteps === 0) {
      console.error('No timeline steps found!');
      return;
    }

    // Touch gesture support
    let touchStartX = 0;
    let touchEndX = 0;

    // Track event in analytics
    const trackEvent = (
      eventName: string,
      parameters: Record<string, string | number | boolean> = {}
    ): void => {
      // Google Analytics 4
      if (window.gtag) {
        (
          window.gtag as (
            command: string,
            eventName: string,
            parameters: Record<string, unknown>
          ) => void
        )('event', eventName, {
          event_category: 'timeline_interaction',
          event_label: 'bankruptcy_process',
          ...parameters,
        });
      }

      // Yandex Metrika
      if (window.ym) {
        let validId = 98741026; // default value
        if (window.yaCounterId) {
          const counterId = typeof window.yaCounterId === 'string' 
            ? parseInt(window.yaCounterId, 10) 
            : window.yaCounterId;
          validId = !isNaN(counterId) && counterId ? counterId : 98741026;
        }
        (
          window.ym as (
            id: number,
            method: string,
            eventName: string,
            parameters?: Record<string, unknown>
          ) => void
        )(validId, 'reachGoal', eventName, parameters);
      }
    };

    // Emit custom event
    const emitEvent = (eventName: string, detail: Record<string, unknown> = {}) => {
      const event = new CustomEvent(`timeline:${eventName}`, {
        detail: {
          ...detail,
          currentStep: state.currentStep,
          totalSteps: state.totalSteps,
          completed: state.completed,
        },
      });
      document.dispatchEvent(event);
    };

    // Reset steps visibility to initial state
    const resetStepsVisibility = () => {
      steps.forEach((step, index) => {
        // Remove inline styles, let CSS handle animations
        step.style.removeProperty('opacity');
        step.style.removeProperty('transform');
        step.style.removeProperty('display');

        if (index === state.currentStep) {
          step.classList.add('active');
          step.style.display = 'block';
        } else {
          step.classList.remove('active');
          step.style.display = 'none';
        }
      });

      if (completeScreen) {
        completeScreen.style.display = 'none';
        completeScreen.classList.remove('active');
      }
    };

    // Hide a step with animation
    const hideStep = async (index: number): Promise<void> => {
      const step = steps[index];
      if (!step) return;

      return new Promise((resolve) => {
        // Add fade-out class for CSS animation
        step.classList.add('fade-out');
        step.classList.remove('active', 'fade-in');

        setTimeout(() => {
          step.style.display = 'none';
          step.classList.remove('fade-out', 'active');
          // Remove inline styles to prevent conflicts
          step.style.removeProperty('opacity');
          step.style.removeProperty('transform');
          resolve();
        }, config.animationDuration);
      });
    };

    // Show a step with animation
    const showStep = async (index: number): Promise<void> => {
      const step = steps[index];
      if (!step) return;

      return new Promise((resolve) => {
        // Prepare step for animation
        step.classList.remove('fade-out');
        step.style.display = 'block';

        // Force reflow to ensure the browser recognizes the change
        void step.offsetHeight;

        requestAnimationFrame(() => {
          // Add fade-in animation class
          step.classList.add('active', 'fade-in');
          // Remove inline styles to let CSS handle animation
          step.style.removeProperty('opacity');
          step.style.removeProperty('transform');

          setTimeout(() => {
            step.classList.remove('fade-in');
            resolve();
          }, config.animationDuration);
        });
      });
    };

    // Update UI based on current state
    const updateUI = () => {
      const current = state.currentStep;
      const progress = state.totalSteps > 1 ? (current / (state.totalSteps - 1)) * 100 : 0;

      // Update navigation items
      navItems.forEach((item, index) => {
        item.classList.toggle('active', index === current);
        item.classList.toggle('timeline-completed', state.completed.includes(index));
        item.setAttribute('aria-current', index === current ? 'step' : 'false');
      });

      // Update progress dots
      progressDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === current);
        dot.classList.toggle('timeline-completed', state.completed.includes(index));
      });

      // Update progress bars
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
      if (lineProgress) {
        lineProgress.style.height = `${progress}%`;
      }

      // Update step progress indicators
      steps.forEach((step, index) => {
        const progressBar = step.querySelector('.timeline__step-progress-fill');
        if (progressBar) {
          const stepProgress = ((index + 1) / state.totalSteps) * 100;
          (progressBar as HTMLElement).style.width = `${stepProgress}%`;
        }
      });

      // Update ARIA attributes
      const progressBar = section?.querySelector('[role="progressbar"]');
      if (progressBar) {
        progressBar.setAttribute('aria-valuenow', Math.round(progress).toString());
      }
    };

    // Go to specific step
    const goToStep = async (stepIndex: number) => {
      if (state.isAnimating || stepIndex < 0 || stepIndex >= state.totalSteps) return;
      if (stepIndex === state.currentStep) return; // Already on this step

      state.isAnimating = true;
      const previousStep = state.currentStep;

      // Track step navigation
      trackEvent('timeline_step_navigate', {
        from_step: previousStep,
        to_step: stepIndex,
        direction: stepIndex > previousStep ? 'forward' : 'backward',
      });

      // Hide current step
      await hideStep(previousStep);

      // Update state
      state.previousStep = previousStep;
      state.currentStep = stepIndex;

      // Mark step as completed if moving forward
      if (stepIndex > previousStep && !state.completed.includes(previousStep)) {
        state.completed.push(previousStep);
      }

      // Update UI elements
      updateUI();

      // Show new step
      await showStep(stepIndex);

      // Save progress
      if (config.autoSaveProgress) {
        saveProgress();
      }

      // Emit custom event
      emitEvent('step-change', {
        from: previousStep,
        to: stepIndex,
      });

      state.isAnimating = false;
    };

    // Next step
    const nextStep = async () => {
      if (state.isAnimating) return;

      if (state.isComplete) {
        // If on completion screen, do nothing or could restart
        return;
      }

      if (state.currentStep < state.totalSteps - 1) {
        await goToStep(state.currentStep + 1);
      } else {
        await showCompletionScreen();
      }
    };

    // Previous step
    const prevStep = async () => {
      if (state.isAnimating) return;

      if (state.isComplete) {
        // If on completion screen, go back to last step
        state.isComplete = false;
        if (completeScreen) {
          completeScreen.classList.add('fade-out');
          await new Promise((resolve) => setTimeout(resolve, config.animationDuration));
          completeScreen.style.display = 'none';
          completeScreen.classList.remove('active', 'fade-out');
        }
        await showStep(state.totalSteps - 1);
        state.currentStep = state.totalSteps - 1;
        updateUI();
        return;
      }

      if (state.currentStep > 0) {
        await goToStep(state.currentStep - 1);
      }
    };

    // Show completion screen
    const showCompletionScreen = async () => {
      if (state.isComplete) return;

      state.isAnimating = true;

      // Track completion
      trackEvent('timeline_completed', {
        steps_viewed: state.totalSteps,
        completed_steps: state.completed.length,
      });

      // Hide current step
      if (state.currentStep >= 0 && state.currentStep < steps.length) {
        await hideStep(state.currentStep);
      }

      // Hide all steps
      steps.forEach((step) => {
        step.style.display = 'none';
        step.classList.remove('active', 'fade-in', 'fade-out');
      });

      if (completeScreen) {
        completeScreen.style.display = 'block';
        // Force reflow
        void completeScreen.offsetHeight;

        requestAnimationFrame(() => {
          completeScreen.classList.add('active', 'fade-in');

          setTimeout(() => {
            completeScreen.classList.remove('fade-in');
          }, config.animationDuration);
        });
      }

      state.isComplete = true;
      state.isAnimating = false;

      // Emit completion event
      emitEvent('completed');
    };

    // Restart timeline
    const restart = async () => {
      if (state.isAnimating) return;

      state.isAnimating = true;

      // Track restart
      trackEvent('timeline_restart');

      // Hide completion screen if visible
      if (completeScreen && completeScreen.style.display !== 'none') {
        completeScreen.classList.add('fade-out');
        await new Promise((resolve) => setTimeout(resolve, config.animationDuration));
        completeScreen.style.display = 'none';
        completeScreen.classList.remove('active', 'fade-out');
      }

      // Reset state
      state.currentStep = 0;
      state.previousStep = 0;
      state.completed = [];
      state.isComplete = false;

      // Reset visibility and show first step
      resetStepsVisibility();
      await showStep(0);

      // Update UI
      updateUI();

      // Save reset progress
      if (config.autoSaveProgress) {
        saveProgress();
      }

      state.isAnimating = false;

      // Emit restart event
      emitEvent('restart');
    };

    // Save progress to localStorage
    const saveProgress = () => {
      if (!config.autoSaveProgress) return;

      try {
        const progressData = {
          currentStep: state.currentStep,
          completed: state.completed,
          isComplete: state.isComplete,
          timestamp: Date.now(),
          version: '2.0', // Version for migration handling
        };

        localStorage.setItem(config.storageKey, JSON.stringify(progressData));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    };

    // Load progress from localStorage
    const loadProgress = async () => {
      if (!config.autoSaveProgress) return;

      try {
        const saved = localStorage.getItem(config.storageKey);
        if (saved) {
          const data = JSON.parse(saved);

          // Check if data is from current version
          if (data.version === '2.0') {
            // Check if progress is recent (within 7 days)
            const daysSinceProgress = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);

            if (daysSinceProgress < 7) {
              state.currentStep = Math.min(data.currentStep || 0, state.totalSteps - 1);
              state.completed = data.completed || [];
              state.isComplete = data.isComplete || false;

              // Reset visibility
              resetStepsVisibility();

              // Show completion screen if was complete
              if (state.isComplete && completeScreen) {
                steps.forEach((step) => (step.style.display = 'none'));
                completeScreen.style.display = 'block';
                completeScreen.classList.add('active');
              } else if (state.currentStep > 0) {
                // Show current step
                await showStep(state.currentStep);
              }

              updateUI();

              // Track progress restoration
              trackEvent('timeline_progress_restored', {
                step: state.currentStep,
                days_since: Math.round(daysSinceProgress),
              });
            } else {
              // Progress too old, clear it
              localStorage.removeItem(config.storageKey);
            }
          } else {
            // Old version, clear it
            localStorage.removeItem(config.storageKey);
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
        // Clear corrupted data
        try {
          localStorage.removeItem(config.storageKey);
        } catch {
          // Silently ignore storage errors
        }
      }
    };

    // Handle action buttons
    const handleAction = async (action: string) => {
      if (state.isAnimating) return;

      switch (action) {
        case 'next':
          await nextStep();
          break;
        case 'prev':
          await prevStep();
          break;
        case 'complete':
          await showCompletionScreen();
          break;
        case 'restart':
          await restart();
          break;
      }
    };

    // Event listeners for navigation buttons
    const handleClick = async (e: Event) => {
      console.log('[Timeline] handleClick called');
      const target = e.target as HTMLElement;

      // Handle action buttons
      const actionBtn = target.closest('[data-action]') as HTMLElement;
      if (actionBtn) {
        e.preventDefault();
        e.stopPropagation();
        const action = actionBtn.getAttribute('data-action');
        if (action) {
          await handleAction(action);
        }
        return;
      }

      // Handle nav items
      const navItem = target.closest('.timeline__nav-item') as HTMLElement;
      if (navItem) {
        e.preventDefault();
        const stepIndex = parseInt(navItem.getAttribute('data-step') || '0');
        if (!state.isComplete) {
          await goToStep(stepIndex);
        }
        return;
      }

      // Handle progress dots
      const dot = target.closest('.timeline__progress-dot') as HTMLElement;
      if (dot) {
        e.preventDefault();
        const stepIndex = parseInt(dot.getAttribute('data-dot') || '0');
        if (!state.isComplete) {
          await goToStep(stepIndex);
        }
        return;
      }

      // Handle modal triggers
      const modalBtn = target.closest('[data-modal]') as HTMLElement;
      if (modalBtn) {
        const modalType = modalBtn.getAttribute('data-modal');
        console.log('[Timeline] Modal button clicked, modalType:', modalType);
        trackEvent('timeline_cta_click', {
          modal: modalType || 'unknown',
          from_step: state.currentStep,
          is_complete: state.isComplete,
        });
      }
    };

    section.addEventListener('click', handleClick);
    console.log('[Timeline] Click event listener added to section');

    // Keyboard navigation
    const handleKeyboard = async (e: KeyboardEvent) => {
      // Only handle if timeline section is visible and focused
      if (
        !section.contains(document.activeElement) &&
        !section.matches(':hover') &&
        document.activeElement?.tagName !== 'BODY'
      ) {
        return;
      }

      // Don't handle if user is typing in an input
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          await nextStep();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          await prevStep();
          break;
        case 'Home':
          e.preventDefault();
          if (!state.isComplete) {
            await goToStep(0);
          }
          break;
        case 'End':
          e.preventDefault();
          if (!state.isComplete) {
            await goToStep(state.totalSteps - 1);
          }
          break;
        case 'Enter':
        case ' ':
          // Space or Enter to proceed to next step
          if (section.contains(document.activeElement)) {
            e.preventDefault();
            await nextStep();
          }
          break;
        case 'Escape':
          // Escape to restart if on completion screen
          if (state.isComplete) {
            e.preventDefault();
            await restart();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    // Touch/Swipe support for mobile
    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (state.isAnimating) return;
      const firstTouch = touchEvent.changedTouches[0];
      if (firstTouch) {
        touchStartX = firstTouch.screenX;
      }
    };

    const handleTouchEnd = async (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (state.isAnimating) return;
      const firstTouch = touchEvent.changedTouches[0];
      if (firstTouch) {
        touchEndX = firstTouch.screenX;
        await handleSwipe();
      }
    };

    const handleSwipe = async () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next step
          await nextStep();
          trackEvent('timeline_swipe', { direction: 'left', step: state.currentStep });
        } else {
          // Swipe right - previous step
          await prevStep();
          trackEvent('timeline_swipe', { direction: 'right', step: state.currentStep });
        }
      }
    };

    // Add touch listeners to the content area
    const contentArea = section.querySelector('.timeline__content');
    if (contentArea && config.enableSwipeGestures) {
      contentArea.addEventListener('touchstart', handleTouchStart, { passive: true });
      contentArea.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Auto-progress on scroll (optional feature)
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px',
    };

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = entry.target as HTMLElement;
          const stepIndex = parseInt(step.getAttribute('data-step-content') || '0');

          // Update active nav item when scrolling
          navItems.forEach((item, index) => {
            if (index === stepIndex) {
              item.classList.add('in-view');
            } else {
              item.classList.remove('in-view');
            }
          });
        }
      });
    }, observerOptions);

    // Observe all steps
    steps.forEach((step) => {
      stepObserver.observe(step);
    });

    // Handle window resize with debouncing
    const handleResize = debounce(() => {
      // Update mobile/desktop specific UI elements
      const isMobile = window.innerWidth < config.mobileBreakpoint;
      section.classList.toggle('timeline--mobile', isMobile);
      section.classList.toggle('timeline--desktop', !isMobile);

      // Update progress bar visibility
      updateUI();
    }, 250);

    window.addEventListener('resize', handleResize);

    // Initialize timeline
    const init = async () => {
      console.log('Timeline Init: Starting initialization');
      console.log('Timeline Init: Total steps =', state.totalSteps);
      console.log('Timeline Init: Current step =', state.currentStep);

      // Set initial responsive state
      handleResize();

      // Track timeline view
      trackEvent('timeline_view', {
        total_steps: state.totalSteps,
        viewport: window.innerWidth < config.mobileBreakpoint ? 'mobile' : 'desktop',
      });

      // Reset initial visibility
      resetStepsVisibility();
      console.log('Timeline Init: Reset visibility completed');

      // Load saved progress
      await loadProgress();

      // Focus management for accessibility
      const firstActionBtn = section.querySelector('[data-action]') as HTMLElement;
      if (firstActionBtn) {
        firstActionBtn.setAttribute('tabindex', '0');
      }

      // Add ARIA live region for screen readers
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      section.appendChild(liveRegion);

      // Update live region on step change
      document.addEventListener('timeline:step-change', (e: Event) => {
        const customEvent = e as CustomEvent;
        const { to } = customEvent.detail;
        const currentStepElement = steps[to];
        if (currentStepElement) {
          const title =
            currentStepElement.querySelector('.timeline__step-title')?.textContent || '';
          liveRegion.textContent = `Шаг ${to + 1} из ${state.totalSteps}: ${title}`;
        }
      });

      console.log('Timeline Init: Completed successfully');
    };

    // Start initialization
    init();

    // Cleanup function
    return () => {
      // Remove event listeners
      section.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyboard);
      window.removeEventListener('resize', handleResize);

      if (contentArea) {
        contentArea.removeEventListener('touchstart', handleTouchStart);
        contentArea.removeEventListener('touchend', handleTouchEnd);
      }

      // Disconnect observers
      steps.forEach((step) => {
        stepObserver.unobserve(step);
      });
      stepObserver.disconnect();

      // Remove added elements
      const liveRegion = section.querySelector('[aria-live]');
      if (liveRegion) {
        liveRegion.remove();
      }

      // Save final progress
      if (config.autoSaveProgress) {
        saveProgress();
      }
    };
  }, []);

  return null;
};

export default Timeline;
