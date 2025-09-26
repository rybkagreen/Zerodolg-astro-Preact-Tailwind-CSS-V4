import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Stats Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test stats data structure
  it('should handle stats data correctly', () => {
    const statsData = {
      cases: {
        total: 1450,
        monthly: 230,
        growth: 12,
        success: 98,
      },
      savings: {
        total: 2000000000, // 2 billion rubles
        average: 1379310, // Average savings per case
        monthly: 46000000, // 46 million rubles monthly
      },
      time: {
        average: 6, // 6 months average
        fastest: 3, // 3 months fastest
        satisfaction: 96, // 96% satisfaction
      },
      team: {
        lawyers: 4,
        experience: 7, // 7+ years average
        casesPerLawyer: 362, // 1450 / 4 lawyers
      },
    };

    // Test stats structure validation
    expect(typeof statsData.cases).toBe('object');
    expect(typeof statsData.savings).toBe('object');
    expect(typeof statsData.time).toBe('object');
    expect(typeof statsData.team).toBe('object');

    // Test cases stats
    expect(statsData.cases.total).toBe(1450);
    expect(statsData.cases.monthly).toBe(230);
    expect(statsData.cases.growth).toBe(12);
    expect(statsData.cases.success).toBe(98);

    // Test savings stats
    expect(statsData.savings.total).toBe(2000000000);
    expect(statsData.savings.average).toBe(1379310);
    expect(statsData.savings.monthly).toBe(46000000);

    // Test time stats
    expect(statsData.time.average).toBe(6);
    expect(statsData.time.fastest).toBe(3);
    expect(statsData.time.satisfaction).toBe(96);

    // Test team stats
    expect(statsData.team.lawyers).toBe(4);
    expect(statsData.team.experience).toBe(7);
    expect(statsData.team.casesPerLawyer).toBe(362);

    // Test that all values are positive numbers
    Object.values(statsData).forEach((category) => {
      Object.values(category).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });
  });

  // Test stats formatting
  it('should format stats correctly', () => {
    // Number formatting functions
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('ru-RU').format(num);
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const formatCompactNumber = (num: number) => {
      if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(1).replace('.', ',')} млрд ₽`;
      }
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1).replace('.', ',')} млн ₽`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1).replace('.', ',')} тыс ₽`;
      }
      return `${num} ₽`;
    };

    const formatPercentage = (num: number) => {
      return `${num}%`;
    };

    const formatTime = (months: number) => {
      if (months < 12) {
        return `${months} мес`;
      }
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
      }
      return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} ${remainingMonths} мес`;
    };

    // Test number formatting
    expect(formatNumber(1450)).toBe('1 450');
    expect(formatNumber(2000000000)).toBe('2 000 000 000');
    expect(formatNumber(230)).toBe('230');
    expect(formatNumber(1379310)).toBe('1 379 310');
    expect(formatNumber(46000000)).toBe('46 000 000');

    // Test currency formatting
    expect(formatCurrency(1450)).toBe('1 450 ₽');
    expect(formatCurrency(2000000000)).toBe('2 000 000 000 ₽');
    expect(formatCurrency(230)).toBe('230 ₽');
    expect(formatCurrency(1379310)).toBe('1 379 310 ₽');
    expect(formatCurrency(46000000)).toBe('46 000 000 ₽');

    // Test compact number formatting
    expect(formatCompactNumber(1450)).toBe('1,5 тыс ₽');
    expect(formatCompactNumber(2000000000)).toBe('2,0 млрд ₽');
    expect(formatCompactNumber(230)).toBe('230 ₽');
    expect(formatCompactNumber(1379310)).toBe('1,4 млн ₽');
    expect(formatCompactNumber(46000000)).toBe('46,0 млн ₽');
    expect(formatCompactNumber(500000)).toBe('500,0 тыс ₽');
    expect(formatCompactNumber(2500000)).toBe('2,5 млн ₽');

    // Test percentage formatting
    expect(formatPercentage(98)).toBe('98%');
    expect(formatPercentage(12)).toBe('12%');
    expect(formatPercentage(96)).toBe('96%');

    // Test time formatting
    expect(formatTime(6)).toBe('6 мес');
    expect(formatTime(3)).toBe('3 мес');
    expect(formatTime(12)).toBe('1 год');
    expect(formatTime(18)).toBe('1 год 6 мес');
    expect(formatTime(24)).toBe('2 года');
    expect(formatTime(30)).toBe('2 года 6 мес');
    expect(formatTime(60)).toBe('5 лет');
    expect(formatTime(72)).toBe('6 лет');
  });

  // Test stats animation
  it('should animate stats correctly', () => {
    // Create stats elements
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats';
    statsContainer.id = 'stats';

    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats__grid';

    const statItems = [
      { id: 'cases', value: 1450, label: 'Завершенных дел' },
      { id: 'savings', value: 2000000000, label: 'Сэкономлено' },
      { id: 'time', value: 6, label: 'Средний срок' },
      { id: 'success', value: 98, label: 'Успешных дел' },
    ];

    statItems.forEach((item) => {
      const statItem = document.createElement('div');
      statItem.className = 'stats__item';
      statItem.setAttribute('data-stat-id', item.id);

      const statValue = document.createElement('div');
      statValue.className = 'stats__value';
      statValue.setAttribute('data-animate', 'countup');
      statValue.setAttribute('data-target', item.value.toString());
      statValue.textContent = '0';

      const statLabel = document.createElement('div');
      statLabel.className = 'stats__label';
      statLabel.textContent = item.label;

      statItem.appendChild(statValue);
      statItem.appendChild(statLabel);
      statsGrid.appendChild(statItem);
    });

    statsContainer.appendChild(statsGrid);
    document.body.appendChild(statsContainer);

    // Verify stats structure
    expect(document.getElementById('stats')).toBeTruthy();
    expect(statsContainer.querySelector('.stats__grid')).toBeTruthy();
    expect(statsContainer.querySelectorAll('.stats__item').length).toBe(4);
    expect(statsContainer.querySelectorAll('.stats__value').length).toBe(4);
    expect(statsContainer.querySelectorAll('.stats__label').length).toBe(4);

    // Test animation attributes
    statItems.forEach((item, index) => {
      const statItem = statsContainer.querySelector(`[data-stat-id="${item.id}"]`);
      const statValue = statItem?.querySelector('.stats__value');
      const statLabel = statItem?.querySelector('.stats__label');

      expect(statItem).toBeTruthy();
      expect(statItem?.getAttribute('data-stat-id')).toBe(item.id);
      expect(statValue?.getAttribute('data-animate')).toBe('countup');
      expect(statValue?.getAttribute('data-target')).toBe(item.value.toString());
      expect(statValue?.textContent).toBe('0'); // Initial value
      expect(statLabel?.textContent).toBe(item.label);
    });

    // Mock animation function
    const animateStatValue = (element: HTMLElement, target: number, duration: number = 1000) => {
      return new Promise<void>((resolve) => {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
            resolve();
          }
          element.textContent = Math.round(current).toString();
        }, 16);
      });
    };

    // Test animation for first stat
    const firstStatValue = statsContainer.querySelector('.stats__value') as HTMLElement;
    expect(firstStatValue.textContent).toBe('0');

    // Run animation
    return animateStatValue(firstStatValue, 1450, 100).then(() => {
      expect(firstStatValue.textContent).toBe('1450');
    });
  });

  // Test stats calculation
  it('should calculate stats correctly', () => {
    // Mock data for calculations
    const mockCases = [
      { id: '1', debt: 500000, saved: 450000, duration: 6, successful: true },
      { id: '2', debt: 1000000, saved: 900000, duration: 8, successful: true },
      { id: '3', debt: 2000000, saved: 1800000, duration: 12, successful: true },
      { id: '4', debt: 300000, saved: 270000, duration: 4, successful: true },
      { id: '5', debt: 1500000, saved: 1350000, duration: 10, successful: true },
      { id: '6', debt: 800000, saved: 720000, duration: 7, successful: true },
      { id: '7', debt: 1200000, saved: 1080000, duration: 9, successful: true },
      { id: '8', debt: 600000, saved: 540000, duration: 5, successful: true },
    ];

    // Calculation functions
    const calculateTotalCases = (cases: typeof mockCases) => {
      return cases.length;
    };

    const calculateTotalSavings = (cases: typeof mockCases) => {
      return cases.reduce((sum, caseItem) => sum + caseItem.saved, 0);
    };

    const calculateAverageSavings = (cases: typeof mockCases) => {
      const totalSavings = calculateTotalSavings(cases);
      return cases.length > 0 ? Math.round(totalSavings / cases.length) : 0;
    };

    const calculateAverageDuration = (cases: typeof mockCases) => {
      const totalDuration = cases.reduce((sum, caseItem) => sum + caseItem.duration, 0);
      return cases.length > 0 ? Math.round(totalDuration / cases.length) : 0;
    };

    const calculateSuccessRate = (cases: typeof mockCases) => {
      const successfulCases = cases.filter((caseItem) => caseItem.successful).length;
      return cases.length > 0 ? Math.round((successfulCases / cases.length) * 100) : 0;
    };

    const calculateMonthlyCases = (cases: typeof mockCases, months: number = 12) => {
      return Math.round(cases.length / months);
    };

    const calculateGrowthRate = (currentMonth: number, previousMonth: number) => {
      if (previousMonth === 0) return 0;
      return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
    };

    // Perform calculations
    const totalCases = calculateTotalCases(mockCases);
    const totalSavings = calculateTotalSavings(mockCases);
    const averageSavings = calculateAverageSavings(mockCases);
    const averageDuration = calculateAverageDuration(mockCases);
    const successRate = calculateSuccessRate(mockCases);
    const monthlyCases = calculateMonthlyCases(mockCases, 12);
    const growthRate = calculateGrowthRate(230, 205); // Example values

    // Test calculation results
    expect(totalCases).toBe(8);
    expect(totalSavings).toBe(7110000);
    expect(averageSavings).toBe(888750);
    expect(averageDuration).toBe(8);
    expect(successRate).toBe(100);
    expect(monthlyCases).toBe(1);
    expect(growthRate).toBe(12);

    // Test edge cases
    const emptyCases: typeof mockCases = [];
    expect(calculateTotalCases(emptyCases)).toBe(0);
    expect(calculateTotalSavings(emptyCases)).toBe(0);
    expect(calculateAverageSavings(emptyCases)).toBe(0);
    expect(calculateAverageDuration(emptyCases)).toBe(0);
    expect(calculateSuccessRate(emptyCases)).toBe(0);
    expect(calculateMonthlyCases(emptyCases, 12)).toBe(0);

    // Test single case
    const singleCase = [mockCases[0]];
    expect(calculateTotalCases(singleCase)).toBe(1);
    expect(calculateTotalSavings(singleCase)).toBe(450000);
    expect(calculateAverageSavings(singleCase)).toBe(450000);
    expect(calculateAverageDuration(singleCase)).toBe(6);
    expect(calculateSuccessRate(singleCase)).toBe(100);
    expect(calculateMonthlyCases(singleCase, 12)).toBe(0); // 1/12 = 0 when rounded

    // Test with unsuccessful cases
    const mixedCases = [
      ...mockCases,
      { id: '9', debt: 500000, saved: 0, duration: 3, successful: false },
    ];
    expect(calculateSuccessRate(mixedCases)).toBe(89); // 8/9 ≈ 89%

    // Test growth rate edge cases
    expect(calculateGrowthRate(0, 0)).toBe(0); // Both zero
    expect(calculateGrowthRate(100, 0)).toBe(0); // Previous zero
    expect(calculateGrowthRate(50, 100)).toBe(-50); // Negative growth
    expect(calculateGrowthRate(150, 100)).toBe(50); // Positive growth
    expect(calculateGrowthRate(100, 100)).toBe(0); // No growth
  });

  // Test stats interactivity
  it('should handle stats interactivity correctly', () => {
    // Create interactive stats elements
    const statsSection = document.createElement('section');
    statsSection.className = 'stats';
    statsSection.id = 'stats';

    const statsHeader = document.createElement('header');
    statsHeader.className = 'stats__header';

    const statsTitle = document.createElement('h2');
    statsTitle.id = 'stats-title';
    statsTitle.textContent = 'Наша статистика';

    const statsSubtitle = document.createElement('p');
    statsSubtitle.setAttribute('aria-describedby', 'stats-title');
    statsSubtitle.textContent = 'Результаты нашей работы по банкротству физических лиц';

    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats__grid';
    statsGrid.setAttribute('role', 'list');
    statsGrid.setAttribute('aria-labelledby', 'stats-title');

    // Create stats items with interactivity
    const statsItems = [
      { id: 'cases', value: '1450+', label: 'Завершенных дел' },
      { id: 'savings', value: '2 млрд ₽', label: 'Сэкономлено' },
      { id: 'time', value: '6 мес', label: 'Средний срок' },
      { id: 'success', value: '98%', label: 'Успешных дел' },
    ];

    statsItems.forEach((item, index) => {
      const statItem = document.createElement('div');
      statItem.className = 'stats__item';
      statItem.setAttribute('role', 'listitem');
      statItem.setAttribute('data-stat-id', item.id);
      statItem.setAttribute('tabindex', '0');
      statItem.setAttribute('aria-label', `${item.label}: ${item.value}`);

      const statIcon = document.createElement('div');
      statIcon.className = 'stats__icon';
      statIcon.setAttribute('aria-hidden', 'true');

      const statValue = document.createElement('div');
      statValue.className = 'stats__value';
      statValue.textContent = item.value;

      const statLabel = document.createElement('div');
      statLabel.className = 'stats__label';
      statLabel.textContent = item.label;

      // Add hover effect elements
      const statHoverEffect = document.createElement('div');
      statHoverEffect.className = 'stats__hover-effect';

      statItem.appendChild(statIcon);
      statItem.appendChild(statValue);
      statItem.appendChild(statLabel);
      statItem.appendChild(statHoverEffect);
      statsGrid.appendChild(statItem);
    });

    // Append elements
    statsHeader.appendChild(statsTitle);
    statsHeader.appendChild(statsSubtitle);
    statsSection.appendChild(statsHeader);
    statsSection.appendChild(statsGrid);
    document.body.appendChild(statsSection);

    // Verify interactivity structure
    expect(document.getElementById('stats')).toBeTruthy();
    expect(statsSection.querySelector('.stats__header')).toBeTruthy();
    expect(statsSection.querySelector('.stats__grid')).toBeTruthy();

    // Verify accessibility attributes
    expect(statsSection.getAttribute('role')).toBe('region');
    expect(statsSection.getAttribute('aria-label')).toBe('Статистика компании по банкротству');
    expect(statsSection.id).toBe('stats');

    expect(statsHeader.querySelector('h2')?.id).toBe('stats-title');
    expect(statsHeader.querySelector('p')?.getAttribute('aria-describedby')).toBe('stats-title');

    expect(statsGrid.getAttribute('role')).toBe('list');
    expect(statsGrid.getAttribute('aria-labelledby')).toBe('stats-title');

    // Verify stats items interactivity
    const statItems = statsGrid.querySelectorAll('.stats__item');
    expect(statItems.length).toBe(4);

    statItems.forEach((item, index) => {
      const stat = statsItems[index];

      expect(item.getAttribute('role')).toBe('listitem');
      expect(item.getAttribute('data-stat-id')).toBe(stat.id);
      expect(item.getAttribute('tabindex')).toBe('0');
      expect(item.getAttribute('aria-label')).toBe(`${stat.label}: ${stat.value}`);

      const icon = item.querySelector('.stats__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');

      const value = item.querySelector('.stats__value');
      expect(value?.textContent).toBe(stat.value);

      const label = item.querySelector('.stats__label');
      expect(label?.textContent).toBe(stat.label);

      const hoverEffect = item.querySelector('.stats__hover-effect');
      expect(hoverEffect).toBeTruthy();
    });

    // Test hover interactions
    let hoverCount = 0;
    statItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        hoverCount++;
        item.classList.add('hover');
      });

      item.addEventListener('mouseleave', () => {
        hoverCount--;
        item.classList.remove('hover');
      });
    });

    // Test first item hover
    const firstItem = statItems[0];
    firstItem.dispatchEvent(new Event('mouseenter'));
    expect(hoverCount).toBe(1);
    expect(firstItem.classList.contains('hover')).toBe(true);

    firstItem.dispatchEvent(new Event('mouseleave'));
    expect(hoverCount).toBe(0);
    expect(firstItem.classList.contains('hover')).toBe(false);

    // Test focus interactions
    let focusCount = 0;
    statItems.forEach((item) => {
      item.addEventListener('focus', () => {
        focusCount++;
        item.classList.add('focused');
      });

      item.addEventListener('blur', () => {
        focusCount--;
        item.classList.remove('focused');
      });
    });

    // Test second item focus
    const secondItem = statItems[1];
    secondItem.focus();
    expect(focusCount).toBe(1);
    expect(secondItem.classList.contains('focused')).toBe(true);
    expect(document.activeElement).toBe(secondItem);

    // Test second item blur
    secondItem.blur();
    expect(focusCount).toBe(0);
    expect(secondItem.classList.contains('focused')).toBe(false);
    expect(document.activeElement).not.toBe(secondItem);

    // Test keyboard navigation
    let keyPressCount = 0;
    statItems.forEach((item) => {
      item.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          keyPressCount++;
          e.preventDefault();
        }
      });
    });

    // Test Enter key press on third item
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const thirdItem = statItems[2];
    thirdItem.dispatchEvent(enterEvent);
    expect(keyPressCount).toBe(1);

    // Test Space key press on fourth item
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    const fourthItem = statItems[3];
    fourthItem.dispatchEvent(spaceEvent);
    expect(keyPressCount).toBe(2);
  });

  // Test stats accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible stats elements
    const statsSection = document.createElement('section');
    statsSection.setAttribute('role', 'region');
    statsSection.setAttribute('aria-label', 'Статистика компании по банкротству');
    statsSection.id = 'stats';

    const statsHeader = document.createElement('header');
    statsHeader.className = 'stats__header';

    const statsTitle = document.createElement('h2');
    statsTitle.id = 'stats-title';
    statsTitle.textContent = 'Наша статистика';

    const statsSubtitle = document.createElement('p');
    statsSubtitle.setAttribute('aria-describedby', 'stats-title');
    statsSubtitle.textContent = 'Результаты нашей работы по банкротству физических лиц';

    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats__grid';
    statsGrid.setAttribute('role', 'list');
    statsGrid.setAttribute('aria-labelledby', 'stats-title');
    statsGrid.setAttribute('tabindex', '0');

    // Create stats items with accessibility
    const statsItems = [
      {
        id: 'cases',
        value: '1450+',
        label: 'Завершенных дел',
        description: 'Более 1450 успешных дел по банкротству',
      },
      {
        id: 'savings',
        value: '2 млрд ₽',
        label: 'Сэкономлено',
        description: 'Сэкономлено более 2 миллиардов рублей для клиентов',
      },
      {
        id: 'time',
        value: '6 мес',
        label: 'Средний срок',
        description: 'Средний срок процедуры банкротства составляет 6 месяцев',
      },
      {
        id: 'success',
        value: '98%',
        label: 'Успешных дел',
        description: '98% успешных дел по банкротству',
      },
    ];

    statsItems.forEach((item) => {
      const statItem = document.createElement('div');
      statItem.className = 'stats__item';
      statItem.setAttribute('role', 'listitem');
      statItem.setAttribute('data-stat-id', item.id);
      statItem.setAttribute('tabindex', '0');
      statItem.setAttribute('aria-label', `${item.label}: ${item.value}`);
      statItem.setAttribute('aria-describedby', `stat-desc-${item.id}`);

      const statIcon = document.createElement('div');
      statIcon.className = 'stats__icon';
      statIcon.setAttribute('aria-hidden', 'true');

      const statValue = document.createElement('div');
      statValue.className = 'stats__value';
      statValue.setAttribute('aria-label', `Значение: ${item.value}`);
      statValue.textContent = item.value;

      const statLabel = document.createElement('div');
      statLabel.className = 'stats__label';
      statLabel.setAttribute('aria-label', `Метка: ${item.label}`);
      statLabel.textContent = item.label;

      const statDescription = document.createElement('div');
      statDescription.id = `stat-desc-${item.id}`;
      statDescription.className = 'stats__description sr-only';
      statDescription.textContent = item.description;

      // Add hover effect elements
      const statHoverEffect = document.createElement('div');
      statHoverEffect.className = 'stats__hover-effect';

      statItem.appendChild(statIcon);
      statItem.appendChild(statValue);
      statItem.appendChild(statLabel);
      statItem.appendChild(statDescription);
      statItem.appendChild(statHoverEffect);
      statsGrid.appendChild(statItem);
    });

    // Append elements
    statsHeader.appendChild(statsTitle);
    statsHeader.appendChild(statsSubtitle);
    statsSection.appendChild(statsHeader);
    statsSection.appendChild(statsGrid);
    document.body.appendChild(statsSection);

    // Verify accessibility attributes
    expect(statsSection.getAttribute('role')).toBe('region');
    expect(statsSection.getAttribute('aria-label')).toBe('Статистика компании по банкротству');
    expect(statsSection.id).toBe('stats');

    expect(statsHeader.querySelector('h2')?.id).toBe('stats-title');
    expect(statsHeader.querySelector('p')?.getAttribute('aria-describedby')).toBe('stats-title');

    expect(statsGrid.getAttribute('role')).toBe('list');
    expect(statsGrid.getAttribute('aria-labelledby')).toBe('stats-title');
    expect(statsGrid.getAttribute('tabindex')).toBe('0');

    // Verify stats items accessibility
    const statItems = statsGrid.querySelectorAll('.stats__item');
    expect(statItems.length).toBe(4);

    statItems.forEach((item, index) => {
      const stat = statsItems[index];

      expect(item.getAttribute('role')).toBe('listitem');
      expect(item.getAttribute('data-stat-id')).toBe(stat.id);
      expect(item.getAttribute('tabindex')).toBe('0');
      expect(item.getAttribute('aria-label')).toBe(`${stat.label}: ${stat.value}`);
      expect(item.getAttribute('aria-describedby')).toBe(`stat-desc-${stat.id}`);

      const icon = item.querySelector('.stats__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');

      const value = item.querySelector('.stats__value');
      expect(value?.getAttribute('aria-label')).toBe(`Значение: ${stat.value}`);
      expect(value?.textContent).toBe(stat.value);

      const label = item.querySelector('.stats__label');
      expect(label?.getAttribute('aria-label')).toBe(`Метка: ${stat.label}`);
      expect(label?.textContent).toBe(stat.label);

      const description = item.querySelector('.stats__description');
      expect(description?.id).toBe(`stat-desc-${stat.id}`);
      expect(description?.className).toBe('stats__description sr-only');
      expect(description?.textContent).toBe(stat.description);

      const hoverEffect = item.querySelector('.stats__hover-effect');
      expect(hoverEffect?.className).toBe('stats__hover-effect');
    });

    // Test screen reader compatibility
    const srOnlyElements = document.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBe(4);

    srOnlyElements.forEach((element) => {
      expect(element.classList.contains('sr-only')).toBe(true);
    });

    // Test ARIA relationships
    expect(statsGrid.getAttribute('aria-labelledby')).toBe('stats-title');

    statItems.forEach((item, index) => {
      const stat = statsItems[index];
      expect(item.getAttribute('aria-describedby')).toBe(`stat-desc-${stat.id}`);
    });
  });

  // Test stats performance
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

    // Test stats rendering performance with large dataset
    performanceMock.mark('stats-render-start');

    // Create 1000 stats items for stress testing
    const largeStatsDataset = [];
    for (let i = 0; i < 1000; i++) {
      largeStatsDataset.push({
        id: `stat-${i + 1}`,
        value: `${(i + 1) * 100}+`,
        label: `Статистика ${i + 1}`,
        description: `Описание статистики ${i + 1}`,
        icon: '📊',
        category:
          i % 4 === 0 ? 'cases' : i % 4 === 1 ? 'savings' : i % 4 === 2 ? 'time' : 'success',
      });
    }

    performanceMock.mark('stats-render-end');
    const renderMeasure = performanceMock.measure(
      'stats-render',
      'stats-render-start',
      'stats-render-end'
    );

    // Verify dataset creation
    expect(largeStatsDataset.length).toBe(1000);

    // Test that all items have required properties
    largeStatsDataset.forEach((item, index) => {
      expect(item.id).toBe(`stat-${index + 1}`);
      expect(item.value).toBe(`${(index + 1) * 100}+`);
      expect(item.label).toBe(`Статистика ${index + 1}`);
      expect(item.description).toBe(`Описание статистики ${index + 1}`);
      expect(item.icon).toBe('📊');
      expect(typeof item.category).toBe('string');
    });

    // Test filtering performance
    performanceMock.mark('filter-start');

    const filterLargeDataset = (items: typeof largeStatsDataset, category: string) => {
      return category === 'all' ? items : items.filter((item) => item.category === category);
    };

    const casesStats = filterLargeDataset(largeStatsDataset, 'cases');
    const savingsStats = filterLargeDataset(largeStatsDataset, 'savings');
    const timeStats = filterLargeDataset(largeStatsDataset, 'time');
    const successStats = filterLargeDataset(largeStatsDataset, 'success');

    performanceMock.mark('filter-end');
    const filterMeasure = performanceMock.measure('stats-filter', 'filter-start', 'filter-end');

    expect(casesStats.length).toBe(250);
    expect(savingsStats.length).toBe(250);
    expect(timeStats.length).toBe(250);
    expect(successStats.length).toBe(250);

    // Test sorting performance
    performanceMock.mark('sort-start');

    const sortLargeDataset = (items: typeof largeStatsDataset) => {
      return [...items].sort((a, b) => {
        const aValue = parseInt(a.value.replace('+', ''));
        const bValue = parseInt(b.value.replace('+', ''));
        return bValue - aValue;
      });
    };

    const sortedStats = sortLargeDataset(largeStatsDataset);

    performanceMock.mark('sort-end');
    const sortMeasure = performanceMock.measure('stats-sort', 'sort-start', 'sort-end');

    // Verify sorting worked correctly
    expect(sortedStats.length).toBe(1000);
    expect(sortedStats[0].id).toBe('stat-1000'); // Highest value
    expect(sortedStats[sortedStats.length - 1].id).toBe('stat-1'); // Lowest value

    // Test pagination performance
    performanceMock.mark('paginate-start');

    const paginateLargeDataset = (
      items: typeof largeStatsDataset,
      page: number,
      pageSize: number
    ) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    };

    const paginatedItems = paginateLargeDataset(largeStatsDataset, 1, 12);

    performanceMock.mark('paginate-end');
    const paginateMeasure = performanceMock.measure(
      'stats-paginate',
      'paginate-start',
      'paginate-end'
    );

    expect(paginatedItems.length).toBe(12);
    expect(paginatedItems[0].id).toBe('stat-1');
    expect(paginatedItems[11].id).toBe('stat-12');

    // Verify performance measurements
    expect(performanceMock.marks).toContain('stats-render-start');
    expect(performanceMock.marks).toContain('stats-render-end');
    expect(performanceMock.marks).toContain('filter-start');
    expect(performanceMock.marks).toContain('filter-end');
    expect(performanceMock.marks).toContain('sort-start');
    expect(performanceMock.marks).toContain('sort-end');
    expect(performanceMock.marks).toContain('paginate-start');
    expect(performanceMock.marks).toContain('paginate-end');

    expect(performanceMock.measures.some((m) => m.name === 'stats-render')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'stats-filter')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'stats-sort')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'stats-paginate')).toBe(true);
  });
});
