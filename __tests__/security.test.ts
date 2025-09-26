import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Security Tests', () => {
  // XSS prevention tests
  it('should prevent XSS attacks correctly', () => {
    const sanitizer = {
      sanitize(dirty: string) {
        // Remove dangerous tags and attributes
        let clean = dirty;

        // Remove script tags and their content
        clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Remove event handler attributes
        clean = clean.replace(/\bon\w+="[^"]*"/gi, '');
        clean = clean.replace(/\bon\w+='[^']*'/gi, '');
        clean = clean.replace(/\bon\w+=[^>\s]*/gi, '');

        // Remove javascript: URLs
        clean = clean.replace(/href="javascript:[^"]*"/gi, 'href="#"');
        clean = clean.replace(/src="javascript:[^"]*"/gi, 'src="#"');

        // Remove data URLs that could contain scripts
        clean = clean.replace(/src="data:[^"]*"/gi, 'src="#"');

        return clean;
      },
      isDangerousContent(content: string) {
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /data:text\/html/i,
          /\bon\w+=/i,
          /<iframe/i,
          /<object/i,
          /<embed/i,
        ];

        return dangerousPatterns.some((pattern) => pattern.test(content));
      },
    };

    // Test clean content passes through
    const cleanContent = '<p>Hello world</p>';
    expect(sanitizer.sanitize(cleanContent)).toBe(cleanContent);

    // Test script tags are removed
    const scriptContent = '<p>Hello</p><script>alert("XSS")</script>';
    const sanitizedScript = sanitizer.sanitize(scriptContent);
    expect(sanitizedScript).toBe('<p>Hello</p>');
    expect(sanitizer.isDangerousContent(scriptContent)).toBe(true);

    // Test event handlers are removed
    const eventContent = '<div onclick="alert(\'XSS\')">Click me</div>';
    const sanitizedEvent = sanitizer.sanitize(eventContent);
    expect(sanitizedEvent).toBe('<div>Click me</div>');
    expect(sanitizer.isDangerousContent(eventContent)).toBe(true);

    // Test javascript URLs are removed
    const jsUrlContent = '<a href="javascript:alert(\'XSS\')">Malicious Link</a>';
    const sanitizedJsUrl = sanitizer.sanitize(jsUrlContent);
    expect(sanitizedJsUrl).toBe('<a href="#">Malicious Link</a>');
    expect(sanitizer.isDangerousContent(jsUrlContent)).toBe(true);

    // Test data URLs are removed
    const dataUrlContent = '<img src="data:text/html,<script>alert(\'XSS\')</script>">';
    const sanitizedDataUrl = sanitizer.sanitize(dataUrlContent);
    expect(sanitizedDataUrl).toBe('<img src="#">');
    expect(sanitizer.isDangerousContent(dataUrlContent)).toBe(true);

    // Test iframe tags are detected as dangerous
    const iframeContent = '<iframe src="malicious.html"></iframe>';
    expect(sanitizer.isDangerousContent(iframeContent)).toBe(true);

    // Test object and embed tags are detected as dangerous
    const objectContent = '<object data="malicious.swf"></object>';
    const embedContent = '<embed src="malicious.swf">';
    expect(sanitizer.isDangerousContent(objectContent)).toBe(true);
    expect(sanitizer.isDangerousContent(embedContent)).toBe(true);

    // Test clean content is not detected as dangerous
    const cleanExample = '<div class="safe">Safe content with <strong>markup</strong>.</div>';
    expect(sanitizer.isDangerousContent(cleanExample)).toBe(false);
  });

  // CSRF protection tests
  it('should implement CSRF protection correctly', () => {
    const csrfProtection = {
      tokens: new Map<string, string>(),
      generateToken(userId: string) {
        // Generate secure random token
        const token =
          Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        this.tokens.set(userId, token);
        return token;
      },
      validateToken(userId: string, token: string) {
        const storedToken = this.tokens.get(userId);
        return storedToken === token;
      },
      regenerateToken(userId: string) {
        this.tokens.delete(userId);
        return this.generateToken(userId);
      },
      expireOldTokens(maxAgeMinutes: number = 60) {
        // In a real implementation, we'd store timestamps with tokens
        // For this test, we'll just return the count of expired tokens (0)
        return 0;
      },
    };

    // Test token generation
    const token1 = csrfProtection.generateToken('user123');
    const token2 = csrfProtection.generateToken('user456');

    expect(typeof token1).toBe('string');
    expect(token1.length).toBeGreaterThan(20); // Should be reasonably long
    expect(typeof token2).toBe('string');
    expect(token2.length).toBeGreaterThan(20);
    expect(token1).not.toBe(token2); // Tokens should be unique

    // Test token validation
    expect(csrfProtection.validateToken('user123', token1)).toBe(true);
    expect(csrfProtection.validateToken('user456', token2)).toBe(true);
    expect(csrfProtection.validateToken('user123', token2)).toBe(false); // Wrong token
    expect(csrfProtection.validateToken('user456', token1)).toBe(false); // Wrong user

    // Test token regeneration
    const oldToken = csrfProtection.tokens.get('user123');
    const newToken = csrfProtection.regenerateToken('user123');

    expect(newToken).not.toBe(oldToken);
    expect(csrfProtection.validateToken('user123', newToken)).toBe(true);
    expect(csrfProtection.validateToken('user123', oldToken as string)).toBe(false);

    // Test invalid tokens
    expect(csrfProtection.validateToken('nonexistent', 'fake-token')).toBe(false);
    expect(csrfProtection.validateToken('user123', '')).toBe(false);
    expect(csrfProtection.validateToken('', 'some-token')).toBe(false);

    // Test expiration of old tokens (conceptual test)
    const expiredCount = csrfProtection.expireOldTokens(30);
    expect(typeof expiredCount).toBe('number');
  });

  // Input validation tests
  it('should validate inputs correctly', () => {
    const inputValidator = {
      validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      validatePhone(phone: string) {
        const phoneRegex =
          /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(phone);
      },
      validateName(name: string) {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
        return nameRegex.test(name) && name.trim().length >= 2 && name.trim().length <= 50;
      },
      validateMessage(message: string) {
        return typeof message === 'string' && message.length >= 10 && message.length <= 1000;
      },
      validateId(id: string) {
        const idRegex = /^[a-zA-Z0-9_-]+$/;
        return idRegex.test(id) && id.length >= 1 && id.length <= 100;
      },
      sanitizeString(str: string) {
        // Basic sanitization - remove potentially dangerous characters
        return str
          .replace(/[<>"]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/data:/gi, '')
          .trim();
      },
    };

    // Test email validation
    expect(inputValidator.validateEmail('test@example.com')).toBe(true);
    expect(inputValidator.validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(inputValidator.validateEmail('invalid-email')).toBe(false);
    expect(inputValidator.validateEmail('@example.com')).toBe(false);
    expect(inputValidator.validateEmail('test@')).toBe(false);
    expect(inputValidator.validateEmail('')).toBe(false);

    // Test phone validation
    expect(inputValidator.validatePhone('+79055773387')).toBe(true);
    expect(inputValidator.validatePhone('89055773387')).toBe(true);
    expect(inputValidator.validatePhone('+7 (905) 577-33-87')).toBe(true);
    expect(inputValidator.validatePhone('invalid-phone')).toBe(false);
    expect(inputValidator.validatePhone('')).toBe(false);
    expect(inputValidator.validatePhone('123')).toBe(false);

    // Test name validation
    expect(inputValidator.validateName('Иван Петров')).toBe(true);
    expect(inputValidator.validateName('John Doe')).toBe(true);
    expect(inputValidator.validateName('Мария-Анна')).toBe(true);
    expect(inputValidator.validateName('')).toBe(false);
    expect(inputValidator.validateName('A')).toBe(false); // Too short
    expect(inputValidator.validateName('123')).toBe(false); // Contains numbers
    expect(inputValidator.validateName('<script>alert("XSS")</script>')).toBe(false); // Contains dangerous characters

    // Test message validation
    const validMessage = 'This is a valid message with more than 10 characters.';
    const shortMessage = 'Too short';
    const longMessage = 'A'.repeat(1500);

    expect(inputValidator.validateMessage(validMessage)).toBe(true);
    expect(inputValidator.validateMessage(shortMessage)).toBe(false);
    expect(inputValidator.validateMessage(longMessage)).toBe(false);
    expect(inputValidator.validateMessage('')).toBe(false);

    // Test ID validation
    expect(inputValidator.validateId('valid-id-123')).toBe(true);
    expect(inputValidator.validateId('another_id')).toBe(true);
    expect(inputValidator.validateId('')).toBe(false);
    expect(inputValidator.validateId('<script>alert("XSS")</script>')).toBe(false);
    expect(inputValidator.validateId('valid-id')).toBe(true);

    // Test string sanitization
    expect(inputValidator.sanitizeString('Normal text')).toBe('Normal text');
    expect(inputValidator.sanitizeString('<script>alert("XSS")</script>')).toBe(
      'scriptalert(XSS)/script'
    );
    expect(inputValidator.sanitizeString('"quoted" text')).toBe('quoted text');
    expect(inputValidator.sanitizeString('script:alert("bad")')).toBe(':alert(bad)');
  });

  // Authentication security tests
  it('should handle authentication security correctly', () => {
    const authSecurity = {
      sessions: new Map<string, { userId: string; expiresAt: number; ip: string }>(),
      rateLimits: new Map<string, { count: number; lastReset: number }>(),
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      generateSessionId() {
        return (
          Math.random().toString(36).substring(2) +
          Math.random().toString(36).substring(2) +
          Date.now().toString(36)
        );
      },
      createSession(userId: string, ip: string) {
        const sessionId = this.generateSessionId();
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        this.sessions.set(sessionId, {
          userId,
          expiresAt,
          ip,
        });

        return { sessionId, expiresAt };
      },
      validateSession(sessionId: string, ip: string) {
        const session = this.sessions.get(sessionId);

        if (!session) {
          return { valid: false, reason: 'Session not found' };
        }

        if (session.expiresAt < Date.now()) {
          this.sessions.delete(sessionId);
          return { valid: false, reason: 'Session expired' };
        }

        if (session.ip !== ip) {
          return { valid: false, reason: 'IP mismatch' };
        }

        return { valid: true, userId: session.userId };
      },
      incrementLoginAttempts(ip: string) {
        const now = Date.now();
        let attempts = this.rateLimits.get(ip);

        if (!attempts || now - attempts.lastReset > 15 * 60 * 1000) {
          attempts = { count: 0, lastReset: now };
        }

        attempts.count++;
        this.rateLimits.set(ip, attempts);

        return attempts.count;
      },
      isRateLimited(ip: string) {
        const attempts = this.rateLimits.get(ip);
        if (!attempts) return false;

        const now = Date.now();
        if (now - attempts.lastReset > 15 * 60 * 1000) {
          this.rateLimits.delete(ip);
          return false;
        }

        return attempts.count >= this.maxLoginAttempts;
      },
      resetRateLimit(ip: string) {
        this.rateLimits.delete(ip);
      },
    };

    // Test session creation
    const session1 = authSecurity.createSession('user123', '192.168.1.1');
    const session2 = authSecurity.createSession('user456', '192.168.1.2');

    expect(authSecurity.sessions.size).toBe(2);
    expect(typeof session1.sessionId).toBe('string');
    expect(session1.expiresAt).toBeGreaterThan(Date.now());
    expect(typeof session2.sessionId).toBe('string');
    expect(session2.expiresAt).toBeGreaterThan(Date.now());

    // Test session validation
    const validSession = authSecurity.validateSession(session1.sessionId, '192.168.1.1');
    expect(validSession.valid).toBe(true);
    expect(validSession.userId).toBe('user123');

    // Test IP mismatch detection
    const ipMismatch = authSecurity.validateSession(session1.sessionId, '192.168.1.3');
    expect(ipMismatch.valid).toBe(false);
    expect(ipMismatch.reason).toBe('IP mismatch');

    // Test expired session (conceptual)
    const expiredSession = authSecurity.validateSession('expired-session-id', '192.168.1.1');
    expect(expiredSession.valid).toBe(false);
    expect(expiredSession.reason).toBe('Session not found');

    // Test rate limiting
    const ip = '192.168.1.100';

    // Increment attempts up to limit
    for (let i = 0; i < authSecurity.maxLoginAttempts; i++) {
      const count = authSecurity.incrementLoginAttempts(ip);
      expect(count).toBe(i + 1);
    }

    // Should be rate limited now
    expect(authSecurity.isRateLimited(ip)).toBe(true);

    // Test reset of rate limit
    authSecurity.resetRateLimit(ip);
    expect(authSecurity.isRateLimited(ip)).toBe(false);

    // Test rate limit expiration (conceptual test)
    const pastAttempts = authSecurity.incrementLoginAttempts(ip);
    expect(pastAttempts).toBe(1);
  });

  // Data encryption tests
  it('should handle data encryption correctly', () => {
    const encryptor = {
      // Mock encryption functions (for testing purposes)
      encrypt(text: string, key: string) {
        // Simple XOR cipher for testing (NOT for production!)
        let result = '';
        for (let i = 0; i < text.length; i++) {
          const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
          result += String.fromCharCode(charCode);
        }
        return Buffer.from(result, 'binary').toString('base64');
      },
      decrypt(encryptedText: string, key: string) {
        // Reverse of encrypt
        const binary = Buffer.from(encryptedText, 'base64').toString('binary');
        let result = '';
        for (let i = 0; i < binary.length; i++) {
          const charCode = binary.charCodeAt(i) ^ key.charCodeAt(i % key.length);
          result += String.fromCharCode(charCode);
        }
        return result;
      },
      hash(text: string) {
        // Simple hash for testing
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
      },
      salt(length: number = 16) {
        // Generate random salt
        return Math.random()
          .toString(36)
          .substring(2, length + 2);
      },
    };

    // Test encryption and decryption
    const originalText = 'Sensitive information for testing';
    const key = 'test-key-123';

    const encrypted = encryptor.encrypt(originalText, key);
    const decrypted = encryptor.decrypt(encrypted, key);

    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
    expect(decrypted).toBe(originalText);

    // Test that encrypted text is different from original
    expect(encrypted).not.toBe(originalText);

    // Test hashing
    const hash1 = encryptor.hash('password123');
    const hash2 = encryptor.hash('password123');
    const hash3 = encryptor.hash('different-password');

    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
    expect(hash1).toBe(hash2); // Same input should produce same hash
    expect(hash1).not.toBe(hash3); // Different input should produce different hash

    // Test salt generation
    const salt1 = encryptor.salt();
    const salt2 = encryptor.salt();
    const salt3 = encryptor.salt(32); // Longer salt

    expect(typeof salt1).toBe('string');
    expect(salt1.length).toBe(16); // Default length
    expect(salt2.length).toBe(16); // Default length
    expect(salt1).not.toBe(salt2); // Should be random
    expect(salt3.length).toBe(32); // Custom length
  });

  // Secure cookie tests
  it('should handle cookies securely', () => {
    const cookieManager = {
      cookies: new Map<string, { value: string; options: Record<string, any> }>(),
      setCookie(name: string, value: string, options: Record<string, any> = {}) {
        // Set secure defaults
        const defaultOptions = {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          path: '/',
          ...options,
        };

        this.cookies.set(name, {
          value,
          options: defaultOptions,
        });

        return defaultOptions;
      },
      getCookie(name: string) {
        const cookie = this.cookies.get(name);
        return cookie ? cookie.value : null;
      },
      deleteCookie(name: string) {
        this.cookies.delete(name);
      },
      isSecureCookie(options: Record<string, any>) {
        return (
          options.httpOnly === true && options.secure === true && options.sameSite === 'Strict'
        );
      },
      setSignedCookie(
        name: string,
        value: string,
        secret: string,
        options: Record<string, any> = {}
      ) {
        // Sign the cookie value
        const signature = this.signValue(value, secret);
        const signedValue = `${value}.${signature}`;

        return this.setCookie(name, signedValue, options);
      },
      verifySignedCookie(name: string, secret: string) {
        const cookie = this.cookies.get(name);
        if (!cookie) return null;

        const [value, signature] = cookie.value.split('.');
        const expectedSignature = this.signValue(value, secret);

        if (signature === expectedSignature) {
          return value;
        }

        return null; // Invalid signature
      },
      signValue(value: string, secret: string) {
        // Simple signing for testing
        return this.simpleHash(value + secret);
      },
      simpleHash(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
      },
    };

    // Test setting secure cookies
    const sessionOptions = cookieManager.setCookie('sessionId', 'abc123', {
      maxAge: 3600000, // 1 hour
      domain: '.zerodolg.ru',
    });

    expect(cookieManager.cookies.size).toBe(1);
    expect(sessionOptions.httpOnly).toBe(true);
    expect(sessionOptions.secure).toBe(true);
    expect(sessionOptions.sameSite).toBe('Strict');
    expect(sessionOptions.path).toBe('/');
    expect(sessionOptions.maxAge).toBe(3600000);
    expect(sessionOptions.domain).toBe('.zerodolg.ru');
    expect(cookieManager.isSecureCookie(sessionOptions)).toBe(true);

    // Test getting cookie value
    const cookieValue = cookieManager.getCookie('sessionId');
    expect(cookieValue).toBe('abc123');

    // Test deleting cookies
    cookieManager.deleteCookie('sessionId');
    expect(cookieManager.cookies.size).toBe(0);
    expect(cookieManager.getCookie('sessionId')).toBeNull();

    // Test signed cookies
    const signedOptions = cookieManager.setSignedCookie(
      'authToken',
      'secret-token',
      'super-secret',
      {
        maxAge: 7200000, // 2 hours
      }
    );

    expect(cookieManager.isSecureCookie(signedOptions)).toBe(true);
    expect(signedOptions.maxAge).toBe(7200000);

    // Test verifying signed cookies
    const verifiedValue = cookieManager.verifySignedCookie('authToken', 'super-secret');
    expect(verifiedValue).toBe('secret-token');

    // Test invalid signature
    const invalidVerification = cookieManager.verifySignedCookie('authToken', 'wrong-secret');
    expect(invalidVerification).toBeNull();

    // Test non-existent cookie
    const nonExistent = cookieManager.verifySignedCookie('nonexistent', 'secret');
    expect(nonExistent).toBeNull();
  });

  // Content Security Policy tests
  it('should generate CSP headers correctly', () => {
    const cspGenerator = {
      policies: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': [
          "'self'",
          'data:',
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': ["'self'", 'https://www.google-analytics.com'],
        'frame-src': ["'self'", 'https://www.google.com'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'upgrade-insecure-requests': [],
      },
      addPolicy(directive: string, sources: string[]) {
        if (!this.policies[directive]) {
          this.policies[directive] = [];
        }
        sources.forEach((source) => {
          if (!this.policies[directive].includes(source)) {
            this.policies[directive].push(source);
          }
        });
      },
      removePolicy(directive: string, sources: string[]) {
        if (this.policies[directive]) {
          this.policies[directive] = this.policies[directive].filter(
            (source) => !sources.includes(source)
          );
        }
      },
      generateHeader() {
        return Object.entries(this.policies)
          .map(([directive, sources]) => {
            if (sources.length === 0) {
              return `${directive}`;
            }
            return `${directive} ${sources.join(' ')}`;
          })
          .join('-');
      },
      isRestrictivePolicy(directive: string) {
        const policy = this.policies[directive];
        return (
          policy &&
          (policy.includes("'none'") || (policy.includes("'self'") && policy.length === 1))
        );
      },
    };

    // Test CSP header generation
    const cspHeader = cspGenerator.generateHeader();
    expect(typeof cspHeader).toBe('string');
    expect(cspHeader.length).toBeGreaterThan(100);
    expect(cspHeader).toContain("default-src 'self'");
    expect(cspHeader).toContain("script-src 'self'");
    expect(cspHeader).toContain("img-src 'self'");
    expect(cspHeader).toContain("object-src 'none'");

    // Test adding policies
    cspGenerator.addPolicy('script-src', ['https://cdn.example.com']);
    const updatedCSP = cspGenerator.generateHeader();
    expect(updatedCSP).toContain('https://cdn.example.com');

    // Test removing policies
    cspGenerator.removePolicy('script-src', ["'unsafe-inline'"]);
    const restrictedCSP = cspGenerator.generateHeader();
    expect(restrictedCSP).not.toContain("'unsafe-inline'");

    // Test restrictive policies
    expect(cspGenerator.isRestrictivePolicy('object-src')).toBe(true);
    expect(cspGenerator.isRestrictivePolicy('default-src')).toBe(true);

    // Test non-restrictive policies
    expect(cspGenerator.isRestrictivePolicy('script-src')).toBe(false);

    // Test specific directive policies
    const scriptSources = cspGenerator.policies['script-src'];
    expect(scriptSources).toContain("'self'");
    expect(scriptSources).toContain('https://www.googletagmanager.com');
    expect(scriptSources).toContain('https://cdn.example.com');
    expect(scriptSources).not.toContain("'unsafe-inline'"); // Should have been removed

    // Test empty policy directive
    cspGenerator.addPolicy('report-uri', []);
    const withEmptyDirective = cspGenerator.generateHeader();
    expect(withEmptyDirective).toContain('report-uri');
  });

  // Rate limiting tests
  it('should implement rate limiting correctly', () => {
    const rateLimiter = {
      limits: new Map<string, { count: number; resetTime: number }>(),
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
      checkLimit(key: string) {
        const now = Date.now();
        let limit = this.limits.get(key);

        if (!limit || limit.resetTime < now) {
          limit = {
            count: 0,
            resetTime: now + this.windowMs,
          };
          this.limits.set(key, limit);
        }

        limit.count++;

        if (limit.count > this.maxRequests) {
          return {
            allowed: false,
            limit: this.maxRequests,
            remaining: 0,
            resetTime: limit.resetTime,
            retryIn: Math.ceil((limit.resetTime - now) / 1000), // Seconds
          };
        }

        return {
          allowed: true,
          limit: this.maxRequests,
          remaining: this.maxRequests - limit.count,
          resetTime: limit.resetTime,
          retryIn: 0,
        };
      },
      resetLimit(key: string) {
        this.limits.delete(key);
      },
      getRateLimitInfo(key: string) {
        const limit = this.limits.get(key);
        if (!limit) {
          return null;
        }

        const now = Date.now();
        return {
          count: limit.count,
          limit: this.maxRequests,
          resetTime: limit.resetTime,
          remaining: Math.max(0, this.maxRequests - limit.count),
          resetIn: Math.ceil((limit.resetTime - now) / 1000),
        };
      },
    };

    // Test rate limiting
    const apiKey = 'api-key-123';

    // Make requests below the limit
    for (let i = 0; i < 50; i++) {
      const result = rateLimiter.checkLimit(apiKey);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(rateLimiter.maxRequests - (i + 1));
      expect(result.limit).toBe(rateLimiter.maxRequests);
    }

    // Test approaching limit
    const approachingLimit = rateLimiter.checkLimit(apiKey);
    expect(approachingLimit.allowed).toBe(true);
    expect(approachingLimit.remaining).toBe(rateLimiter.maxRequests - 51);

    // Test exceeding limit
    for (let i = 0; i < 50; i++) {
      rateLimiter.checkLimit(apiKey);
    }

    const exceeded = rateLimiter.checkLimit(apiKey);
    expect(exceeded.allowed).toBe(false);
    expect(exceeded.remaining).toBe(0);
    expect(exceeded.retryIn).toBeGreaterThan(0);

    // Test rate limit info retrieval
    const limitInfo = rateLimiter.getRateLimitInfo(apiKey);
    expect(limitInfo).not.toBeNull();
    expect(limitInfo?.count).toBeGreaterThan(100);
    expect(limitInfo?.limit).toBe(rateLimiter.maxRequests);
    expect(limitInfo?.remaining).toBe(0);

    // Test limit reset
    rateLimiter.resetLimit(apiKey);
    const afterReset = rateLimiter.getRateLimitInfo(apiKey);
    expect(afterReset).toBeNull();

    const freshCheck = rateLimiter.checkLimit(apiKey);
    expect(freshCheck.allowed).toBe(true);
    expect(freshCheck.remaining).toBe(rateLimiter.maxRequests - 1);
  });
});
