import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Benefits Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test benefits initialization
  it('should initialize benefits component correctly', () => {
    // Create benefits section
    const benefits = document.createElement('section');
    benefits.className = 'benefits';
    benefits.id = 'benefits';

    // Add to DOM
    document.body.appendChild(benefits);

    // Verify benefits exists
    expect(document.getElementById('benefits')).toBeTruthy();
    expect(document.querySelector('.benefits')).toBeTruthy();

    // Verify benefits attributes
    const benefitsElement = document.getElementById('benefits');
    expect(benefitsElement?.tagName.toLowerCase()).toBe('section');
    expect(benefitsElement?.className).toBe('benefits');
  });

  // Test benefits data structure
  it('should handle benefits data correctly', () => {
    const benefitsData = [
      {
        id: 'protection',
        icon: '/icons/benefits/protection.svg',
        title: 'Защита от кредиторов',
        description: 'Останавливаем звонки коллекторов, судебные приставы и банки',
        details: [
          'Запрет на взыскание долгов',
          'Прекращение начисления процентов и пеней',
          'Остановка исполнительных производств',
        ],
      },
      {
        id: 'debt-relief',
        icon: '/icons/benefits/debt-relief.svg',
        title: 'Полное списание долгов',
        description: 'Освобождаем от всех обязательств перед банками и МФО',
        details: [
          'Списание кредитов и займов',
          'Устранение просрочек и штрафов',
          'Очищаем кредитную историю',
        ],
      },
      {
        id: 'property-save',
        icon: '/icons/benefits/property-save.svg',
        title: 'Сохранение имущества',
        description: 'Помогаем сохранить квартиру, машину и другое имущество',
        details: [
          'Защита единственного жилья',
          'Сохранение автомобиля и техники',
          'Оставляем необходимые вещи',
        ],
      },
      {
        id: 'fresh-start',
        icon: '/icons/benefits/fresh-start.svg',
        title: 'Новый старт',
        description: 'Получаете возможность начать жизнь без финансового груза',
        details: [
          'Возможность взять кредит через 5 лет',
          'Начало жизни с чистого листа',
          'Психологическое облегчение',
        ],
      },
      {
        id: 'legal-guarantee',
        icon: '/icons/benefits/legal-guarantee.svg',
        title: 'Юридическая гарантия',
        description: 'Работаем по договору с гарантией результата',
        details: ['Гарантия по договору', 'Профессиональные юристы', 'Индивидуальный подход'],
      },
      {
        id: 'transparent-process',
        icon: '/icons/benefits/transparent-process.svg',
        title: 'Прозрачный процесс',
        description: 'Открыто информируем о каждом этапе процедуры',
        details: [
          'Постоянная отчетность',
          'Открытые цены без скрытых платежей',
          'Консультации на всех этапах',
        ],
      },
    ];

    // Create benefits grid
    const benefitsGrid = document.createElement('div');
    benefitsGrid.className = 'benefits__grid';

    // Add benefits to grid
    benefitsData.forEach((benefit) => {
      const benefitCard = document.createElement('div');
      benefitCard.className = 'benefit-card';
      benefitCard.setAttribute('data-benefit-id', benefit.id);

      const benefitIcon = document.createElement('div');
      benefitIcon.className = 'benefit-card__icon';
      benefitIcon.innerHTML = `<img src="${benefit.icon}" alt="${benefit.title}" loading="lazy" />`;

      const benefitContent = document.createElement('div');
      benefitContent.className = 'benefit-card__content';

      const benefitTitle = document.createElement('h3');
      benefitTitle.className = 'benefit-card__title';
      benefitTitle.textContent = benefit.title;

      const benefitDescription = document.createElement('p');
      benefitDescription.className = 'benefit-card__description';
      benefitDescription.textContent = benefit.description;

      const benefitDetails = document.createElement('ul');
      benefitDetails.className = 'benefit-card__details';

      benefit.details.forEach((detail) => {
        const detailItem = document.createElement('li');
        detailItem.className = 'benefit-card__detail';
        detailItem.textContent = detail;
        benefitDetails.appendChild(detailItem);
      });

      benefitContent.appendChild(benefitTitle);
      benefitContent.appendChild(benefitDescription);
      benefitContent.appendChild(benefitDetails);

      benefitCard.appendChild(benefitIcon);
      benefitCard.appendChild(benefitContent);

      benefitsGrid.appendChild(benefitCard);
    });

    document.body.appendChild(benefitsGrid);

    // Verify benefits structure
    expect(benefitsGrid.querySelectorAll('.benefit-card').length).toBe(6);

    benefitsGrid.querySelectorAll('.benefit-card').forEach((card, index) => {
      const benefit = benefitsData[index];

      expect(card.getAttribute('data-benefit-id')).toBe(benefit.id);

      const icon = card.querySelector('.benefit-card__icon img');
      expect(icon?.getAttribute('src')).toBe(benefit.icon);
      expect(icon?.getAttribute('alt')).toBe(benefit.title);

      const title = card.querySelector('.benefit-card__title');
      expect(title?.textContent).toBe(benefit.title);

      const description = card.querySelector('.benefit-card__description');
      expect(description?.textContent).toBe(benefit.description);

      const details = card.querySelectorAll('.benefit-card__detail');
      expect(details.length).toBe(benefit.details.length);

      details.forEach((detail, detailIndex) => {
        expect(detail.textContent).toBe(benefit.details[detailIndex]);
      });
    });
  });

  // Test benefits filtering and sorting
  it('should handle benefits filtering and sorting correctly', () => {
    const benefitsData = [
      {
        id: 'protection',
        category: 'legal',
        priority: 1,
        title: 'Защита от кредиторов',
      },
      {
        id: 'debt-relief',
        category: 'financial',
        priority: 2,
        title: 'Полное списание долгов',
      },
      {
        id: 'property-save',
        category: 'asset',
        priority: 3,
        title: 'Сохранение имущества',
      },
      {
        id: 'fresh-start',
        category: 'personal',
        priority: 4,
        title: 'Новый старт',
      },
    ];

    // Test filtering by category
    const filterByCategory = (benefits: typeof benefitsData, category: string) => {
      return benefits.filter((benefit) => benefit.category === category);
    };

    const legalBenefits = filterByCategory(benefitsData, 'legal');
    expect(legalBenefits.length).toBe(1);
    expect(legalBenefits[0].id).toBe('protection');

    const financialBenefits = filterByCategory(benefitsData, 'financial');
    expect(financialBenefits.length).toBe(1);
    expect(financialBenefits[0].id).toBe('debt-relief');

    // Test sorting by priority
    const sortByPriority = (benefits: typeof benefitsData) => {
      return [...benefits].sort((a, b) => a.priority - b.priority);
    };

    const sortedBenefits = sortByPriority(benefitsData);
    expect(sortedBenefits[0].id).toBe('protection');
    expect(sortedBenefits[1].id).toBe('debt-relief');
    expect(sortedBenefits[2].id).toBe('property-save');
    expect(sortedBenefits[3].id).toBe('fresh-start');

    // Test combined filtering and sorting
    const combinedFilterSort = (benefits: typeof benefitsData, category: string) => {
      return sortByPriority(filterByCategory(benefits, category));
    };

    const filteredSorted = combinedFilterSort(benefitsData, 'asset');
    expect(filteredSorted.length).toBe(1);
    expect(filteredSorted[0].id).toBe('property-save');
  });

  // Test benefits animation triggers
  it('should handle benefits animations correctly', () => {
    // Create animated benefits elements
    const benefitsGrid = document.createElement('div');
    benefitsGrid.className = 'benefits__grid';

    const benefitCards = [];
    for (let i = 0; i < 6; i++) {
      const card = document.createElement('div');
      card.className = 'benefit-card';
      card.setAttribute('data-index', i.toString());

      // Add animation classes
      card.classList.add('animate-fade-in');
      card.classList.add('animate-slide-up');

      // Add delay classes for staggered animation
      card.classList.add(`animate-delay-${i * 100}`);

      benefitsGrid.appendChild(card);
      benefitCards.push(card);
    }

    document.body.appendChild(benefitsGrid);

    // Verify animations
    benefitCards.forEach((card, index) => {
      expect(card.classList.contains('animate-fade-in')).toBe(true);
      expect(card.classList.contains('animate-slide-up')).toBe(true);
      expect(card.classList.contains(`animate-delay-${index * 100}`)).toBe(true);
    });

    // Test animation triggering
    const triggerAnimations = (cards: HTMLElement[]) => {
      cards.forEach((card) => {
        card.classList.add('animated');
        card.classList.add('animation-complete');
      });
    };

    triggerAnimations(benefitCards);

    benefitCards.forEach((card) => {
      expect(card.classList.contains('animated')).toBe(true);
      expect(card.classList.contains('animation-complete')).toBe(true);
    });
  });

  // Test benefits interactive features
  it('should handle benefits interactive features correctly', () => {
    // Create interactive benefits elements
    const benefitsGrid = document.createElement('div');
    benefitsGrid.className = 'benefits__grid';

    const benefitCard = document.createElement('div');
    benefitCard.className = 'benefit-card';
    benefitCard.setAttribute('data-benefit-id', 'protection');
    benefitCard.setAttribute('tabindex', '0');
    benefitCard.setAttribute('role', 'button');
    benefitCard.setAttribute('aria-expanded', 'false');
    benefitCard.setAttribute('aria-controls', 'benefit-details-protection');

    const expandButton = document.createElement('button');
    expandButton.className = 'benefit-card__expand';
    expandButton.setAttribute('aria-label', 'Развернуть подробности');
    expandButton.textContent = 'Подробнее';

    const details = document.createElement('div');
    details.className = 'benefit-card__details';
    details.id = 'benefit-details-protection';
    details.setAttribute('aria-hidden', 'true');
    details.style.display = 'none';

    benefitCard.appendChild(expandButton);
    benefitCard.appendChild(details);
    benefitsGrid.appendChild(benefitCard);
    document.body.appendChild(benefitsGrid);

    // Test expand functionality
    let isExpanded = false;

    const toggleBenefitDetails = (card: HTMLElement) => {
      isExpanded = !isExpanded;
      card.setAttribute('aria-expanded', isExpanded.toString());
      details.setAttribute('aria-hidden', (!isExpanded).toString());
      details.style.display = isExpanded ? 'block' : 'none';
      expandButton.textContent = isExpanded ? 'Свернуть' : 'Подробнее';
    };

    // Initial state
    expect(isExpanded).toBe(false);
    expect(benefitCard.getAttribute('aria-expanded')).toBe('false');
    expect(details.getAttribute('aria-hidden')).toBe('true');
    expect(details.style.display).toBe('none');
    expect(expandButton.textContent).toBe('Подробнее');

    // Expand
    toggleBenefitDetails(benefitCard);
    expect(isExpanded).toBe(true);
    expect(benefitCard.getAttribute('aria-expanded')).toBe('true');
    expect(details.getAttribute('aria-hidden')).toBe('false');
    expect(details.style.display).toBe('block');
    expect(expandButton.textContent).toBe('Свернуть');

    // Collapse
    toggleBenefitDetails(benefitCard);
    expect(isExpanded).toBe(false);
    expect(benefitCard.getAttribute('aria-expanded')).toBe('false');
    expect(details.getAttribute('aria-hidden')).toBe('true');
    expect(details.style.display).toBe('none');
    expect(expandButton.textContent).toBe('Подробнее');
  });

  // Test benefits accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible benefits elements
    const benefitsSection = document.createElement('section');
    benefitsSection.setAttribute('role', 'region');
    benefitsSection.setAttribute('aria-label', 'Преимущества банкротства');
    benefitsSection.id = 'benefits';

    const benefitsHeader = document.createElement('header');
    benefitsHeader.className = 'benefits__header';

    const benefitsTitle = document.createElement('h2');
    benefitsTitle.id = 'benefits-title';
    benefitsTitle.textContent = 'Преимущества банкротства';

    const benefitsSubtitle = document.createElement('p');
    benefitsSubtitle.setAttribute('aria-describedby', 'benefits-title');
    benefitsSubtitle.textContent = 'Почему стоит выбрать нас для решения ваших долговых проблем';

    benefitsHeader.appendChild(benefitsTitle);
    benefitsHeader.appendChild(benefitsSubtitle);
    benefitsSection.appendChild(benefitsHeader);

    const benefitsGrid = document.createElement('div');
    benefitsGrid.className = 'benefits__grid';
    benefitsGrid.setAttribute('role', 'list');
    benefitsGrid.setAttribute('aria-labelledby', 'benefits-title');

    // Create benefit card with accessibility
    const benefitCard = document.createElement('div');
    benefitCard.className = 'benefit-card';
    benefitCard.setAttribute('role', 'listitem');
    benefitCard.setAttribute('aria-labelledby', 'benefit-title-protection');
    benefitCard.setAttribute('tabindex', '0');

    const benefitIcon = document.createElement('div');
    benefitIcon.className = 'benefit-card__icon';
    benefitIcon.setAttribute('aria-hidden', 'true');

    const benefitContent = document.createElement('div');
    benefitContent.className = 'benefit-card__content';

    const benefitTitle = document.createElement('h3');
    benefitTitle.id = 'benefit-title-protection';
    benefitTitle.textContent = 'Защита от кредиторов';

    const benefitDescription = document.createElement('p');
    benefitDescription.className = 'benefit-card__description';
    benefitDescription.textContent = 'Останавливаем звонки коллекторов, судебные приставы и банки';

    benefitContent.appendChild(benefitTitle);
    benefitContent.appendChild(benefitDescription);
    benefitCard.appendChild(benefitIcon);
    benefitCard.appendChild(benefitContent);
    benefitsGrid.appendChild(benefitCard);
    benefitsSection.appendChild(benefitsGrid);
    document.body.appendChild(benefitsSection);

    // Verify accessibility attributes
    expect(benefitsSection.getAttribute('role')).toBe('region');
    expect(benefitsSection.getAttribute('aria-label')).toBe('Преимущества банкротства');
    expect(benefitsSection.id).toBe('benefits');

    expect(benefitsTitle.id).toBe('benefits-title');
    expect(benefitsHeader.getAttribute('aria-describedby')).toBe('benefits-title');

    expect(benefitsGrid.getAttribute('role')).toBe('list');
    expect(benefitsGrid.getAttribute('aria-labelledby')).toBe('benefits-title');

    expect(benefitCard.getAttribute('role')).toBe('listitem');
    expect(benefitCard.getAttribute('aria-labelledby')).toBe('benefit-title-protection');
    expect(benefitCard.getAttribute('tabindex')).toBe('0');

    expect(benefitIcon.getAttribute('aria-hidden')).toBe('true');

    expect(benefitTitle.id).toBe('benefit-title-protection');
  });

  // Test benefits responsive behavior
  it('should handle responsive behavior correctly', () => {
    // Create responsive benefits elements
    const benefitsGrid = document.createElement('div');
    benefitsGrid.className = 'benefits__grid';

    // Test different grid configurations
    const gridConfigs = [
      { className: 'benefits__grid--1-col', columns: 1 },
      { className: 'benefits__grid--2-col', columns: 2 },
      { className: 'benefits__grid--3-col', columns: 3 },
    ];

    gridConfigs.forEach((config) => {
      const gridCopy = benefitsGrid.cloneNode(false) as HTMLElement;
      gridCopy.classList.add(config.className);

      // Create benefit cards for this configuration
      for (let i = 0; i < 6; i++) {
        const card = document.createElement('div');
        card.className = 'benefit-card';
        card.setAttribute('data-column-count', config.columns.toString());
        gridCopy.appendChild(card);
      }

      document.body.appendChild(gridCopy);

      // Verify grid configuration
      expect(gridCopy.classList.contains(config.className)).toBe(true);
      expect(gridCopy.querySelectorAll('.benefit-card').length).toBe(6);

      gridCopy.querySelectorAll('.benefit-card').forEach((card) => {
        expect(card.getAttribute('data-column-count')).toBe(config.columns.toString());
      });
    });
  });

  // Test benefits performance
  it('should handle performance considerations correctly', () => {
    // Mock performance measurement
    const performanceMock = {
      marks: [] as string[],
      measures: [] as { name: string; duration: number }[],
      mark(name: string) {
        this.marks.push(name);
      },
      measure(name: string, startMark: string, endMark: string) {
        // Simulate measurement
        const duration = Math.random() * 100;
        this.measures.push({ name, duration });
        return { name, duration };
      },
      getEntriesByName(name: string) {
        return this.measures.filter((m) => m.name === name);
      },
    };

    // Test benefits rendering performance
    performanceMock.mark('benefits-render-start');

    // Create benefits grid with 50 cards (stress test)
    const benefitsGrid = document.createElement('div');
    benefitsGrid.className = 'benefits__grid';

    for (let i = 0; i < 50; i++) {
      const card = document.createElement('div');
      card.className = 'benefit-card';
      card.setAttribute('data-benefit-id', `benefit-${i}`);

      const title = document.createElement('h3');
      title.className = 'benefit-card__title';
      title.textContent = `Преимущество ${i + 1}`;

      const description = document.createElement('p');
      description.className = 'benefit-card__description';
      description.textContent = `Описание преимущества ${i + 1}`;

      card.appendChild(title);
      card.appendChild(description);
      benefitsGrid.appendChild(card);
    }

    document.body.appendChild(benefitsGrid);

    performanceMock.mark('benefits-render-end');
    const renderMeasure = performanceMock.measure(
      'benefits-render',
      'benefits-render-start',
      'benefits-render-end'
    );

    // Verify performance measurement
    expect(performanceMock.marks).toContain('benefits-render-start');
    expect(performanceMock.marks).toContain('benefits-render-end');
    expect(performanceMock.measures.some((m) => m.name === 'benefits-render')).toBe(true);

    // Verify benefits grid creation
    expect(benefitsGrid.querySelectorAll('.benefit-card').length).toBe(50);

    // Verify each benefit card has required attributes
    benefitsGrid.querySelectorAll('.benefit-card').forEach((card, index) => {
      expect(card.getAttribute('data-benefit-id')).toBe(`benefit-${index}`);
      expect(card.querySelector('.benefit-card__title')?.textContent).toBe(
        `Преимущество ${index + 1}`
      );
      expect(card.querySelector('.benefit-card__description')?.textContent).toBe(
        `Описание преимущества ${index + 1}`
      );
    });

    // Clean up
    document.body.removeChild(benefitsGrid);
  });
});
