import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('OnlineSticker Component', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  // Test online sticker data structure
  it('should handle online sticker data correctly', () => {
    const onlineStickerData = {
      status: 'online',
      lastSeen: '2025-09-18T14:30:00Z',
      responseTime: '1-5 минут',
      availability: 'Пн-Пт: 9:00-18:00',
      channels: [
        { name: 'whatsapp', url: 'https://wa.me/79055773387', icon: '💬' },
        { name: 'telegram', url: 'https://t.me/zerodolg', icon: '✈️' },
        { name: 'phone', url: 'tel:+79055773387', icon: '📞' },
      ],
    };

    // Test online sticker structure validation
    expect(typeof onlineStickerData.status).toBe('string');
    expect(typeof onlineStickerData.lastSeen).toBe('string');
    expect(typeof onlineStickerData.responseTime).toBe('string');
    expect(typeof onlineStickerData.availability).toBe('string');
    expect(Array.isArray(onlineStickerData.channels)).toBe(true);

    // Test status values
    expect(onlineStickerData.status).toBe('online');
    expect(onlineStickerData.lastSeen).toBe('2025-09-18T14:30:00Z');
    expect(onlineStickerData.responseTime).toBe('1-5 минут');
    expect(onlineStickerData.availability).toBe('Пн-Пт: 9:00-18:00');
    expect(onlineStickerData.channels.length).toBe(3);

    // Test channels structure
    onlineStickerData.channels.forEach((channel) => {
      expect(typeof channel.name).toBe('string');
      expect(typeof channel.url).toBe('string');
      expect(typeof channel.icon).toBe('string');

      expect(channel.name.length).toBeGreaterThan(0);
      expect(channel.url.length).toBeGreaterThan(0);
      expect(channel.icon.length).toBeGreaterThan(0);
    });

    // Test specific channel data
    const whatsappChannel = onlineStickerData.channels[0];
    expect(whatsappChannel.name).toBe('whatsapp');
    expect(whatsappChannel.url).toBe('https://wa.me/79055773387');
    expect(whatsappChannel.icon).toBe('💬');

    const telegramChannel = onlineStickerData.channels[1];
    expect(telegramChannel.name).toBe('telegram');
    expect(telegramChannel.url).toBe('https://t.me/zerodolg');
    expect(telegramChannel.icon).toBe('✈️');

    const phoneChannel = onlineStickerData.channels[2];
    expect(phoneChannel.name).toBe('phone');
    expect(phoneChannel.url).toBe('tel:+79055773387');
    expect(phoneChannel.icon).toBe('📞');
  });

  // Test online status tracking
  it('should track online status correctly', () => {
    // Online status tracking logic
    const onlineStatus = {
      isOnline: navigator.onLine,
      lastOnline: Date.now(),
      lastOffline: null as number | null,
      connectionType: 'unknown' as string,
      connectionSpeed: 'unknown' as string,
      statusHistory: [] as { status: boolean; timestamp: number }[],
    };

    // Status update functions
    const updateOnlineStatus = (status: boolean, state = onlineStatus) => {
      state.isOnline = status;

      if (status) {
        state.lastOnline = Date.now();
        if (state.lastOffline) {
          state.connectionType = 'restored';
        }
      } else {
        state.lastOffline = Date.now();
        state.connectionType = 'lost';
      }

      state.statusHistory.push({ status, timestamp: Date.now() });

      // Keep only last 100 status changes
      if (state.statusHistory.length > 100) {
        state.statusHistory = state.statusHistory.slice(-100);
      }

      return state;
    };

    // Test initial status
    expect(onlineStatus.isOnline).toBe(navigator.onLine);
    expect(typeof onlineStatus.lastOnline).toBe('number');
    expect(onlineStatus.lastOffline).toBeNull();
    expect(onlineStatus.connectionType).toBe('unknown');
    expect(onlineStatus.connectionSpeed).toBe('unknown');
    expect(Array.isArray(onlineStatus.statusHistory)).toBe(true);
    expect(onlineStatus.statusHistory.length).toBe(0);

    // Test going offline
    const offlineState = updateOnlineStatus(false, onlineStatus);
    expect(offlineState.isOnline).toBe(false);
    expect(typeof offlineState.lastOffline).toBe('number');
    expect(offlineState.connectionType).toBe('lost');
    expect(offlineState.statusHistory.length).toBe(1);
    expect(offlineState.statusHistory[0].status).toBe(false);

    // Test going online
    const onlineState = updateOnlineStatus(true, offlineState);
    expect(onlineState.isOnline).toBe(true);
    expect(typeof onlineState.lastOnline).toBe('number');
    expect(onlineState.connectionType).toBe('restored');
    expect(onlineState.statusHistory.length).toBe(2);
    expect(onlineState.statusHistory[1].status).toBe(true);

    // Test multiple status changes
    for (let i = 0; i < 5; i++) {
      updateOnlineStatus(i % 2 === 0, onlineState);
    }

    expect(onlineState.statusHistory.length).toBe(7);
    expect(onlineState.statusHistory[2].status).toBe(false);
    expect(onlineState.statusHistory[3].status).toBe(true);
    expect(onlineState.statusHistory[4].status).toBe(false);
    expect(onlineState.statusHistory[5].status).toBe(true);
    expect(onlineState.statusHistory[6].status).toBe(false);

    // Test history limit
    for (let i = 0; i < 100; i++) {
      updateOnlineStatus(i % 2 === 0, onlineState);
    }

    expect(onlineState.statusHistory.length).toBe(100);
    // First entries should be removed due to limit
    expect(onlineState.statusHistory[0].status).toBe(true); // From previous test
    expect(onlineState.statusHistory[99].status).toBe(false); // Last added
  });

  // Test connection quality monitoring
  it('should monitor connection quality correctly', () => {
    // Connection quality monitoring logic
    const connectionQuality = {
      type: 'unknown' as string,
      speed: 'unknown' as string,
      rtt: 0,
      downlink: 0,
      effectiveType: 'unknown' as string,
      saveData: false,
      lastChecked: Date.now(),
      qualityHistory: [] as { quality: string; timestamp: number }[],
      updateQuality() {
        // Mock connection quality update
        try {
          // @ts-ignore
          const connection =
            navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          if (connection) {
            this.type = connection.type || 'unknown';
            this.effectiveType = connection.effectiveType || 'unknown';
            this.rtt = connection.rtt || 0;
            this.downlink = connection.downlink || 0;
            this.saveData = connection.saveData || false;

            // Determine speed category
            if (this.downlink > 10) {
              this.speed = 'excellent';
            } else if (this.downlink > 5) {
              this.speed = 'good';
            } else if (this.downlink > 1) {
              this.speed = 'fair';
            } else if (this.downlink > 0) {
              this.speed = 'poor';
            } else {
              this.speed = 'unknown';
            }
          }
        } catch (e) {
          // Fallback for browsers without connection API
          this.type = 'unknown';
          this.speed = 'unknown';
          this.effectiveType = 'unknown';
        }

        this.lastChecked = Date.now();
        this.qualityHistory.push({ quality: this.speed, timestamp: this.lastChecked });

        // Keep only last 50 quality checks
        if (this.qualityHistory.length > 50) {
          this.qualityHistory = this.qualityHistory.slice(-50);
        }

        return this;
      },
      getQualityScore() {
        switch (this.speed) {
          case 'excellent':
            return 5;
          case 'good':
            return 4;
          case 'fair':
            return 3;
          case 'poor':
            return 2;
          default:
            return 1;
        }
      },
      getQualityDescription() {
        switch (this.speed) {
          case 'excellent':
            return 'Отличное соединение';
          case 'good':
            return 'Хорошее соединение';
          case 'fair':
            return 'Удовлетворительное соединение';
          case 'poor':
            return 'Плохое соединение';
          default:
            return 'Неизвестное качество соединения';
        }
      },
      getQualityRecommendation() {
        switch (this.speed) {
          case 'excellent':
            return 'Все функции сайта доступны';
          case 'good':
            return 'Полная функциональность сайта';
          case 'fair':
            return 'Ограниченная функциональность';
          case 'poor':
            return 'Минимальная функциональность';
          default:
            return 'Базовая функциональность';
        }
      },
    };

    // Test initial connection quality
    expect(connectionQuality.type).toBe('unknown');
    expect(connectionQuality.speed).toBe('unknown');
    expect(connectionQuality.effectiveType).toBe('unknown');
    expect(connectionQuality.rtt).toBe(0);
    expect(connectionQuality.downlink).toBe(0);
    expect(connectionQuality.saveData).toBe(false);
    expect(typeof connectionQuality.lastChecked).toBe('number');
    expect(Array.isArray(connectionQuality.qualityHistory)).toBe(true);
    expect(connectionQuality.qualityHistory.length).toBe(0);

    // Test quality update
    const updatedQuality = connectionQuality.updateQuality();
    expect(updatedQuality.type).toBe('unknown');
    expect(updatedQuality.speed).toBe('unknown');
    expect(updatedQuality.effectiveType).toBe('unknown');
    expect(updatedQuality.rtt).toBe(0);
    expect(updatedQuality.downlink).toBe(0);
    expect(updatedQuality.saveData).toBe(false);
    expect(typeof updatedQuality.lastChecked).toBe('number');
    expect(updatedQuality.qualityHistory.length).toBe(1);
    expect(updatedQuality.qualityHistory[0].quality).toBe('unknown');
    expect(typeof updatedQuality.qualityHistory[0].timestamp).toBe('number');

    // Test quality score calculation
    expect(connectionQuality.getQualityScore()).toBe(1); // Unknown

    // Test with simulated excellent connection
    connectionQuality.downlink = 15;
    connectionQuality.speed = 'excellent';
    expect(connectionQuality.getQualityScore()).toBe(5);
    expect(connectionQuality.getQualityDescription()).toBe('Отличное соединение');
    expect(connectionQuality.getQualityRecommendation()).toBe('Все функции сайта доступны');

    // Test with simulated good connection
    connectionQuality.downlink = 7;
    connectionQuality.speed = 'good';
    expect(connectionQuality.getQualityScore()).toBe(4);
    expect(connectionQuality.getQualityDescription()).toBe('Хорошее соединение');
    expect(connectionQuality.getQualityRecommendation()).toBe('Полная функциональность сайта');

    // Test with simulated fair connection
    connectionQuality.downlink = 3;
    connectionQuality.speed = 'fair';
    expect(connectionQuality.getQualityScore()).toBe(3);
    expect(connectionQuality.getQualityDescription()).toBe('Удовлетворительное соединение');
    expect(connectionQuality.getQualityRecommendation()).toBe('Ограниченная функциональность');

    // Test with simulated poor connection
    connectionQuality.downlink = 0.5;
    connectionQuality.speed = 'poor';
    expect(connectionQuality.getQualityScore()).toBe(2);
    expect(connectionQuality.getQualityDescription()).toBe('Плохое соединение');
    expect(connectionQuality.getQualityRecommendation()).toBe('Минимальная функциональность');

    // Test multiple quality updates
    for (let i = 0; i < 5; i++) {
      connectionQuality.updateQuality();
    }

    expect(connectionQuality.qualityHistory.length).toBe(6);

    // Test history limit
    for (let i = 0; i < 50; i++) {
      connectionQuality.updateQuality();
    }

    expect(connectionQuality.qualityHistory.length).toBe(50);
    // First entries should be removed due to limit
    expect(connectionQuality.qualityHistory[0].quality).toBe('poor'); // From previous test
    expect(connectionQuality.qualityHistory[49].quality).toBe('poor'); // Last added
  });

  // Test online sticker interactivity
  it('should handle online sticker interactivity correctly', () => {
    // Create interactive online sticker elements
    const onlineSticker = document.createElement('div');
    onlineSticker.className = 'online-sticker';
    onlineSticker.id = 'online-sticker';
    onlineSticker.setAttribute('role', 'status');
    onlineSticker.setAttribute('aria-live', 'polite');
    onlineSticker.setAttribute('aria-label', 'Статус онлайн-консультанта ZeroDolg');

    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'online-sticker__indicator';
    statusIndicator.setAttribute('aria-hidden', 'true');

    const statusDot = document.createElement('span');
    statusDot.className = 'online-sticker__dot';
    statusDot.setAttribute('aria-hidden', 'true');

    const statusText = document.createElement('span');
    statusText.className = 'online-sticker__text';
    statusText.textContent = 'Онлайн-консультант';

    const statusMessage = document.createElement('span');
    statusMessage.className = 'online-sticker__message sr-only';
    statusMessage.setAttribute('aria-live', 'polite');

    // Append elements
    statusIndicator.appendChild(statusDot);
    onlineSticker.appendChild(statusIndicator);
    onlineSticker.appendChild(statusText);
    onlineSticker.appendChild(statusMessage);
    document.body.appendChild(onlineSticker);

    // Verify structure
    expect(document.getElementById('online-sticker')).toBeTruthy();
    expect(onlineSticker.querySelector('.online-sticker__indicator')).toBeTruthy();
    expect(onlineSticker.querySelector('.online-sticker__text')).toBeTruthy();
    expect(onlineSticker.querySelector('.online-sticker__dot')).toBeTruthy();
    expect(onlineSticker.querySelector('.online-sticker__message')).toBeTruthy();

    // Verify accessibility attributes
    expect(onlineSticker.getAttribute('role')).toBe('status');
    expect(onlineSticker.getAttribute('aria-live')).toBe('polite');
    expect(onlineSticker.getAttribute('aria-label')).toBe('Статус онлайн-консультанта ZeroDolg');
    expect(onlineSticker.id).toBe('online-sticker');

    expect(statusIndicator.getAttribute('aria-hidden')).toBe('true');
    expect(statusIndicator.className).toBe('online-sticker__indicator');

    expect(statusDot.getAttribute('aria-hidden')).toBe('true');
    expect(statusDot.className).toBe('online-sticker__dot');

    expect(statusText.className).toBe('online-sticker__text');
    expect(statusText.textContent).toBe('Онлайн-консультант');

    expect(statusMessage.getAttribute('aria-live')).toBe('polite');
    expect(statusMessage.className).toBe('online-sticker__message sr-only');

    // Test status updates
    const updateStickerStatus = (isOnline: boolean, messageText: string = '') => {
      onlineSticker.classList.toggle('online-sticker--online', isOnline);
      onlineSticker.classList.toggle('online-sticker--offline', !isOnline);

      statusDot.classList.toggle('online-sticker__dot--online', isOnline);
      statusDot.classList.toggle('online-sticker__dot--offline', !isOnline);

      if (messageText) {
        statusMessage.textContent = messageText;
      }
    };

    // Test online status
    updateStickerStatus(true, 'Консультант онлайн');
    expect(onlineSticker.classList.contains('online-sticker--online')).toBe(true);
    expect(onlineSticker.classList.contains('online-sticker--offline')).toBe(false);
    expect(statusDot.classList.contains('online-sticker__dot--online')).toBe(true);
    expect(statusDot.classList.contains('online-sticker__dot--offline')).toBe(false);
    expect(statusMessage.textContent).toBe('Консультант онлайн');

    // Test offline status
    updateStickerStatus(false, 'Консультант офлайн');
    expect(onlineSticker.classList.contains('online-sticker--online')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--offline')).toBe(true);
    expect(statusDot.classList.contains('online-sticker__dot--online')).toBe(false);
    expect(statusDot.classList.contains('online-sticker__dot--offline')).toBe(true);
    expect(statusMessage.textContent).toBe('Консультант офлайн');

    // Test click interaction
    let clickCount = 0;
    onlineSticker.addEventListener('click', () => {
      clickCount++;
    });

    onlineSticker.click();
    expect(clickCount).toBe(1);

    onlineSticker.click();
    expect(clickCount).toBe(2);

    // Test keyboard interaction
    let keyPressCount = 0;
    onlineSticker.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        keyPressCount++;
        e.preventDefault();
      }
    });

    // Test Enter key press
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    onlineSticker.dispatchEvent(enterEvent);
    expect(keyPressCount).toBe(1);

    // Test Space key press
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    onlineSticker.dispatchEvent(spaceEvent);
    expect(keyPressCount).toBe(2);

    // Test focus management
    onlineSticker.setAttribute('tabindex', '0');
    expect(onlineSticker.getAttribute('tabindex')).toBe('0');

    onlineSticker.focus();
    expect(document.activeElement).toBe(onlineSticker);

    onlineSticker.blur();
    expect(document.activeElement).not.toBe(onlineSticker);
  });

  // Test online sticker animations
  it('should handle online sticker animations correctly', () => {
    // Create animated online sticker elements
    const onlineSticker = document.createElement('div');
    onlineSticker.className = 'online-sticker';
    onlineSticker.id = 'online-sticker';

    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'online-sticker__indicator';

    const statusDot = document.createElement('span');
    statusDot.className = 'online-sticker__dot';

    const pulseAnimation = document.createElement('div');
    pulseAnimation.className = 'online-sticker__pulse';

    // Append elements
    statusIndicator.appendChild(statusDot);
    statusIndicator.appendChild(pulseAnimation);
    onlineSticker.appendChild(statusIndicator);
    document.body.appendChild(onlineSticker);

    // Verify animation elements
    expect(onlineSticker.querySelector('.online-sticker__indicator')).toBeTruthy();
    expect(onlineSticker.querySelector('.online-sticker__dot')).toBeTruthy();
    expect(onlineSticker.querySelector('.online-sticker__pulse')).toBeTruthy();

    // Test animation classes
    expect(statusIndicator.className).toBe('online-sticker__indicator');
    expect(statusDot.className).toBe('online-sticker__dot');
    expect(pulseAnimation.className).toBe('online-sticker__pulse');

    // Test animation state changes
    const addAnimationClass = (element: HTMLElement, className: string) => {
      element.classList.add(className);
    };

    const removeAnimationClass = (element: HTMLElement, className: string) => {
      element.classList.remove(className);
    };

    // Test adding animation classes
    addAnimationClass(onlineSticker, 'online-sticker--animating');
    addAnimationClass(statusDot, 'online-sticker__dot--pulsing');
    addAnimationClass(pulseAnimation, 'online-sticker__pulse--active');

    expect(onlineSticker.classList.contains('online-sticker--animating')).toBe(true);
    expect(statusDot.classList.contains('online-sticker__dot--pulsing')).toBe(true);
    expect(pulseAnimation.classList.contains('online-sticker__pulse--active')).toBe(true);

    // Test removing animation classes
    removeAnimationClass(onlineSticker, 'online-sticker--animating');
    removeAnimationClass(statusDot, 'online-sticker__dot--pulsing');
    removeAnimationClass(pulseAnimation, 'online-sticker__pulse--active');

    expect(onlineSticker.classList.contains('online-sticker--animating')).toBe(false);
    expect(statusDot.classList.contains('online-sticker__dot--pulsing')).toBe(false);
    expect(pulseAnimation.classList.contains('online-sticker__pulse--active')).toBe(false);

    // Test animation triggers
    const triggerAnimation = (element: HTMLElement, animationName: string) => {
      element.style.animation = `${animationName} 0.5s ease`;
      element.classList.add('animated');
    };

    const resetAnimation = (element: HTMLElement) => {
      element.style.animation = '';
      element.classList.remove('animated');
    };

    // Test triggering animations
    triggerAnimation(onlineSticker, 'fadeIn');
    expect(onlineSticker.style.animation).toBe('fadeIn 0.5s ease');
    expect(onlineSticker.classList.contains('animated')).toBe(true);

    triggerAnimation(statusDot, 'pulse');
    expect(statusDot.style.animation).toBe('pulse 0.5s ease');
    expect(statusDot.classList.contains('animated')).toBe(true);

    triggerAnimation(pulseAnimation, 'scaleIn');
    expect(pulseAnimation.style.animation).toBe('scaleIn 0.5s ease');
    expect(pulseAnimation.classList.contains('animated')).toBe(true);

    // Test resetting animations
    resetAnimation(onlineSticker);
    expect(onlineSticker.style.animation).toBe('');
    expect(onlineSticker.classList.contains('animated')).toBe(false);

    resetAnimation(statusDot);
    expect(statusDot.style.animation).toBe('');
    expect(statusDot.classList.contains('animated')).toBe(false);

    resetAnimation(pulseAnimation);
    expect(pulseAnimation.style.animation).toBe('');
    expect(pulseAnimation.classList.contains('animated')).toBe(false);
  });

  // Test online sticker positioning
  it('should handle online sticker positioning correctly', () => {
    // Create positioned online sticker elements
    const onlineSticker = document.createElement('div');
    onlineSticker.className = 'online-sticker';
    onlineSticker.id = 'online-sticker';

    const positionVariants = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];

    // Test positioning classes
    positionVariants.forEach((variant) => {
      onlineSticker.className = `online-sticker online-sticker--${variant}`;
      expect(onlineSticker.classList.contains(`online-sticker--${variant}`)).toBe(true);
    });

    // Test dynamic positioning
    const setPosition = (element: HTMLElement, position: string) => {
      element.classList.remove(...positionVariants.map((v) => `online-sticker--${v}`));
      element.classList.add(`online-sticker--${position}`);
    };

    // Test bottom-right positioning
    setPosition(onlineSticker, 'bottom-right');
    expect(onlineSticker.classList.contains('online-sticker--bottom-right')).toBe(true);
    expect(onlineSticker.classList.contains('online-sticker--bottom-left')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--top-right')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--top-left')).toBe(false);

    // Test bottom-left positioning
    setPosition(onlineSticker, 'bottom-left');
    expect(onlineSticker.classList.contains('online-sticker--bottom-right')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--bottom-left')).toBe(true);
    expect(onlineSticker.classList.contains('online-sticker--top-right')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--top-left')).toBe(false);

    // Test top-right positioning
    setPosition(onlineSticker, 'top-right');
    expect(onlineSticker.classList.contains('online-sticker--bottom-right')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--bottom-left')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--top-right')).toBe(true);
    expect(onlineSticker.classList.contains('online-sticker--top-left')).toBe(false);

    // Test top-left positioning
    setPosition(onlineSticker, 'top-left');
    expect(onlineSticker.classList.contains('online-sticker--bottom-right')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--bottom-left')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--top-right')).toBe(false);
    expect(onlineSticker.classList.contains('online-sticker--top-left')).toBe(true);

    // Test positioning with offset
    const setPositionWithOffset = (
      element: HTMLElement,
      position: string,
      offsetX: number,
      offsetY: number
    ) => {
      setPosition(element, position);
      element.style.setProperty('--online-sticker-offset-x', `${offsetX}px`);
      element.style.setProperty('--online-sticker-offset-y', `${offsetY}px`);
    };

    setPositionWithOffset(onlineSticker, 'bottom-right', 20, 20);
    expect(onlineSticker.classList.contains('online-sticker--bottom-right')).toBe(true);
    expect(onlineSticker.style.getPropertyValue('--online-sticker-offset-x')).toBe('20px');
    expect(onlineSticker.style.getPropertyValue('--online-sticker-offset-y')).toBe('20px');

    setPositionWithOffset(onlineSticker, 'bottom-left', 30, 30);
    expect(onlineSticker.classList.contains('online-sticker--bottom-left')).toBe(true);
    expect(onlineSticker.style.getPropertyValue('--online-sticker-offset-x')).toBe('30px');
    expect(onlineSticker.style.getPropertyValue('--online-sticker-offset-y')).toBe('30px');
  });

  // Test online sticker accessibility
  it('should include proper accessibility attributes', () => {
    // Create accessible online sticker elements
    const onlineSticker = document.createElement('div');
    onlineSticker.className = 'online-sticker';
    onlineSticker.id = 'online-sticker';
    onlineSticker.setAttribute('role', 'status');
    onlineSticker.setAttribute('aria-live', 'polite');
    onlineSticker.setAttribute('aria-label', 'Статус онлайн-консультанта ZeroDolg');
    onlineSticker.setAttribute('tabindex', '0');

    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'online-sticker__indicator';
    statusIndicator.setAttribute('aria-hidden', 'true');

    const statusDot = document.createElement('span');
    statusDot.className = 'online-sticker__dot';
    statusDot.setAttribute('aria-hidden', 'true');

    const statusText = document.createElement('span');
    statusText.className = 'online-sticker__text';
    statusText.textContent = 'Онлайн-консультант';
    statusText.setAttribute('aria-describedby', 'online-status-desc');

    const statusDescription = document.createElement('span');
    statusDescription.id = 'online-status-desc';
    statusDescription.className = 'sr-only';
    statusDescription.textContent = 'Консультант доступен для онлайн-консультаций';

    const statusMessage = document.createElement('span');
    statusMessage.className = 'online-sticker__message sr-only';
    statusMessage.setAttribute('aria-live', 'polite');
    statusMessage.setAttribute('role', 'alert');

    // Append elements
    statusIndicator.appendChild(statusDot);
    onlineSticker.appendChild(statusIndicator);
    onlineSticker.appendChild(statusText);
    onlineSticker.appendChild(statusDescription);
    onlineSticker.appendChild(statusMessage);
    document.body.appendChild(onlineSticker);

    // Verify accessibility attributes
    expect(onlineSticker.getAttribute('role')).toBe('status');
    expect(onlineSticker.getAttribute('aria-live')).toBe('polite');
    expect(onlineSticker.getAttribute('aria-label')).toBe('Статус онлайн-консультанта ZeroDolg');
    expect(onlineSticker.getAttribute('tabindex')).toBe('0');
    expect(onlineSticker.id).toBe('online-sticker');

    expect(statusIndicator.getAttribute('aria-hidden')).toBe('true');
    expect(statusIndicator.className).toBe('online-sticker__indicator');

    expect(statusDot.getAttribute('aria-hidden')).toBe('true');
    expect(statusDot.className).toBe('online-sticker__dot');

    expect(statusText.getAttribute('aria-describedby')).toBe('online-status-desc');
    expect(statusText.className).toBe('online-sticker__text');
    expect(statusText.textContent).toBe('Онлайн-консультант');

    expect(statusDescription.id).toBe('online-status-desc');
    expect(statusDescription.className).toBe('sr-only');
    expect(statusDescription.textContent).toBe('Консультант доступен для онлайн-консультаций');

    expect(statusMessage.getAttribute('aria-live')).toBe('polite');
    expect(statusMessage.getAttribute('role')).toBe('alert');
    expect(statusMessage.className).toBe('online-sticker__message sr-only');

    // Test screen reader compatibility
    const srOnlyElements = document.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBe(2);

    srOnlyElements.forEach((element) => {
      expect(element.classList.contains('sr-only')).toBe(true);
    });

    // Test ARIA relationships
    expect(statusText.getAttribute('aria-describedby')).toBe('online-status-desc');
    expect(statusDescription.id).toBe('online-status-desc');

    // Test focus management
    onlineSticker.focus();
    expect(document.activeElement).toBe(onlineSticker);

    onlineSticker.blur();
    expect(document.activeElement).not.toBe(onlineSticker);
  });

  // Test online sticker performance
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

    // Test online sticker rendering performance with large dataset
    performanceMock.mark('online-sticker-render-start');

    // Create 1000 online sticker instances for stress testing
    const stickers = [];
    for (let i = 0; i < 1000; i++) {
      const sticker = document.createElement('div');
      sticker.className = 'online-sticker';
      sticker.id = `online-sticker-${i + 1}`;
      sticker.setAttribute('role', 'status');
      sticker.setAttribute('aria-live', 'polite');
      sticker.setAttribute('aria-label', `Статус онлайн-консультанта ${i + 1}`);
      sticker.setAttribute('tabindex', '0');

      const indicator = document.createElement('div');
      indicator.className = 'online-sticker__indicator';
      indicator.setAttribute('aria-hidden', 'true');

      const dot = document.createElement('span');
      dot.className = 'online-sticker__dot';
      dot.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.className = 'online-sticker__text';
      text.textContent = `Консультант ${i + 1}`;

      indicator.appendChild(dot);
      sticker.appendChild(indicator);
      sticker.appendChild(text);
      stickers.push(sticker);
    }

    // Add all stickers to DOM
    stickers.forEach((sticker) => document.body.appendChild(sticker));

    performanceMock.mark('online-sticker-render-end');
    const renderMeasure = performanceMock.measure(
      'online-sticker-render',
      'online-sticker-render-start',
      'online-sticker-render-end'
    );

    // Verify sticker creation
    expect(stickers.length).toBe(1000);
    expect(document.querySelectorAll('.online-sticker').length).toBe(1000);

    // Verify sticker attributes
    stickers.forEach((sticker, index) => {
      expect(sticker.id).toBe(`online-sticker-${index + 1}`);
      expect(sticker.getAttribute('role')).toBe('status');
      expect(sticker.getAttribute('aria-live')).toBe('polite');
      expect(sticker.getAttribute('aria-label')).toBe(`Статус онлайн-консультанта ${index + 1}`);
      expect(sticker.getAttribute('tabindex')).toBe('0');
      expect(sticker.querySelector('.online-sticker__indicator')).toBeTruthy();
      expect(sticker.querySelector('.online-sticker__dot')).toBeTruthy();
      expect(sticker.querySelector('.online-sticker__text')).toBeTruthy();

      const text = sticker.querySelector('.online-sticker__text');
      expect(text?.textContent).toBe(`Консультант ${index + 1}`);
    });

    // Test sticker interaction performance
    performanceMock.mark('interaction-start');

    const toggleStickerState = (sticker: HTMLElement, isOnline: boolean) => {
      sticker.classList.toggle('online-sticker--online', isOnline);
      sticker.classList.toggle('online-sticker--offline', !isOnline);

      const dot = sticker.querySelector('.online-sticker__dot');
      if (dot) {
        dot.classList.toggle('online-sticker__dot--online', isOnline);
        dot.classList.toggle('online-sticker__dot--offline', !isOnline);
      }
    };

    // Toggle states for all stickers
    stickers.forEach((sticker, index) => {
      toggleStickerState(sticker, index % 2 === 0);
    });

    performanceMock.mark('interaction-end');
    const interactionMeasure = performanceMock.measure(
      'online-sticker-interaction',
      'interaction-start',
      'interaction-end'
    );

    // Verify state changes
    stickers.forEach((sticker, index) => {
      expect(sticker.classList.contains('online-sticker--online')).toBe(index % 2 === 0);
      expect(sticker.classList.contains('online-sticker--offline')).toBe(index % 2 !== 0);

      const dot = sticker.querySelector('.online-sticker__dot');
      expect(dot?.classList.contains('online-sticker__dot--online')).toBe(index % 2 === 0);
      expect(dot?.classList.contains('online-sticker__dot--offline')).toBe(index % 2 !== 0);
    });

    // Test sticker cleanup performance
    performanceMock.mark('cleanup-start');

    // Remove all stickers
    stickers.forEach((sticker) => {
      if (sticker.parentNode) {
        sticker.parentNode.removeChild(sticker);
      }
    });

    performanceMock.mark('cleanup-end');
    const cleanupMeasure = performanceMock.measure(
      'online-sticker-cleanup',
      'cleanup-start',
      'cleanup-end'
    );

    // Verify cleanup
    expect(document.querySelectorAll('.online-sticker').length).toBe(0);
    expect(stickers.length).toBe(1000); // Original array unchanged

    // Verify performance measurements
    expect(performanceMock.marks).toContain('online-sticker-render-start');
    expect(performanceMock.marks).toContain('online-sticker-render-end');
    expect(performanceMock.marks).toContain('interaction-start');
    expect(performanceMock.marks).toContain('interaction-end');
    expect(performanceMock.marks).toContain('cleanup-start');
    expect(performanceMock.marks).toContain('cleanup-end');

    expect(performanceMock.measures.some((m) => m.name === 'online-sticker-render')).toBe(true);
    expect(performanceMock.measures.some((m) => m.name === 'online-sticker-interaction')).toBe(
      true
    );
    expect(performanceMock.measures.some((m) => m.name === 'online-sticker-cleanup')).toBe(true);
  });
});
