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
    dateOfBirth?: string;
    address?: any;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
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

    // Phone validation (optional)
    if (userData.phone && !this.isValidPhone(userData.phone)) {
      errors.push('Phone number format is invalid');
    }

    // Date of birth validation (optional)
    if (userData.dateOfBirth && !this.isValidDateOfBirth(userData.dateOfBirth)) {
      errors.push('Date of birth must be a valid date and user must be at least 13 years old');
    }

    // Address validation (optional)
    if (userData.address && !this.isValidAddress(userData.address)) {
      errors.push('Address format is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates user update data
   * Business rule: Cannot update certain fields after creation
   */
  validateUserUpdateData(updateData: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (updateData.email !== undefined && !this.isValidEmail(updateData.email)) {
      errors.push('Email format is invalid');
    }

    // Password validation
    if (updateData.password !== undefined && !this.isValidPassword(updateData.password)) {
      errors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Name validation
    if (updateData.firstName !== undefined && updateData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (updateData.lastName !== undefined && updateData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Phone validation
    if (updateData.phone !== undefined && !this.isValidPhone(updateData.phone)) {
      errors.push('Phone number format is invalid');
    }

    // Date of birth validation
    if (updateData.dateOfBirth && !this.isValidDateOfBirth(updateData.dateOfBirth.toString())) {
      errors.push('Date of birth must be a valid date and user must be at least 13 years old');
    }

    // Address validation
    if (updateData.address && !this.isValidAddress(updateData.address)) {
      errors.push('Address format is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determines if user can be deactivated
   * Business rule: Cannot deactivate user if they have active sessions
   */
  canDeactivateUser(user: User, hasActiveSessions: boolean): boolean {
    if (!hasActiveSessions) {
      return true;
    }

    // Business rule: Cannot deactivate user with active sessions
    return false;
  }

  /**
   * Determines if user can be deleted
   * Business rule: Cannot delete user if they have any data
   */
  canDeleteUser(user: User, hasAnyData: boolean): boolean {
    if (!hasAnyData) {
      return true;
    }

    // Business rule: Cannot delete user with associated data
    return false;
  }

  /**
   * Calculates user age
   * Business rule: Age calculated from date of birth
   */
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Determines if user is eligible for premium status
   * Business rule: Premium status based on age and activity
   */
  isEligibleForPremiumStatus(user: User, totalActivity: number): boolean {
    const age = user.dateOfBirth ? this.calculateAge(user.dateOfBirth) : 0;
    
    // Business rule: Premium status requires age >= 18 and >= 10 activities
    return age >= 18 && totalActivity >= 10;
  }

  /**
   * Validates user preferences
   * Business rule: Preferences must be valid JSON and within size limits
   */
  validatePreferences(preferences: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences === null || preferences === undefined) {
      return { isValid: true, errors: [] };
    }

    try {
      const preferencesString = JSON.stringify(preferences);
      if (preferencesString.length > 2000) {
        errors.push('Preferences must not exceed 2000 characters');
      }
    } catch (error) {
      errors.push('Preferences must be valid JSON');
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
   * Validates role assignment
   * Business rule: User can only have valid roles
   */
  validateRoleAssignment(user: User, roles: Role[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!roles || roles.length === 0) {
      errors.push('At least one role must be assigned');
    }

    // Check for duplicate roles
    const roleIds = roles.map(role => role.id);
    const uniqueRoleIds = [...new Set(roleIds)];
    if (roleIds.length !== uniqueRoleIds.length) {
      errors.push('Duplicate roles are not allowed');
    }

    // Check for inactive roles
    const inactiveRoles = roles.filter(role => !role.isActive);
    if (inactiveRoles.length > 0) {
      errors.push('Cannot assign inactive roles');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determines if user has specific role
   * Business rule: Role checking logic
   */
  hasRole(user: User, roleName: string): boolean {
    return user.roles.some(role => role.name === roleName && role.isActive);
  }

  /**
   * Determines if user has any of the specified roles
   * Business rule: Multiple role checking logic
   */
  hasAnyRole(user: User, roleNames: string[]): boolean {
    return roleNames.some(roleName => this.hasRole(user, roleName));
  }

  /**
   * Determines if user has all of the specified roles
   * Business rule: All role checking logic
   */
  hasAllRoles(user: User, roleNames: string[]): boolean {
    return roleNames.every(roleName => this.hasRole(user, roleName));
  }

  // Private helper methods

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    // Password must be at least 8 characters with uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  private isValidDateOfBirth(dateOfBirth: string): boolean {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      return false;
    }
    
    // Check if date is not in the future
    if (birthDate > today) {
      return false;
    }
    
    // Check if user is at least 13 years old
    const age = this.calculateAge(birthDate);
    return age >= 13;
  }

  private isValidAddress(address: any): boolean {
    if (!address || typeof address !== 'object') {
      return false;
    }

    // Basic address validation
    const requiredFields = ['street', 'city', 'country'];
    return requiredFields.every(field => 
      address[field] && typeof address[field] === 'string' && address[field].trim().length > 0
    );
  }
}
