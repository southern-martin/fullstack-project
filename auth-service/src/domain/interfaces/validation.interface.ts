/**
 * Authentication validation interfaces
 * Follows Clean Architecture principles
 */

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleIds?: number[];
}

/**
 * Token validation result interface
 */
export interface TokenValidationResult {
  isValid: boolean;
  userId?: number;
  email?: string;
  roles?: string[];
  permissions?: string[];
  error?: string;
  expiresAt?: Date;
}

/**
 * Password validation result interface
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
  suggestions: string[];
  errors: string[];
}

/**
 * Email validation result interface
 */
export interface EmailValidationResult {
  isValid: boolean;
  isDisposable: boolean;
  isBusiness: boolean;
  domain: string;
  suggestions?: string[];
}
