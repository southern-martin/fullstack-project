import { Inject, Injectable } from "@nestjs/common";
import { ValidationException } from "@shared/infrastructure";
import * as bcrypt from "bcrypt";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { UserDomainService } from "../../domain/services/user.domain.service";
import { User } from "../../domain/entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";

/**
 * Create User Use Case
 * Application service that orchestrates the user creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    @Inject("RoleRepositoryInterface")
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly userDomainService: UserDomainService
  ) {}

  /**
   * Executes the create user use case
   * @param createUserDto - User creation data
   * @returns Created user response
   */
  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.userDomainService.validateUserCreationData(createUserDto);
    if (!validation.isValid) {
      throw ValidationException.fromFieldErrors(validation.fieldErrors);
    }

    // 2. Check if user email already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw ValidationException.fromFieldError(
        "email",
        "This email address is already registered"
      );
    }

    // 3. Custom rule validation
    const customRuleErrors = [];

    // Custom rule: Check if user is trying to use a restricted email domain
    const restrictedDomains = [
      "temp-mail.org",
      "10minutemail.com",
      "guerrillamail.com",
    ];
    const emailDomain = createUserDto.email.split("@")[1];
    if (restrictedDomains.includes(emailDomain)) {
      customRuleErrors.push(
        "Temporary email addresses are not allowed. Please use a permanent email address."
      );
    }

    // Custom rule: Check if password is in common passwords list
    const commonPasswords = [
      "password",
      "123456",
      "admin",
      "qwerty",
      "letmein",
    ];
    if (commonPasswords.includes(createUserDto.password.toLowerCase())) {
      customRuleErrors.push(
        "This password is too common. Please choose a more secure password."
      );
    }

    // If there are custom rule errors, throw them
    if (customRuleErrors.length > 0) {
      throw ValidationException.fromCustomRuleErrors(customRuleErrors);
    }

    // 4. Validate preferences if provided
    if (createUserDto.preferences) {
      const preferencesValidation = this.userDomainService.validatePreferences(
        createUserDto.preferences
      );
      if (!preferencesValidation.isValid) {
        throw ValidationException.fromFieldError(
          "preferences",
          preferencesValidation.errors.join(", ")
        );
      }
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 6. Get roles if provided
    let roles = [];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const allRolesResult = await this.roleRepository.findAll();
      roles = allRolesResult.roles.filter((role) =>
        createUserDto.roleIds.includes(role.id)
      );
    }

    // 7. Create user entity
    const user = new User({
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      isActive: createUserDto.isActive ?? true,
      isEmailVerified: createUserDto.isEmailVerified ?? false,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
      address: createUserDto.address,
      preferences: createUserDto.preferences,
      roles,
    });

    // 8. Save user in repository
    const savedUser = await this.userRepository.create(user);

    // 9. Return response
    return this.mapToResponseDto(savedUser);
  }

  /**
   * Maps user entity to response DTO
   * @param user - User entity
   * @returns User response DTO
   */
  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
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
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      get fullName() {
        return `${user.firstName} ${user.lastName}`.trim();
      },
    };
  }
}
