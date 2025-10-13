import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

/**
 * Domain service for authentication business logic
 * Contains pure business rules without infrastructure concerns
 */
@Injectable()
export class AuthDomainService {
  
  /**
   * Validates if a user can authenticate
   * Business rule: User must be active and email verified
   */
  canUserAuthenticate(user: User): boolean {
    return user.isActive && user.isEmailVerified;
  }

  /**
   * Determines if user has required role
   * Business rule: User must have at least one of the required roles
   */
  hasRequiredRole(user: User, requiredRoles: string[]): boolean {
    if (!user.roles || user.roles.length === 0) {
      return false;
    }

    const userRoleNames = user.roles.map(role => role.name);
    return requiredRoles.some(role => userRoleNames.includes(role));
  }

  /**
   * Determines if user has specific permission
   * Business rule: Check if user's roles contain the permission
   */
  hasPermission(user: User, permission: string): boolean {
    if (!user.roles || user.roles.length === 0) {
      return false;
    }

    return user.roles.some(role => 
      role.permissions.includes(permission) || 
      role.permissions.includes('*')
    );
  }

  /**
   * Validates password strength
   * Business rule: Password must meet security requirements
   */
  isPasswordStrong(password: string): boolean {
    // Business rules for password strength
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }

  /**
   * Validates email format
   * Business rule: Email must be valid format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Determines if user account is locked
   * Business rule: Account locked after 5 failed attempts
   */
  isAccountLocked(failedAttempts: number): boolean {
    const maxFailedAttempts = 5;
    return failedAttempts >= maxFailedAttempts;
  }

  /**
   * Calculates session timeout
   * Business rule: Session expires after 24 hours of inactivity
   */
  getSessionTimeout(): number {
    return 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  /**
   * Determines if password needs to be changed
   * Business rule: Password must be changed every 90 days
   */
  shouldChangePassword(lastPasswordChange: Date): boolean {
    const passwordExpiryDays = 90;
    const expiryDate = new Date(lastPasswordChange);
    expiryDate.setDate(expiryDate.getDate() + passwordExpiryDays);
    
    return new Date() > expiryDate;
  }

  /**
   * Validates token expiration
   * Business rule: Token expires after 1 hour
   */
  isTokenExpired(issuedAt: Date): boolean {
    const tokenLifetime = 60 * 60 * 1000; // 1 hour in milliseconds
    const expiryTime = new Date(issuedAt.getTime() + tokenLifetime);
    
    return new Date() > expiryTime;
  }
}