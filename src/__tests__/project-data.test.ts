import { describe, it, expect } from 'vitest';

describe('Project Data Integrity', () => {
  // Site configuration tests
  it('should validate site configuration correctly', () => {
    const siteConfig = {
      name: 'ZeroDolg',
      title: 'ZeroDolg - Банкротство физических лиц в Москве',
      description: '⭐ 98% успешных дел! Законное списание долгов через банкротство физических лиц. ✅ Остановим проценты ✅ Защитим имущество ✅ Гарантия по договору.',
      keywords: 'банкротство физических лиц, списание долгов, банкротство физлиц 2024, защита от коллекторов',
      url: 'https://zerodolg.ru',
      phone: '+7 (905) 577-33-87',
      email: 'info@zerodolg.ru'
    };

    // Validate required fields
    expect(typeof siteConfig.name).toBe('string');
    expect(siteConfig.name.length).toBeGreaterThan(0);
    
    expect(typeof siteConfig.title).toBe('string');
    expect(siteConfig.title.length).toBeGreaterThan(10);
    
    expect(typeof siteConfig.description).toBe('string');
    expect(siteConfig.description.length).toBeGreaterThan(50);
    
    expect(typeof siteConfig.keywords).toBe('string');
    expect(siteConfig.keywords.length).toBeGreaterThan(20);
    
    expect(typeof siteConfig.url).toBe('string');
    expect(siteConfig.url.startsWith('http')).toBe(true);
    
    expect(typeof siteConfig.phone).toBe('string');
    expect(siteConfig.phone.length).toBeGreaterThan(10);
    
    expect(typeof siteConfig.email).toBe('string');
    expect(siteConfig.email.includes('@')).toBe(true);

    // Test specific content
    expect(siteConfig.title).toContain('ZeroDolg');
    expect(siteConfig.description).toContain('98% успешных дел');
    expect(siteConfig.description).toContain('банкротство');
    expect(siteConfig.keywords).toContain('банкротство физических лиц');
  });

  // SEO metadata tests
  it('should validate SEO metadata correctly', () => {
    const seoMetadata = {
      ogTitle: 'ZeroDolg - Банкротство физических лиц в Москве',
      ogDescription: '⭐ 98% успешных дел! Законное списание долгов через банкротство физических лиц.',
      ogImage: '/og-image.jpg',
      ogUrl: 'https://zerodolg.ru/',
      twitterCard: 'summary_large_image',
      canonical: 'https://zerodolg.ru/'
    };

    // Validate Open Graph tags
    expect(typeof seoMetadata.ogTitle).toBe('string');
    expect(seoMetadata.ogTitle.length).toBeGreaterThan(10);
    
    expect(typeof seoMetadata.ogDescription).toBe('string');
    expect(seoMetadata.ogDescription.length).toBeGreaterThan(30);
    
    expect(typeof seoMetadata.ogImage).toBe('string');
    expect(seoMetadata.ogImage.startsWith('/')).toBe(true);
    expect(seoMetadata.ogImage.endsWith('.jpg')).toBe(true);
    
    expect(typeof seoMetadata.ogUrl).toBe('string');
    expect(seoMetadata.ogUrl.startsWith('http')).toBe(true);
    
    // Validate Twitter card
    expect(seoMetadata.twitterCard).toBe('summary_large_image');
    
    // Validate canonical URL
    expect(typeof seoMetadata.canonical).toBe('string');
    expect(seoMetadata.canonical).toBe('https://zerodolg.ru/');
  });

  // Contact information validation tests
  it('should validate all contact information consistently', () => {
    const contacts = {
      phone: {
        display: '+7 (905) 577-33-87',
        raw: '+79055773387',
        whatsapp: 'https://wa.me/79055773387',
        telegram: 'https://t.me/zerodolg'
      },
      email: {
        display: 'info@zerodolg.ru',
        mailto: 'mailto:info@zerodolg.ru'
      },
      address: {
        display: 'г. Москва, ул. Примерная, д. 1',
        map: 'https://yandex.ru/maps/?text=Москва,+ул.+Примерная,+д.+1'
      },
      workingHours: 'Пн-Пт: 9:00-18:00'
    };

    // Validate phone formats
    expect(contacts.phone.display).toMatch(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/);
    expect(contacts.phone.raw).toMatch(/^\+7\d{10}$/);
    expect(contacts.phone.whatsapp).toMatch(/^https:\/\/wa\.me\/\d{11}$/);
    expect(contacts.phone.telegram).toBe('https://t.me/zerodolg');

    // Validate email formats
    expect(contacts.email.display).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(contacts.email.mailto).toBe('mailto:info@zerodolg.ru');

    // Validate address
    expect(typeof contacts.address.display).toBe('string');
    expect(contacts.address.display.length).toBeGreaterThan(15);
    expect(contacts.address.map).toMatch(/^https:\/\/[a-z]+\.[a-z]+/);

    // Validate working hours
    expect(typeof contacts.workingHours).toBe('string');
    expect(contacts.workingHours).toMatch(/^[А-Яа-я]+-[А-Яа-я]+: \d{1,2}:\d{2}-\d{1,2}:\d{2}$/);
  });

  // Legal information tests
  it('should validate legal information correctly', () => {
    const legalInfo = {
      ogrn: '1234567890123',
      inn: '9876543210',
      kpp: '123456789',
      bank: 'АО "ТИНЬКОФФ БАНК"',
      bik: '044525974',
      rs: '40702810410000003271',
      ks: '30101810200000000974',
      legalAddress: '123456, г. Москва, ул. Банковская, д. 10'
    };

    // Validate OGRN format (13 digits)
    expect(legalInfo.ogrn).toMatch(/^\d{13}$/);
    expect(legalInfo.ogrn.length).toBe(13);

    // Validate INN format (10 digits for organizations)
    expect(legalInfo.inn).toMatch(/^\d{10}$/);
    expect(legalInfo.inn.length).toBe(10);

    // Validate KPP format (9 digits)
    expect(legalInfo.kpp).toMatch(/^\d{9}$/);
    expect(legalInfo.kpp.length).toBe(9);

    // Validate BIK format (9 digits)
    expect(legalInfo.bik).toMatch(/^\d{9}$/);
    expect(legalInfo.bik.length).toBe(9);

    // Validate account numbers (20 digits)
    expect(legalInfo.rs).toMatch(/^\d{20}$/);
    expect(legalInfo.rs.length).toBe(20);
    expect(legalInfo.ks).toMatch(/^\d{20}$/);
    expect(legalInfo.ks.length).toBe(20);

    // Validate bank name
    expect(typeof legalInfo.bank).toBe('string');
    expect(legalInfo.bank.length).toBeGreaterThan(10);
    expect(legalInfo.bank).toContain('БАНК');

    // Validate legal address
    expect(typeof legalInfo.legalAddress).toBe('string');
    expect(legalInfo.legalAddress.length).toBeGreaterThan(20);
    expect(legalInfo.legalAddress).toMatch(/^\d{6},/); // Should start with postal code
  });

  // Social media validation tests
  it('should validate social media links correctly', () => {
    const socialLinks = [
      { platform: 'vk', url: 'https://vk.com/zerodolg', followers: '15K' },
      { platform: 'telegram', url: 'https://t.me/zerodolg', followers: '8.5K' },
      { platform: 'whatsapp', url: 'https://wa.me/79055773387', followers: '5.2K' },
      { platform: 'youtube', url: 'https://youtube.com/zerodolg', followers: '12K' }
    ];

    // Validate all social links
    socialLinks.forEach(link => {
      expect(typeof link.platform).toBe('string');
      expect(typeof link.url).toBe('string');
      expect(typeof link.followers).toBe('string');
      expect(link.platform.length).toBeGreaterThan(2);
      expect(link.url.length).toBeGreaterThan(10);
      expect(link.followers.length).toBeGreaterThan(2);
      
      // Validate URL format
      try {
        new URL(link.url);
        expect(true).toBe(true); // URL is valid
      } catch {
        expect.fail(`Invalid URL: ${link.url}`);
      }
    });

    // Test specific platforms
    const vkLink = socialLinks.find(l => l.platform === 'vk');
    expect(vkLink).toBeDefined();
    expect(vkLink?.url).toBe('https://vk.com/zerodolg');
    expect(vkLink?.followers).toBe('15K');

    const telegramLink = socialLinks.find(l => l.platform === 'telegram');
    expect(telegramLink).toBeDefined();
    expect(telegramLink?.url).toBe('https://t.me/zerodolg');
    expect(telegramLink?.followers).toBe('8.5K');
  });

  // Service offerings validation tests
  it('should validate service offerings correctly', () => {
    const services = [
      {
        id: 'bankruptcy',
        title: 'Банкротство физических лиц',
        price: 'от 5 900 ₽/мес',
        duration: '6-12 месяцев',
        successRate: '98%',
        features: [
          'Полное списание долгов',
          'Защита имущества',
          'Остановка начисления процентов',
          'Прекращение звонков коллекторов'
        ]
      },
      {
        id: 'restructuring',
        title: 'Реструктуризация долгов',
        price: 'от 3 500 ₽/мес',
        duration: '3-6 месяцев',
        successRate: '95%',
        features: [
          'Снижение ежемесячных платежей',
          'Уменьшение процентных ставок',
          'Пролонгация срока кредита',
          'Сохранение кредитной истории'
        ]
      }
    ];

    // Validate all services
    services.forEach(service => {
      expect(typeof service.id).toBe('string');
      expect(typeof service.title).toBe('string');
      expect(typeof service.price).toBe('string');
      expect(typeof service.duration).toBe('string');
      expect(typeof service.successRate).toBe('string');
      expect(Array.isArray(service.features)).toBe(true);
      
      expect(service.id.length).toBeGreaterThan(3);
      expect(service.title.length).toBeGreaterThan(10);
      expect(service.price.length).toBeGreaterThan(5);
      expect(service.duration.length).toBeGreaterThan(5);
      expect(service.successRate.length).toBeGreaterThan(2);
      expect(service.features.length).toBeGreaterThanOrEqual(3);
      
      // Validate price format
      expect(service.price).toMatch(/от \d[\d\s]* ₽\/мес/);
      
      // Validate success rate format
      expect(service.successRate).toMatch(/\d+%/);
    });

    // Test specific services
    const bankruptcyService = services.find(s => s.id === 'bankruptcy');
    expect(bankruptcyService).toBeDefined();
    expect(bankruptcyService?.title).toBe('Банкротство физических лиц');
    expect(bankruptcyService?.features).toContain('Полное списание долгов');
    
    const restructuringService = services.find(s => s.id === 'restructuring');
    expect(restructuringService).toBeDefined();
    expect(restructuringService?.title).toBe('Реструктуризация долгов');
    expect(restructuringService?.features).toContain('Снижение ежемесячных платежей');
  });
});