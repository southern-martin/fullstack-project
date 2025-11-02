import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Email } from '../value-objects/email.value-object';
import { PhoneNumber } from '../value-objects/phone-number.value-object';
import { UserPreferences } from '../value-objects/user-preferences.value-object';
import { UserValidationService } from './user-validation.service';
import { UserBusinessRulesService } from './user-business-rules.service';

/**
 * User Factory Service
 *
 * Factory service for creating User entities with proper validation
 * and domain logic encapsulation.
 * Follows Single Responsibility Principle - only handles user creation.
 *
 * Business Rules:
 * - Validates all user data using domain services
 * - Creates users with proper defaults
 * - Encapsulates complex creation logic
 */
export class UserFactoryService {
  constructor(
    private readonly userValidationService: UserValidationService,
    private readonly userBusinessRulesService: UserBusinessRulesService,
  ) {}

  /**
   * Creates a new user from creation data
   * @returns Created User entity
   */
  createFromCreationData(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    address?: any;
    preferences?: any;
    roleIds?: number[];
    roles?: Role[];
  }): User {
    // Validate all user data
    const validation = this.userValidationService.validateUserCreationData(userData);
    if (!validation.isValid) {
      throw new Error(`User validation failed: ${validation.errors.join(', ')}`);
    }

    // Validate business rules
    if (!this.validateBusinessRules(userData)) {
      throw new Error('User creation violates business rules');
    }

    // Create user with value objects
    const user = new User({
      // Email validation (throws if invalid)
      email: new Email(userData.email).value,

      // Basic fields with validation
      password: userData.password, // Should be hashed before this point
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),

      // Optional fields with value object validation
      phone: userData.phone ? new PhoneNumber(userData.phone).value : undefined,

      // Address (basic validation)
      address: userData.address ? this.validateAddress(userData.address) : undefined,

      // Date of birth (basic validation)
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,

      // Preferences with value object
      preferences: userData.preferences ? new UserPreferences(userData.preferences) : undefined,

      // Default values
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),

      // Roles (will be assigned separately)
      roles: userData.roles || [],
    });

    return user;
  }

  /**
   * Creates a user for update operations
   * @returns User entity with update data
   */
  createFromUpdateData(
    existingUser: User,
    updateData: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      dateOfBirth?: string;
      address?: any;
      preferences?: any;
      roles?: Role[];
    },
  ): User {
    // Validate update data
    const validation = this.userValidationService.validateUserUpdateData(updateData);
    if (!validation.isValid) {
      throw new Error(`User update validation failed: ${validation.errors.join(', ')}`);
    }

    // Validate business rules for updates
    if (!this.validateUpdateBusinessRules(existingUser, updateData)) {
      throw new Error('User update violates business rules');
    }

    // Create updated user
    const updatedUser = new User({
      ...existingUser,

      // Only update provided fields
      email: updateData.email ? new Email(updateData.email).value : existingUser.email,
      password: updateData.password || existingUser.password,
      firstName: updateData.firstName ? updateData.firstName.trim() : existingUser.firstName,
      lastName: updateData.lastName ? updateData.lastName.trim() : existingUser.lastName,
      phone: updateData.phone ? new PhoneNumber(updateData.phone).value : existingUser.phone,
      dateOfBirth: updateData.dateOfBirth
        ? new Date(updateData.dateOfBirth)
        : existingUser.dateOfBirth,
      address: updateData.address ? this.validateAddress(updateData.address) : existingUser.address,
      preferences: updateData.preferences
        ? new UserPreferences(updateData.preferences)
        : existingUser.preferences,
      roles: updateData.roles || existingUser.roles,

      // Update timestamp
      updatedAt: new Date(),
    });

    return updatedUser;
  }

  /**
   * Creates a user with minimal data (for testing/import)
   * @returns User entity with minimal data
   */
  createMinimal(userData: { email: string; firstName: string; lastName: string }): User {
    return new User({
      email: new Email(userData.email).value,
      password: '', // Should be set separately
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [],
    });
  }

  /**
   * Creates a user from external data (e.g., OAuth)
   * @returns User entity from external source
   */
  createFromExternalData(externalData: {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    provider: string;
    providerId: string;
  }): User {
    // Validate required external data
    if (!externalData.email || !externalData.provider || !externalData.providerId) {
      throw new Error('External user data is incomplete');
    }

    // Create user from external data
    const user = new User({
      email: new Email(externalData.email).value,
      password: '', // External users might not have passwords initially
      firstName: externalData.firstName?.trim() || '',
      lastName: externalData.lastName?.trim() || '',
      isActive: true,
      isEmailVerified: true, // Assume verified from external provider
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [], // Will be assigned based on provider
      metadata: {
        externalProvider: externalData.provider,
        externalProviderId: externalData.providerId,
        avatar: externalData.avatar,
        source: 'external',
      },
    });

    return user;
  }

  /**
   * Creates a user with default roles
   * @returns User entity with assigned roles
   */
  createWithRoles(
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      roleIds?: number[];
    },
    availableRoles: Role[],
  ): User {
    // Get roles based on IDs or default role
    let roles: Role[] = [];

    if (userData.roleIds && userData.roleIds.length > 0) {
      roles = availableRoles.filter((role) => userData.roleIds!.includes(role.id) && role.isActive);
    } else {
      // Assign default user role
      const defaultRole = availableRoles.find((role) => role.name === 'user' && role.isActive);
      if (defaultRole) {
        roles = [defaultRole];
      }
    }

    // Validate role assignment
    const user = this.createFromCreationData({ ...userData, roles });

    // Additional role validation
    const roleValidation = this.userValidationService.validateRoleAssignment(user, roles);
    if (!roleValidation.isValid) {
      throw new Error(`Role assignment failed: ${roleValidation.errors.join(', ')}`);
    }

    return user;
  }

  /**
   * Creates a user template for registration
   * @returns User template with common defaults
   */
  createRegistrationTemplate(email: string): Partial<User> {
    return {
      email: new Email(email).value,
      password: '', // Will be set during registration
      firstName: '',
      lastName: '',
      phone: undefined,
      isActive: true,
      isEmailVerified: false,
      dateOfBirth: undefined,
      address: undefined,
      preferences: UserPreferences.createDefault(),
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [],
    };
  }

  /**
   * Validates business rules for user creation
   * @returns Whether business rules allow creation
   */
  private validateBusinessRules(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
  }): boolean {
    // Check email domain restrictions
    const emailValidation = this.userValidationService.validateEmailDomain(userData.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || 'Email validation failed');
    }

    // Check password strength requirements
    const passwordValidation = this.userValidationService.validatePasswordStrength(
      userData.password,
    );
    if (!passwordValidation.isValid) {
      // Don't throw here, just log - passwords can be weak but still allowed
      console.warn(`Weak password: ${passwordValidation.suggestions.join(', ')}`);
    }

    // Check age restrictions
    if (userData.dateOfBirth) {
      const age = this.calculateAge(new Date(userData.dateOfBirth));
      if (age < 13) {
        throw new Error('User must be at least 13 years old');
      }

      if (age > 120) {
        throw new Error('Invalid date of birth: Age exceeds reasonable limits');
      }
    }

    return true;
  }

  /**
   * Validates business rules for user updates
   * @returns Whether business rules allow update
   */
  private validateUpdateBusinessRules(
    existingUser: User,
    updateData: {
      email?: string;
      firstName?: string;
      lastName?: string;
    },
  ): boolean {
    // Check if email can be changed
    if (updateData.email && updateData.email !== existingUser.email) {
      if (!this.userBusinessRulesService.canChangeEmail(existingUser)) {
        throw new Error('Email cannot be changed at this time');
      }
    }

    // Check if sensitive fields are being changed
    const sensitiveFieldsChanged = this.checkSensitiveFieldsChange(existingUser, updateData);
    if (sensitiveFieldsChanged.length > 0) {
      // Additional validation could be added here
      console.warn(`Sensitive fields changed: ${sensitiveFieldsChanged.join(', ')}`);
    }

    return true;
  }

  /**
   * Validates address object
   * @returns Validated address object
   */
  private validateAddress(address: any): any {
    if (!address || typeof address !== 'object') {
      return undefined;
    }

    // Basic address validation and normalization
    return {
      street: address.street?.trim() || '',
      city: address.city?.trim() || '',
      state: address.state?.trim() || '',
      zipCode: address.zipCode?.trim() || '',
      country: address.country?.trim() || '',
    };
  }

  /**
   * Checks which sensitive fields are being changed
   * @returns Array of changed sensitive fields
   */
  private checkSensitiveFieldsChange(
    existingUser: User,
    updateData: {
      email?: string;
      firstName?: string;
      lastName?: string;
    },
  ): string[] {
    const changedFields: string[] = [];

    if (updateData.email && updateData.email !== existingUser.email) {
      changedFields.push('email');
    }

    if (updateData.firstName && updateData.firstName !== existingUser.firstName) {
      changedFields.push('firstName');
    }

    if (updateData.lastName && updateData.lastName !== existingUser.lastName) {
      changedFields.push('lastName');
    }

    return changedFields;
  }

  /**
   * Calculates age from date of birth
   * @returns Age in years
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
