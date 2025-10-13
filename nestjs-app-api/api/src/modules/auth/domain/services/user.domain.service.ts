import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

/**
 * UserDomainService
 * 
 * This service encapsulates the core business logic and rules related to user management.
 * It operates on User and Role entities and ensures that business rules are enforced
 * independently of application-specific concerns (like data storage or UI).
 */
@Injectable()
export class UserDomainService {
  /**
   * Validates user creation data against business rules.
   * @param userData Partial user data for creation.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateUserCreationData(userData: Partial<User>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email address is required');
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

    // Date of birth validation (optional but if provided, must be valid)
    if (userData.dateOfBirth && !this.isValidDateOfBirth(userData.dateOfBirth)) {
      errors.push('Date of birth must be a valid date and user must be at least 13 years old');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates user update data against business rules.
   * @param updateData Partial user data for update.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateUserUpdateData(updateData: Partial<User>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation (if being updated)
    if (updateData.email !== undefined && !this.isValidEmail(updateData.email)) {
      errors.push('Valid email address is required');
    }

    // Name validation (if being updated)
    if (updateData.firstName !== undefined) {
      if (!updateData.firstName || updateData.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters');
      }
    }

    if (updateData.lastName !== undefined) {
      if (!updateData.lastName || updateData.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters');
      }
    }

    // Phone validation (if being updated)
    if (updateData.phone !== undefined && updateData.phone && !this.isValidPhone(updateData.phone)) {
      errors.push('Phone number must be in valid format');
    }

    // Date of birth validation (if being updated)
    if (updateData.dateOfBirth !== undefined && updateData.dateOfBirth && !this.isValidDateOfBirth(updateData.dateOfBirth)) {
      errors.push('Date of birth must be a valid date and user must be at least 13 years old');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Normalizes user data for consistent storage.
   * @param userData User data to normalize.
   * @returns Normalized user data.
   */
  normalizeUserData(userData: Partial<User>): Partial<User> {
    const normalized = { ...userData };

    // Normalize email
    if (normalized.email) {
      normalized.email = normalized.email.toLowerCase().trim();
    }

    // Normalize names
    if (normalized.firstName) {
      normalized.firstName = normalized.firstName.trim();
    }

    if (normalized.lastName) {
      normalized.lastName = normalized.lastName.trim();
    }

    // Normalize phone
    if (normalized.phone) {
      normalized.phone = normalized.phone.trim();
    }

    return normalized;
  }

  /**
   * Calculates user's full name.
   * @param user The user entity.
   * @returns Full name string.
   */
  calculateFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  /**
   * Determines if a user can be deleted.
   * @param user The user entity.
   * @returns True if user can be deleted, false otherwise.
   */
  canDeleteUser(user: User): boolean {
    // Business rule: Cannot delete admin users
    if (this.isAdmin(user)) {
      return false;
    }

    // Business rule: Cannot delete users with recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (user.lastLoginAt && user.lastLoginAt > thirtyDaysAgo) {
      return false;
    }

    return true;
  }

  /**
   * Determines if a user can be deactivated.
   * @param user The user entity.
   * @returns True if user can be deactivated, false otherwise.
   */
  canDeactivateUser(user: User): boolean {
    // Business rule: Cannot deactivate admin users
    if (this.isAdmin(user)) {
      return false;
    }

    return true;
  }

  /**
   * Determines if a user can be activated.
   * @param user The user entity.
   * @returns True if user can be activated, false otherwise.
   */
  canActivateUser(user: User): boolean {
    // Business rule: Can always activate users (unless they're already active)
    return !user.isActive;
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

  /**
   * Determines if a user can view other users.
   * @param user The user entity.
   * @returns True if user can view users, false otherwise.
   */
  canViewUsers(user: User): boolean {
    return this.hasPermission(user, 'users.view') || this.isAdmin(user);
  }

  /**
   * Determines if a user can edit another user.
   * @param currentUser The current user.
   * @param targetUser The user to be edited.
   * @returns True if current user can edit target user, false otherwise.
   */
  canEditUser(currentUser: User, targetUser: User): boolean {
    // Users can always edit themselves
    if (currentUser.id === targetUser.id) {
      return true;
    }

    // Admins can edit any user
    if (this.isAdmin(currentUser)) {
      return true;
    }

    // Users with manage permission can edit non-admin users
    if (this.hasPermission(currentUser, 'users.manage') && !this.isAdmin(targetUser)) {
      return true;
    }

    return false;
  }

  // --- Private Helper Methods for Validation ---

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private isValidDateOfBirth(dateOfBirth: Date): boolean {
    const now = new Date();
    const age = now.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = now.getMonth() - dateOfBirth.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate()) 
      ? age - 1 
      : age;

    // Must be at least 13 years old
    return actualAge >= 13;
  }
}
