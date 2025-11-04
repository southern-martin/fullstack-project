import { Injectable } from '@nestjs/common';

/**
 * Security Service
 * Handles security-related operations and validations
 * Follows Clean Architecture principles
 */
@Injectable()
export class SecurityService {
  /**
   * Rate limiting configurations
   */
  private readonly rateLimits = {
    login: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
    },
    passwordReset: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours
    },
    registration: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  /**
   * Security headers for responses
   */
  private readonly securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  /**
   * Checks if an IP address is suspicious
   * @param ip - IP address
   * @param attempts - Number of attempts
   * @param timeWindow - Time window in milliseconds
   * @returns True if IP is suspicious
   */
  isSuspiciousIp(ip: string, attempts: number, timeWindow: number): boolean {
    // Basic rate limiting check
    const maxAttemptsPerWindow = 10; // Configurable
    return attempts > maxAttemptsPerWindow;
  }

  /**
   * Generates a secure random token
   * @param length - Token length in bytes
   * @returns Secure random token
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Generates a secure random hexadecimal token
   * @param length - Token length in bytes
   * @returns Secure random hex token
   */
  generateSecureHexToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Checks if a password meets security requirements
   * @param password - Password to check
   * @returns Security check result
   */
  checkPasswordSecurity(password: string): {
    isSecure: boolean;
    score: number; // 0-100
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      issues.push('Password is too short (minimum 8 characters)');
      suggestions.push('Use at least 8 characters');
    } else if (password.length < 12) {
      score += 20;
      suggestions.push('Consider using 12 or more characters for better security');
    } else {
      score += 40;
    }

    // Character variety checks
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLowercase) {
      issues.push('Password should contain lowercase letters');
      suggestions.push('Add lowercase letters (a-z)');
    } else {
      score += 15;
    }

    if (!hasUppercase) {
      issues.push('Password should contain uppercase letters');
      suggestions.push('Add uppercase letters (A-Z)');
    } else {
      score += 15;
    }

    if (!hasNumbers) {
      issues.push('Password should contain numbers');
      suggestions.push('Add numbers (0-9)');
    } else {
      score += 15;
    }

    if (!hasSpecial) {
      issues.push('Password should contain special characters');
      suggestions.push('Add special characters (!@#$%^&*(),.?":{}|<>)');
    } else {
      score += 15;
    }

    // Common patterns check
    if (this.hasCommonPatterns(password)) {
      issues.push('Password contains common patterns');
      suggestions.push('Avoid common patterns like "123", "abc", sequential characters');
      score -= 20;
    }

    // Repeated characters check
    if (this.hasRepeatedPatterns(password)) {
      issues.push('Password contains repeated characters');
      suggestions.push('Avoid repeating characters (e.g., "aaa", "111")');
      score -= 15;
    }

    // Ensure score doesn't go negative
    score = Math.max(0, Math.min(100, score));

    return {
      isSecure: score >= 70 && issues.length === 0,
      score,
      issues,
      suggestions,
    };
  }

  /**
   * Checks if password contains common patterns
   * @param password - Password to check
   * @returns True if common patterns found
   */
  private hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      '123', 'abc', 'qwe', 'asd', 'zxc', 'password',
      'admin', 'user', 'login', 'welcome', 'letmein'
    ];

    const lowerPassword = password.toLowerCase();
    return commonPatterns.some(pattern => lowerPassword.includes(pattern));
  }

  /**
   * Checks if password contains repeated patterns
   * @param password - Password to check
   * @returns True if repeated patterns found
   */
  private hasRepeatedPatterns(password: string): boolean {
    // Check for 3 or more consecutive same characters
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }

    // Check for 3 or more sequential characters
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets rate limit configuration for a specific action
   * @param action - Action type (login, passwordReset, registration)
   * @returns Rate limit configuration
   */
  getRateLimitConfig(action: keyof typeof this.rateLimits) {
    return this.rateLimits[action];
  }

  /**
   * Checks if rate limit is exceeded
   * @param action - Action type
   * @param attempts - Number of attempts
   * @param lastAttempt - Last attempt timestamp
   * @returns Rate limit status
   */
  checkRateLimit(action: keyof typeof this.rateLimits, attempts: number, lastAttempt: Date): {
    isBlocked: boolean;
    remainingAttempts: number;
    resetTime: Date;
    blockDuration: number;
  } {
    const config = this.getRateLimitConfig(action);
    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - lastAttempt.getTime();

    let remainingAttempts = Math.max(0, config.maxAttempts - attempts);
    let isBlocked = attempts >= config.maxAttempts && timeSinceLastAttempt < config.blockDurationMs;

    // If block duration has passed, reset the counter
    if (timeSinceLastAttempt >= config.blockDurationMs) {
      remainingAttempts = config.maxAttempts;
      isBlocked = false;
    }

    const resetTime = isBlocked
      ? new Date(lastAttempt.getTime() + config.blockDurationMs)
      : new Date(now.getTime() + config.windowMs);

    return {
      isBlocked,
      remainingAttempts,
      resetTime,
      blockDuration: config.blockDurationMs,
    };
  }

  /**
   * Gets security headers for HTTP responses
   * @returns Security headers object
   */
  getSecurityHeaders(): Record<string, string> {
    return { ...this.securityHeaders };
  }

  /**
   * Validates email for security issues
   * @param email - Email to validate
   * @returns Email security validation result
   */
  validateEmailSecurity(email: string): {
    isValid: boolean;
    isDisposable: boolean;
    isSuspicious: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    let isDisposable = false;
    let isSuspicious = false;

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      issues.push('Invalid email format');
    }

    // Check for disposable email domains
    const disposableDomains = [
      'temp-mail.org', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'yopmail.com',
      'tempmail.org', 'maildrop.cc'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      isDisposable = true;
      issues.push('Disposable email addresses are not allowed');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\+\d+@/, // Email with phone number
      /(test|demo|fake|dummy).*@/, // Test emails
      /\.xyz$/, // .xyz domains often used for testing
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      isSuspicious = true;
      issues.push('Suspicious email pattern detected');
    }

    return {
      isValid: issues.length === 0,
      isDisposable,
      isSuspicious,
      issues,
    };
  }

  /**
   * Generates a session ID with entropy
   * @returns Secure session ID
   */
  generateSessionId(): string {
    return this.generateSecureHexToken(24);
  }

  /**
   * Checks if user agent is suspicious (basic implementation)
   * @param userAgent - User agent string
   * @returns True if user agent is suspicious
   */
  isSuspiciousUserAgent(userAgent: string): boolean {
    if (!userAgent) return true;

    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Sanitizes input to prevent injection attacks
   * @param input - Input to sanitize
   * @returns Sanitized input
   */
  sanitizeInput(input: string): string {
    if (!input) return '';

    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validates that a session is valid and not expired
   * @param sessionStart - Session start time
   * @param maxSessionDuration - Maximum session duration in milliseconds
   * @returns True if session is valid
   */
  isSessionValid(sessionStart: Date, maxSessionDuration: number = 3600000): boolean {
    const now = new Date();
    const sessionAge = now.getTime() - sessionStart.getTime();
    return sessionAge < maxSessionDuration;
  }
}
