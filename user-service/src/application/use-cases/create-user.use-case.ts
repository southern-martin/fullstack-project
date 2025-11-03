import { Inject, Injectable } from '@nestjs/common';
import { ValidationException } from '@fullstack-project/shared-infrastructure';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { IEventBus } from '../../domain/events/event-bus.interface';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { RoleRepositoryInterface } from '../../domain/repositories/role.repository.interface';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { UserValidationService } from '../../domain/services/user-validation.service';
import { UserBusinessRulesService } from '../../domain/services/user-business-rules.service';
import { UserFactoryService } from '../../domain/services/user-factory.service';
import { UserPermissionService } from '../../domain/services/user-permission.service';
import { UserDisplayService } from '../../domain/services/user-display.service';
import { UserCreationData, UserDisplayData } from '../../domain/interfaces/mapper.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PasswordService } from '../services/password.service';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';

/**
 * Create User Use Case
 *
 * Application service that orchestrates user creation process
 * Follows Clean Architecture principles with separated concerns
 *
 * Dependencies:
 * - UserValidationService: For data validation
 * - UserBusinessRulesService: For business rule validation
 * - UserFactoryService: For user entity creation
 * - UserPermissionService: For role management
 * - UserDisplayService: For data transformation
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly userValidationService: UserValidationService,
    private readonly userBusinessRulesService: UserBusinessRulesService,
    private readonly userFactoryService: UserFactoryService,
    private readonly userPermissionService: UserPermissionService,
    private readonly userDisplayService: UserDisplayService,
    private readonly passwordService: PasswordService,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject('WinstonLoggerService')
    private readonly logger: WinstonLoggerService,
  ) {}

  /**
   * Executes create user use case
   * @param createUserDto - User creation data
   * @returns Created user response
   */
  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.setContext(CreateUserUseCase.name);
    this.logger.debug(`Starting user creation for email: ${createUserDto.email}`);

    // 1. Validate input using validation service
    this.logger.debug('Validating user creation data');
    const validation = this.userValidationService.validateUserCreationData({
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      dateOfBirth: createUserDto.dateOfBirth,
      address: createUserDto.address,
      preferences: createUserDto.preferences,
    });

    if (!validation.isValid) {
      throw ValidationException.fromFieldErrors(validation.fieldErrors);
    }

    // 2. Check if user email already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw ValidationException.fromFieldError('email', 'This email address is already registered');
    }

    // 3. Validate business rules and domain constraints
    await this.validateBusinessRules(createUserDto);

    // 4. Get roles if provided
    let roles: Role[] = [];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const allRolesResult = await this.roleRepository.findAll();
      roles = allRolesResult.roles.filter(
        (role) => createUserDto.roleIds!.includes(role.id) && role.isActive,
      );

      // Validate role assignment
      const roleValidation = this.userPermissionService.validateRoleAssignment(
        new User(), // Temporary user for validation
        roles,
      );

      if (!roleValidation.isValid) {
        throw ValidationException.fromCustomRuleErrors(roleValidation.errors);
      }
    }

    // 5. Hash password using PasswordService
    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    // 6. Create user entity using factory
    const userCreationData: UserCreationData = {
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      dateOfBirth: createUserDto.dateOfBirth,
      address: createUserDto.address,
      preferences: createUserDto.preferences,
      roleIds: createUserDto.roleIds,
    };

    const user = this.userFactoryService.createFromCreationData(userCreationData);

    // 7. Save user in repository
    const savedUser = await this.userRepository.create(user);

    // 8. Publish domain event
    await this.eventBus.publish(new UserCreatedEvent(savedUser));

    // 9. Return response using display service
    return this.mapToResponseDto(savedUser);
  }

  /**
   * Validates business rules for user creation
   * @param createUserDto - User creation data
   */
  private async validateBusinessRules(createUserDto: CreateUserDto): Promise<void> {
    const errors: string[] = [];

    // Validate email domain restrictions
    const emailValidation = this.userValidationService.validateEmailDomain(createUserDto.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error || 'Email validation failed');
    }

    // Check password strength
    const passwordValidation = this.userValidationService.validatePasswordStrength(
      createUserDto.password,
    );
    if (!passwordValidation.isValid) {
      errors.push(`Password too weak: ${passwordValidation.suggestions.join(', ')}`);
    }

    // Check for temporary email domains
    const restrictedDomains = [
      'temp-mail.org',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'throwaway.email',
    ];
    const emailDomain = createUserDto.email.split('@')[1]?.toLowerCase();
    if (restrictedDomains.includes(emailDomain)) {
      errors.push(
        'Temporary email addresses are not allowed. Please use a permanent email address.',
      );
    }

    // Check for common passwords
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
    if (commonPasswords.includes(createUserDto.password.toLowerCase())) {
      errors.push('This password is too common. Please choose a more secure password.');
    }

    // Validate age restrictions
    if (createUserDto.dateOfBirth) {
      const age = this.calculateAge(new Date(createUserDto.dateOfBirth));
      if (age < 13) {
        errors.push('User must be at least 13 years old');
      }
      if (age > 120) {
        errors.push('Invalid date of birth: Age exceeds reasonable limits');
      }
    }

    // Validate role assignments
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const allRolesResult = await this.roleRepository.findAll();
      const availableRoles = allRolesResult.roles;

      const invalidRoleIds = createUserDto.roleIds.filter(
        (id) => !availableRoles.some((role) => role.id === id && role.isActive),
      );

      if (invalidRoleIds.length > 0) {
        errors.push(`Invalid role IDs: ${invalidRoleIds.join(', ')}`);
      }
    }

    // Throw validation exception if any errors
    if (errors.length > 0) {
      throw ValidationException.fromCustomRuleErrors(errors);
    }
  }

  /**
   * Maps user entity to response DTO using display service
   * @param user - User entity
   * @returns User response DTO
   */
  private mapToResponseDto(user: User): UserResponseDto {
    // Use display service to get formatted data
    const displayData = this.formatUserForDisplay(user);

    return {
      id: user.id,
      email: user.email,
      password: user.password, // Should be excluded in real implementation
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      preferences: user.preferences,
      lastLoginAt: user.lastLoginAt,
      passwordChangedAt: user.passwordChangedAt,
      roles:
        user.roles?.map((role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          isActive: role.isActive,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        })) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Computed properties
      fullName: displayData.fullName,
    };
  }

  /**
   * Formats user entity for display using display service
   * @param user - User entity
   * @returns Formatted user display data
   */
  private formatUserForDisplay(user: User): UserDisplayData {
    return {
      id: user.id,
      email: this.userDisplayService.getUserEmailDisplay(user),
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: this.userDisplayService.getUserDisplayName(user),
      displayName: this.userDisplayService.getUserDisplayName(user),
      initials: this.userDisplayService.getInitials(user),
      phone: user.phone,
      formattedPhone: this.userDisplayService.formatUserPhoneNumber(user),
      dateOfBirth: this.userDisplayService.formatDateOfBirth(user),
      age: this.userDisplayService.getAgeDisplay(user),
      address: this.userDisplayService.formatUserAddress(user),
      formattedAddress: this.userDisplayService.formatUserAddressSingleLine(user),
      avatar: this.userDisplayService.getUserAvatar(user),
      status: this.userDisplayService.getUserStatusDisplay(user),
      roles: this.userDisplayService.getUserRoleDisplay(user).split(', '),
      permissions: [], // Would need to fetch from permission service
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt?.toISOString() || '',
      updatedAt: user.updatedAt?.toISOString() || '',
      profileCompletion: this.userDisplayService.getProfileCompletion(user),
      timezone: this.userDisplayService.getTimezoneDisplay(user),
    };
  }

  /**
   * Calculates age from date of birth
   * @param dateOfBirth - Date of birth
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
