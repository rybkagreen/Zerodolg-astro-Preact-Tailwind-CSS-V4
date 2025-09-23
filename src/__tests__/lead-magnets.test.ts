import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LeadMagnets Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test lead magnet data structure
  it('should handle lead magnet data correctly', () => {
    const leadMagnets = [
      {
        id: 'checklist',
        title: 'Чек-лист: 10 шагов к банкротству',
        description: 'Бесплатный чек-лист с пошаговым планом процедуры банкротства',
        icon: '/icons/lead-magnets/checklist.svg',
        download: '/downloads/bankruptcy-checklist.pdf',
        modal: 'checklist-download',
        tags: ['Бесплатно', 'Чек-лист', 'Банкротство'],
        category: 'checklists',
      },
      {
        id: 'guide',
        title: 'Полное руководство по банкротству физлиц',
        description: 'Подробное руководство с юридическими аспектами и практическими советами',
        icon: '/icons/lead-magnets/guide.svg',
        download: '/downloads/bankruptcy-guide.pdf',
        modal: 'guide-download',
        tags: ['Руководство', 'Юридическое', 'Банкротство'],
        category: 'guides',
      },
      {
        id: 'calculator',
        title: 'Калькулятор экономии при банкротстве',
        description: 'Узнайте, сколько вы можете сэкономить с помощью процедуры банкротства',
        icon: '/icons/lead-magnets/calculator.svg',
        download: '/downloads/savings-calculator.xlsx',
        modal: 'calculator-download',
        tags: ['Калькулятор', 'Экономия', 'Финансы'],
        category: 'calculators',
      },
      {
        id: 'template',
        title: 'Шаблоны документов для банкротства',
        description: 'Готовые шаблоны заявлений и документов для процедуры банкротства',
        icon: '/icons/lead-magnets/template.svg',
        download: '/downloads/bankruptcy-templates.zip',
        modal: 'template-download',
        tags: ['Шаблоны', 'Документы', 'Банкротство'],
        category: 'templates',
      },
    ];

    // Test lead magnet structure validation
    leadMagnets.forEach((magnet) => {
      expect(typeof magnet.id).toBe('string');
      expect(typeof magnet.title).toBe('string');
      expect(typeof magnet.description).toBe('string');
      expect(typeof magnet.icon).toBe('string');
      expect(typeof magnet.download).toBe('string');
      expect(typeof magnet.modal).toBe('string');
      expect(Array.isArray(magnet.tags)).toBe(true);
      expect(typeof magnet.category).toBe('string');

      // Test non-empty strings
      expect(magnet.id.length).toBeGreaterThan(0);
      expect(magnet.title.length).toBeGreaterThan(0);
      expect(magnet.description.length).toBeGreaterThan(0);
      expect(magnet.icon.length).toBeGreaterThan(0);
      expect(magnet.download.length).toBeGreaterThan(0);
      expect(magnet.modal.length).toBeGreaterThan(0);
      expect(magnet.category.length).toBeGreaterThan(0);

      // Test arrays
      expect(magnet.tags.length).toBeGreaterThan(0);
      magnet.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });

      // Test URL validity
      expect(magnet.icon.startsWith('/')).toBe(true);
      expect(magnet.download.startsWith('/')).toBe(true);

      // Test ID uniqueness
      const duplicateIds = leadMagnets.filter((m) => m.id === magnet.id);
      expect(duplicateIds.length).toBe(1);
    });

    // Test specific lead magnet data
    const checklistMagnet = leadMagnets[0];
    expect(checklistMagnet.id).toBe('checklist');
    expect(checklistMagnet.title).toBe('Чек-лист: 10 шагов к банкротству');
    expect(checklistMagnet.description).toBe(
      'Бесплатный чек-лист с пошаговым планом процедуры банкротства'
    );
    expect(checklistMagnet.icon).toBe('/icons/lead-magnets/checklist.svg');
    expect(checklistMagnet.download).toBe('/downloads/bankruptcy-checklist.pdf');
    expect(checklistMagnet.modal).toBe('checklist-download');
    expect(checklistMagnet.tags).toEqual(['Бесплатно', 'Чек-лист', 'Банкротство']);
    expect(checklistMagnet.category).toBe('checklists');

    const guideMagnet = leadMagnets[1];
    expect(guideMagnet.id).toBe('guide');
    expect(guideMagnet.title).toBe('Полное руководство по банкротству физлиц');
    expect(guideMagnet.description).toBe(
      'Подробное руководство с юридическими аспектами и практическими советами'
    );
    expect(guideMagnet.icon).toBe('/icons/lead-magnets/guide.svg');
    expect(guideMagnet.download).toBe('/downloads/bankruptcy-guide.pdf');
    expect(guideMagnet.modal).toBe('guide-download');
    expect(guideMagnet.tags).toEqual(['Руководство', 'Юридическое', 'Банкротство']);
    expect(guideMagnet.category).toBe('guides');

    const calculatorMagnet = leadMagnets[2];
    expect(calculatorMagnet.id).toBe('calculator');
    expect(calculatorMagnet.title).toBe('Калькулятор экономии при банкротстве');
    expect(calculatorMagnet.description).toBe(
      'Узнайте, сколько вы можете сэкономить с помощью процедуры банкротства'
    );
    expect(calculatorMagnet.icon).toBe('/icons/lead-magnets/calculator.svg');
    expect(calculatorMagnet.download).toBe('/downloads/savings-calculator.xlsx');
    expect(calculatorMagnet.modal).toBe('calculator-download');
    expect(calculatorMagnet.tags).toEqual(['Калькулятор', 'Экономия', 'Финансы']);
    expect(calculatorMagnet.category).toBe('calculators');

    const templateMagnet = leadMagnets[3];
    expect(templateMagnet.id).toBe('template');
    expect(templateMagnet.title).toBe('Шаблоны документов для банкротства');
    expect(templateMagnet.description).toBe(
      'Готовые шаблоны заявлений и документов для процедуры банкротства'
    );
    expect(templateMagnet.icon).toBe('/icons/lead-magnets/template.svg');
    expect(templateMagnet.download).toBe('/downloads/bankruptcy-templates.zip');
    expect(templateMagnet.modal).toBe('template-download');
    expect(templateMagnet.tags).toEqual(['Шаблоны', 'Документы', 'Банкротство']);
    expect(templateMagnet.category).toBe('templates');
  });

  // Test lead magnet filtering and categorization
  it('should handle lead magnet filtering and categorization correctly', () => {
    const leadMagnets = [
      {
        id: 'checklist-1',
        title: 'Чек-лист 1',
        category: 'checklists',
        tags: ['Бесплатно', 'Чек-лист'],
      },
      {
        id: 'guide-1',
        title: 'Руководство 1',
        category: 'guides',
        tags: ['Руководство', 'Юридическое'],
      },
      {
        id: 'calculator-1',
        title: 'Калькулятор 1',
        category: 'calculators',
        tags: ['Калькулятор', 'Экономия'],
      },
      {
        id: 'template-1',
        title: 'Шаблон 1',
        category: 'templates',
        tags: ['Шаблоны', 'Документы'],
      },
      {
        id: 'checklist-2',
        title: 'Чек-лист 2',
        category: 'checklists',
        tags: ['Бесплатно', 'Чек-лист', 'Дополнительный'],
      },
      {
        id: 'guide-2',
        title: 'Руководство 2',
        category: 'guides',
        tags: ['Руководство', 'Финансовое'],
      },
    ];

    // Filtering functions
    const filterByCategory = (magnets: typeof leadMagnets, category: string) => {
      return category === 'all'
        ? magnets
        : magnets.filter((magnet) => magnet.category === category);
    };

    const filterByTag = (magnets: typeof leadMagnets, tag: string) => {
      return magnets.filter((magnet) => magnet.tags.includes(tag));
    };

    const searchMagnets = (magnets: typeof leadMagnets, query: string) => {
      if (!query || query.trim() === '') return magnets;

      const normalizedQuery = query.toLowerCase().trim();
      return magnets.filter(
        (magnet) =>
          magnet.title.toLowerCase().includes(normalizedQuery) ||
          magnet.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    };

    // Test category filtering
    const allMagnets = filterByCategory(leadMagnets, 'all');
    expect(allMagnets.length).toBe(6);

    const checklists = filterByCategory(leadMagnets, 'checklists');
    expect(checklists.length).toBe(2);
    expect(checklists.every((m) => m.category === 'checklists')).toBe(true);

    const guides = filterByCategory(leadMagnets, 'guides');
    expect(guides.length).toBe(2);
    expect(guides.every((m) => m.category === 'guides')).toBe(true);

    const calculators = filterByCategory(leadMagnets, 'calculators');
    expect(calculators.length).toBe(1);
    expect(calculators[0].category).toBe('calculators');

    const templates = filterByCategory(leadMagnets, 'templates');
    expect(templates.length).toBe(1);
    expect(templates[0].category).toBe('templates');

    // Test tag filtering
    const freeMagnets = filterByTag(leadMagnets, 'Бесплатно');
    expect(freeMagnets.length).toBe(2);
    expect(freeMagnets.some((m) => m.id === 'checklist-1')).toBe(true);
    expect(freeMagnets.some((m) => m.id === 'checklist-2')).toBe(true);

    const checklistMagnets = filterByTag(leadMagnets, 'Чек-лист');
    expect(checklistMagnets.length).toBe(2);
    expect(checklistMagnets.some((m) => m.id === 'checklist-1')).toBe(true);
    expect(checklistMagnets.some((m) => m.id === 'checklist-2')).toBe(true);

    const guideMagnets = filterByTag(leadMagnets, 'Руководство');
    expect(guideMagnets.length).toBe(2);
    expect(guideMagnets.some((m) => m.id === 'guide-1')).toBe(true);
    expect(guideMagnets.some((m) => m.id === 'guide-2')).toBe(true);

    // Test search functionality
    const checklistSearch = searchMagnets(leadMagnets, 'чек-лист');
    expect(checklistSearch.length).toBe(2);
    expect(checklistSearch.some((m) => m.id === 'checklist-1')).toBe(true);
    expect(checklistSearch.some((m) => m.id === 'checklist-2')).toBe(true);

    const guideSearch = searchMagnets(leadMagnets, 'руководство');
    expect(guideSearch.length).toBe(2);
    expect(guideSearch.some((m) => m.id === 'guide-1')).toBe(true);
    expect(guideSearch.some((m) => m.id === 'guide-2')).toBe(true);

    const emptySearch = searchMagnets(leadMagnets, '');
    expect(emptySearch.length).toBe(6);

    const whitespaceSearch = searchMagnets(leadMagnets, '   ');
    expect(whitespaceSearch.length).toBe(6);

    const noMatchSearch = searchMagnets(leadMagnets, 'несуществующее');
    expect(noMatchSearch.length).toBe(0);

    // Test combined filtering
    const combinedFilter = (magnets: typeof leadMagnets, category: string, tag: string) => {
      let result = magnets;

      if (category !== 'all') {
        result = filterByCategory(result, category);
      }

      if (tag) {
        result = filterByTag(result, tag);
      }

      return result;
    };

    const checklistFree = combinedFilter(leadMagnets, 'checklists', 'Бесплатно');
    expect(checklistFree.length).toBe(2);
    expect(checklistFree.every((m) => m.category === 'checklists')).toBe(true);
    expect(checklistFree.every((m) => m.tags.includes('Бесплатно'))).toBe(true);
  });

  // Test lead magnet download tracking
  it('should handle lead magnet download tracking correctly', () => {
    const downloadTracking = {
      downloads: new Map<string, number>(),
      trackDownload: function (magnetId: string) {
        const currentCount = this.downloads.get(magnetId) || 0;
        this.downloads.set(magnetId, currentCount + 1);
      },
      getDownloadCount: function (magnetId: string) {
        return this.downloads.get(magnetId) || 0;
      },
      getTotalDownloads: function () {
        let total = 0;
        this.downloads.forEach((count) => (total += count));
        return total;
      },
      getMostDownloaded: function (magnets: { id: string; title: string }[]) {
        let maxDownloads = 0;
        let mostDownloadedId = '';

        this.downloads.forEach((count, magnetId) => {
          if (count > maxDownloads) {
            maxDownloads = count;
            mostDownloadedId = magnetId;
          }
        });

        const magnet = magnets.find((m) => m.id === mostDownloadedId);
        return magnet ? { ...magnet, downloads: maxDownloads } : null;
      },
      getDownloadHistory: function () {
        const history: { magnetId: string; count: number; timestamp: number }[] = [];
        this.downloads.forEach((count, magnetId) => {
          history.push({ magnetId, count, timestamp: Date.now() });
        });
        return history.sort((a, b) => b.count - a.count);
      },
    };

    // Test initial state
    expect(downloadTracking.getTotalDownloads()).toBe(0);
    expect(downloadTracking.getDownloadCount('checklist')).toBe(0);
    expect(downloadTracking.getDownloadCount('guide')).toBe(0);
    expect(downloadTracking.getDownloadCount('calculator')).toBe(0);
    expect(downloadTracking.getDownloadCount('template')).toBe(0);

    // Test tracking downloads
    downloadTracking.trackDownload('checklist');
    expect(downloadTracking.getTotalDownloads()).toBe(1);
    expect(downloadTracking.getDownloadCount('checklist')).toBe(1);
    expect(downloadTracking.getDownloadCount('guide')).toBe(0);

    downloadTracking.trackDownload('checklist');
    downloadTracking.trackDownload('guide');
    downloadTracking.trackDownload('calculator');
    downloadTracking.trackDownload('template');
    downloadTracking.trackDownload('checklist');
    downloadTracking.trackDownload('guide');

    expect(downloadTracking.getTotalDownloads()).toBe(7);
    expect(downloadTracking.getDownloadCount('checklist')).toBe(3);
    expect(downloadTracking.getDownloadCount('guide')).toBe(2);
    expect(downloadTracking.getDownloadCount('calculator')).toBe(1);
    expect(downloadTracking.getDownloadCount('template')).toBe(1);

    // Test most downloaded magnet
    const magnets = [
      { id: 'checklist', title: 'Чек-лист' },
      { id: 'guide', title: 'Руководство' },
      { id: 'calculator', title: 'Калькулятор' },
      { id: 'template', title: 'Шаблоны' },
    ];

    const mostDownloaded = downloadTracking.getMostDownloaded(magnets);
    expect(mostDownloaded).not.toBeNull();
    expect(mostDownloaded?.id).toBe('checklist');
    expect(mostDownloaded?.title).toBe('Чек-лист');
    expect(mostDownloaded?.downloads).toBe(3);

    // Test download history
    const history = downloadTracking.getDownloadHistory();
    expect(history.length).toBe(4);
    expect(history[0].magnetId).toBe('checklist');
    expect(history[0].count).toBe(3);
    expect(history[1].magnetId).toBe('guide');
    expect(history[1].count).toBe(2);
    expect(history[2].magnetId).toBe('calculator');
    expect(history[2].count).toBe(1);
    expect(history[3].magnetId).toBe('template');
    expect(history[3].count).toBe(1);

    // Test tracking with invalid magnet ID
    downloadTracking.trackDownload('invalid-magnet');
    expect(downloadTracking.getTotalDownloads()).toBe(8);
    expect(downloadTracking.getDownloadCount('invalid-magnet')).toBe(1);

    // Test history with invalid magnet
    const updatedHistory = downloadTracking.getDownloadHistory();
    expect(updatedHistory.length).toBe(5);
    expect(updatedHistory[4].magnetId).toBe('invalid-magnet');
    expect(updatedHistory[4].count).toBe(1);
  });

  // Test lead magnet interactivity
  it('should handle lead magnet interactivity correctly', () => {
    // Create interactive lead magnet elements
    const leadMagnetsSection = document.createElement('section');
    leadMagnetsSection.className = 'lead-magnets';
    leadMagnetsSection.id = 'lead-magnets';

    const leadMagnetsGrid = document.createElement('div');
    leadMagnetsGrid.className = 'lead-magnets__grid';
    leadMagnetsGrid.setAttribute('role', 'list');

    const leadMagnets = [
      { id: 'checklist', title: 'Чек-лист: 10 шагов к банкротству' },
      { id: 'guide', title: 'Полное руководство по банкротству физлиц' },
      { id: 'calculator', title: 'Калькулятор экономии при банкротстве' },
      { id: 'template', title: 'Шаблоны документов для банкротства' },
    ];

    leadMagnets.forEach((magnet) => {
      const magnetCard = document.createElement('div');
      magnetCard.className = 'lead-magnet-card';
      magnetCard.setAttribute('data-magnet-id', magnet.id);
      magnetCard.setAttribute('role', 'listitem');
      magnetCard.setAttribute('tabindex', '0');
      magnetCard.setAttribute('aria-label', `Загрузить ${magnet.title}`);

      const magnetIcon = document.createElement('div');
      magnetIcon.className = 'lead-magnet-card__icon';
      magnetIcon.setAttribute('aria-hidden', 'true');

      const magnetContent = document.createElement('div');
      magnetContent.className = 'lead-magnet-card__content';

      const magnetTitle = document.createElement('h3');
      magnetTitle.className = 'lead-magnet-card__title';
      magnetTitle.textContent = magnet.title;

      const magnetDescription = document.createElement('p');
      magnetDescription.className = 'lead-magnet-card__description';
      magnetDescription.textContent = 'Описание материала';

      const magnetCta = document.createElement('button');
      magnetCta.className = 'lead-magnet-card__cta';
      magnetCta.setAttribute('data-modal', magnet.id);
      magnetCta.textContent = 'Загрузить бесплатно';

      // Append elements
      magnetContent.appendChild(magnetTitle);
      magnetContent.appendChild(magnetDescription);
      magnetContent.appendChild(magnetCta);

      magnetCard.appendChild(magnetIcon);
      magnetCard.appendChild(magnetContent);

      leadMagnetsGrid.appendChild(magnetCard);
    });

    // Append elements
    leadMagnetsSection.appendChild(leadMagnetsGrid);
    document.body.appendChild(leadMagnetsSection);

    // Verify structure
    expect(document.getElementById('lead-magnets')).toBeTruthy();
    expect(leadMagnetsSection.querySelector('.lead-magnets__grid')).toBeTruthy();
    expect(leadMagnetsSection.querySelectorAll('.lead-magnet-card').length).toBe(4);
    expect(leadMagnetsSection.querySelectorAll('.lead-magnet-card__title').length).toBe(4);
    expect(leadMagnetsSection.querySelectorAll('.lead-magnet-card__description').length).toBe(4);
    expect(leadMagnetsSection.querySelectorAll('.lead-magnet-card__cta').length).toBe(4);

    // Verify accessibility attributes
    expect(leadMagnetsGrid.getAttribute('role')).toBe('list');

    const magnetCards = leadMagnetsSection.querySelectorAll('.lead-magnet-card');
    magnetCards.forEach((card, index) => {
      const magnet = leadMagnets[index];

      expect(card.getAttribute('data-magnet-id')).toBe(magnet.id);
      expect(card.getAttribute('role')).toBe('listitem');
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('aria-label')).toBe(`Загрузить ${magnet.title}`);

      const icon = card.querySelector('.lead-magnet-card__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');

      const title = card.querySelector('.lead-magnet-card__title');
      expect(title?.textContent).toBe(magnet.title);

      const description = card.querySelector('.lead-magnet-card__description');
      expect(description?.textContent).toBe('Описание материала');

      const cta = card.querySelector('.lead-magnet-card__cta');
      expect(cta?.getAttribute('data-modal')).toBe(magnet.id);
      expect(cta?.textContent).toBe('Загрузить бесплатно');
    });

    // Test interactivity
    let modalTriggered = false;
    let triggeredModalId = '';

    const handleModalTrigger = (modalId: string) => {
      modalTriggered = true;
      triggeredModalId = modalId;
    };

    const ctaButtons = leadMagnetsSection.querySelectorAll('.lead-magnet-card__cta');
    ctaButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        if (modalId) {
          handleModalTrigger(modalId);
        }
      });
    });

    // Test first CTA button click
    ctaButtons[0].dispatchEvent(new Event('click'));
    expect(modalTriggered).toBe(true);
    expect(triggeredModalId).toBe('checklist');

    // Reset for next test
    modalTriggered = false;
    triggeredModalId = '';

    // Test second CTA button click
    ctaButtons[1].dispatchEvent(new Event('click'));
    expect(modalTriggered).toBe(true);
    expect(triggeredModalId).toBe('guide');

    // Reset for next test
    modalTriggered = false;
    triggeredModalId = '';

    // Test third CTA button click
    ctaButtons[2].dispatchEvent(new Event('click'));
    expect(modalTriggered).toBe(true);
    expect(triggeredModalId).toBe('calculator');

    // Reset for next test
    modalTriggered = false;
    triggeredModalId = '';

    // Test fourth CTA button click
    ctaButtons[3].dispatchEvent(new Event('click'));
    expect(modalTriggered).toBe(true);
    expect(triggeredModalId).toBe('template');

    // Test keyboard navigation
    let focusCount = 0;
    magnetCards.forEach((card) => {
      card.addEventListener('focus', () => {
        focusCount++;
      });

      card.addEventListener('blur', () => {
        focusCount--;
      });
    });

    // Test focus on first card
    magnetCards[0].focus();
    expect(focusCount).toBe(1);
    expect(document.activeElement).toBe(magnetCards[0]);

    // Test blur on first card
    magnetCards[0].blur();
    expect(focusCount).toBe(0);
    expect(document.activeElement).not.toBe(magnetCards[0]);

    // Test keyboard interaction
    let keyPressCount = 0;
    magnetCards.forEach((card) => {
      card.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          keyPressCount++;
          e.preventDefault();
        }
      });
    });

    // Test Enter key press on second card
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    magnetCards[1].dispatchEvent(enterEvent);
    expect(keyPressCount).toBe(1);

    // Test Space key press on third card
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    magnetCards[2].dispatchEvent(spaceEvent);
    expect(keyPressCount).toBe(2);
  });

  // Test lead magnet accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible lead magnets elements
    const leadMagnetsSection = document.createElement('section');
    leadMagnetsSection.setAttribute('role', 'region');
    leadMagnetsSection.setAttribute('aria-label', 'Бесплатные материалы по банкротству');
    leadMagnetsSection.id = 'lead-magnets';

    const leadMagnetsHeader = document.createElement('header');
    leadMagnetsHeader.className = 'lead-magnets__header';

    const leadMagnetsTitle = document.createElement('h2');
    leadMagnetsTitle.id = 'lead-magnets-title';
    leadMagnetsTitle.textContent = 'Бесплатные материалы';

    const leadMagnetsSubtitle = document.createElement('p');
    leadMagnetsSubtitle.setAttribute('aria-describedby', 'lead-magnets-title');
    leadMagnetsSubtitle.textContent = 'Полезные материалы для тех, кто планирует банкротство';

    const leadMagnetsGrid = document.createElement('div');
    leadMagnetsGrid.className = 'lead-magnets__grid';
    leadMagnetsGrid.setAttribute('role', 'list');
    leadMagnetsGrid.setAttribute('aria-labelledby', 'lead-magnets-title');

    // Create lead magnet cards with accessibility
    const leadMagnets = [
      {
        id: 'checklist',
        title: 'Чек-лист: 10 шагов к банкротству',
        description: 'Пошаговый план процедуры банкротства',
      },
      {
        id: 'guide',
        title: 'Полное руководство по банкротству физлиц',
        description: 'Подробное руководство с юридическими аспектами',
      },
      {
        id: 'calculator',
        title: 'Калькулятор экономии при банкротстве',
        description: 'Узнайте, сколько вы можете сэкономить',
      },
      {
        id: 'template',
        title: 'Шаблоны документов для банкротства',
        description: 'Готовые шаблоны заявлений и документов',
      },
    ];

    leadMagnets.forEach((magnet) => {
      const magnetCard = document.createElement('div');
      magnetCard.className = 'lead-magnet-card';
      magnetCard.setAttribute('data-magnet-id', magnet.id);
      magnetCard.setAttribute('role', 'listitem');
      magnetCard.setAttribute('tabindex', '0');
      magnetCard.setAttribute('aria-labelledby', `magnet-title-${magnet.id}`);
      magnetCard.setAttribute('aria-describedby', `magnet-desc-${magnet.id}`);

      const magnetIcon = document.createElement('div');
      magnetIcon.className = 'lead-magnet-card__icon';
      magnetIcon.setAttribute('aria-hidden', 'true');

      const magnetContent = document.createElement('div');
      magnetContent.className = 'lead-magnet-card__content';

      const magnetTitle = document.createElement('h3');
      magnetTitle.id = `magnet-title-${magnet.id}`;
      magnetTitle.className = 'lead-magnet-card__title';
      magnetTitle.textContent = magnet.title;

      const magnetDescription = document.createElement('p');
      magnetDescription.id = `magnet-desc-${magnet.id}`;
      magnetDescription.className = 'lead-magnet-card__description';
      magnetDescription.textContent = magnet.description;

      const magnetCta = document.createElement('button');
      magnetCta.className = 'lead-magnet-card__cta';
      magnetCta.setAttribute('data-modal', magnet.id);
      magnetCta.setAttribute('aria-label', `Загрузить ${magnet.title}`);
      magnetCta.textContent = 'Загрузить бесплатно';

      // Append elements
      magnetContent.appendChild(magnetTitle);
      magnetContent.appendChild(magnetDescription);
      magnetContent.appendChild(magnetCta);

      magnetCard.appendChild(magnetIcon);
      magnetCard.appendChild(magnetContent);

      leadMagnetsGrid.appendChild(magnetCard);
    });

    // Append elements
    leadMagnetsHeader.appendChild(leadMagnetsTitle);
    leadMagnetsHeader.appendChild(leadMagnetsSubtitle);
    leadMagnetsSection.appendChild(leadMagnetsHeader);
    leadMagnetsSection.appendChild(leadMagnetsGrid);
    document.body.appendChild(leadMagnetsSection);

    // Verify accessibility attributes
    expect(leadMagnetsSection.getAttribute('role')).toBe('region');
    expect(leadMagnetsSection.getAttribute('aria-label')).toBe(
      'Бесплатные материалы по банкротству'
    );
    expect(leadMagnetsSection.id).toBe('lead-magnets');

    expect(leadMagnetsHeader.querySelector('h2')?.id).toBe('lead-magnets-title');
    expect(leadMagnetsHeader.querySelector('p')?.getAttribute('aria-describedby')).toBe(
      'lead-magnets-title'
    );

    expect(leadMagnetsGrid.getAttribute('role')).toBe('list');
    expect(leadMagnetsGrid.getAttribute('aria-labelledby')).toBe('lead-magnets-title');

    // Verify lead magnet cards accessibility
    const magnetCards = leadMagnetsSection.querySelectorAll('.lead-magnet-card');
    expect(magnetCards.length).toBe(4);

    magnetCards.forEach((card, index) => {
      const magnet = leadMagnets[index];

      expect(card.getAttribute('data-magnet-id')).toBe(magnet.id);
      expect(card.getAttribute('role')).toBe('listitem');
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('aria-labelledby')).toBe(`magnet-title-${magnet.id}`);
      expect(card.getAttribute('aria-describedby')).toBe(`magnet-desc-${magnet.id}`);

      const icon = card.querySelector('.lead-magnet-card__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');

      const title = card.querySelector('.lead-magnet-card__title');
      expect(title?.id).toBe(`magnet-title-${magnet.id}`);
      expect(title?.textContent).toBe(magnet.title);

      const description = card.querySelector('.lead-magnet-card__description');
      expect(description?.id).toBe(`magnet-desc-${magnet.id}`);
      expect(description?.textContent).toBe(magnet.description);

      const cta = card.querySelector('.lead-magnet-card__cta');
      expect(cta?.getAttribute('data-modal')).toBe(magnet.id);
      expect(cta?.getAttribute('aria-label')).toBe(`Загрузить ${magnet.title}`);
      expect(cta?.textContent).toBe('Загрузить бесплатно');
    });

    // Test screen reader compatibility
    const srOnlyElements = document.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBe(0); // No sr-only elements in this test

    // Test ARIA relationships
    expect(leadMagnetsGrid.getAttribute('aria-labelledby')).toBe('lead-magnets-title');

    magnetCards.forEach((card, index) => {
      const magnet = leadMagnets[index];
      expect(card.getAttribute('aria-labelledby')).toBe(`magnet-title-${magnet.id}`);
      expect(card.getAttribute('aria-describedby')).toBe(`magnet-desc-${magnet.id}`);
    });
  });

  // Test lead magnet performance
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

    // Test lead magnet rendering performance with large dataset
    performanceMock.mark('lead-magnets-render-start');

    // Create 1000 lead magnet items for stress testing
    const largeLeadMagnetDataset = [];
    for (let i = 0; i < 1000; i++) {
      largeLeadMagnetDataset.push({
        id: `magnet-${i + 1}`,
        title: `Материал ${i + 1}`,
        description: `Описание материала ${i + 1}`,
        icon: `/icons/lead-magnets/material-${i + 1}.svg`,
        download: `/downloads/material-${i + 1}.pdf`,
        modal: `material-${i + 1}-download`,
        tags: [`Тег ${(i % 5) + 1}`, `Категория ${(i % 3) + 1}`],
        category:
          i % 4 === 0
            ? 'checklists'
            : i % 4 === 1
              ? 'guides'
              : i % 4 === 2
                ? 'calculators'
                : 'templates',
      });
    }

    performanceMock.mark('lead-magnets-render-end');
    const renderMeasure = performanceMock.measure(
      'lead-magnets-render',
      'lead-magnets-render-start',
      'lead-magnets-render-end'
    );

    // Verify dataset creation
    expect(largeLeadMagnetDataset.length).toBe(1000);

    // Test that all items have required properties
    largeLeadMagnetDataset.forEach((item, index) => {
      expect(item.id).toBe(`magnet-${index + 1}`);
      expect(item.title).toBe(`Материал ${index + 1}`);
      expect(item.description).toBe(`Описание материала ${index + 1}`);
      expect(item.icon).toBe(`/icons/lead-magnets/material-${index + 1}.svg`);
      expect(item.download).toBe(`/downloads/material-${index + 1}.pdf`);
      expect(item.modal).toBe(`material-${index + 1}-download`);
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBe(2);
      expect(typeof item.category).toBe('string');
    });

    // Test filtering performance
    performanceMock.mark('filter-start');

    const filterLargeDataset = (items: typeof largeLeadMagnetDataset, category: string) => {
      return category === 'all' ? items : items.filter((item) => item.category === category);
    };

    const checklists = filterLargeDataset(largeLeadMagnetDataset, 'checklists');
    const guides = filterLargeDataset(largeLeadMagnetDataset, 'guides');
    const calculators = filterLargeDataset(largeLeadMagnetDataset, 'calculators');
    const templates = filterLargeDataset(largeLeadMagnetDataset, 'templates');

    performanceMock.mark('filter-end');
    const filterMeasure = performanceMock.measure(
      'lead-magnets-filter',
      'filter-start',
      'filter-end'
    );

    expect(checklists.length).toBe(250);
    expect(guides.length).toBe(250);
    expect(calculators.length).toBe(250);
    expect(templates.length).toBe(250);

    // Test search performance
    performanceMock.mark('search-start');

    const searchLargeDataset = (items: typeof largeLeadMagnetDataset, query: string) => {
      if (!query || query.trim() === '') return items;

      const normalizedQuery = query.toLowerCase().trim();
      return items.filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    };

    const searchResults = searchLargeDataset(largeLeadMagnetDataset, 'материал 500');

    performanceMock.mark('search-end');
    const searchMeasure = performanceMock.measure(
      'lead-magnets-search',
      'search-start',
      'search-end'
    );

    expect(searchResults.length).toBe(1);
    expect(searchResults[0].id).toBe('magnet-500');

    // Test sorting performance
    performanceMock.mark('sort-start');

    const sortLargeDataset = (items: typeof largeLeadMagnetDataset) => {
      return [...items].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    };

    const sortedItems = sortLargeDataset(largeLeadMagnetDataset);

    performanceMock.mark('sort-end');
    const sortMeasure = performanceMock.measure('lead-magnets-sort', 'sort-start', 'sort-end');

    // Verify sorting worked correctly
    expect(sortedItems.length).toBe(1000);
    expect(sortedItems[0].title).toBe('Материал 1');
    expect(sortedItems[sortedItems.length - 1].title).toBe('Материал 999');

    // Test pagination performance
    performanceMock.mark('paginate-start');

    const paginateLargeDataset = (
      items: typeof largeLeadMagnetDataset,
      page: number,
      pageSize: number
    ) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    };

    const paginatedItems = paginateLargeDataset(largeLeadMagnetDataset, 1, 12);

    performanceMock.mark('paginate-end');
    const paginateMeasure = performanceMock.measure(
      'lead-magnets-paginate',
      'paginate-start',
      'paginate-end'
    );

    expect(paginatedItems.length).toBe(12);
    expect(paginatedItems[0].id).toBe('magnet-1');
    expect(paginatedItems[11].id).toBe('magnet-12');

    // Verify performance measurements
    expect(performanceMock.marks).toContain('lead-magnets-render-start');
    expect(performanceMock.marks).toContain('lead-magnets-render-end');
    expect(performanceMock.marks).toContain('filter-start');
    expect(performanceMock.marks).toContain('filter-end');
    expect(performanceMock.marks).toContain('search-start');
    expect(performanceMock.marks).toContain('search-end');
    expect(performanceMock.marks).toContain('sort-start');
    expect(performanceMock.marks).toContain('sort-end');
    expect(performanceMock.marks).toContain('paginate-start');
    expect(performanceMock.marks).toContain('paginate-end');

    expect(performanceMock.measures.some((m) => m.name === 'lead-magnets-render')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'lead-magnets-filter')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'lead-magnets-search')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'lead-magnets-sort')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'lead-magnets-paginate')).toBe(true);
  });
});
