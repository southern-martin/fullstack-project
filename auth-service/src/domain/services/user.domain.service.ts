import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

/**
 * Domain service for user business logic
 * Contains pure business rules without infrastructure concerns
 */
@Injectable()
export class UserDomainService {

  /**
   * Validates user creation data
   * Business rule: All required fields must be present and valid
   */
  validateUserCreationData(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    // Password validation
    if (!userData.password || !this.isPasswordStrong(userData.password)) {
      errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Name validation
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Phone validation (optional)
    if (userData.phone && !this.isValidPhone(userData.phone)) {
      errors.push('Phone number format is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determines default user role
   * Business rule: New users get 'user' role by default
   */
  getDefaultUserRole(): string {
    return 'user';
  }

  /**
   * Validates role assignment
   * Business rule: Only admin can assign admin roles
   */
  canAssignRole(assigner: User, targetRole: string): boolean {
    // Super admin can assign any role
    if (this.hasRole(assigner, 'super_admin')) {
      return true;
    }

    // Admin can assign user roles but not super_admin
    if (this.hasRole(assigner, 'admin') && targetRole !== 'super_admin') {
      return true;
    }

    // Regular users cannot assign roles
    return false;
  }

  /**
   * Determines if user can be deactivated
   * Business rule: Cannot deactivate last super admin
   */
  canDeactivateUser(user: User, allUsers: User[]): boolean {
    if (!this.hasRole(user, 'super_admin')) {
      return true;
    }

    // Check if this is the last super admin
    const superAdmins = allUsers.filter(u => 
      this.hasRole(u, 'super_admin') && u.isActive
    );

    return superAdmins.length > 1;
  }

  /**
   * Validates user update data
   * Business rule: Cannot update certain fields after creation
   */
  validateUserUpdateData(updateData: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email cannot be changed after creation
    if (updateData.email !== undefined) {
      errors.push('Email cannot be changed after account creation');
    }

    // Password should be updated through separate endpoint
    if (updateData.password !== undefined) {
      errors.push('Password should be updated through password change endpoint');
    }

    // Name validation
    if (updateData.firstName !== undefined && updateData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (updateData.lastName !== undefined && updateData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determines user display name
   * Business rule: Display name is first name + last name
   */
  getUserDisplayName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  /**
   * Determines if user needs email verification
   * Business rule: All new users need email verification
   */
  needsEmailVerification(user: User): boolean {
    return !user.isEmailVerified;
  }

  /**
   * Determines if user can login
   * Business rule: User must be active and email verified
   */
  canUserLogin(user: User): boolean {
    return user.isActive && user.isEmailVerified;
  }

  // Private helper methods

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isPasswordStrong(password: string): boolean {
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

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  private hasRole(user: User, roleName: string): boolean {
    return user.roles?.some(role => role.name === roleName) || false;
  }
}
