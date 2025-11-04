import { Injectable } from '@nestjs/common';
import { LoginCredentials, RegistrationData } from '../interfaces/validation.interface';

/**
 * Validation Result Interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: Record<string, string>;
}

/**
 * Auth Validation Service
 * Handles all authentication-related validation logic
 * Follows Clean Architecture principles
 */
@Injectable()
export class AuthValidationService {
  /**
   * Validates login credentials
   * @param credentials - Login credentials to validate
   * @returns Validation result
   */
  validateLoginCredentials(credentials: LoginCredentials): ValidationResult {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};

    // Email validation
    if (!credentials.email) {
      fieldErrors.email = 'Email is required';
      errors.push('Email is required');
    } else if (!this.isValidEmail(credentials.email)) {
      fieldErrors.email = 'Invalid email format';
      errors.push('Invalid email format');
    }

    // Password validation
    if (!credentials.password) {
      fieldErrors.password = 'Password is required';
      errors.push('Password is required');
    } else if (credentials.password.length < 1) {
      fieldErrors.password = 'Password cannot be empty';
      errors.push('Password cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }

  /**
   * Validates registration data
   * @param data - Registration data to validate
   * @returns Validation result
   */
  validateRegistrationData(data: RegistrationData): ValidationResult {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};

    // Email validation
    if (!data.email) {
      fieldErrors.email = 'Email is required';
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      fieldErrors.email = 'Invalid email format';
      errors.push('Invalid email format');
    } else if (this.isRestrictedEmailDomain(data.email)) {
      fieldErrors.email = 'Temporary email addresses are not allowed';
      errors.push('Temporary email addresses are not allowed');
    }

    // Password validation
    if (!data.password) {
      fieldErrors.password = 'Password is required';
      errors.push('Password is required');
    } else {
      const passwordValidation = this.validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        fieldErrors.password = passwordValidation.errors.join(', ');
        errors.push(...passwordValidation.errors);
      }
    }

    // First name validation
    if (!data.firstName) {
      fieldErrors.firstName = 'First name is required';
      errors.push('First name is required');
    } else if (data.firstName.length < 2) {
      fieldErrors.firstName = 'First name must be at least 2 characters';
      errors.push('First name must be at least 2 characters');
    }

    // Last name validation
    if (!data.lastName) {
      fieldErrors.lastName = 'Last name is required';
      errors.push('Last name is required');
    } else if (data.lastName.length < 2) {
      fieldErrors.lastName = 'Last name must be at least 2 characters';
      errors.push('Last name must be at least 2 characters');
    }

    // Phone validation (optional but if provided, must be valid)
    if (data.phone && !this.isValidPhoneNumber(data.phone)) {
      fieldErrors.phone = 'Invalid phone number format';
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }

  /**
   * Validates password strength
   * @param password - Password to validate
   * @returns Validation result
   */
  validatePasswordStrength(password: string): ValidationResult {
    const errors: string[] = [];

    // Length validation
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Complexity validation
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Common passwords check
    const commonPasswords = [
      'password',
      '123456',
      'admin',
      'qwerty',
      'letmein',
      'welcome',
      'monkey',
      'dragon',
      'football',
      'baseball',
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common. Please choose a more secure password.');
    }

    // Sequential characters check
    if (this.hasSequentialCharacters(password)) {
      errors.push('Password should not contain sequential characters (e.g., "123", "abc")');
    }

    // Repeated characters check
    if (this.hasRepeatedCharacters(password)) {
      errors.push('Password should not contain repeated characters (e.g., "aaa", "111")');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates email format
   * @param email - Email to validate
   * @returns True if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Checks if email domain is restricted
   * @param email - Email to check
   * @returns True if email domain is restricted
   */
  private isRestrictedEmailDomain(email: string): boolean {
    const restrictedDomains = [
      'temp-mail.org',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'throwaway.email',
      'yopmail.com',
      'tempmail.org',
      'maildrop.cc',
    ];

    const emailDomain = email.split('@')[1]?.toLowerCase();
    return restrictedDomains.includes(emailDomain);
  }

  /**
   * Validates phone number format
   * @param phone - Phone number to validate
   * @returns True if phone number is valid
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation - can be enhanced based on requirements
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  /**
   * Checks for sequential characters in password
   * @param password - Password to check
   * @returns True if sequential characters found
   */
  private hasSequentialCharacters(password: string): boolean {
    const lowerPassword = password.toLowerCase();

    // Check for numeric sequences
    for (let i = 0; i < lowerPassword.length - 2; i++) {
      const char1 = lowerPassword.charCodeAt(i);
      const char2 = lowerPassword.charCodeAt(i + 1);
      const char3 = lowerPassword.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks for repeated characters in password
   * @param password - Password to check
   * @returns True if repeated characters found
   */
  private hasRepeatedCharacters(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }
    return false;
  }
}
