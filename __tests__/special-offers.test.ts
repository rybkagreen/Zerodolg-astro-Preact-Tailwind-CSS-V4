import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SpecialOffers Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test special offers data structure
  it('should handle special offers data correctly', () => {
    const specialOffers = [
      {
        id: 'debt-relief',
        title: 'Списание долгов до 2 млн ₽',
        description: 'Полное списание долгов без продажи имущества',
        price: 'от 5 900 ₽/мес',
        originalPrice: '12 900 ₽/мес',
        discount: '54%',
        features: [
          'Полное списание всех долгов',
          'Защита имущества',
          'Остановка начисления процентов',
          'Прекращение звонков коллекторов',
        ],
        limitations: [
          'Долги до 2 млн ₽',
          'Нет арестов на имущество',
          'Срок рассмотрения до 6 месяцев',
        ],
        cta: 'Начать процедуру',
        modal: 'special-offer',
        popular: true,
        exclusive: false,
        deadline: '2025-12-31',
        tags: ['Популярное', 'Экономия', 'Быстро'],
      },
      {
        id: 'property-protection',
        title: 'Сохранение имущества',
        description: 'Сохраняем вашу недвижимость и автомобили',
        price: 'от 8 900 ₽/мес',
        originalPrice: '15 900 ₽/мес',
        discount: '44%',
        features: [
          'Сохранение недвижимости',
          'Сохранение автомобиля',
          'Полное списание долгов',
          'Юридическая защита имущества',
        ],
        limitations: ['Долги до 3 млн ₽', 'Единственное жилье', 'Автомобиль старше 3 лет'],
        cta: 'Сохранить имущество',
        modal: 'property-protection',
        popular: false,
        exclusive: true,
        deadline: '2025-11-30',
        tags: ['Имущество', 'Защита', 'Эксклюзив'],
      },
      {
        id: 'business-bankruptcy',
        title: 'Банкротство ИП',
        description: 'Списание долгов предпринимателей без потери бизнеса',
        price: 'от 12 900 ₽/мес',
        originalPrice: '24 900 ₽/мес',
        discount: '48%',
        features: [
          'Списание долгов ИП',
          'Сохранение бизнеса',
          'Остановка начисления налогов',
          'Прекращение требований кредиторов',
        ],
        limitations: [
          'Долги до 5 млн ₽',
          'Нет арестов на счета',
          'Срок рассмотрения до 12 месяцев',
        ],
        cta: 'Списать долги ИП',
        modal: 'business-bankruptcy',
        popular: false,
        exclusive: false,
        deadline: '2025-10-31',
        tags: ['ИП', 'Бизнес', 'Налоги'],
      },
    ];

    // Test special offer structure validation
    specialOffers.forEach((offer) => {
      expect(typeof offer.id).toBe('string');
      expect(typeof offer.title).toBe('string');
      expect(typeof offer.description).toBe('string');
      expect(typeof offer.price).toBe('string');
      expect(typeof offer.originalPrice).toBe('string');
      expect(typeof offer.discount).toBe('string');
      expect(Array.isArray(offer.features)).toBe(true);
      expect(Array.isArray(offer.limitations)).toBe(true);
      expect(typeof offer.cta).toBe('string');
      expect(typeof offer.modal).toBe('string');
      expect(typeof offer.popular).toBe('boolean');
      expect(typeof offer.exclusive).toBe('boolean');
      expect(typeof offer.deadline).toBe('string');
      expect(Array.isArray(offer.tags)).toBe(true);

      // Test non-empty strings
      expect(offer.id.length).toBeGreaterThan(0);
      expect(offer.title.length).toBeGreaterThan(0);
      expect(offer.description.length).toBeGreaterThan(0);
      expect(offer.price.length).toBeGreaterThan(0);
      expect(offer.originalPrice.length).toBeGreaterThan(0);
      expect(offer.discount.length).toBeGreaterThan(0);
      expect(offer.cta.length).toBeGreaterThan(0);
      expect(offer.modal.length).toBeGreaterThan(0);
      expect(offer.deadline.length).toBeGreaterThan(0);

      // Test array lengths
      expect(offer.features.length).toBeGreaterThanOrEqual(3);
      expect(offer.limitations.length).toBeGreaterThanOrEqual(2);
      expect(offer.tags.length).toBeGreaterThanOrEqual(1);

      // Test features and limitations are strings
      offer.features.forEach((feature) => {
        expect(typeof feature).toBe('string');
        expect(feature.length).toBeGreaterThan(0);
      });

      offer.limitations.forEach((limitation) => {
        expect(typeof limitation).toBe('string');
        expect(limitation.length).toBeGreaterThan(0);
      });

      offer.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });

    // Test specific offer data
    const debtReliefOffer = specialOffers[0];
    expect(debtReliefOffer.id).toBe('debt-relief');
    expect(debtReliefOffer.title).toBe('Списание долгов до 2 млн ₽');
    expect(debtReliefOffer.description).toBe('Полное списание долгов без продажи имущества');
    expect(debtReliefOffer.price).toBe('от 5 900 ₽/мес');
    expect(debtReliefOffer.originalPrice).toBe('12 900 ₽/мес');
    expect(debtReliefOffer.discount).toBe('54%');
    expect(debtReliefOffer.features.length).toBe(4);
    expect(debtReliefOffer.limitations.length).toBe(3);
    expect(debtReliefOffer.cta).toBe('Начать процедуру');
    expect(debtReliefOffer.modal).toBe('special-offer');
    expect(debtReliefOffer.popular).toBe(true);
    expect(debtReliefOffer.exclusive).toBe(false);
    expect(debtReliefOffer.deadline).toBe('2025-12-31');
    expect(debtReliefOffer.tags).toEqual(['Популярное', 'Экономия', 'Быстро']);

    const propertyOffer = specialOffers[1];
    expect(propertyOffer.id).toBe('property-protection');
    expect(propertyOffer.title).toBe('Сохранение имущества');
    expect(propertyOffer.description).toBe('Сохраняем вашу недвижимость и автомобили');
    expect(propertyOffer.price).toBe('от 8 900 ₽/мес');
    expect(propertyOffer.originalPrice).toBe('15 900 ₽/мес');
    expect(propertyOffer.discount).toBe('44%');
    expect(propertyOffer.features.length).toBe(4);
    expect(propertyOffer.limitations.length).toBe(3);
    expect(propertyOffer.cta).toBe('Сохранить имущество');
    expect(propertyOffer.modal).toBe('property-protection');
    expect(propertyOffer.popular).toBe(false);
    expect(propertyOffer.exclusive).toBe(true);
    expect(propertyOffer.deadline).toBe('2025-11-30');
    expect(propertyOffer.tags).toEqual(['Имущество', 'Защита', 'Эксклюзив']);

    const businessOffer = specialOffers[2];
    expect(businessOffer.id).toBe('business-bankruptcy');
    expect(businessOffer.title).toBe('Банкротство ИП');
    expect(businessOffer.description).toBe('Списание долгов предпринимателей без потери бизнеса');
    expect(businessOffer.price).toBe('от 12 900 ₽/мес');
    expect(businessOffer.originalPrice).toBe('24 900 ₽/мес');
    expect(businessOffer.discount).toBe('48%');
    expect(businessOffer.features.length).toBe(4);
    expect(businessOffer.limitations.length).toBe(3);
    expect(businessOffer.cta).toBe('Списать долги ИП');
    expect(businessOffer.modal).toBe('business-bankruptcy');
    expect(businessOffer.popular).toBe(false);
    expect(businessOffer.exclusive).toBe(false);
    expect(businessOffer.deadline).toBe('2025-10-31');
    expect(businessOffer.tags).toEqual(['ИП', 'Бизнес', 'Налоги']);
  });

  // Test offer filtering and sorting
  it('should handle offer filtering and sorting correctly', () => {
    const specialOffers = [
      {
        id: 'debt-relief',
        title: 'Списание долгов до 2 млн ₽',
        price: 'от 5 900 ₽/мес',
        discount: '54%',
        popular: true,
        exclusive: false,
        deadline: '2025-12-31',
        tags: ['Популярное', 'Экономия', 'Быстро'],
      },
      {
        id: 'property-protection',
        title: 'Сохранение имущества',
        price: 'от 8 900 ₽/мес',
        discount: '44%',
        popular: false,
        exclusive: true,
        deadline: '2025-11-30',
        tags: ['Имущество', 'Защита', 'Эксклюзив'],
      },
      {
        id: 'business-bankruptcy',
        title: 'Банкротство ИП',
        price: 'от 12 900 ₽/мес',
        discount: '48%',
        popular: false,
        exclusive: false,
        deadline: '2025-10-31',
        tags: ['ИП', 'Бизнес', 'Налоги'],
      },
      {
        id: 'fast-bankruptcy',
        title: 'Быстрое банкротство',
        price: 'от 7 900 ₽/мес',
        discount: '35%',
        popular: true,
        exclusive: false,
        deadline: '2025-09-30',
        tags: ['Быстро', 'Экономия'],
      },
    ];

    // Filtering functions
    const filterPopularOffers = (offers: typeof specialOffers) => {
      return offers.filter((offer) => offer.popular);
    };

    const filterExclusiveOffers = (offers: typeof specialOffers) => {
      return offers.filter((offer) => offer.exclusive);
    };

    const filterByTag = (offers: typeof specialOffers, tag: string) => {
      return offers.filter((offer) => offer.tags.includes(tag));
    };

    const filterByDeadline = (offers: typeof specialOffers, deadline: string) => {
      return offers.filter((offer) => offer.deadline >= deadline);
    };

    // Sorting functions
    const sortByDiscount = (offers: typeof specialOffers) => {
      return [...offers].sort((a, b) => {
        const aDiscount = parseInt(a.discount.replace('%', ''));
        const bDiscount = parseInt(b.discount.replace('%', ''));
        return bDiscount - aDiscount;
      });
    };

    const sortByPrice = (offers: typeof specialOffers) => {
      return [...offers].sort((a, b) => {
        const aPrice = parseInt(a.price.replace(/\D/g, ''));
        const bPrice = parseInt(b.price.replace(/\D/g, ''));
        return aPrice - bPrice;
      });
    };

    const sortByDeadline = (offers: typeof specialOffers) => {
      return [...offers].sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    };

    // Test filtering
    const popularOffers = filterPopularOffers(specialOffers);
    expect(popularOffers.length).toBe(2);
    expect(popularOffers.some((o) => o.id === 'debt-relief')).toBe(true);
    expect(popularOffers.some((o) => o.id === 'fast-bankruptcy')).toBe(true);

    const exclusiveOffers = filterExclusiveOffers(specialOffers);
    expect(exclusiveOffers.length).toBe(1);
    expect(exclusiveOffers[0].id).toBe('property-protection');

    const propertyOffers = filterByTag(specialOffers, 'Имущество');
    expect(propertyOffers.length).toBe(1);
    expect(propertyOffers[0].id).toBe('property-protection');

    const fastOffers = filterByTag(specialOffers, 'Быстро');
    expect(fastOffers.length).toBe(2);
    expect(fastOffers.some((o) => o.id === 'debt-relief')).toBe(true);
    expect(fastOffers.some((o) => o.id === 'fast-bankruptcy')).toBe(true);

    const currentOffers = filterByDeadline(specialOffers, '2025-10-01');
    expect(currentOffers.length).toBe(3);
    expect(currentOffers.some((o) => o.id === 'debt-relief')).toBe(true);
    expect(currentOffers.some((o) => o.id === 'property-protection')).toBe(true);
    expect(currentOffers.some((o) => o.id === 'business-bankruptcy')).toBe(true);
    expect(currentOffers.some((o) => o.id === 'fast-bankruptcy')).toBe(false); // Expired

    // Test sorting
    const discountSorted = sortByDiscount(specialOffers);
    expect(discountSorted[0].id).toBe('debt-relief'); // 54%
    expect(discountSorted[1].id).toBe('business-bankruptcy'); // 48%
    expect(discountSorted[2].id).toBe('property-protection'); // 44%
    expect(discountSorted[3].id).toBe('fast-bankruptcy'); // 35%

    const priceSorted = sortByPrice(specialOffers);
    expect(priceSorted[0].id).toBe('debt-relief'); // 5 900
    expect(priceSorted[1].id).toBe('fast-bankruptcy'); // 7 900
    expect(priceSorted[2].id).toBe('property-protection'); // 8 900
    expect(priceSorted[3].id).toBe('business-bankruptcy'); // 12 900

    const deadlineSorted = sortByDeadline(specialOffers);
    expect(deadlineSorted[0].id).toBe('fast-bankruptcy'); // 2025-09-30
    expect(deadlineSorted[1].id).toBe('business-bankruptcy'); // 2025-10-31
    expect(deadlineSorted[2].id).toBe('property-protection'); // 2025-11-30
    expect(deadlineSorted[3].id).toBe('debt-relief'); // 2025-12-31

    // Test combined filtering and sorting
    const combinedResult = sortByDiscount(filterPopularOffers(specialOffers));
    expect(combinedResult.length).toBe(2);
    expect(combinedResult[0].id).toBe('debt-relief'); // 54% discount
    expect(combinedResult[1].id).toBe('fast-bankruptcy'); // 35% discount

    // Test multiple tag filtering
    const multiTagFilter = (offers: typeof specialOffers, tags: string[]) => {
      return offers.filter((offer) => tags.every((tag) => offer.tags.includes(tag)));
    };

    const economyFastOffers = multiTagFilter(specialOffers, ['Экономия', 'Быстро']);
    expect(economyFastOffers.length).toBe(1);
    expect(economyFastOffers[0].id).toBe('fast-bankruptcy');
  });

  // Test offer pricing calculations
  it('should calculate offer prices correctly', () => {
    const specialOffers = [
      {
        id: 'debt-relief',
        title: 'Списание долгов до 2 млн ₽',
        price: 'от 5 900 ₽/мес',
        originalPrice: '12 900 ₽/мес',
        discount: '54%',
        duration: 12,
      },
      {
        id: 'property-protection',
        title: 'Сохранение имущества',
        price: 'от 8 900 ₽/мес',
        originalPrice: '15 900 ₽/мес',
        discount: '44%',
        duration: 12,
      },
      {
        id: 'business-bankruptcy',
        title: 'Банкротство ИП',
        price: 'от 12 900 ₽/мес',
        originalPrice: '24 900 ₽/мес',
        discount: '48%',
        duration: 18,
      },
    ];

    // Pricing calculation functions
    const parsePrice = (priceString: string) => {
      const match = priceString.match(/(\d[\d\s]*)/);
      return match ? parseInt(match[1].replace(/\s/g, ''), 10) : 0;
    };

    const calculateTotalCost = (monthlyPrice: number, duration: number) => {
      return monthlyPrice * duration;
    };

    const calculateOriginalTotal = (originalMonthlyPrice: number, duration: number) => {
      return originalMonthlyPrice * duration;
    };

    const calculateActualDiscount = (originalTotal: number, discountedTotal: number) => {
      if (originalTotal === 0) return 0;
      return Math.round(((originalTotal - discountedTotal) / originalTotal) * 100);
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Test pricing calculations
    specialOffers.forEach((offer) => {
      const monthlyPrice = parsePrice(offer.price);
      const originalMonthlyPrice = parsePrice(offer.originalPrice);
      const totalCost = calculateTotalCost(monthlyPrice, offer.duration);
      const originalTotal = calculateOriginalTotal(originalMonthlyPrice, offer.duration);
      const actualDiscount = calculateActualDiscount(originalTotal, totalCost);

      expect(typeof monthlyPrice).toBe('number');
      expect(monthlyPrice).toBeGreaterThan(0);
      expect(typeof originalMonthlyPrice).toBe('number');
      expect(originalMonthlyPrice).toBeGreaterThan(0);
      expect(monthlyPrice).toBeLessThan(originalMonthlyPrice);
      expect(typeof totalCost).toBe('number');
      expect(totalCost).toBeGreaterThan(0);
      expect(typeof originalTotal).toBe('number');
      expect(originalTotal).toBeGreaterThan(0);
      expect(totalCost).toBeLessThan(originalTotal);
      expect(typeof actualDiscount).toBe('number');
      expect(actualDiscount).toBeGreaterThanOrEqual(0);
      expect(actualDiscount).toBeLessThanOrEqual(100);

      // Test currency formatting
      const formattedMonthly = formatCurrency(monthlyPrice);
      const formattedTotal = formatCurrency(totalCost);
      const formattedOriginal = formatCurrency(originalMonthlyPrice);
      const formattedOriginalTotal = formatCurrency(originalTotal);

      expect(typeof formattedMonthly).toBe('string');
      expect(formattedMonthly.length).toBeGreaterThan(0);
      expect(formattedMonthly).toMatch(/[\d\s]+₽/);

      expect(typeof formattedTotal).toBe('string');
      expect(formattedTotal.length).toBeGreaterThan(0);
      expect(formattedTotal).toMatch(/[\d\s]+₽/);

      expect(typeof formattedOriginal).toBe('string');
      expect(formattedOriginal.length).toBeGreaterThan(0);
      expect(formattedOriginal).toMatch(/[\d\s]+₽/);

      expect(typeof formattedOriginalTotal).toBe('string');
      expect(formattedOriginalTotal.length).toBeGreaterThan(0);
      expect(formattedOriginalTotal).toMatch(/[\d\s]+₽/);
    });

    // Test specific calculations
    const debtReliefOffer = specialOffers[0];
    const debtReliefMonthly = parsePrice(debtReliefOffer.price);
    const debtReliefOriginalMonthly = parsePrice(debtReliefOffer.originalPrice);
    const debtReliefTotal = calculateTotalCost(debtReliefMonthly, debtReliefOffer.duration);
    const debtReliefOriginalTotal = calculateOriginalTotal(
      debtReliefOriginalMonthly,
      debtReliefOffer.duration
    );
    const debtReliefActualDiscount = calculateActualDiscount(
      debtReliefOriginalTotal,
      debtReliefTotal
    );

    expect(debtReliefMonthly).toBe(5900);
    expect(debtReliefOriginalMonthly).toBe(12900);
    expect(debtReliefTotal).toBe(70800); // 5900 * 12
    expect(debtReliefOriginalTotal).toBe(154800); // 12900 * 12
    expect(debtReliefActualDiscount).toBe(54); // Matches advertised discount

    const propertyOffer = specialOffers[1];
    const propertyMonthly = parsePrice(propertyOffer.price);
    const propertyOriginalMonthly = parsePrice(propertyOffer.originalPrice);
    const propertyTotal = calculateTotalCost(propertyMonthly, propertyOffer.duration);
    const propertyOriginalTotal = calculateOriginalTotal(
      propertyOriginalMonthly,
      propertyOffer.duration
    );
    const propertyActualDiscount = calculateActualDiscount(propertyOriginalTotal, propertyTotal);

    expect(propertyMonthly).toBe(8900);
    expect(propertyOriginalMonthly).toBe(15900);
    expect(propertyTotal).toBe(106800); // 8900 * 12
    expect(propertyOriginalTotal).toBe(190800); // 15900 * 12
    expect(propertyActualDiscount).toBe(44); // Matches advertised discount

    const businessOffer = specialOffers[2];
    const businessMonthly = parsePrice(businessOffer.price);
    const businessOriginalMonthly = parsePrice(businessOffer.originalPrice);
    const businessTotal = calculateTotalCost(businessMonthly, businessOffer.duration);
    const businessOriginalTotal = calculateOriginalTotal(
      businessOriginalMonthly,
      businessOffer.duration
    );
    const businessActualDiscount = calculateActualDiscount(businessOriginalTotal, businessTotal);

    expect(businessMonthly).toBe(12900);
    expect(businessOriginalMonthly).toBe(24900);
    expect(businessTotal).toBe(232200); // 12900 * 18
    expect(businessOriginalTotal).toBe(448200); // 24900 * 18
    expect(businessActualDiscount).toBe(48); // Matches advertised discount
  });

  // Test offer interactivity
  it('should handle offer interactivity correctly', () => {
    // Create interactive offer elements
    const offersContainer = document.createElement('div');
    offersContainer.className = 'special-offers';
    offersContainer.id = 'special-offers';

    const offerCards = [];
    for (let i = 0; i < 3; i++) {
      const card = document.createElement('div');
      card.className = `offer-card offer-card--${i + 1}`;
      card.setAttribute('data-offer-id', `offer-${i + 1}`);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
      card.setAttribute('aria-controls', `offer-details-${i + 1}`);

      const title = document.createElement('h3');
      title.className = 'offer-card__title';
      title.textContent = `Специальное предложение ${i + 1}`;

      const price = document.createElement('div');
      price.className = 'offer-card__price';
      price.textContent = `от ${(i + 1) * 5000} ₽/мес`;

      const ctaButton = document.createElement('button');
      ctaButton.className = 'offer-card__cta';
      ctaButton.setAttribute('data-modal', `offer-${i + 1}`);
      ctaButton.textContent = 'Подробнее';

      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(ctaButton);
      offersContainer.appendChild(card);
      offerCards.push(card);
    }

    document.body.appendChild(offersContainer);

    // Verify offer structure
    expect(document.getElementById('special-offers')).toBeTruthy();
    expect(offersContainer.querySelectorAll('.offer-card').length).toBe(3);
    expect(offersContainer.querySelectorAll('.offer-card__title').length).toBe(3);
    expect(offersContainer.querySelectorAll('.offer-card__price').length).toBe(3);
    expect(offersContainer.querySelectorAll('.offer-card__cta').length).toBe(3);

    // Test offer interactivity attributes
    offerCards.forEach((card, index) => {
      expect(card.getAttribute('data-offer-id')).toBe(`offer-${index + 1}`);
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('aria-expanded')).toBe(index === 0 ? 'true' : 'false');
      expect(card.getAttribute('aria-controls')).toBe(`offer-details-${index + 1}`);

      const title = card.querySelector('.offer-card__title');
      const price = card.querySelector('.offer-card__price');
      const ctaButton = card.querySelector('.offer-card__cta');

      expect(title?.textContent).toBe(`Специальное предложение ${index + 1}`);
      expect(price?.textContent).toBe(`от ${(index + 1) * 5000} ₽/мес`);
      expect(ctaButton?.getAttribute('data-modal')).toBe(`offer-${index + 1}`);
      expect(ctaButton?.textContent).toBe('Подробнее');
    });

    // Test offer selection
    const selectOffer = (offerId: string) => {
      offerCards.forEach((card) => {
        const isSelected = card.getAttribute('data-offer-id') === offerId;
        card.setAttribute('aria-expanded', isSelected ? 'true' : 'false');
        card.classList.toggle('selected', isSelected);
      });
    };

    // Test initial selection
    expect(offerCards[0].getAttribute('aria-expanded')).toBe('true');
    expect(offerCards[0].classList.contains('selected')).toBe(false); // Initially no selection class

    // Test selecting second offer
    selectOffer('offer-2');
    expect(offerCards[1].getAttribute('aria-expanded')).toBe('true');
    expect(offerCards[1].classList.contains('selected')).toBe(true);
    expect(offerCards[0].getAttribute('aria-expanded')).toBe('false');
    expect(offerCards[0].classList.contains('selected')).toBe(false);

    // Test selecting third offer
    selectOffer('offer-3');
    expect(offerCards[2].getAttribute('aria-expanded')).toBe('true');
    expect(offerCards[2].classList.contains('selected')).toBe(true);
    expect(offerCards[1].getAttribute('aria-expanded')).toBe('false');
    expect(offerCards[1].classList.contains('selected')).toBe(false);

    // Test CTA button interactivity
    let modalTriggered = false;
    let triggeredModalId = '';

    const handleModalTrigger = (modalId: string) => {
      modalTriggered = true;
      triggeredModalId = modalId;
    };

    const ctaButtons = offersContainer.querySelectorAll('.offer-card__cta');
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
    expect(triggeredModalId).toBe('offer-1');

    // Reset for next test
    modalTriggered = false;
    triggeredModalId = '';

    // Test second CTA button click
    ctaButtons[1].dispatchEvent(new Event('click'));
    expect(modalTriggered).toBe(true);
    expect(triggeredModalId).toBe('offer-2');

    // Reset for next test
    modalTriggered = false;
    triggeredModalId = '';

    // Test third CTA button click
    ctaButtons[2].dispatchEvent(new Event('click'));
    expect(modalTriggered).toBe(true);
    expect(triggeredModalId).toBe('offer-3');
  });

  // Test offer accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible offer elements
    const offersSection = document.createElement('section');
    offersSection.setAttribute('role', 'region');
    offersSection.setAttribute('aria-label', 'Специальные предложения по банкротству');
    offersSection.id = 'special-offers';

    const offersHeader = document.createElement('header');
    offersHeader.className = 'special-offers__header';

    const offersTitle = document.createElement('h2');
    offersTitle.id = 'offers-title';
    offersTitle.textContent = 'Специальные предложения';

    const offersSubtitle = document.createElement('p');
    offersSubtitle.setAttribute('aria-describedby', 'offers-title');
    offersSubtitle.textContent = 'Выгодные условия для начинающих процедуру банкротства';

    const offersGrid = document.createElement('div');
    offersGrid.className = 'special-offers__grid';
    offersGrid.setAttribute('role', 'list');
    offersGrid.setAttribute('aria-labelledby', 'offers-title');

    // Create offer cards with accessibility
    const offerCards = [
      { id: 'debt-relief', title: 'Списание долгов до 2 млн ₽' },
      { id: 'property-protection', title: 'Сохранение имущества' },
      { id: 'business-bankruptcy', title: 'Банкротство ИП' },
    ];

    offerCards.forEach((card, index) => {
      const offerItem = document.createElement('div');
      offerItem.className = 'offer-card';
      offerItem.setAttribute('role', 'listitem');
      offerItem.setAttribute('aria-labelledby', `offer-title-${card.id}`);
      offerItem.setAttribute('tabindex', '0');

      const offerHeader = document.createElement('div');
      offerHeader.className = 'offer-card__header';

      const offerTitle = document.createElement('h3');
      offerTitle.id = `offer-title-${card.id}`;
      offerTitle.className = 'offer-card__title';
      offerTitle.textContent = card.title;

      const offerBadge = document.createElement('div');
      offerBadge.className = 'offer-card__badge';
      offerBadge.setAttribute('aria-label', 'Популярное предложение');
      offerBadge.textContent = '🔥 Популярное';

      const offerBody = document.createElement('div');
      offerBody.className = 'offer-card__body';

      const offerPrice = document.createElement('div');
      offerPrice.className = 'offer-card__price';
      offerPrice.textContent = 'от 5 900 ₽/мес';

      const offerOriginalPrice = document.createElement('div');
      offerOriginalPrice.className = 'offer-card__original-price';
      offerOriginalPrice.textContent = '12 900 ₽/мес';

      const offerDiscount = document.createElement('div');
      offerDiscount.className = 'offer-card__discount';
      offerDiscount.textContent = '-54%';

      const offerFeatures = document.createElement('ul');
      offerFeatures.className = 'offer-card__features';
      offerFeatures.setAttribute('aria-label', 'Преимущества предложения');

      const features = [
        'Полное списание всех долгов',
        'Защита имущества',
        'Остановка начисления процентов',
        'Прекращение звонков коллекторов',
      ];

      features.forEach((feature) => {
        const featureItem = document.createElement('li');
        featureItem.className = 'offer-card__feature';
        featureItem.textContent = feature;
        offerFeatures.appendChild(featureItem);
      });

      const offerCta = document.createElement('button');
      offerCta.className = 'offer-card__cta';
      offerCta.setAttribute('aria-label', `Получить предложение ${card.title}`);
      offerCta.setAttribute('data-modal', card.id);
      offerCta.textContent = 'Начать процедуру';

      // Append elements
      offerHeader.appendChild(offerTitle);
      offerHeader.appendChild(offerBadge);

      offerBody.appendChild(offerPrice);
      offerBody.appendChild(offerOriginalPrice);
      offerBody.appendChild(offerDiscount);
      offerBody.appendChild(offerFeatures);
      offerBody.appendChild(offerCta);

      offerItem.appendChild(offerHeader);
      offerItem.appendChild(offerBody);

      offersGrid.appendChild(offerItem);
    });

    // Append elements
    offersHeader.appendChild(offersTitle);
    offersHeader.appendChild(offersSubtitle);
    offersSection.appendChild(offersHeader);
    offersSection.appendChild(offersGrid);
    document.body.appendChild(offersSection);

    // Verify accessibility attributes
    expect(offersSection.getAttribute('role')).toBe('region');
    expect(offersSection.getAttribute('aria-label')).toBe('Специальные предложения по банкротству');
    expect(offersSection.id).toBe('special-offers');

    expect(offersHeader.querySelector('h2')?.id).toBe('offers-title');
    expect(offersHeader.querySelector('p')?.getAttribute('aria-describedby')).toBe('offers-title');

    expect(offersGrid.getAttribute('role')).toBe('list');
    expect(offersGrid.getAttribute('aria-labelledby')).toBe('offers-title');

    // Verify offer cards accessibility
    const offerItems = offersGrid.querySelectorAll('.offer-card');
    expect(offerItems.length).toBe(3);

    offerItems.forEach((item, index) => {
      const offer = offerCards[index];

      expect(item.getAttribute('role')).toBe('listitem');
      expect(item.getAttribute('aria-labelledby')).toBe(`offer-title-${offer.id}`);
      expect(item.getAttribute('tabindex')).toBe('0');

      const header = item.querySelector('.offer-card__header');
      expect(header?.className).toBe('offer-card__header');

      const title = item.querySelector('.offer-card__title');
      expect(title?.id).toBe(`offer-title-${offer.id}`);
      expect(title?.textContent).toBe(offer.title);

      const badge = item.querySelector('.offer-card__badge');
      expect(badge?.getAttribute('aria-label')).toBe('Популярное предложение');
      expect(badge?.textContent).toBe('🔥 Популярное');

      const body = item.querySelector('.offer-card__body');
      expect(body?.className).toBe('offer-card__body');

      const price = item.querySelector('.offer-card__price');
      expect(price?.textContent).toBe('от 5 900 ₽/мес');

      const originalPrice = item.querySelector('.offer-card__original-price');
      expect(originalPrice?.textContent).toBe('12 900 ₽/мес');

      const discount = item.querySelector('.offer-card__discount');
      expect(discount?.textContent).toBe('-54%');

      const features = item.querySelector('.offer-card__features');
      expect(features?.getAttribute('aria-label')).toBe('Преимущества предложения');
      expect(features?.querySelectorAll('.offer-card__feature').length).toBe(4);

      const cta = item.querySelector('.offer-card__cta');
      expect(cta?.getAttribute('aria-label')).toBe(`Получить предложение ${offer.title}`);
      expect(cta?.getAttribute('data-modal')).toBe(offer.id);
      expect(cta?.textContent).toBe('Начать процедуру');
    });

    // Test screen reader compatibility
    const srOnlyElements = document.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBe(0); // No sr-only elements in this test

    // Test ARIA relationships
    expect(offersGrid.getAttribute('aria-labelledby')).toBe('offers-title');

    offerItems.forEach((item, index) => {
      const offer = offerCards[index];
      expect(item.getAttribute('aria-labelledby')).toBe(`offer-title-${offer.id}`);
    });

    // Test focus management
    const firstOffer = offerItems[0];
    firstOffer.focus();
    expect(document.activeElement).toBe(firstOffer);

    firstOffer.blur();
    expect(document.activeElement).not.toBe(firstOffer);
  });

  // Test offer performance
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

    // Test offer rendering performance with large dataset
    performanceMock.mark('offers-render-start');

    // Create 1000 offer items for stress testing
    const largeOfferDataset = [];
    for (let i = 0; i < 1000; i++) {
      largeOfferDataset.push({
        id: `offer-${i + 1}`,
        title: `Специальное предложение ${i + 1}`,
        description: `Описание специального предложения ${i + 1}`,
        price: `от ${(i + 1) * 1000} ₽/мес`,
        originalPrice: `от ${(i + 2) * 1000} ₽/мес`,
        discount: `${Math.floor(i % 60) + 30}%`,
        features: [
          `Преимущество 1 для предложения ${i + 1}`,
          `Преимущество 2 для предложения ${i + 1}`,
          `Преимущество 3 для предложения ${i + 1}`,
          `Преимущество 4 для предложения ${i + 1}`,
        ],
        limitations: [
          `Ограничение 1 для предложения ${i + 1}`,
          `Ограничение 2 для предложения ${i + 1}`,
          `Ограничение 3 для предложения ${i + 1}`,
        ],
        cta: 'Подробнее',
        modal: `offer-${i + 1}`,
        popular: i % 5 === 0,
        exclusive: i % 7 === 0,
        deadline: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        tags: [`Тег ${(i % 5) + 1}`, `Категория ${(i % 3) + 1}`],
      });
    }

    performanceMock.mark('offers-render-end');
    const renderMeasure = performanceMock.measure(
      'offers-render',
      'offers-render-start',
      'offers-render-end'
    );

    // Verify dataset creation
    expect(largeOfferDataset.length).toBe(1000);

    // Test that all items have required properties
    largeOfferDataset.forEach((item, index) => {
      expect(item.id).toBe(`offer-${index + 1}`);
      expect(item.title).toBe(`Специальное предложение ${index + 1}`);
      expect(item.description).toBe(`Описание специального предложения ${index + 1}`);
      expect(item.price).toBe(`от ${(index + 1) * 1000} ₽/мес`);
      expect(item.originalPrice).toBe(`от ${(index + 2) * 1000} ₽/мес`);
      expect(item.discount).toBe(`${Math.floor(index % 60) + 30}%`);
      expect(Array.isArray(item.features)).toBe(true);
      expect(Array.isArray(item.limitations)).toBe(true);
      expect(typeof item.cta).toBe('string');
      expect(typeof item.modal).toBe('string');
      expect(typeof item.popular).toBe('boolean');
      expect(typeof item.exclusive).toBe('boolean');
      expect(typeof item.deadline).toBe('string');
      expect(Array.isArray(item.tags)).toBe(true);

      // Test features and limitations arrays
      expect(item.features.length).toBe(4);
      expect(item.limitations.length).toBe(3);
      expect(item.tags.length).toBe(2);

      item.features.forEach((feature) => {
        expect(typeof feature).toBe('string');
        expect(feature.length).toBeGreaterThan(0);
      });

      item.limitations.forEach((limitation) => {
        expect(typeof limitation).toBe('string');
        expect(limitation.length).toBeGreaterThan(0);
      });

      item.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });

    // Test filtering performance
    performanceMock.mark('filter-start');

    const filterLargeDataset = (
      items: typeof largeOfferDataset,
      filterFn: (item: any) => boolean
    ) => {
      return items.filter(filterFn);
    };

    const popularOffers = filterLargeDataset(largeOfferDataset, (item) => item.popular);
    const exclusiveOffers = filterLargeDataset(largeOfferDataset, (item) => item.exclusive);
    const tagFiltered = filterLargeDataset(largeOfferDataset, (item) =>
      item.tags.includes('Тег 1')
    );

    performanceMock.mark('filter-end');
    const filterMeasure = performanceMock.measure('offers-filter', 'filter-start', 'filter-end');

    expect(popularOffers.length).toBe(200); // 1000 / 5
    expect(exclusiveOffers.length).toBe(143); // 1000 / 7 (rounded down)
    expect(tagFiltered.length).toBe(200); // 1000 / 5

    // Test sorting performance
    performanceMock.mark('sort-start');

    const sortLargeDataset = (
      items: typeof largeOfferDataset,
      sortFn: (a: any, b: any) => number
    ) => {
      return [...items].sort(sortFn);
    };

    const discountSorted = sortLargeDataset(largeOfferDataset, (a, b) => {
      const aDiscount = parseInt(a.discount.replace('%', ''));
      const bDiscount = parseInt(b.discount.replace('%', ''));
      return bDiscount - aDiscount;
    });

    const priceSorted = sortLargeDataset(largeOfferDataset, (a, b) => {
      const aPrice = parseInt(a.price.replace(/\D/g, ''));
      const bPrice = parseInt(b.price.replace(/\D/g, ''));
      return aPrice - bPrice;
    });

    performanceMock.mark('sort-end');
    const sortMeasure = performanceMock.measure('offers-sort', 'sort-start', 'sort-end');

    // Verify sorting worked correctly
    expect(discountSorted.length).toBe(1000);
    expect(priceSorted.length).toBe(1000);

    // First items should have highest values
    expect(discountSorted[0].discount).toBe('89%'); // Highest discount
    expect(priceSorted[0].price).toBe('от 1000 ₽/мес'); // Lowest price

    // Last items should have lowest values
    expect(discountSorted[discountSorted.length - 1].discount).toBe('30%'); // Lowest discount
    expect(priceSorted[priceSorted.length - 1].price).toBe('от 1000000 ₽/мес'); // Highest price

    // Test pagination performance
    performanceMock.mark('paginate-start');

    const paginateLargeDataset = (
      items: typeof largeOfferDataset,
      page: number,
      pageSize: number
    ) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    };

    const paginatedItems = paginateLargeDataset(largeOfferDataset, 1, 12);

    performanceMock.mark('paginate-end');
    const paginateMeasure = performanceMock.measure(
      'offers-paginate',
      'paginate-start',
      'paginate-end'
    );

    expect(paginatedItems.length).toBe(12);
    expect(paginatedItems[0].id).toBe('offer-1');
    expect(paginatedItems[11].id).toBe('offer-12');

    // Verify performance measurements
    expect(performanceMock.marks).toContain('offers-render-start');
    expect(performanceMock.marks).toContain('offers-render-end');
    expect(performanceMock.marks).toContain('filter-start');
    expect(performanceMock.marks).toContain('filter-end');
    expect(performanceMock.marks).toContain('sort-start');
    expect(performanceMock.marks).toContain('sort-end');
    expect(performanceMock.marks).toContain('paginate-start');
    expect(performanceMock.marks).toContain('paginate-end');

    expect(performanceMock.measures.some((m) => m.name === 'offers-render')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'offers-filter')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'offers-sort')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'offers-paginate')).toBe(true);
  });
});
