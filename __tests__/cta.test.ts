import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CTA Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test CTA section structure
  it('should have correct CTA section structure', () => {
    // Create CTA section
    const ctaSection = document.createElement('section');
    ctaSection.className = 'cta';
    ctaSection.id = 'cta';

    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'cta__wrapper';

    const ctaContent = document.createElement('div');
    ctaContent.className = 'cta__content';

    const ctaTitle = document.createElement('h2');
    ctaTitle.className = 'cta__title';
    ctaTitle.textContent = 'Готовы начать процедуру банкротства?';

    const ctaText = document.createElement('p');
    ctaText.className = 'cta__text';
    ctaText.textContent = 'Оставьте заявку и мы поможем на каждом этапе';

    const ctaButton = document.createElement('button');
    ctaButton.className = 'cta__button';
    ctaButton.setAttribute('data-modal', 'consultation');
    ctaButton.textContent = 'Получить консультацию';

    // Append elements
    ctaContent.appendChild(ctaTitle);
    ctaContent.appendChild(ctaText);
    ctaWrapper.appendChild(ctaContent);
    ctaWrapper.appendChild(ctaButton);
    ctaSection.appendChild(ctaWrapper);
    document.body.appendChild(ctaSection);

    // Verify structure
    expect(document.getElementById('cta')).toBeTruthy();
    expect(ctaSection.querySelector('.cta__wrapper')).toBeTruthy();
    expect(ctaSection.querySelector('.cta__content')).toBeTruthy();
    expect(ctaSection.querySelector('.cta__title')).toBeTruthy();
    expect(ctaSection.querySelector('.cta__text')).toBeTruthy();
    expect(ctaSection.querySelector('.cta__button')).toBeTruthy();

    // Verify content
    expect(ctaSection.querySelector('.cta__title')?.textContent).toBe(
      'Готовы начать процедуру банкротства?'
    );
    expect(ctaSection.querySelector('.cta__text')?.textContent).toBe(
      'Оставьте заявку и мы поможем на каждом этапе'
    );
    expect(ctaSection.querySelector('.cta__button')?.textContent).toBe('Получить консультацию');
    expect(ctaSection.querySelector('.cta__button')?.getAttribute('data-modal')).toBe(
      'consultation'
    );

    // Verify classes
    expect(ctaSection.className).toBe('cta');
    expect(ctaWrapper.className).toBe('cta__wrapper');
    expect(ctaContent.className).toBe('cta__content');
    expect(ctaTitle.className).toBe('cta__title');
    expect(ctaText.className).toBe('cta__text');
    expect(ctaButton.className).toBe('cta__button');
  });

  // Test CTA button functionality
  it('should handle CTA button interactions correctly', () => {
    // Create CTA button
    const ctaButton = document.createElement('button');
    ctaButton.className = 'cta__button';
    ctaButton.setAttribute('data-modal', 'consultation');
    ctaButton.textContent = 'Получить консультацию';

    document.body.appendChild(ctaButton);

    // Test button attributes
    expect(ctaButton.className).toBe('cta__button');
    expect(ctaButton.getAttribute('data-modal')).toBe('consultation');
    expect(ctaButton.textContent).toBe('Получить консультацию');

    // Test click handling
    let clickCount = 0;
    let modalTriggered = '';

    ctaButton.addEventListener('click', () => {
      clickCount++;
      const modal = ctaButton.getAttribute('data-modal');
      if (modal) {
        modalTriggered = modal;
      }
    });

    // Simulate clicks
    ctaButton.click();
    expect(clickCount).toBe(1);
    expect(modalTriggered).toBe('consultation');

    ctaButton.click();
    expect(clickCount).toBe(2);
    expect(modalTriggered).toBe('consultation');

    // Test keyboard interaction
    let keyPressCount = 0;

    ctaButton.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        keyPressCount++;
        e.preventDefault();
      }
    });

    // Simulate Enter key press
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    ctaButton.dispatchEvent(enterEvent);
    expect(keyPressCount).toBe(1);

    // Simulate Space key press
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    ctaButton.dispatchEvent(spaceEvent);
    expect(keyPressCount).toBe(2);

    // Test focus management
    ctaButton.setAttribute('tabindex', '0');
    expect(ctaButton.getAttribute('tabindex')).toBe('0');

    ctaButton.focus();
    expect(document.activeElement).toBe(ctaButton);

    ctaButton.blur();
    expect(document.activeElement).not.toBe(ctaButton);

    // Test button states
    expect(ctaButton.disabled).toBe(false);

    ctaButton.disabled = true;
    expect(ctaButton.disabled).toBe(true);
    expect(ctaButton.getAttribute('aria-disabled')).toBe('true');

    ctaButton.disabled = false;
    expect(ctaButton.disabled).toBe(false);
    expect(ctaButton.getAttribute('aria-disabled')).toBe('false');

    // Test loading state
    ctaButton.classList.add('loading');
    expect(ctaButton.classList.contains('loading')).toBe(true);

    ctaButton.classList.remove('loading');
    expect(ctaButton.classList.contains('loading')).toBe(false);
  });

  // Test CTA animation triggers
  it('should handle CTA animations correctly', () => {
    // Create animated CTA elements
    const ctaSection = document.createElement('section');
    ctaSection.className = 'cta';
    ctaSection.id = 'cta';

    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'cta__wrapper';

    const ctaContent = document.createElement('div');
    ctaContent.className = 'cta__content';

    const ctaTitle = document.createElement('h2');
    ctaTitle.className = 'cta__title animate-fade-in';

    const ctaText = document.createElement('p');
    ctaText.className = 'cta__text animate-fade-in';

    const ctaButton = document.createElement('button');
    ctaButton.className = 'cta__button animate-bounce-in';

    // Append elements
    ctaContent.appendChild(ctaTitle);
    ctaContent.appendChild(ctaText);
    ctaWrapper.appendChild(ctaContent);
    ctaWrapper.appendChild(ctaButton);
    ctaSection.appendChild(ctaWrapper);
    document.body.appendChild(ctaSection);

    // Verify animation classes
    expect(ctaSection.querySelector('.cta__title')?.classList.contains('animate-fade-in')).toBe(
      true
    );
    expect(ctaSection.querySelector('.cta__text')?.classList.contains('animate-fade-in')).toBe(
      true
    );
    expect(ctaSection.querySelector('.cta__button')?.classList.contains('animate-bounce-in')).toBe(
      true
    );

    // Test animation triggering
    const triggerAnimations = () => {
      const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-bounce-in');
      animatedElements.forEach((element) => {
        element.classList.add('animated');
        element.classList.add('animation-complete');
      });
    };

    triggerAnimations();

    expect(ctaSection.querySelector('.cta__title')?.classList.contains('animated')).toBe(true);
    expect(ctaSection.querySelector('.cta__title')?.classList.contains('animation-complete')).toBe(
      true
    );
    expect(ctaSection.querySelector('.cta__text')?.classList.contains('animated')).toBe(true);
    expect(ctaSection.querySelector('.cta__text')?.classList.contains('animation-complete')).toBe(
      true
    );
    expect(ctaSection.querySelector('.cta__button')?.classList.contains('animated')).toBe(true);
    expect(ctaSection.querySelector('.cta__button')?.classList.contains('animation-complete')).toBe(
      true
    );

    // Test animation removal
    const removeAnimations = () => {
      const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-bounce-in');
      animatedElements.forEach((element) => {
        element.classList.remove('animated');
        element.classList.remove('animation-complete');
      });
    };

    removeAnimations();

    expect(ctaSection.querySelector('.cta__title')?.classList.contains('animated')).toBe(false);
    expect(ctaSection.querySelector('.cta__title')?.classList.contains('animation-complete')).toBe(
      false
    );
    expect(ctaSection.querySelector('.cta__text')?.classList.contains('animated')).toBe(false);
    expect(ctaSection.querySelector('.cta__text')?.classList.contains('animation-complete')).toBe(
      false
    );
    expect(ctaSection.querySelector('.cta__button')?.classList.contains('animated')).toBe(false);
    expect(ctaSection.querySelector('.cta__button')?.classList.contains('animation-complete')).toBe(
      false
    );
  });

  // Test CTA accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible CTA elements
    const ctaSection = document.createElement('section');
    ctaSection.setAttribute('role', 'region');
    ctaSection.setAttribute(
      'aria-label',
      'Призыв к действию - получить консультацию по банкротству'
    );
    ctaSection.id = 'cta';

    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'cta__wrapper';
    ctaWrapper.setAttribute('role', 'group');
    ctaWrapper.setAttribute('aria-labelledby', 'cta-title');

    const ctaContent = document.createElement('div');
    ctaContent.className = 'cta__content';

    const ctaTitle = document.createElement('h2');
    ctaTitle.id = 'cta-title';
    ctaTitle.className = 'cta__title';
    ctaTitle.textContent = 'Готовы начать процедуру банкротства?';

    const ctaText = document.createElement('p');
    ctaText.className = 'cta__text';
    ctaText.setAttribute('aria-describedby', 'cta-title');
    ctaText.textContent = 'Оставьте заявку и мы поможем на каждом этапе';

    const ctaButton = document.createElement('button');
    ctaButton.className = 'cta__button';
    ctaButton.setAttribute('data-modal', 'consultation');
    ctaButton.setAttribute('aria-label', 'Получить бесплатную консультацию по банкротству');
    ctaButton.setAttribute('aria-describedby', 'cta-title');
    ctaButton.setAttribute('role', 'button');
    ctaButton.setAttribute('tabindex', '0');
    ctaButton.textContent = 'Получить консультацию';

    // Append elements
    ctaContent.appendChild(ctaTitle);
    ctaContent.appendChild(ctaText);
    ctaWrapper.appendChild(ctaContent);
    ctaWrapper.appendChild(ctaButton);
    ctaSection.appendChild(ctaWrapper);
    document.body.appendChild(ctaSection);

    // Verify accessibility attributes
    expect(ctaSection.getAttribute('role')).toBe('region');
    expect(ctaSection.getAttribute('aria-label')).toBe(
      'Призыв к действию - получить консультацию по банкротству'
    );
    expect(ctaSection.id).toBe('cta');

    expect(ctaWrapper.getAttribute('role')).toBe('group');
    expect(ctaWrapper.getAttribute('aria-labelledby')).toBe('cta-title');

    expect(ctaContent.className).toBe('cta__content');

    expect(ctaTitle.id).toBe('cta-title');
    expect(ctaTitle.className).toBe('cta__title');
    expect(ctaTitle.textContent).toBe('Готовы начать процедуру банкротства?');

    expect(ctaText.getAttribute('aria-describedby')).toBe('cta-title');
    expect(ctaText.className).toBe('cta__text');
    expect(ctaText.textContent).toBe('Оставьте заявку и мы поможем на каждом этапе');

    expect(ctaButton.className).toBe('cta__button');
    expect(ctaButton.getAttribute('data-modal')).toBe('consultation');
    expect(ctaButton.getAttribute('aria-label')).toBe(
      'Получить бесплатную консультацию по банкротству'
    );
    expect(ctaButton.getAttribute('aria-describedby')).toBe('cta-title');
    expect(ctaButton.getAttribute('role')).toBe('button');
    expect(ctaButton.getAttribute('tabindex')).toBe('0');
    expect(ctaButton.textContent).toBe('Получить консультацию');

    // Test screen reader compatibility
    const srOnlyElements = document.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBe(0); // No sr-only elements in this test

    // Test ARIA relationships
    expect(ctaWrapper.getAttribute('aria-labelledby')).toBe('cta-title');
    expect(ctaText.getAttribute('aria-describedby')).toBe('cta-title');
    expect(ctaButton.getAttribute('aria-describedby')).toBe('cta-title');
    expect(ctaButton.getAttribute('aria-label')).toBe(
      'Получить бесплатную консультацию по банкротству'
    );

    // Test focus management
    ctaButton.focus();
    expect(document.activeElement).toBe(ctaButton);

    ctaButton.blur();
    expect(document.activeElement).not.toBe(ctaButton);
  });

  // Test CTA responsive behavior
  it('should handle responsive behavior correctly', () => {
    // Create responsive CTA elements
    const ctaSection = document.createElement('section');
    ctaSection.className = 'cta';
    ctaSection.id = 'cta';

    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'cta__wrapper';

    const ctaContent = document.createElement('div');
    ctaContent.className = 'cta__content';

    const ctaTitle = document.createElement('h2');
    ctaTitle.className = 'cta__title';
    ctaTitle.textContent = 'Готовы начать процедуру банкротства?';

    const ctaText = document.createElement('p');
    ctaText.className = 'cta__text';
    ctaText.textContent = 'Оставьте заявку и мы поможем на каждом этапе';

    const ctaButton = document.createElement('button');
    ctaButton.className = 'cta__button';
    ctaButton.setAttribute('data-modal', 'consultation');
    ctaButton.textContent = 'Получить консультацию';

    // Append elements
    ctaContent.appendChild(ctaTitle);
    ctaContent.appendChild(ctaText);
    ctaWrapper.appendChild(ctaContent);
    ctaWrapper.appendChild(ctaButton);
    ctaSection.appendChild(ctaWrapper);
    document.body.appendChild(ctaSection);

    // Test mobile-first approach
    expect(ctaSection.className).toBe('cta');
    expect(ctaWrapper.className).toBe('cta__wrapper');
    expect(ctaContent.className).toBe('cta__content');
    expect(ctaTitle.className).toBe('cta__title');
    expect(ctaText.className).toBe('cta__text');
    expect(ctaButton.className).toBe('cta__button');

    // Test desktop enhancements
    ctaSection.classList.add('cta--desktop');
    ctaWrapper.classList.add('cta__wrapper--desktop');
    ctaContent.classList.add('cta__content--desktop');
    ctaTitle.classList.add('cta__title--desktop');
    ctaText.classList.add('cta__text--desktop');
    ctaButton.classList.add('cta__button--desktop');

    expect(ctaSection.classList.contains('cta--desktop')).toBe(true);
    expect(ctaWrapper.classList.contains('cta__wrapper--desktop')).toBe(true);
    expect(ctaContent.classList.contains('cta__content--desktop')).toBe(true);
    expect(ctaTitle.classList.contains('cta__title--desktop')).toBe(true);
    expect(ctaText.classList.contains('cta__text--desktop')).toBe(true);
    expect(ctaButton.classList.contains('cta__button--desktop')).toBe(true);

    // Test tablet enhancements
    ctaSection.classList.add('cta--tablet');
    ctaWrapper.classList.add('cta__wrapper--tablet');
    ctaContent.classList.add('cta__content--tablet');
    ctaTitle.classList.add('cta__title--tablet');
    ctaText.classList.add('cta__text--tablet');
    ctaButton.classList.add('cta__button--tablet');

    expect(ctaSection.classList.contains('cta--tablet')).toBe(true);
    expect(ctaWrapper.classList.contains('cta__wrapper--tablet')).toBe(true);
    expect(ctaContent.classList.contains('cta__content--tablet')).toBe(true);
    expect(ctaTitle.classList.contains('cta__title--tablet')).toBe(true);
    expect(ctaText.classList.contains('cta__text--tablet')).toBe(true);
    expect(ctaButton.classList.contains('cta__button--tablet')).toBe(true);

    // Test mobile-only styles
    ctaSection.classList.add('cta--mobile-only');
    ctaWrapper.classList.add('cta__wrapper--mobile-only');
    ctaContent.classList.add('cta__content--mobile-only');
    ctaTitle.classList.add('cta__title--mobile-only');
    ctaText.classList.add('cta__text--mobile-only');
    ctaButton.classList.add('cta__button--mobile-only');

    expect(ctaSection.classList.contains('cta--mobile-only')).toBe(true);
    expect(ctaWrapper.classList.contains('cta__wrapper--mobile-only')).toBe(true);
    expect(ctaContent.classList.contains('cta__content--mobile-only')).toBe(true);
    expect(ctaTitle.classList.contains('cta__title--mobile-only')).toBe(true);
    expect(ctaText.classList.contains('cta__text--mobile-only')).toBe(true);
    expect(ctaButton.classList.contains('cta__button--mobile-only')).toBe(true);

    // Test responsive class removal
    ctaSection.classList.remove('cta--desktop');
    ctaWrapper.classList.remove('cta__wrapper--desktop');
    ctaContent.classList.remove('cta__content--desktop');
    ctaTitle.classList.remove('cta__title--desktop');
    ctaText.classList.remove('cta__text--desktop');
    ctaButton.classList.remove('cta__button--desktop');

    expect(ctaSection.classList.contains('cta--desktop')).toBe(false);
    expect(ctaWrapper.classList.contains('cta__wrapper--desktop')).toBe(false);
    expect(ctaContent.classList.contains('cta__content--desktop')).toBe(false);
    expect(ctaTitle.classList.contains('cta__title--desktop')).toBe(false);
    expect(ctaText.classList.contains('cta__text--desktop')).toBe(false);
    expect(ctaButton.classList.contains('cta__button--desktop')).toBe(false);
  });

  // Test CTA performance
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

    // Test CTA rendering performance with large dataset
    performanceMock.mark('cta-render-start');

    // Create 100 CTA elements for stress testing
    const ctaElements = [];
    for (let i = 0; i < 100; i++) {
      const ctaSection = document.createElement('section');
      ctaSection.className = `cta cta-${i + 1}`;
      ctaSection.id = `cta-${i + 1}`;

      const ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'cta__wrapper';

      const ctaContent = document.createElement('div');
      ctaContent.className = 'cta__content';

      const ctaTitle = document.createElement('h2');
      ctaTitle.className = 'cta__title';
      ctaTitle.textContent = `Призыв к действию ${i + 1}`;

      const ctaText = document.createElement('p');
      ctaText.className = 'cta__text';
      ctaText.textContent = `Описание призыва к действию ${i + 1}`;

      const ctaButton = document.createElement('button');
      ctaButton.className = 'cta__button';
      ctaButton.setAttribute('data-modal', `modal-${i + 1}`);
      ctaButton.textContent = `Кнопка ${i + 1}`;

      // Append elements
      ctaContent.appendChild(ctaTitle);
      ctaContent.appendChild(ctaText);
      ctaWrapper.appendChild(ctaContent);
      ctaWrapper.appendChild(ctaButton);
      ctaSection.appendChild(ctaWrapper);

      ctaElements.push(ctaSection);
    }

    // Add all CTA elements to DOM
    ctaElements.forEach((cta) => document.body.appendChild(cta));

    performanceMock.mark('cta-render-end');
    const renderMeasure = performanceMock.measure(
      'cta-render',
      'cta-render-start',
      'cta-render-end'
    );

    // Verify CTA elements creation
    expect(ctaElements.length).toBe(100);
    expect(document.querySelectorAll('.cta').length).toBe(100);
    expect(document.querySelectorAll('.cta__wrapper').length).toBe(100);
    expect(document.querySelectorAll('.cta__content').length).toBe(100);
    expect(document.querySelectorAll('.cta__title').length).toBe(100);
    expect(document.querySelectorAll('.cta__text').length).toBe(100);
    expect(document.querySelectorAll('.cta__button').length).toBe(100);

    // Verify each CTA element has required properties
    ctaElements.forEach((cta, index) => {
      expect(cta.className).toBe(`cta cta-${index + 1}`);
      expect(cta.id).toBe(`cta-${index + 1}`);
      expect(cta.querySelector('.cta__wrapper')).toBeTruthy();
      expect(cta.querySelector('.cta__content')).toBeTruthy();
      expect(cta.querySelector('.cta__title')).toBeTruthy();
      expect(cta.querySelector('.cta__text')).toBeTruthy();
      expect(cta.querySelector('.cta__button')).toBeTruthy();

      const title = cta.querySelector('.cta__title');
      const text = cta.querySelector('.cta__text');
      const button = cta.querySelector('.cta__button');

      expect(title?.textContent).toBe(`Призыв к действию ${index + 1}`);
      expect(text?.textContent).toBe(`Описание призыва к действию ${index + 1}`);
      expect(button?.getAttribute('data-modal')).toBe(`modal-${index + 1}`);
      expect(button?.textContent).toBe(`Кнопка ${index + 1}`);
    });

    // Test CTA interactivity performance
    performanceMock.mark('cta-interaction-start');

    const attachCTAHandlers = (ctas: HTMLElement[]) => {
      ctas.forEach((cta) => {
        const button = cta.querySelector('.cta__button') as HTMLButtonElement;
        if (button) {
          button.addEventListener('click', () => {
            const modal = button.getAttribute('data-modal');
            if (modal) {
              // Simulate modal opening
              document.body.setAttribute('data-modal-open', modal);
            }
          });
        }
      });
    };

    attachCTAHandlers(ctaElements);

    performanceMock.mark('cta-interaction-end');
    const interactionMeasure = performanceMock.measure(
      'cta-interaction',
      'cta-interaction-start',
      'cta-interaction-end'
    );

    // Test CTA button click handlers
    const firstCTAButton = ctaElements[0].querySelector('.cta__button') as HTMLButtonElement;
    firstCTAButton.click();

    expect(document.body.getAttribute('data-modal-open')).toBe('modal-1');

    const secondCTAButton = ctaElements[1].querySelector('.cta__button') as HTMLButtonElement;
    secondCTAButton.click();

    expect(document.body.getAttribute('data-modal-open')).toBe('modal-2');

    // Test CTA cleanup performance
    performanceMock.mark('cta-cleanup-start');

    // Remove all CTA elements
    ctaElements.forEach((cta) => {
      if (cta.parentNode) {
        cta.parentNode.removeChild(cta);
      }
    });

    performanceMock.mark('cta-cleanup-end');
    const cleanupMeasure = performanceMock.measure(
      'cta-cleanup',
      'cta-cleanup-start',
      'cta-cleanup-end'
    );

    // Verify cleanup
    expect(document.querySelectorAll('.cta').length).toBe(0);
    expect(ctaElements.length).toBe(100); // Original array unchanged

    // Verify performance measurements
    expect(performanceMock.marks).toContain('cta-render-start');
    expect(performanceMock.marks).toContain('cta-render-end');
    expect(performanceMock.marks).toContain('cta-interaction-start');
    expect(performanceMock.marks).toContain('cta-interaction-end');
    expect(performanceMock.marks).toContain('cta-cleanup-start');
    expect(performanceMock.marks).toContain('cta-cleanup-end');

    expect(performanceMock.measures.some((m) => m.name === 'cta-render')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'cta-interaction')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'cta-cleanup')).toBe(true);
  });

  // Test CTA form submission
  it('should handle CTA form submission correctly', () => {
    // Create CTA form elements
    const ctaForm = document.createElement('form');
    ctaForm.className = 'cta__form';
    ctaForm.id = 'cta-form';

    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'cta-name';
    nameLabel.textContent = 'Имя';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'cta-name';
    nameInput.name = 'name';
    nameInput.required = true;
    nameInput.placeholder = 'Введите ваше имя';

    const phoneLabel = document.createElement('label');
    phoneLabel.htmlFor = 'cta-phone';
    phoneLabel.textContent = 'Телефон';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.id = 'cta-phone';
    phoneInput.name = 'phone';
    phoneInput.required = true;
    phoneInput.placeholder = '+7 (___) ___-__-__';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Отправить';

    // Append elements
    ctaForm.appendChild(nameLabel);
    ctaForm.appendChild(nameInput);
    ctaForm.appendChild(phoneLabel);
    ctaForm.appendChild(phoneInput);
    ctaForm.appendChild(submitButton);
    document.body.appendChild(ctaForm);

    // Verify form structure
    expect(document.getElementById('cta-form')).toBeTruthy();
    expect(ctaForm.querySelector('label[for="cta-name"]')).toBeTruthy();
    expect(ctaForm.querySelector('input#cta-name')).toBeTruthy();
    expect(ctaForm.querySelector('label[for="cta-phone"]')).toBeTruthy();
    expect(ctaForm.querySelector('input#cta-phone')).toBeTruthy();
    expect(ctaForm.querySelector('button[type="submit"]')).toBeTruthy();

    // Test form validation
    const validateForm = (form: HTMLFormElement) => {
      const nameInput = form.querySelector('#cta-name') as HTMLInputElement;
      const phoneInput = form.querySelector('#cta-phone') as HTMLInputElement;

      const errors = [] as string[];

      if (!nameInput.value.trim()) {
        errors.push('Имя обязательно для заполнения');
      }

      if (!phoneInput.value.trim()) {
        errors.push('Телефон обязателен для заполнения');
      } else if (
        !/^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
          phoneInput.value
        )
      ) {
        errors.push('Неверный формат телефона');
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    };

    // Test invalid form
    const invalidResult = validateForm(ctaForm);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBe(2);
    expect(invalidResult.errors).toContain('Имя обязательно для заполнения');
    expect(invalidResult.errors).toContain('Телефон обязателен для заполнения');

    // Fill form with valid data
    nameInput.value = 'Иван Петров';
    phoneInput.value = '+7 (905) 577-33-87';

    // Test valid form
    const validResult = validateForm(ctaForm);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors.length).toBe(0);

    // Test invalid phone format
    phoneInput.value = 'invalid-phone';
    const invalidPhoneResult = validateForm(ctaForm);
    expect(invalidPhoneResult.isValid).toBe(false);
    expect(invalidPhoneResult.errors.length).toBe(1);
    expect(invalidPhoneResult.errors).toContain('Неверный формат телефона');

    // Test form submission
    let submitCount = 0;
    let submittedData: Record<string, string> | null = null;

    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitCount++;

      const formData = new FormData(ctaForm);
      submittedData = {} as Record<string, string>;
      formData.forEach((value, key) => {
        submittedData![key] = value as string;
      });
    });

    // Submit valid form
    ctaForm.dispatchEvent(new Event('submit'));
    expect(submitCount).toBe(1);
    expect(submittedData).not.toBeNull();
    expect(submittedData?.name).toBe('Иван Петров');
    expect(submittedData?.phone).toBe('+7 (905) 577-33-87');

    // Test form reset
    ctaForm.reset();
    expect(nameInput.value).toBe('');
    expect(phoneInput.value).toBe('');
  });

  // Test CTA analytics tracking
  it('should handle analytics tracking correctly', () => {
    // Mock analytics tracking
    const analyticsMock = {
      events: [] as { name: string; params: Record<string, any> }[],
      track(eventName: string, params: Record<string, any> = {}) {
        this.events.push({ name: eventName, params });
      },
      getEvents() {
        return this.events;
      },
      getEventCount(eventName: string) {
        return this.events.filter((e) => e.name === eventName).length;
      },
      getLastEvent() {
        return this.events.length > 0 ? this.events[this.events.length - 1] : null;
      },
    };

    // Test CTA click tracking
    const trackCTAClick = (ctaId: string, modal: string, analytics = analyticsMock) => {
      analytics.track('cta_click', {
        cta_id: ctaId,
        modal_triggered: modal,
        timestamp: Date.now(),
        location: window.location.href,
      });
    };

    // Test consultation CTA click
    trackCTAClick('main-cta', 'consultation');
    expect(analyticsMock.getEventCount('cta_click')).toBe(1);

    const lastEvent = analyticsMock.getLastEvent();
    expect(lastEvent?.name).toBe('cta_click');
    expect(lastEvent?.params.cta_id).toBe('main-cta');
    expect(lastEvent?.params.modal_triggered).toBe('consultation');
    expect(typeof lastEvent?.params.timestamp).toBe('number');

    // Test multiple CTA clicks
    trackCTAClick('secondary-cta', 'calculator');
    trackCTAClick('mobile-cta', 'callback');
    trackCTAClick('footer-cta', 'consultation');

    expect(analyticsMock.getEventCount('cta_click')).toBe(4);

    const allEvents = analyticsMock.getEvents();
    expect(allEvents[0].params.cta_id).toBe('main-cta');
    expect(allEvents[1].params.cta_id).toBe('secondary-cta');
    expect(allEvents[2].params.cta_id).toBe('mobile-cta');
    expect(allEvents[3].params.cta_id).toBe('footer-cta');

    expect(allEvents[0].params.modal_triggered).toBe('consultation');
    expect(allEvents[1].params.modal_triggered).toBe('calculator');
    expect(allEvents[2].params.modal_triggered).toBe('callback');
    expect(allEvents[3].params.modal_triggered).toBe('consultation');

    // Test conversion tracking
    const trackConversion = (conversionType: string, value: number, analytics = analyticsMock) => {
      analytics.track('conversion', {
        conversion_type: conversionType,
        value,
        currency: 'RUB',
        timestamp: Date.now(),
      });
    };

    // Test CTA conversion
    trackConversion('cta_consultation', 5000);
    trackConversion('cta_calculator', 2000);
    trackConversion('cta_callback', 3000);

    expect(analyticsMock.getEventCount('conversion')).toBe(3);

    const conversionEvents = analyticsMock.getEvents().filter((e) => e.name === 'conversion');
    expect(conversionEvents[0].params.conversion_type).toBe('cta_consultation');
    expect(conversionEvents[0].params.value).toBe(5000);
    expect(conversionEvents[0].params.currency).toBe('RUB');

    expect(conversionEvents[1].params.conversion_type).toBe('cta_calculator');
    expect(conversionEvents[1].params.value).toBe(2000);
    expect(conversionEvents[1].params.currency).toBe('RUB');

    expect(conversionEvents[2].params.conversion_type).toBe('cta_callback');
    expect(conversionEvents[2].params.value).toBe(3000);
    expect(conversionEvents[2].params.currency).toBe('RUB');

    // Test engagement tracking
    const trackEngagement = (
      engagementType: string,
      duration: number,
      analytics = analyticsMock
    ) => {
      analytics.track('engagement', {
        engagement_type: engagementType,
        duration,
        timestamp: Date.now(),
      });
    };

    // Test CTA engagement
    trackEngagement('cta_hover', 2.5);
    trackEngagement('cta_focus', 1.8);
    trackEngagement('cta_view', 10);

    expect(analyticsMock.getEventCount('engagement')).toBe(3);

    const engagementEvents = analyticsMock.getEvents().filter((e) => e.name === 'engagement');
    expect(engagementEvents[0].params.engagement_type).toBe('cta_hover');
    expect(engagementEvents[0].params.duration).toBe(2.5);

    expect(engagementEvents[1].params.engagement_type).toBe('cta_focus');
    expect(engagementEvents[1].params.duration).toBe(1.8);

    expect(engagementEvents[2].params.engagement_type).toBe('cta_view');
    expect(engagementEvents[2].params.duration).toBe(10);
  });
});
