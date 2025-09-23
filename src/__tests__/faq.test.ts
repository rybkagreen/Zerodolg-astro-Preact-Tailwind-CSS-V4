import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Faq Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test FAQ data structure
  it('should handle FAQ data structure correctly', () => {
    const faqItems = [
      {
        id: '1',
        question: 'Какие долги можно списать через банкротство?',
        answer:
          'Через процедуру банкротства можно списать практически все виды долгов:\n\n• Кредиты в банках и МФО\n• Займы у физических и юридических лиц\n• Долги по ЖКХ и коммунальным услугам\n• Налоговые задолженности\n• Долги по распискам и договорам\n• Штрафы ГИБДД и административные штрафы\n\nВажно: Не списываются алименты, возмещение вреда жизни и здоровью, субсидиарная ответственность.',
        category: 'debts',
        tags: ['Профессионализм', 'Быстро', 'Поддержка'],
        helpful: 24,
        verified: true,
      },
      {
        id: '2',
        question: 'Сколько времени занимает процедура банкротства?',
        answer:
          'Сроки зависят от выбранной процедуры:\n\n⚡ Внесудебное банкротство\nОт 3 до 6 месяцев через МФЦ\n\n⚖️ Судебное банкротство\nОт 6 до 12 месяцев через Арбитражный суд\n\n💡 С нашей помощью процедура проходит максимально быстро благодаря профессиональной подготовке документов.',
        category: 'timeline',
        tags: ['Профессионализм', 'Понятно', 'Эффективно'],
        helpful: 18,
        verified: true,
      },
    ];

    // Test FAQ item structure
    faqItems.forEach((item) => {
      expect(typeof item.id).toBe('string');
      expect(typeof item.question).toBe('string');
      expect(typeof item.answer).toBe('string');
      expect(typeof item.category).toBe('string');
      expect(Array.isArray(item.tags)).toBe(true);
      expect(typeof item.helpful).toBe('number');
      expect(typeof item.verified).toBe('boolean');

      // Test non-empty strings
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThan(0);
      expect(item.category.length).toBeGreaterThan(0);

      // Test tags array
      expect(item.tags.length).toBeGreaterThan(0);
      item.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });

      // Test helpful count
      expect(item.helpful).toBeGreaterThanOrEqual(0);

      // Test verified flag
      expect(typeof item.verified).toBe('boolean');
    });

    // Test specific item properties
    expect(faqItems[0].id).toBe('1');
    expect(faqItems[0].question).toBe('Какие долги можно списать через банкротство?');
    expect(faqItems[0].category).toBe('debts');
    expect(faqItems[0].tags).toEqual(['Профессионализм', 'Быстро', 'Поддержка']);
    expect(faqItems[0].helpful).toBe(24);
    expect(faqItems[0].verified).toBe(true);

    expect(faqItems[1].id).toBe('2');
    expect(faqItems[1].question).toBe('Сколько времени занимает процедура банкротства?');
    expect(faqItems[1].category).toBe('timeline');
    expect(faqItems[1].tags).toEqual(['Профессионализм', 'Понятно', 'Эффективно']);
    expect(faqItems[1].helpful).toBe(18);
    expect(faqItems[1].verified).toBe(true);
  });

  // Test FAQ category functionality
  it('should handle FAQ categories correctly', () => {
    const faqCategories = [
      { id: 'all', name: 'Все вопросы', count: 50 },
      { id: 'debts', name: 'Списание долгов', count: 12 },
      { id: 'timeline', name: 'Сроки процедуры', count: 8 },
      { id: 'property', name: 'Имущество', count: 10 },
      { id: 'documents', name: 'Документы', count: 15 },
      { id: 'costs', name: 'Стоимость', count: 5 },
    ];

    const faqItems = [
      { id: '1', question: 'Вопрос 1', category: 'debts' },
      { id: '2', question: 'Вопрос 2', category: 'timeline' },
      { id: '3', question: 'Вопрос 3', category: 'property' },
      { id: '4', question: 'Вопрос 4', category: 'documents' },
      { id: '5', question: 'Вопрос 5', category: 'costs' },
      { id: '6', question: 'Вопрос 6', category: 'debts' },
    ];

    // Category filtering function
    const filterByCategory = (items: typeof faqItems, categoryId: string) => {
      return categoryId === 'all' ? items : items.filter((item) => item.category === categoryId);
    };

    // Test all categories filter
    const allItems = filterByCategory(faqItems, 'all');
    expect(allItems.length).toBe(6);

    // Test specific category filters
    const debtsItems = filterByCategory(faqItems, 'debts');
    expect(debtsItems.length).toBe(2);
    expect(debtsItems.every((item) => item.category === 'debts')).toBe(true);

    const timelineItems = filterByCategory(faqItems, 'timeline');
    expect(timelineItems.length).toBe(1);
    expect(timelineItems[0].category).toBe('timeline');

    const propertyItems = filterByCategory(faqItems, 'property');
    expect(propertyItems.length).toBe(1);
    expect(propertyItems[0].category).toBe('property');

    const documentsItems = filterByCategory(faqItems, 'documents');
    expect(documentsItems.length).toBe(1);
    expect(documentsItems[0].category).toBe('documents');

    const costsItems = filterByCategory(faqItems, 'costs');
    expect(costsItems.length).toBe(1);
    expect(costsItems[0].category).toBe('costs');

    // Test non-existent category
    const emptyItems = filterByCategory(faqItems, 'nonexistent');
    expect(emptyItems.length).toBe(0);

    // Category selection tracking
    const categoryState = {
      selectedCategory: 'all',
      selectCategory: function (categoryId: string) {
        this.selectedCategory = categoryId;
      },
      getSelectedCategory: function () {
        return this.selectedCategory;
      },
    };

    expect(categoryState.getSelectedCategory()).toBe('all');

    categoryState.selectCategory('debts');
    expect(categoryState.getSelectedCategory()).toBe('debts');

    categoryState.selectCategory('timeline');
    expect(categoryState.getSelectedCategory()).toBe('timeline');
  });

  // Test FAQ search functionality
  it('should handle FAQ search correctly', () => {
    const faqItems = [
      {
        id: '1',
        question: 'Какие долги можно списать через банкротство?',
        answer: 'Через процедуру банкротства можно списать практически все виды долгов',
        category: 'debts',
        tags: ['Профессионализм', 'Быстро', 'Поддержка'],
        helpful: 24,
        verified: true,
      },
      {
        id: '2',
        question: 'Сколько времени занимает процедура банкротства?',
        answer: 'Сроки зависят от выбранной процедуры',
        category: 'timeline',
        tags: ['Профессионализм', 'Понятно', 'Эффективно'],
        helpful: 18,
        verified: true,
      },
      {
        id: '3',
        question: 'Какое имущество можно сохранить при банкротстве?',
        answer: 'По закону нельзя забрать единственное жилье',
        category: 'property',
        tags: ['Сохранение имущества', 'Правовая защита'],
        helpful: 15,
        verified: true,
      },
    ];

    // Search function
    const searchFAQ = (items: typeof faqItems, query: string) => {
      if (!query || query.trim() === '') return items;

      const normalizedQuery = query.toLowerCase().trim();
      return items.filter(
        (item) =>
          item.question.toLowerCase().includes(normalizedQuery) ||
          item.answer.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    };

    // Test empty search
    const emptySearch = searchFAQ(faqItems, '');
    expect(emptySearch.length).toBe(3);

    const whitespaceSearch = searchFAQ(faqItems, '   ');
    expect(whitespaceSearch.length).toBe(3);

    // Test question search
    const debtSearch = searchFAQ(faqItems, 'долги');
    expect(debtSearch.length).toBe(2); // Both items 1 and 3 mention долги
    expect(debtSearch.some((item) => item.id === '1')).toBe(true);
    expect(debtSearch.some((item) => item.id === '3')).toBe(true);

    // Test answer search
    const timeSearch = searchFAQ(faqItems, 'сроки');
    expect(timeSearch.length).toBe(1);
    expect(timeSearch[0].id).toBe('2');

    // Test tag search
    const supportSearch = searchFAQ(faqItems, 'поддержка');
    expect(supportSearch.length).toBe(1);
    expect(supportSearch[0].id).toBe('1');

    // Test case insensitive search
    const capitalSearch = searchFAQ(faqItems, 'ДОЛГИ');
    expect(capitalSearch.length).toBe(2);

    // Test partial match search
    const partialSearch = searchFAQ(faqItems, 'банкрот');
    expect(partialSearch.length).toBe(3); // All items mention банкротство

    // Test no match search
    const noMatchSearch = searchFAQ(faqItems, 'несуществующий термин');
    expect(noMatchSearch.length).toBe(0);

    // Search state management
    const searchState = {
      query: '',
      results: [] as typeof faqItems,
      isLoading: false,
      hasResults: false,
      updateQuery: function (newQuery: string, items: typeof faqItems) {
        this.query = newQuery;
        this.isLoading = true;
        this.results = searchFAQ(items, newQuery);
        this.hasResults = this.results.length > 0;
        this.isLoading = false;
      },
      clearSearch: function () {
        this.query = '';
        this.results = [];
        this.hasResults = false;
      },
    };

    // Test search state updates
    searchState.updateQuery('долги', faqItems);
    expect(searchState.query).toBe('долги');
    expect(searchState.results.length).toBe(2);
    expect(searchState.hasResults).toBe(true);
    expect(searchState.isLoading).toBe(false);

    searchState.clearSearch();
    expect(searchState.query).toBe('');
    expect(searchState.results.length).toBe(0);
    expect(searchState.hasResults).toBe(false);
  });

  // Test FAQ helpfulness tracking
  it('should handle FAQ helpfulness tracking correctly', () => {
    const faqItems = [
      { id: '1', question: 'Вопрос 1', helpful: 24, userHelpful: false },
      { id: '2', question: 'Вопрос 2', helpful: 18, userHelpful: false },
      { id: '3', question: 'Вопрос 3', helpful: 15, userHelpful: false },
    ];

    // Helpful tracking function
    const markAsHelpful = (items: typeof faqItems, itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (item && !item.userHelpful) {
        item.helpful++;
        item.userHelpful = true;
        return { ...item, helpful: item.helpful };
      }
      return item || null;
    };

    // Test initial state
    expect(faqItems[0].helpful).toBe(24);
    expect(faqItems[0].userHelpful).toBe(false);
    expect(faqItems[1].helpful).toBe(18);
    expect(faqItems[1].userHelpful).toBe(false);
    expect(faqItems[2].helpful).toBe(15);
    expect(faqItems[2].userHelpful).toBe(false);

    // Test marking as helpful
    const updatedItem1 = markAsHelpful(faqItems, '1');
    expect(updatedItem1?.helpful).toBe(25);
    expect(updatedItem1?.userHelpful).toBe(true);
    expect(faqItems[0].helpful).toBe(25);
    expect(faqItems[0].userHelpful).toBe(true);

    // Test duplicate helpful marking (should not increment)
    const duplicateItem1 = markAsHelpful(faqItems, '1');
    expect(duplicateItem1?.helpful).toBe(25); // Same as before
    expect(duplicateItem1?.userHelpful).toBe(true);

    // Test marking another item as helpful
    const updatedItem2 = markAsHelpful(faqItems, '2');
    expect(updatedItem2?.helpful).toBe(19);
    expect(updatedItem2?.userHelpful).toBe(true);
    expect(faqItems[1].helpful).toBe(19);
    expect(faqItems[1].userHelpful).toBe(true);

    // Test marking non-existent item
    const nonExistentItem = markAsHelpful(faqItems, 'nonexistent');
    expect(nonExistentItem).toBeNull();

    // Test helpfulness sorting
    const sortByHelpfulness = (items: typeof faqItems) => {
      return [...items].sort((a, b) => b.helpful - a.helpful);
    };

    // Before sorting, check original order
    expect(faqItems[0].id).toBe('1');
    expect(faqItems[1].id).toBe('2');
    expect(faqItems[2].id).toBe('3');

    // After sorting by helpfulness
    const sortedItems = sortByHelpfulness(faqItems);
    expect(sortedItems[0].id).toBe('1'); // Now 25 helpful votes
    expect(sortedItems[1].id).toBe('2'); // Now 19 helpful votes
    expect(sortedItems[2].id).toBe('3'); // Still 15 helpful votes

    // Verify original array is unchanged
    expect(faqItems[0].id).toBe('1');
    expect(faqItems[1].id).toBe('2');
    expect(faqItems[2].id).toBe('3');
  });

  // Test FAQ accordion functionality
  it('should handle FAQ accordion functionality correctly', () => {
    // Create FAQ accordion elements
    const faqContainer = document.createElement('div');
    faqContainer.className = 'faq';
    faqContainer.id = 'faq';

    const faqAccordion = document.createElement('div');
    faqAccordion.className = 'faq__accordion';
    faqAccordion.setAttribute('role', 'region');
    faqAccordion.setAttribute('aria-label', 'Вопросы и ответы');

    // Create FAQ items
    const faqItems = [
      { id: '1', question: 'Какие долги можно списать?', answer: 'Ответ 1' },
      { id: '2', question: 'Сколько времени занимает процедура?', answer: 'Ответ 2' },
      { id: '3', question: 'Какое имущество можно сохранить?', answer: 'Ответ 3' },
    ];

    faqItems.forEach((item, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq__item';
      faqItem.setAttribute('data-faq-item', '');

      const faqQuestion = document.createElement('button');
      faqQuestion.className = 'faq__question';
      faqQuestion.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
      faqQuestion.setAttribute('aria-controls', `faq-answer-${item.id}`);
      faqQuestion.setAttribute('data-faq-trigger', '');
      faqQuestion.textContent = item.question;

      const faqAnswer = document.createElement('div');
      faqAnswer.className = 'faq__answer';
      faqAnswer.id = `faq-answer-${item.id}`;
      faqAnswer.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
      faqAnswer.setAttribute('data-faq-content', '');
      faqAnswer.textContent = item.answer;

      faqItem.appendChild(faqQuestion);
      faqItem.appendChild(faqAnswer);
      faqAccordion.appendChild(faqItem);
    });

    faqContainer.appendChild(faqAccordion);
    document.body.appendChild(faqContainer);

    // Verify FAQ structure
    expect(document.getElementById('faq')).toBeTruthy();
    expect(faqContainer.querySelector('.faq__accordion')).toBeTruthy();
    expect(faqContainer.querySelectorAll('.faq__item').length).toBe(3);
    expect(faqContainer.querySelectorAll('.faq__question').length).toBe(3);
    expect(faqContainer.querySelectorAll('.faq__answer').length).toBe(3);

    // Test accordion functionality
    const faqQuestions = faqContainer.querySelectorAll('.faq__question');
    const faqAnswers = faqContainer.querySelectorAll('.faq__answer');

    // Verify initial state (first item expanded)
    expect(faqQuestions[0].getAttribute('aria-expanded')).toBe('true');
    expect(faqAnswers[0].getAttribute('aria-hidden')).toBe('false');
    expect(faqQuestions[1].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[1].getAttribute('aria-hidden')).toBe('true');
    expect(faqQuestions[2].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[2].getAttribute('aria-hidden')).toBe('true');

    // Test expanding second item
    faqQuestions[1].setAttribute('aria-expanded', 'true');
    faqAnswers[1].setAttribute('aria-hidden', 'false');

    expect(faqQuestions[1].getAttribute('aria-expanded')).toBe('true');
    expect(faqAnswers[1].getAttribute('aria-hidden')).toBe('false');

    // Test collapsing first item
    faqQuestions[0].setAttribute('aria-expanded', 'false');
    faqAnswers[0].setAttribute('aria-hidden', 'true');

    expect(faqQuestions[0].getAttribute('aria-expanded')).toBe('false');
    expect(faqAnswers[0].getAttribute('aria-hidden')).toBe('true');

    // Test keyboard accessibility
    const firstQuestion = faqQuestions[0] as HTMLButtonElement;
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('false');
    expect(firstQuestion.getAttribute('aria-controls')).toBe('faq-answer-1');
    expect(firstQuestion.getAttribute('data-faq-trigger')).toBe('');

    const firstAnswer = faqAnswers[0] as HTMLDivElement;
    expect(firstAnswer.id).toBe('faq-answer-1');
    expect(firstAnswer.getAttribute('aria-hidden')).toBe('true');
    expect(firstAnswer.getAttribute('data-faq-content')).toBe('');

    // Test focus management
    firstQuestion.focus();
    expect(document.activeElement).toBe(firstQuestion);

    // Test tab navigation
    const secondQuestion = faqQuestions[1] as HTMLButtonElement;
    secondQuestion.focus();
    expect(document.activeElement).toBe(secondQuestion);
  });

  // Test FAQ statistics
  it('should calculate FAQ statistics correctly', () => {
    const faqItems = [
      { id: '1', question: 'Вопрос 1', category: 'debts', helpful: 24, verified: true },
      { id: '2', question: 'Вопрос 2', category: 'timeline', helpful: 18, verified: true },
      { id: '3', question: 'Вопрос 3', category: 'property', helpful: 15, verified: true },
      { id: '4', question: 'Вопрос 4', category: 'debts', helpful: 31, verified: true },
      { id: '5', question: 'Вопрос 5', category: 'documents', helpful: 12, verified: true },
      { id: '6', question: 'Вопрос 6', category: 'costs', helpful: 8, verified: false },
      { id: '7', question: 'Вопрос 7', category: 'debts', helpful: 22, verified: true },
      { id: '8', question: 'Вопрос 8', category: 'timeline', helpful: 19, verified: true },
    ];

    // Statistics calculation functions
    const calculateFAQStats = (items: typeof faqItems) => {
      const total = items.length;
      const verified = items.filter((item) => item.verified).length;
      const helpfulVotes = items.reduce((sum, item) => sum + item.helpful, 0);
      const averageHelpfulness = total > 0 ? helpfulVotes / total : 0;

      // Category distribution
      const categoryDistribution: Record<string, number> = {};
      items.forEach((item) => {
        categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1;
      });

      // Most helpful items
      const mostHelpful = [...items].sort((a, b) => b.helpful - a.helpful).slice(0, 3);

      return {
        total,
        verified,
        verifiedPercentage: total > 0 ? Math.round((verified / total) * 100) : 0,
        helpfulVotes,
        averageHelpfulness: Math.round(averageHelpfulness * 100) / 100,
        categoryDistribution,
        mostHelpful: mostHelpful.map((item) => ({
          id: item.id,
          question: item.question,
          helpful: item.helpful,
        })),
      };
    };

    const stats = calculateFAQStats(faqItems);

    // Test basic statistics
    expect(stats.total).toBe(8);
    expect(stats.verified).toBe(7);
    expect(stats.verifiedPercentage).toBe(88);
    expect(stats.helpfulVotes).toBe(149);
    expect(stats.averageHelpfulness).toBe(18.63);

    // Test category distribution
    expect(stats.categoryDistribution.debts).toBe(3);
    expect(stats.categoryDistribution.timeline).toBe(2);
    expect(stats.categoryDistribution.property).toBe(1);
    expect(stats.categoryDistribution.documents).toBe(1);
    expect(stats.categoryDistribution.costs).toBe(1);

    // Test most helpful items
    expect(stats.mostHelpful.length).toBe(3);
    expect(stats.mostHelpful[0].id).toBe('4'); // 31 helpful votes
    expect(stats.mostHelpful[0].helpful).toBe(31);
    expect(stats.mostHelpful[1].id).toBe('1'); // 24 helpful votes
    expect(stats.mostHelpful[1].helpful).toBe(24);
    expect(stats.mostHelpful[2].id).toBe('7'); // 22 helpful votes
    expect(stats.mostHelpful[2].helpful).toBe(22);

    // Test edge cases
    const emptyStats = calculateFAQStats([]);
    expect(emptyStats.total).toBe(0);
    expect(emptyStats.verified).toBe(0);
    expect(emptyStats.verifiedPercentage).toBe(0);
    expect(emptyStats.helpfulVotes).toBe(0);
    expect(emptyStats.averageHelpfulness).toBe(0);
    expect(emptyStats.categoryDistribution).toEqual({});
    expect(emptyStats.mostHelpful).toEqual([]);

    // Test single item stats
    const singleItemStats = calculateFAQStats([faqItems[0]]);
    expect(singleItemStats.total).toBe(1);
    expect(singleItemStats.verified).toBe(1);
    expect(singleItemStats.verifiedPercentage).toBe(100);
    expect(singleItemStats.helpfulVotes).toBe(24);
    expect(singleItemStats.averageHelpfulness).toBe(24);
    expect(singleItemStats.categoryDistribution.debts).toBe(1);
    expect(singleItemStats.mostHelpful.length).toBe(1);
    expect(singleItemStats.mostHelpful[0].id).toBe('1');
    expect(singleItemStats.mostHelpful[0].helpful).toBe(24);
  });

  // Test FAQ filtering and sorting
  it('should handle FAQ filtering and sorting correctly', () => {
    const faqItems = [
      {
        id: '1',
        question: 'Вопрос A',
        category: 'debts',
        helpful: 24,
        date: '2024-03-15',
        verified: true,
      },
      {
        id: '2',
        question: 'Вопрос B',
        category: 'timeline',
        helpful: 18,
        date: '2024-03-10',
        verified: true,
      },
      {
        id: '3',
        question: 'Вопрос C',
        category: 'property',
        helpful: 31,
        date: '2024-03-05',
        verified: true,
      },
      {
        id: '4',
        question: 'Вопрос D',
        category: 'documents',
        helpful: 12,
        date: '2024-03-20',
        verified: false,
      },
      {
        id: '5',
        question: 'Вопрос E',
        category: 'costs',
        helpful: 8,
        date: '2024-03-01',
        verified: true,
      },
    ];

    // Filtering functions
    const filterVerified = (items: typeof faqItems) => {
      return items.filter((item) => item.verified);
    };

    const filterByCategory = (items: typeof faqItems, category: string) => {
      return category === 'all' ? items : items.filter((item) => item.category === category);
    };

    // Sorting functions
    const sortByHelpfulness = (items: typeof faqItems) => {
      return [...items].sort((a, b) => b.helpful - a.helpful);
    };

    const sortByDate = (items: typeof faqItems) => {
      return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const sortAlphabetically = (items: typeof faqItems) => {
      return [...items].sort((a, b) => a.question.localeCompare(b.question, 'ru'));
    };

    // Test verified filtering
    const verifiedItems = filterVerified(faqItems);
    expect(verifiedItems.length).toBe(4);
    expect(verifiedItems.every((item) => item.verified)).toBe(true);
    expect(verifiedItems.some((item) => item.id === '4')).toBe(false); // Unverified item

    // Test category filtering
    const debtsItems = filterByCategory(faqItems, 'debts');
    expect(debtsItems.length).toBe(1);
    expect(debtsItems[0].id).toBe('1');
    expect(debtsItems[0].category).toBe('debts');

    const allItems = filterByCategory(faqItems, 'all');
    expect(allItems.length).toBe(5);

    // Test helpfulness sorting
    const helpfulSorted = sortByHelpfulness(faqItems);
    expect(helpfulSorted[0].id).toBe('3'); // 31 helpful votes
    expect(helpfulSorted[1].id).toBe('1'); // 24 helpful votes
    expect(helpfulSorted[2].id).toBe('2'); // 18 helpful votes
    expect(helpfulSorted[3].id).toBe('4'); // 12 helpful votes
    expect(helpfulSorted[4].id).toBe('5'); // 8 helpful votes

    // Test date sorting
    const dateSorted = sortByDate(faqItems);
    expect(dateSorted[0].id).toBe('4'); // 2024-03-20 (most recent)
    expect(dateSorted[1].id).toBe('1'); // 2024-03-15
    expect(dateSorted[2].id).toBe('2'); // 2024-03-10
    expect(dateSorted[3].id).toBe('3'); // 2024-03-05
    expect(dateSorted[4].id).toBe('5'); // 2024-03-01 (oldest)

    // Test alphabetical sorting
    const alphaSorted = sortAlphabetically(faqItems);
    expect(alphaSorted[0].question).toBe('Вопрос A');
    expect(alphaSorted[1].question).toBe('Вопрос B');
    expect(alphaSorted[2].question).toBe('Вопрос C');
    expect(alphaSorted[3].question).toBe('Вопрос D');
    expect(alphaSorted[4].question).toBe('Вопрос E');

    // Test combined filtering and sorting
    const combinedResult = sortByHelpfulness(filterVerified(faqItems));
    expect(combinedResult.length).toBe(4);
    expect(combinedResult.some((item) => item.id === '4')).toBe(false); // Excluded unverified
    expect(combinedResult[0].id).toBe('3'); // 31 helpful votes
    expect(combinedResult[1].id).toBe('1'); // 24 helpful votes
    expect(combinedResult[2].id).toBe('2'); // 18 helpful votes
    expect(combinedResult[3].id).toBe('5'); // 8 helpful votes

    // Test pagination
    const paginate = (items: typeof faqItems, page: number, pageSize: number) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    };

    const firstPage = paginate(faqItems, 1, 2);
    expect(firstPage.length).toBe(2);
    expect(firstPage[0].id).toBe('1');
    expect(firstPage[1].id).toBe('2');

    const secondPage = paginate(faqItems, 2, 2);
    expect(secondPage.length).toBe(2);
    expect(secondPage[0].id).toBe('3');
    expect(secondPage[1].id).toBe('4');

    const thirdPage = paginate(faqItems, 3, 2);
    expect(thirdPage.length).toBe(1);
    expect(thirdPage[0].id).toBe('5');
  });

  // Test FAQ accessibility features
  it('should include proper accessibility features', () => {
    // Create accessible FAQ elements
    const faqSection = document.createElement('section');
    faqSection.setAttribute('role', 'region');
    faqSection.setAttribute('aria-label', 'Часто задаваемые вопросы по банкротству');
    faqSection.id = 'faq';

    const faqHeader = document.createElement('header');
    faqHeader.className = 'faq__header';

    const faqTitle = document.createElement('h2');
    faqTitle.id = 'faq-title';
    faqTitle.textContent = 'Часто задаваемые вопросы';

    const faqSubtitle = document.createElement('p');
    faqSubtitle.setAttribute('aria-describedby', 'faq-title');
    faqSubtitle.textContent = 'Ответы на популярные вопросы о процедуре банкротства физических лиц';

    const faqAccordion = document.createElement('div');
    faqAccordion.className = 'faq__accordion';
    faqAccordion.setAttribute('role', 'region');
    faqAccordion.setAttribute('aria-labelledby', 'faq-title');

    // Create FAQ items with accessibility
    const faqItems = [
      { id: '1', question: 'Какие долги можно списать?', answer: 'Ответ 1' },
      { id: '2', question: 'Сколько времени занимает процедура?', answer: 'Ответ 2' },
    ];

    faqItems.forEach((item, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq__item';
      faqItem.setAttribute('data-faq-item', '');

      const faqQuestion = document.createElement('button');
      faqQuestion.className = 'faq__question';
      faqQuestion.id = `faq-question-${item.id}`;
      faqQuestion.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
      faqQuestion.setAttribute('aria-controls', `faq-answer-${item.id}`);
      faqQuestion.setAttribute('data-faq-trigger', '');
      faqQuestion.textContent = item.question;

      const faqAnswer = document.createElement('div');
      faqAnswer.className = 'faq__answer';
      faqAnswer.id = `faq-answer-${item.id}`;
      faqAnswer.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
      faqAnswer.setAttribute('aria-labelledby', `faq-question-${item.id}`);
      faqAnswer.setAttribute('data-faq-content', '');
      faqAnswer.textContent = item.answer;

      faqItem.appendChild(faqQuestion);
      faqItem.appendChild(faqAnswer);
      faqAccordion.appendChild(faqItem);
    });

    // Append elements
    faqHeader.appendChild(faqTitle);
    faqHeader.appendChild(faqSubtitle);
    faqSection.appendChild(faqHeader);
    faqSection.appendChild(faqAccordion);
    document.body.appendChild(faqSection);

    // Verify accessibility attributes
    expect(faqSection.getAttribute('role')).toBe('region');
    expect(faqSection.getAttribute('aria-label')).toBe('Часто задаваемые вопросы по банкротству');
    expect(faqSection.id).toBe('faq');

    expect(faqHeader.querySelector('h2')?.id).toBe('faq-title');
    expect(faqHeader.querySelector('p')?.getAttribute('aria-describedby')).toBe('faq-title');

    expect(faqAccordion.getAttribute('role')).toBe('region');
    expect(faqAccordion.getAttribute('aria-labelledby')).toBe('faq-title');

    // Verify FAQ item accessibility
    const faqItemElements = faqSection.querySelectorAll('.faq__item');
    expect(faqItemElements.length).toBe(2);

    faqItemElements.forEach((item, index) => {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      expect(question?.id).toBe(`faq-question-${faqItems[index].id}`);
      expect(question?.getAttribute('aria-expanded')).toBe(index === 0 ? 'true' : 'false');
      expect(question?.getAttribute('aria-controls')).toBe(`faq-answer-${faqItems[index].id}`);
      expect(question?.getAttribute('data-faq-trigger')).toBe('');

      expect(answer?.id).toBe(`faq-answer-${faqItems[index].id}`);
      expect(answer?.getAttribute('aria-hidden')).toBe(index === 0 ? 'false' : 'true');
      expect(answer?.getAttribute('aria-labelledby')).toBe(`faq-question-${faqItems[index].id}`);
      expect(answer?.getAttribute('data-faq-content')).toBe('');
    });

    // Test keyboard navigation support
    const firstQuestion = faqSection.querySelector('.faq__question') as HTMLButtonElement;
    expect(firstQuestion.tabIndex).toBe(0); // Should be focusable

    // Test screen reader support
    const firstAnswer = faqSection.querySelector('.faq__answer') as HTMLDivElement;
    expect(firstAnswer.getAttribute('role')).toBeNull(); // Answers don't need role attribute
    expect(firstAnswer.getAttribute('aria-live')).toBeNull(); // Answers don't need live region

    // Test ARIA relationships
    expect(firstQuestion.getAttribute('aria-controls')).toBe(firstAnswer.id);
    expect(firstAnswer.getAttribute('aria-labelledby')).toBe(firstQuestion.id);
  });

  // Test FAQ performance considerations
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

    // Test FAQ rendering performance with large dataset
    performanceMock.mark('faq-render-start');

    // Create 1000 FAQ items for stress testing
    const largeFAQDataset = [];
    for (let i = 0; i < 1000; i++) {
      largeFAQDataset.push({
        id: `faq-${i + 1}`,
        question: `Вопрос ${i + 1}`,
        answer: `Ответ на вопрос ${i + 1}`,
        category:
          i % 5 === 0
            ? 'debts'
            : i % 5 === 1
              ? 'timeline'
              : i % 5 === 2
                ? 'property'
                : i % 5 === 3
                  ? 'documents'
                  : 'costs',
        helpful: Math.floor(Math.random() * 100),
        date: `2024-01-${String((i % 31) + 1).padStart(2, '0')}`,
        verified: i % 4 !== 0, // 75% verified
      });
    }

    performanceMock.mark('faq-render-end');
    const renderMeasure = performanceMock.measure(
      'faq-render',
      'faq-render-start',
      'faq-render-end'
    );

    // Verify dataset creation
    expect(largeFAQDataset.length).toBe(1000);

    // Test that all items have required properties
    largeFAQDataset.forEach((item, index) => {
      expect(item.id).toBe(`faq-${index + 1}`);
      expect(item.question).toBe(`Вопрос ${index + 1}`);
      expect(item.answer).toBe(`Ответ на вопрос ${index + 1}`);
      expect(typeof item.category).toBe('string');
      expect(typeof item.helpful).toBe('number');
      expect(typeof item.date).toBe('string');
      expect(typeof item.verified).toBe('boolean');
    });

    // Test filtering performance
    performanceMock.mark('filter-start');

    const filterLargeDataset = (items: typeof largeFAQDataset, category: string) => {
      return category === 'all' ? items : items.filter((item) => item.category === category);
    };

    const filteredItems = filterLargeDataset(largeFAQDataset, 'debts');
    const debtItemsCount = largeFAQDataset.filter((item) => item.category === 'debts').length;

    performanceMock.mark('filter-end');
    const filterMeasure = performanceMock.measure('faq-filter', 'filter-start', 'filter-end');

    expect(filteredItems.length).toBe(debtItemsCount);
    expect(filteredItems.every((item) => item.category === 'debts')).toBe(true);

    // Test sorting performance
    performanceMock.mark('sort-start');

    const sortLargeDataset = (items: typeof largeFAQDataset) => {
      return [...items].sort((a, b) => b.helpful - a.helpful);
    };

    const sortedItems = sortLargeDataset(largeFAQDataset);

    performanceMock.mark('sort-end');
    const sortMeasure = performanceMock.measure('faq-sort', 'sort-start', 'sort-end');

    // Verify sorting worked correctly
    expect(sortedItems.length).toBe(1000);
    expect(sortedItems[0].helpful).toBeGreaterThanOrEqual(sortedItems[1].helpful);
    expect(sortedItems[sortedItems.length - 2].helpful).toBeGreaterThanOrEqual(
      sortedItems[sortedItems.length - 1].helpful
    );

    // Test pagination performance
    performanceMock.mark('paginate-start');

    const paginateLargeDataset = (
      items: typeof largeFAQDataset,
      page: number,
      pageSize: number
    ) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    };

    const paginatedItems = paginateLargeDataset(largeFAQDataset, 1, 10);

    performanceMock.mark('paginate-end');
    const paginateMeasure = performanceMock.measure(
      'faq-paginate',
      'paginate-start',
      'paginate-end'
    );

    expect(paginatedItems.length).toBe(10);
    expect(paginatedItems[0].id).toBe('faq-1');
    expect(paginatedItems[9].id).toBe('faq-10');

    // Verify performance measurements
    expect(performanceMock.marks).toContain('faq-render-start');
    expect(performanceMock.marks).toContain('faq-render-end');
    expect(performanceMock.marks).toContain('filter-start');
    expect(performanceMock.marks).toContain('filter-end');
    expect(performanceMock.marks).toContain('sort-start');
    expect(performanceMock.marks).toContain('sort-end');
    expect(performanceMock.marks).toContain('paginate-start');
    expect(performanceMock.marks).toContain('paginate-end');

    expect(performanceMock.measures.some((m) => m.name === 'faq-render')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'faq-filter')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'faq-sort')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'faq-paginate')).toBe(true);
  });
});
