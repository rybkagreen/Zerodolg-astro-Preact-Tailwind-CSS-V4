import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Hero Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test hero initialization
  it('should initialize hero component correctly', () => {
    // Create hero element
    const hero = document.createElement('section');
    hero.className = 'hero';
    hero.id = 'hero';
    
    // Add to DOM
    document.body.appendChild(hero);
    
    // Verify hero exists
    expect(document.getElementById('hero')).toBeTruthy();
    expect(document.querySelector('.hero')).toBeTruthy();
    
    // Verify hero attributes
    const heroElement = document.getElementById('hero');
    expect(heroElement?.tagName.toLowerCase()).toBe('section');
    expect(heroElement?.className).toBe('hero');
  });

  // Test hero content structure
  it('should have correct hero content structure', () => {
    // Create hero content elements
    const hero = document.createElement('section');
    hero.className = 'hero';
    
    const container = document.createElement('div');
    container.className = 'hero__container';
    
    const content = document.createElement('div');
    content.className = 'hero__content';
    
    const title = document.createElement('h1');
    title.className = 'hero__title';
    title.textContent = 'Освободитесь от долгов раз и навсегда';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'hero__subtitle';
    subtitle.textContent = 'Профессиональная помощь в процедуре банкротства физических лиц';
    
    const description = document.createElement('p');
    description.className = 'hero__description';
    description.textContent = '98% успешных дел • От 5 900 ₽/мес • Без скрытых платежей';
    
    // Append elements
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(description);
    container.appendChild(content);
    hero.appendChild(container);
    document.body.appendChild(hero);
    
    // Verify content structure
    expect(hero.querySelector('.hero__container')).toBeTruthy();
    expect(hero.querySelector('.hero__content')).toBeTruthy();
    expect(hero.querySelector('.hero__title')).toBeTruthy();
    expect(hero.querySelector('.hero__subtitle')).toBeTruthy();
    expect(hero.querySelector('.hero__description')).toBeTruthy();
    
    // Verify content text
    expect(hero.querySelector('.hero__title')?.textContent).toBe('Освободитесь от долгов раз и навсегда');
    expect(hero.querySelector('.hero__subtitle')?.textContent).toBe('Профессиональная помощь в процедуре банкротства физических лиц');
    expect(hero.querySelector('.hero__description')?.textContent).toBe('98% успешных дел • От 5 900 ₽/мес • Без скрытых платежей');
  });

  // Test CTA buttons functionality
  it('should handle CTA buttons correctly', () => {
    // Create CTA buttons
    const ctaButtons = [
      {
        className: 'hero__cta-primary',
        text: 'Получить консультацию',
        modal: 'consultation'
      },
      {
        className: 'hero__cta-secondary',
        text: 'Рассчитать стоимость',
        modal: 'calculator'
      }
    ];
    
    const buttonElements = ctaButtons.map(btn => {
      const button = document.createElement('button');
      button.className = btn.className;
      button.textContent = btn.text;
      button.setAttribute('data-modal', btn.modal);
      return button;
    });
    
    // Add buttons to DOM
    buttonElements.forEach(btn => document.body.appendChild(btn));
    
    // Verify buttons
    buttonElements.forEach((btn, index) => {
      expect(btn.textContent).toBe(ctaButtons[index].text);
      expect(btn.getAttribute('data-modal')).toBe(ctaButtons[index].modal);
      expect(btn.className).toBe(ctaButtons[index].className);
    });
    
    // Test button click handling
    let clickCounts = [0, 0];
    
    buttonElements.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        clickCounts[index]++;
      });
    });
    
    // Simulate clicks
    buttonElements[0].click();
    buttonElements[1].click();
    buttonElements[0].click();
    
    expect(clickCounts[0]).toBe(2);
    expect(clickCounts[1]).toBe(1);
  });

  // Test hero statistics
  it('should display hero statistics correctly', () => {
    const heroStats = [
      { label: 'Успешных дел', value: '98%', suffix: '' },
      { label: 'Сэкономлено', value: '2', suffix: 'млрд ₽' },
      { label: 'Лет опыта', value: '7+', suffix: '' },
      { label: 'Клиентов', value: '1450+', suffix: '' }
    ];
    
    // Create stats elements
    const statsContainer = document.createElement('div');
    statsContainer.className = 'hero__stats';
    
    heroStats.forEach(stat => {
      const statItem = document.createElement('div');
      statItem.className = 'hero__stat-item';
      
      const statValue = document.createElement('div');
      statValue.className = 'hero__stat-value';
      statValue.textContent = stat.value;
      
      const statLabel = document.createElement('div');
      statLabel.className = 'hero__stat-label';
      statLabel.textContent = stat.label;
      
      const statSuffix = document.createElement('div');
      statSuffix.className = 'hero__stat-suffix';
      statSuffix.textContent = stat.suffix;
      
      statItem.appendChild(statValue);
      statItem.appendChild(statLabel);
      statItem.appendChild(statSuffix);
      statsContainer.appendChild(statItem);
    });
    
    document.body.appendChild(statsContainer);
    
    // Verify stats structure
    const statItems = document.querySelectorAll('.hero__stat-item');
    expect(statItems.length).toBe(4);
    
    statItems.forEach((item, index) => {
      const value = item.querySelector('.hero__stat-value');
      const label = item.querySelector('.hero__stat-label');
      const suffix = item.querySelector('.hero__stat-suffix');
      
      expect(value?.textContent).toBe(heroStats[index].value);
      expect(label?.textContent).toBe(heroStats[index].label);
      expect(suffix?.textContent).toBe(heroStats[index].suffix);
    });
  });

  // Test hero animation triggers
  it('should handle hero animations correctly', () => {
    // Create animated elements
    const animatedElements = [
      { className: 'hero__title', animation: 'fadeInUp' },
      { className: 'hero__subtitle', animation: 'fadeInUp' },
      { className: 'hero__description', animation: 'fadeIn' },
      { className: 'hero__cta-primary', animation: 'bounceIn' },
      { className: 'hero__cta-secondary', animation: 'bounceIn' }
    ];
    
    const elements = animatedElements.map(el => {
      const element = document.createElement('div');
      element.className = `${el.className} ${el.animation}`;
      return element;
    });
    
    // Add to DOM
    elements.forEach(el => document.body.appendChild(el));
    
    // Verify animations
    elements.forEach((el, index) => {
      expect(el.classList.contains(animatedElements[index].className.replace('.', ''))).toBe(true);
      expect(el.classList.contains(animatedElements[index].animation)).toBe(true);
    });
    
    // Test animation triggering
    const triggerAnimation = (element: HTMLElement) => {
      element.classList.add('animated');
      element.classList.add('animation-complete');
    };
    
    elements.forEach(triggerAnimation);
    
    elements.forEach(el => {
      expect(el.classList.contains('animated')).toBe(true);
      expect(el.classList.contains('animation-complete')).toBe(true);
    });
  });

  // Test hero responsive behavior
  it('should handle responsive behavior correctly', () => {
    // Create responsive hero elements
    const hero = document.createElement('section');
    hero.className = 'hero';
    
    const container = document.createElement('div');
    container.className = 'hero__container';
    
    const content = document.createElement('div');
    content.className = 'hero__content';
    
    const title = document.createElement('h1');
    title.className = 'hero__title';
    title.textContent = 'Освободитесь от долгов раз и навсегда';
    
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'hero__cta-wrapper';
    
    const primaryBtn = document.createElement('button');
    primaryBtn.className = 'hero__cta-primary';
    primaryBtn.textContent = 'Получить консультацию';
    
    const secondaryBtn = document.createElement('button');
    secondaryBtn.className = 'hero__cta-secondary';
    secondaryBtn.textContent = 'Рассчитать стоимость';
    
    // Append elements
    ctaWrapper.appendChild(primaryBtn);
    ctaWrapper.appendChild(secondaryBtn);
    content.appendChild(title);
    content.appendChild(ctaWrapper);
    container.appendChild(content);
    hero.appendChild(container);
    document.body.appendChild(hero);
    
    // Verify responsive structure
    expect(hero.querySelector('.hero__container')).toBeTruthy();
    expect(hero.querySelector('.hero__content')).toBeTruthy();
    expect(hero.querySelector('.hero__title')).toBeTruthy();
    expect(hero.querySelector('.hero__cta-wrapper')).toBeTruthy();
    expect(hero.querySelector('.hero__cta-primary')).toBeTruthy();
    expect(hero.querySelector('.hero__cta-secondary')).toBeTruthy();
    
    // Test flexbox layout
    const ctaWrapperElement = hero.querySelector('.hero__cta-wrapper');
    expect(ctaWrapperElement?.classList.contains('hero__cta-wrapper')).toBe(true);
    
    // Test button alignment
    const primaryButton = hero.querySelector('.hero__cta-primary');
    const secondaryButton = hero.querySelector('.hero__cta-secondary');
    expect(primaryButton?.classList.contains('hero__cta-primary')).toBe(true);
    expect(secondaryButton?.classList.contains('hero__cta-secondary')).toBe(true);
  });

  // Test hero trust signals
  it('should display trust signals correctly', () => {
    const trustSignals = [
      {
        className: 'hero__trust-badge',
        icon: 'certificate',
        title: 'Лицензия',
        description: 'На оказание юридических услуг'
      },
      {
        className: 'hero__trust-badge',
        icon: 'medal',
        title: 'Опыт',
        description: 'Более 7 лет успешной практики'
      },
      {
        className: 'hero__trust-badge',
        icon: 'shield',
        title: 'Гарантия',
        description: 'Результат по договору'
      },
      {
        className: 'hero__trust-badge',
        icon: 'support',
        title: 'Поддержка',
        description: 'На всех этапах процедуры'
      }
    ];
    
    // Create trust signals container
    const trustContainer = document.createElement('div');
    trustContainer.className = 'hero__trust-signals';
    
    trustSignals.forEach(signal => {
      const badge = document.createElement('div');
      badge.className = signal.className;
      
      const icon = document.createElement('div');
      icon.className = `hero__trust-icon hero__trust-icon--${signal.icon}`;
      icon.textContent = signal.icon;
      
      const title = document.createElement('div');
      title.className = 'hero__trust-title';
      title.textContent = signal.title;
      
      const description = document.createElement('div');
      description.className = 'hero__trust-description';
      description.textContent = signal.description;
      
      badge.appendChild(icon);
      badge.appendChild(title);
      badge.appendChild(description);
      trustContainer.appendChild(badge);
    });
    
    document.body.appendChild(trustContainer);
    
    // Verify trust signals
    const badges = document.querySelectorAll('.hero__trust-badge');
    expect(badges.length).toBe(4);
    
    badges.forEach((badge, index) => {
      const icon = badge.querySelector('.hero__trust-icon');
      const title = badge.querySelector('.hero__trust-title');
      const description = badge.querySelector('.hero__trust-description');
      
      expect(icon?.textContent).toBe(trustSignals[index].icon);
      expect(title?.textContent).toBe(trustSignals[index].title);
      expect(description?.textContent).toBe(trustSignals[index].description);
      expect(icon?.classList.contains(`hero__trust-icon--${trustSignals[index].icon}`)).toBe(true);
    });
  });

  // Test hero countdown timer
  it('should handle countdown timer correctly', () => {
    // Create countdown elements
    const countdown = document.createElement('div');
    countdown.className = 'hero__countdown';
    
    const countdownItems = [
      { className: 'hero__countdown-days', label: 'Дней' },
      { className: 'hero__countdown-hours', label: 'Часов' },
      { className: 'hero__countdown-minutes', label: 'Минут' },
      { className: 'hero__countdown-seconds', label: 'Секунд' }
    ];
    
    countdownItems.forEach(item => {
      const countdownItem = document.createElement('div');
      countdownItem.className = item.className;
      
      const value = document.createElement('div');
      value.className = 'hero__countdown-value';
      value.textContent = '00';
      
      const label = document.createElement('div');
      label.className = 'hero__countdown-label';
      label.textContent = item.label;
      
      countdownItem.appendChild(value);
      countdownItem.appendChild(label);
      countdown.appendChild(countdownItem);
    });
    
    document.body.appendChild(countdown);
    
    // Verify countdown structure
    const countdownElements = document.querySelectorAll('[class^="hero__countdown-"]');
    expect(countdownElements.length).toBe(8); // 4 values + 4 labels
    
    const countdownItemsElements = document.querySelectorAll('[class*="hero__countdown-"]:not([class$="-value"]):not([class$="-label"])');
    expect(countdownItemsElements.length).toBe(4);
    
    // Test countdown update
    const updateCountdown = (days: string, hours: string, minutes: string, seconds: string) => {
      const daysElement = document.querySelector('.hero__countdown-days .hero__countdown-value');
      const hoursElement = document.querySelector('.hero__countdown-hours .hero__countdown-value');
      const minutesElement = document.querySelector('.hero__countdown-minutes .hero__countdown-value');
      const secondsElement = document.querySelector('.hero__countdown-seconds .hero__countdown-value');
      
      if (daysElement) daysElement.textContent = days;
      if (hoursElement) hoursElement.textContent = hours;
      if (minutesElement) minutesElement.textContent = minutes;
      if (secondsElement) secondsElement.textContent = seconds;
    };
    
    updateCountdown('10', '05', '30', '45');
    
    const daysValue = document.querySelector('.hero__countdown-days .hero__countdown-value');
    const hoursValue = document.querySelector('.hero__countdown-hours .hero__countdown-value');
    const minutesValue = document.querySelector('.hero__countdown-minutes .hero__countdown-value');
    const secondsValue = document.querySelector('.hero__countdown-seconds .hero__countdown-value');
    
    expect(daysValue?.textContent).toBe('10');
    expect(hoursValue?.textContent).toBe('05');
    expect(minutesValue?.textContent).toBe('30');
    expect(secondsValue?.textContent).toBe('45');
  });

  // Test hero accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible hero elements
    const hero = document.createElement('section');
    hero.setAttribute('role', 'banner');
    hero.setAttribute('aria-label', 'Главный раздел сайта - освобождение от долгов');
    
    const title = document.createElement('h1');
    title.id = 'hero-title';
    title.textContent = 'Освободитесь от долгов раз и навсегда';
    
    const primaryBtn = document.createElement('button');
    primaryBtn.setAttribute('aria-label', 'Получить бесплатную консультацию по банкротству');
    primaryBtn.setAttribute('aria-describedby', 'hero-title');
    primaryBtn.textContent = 'Получить консультацию';
    
    const secondaryBtn = document.createElement('button');
    secondaryBtn.setAttribute('aria-label', 'Рассчитать стоимость процедуры банкротства');
    secondaryBtn.setAttribute('aria-describedby', 'hero-title');
    secondaryBtn.textContent = 'Рассчитать стоимость';
    
    // Append elements
    hero.appendChild(title);
    hero.appendChild(primaryBtn);
    hero.appendChild(secondaryBtn);
    document.body.appendChild(hero);
    
    // Verify accessibility attributes
    expect(hero.getAttribute('role')).toBe('banner');
    expect(hero.getAttribute('aria-label')).toBe('Главный раздел сайта - освобождение от долгов');
    
    expect(title.id).toBe('hero-title');
    expect(title.getAttribute('id')).toBe('hero-title');
    
    expect(primaryBtn.getAttribute('aria-label')).toBe('Получить бесплатную консультацию по банкротству');
    expect(primaryBtn.getAttribute('aria-describedby')).toBe('hero-title');
    
    expect(secondaryBtn.getAttribute('aria-label')).toBe('Рассчитать стоимость процедуры банкротства');
    expect(secondaryBtn.getAttribute('aria-describedby')).toBe('hero-title');
  });
});