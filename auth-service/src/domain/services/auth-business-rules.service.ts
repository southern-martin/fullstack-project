import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

/**
 * Auth Business Rules Service
 * Handles authentication business logic and rules
 * Follows Clean Architecture principles
 */
@Injectable()
export class AuthBusinessRulesService {
  /**
   * Session timeout in seconds (default 1 hour)
   */
  private readonly sessionTimeout = 3600;

  /**
   * Maximum failed login attempts before account lock
   */
  private readonly maxFailedAttempts = 5;

  /**
   * Account lock duration in minutes
   */
  private readonly accountLockDuration = 30;

  /**
   * Checks if a user can authenticate
   * @param user - User entity
   * @returns True if user can authenticate
   */
  canUserAuthenticate(user: User): boolean {
    // Check if user is active
    if (!user.isActive) {
      return false;
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return false;
    }

    // Check if account is locked (simplified - would need failedLoginAttempts field)
    // if (this.isAccountLocked(user.failedLoginAttempts || 0)) {
    //   return false;
    // }

    return true;
  }

  /**
   * Checks if account is locked due to failed attempts
   * @param failedAttempts - Number of failed login attempts
   * @returns True if account is locked
   */
  isAccountLocked(failedAttempts: number): boolean {
    return failedAttempts >= this.maxFailedAttempts;
  }

  /**
   * Gets session timeout in seconds
   * @returns Session timeout in seconds
   */
  getSessionTimeout(): number {
    return this.sessionTimeout;
  }

  /**
   * Gets maximum failed login attempts
   * @returns Maximum failed attempts
   */
  getMaxFailedAttempts(): number {
    return this.maxFailedAttempts;
  }

  /**
   * Gets account lock duration in minutes
   * @returns Account lock duration
   */
  getAccountLockDuration(): number {
    return this.accountLockDuration;
  }

  /**
   * Checks if password change is required
   * @param user - User entity
   * @returns True if password change is required
   */
  isPasswordChangeRequired(user: User): boolean {
    // Check if password was changed more than 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    if (user.passwordChangedAt && user.passwordChangedAt < ninetyDaysAgo) {
      return true;
    }

    // Check if it's a new user (password never changed)
    if (!user.passwordChangedAt && user.createdAt) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return user.createdAt < thirtyDaysAgo;
    }

    return false;
  }

  /**
   * Checks if user session is still valid
   * @param lastLogin - Last login timestamp
   * @returns True if session is valid
   */
  isSessionValid(lastLogin: Date): boolean {
    if (!lastLogin) {
      return false;
    }

    const now = new Date();
    const sessionExpiry = new Date(lastLogin.getTime() + (this.sessionTimeout * 1000));

    return now < sessionExpiry;
  }

  /**
   * Calculates session expiry time
   * @param lastLogin - Last login timestamp
   * @returns Session expiry time
   */
  getSessionExpiryTime(lastLogin: Date): Date {
    if (!lastLogin) {
      return new Date();
    }

    return new Date(lastLogin.getTime() + (this.sessionTimeout * 1000));
  }

  /**
   * Checks if user should be forced to re-authenticate
   * @param user - User entity
   * @param lastLogin - Last login timestamp
   * @returns True if re-authentication is required
   */
  shouldReAuthenticate(user: User, lastLogin: Date): boolean {
    // Check if session is expired
    if (!this.isSessionValid(lastLogin)) {
      return true;
    }

    // Check if password change is required
    if (this.isPasswordChangeRequired(user)) {
      return true;
    }

    // Check if security settings require re-authentication
    // This could be extended to check for security flags, role changes, etc.

    return false;
  }

  /**
   * Validates authentication attempt frequency
   * @param lastLogin - Last login timestamp
   * @param maxAttemptsPerMinute - Maximum attempts per minute (default 5)
   * @returns True if attempt is allowed
   */
  isAuthenticationAttemptAllowed(lastLogin: Date | null, maxAttemptsPerMinute: number = 5): boolean {
    if (!lastLogin) {
      return true;
    }

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - (60 * 1000));

    // If last login was more than a minute ago, allow the attempt
    return lastLogin < oneMinuteAgo;
  }

  /**
   * Gets security level requirements for user
   * @param user - User entity
   * @returns Security requirements
   */
  getSecurityRequirements(user: User): {
    requiresTwoFactor: boolean;
    requiresStrongPassword: boolean;
    sessionTimeout: number;
    maxConcurrentSessions: number;
  } {
    // Base requirements
    const requirements = {
      requiresTwoFactor: false,
      requiresStrongPassword: true,
      sessionTimeout: this.sessionTimeout,
      maxConcurrentSessions: 3,
    };

    // Enhanced security for admin users
    if (user.roles?.some(role => role.name.toLowerCase().includes('admin'))) {
      requirements.requiresTwoFactor = true;
      requirements.sessionTimeout = 1800; // 30 minutes for admins
      requirements.maxConcurrentSessions = 1;
    }

    // Enhanced security for users with sensitive roles
    if (user.roles?.some(role =>
      role.name.toLowerCase().includes('super') ||
      role.name.toLowerCase().includes('root')
    )) {
      requirements.requiresTwoFactor = true;
      requirements.sessionTimeout = 900; // 15 minutes for super users
      requirements.maxConcurrentSessions = 1;
    }

    return requirements;
  }
}
