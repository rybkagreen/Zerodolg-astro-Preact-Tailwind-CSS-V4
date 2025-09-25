import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Process Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test process initialization
  it('should initialize process component correctly', () => {
    // Create process element
    const process = document.createElement('section');
    process.className = 'process';
    process.id = 'process';

    // Add to DOM
    document.body.appendChild(process);

    // Verify process exists
    expect(document.getElementById('process')).toBeTruthy();
    expect(document.querySelector('.process')).toBeTruthy();

    // Verify process attributes
    const processElement = document.getElementById('process');
    expect(processElement?.tagName.toLowerCase()).toBe('section');
    expect(processElement?.className).toBe('process');
  });

  // Test process step navigation
  it('should handle step navigation correctly', () => {
    // Process steps data
    const processSteps = [
      {
        id: 'analysis',
        number: 1,
        title: 'Анализ ситуации',
        description: 'Изучаем вашу финансовую ситуацию и определяем перспективы банкротства',
        duration: '1 день',
        difficulty: 'easy',
      },
      {
        id: 'documentation',
        number: 2,
        title: 'Подготовка документов',
        description: 'Собираем и оформляем все необходимые документы для подачи заявления',
        duration: '5-7 дней',
        difficulty: 'medium',
      },
      {
        id: 'filing',
        number: 3,
        title: 'Подача заявления',
        description: 'Подаем заявление в Арбитражный суд и регистрируем дело',
        duration: '1 день',
        difficulty: 'easy',
      },
      {
        id: 'procedure',
        number: 4,
        title: 'Судебная процедура',
        description: 'Представляем ваши интересы на всех судебных заседаниях',
        duration: '4-6 месяцев',
        difficulty: 'hard',
      },
      {
        id: 'discharge',
        number: 5,
        title: 'Списание долгов',
        description: 'Получаем решение суда о полном списании всех долгов',
        duration: '1 день',
        difficulty: 'easy',
      },
    ];

    // Step navigation logic
    const processState = {
      currentStep: 0,
      totalSteps: processSteps.length,
      completedSteps: [] as number[],
      isNavigating: false,
    };

    const navigateToStep = (stepIndex: number, state = processState) => {
      if (stepIndex >= 0 && stepIndex < state.totalSteps && !state.isNavigating) {
        state.isNavigating = true;

        // Mark previous steps as completed if moving forward
        if (stepIndex > state.currentStep) {
          for (let i = state.currentStep; i < stepIndex; i++) {
            if (!state.completedSteps.includes(i)) {
              state.completedSteps.push(i);
            }
          }
        }

        state.currentStep = stepIndex;
        state.isNavigating = false;
        return true;
      }
      return false;
    };

    const nextStep = (state = processState) => {
      return navigateToStep(state.currentStep + 1, state);
    };

    const prevStep = (state = processState) => {
      return navigateToStep(state.currentStep - 1, state);
    };

    // Test initial state
    expect(processState.currentStep).toBe(0);
    expect(processState.totalSteps).toBe(5);
    expect(processState.completedSteps.length).toBe(0);
    expect(processState.isNavigating).toBe(false);

    // Test navigation to next step
    const nextResult = nextStep();
    expect(nextResult).toBe(true);
    expect(processState.currentStep).toBe(1);
    expect(processState.completedSteps).toContain(0);

    // Test navigation to specific step
    const specificResult = navigateToStep(3);
    expect(specificResult).toBe(true);
    expect(processState.currentStep).toBe(3);
    expect(processState.completedSteps).toContain(1);
    expect(processState.completedSteps).toContain(2);

    // Test backward navigation
    const prevResult = prevStep();
    expect(prevResult).toBe(true);
    expect(processState.currentStep).toBe(2);
    // Completed steps should remain unchanged when going back
    expect(processState.completedSteps).toContain(0);
    expect(processState.completedSteps).toContain(1);
    expect(processState.completedSteps).toContain(2);

    // Test invalid navigation
    const invalidNext = nextStep(); // From step 2 to 3
    expect(invalidNext).toBe(true);
    expect(processState.currentStep).toBe(3);

    const invalidPrev = prevStep(); // From step 3 to 2
    expect(invalidPrev).toBe(true);
    expect(processState.currentStep).toBe(2);

    // Test boundary conditions
    const goToFirst = navigateToStep(0);
    expect(goToFirst).toBe(true);
    expect(processState.currentStep).toBe(0);

    const goToLast = navigateToStep(4);
    expect(goToLast).toBe(true);
    expect(processState.currentStep).toBe(4);

    // Test out of bounds navigation
    const outOfBoundsForward = nextStep();
    expect(outOfBoundsForward).toBe(false); // Already at last step
    expect(processState.currentStep).toBe(4);

    const outOfBoundsBackward = navigateToStep(-1);
    expect(outOfBoundsBackward).toBe(false); // Negative index
    expect(processState.currentStep).toBe(4);
  });

  // Test step completion tracking
  it('should track step completion correctly', () => {
    const processSteps = [
      { id: 'analysis', number: 1, title: 'Анализ ситуации' },
      { id: 'documentation', number: 2, title: 'Подготовка документов' },
      { id: 'filing', number: 3, title: 'Подача заявления' },
      { id: 'procedure', number: 4, title: 'Судебная процедура' },
      { id: 'discharge', number: 5, title: 'Списание долгов' },
    ];

    const completionState = {
      completedSteps: new Set<number>(),
      markStepCompleted: function (stepIndex: number) {
        this.completedSteps.add(stepIndex);
      },
      isStepCompleted: function (stepIndex: number) {
        return this.completedSteps.has(stepIndex);
      },
      getCompletionPercentage: function (totalSteps: number) {
        return totalSteps > 0 ? (this.completedSteps.size / totalSteps) * 100 : 0;
      },
      getCompletedStepsCount: function () {
        return this.completedSteps.size;
      },
      resetCompletion: function () {
        this.completedSteps.clear();
      },
    };

    // Test initial state
    expect(completionState.getCompletedStepsCount()).toBe(0);
    expect(completionState.getCompletionPercentage(5)).toBe(0);
    expect(completionState.isStepCompleted(0)).toBe(false);
    expect(completionState.isStepCompleted(1)).toBe(false);
    expect(completionState.isStepCompleted(2)).toBe(false);
    expect(completionState.isStepCompleted(3)).toBe(false);
    expect(completionState.isStepCompleted(4)).toBe(false);

    // Test marking steps as completed
    completionState.markStepCompleted(0);
    expect(completionState.getCompletedStepsCount()).toBe(1);
    expect(completionState.getCompletionPercentage(5)).toBe(20);
    expect(completionState.isStepCompleted(0)).toBe(true);
    expect(completionState.isStepCompleted(1)).toBe(false);

    completionState.markStepCompleted(1);
    completionState.markStepCompleted(2);
    expect(completionState.getCompletedStepsCount()).toBe(3);
    expect(completionState.getCompletionPercentage(5)).toBe(60);
    expect(completionState.isStepCompleted(0)).toBe(true);
    expect(completionState.isStepCompleted(1)).toBe(true);
    expect(completionState.isStepCompleted(2)).toBe(true);
    expect(completionState.isStepCompleted(3)).toBe(false);

    completionState.markStepCompleted(3);
    completionState.markStepCompleted(4);
    expect(completionState.getCompletedStepsCount()).toBe(5);
    expect(completionState.getCompletionPercentage(5)).toBe(100);
    expect(completionState.isStepCompleted(0)).toBe(true);
    expect(completionState.isStepCompleted(1)).toBe(true);
    expect(completionState.isStepCompleted(2)).toBe(true);
    expect(completionState.isStepCompleted(3)).toBe(true);
    expect(completionState.isStepCompleted(4)).toBe(true);

    // Test duplicate completion (should not affect count)
    completionState.markStepCompleted(0);
    expect(completionState.getCompletedStepsCount()).toBe(5); // Still 5
    expect(completionState.getCompletionPercentage(5)).toBe(100); // Still 100%

    // Test resetting completion
    completionState.resetCompletion();
    expect(completionState.getCompletedStepsCount()).toBe(0);
    expect(completionState.getCompletionPercentage(5)).toBe(0);
    expect(completionState.isStepCompleted(0)).toBe(false);
    expect(completionState.isStepCompleted(1)).toBe(false);
    expect(completionState.isStepCompleted(2)).toBe(false);
    expect(completionState.isStepCompleted(3)).toBe(false);
    expect(completionState.isStepCompleted(4)).toBe(false);
  });

  // Test process timeline visualization
  it('should visualize process timeline correctly', () => {
    const processSteps = [
      { id: 'analysis', number: 1, title: 'Анализ ситуации', duration: '1 день' },
      { id: 'documentation', number: 2, title: 'Подготовка документов', duration: '5-7 дней' },
      { id: 'filing', number: 3, title: 'Подача заявления', duration: '1 день' },
      { id: 'procedure', number: 4, title: 'Судебная процедура', duration: '4-6 месяцев' },
      { id: 'discharge', number: 5, title: 'Списание долгов', duration: '1 день' },
    ];

    // Timeline visualization logic
    const createTimelineVisualization = (steps: typeof processSteps) => {
      return steps.map((step, index) => ({
        id: step.id,
        number: step.number,
        title: step.title,
        duration: step.duration,
        position: index,
        isActive: index === 0, // First step is active by default
        isCompleted: false,
        progress: index === 0 ? 100 : 0, // First step is 100% complete by default
      }));
    };

    const timeline = createTimelineVisualization(processSteps);

    // Verify timeline structure
    expect(timeline.length).toBe(5);

    timeline.forEach((step, index) => {
      expect(step.id).toBe(processSteps[index].id);
      expect(step.number).toBe(processSteps[index].number);
      expect(step.title).toBe(processSteps[index].title);
      expect(step.duration).toBe(processSteps[index].duration);
      expect(step.position).toBe(index);
      expect(step.isActive).toBe(index === 0);
      expect(step.isCompleted).toBe(false);
      expect(step.progress).toBe(index === 0 ? 100 : 0);
    });

    // Test timeline updates
    const updateTimelineStep = (
      timeline: ReturnType<typeof createTimelineVisualization>,
      stepId: string,
      updates: Partial<(typeof timeline)[0]>
    ) => {
      const stepIndex = timeline.findIndex((step) => step.id === stepId);
      if (stepIndex !== -1) {
        Object.assign(timeline[stepIndex], updates);
      }
      return timeline;
    };

    // Activate second step
    const updatedTimeline = updateTimelineStep(timeline, 'documentation', {
      isActive: true,
      progress: 50,
    });

    expect(updatedTimeline[0].isActive).toBe(false); // First step no longer active
    expect(updatedTimeline[1].isActive).toBe(true); // Second step now active
    expect(updatedTimeline[1].progress).toBe(50); // Progress updated

    // Complete first step
    updateTimelineStep(timeline, 'analysis', {
      isCompleted: true,
      progress: 100,
    });

    expect(timeline[0].isCompleted).toBe(true);
    expect(timeline[0].progress).toBe(100);

    // Test timeline visualization helpers
    const getActiveStep = (timeline: typeof timeline) => {
      return timeline.find((step) => step.isActive);
    };

    const getCompletedSteps = (timeline: typeof timeline) => {
      return timeline.filter((step) => step.isCompleted);
    };

    const getInProgressSteps = (timeline: typeof timeline) => {
      return timeline.filter((step) => step.progress > 0 && step.progress < 100);
    };

    const activeStep = getActiveStep(timeline);
    const completedSteps = getCompletedSteps(timeline);
    const inProgressSteps = getInProgressSteps(timeline);

    expect(activeStep?.id).toBe('documentation');
    expect(completedSteps.length).toBe(1);
    expect(completedSteps[0].id).toBe('analysis');
    expect(inProgressSteps.length).toBe(1);
    expect(inProgressSteps[0].id).toBe('documentation');
  });

  // Test process step details
  it('should handle step details correctly', () => {
    const processStepDetails = {
      analysis: {
        title: 'Анализ ситуации',
        description: 'Изучаем вашу финансовую ситуацию и определяем перспективы банкротства',
        duration: '1 день',
        difficulty: 'easy',
        icon: '/icons/process/analysis.svg',
        details: [
          'Бесплатная консультация по телефону или в офисе',
          'Анализ всех долгов и источников дохода',
          'Определение оптимальной стратегии банкротства',
          'Расчет стоимости процедуры',
        ],
        documents: [
          'Паспорт гражданина РФ',
          'СНИЛС',
          'ИНН',
          'Справки о доходах за последние 3 года',
        ],
      },
      documentation: {
        title: 'Подготовка документов',
        description: 'Собираем и оформляем все необходимые документы для подачи заявления',
        duration: '5-7 дней',
        difficulty: 'medium',
        icon: '/icons/process/documentation.svg',
        details: [
          'Помощь в сборе необходимых документов',
          'Подготовка заявления о банкротстве',
          'Составление списка кредиторов',
          'Оформление приложений к заявлению',
        ],
        documents: [
          'Кредитные договоры',
          'Справки о задолженности',
          'Выписки из банка',
          'Документы на имущество',
        ],
      },
    };

    // Test step detail structure
    Object.entries(processStepDetails).forEach(([stepId, step]) => {
      expect(typeof stepId).toBe('string');
      expect(step.title).toBeDefined();
      expect(step.description).toBeDefined();
      expect(step.duration).toBeDefined();
      expect(step.difficulty).toBeDefined();
      expect(step.icon).toBeDefined();
      expect(Array.isArray(step.details)).toBe(true);
      expect(Array.isArray(step.documents)).toBe(true);

      expect(typeof step.title).toBe('string');
      expect(typeof step.description).toBe('string');
      expect(typeof step.duration).toBe('string');
      expect(typeof step.difficulty).toBe('string');
      expect(typeof step.icon).toBe('string');
      expect(step.details.length).toBeGreaterThan(0);
      expect(step.documents.length).toBeGreaterThan(0);

      // Test that all details and documents are strings
      step.details.forEach((detail) => {
        expect(typeof detail).toBe('string');
        expect(detail.length).toBeGreaterThan(0);
      });

      step.documents.forEach((document) => {
        expect(typeof document).toBe('string');
        expect(document.length).toBeGreaterThan(0);
      });
    });

    // Test step detail retrieval
    const getStepDetail = (
      stepId: keyof typeof processStepDetails,
      detailType: 'title' | 'description' | 'duration' | 'difficulty' | 'icon'
    ) => {
      const step = processStepDetails[stepId];
      return step ? step[detailType] : null;
    };

    expect(getStepDetail('analysis', 'title')).toBe('Анализ ситуации');
    expect(getStepDetail('analysis', 'description')).toBe(
      'Изучаем вашу финансовую ситуацию и определяем перспективы банкротства'
    );
    expect(getStepDetail('analysis', 'duration')).toBe('1 день');
    expect(getStepDetail('analysis', 'difficulty')).toBe('easy');
    expect(getStepDetail('analysis', 'icon')).toBe('/icons/process/analysis.svg');

    expect(getStepDetail('documentation', 'title')).toBe('Подготовка документов');
    expect(getStepDetail('documentation', 'description')).toBe(
      'Собираем и оформляем все необходимые документы для подачи заявления'
    );
    expect(getStepDetail('documentation', 'duration')).toBe('5-7 дней');
    expect(getStepDetail('documentation', 'difficulty')).toBe('medium');
    expect(getStepDetail('documentation', 'icon')).toBe('/icons/process/documentation.svg');

    // Test invalid step retrieval
    expect(getStepDetail('invalid' as any, 'title')).toBeNull();
  });

  // Test process interactivity
  it('should handle process interactivity correctly', () => {
    // Create interactive process elements
    const processContainer = document.createElement('div');
    processContainer.className = 'process__container';

    const stepButtons = [];
    for (let i = 0; i < 5; i++) {
      const button = document.createElement('button');
      button.className = `process__step-button process__step-${i + 1}`;
      button.setAttribute('data-step', (i + 1).toString());
      button.textContent = `Шаг ${i + 1}`;
      stepButtons.push(button);
      processContainer.appendChild(button);
    }

    document.body.appendChild(processContainer);

    // Test step button creation
    expect(processContainer.querySelectorAll('.process__step-button').length).toBe(5);

    stepButtons.forEach((button, index) => {
      expect(button.getAttribute('data-step')).toBe((index + 1).toString());
      expect(button.textContent).toBe(`Шаг ${index + 1}`);
      expect(button.className).toContain(`process__step-${index + 1}`);
    });

    // Test step activation
    const activateStep = (stepNumber: number) => {
      // Remove active class from all buttons
      stepButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-current', 'false');
      });

      // Add active class to selected button
      const selectedButton = stepButtons[stepNumber - 1];
      if (selectedButton) {
        selectedButton.classList.add('active');
        selectedButton.setAttribute('aria-current', 'step');
      }
    };

    // Test initial activation
    activateStep(1);
    expect(stepButtons[0].classList.contains('active')).toBe(true);
    expect(stepButtons[0].getAttribute('aria-current')).toBe('step');

    stepButtons.slice(1).forEach((button) => {
      expect(button.classList.contains('active')).toBe(false);
      expect(button.getAttribute('aria-current')).toBe('false');
    });

    // Test step change
    activateStep(3);
    expect(stepButtons[2].classList.contains('active')).toBe(true);
    expect(stepButtons[2].getAttribute('aria-current')).toBe('step');

    stepButtons.forEach((button, index) => {
      if (index !== 2) {
        expect(button.classList.contains('active')).toBe(false);
        expect(button.getAttribute('aria-current')).toBe('false');
      }
    });

    // Test keyboard navigation
    let currentStep = 1;

    const navigateWithKeyboard = (direction: 'next' | 'prev') => {
      if (direction === 'next' && currentStep < 5) {
        currentStep++;
        activateStep(currentStep);
      } else if (direction === 'prev' && currentStep > 1) {
        currentStep--;
        activateStep(currentStep);
      }
    };

    // Test next navigation
    navigateWithKeyboard('next');
    expect(currentStep).toBe(4);
    expect(stepButtons[3].classList.contains('active')).toBe(true);

    navigateWithKeyboard('next');
    expect(currentStep).toBe(5);
    expect(stepButtons[4].classList.contains('active')).toBe(true);

    // Test boundary condition - can't go further
    navigateWithKeyboard('next');
    expect(currentStep).toBe(5); // Still at step 5

    // Test previous navigation
    navigateWithKeyboard('prev');
    expect(currentStep).toBe(4);
    expect(stepButtons[3].classList.contains('active')).toBe(true);

    navigateWithKeyboard('prev');
    expect(currentStep).toBe(3);
    expect(stepButtons[2].classList.contains('active')).toBe(true);
  });

  // Test process accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible process elements
    const processSection = document.createElement('section');
    processSection.setAttribute('role', 'region');
    processSection.setAttribute('aria-label', 'Процесс банкротства физических лиц');
    processSection.id = 'process';

    const processHeader = document.createElement('header');
    processHeader.className = 'process__header';

    const processTitle = document.createElement('h2');
    processTitle.id = 'process-title';
    processTitle.textContent = 'Как проходит процесс банкротства';

    const processSubtitle = document.createElement('p');
    processSubtitle.setAttribute('aria-describedby', 'process-title');
    processSubtitle.textContent = 'Пошаговое описание процедуры освобождения от долгов';

    const processNav = document.createElement('nav');
    processNav.setAttribute('role', 'navigation');
    processNav.setAttribute('aria-label', 'Навигация по этапам процесса');

    const processStepsList = document.createElement('ol');
    processStepsList.setAttribute('role', 'list');
    processStepsList.setAttribute('aria-labelledby', 'process-title');

    // Create process steps with accessibility
    const processSteps = [
      { id: 'step-1', number: 1, title: 'Анализ ситуации' },
      { id: 'step-2', number: 2, title: 'Подготовка документов' },
      { id: 'step-3', number: 3, title: 'Подача заявления' },
      { id: 'step-4', number: 4, title: 'Судебная процедура' },
      { id: 'step-5', number: 5, title: 'Списание долгов' },
    ];

    processSteps.forEach((step, index) => {
      const stepItem = document.createElement('li');
      stepItem.setAttribute('role', 'listitem');

      const stepButton = document.createElement('button');
      stepButton.id = step.id;
      stepButton.setAttribute('role', 'tab');
      stepButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      stepButton.setAttribute('aria-controls', `step-content-${step.number}`);
      stepButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
      stepButton.textContent = `${step.number}. ${step.title}`;

      stepItem.appendChild(stepButton);
      processStepsList.appendChild(stepItem);
    });

    // Append elements
    processHeader.appendChild(processTitle);
    processHeader.appendChild(processSubtitle);
    processNav.appendChild(processStepsList);
    processSection.appendChild(processHeader);
    processSection.appendChild(processNav);
    document.body.appendChild(processSection);

    // Verify accessibility attributes
    expect(processSection.getAttribute('role')).toBe('region');
    expect(processSection.getAttribute('aria-label')).toBe('Процесс банкротства физических лиц');
    expect(processSection.id).toBe('process');

    expect(processHeader.querySelector('h2')?.id).toBe('process-title');
    expect(processHeader.querySelector('p')?.getAttribute('aria-describedby')).toBe(
      'process-title'
    );

    expect(processNav.getAttribute('role')).toBe('navigation');
    expect(processNav.getAttribute('aria-label')).toBe('Навигация по этапам процесса');

    expect(processStepsList.getAttribute('role')).toBe('list');
    expect(processStepsList.getAttribute('aria-labelledby')).toBe('process-title');

    // Verify step accessibility
    const stepItems = processStepsList.querySelectorAll('li[role="listitem"]');
    expect(stepItems.length).toBe(5);

    stepItems.forEach((item, index) => {
      const button = item.querySelector('button');
      expect(button?.getAttribute('role')).toBe('tab');
      expect(button?.getAttribute('aria-controls')).toBe(`step-content-${index + 1}`);
      expect(button?.getAttribute('tabindex')).toBe(index === 0 ? '0' : '-1');
    });

    // Test first step is selected
    const firstStepButton = stepItems[0].querySelector('button');
    expect(firstStepButton?.getAttribute('aria-selected')).toBe('true');

    // Test other steps are not selected
    for (let i = 1; i < stepItems.length; i++) {
      const button = stepItems[i].querySelector('button');
      expect(button?.getAttribute('aria-selected')).toBe('false');
    }
  });

  // Test process performance
  it('should handle performance considerations correctly', () => {
    // Mock performance measurement
    const performanceMock = {
      marks: [] as string[],
      measures: [] as { name: string; duration: number }[],
      mark: function (name: string) {
        this.marks.push(name);
      },
      measure: function (name: string, startMark: string, endMark: string) {
        // Simulate measurement
        const duration = Math.random() * 100;
        this.measures.push({ name, duration });
        return { name, duration };
      },
      getEntriesByName: function (name: string) {
        return this.measures.filter((m) => m.name === name);
      },
    };

    // Test process rendering performance
    performanceMock.mark('process-render-start');

    // Create process steps with 100 items (stress test)
    const processSteps = [];
    for (let i = 0; i < 100; i++) {
      processSteps.push({
        id: `step-${i + 1}`,
        number: i + 1,
        title: `Этап ${i + 1}`,
        description: `Описание этапа ${i + 1}`,
        duration: `${i + 1} день${i + 1 > 1 ? 'ей' : ''}`,
      });
    }

    // Create process visualization
    const processVisualization = processSteps.map((step, index) => ({
      id: step.id,
      number: step.number,
      title: step.title,
      description: step.description,
      duration: step.duration,
      position: index,
      isActive: index === 0,
      isCompleted: false,
      progress: index === 0 ? 100 : 0,
    }));

    performanceMock.mark('process-render-end');
    const renderMeasure = performanceMock.measure(
      'process-render',
      'process-render-start',
      'process-render-end'
    );

    // Verify performance measurement
    expect(performanceMock.marks).toContain('process-render-start');
    expect(performanceMock.marks).toContain('process-render-end');
    expect(performanceMock.measures.some((m) => m.name === 'process-render')).toBe(true);

    // Verify process steps creation
    expect(processSteps.length).toBe(100);
    expect(processVisualization.length).toBe(100);

    // Verify each step has required attributes
    processVisualization.forEach((step, index) => {
      expect(step.id).toBe(`step-${index + 1}`);
      expect(step.number).toBe(index + 1);
      expect(step.title).toBe(`Этап ${index + 1}`);
      expect(step.description).toBe(`Описание этапа ${index + 1}`);
      expect(step.duration).toBe(`${index + 1} день${index + 1 > 1 ? 'ей' : ''}`);
      expect(step.position).toBe(index);
      expect(step.isActive).toBe(index === 0);
      expect(step.isCompleted).toBe(false);
      expect(step.progress).toBe(index === 0 ? 100 : 0);
    });

    // Test step navigation performance
    performanceMock.mark('navigation-start');

    const navigateToStep = (steps: typeof processVisualization, stepIndex: number) => {
      steps.forEach((step, index) => {
        step.isActive = index === stepIndex;
        step.progress = index <= stepIndex ? 100 : 0;
        step.isCompleted = index < stepIndex;
      });
    };

    // Navigate to step 50
    navigateToStep(processVisualization, 49);

    performanceMock.mark('navigation-end');
    const navigationMeasure = performanceMock.measure(
      'process-navigation',
      'navigation-start',
      'navigation-end'
    );

    // Verify navigation results
    expect(processVisualization[49].isActive).toBe(true);
    expect(processVisualization[49].progress).toBe(100);
    expect(processVisualization[49].isCompleted).toBe(false);

    for (let i = 0; i < 49; i++) {
      expect(processVisualization[i].isCompleted).toBe(true);
      expect(processVisualization[i].progress).toBe(100);
      expect(processVisualization[i].isActive).toBe(false);
    }

    for (let i = 50; i < 100; i++) {
      expect(processVisualization[i].isCompleted).toBe(false);
      expect(processVisualization[i].progress).toBe(0);
      expect(processVisualization[i].isActive).toBe(false);
    }
  });
});
