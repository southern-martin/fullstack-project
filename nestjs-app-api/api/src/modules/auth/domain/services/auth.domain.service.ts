import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

/**
 * AuthDomainService
 * 
 * This service encapsulates the core business logic and rules related to authentication.
 * It operates on User and Role entities and ensures that business rules are enforced
 * independently of application-specific concerns (like data storage or UI).
 */
@Injectable()
export class AuthDomainService {
  /**
   * Validates user registration data against business rules.
   * @param userData Partial user data for registration.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateUserRegistrationData(userData: Partial<User>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email address is required');
    }

    // Password validation
    if (!userData.password || !this.isValidPassword(userData.password)) {
      errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Name validation
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Phone validation (optional but if provided, must be valid)
    if (userData.phone && !this.isValidPhone(userData.phone)) {
      errors.push('Phone number must be in valid format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates login credentials against business rules.
   * @param email User email.
   * @param password User password.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateLoginCredentials(email: string, password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!email || !this.isValidEmail(email)) {
      errors.push('Valid email address is required');
    }

    if (!password || password.trim().length === 0) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates if a user can be authenticated.
   * @param user The user entity.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateUserAuthentication(user: User): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!user.isActive) {
      errors.push('User account is deactivated');
    }

    if (!user.isEmailVerified) {
      errors.push('Email address is not verified');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generates a secure password hash.
   * @param password Plain text password.
   * @returns Hashed password.
   */
  generatePasswordHash(password: string): string {
    // In a real application, use bcrypt or similar
    // This is a placeholder implementation
    const crypto = require('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verifies a password against its hash.
   * @param password Plain text password.
   * @param hash Stored password hash.
   * @returns True if password matches, false otherwise.
   */
  verifyPassword(password: string, hash: string): boolean {
    // In a real application, use bcrypt or similar
    // This is a placeholder implementation
    const crypto = require('crypto');
    const [salt, storedHash] = hash.split(':');
    const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return computedHash === storedHash;
  }

  /**
   * Generates a JWT token payload for a user.
   * @param user The user entity.
   * @returns JWT payload object.
   */
  generateJwtPayload(user: User): {
    sub: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
  } {
    const roles = user.roles?.map(role => role.name) || [];
    const permissions = user.roles?.flatMap(role => role.permissions || []) || [];

    return {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions,
    };
  }

  /**
   * Determines if a user has a specific role.
   * @param user The user entity.
   * @param roleName The role name to check.
   * @returns True if user has the role, false otherwise.
   */
  hasRole(user: User, roleName: string): boolean {
    return user.roles?.some(role => role.name === roleName) || false;
  }

  /**
   * Determines if a user has a specific permission.
   * @param user The user entity.
   * @param permission The permission to check.
   * @returns True if user has the permission, false otherwise.
   */
  hasPermission(user: User, permission: string): boolean {
    return user.roles?.some(role => 
      role.permissions?.includes(permission)
    ) || false;
  }

  /**
   * Determines if a user is an admin.
   * @param user The user entity.
   * @returns True if user is admin, false otherwise.
   */
  isAdmin(user: User): boolean {
    return this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin');
  }

  /**
   * Determines if a user can manage other users.
   * @param user The user entity.
   * @returns True if user can manage users, false otherwise.
   */
  canManageUsers(user: User): boolean {
    return this.hasPermission(user, 'users.manage') || this.isAdmin(user);
  }

  // --- Private Helper Methods for Validation ---

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private isValidPhone(phone: string): boolean {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}
