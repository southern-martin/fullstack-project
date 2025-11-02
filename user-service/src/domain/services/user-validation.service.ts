import { Email } from '../value-objects/email.value-object';
import { PhoneNumber } from '../value-objects/phone-number.value-object';
import { UserPreferences } from '../value-objects/user-preferences.value-object';
import { Role } from '../entities/role.entity';

/**
 * User Validation Service
 *
 * Focused service for validating user data.
 * Follows Single Responsibility Principle - only handles validation logic.
 *
 * Business Rules:
 * - Validates all user input data
 * - Uses value objects for complex validation
 * - Returns structured validation results
 */
export class UserValidationService {
  /**
   * Validates user creation data
   * @returns Validation result with errors and field-specific errors
   */
  validateUserCreationData(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    address?: any;
    preferences?: any;
  }): { isValid: boolean; errors: string[]; fieldErrors: Record<string, string[]> } {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Email validation using Email value object
    try {
      new Email(userData.email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email';
      errors.push(message);
      fieldErrors.email = [message];
    }

    // Password validation
    this.validatePassword(userData.password, errors, fieldErrors);

    // First name validation
    this.validateFirstName(userData.firstName, errors, fieldErrors);

    // Last name validation
    this.validateLastName(userData.lastName, errors, fieldErrors);

    // Phone validation (optional)
    if (userData.phone) {
      this.validatePhone(userData.phone, errors, fieldErrors);
    }

    // Date of birth validation (optional)
    if (userData.dateOfBirth) {
      this.validateDateOfBirth(userData.dateOfBirth, errors, fieldErrors);
    }

    // Address validation (optional)
    if (userData.address) {
      this.validateAddress(userData.address, errors, fieldErrors);
    }

    // Preferences validation (optional)
    if (userData.preferences) {
      this.validatePreferences(userData.preferences, errors, fieldErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }

  /**
   * Validates user update data
   * @returns Validation result with errors and field-specific errors
   */
  validateUserUpdateData(updateData: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: any;
    preferences?: any;
  }): { isValid: boolean; errors: string[]; fieldErrors: Record<string, string[]> } {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Email validation (optional)
    if (updateData.email !== undefined) {
      try {
        new Email(updateData.email);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid email';
        errors.push(message);
        fieldErrors.email = [message];
      }
    }

    // Password validation (optional)
    if (updateData.password !== undefined) {
      this.validatePassword(updateData.password, errors, fieldErrors);
    }

    // First name validation (optional)
    if (updateData.firstName !== undefined) {
      this.validateFirstName(updateData.firstName, errors, fieldErrors);
    }

    // Last name validation (optional)
    if (updateData.lastName !== undefined) {
      this.validateLastName(updateData.lastName, errors, fieldErrors);
    }

    // Phone validation (optional)
    if (updateData.phone !== undefined) {
      this.validatePhone(updateData.phone, errors, fieldErrors);
    }

    // Date of birth validation (optional)
    if (updateData.dateOfBirth !== undefined) {
      this.validateDateOfBirth(updateData.dateOfBirth, errors, fieldErrors);
    }

    // Address validation (optional)
    if (updateData.address !== undefined) {
      this.validateAddress(updateData.address, errors, fieldErrors);
    }

    // Preferences validation (optional)
    if (updateData.preferences !== undefined) {
      this.validatePreferences(updateData.preferences, errors, fieldErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }

  /**
   * Validates role assignment
   * @returns Validation result for role assignment
   */
  validateRoleAssignment(user: any, roles: Role[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!roles || roles.length === 0) {
      errors.push('At least one role must be assigned');
    }

    // Check for duplicate roles
    const roleIds = roles.map((role) => role.id);
    const uniqueRoleIds = [...new Set(roleIds)];
    if (roleIds.length !== uniqueRoleIds.length) {
      errors.push('Duplicate roles are not allowed');
    }

    // Check for inactive roles
    const inactiveRoles = roles.filter((role) => !role.isActive);
    if (inactiveRoles.length > 0) {
      errors.push('Cannot assign inactive roles');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates email domain restrictions
   * @returns Whether email domain is allowed
   */
  validateEmailDomain(email: string): { isValid: boolean; error?: string } {
    try {
      const emailObj = new Email(email);

      if (emailObj.isFromTemporaryDomain()) {
        return {
          isValid: false,
          error: 'Temporary email addresses are not allowed',
        };
      }

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Invalid email format',
      };
    }
  }

  /**
   * Validates password strength
   * @returns Password validation result
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else suggestions.push('Password should be at least 8 characters long');

    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else suggestions.push('Include numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else suggestions.push('Include special characters');

    if (password.length >= 12) score += 1;
    else suggestions.push('Consider using 12+ characters for better security');

    return {
      isValid: score >= 4,
      score,
      suggestions,
    };
  }

  /**
   * Private validation methods
   */

  private validatePassword(
    password: string,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    if (!password) {
      const error = 'Password is required';
      errors.push(error);
      fieldErrors.password = [error];
      return;
    }

    const passwordValidation = this.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      const error =
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
      errors.push(error);
      fieldErrors.password = [error];
    }
  }

  private validateFirstName(
    firstName: string,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    if (!firstName) {
      const error = 'First name is required';
      errors.push(error);
      fieldErrors.firstName = [error];
      return;
    }

    if (firstName.trim().length < 2) {
      const error = 'First name must be at least 2 characters';
      errors.push(error);
      fieldErrors.firstName = [error];
    } else if (firstName.length > 50) {
      const error = 'First name must not exceed 50 characters';
      errors.push(error);
      fieldErrors.firstName = [error];
    }
  }

  private validateLastName(
    lastName: string,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    if (!lastName) {
      const error = 'Last name is required';
      errors.push(error);
      fieldErrors.lastName = [error];
      return;
    }

    if (lastName.trim().length < 2) {
      const error = 'Last name must be at least 2 characters';
      errors.push(error);
      fieldErrors.lastName = [error];
    } else if (lastName.length > 50) {
      const error = 'Last name must not exceed 50 characters';
      errors.push(error);
      fieldErrors.lastName = [error];
    }
  }

  private validatePhone(
    phone: string,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    try {
      new PhoneNumber(phone);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid phone number';
      errors.push(message);
      fieldErrors.phone = [message];
    }
  }

  private validateDateOfBirth(
    dateOfBirth: string,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      const error = 'Date of birth must be a valid date';
      errors.push(error);
      fieldErrors.dateOfBirth = [error];
      return;
    }

    // Check if date is not in the future
    if (birthDate > today) {
      const error = 'Date of birth cannot be in the future';
      errors.push(error);
      fieldErrors.dateOfBirth = [error];
      return;
    }

    // Check if user is at least 13 years old
    const age = this.calculateAge(birthDate);
    if (age < 13) {
      const error = 'User must be at least 13 years old';
      errors.push(error);
      fieldErrors.dateOfBirth = [error];
    }
  }

  private validateAddress(
    address: any,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    if (!address || typeof address !== 'object') {
      const error = 'Address must be a valid object';
      errors.push(error);
      fieldErrors.address = [error];
      return;
    }

    // Basic address validation
    const requiredFields = ['street', 'city', 'country'];
    const missingFields = requiredFields.filter(
      (field) =>
        !address[field] || typeof address[field] !== 'string' || address[field].trim().length === 0,
    );

    if (missingFields.length > 0) {
      const error = `Address must include: ${missingFields.join(', ')}`;
      errors.push(error);
      fieldErrors.address = [error];
    }
  }

  private validatePreferences(
    preferences: any,
    errors: string[],
    fieldErrors: Record<string, string[]>,
  ): void {
    try {
      new UserPreferences(preferences);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid preferences';
      errors.push(message);
      fieldErrors.preferences = [message];
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
