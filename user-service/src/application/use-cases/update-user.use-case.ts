import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ValidationException } from "@shared/infrastructure";
import * as bcrypt from "bcrypt";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { UserDomainService } from "../../domain/services/user.domain.service";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";

/**
 * Update User Use Case
 * Application service that orchestrates the user update process
 * Follows Clean Architecture principles
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly userDomainService: UserDomainService
  ) {}

  /**
   * Executes the update user use case
   * @param id - User ID
   * @param updateUserDto - Update data
   * @returns Updated user response
   */
  async execute(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    // 1. Find existing user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    // 2. Convert dateOfBirth string to Date if provided
    const updateData: any = { ...updateUserDto };
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    // 3. Validate update data using domain service
    const validation =
      this.userDomainService.validateUserUpdateData(updateData);
    if (!validation.isValid) {
      throw ValidationException.fromFieldErrors(validation.fieldErrors);
    }

    // 4. Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(
        updateData.email
      );
      if (userWithSameEmail) {
        throw ValidationException.fromFieldError(
          "email",
          "This email address is already registered"
        );
      }
    }

    // 5. Custom rule validation
    const customRuleErrors = [];

    // Custom rule: Check if email is being changed to a restricted domain
    if (updateData.email && updateData.email !== existingUser.email) {
      const restrictedDomains = [
        "temp-mail.org",
        "10minutemail.com",
        "guerrillamail.com",
      ];
      const emailDomain = updateData.email.split("@")[1];
      if (restrictedDomains.includes(emailDomain)) {
        customRuleErrors.push(
          "Temporary email addresses are not allowed. Please use a permanent email address."
        );
      }
    }

    // Custom rule: Check if password is in common passwords list
    if (updateData.password) {
      const commonPasswords = [
        "password",
        "123456",
        "admin",
        "qwerty",
        "letmein",
      ];
      if (commonPasswords.includes(updateData.password.toLowerCase())) {
        customRuleErrors.push(
          "This password is too common. Please choose a more secure password."
        );
      }
    }

    // If there are custom rule errors, throw them
    if (customRuleErrors.length > 0) {
      throw ValidationException.fromCustomRuleErrors(customRuleErrors);
    }

    // 6. Validate preferences if provided
    if (updateData.preferences !== undefined) {
      const preferencesValidation = this.userDomainService.validatePreferences(
        updateData.preferences
      );
      if (!preferencesValidation.isValid) {
        throw ValidationException.fromFieldError(
          "preferences",
          preferencesValidation.errors.join(", ")
        );
      }
    }

    // 7. Prepare user update data
    const userUpdateData: Partial<any> = {};

    if (updateData.email !== undefined) userUpdateData.email = updateData.email;
    if (updateData.firstName !== undefined)
      userUpdateData.firstName = updateData.firstName;
    if (updateData.lastName !== undefined)
      userUpdateData.lastName = updateData.lastName;
    if (updateData.phone !== undefined) userUpdateData.phone = updateData.phone;
    if (updateData.isActive !== undefined)
      userUpdateData.isActive = updateData.isActive;
    if (updateData.isEmailVerified !== undefined)
      userUpdateData.isEmailVerified = updateData.isEmailVerified;
    if (updateData.address !== undefined)
      userUpdateData.address = updateData.address;
    if (updateData.preferences !== undefined)
      userUpdateData.preferences = updateData.preferences;

    // Hash password if provided
    if (updateData.password) {
      userUpdateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // dateOfBirth is already converted to Date above
    if (updateData.dateOfBirth) {
      userUpdateData.dateOfBirth = updateData.dateOfBirth;
    }

    // Handle role updates
    if (updateData.roleIds) {
      const allRolesResult = await this.roleRepository.findAll();
      const userRoles = allRolesResult.roles.filter((role) =>
        updateData.roleIds.includes(role.id)
      );
      userUpdateData.roles = userRoles;
    }

    // 8. Update user in repository
    const updatedUser = await this.userRepository.update(id, userUpdateData);

    // 8. Return response
    return this.mapToResponseDto(updatedUser);
  }

  /**
   * Executes the assign roles use case
   * @param id - User ID
   * @param roleIds - Role IDs to assign
   * @returns Updated user response
   */
  async assignRoles(id: number, roleIds: number[]): Promise<UserResponseDto> {
    // 1. Find existing user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    // 2. Get roles
    const allRolesResult = await this.roleRepository.findAll();
    const userRoles = allRolesResult.roles.filter((role) =>
      roleIds.includes(role.id)
    );

    if (userRoles.length !== roleIds.length) {
      throw ValidationException.fromFieldError(
        "roleIds",
        "One or more role IDs are invalid"
      );
    }

    // 3. Validate role assignment using domain service
    const validation = this.userDomainService.validateRoleAssignment(
      existingUser,
      userRoles
    );
    if (!validation.isValid) {
      throw ValidationException.fromFieldError(
        "roleIds",
        validation.errors.join(", ")
      );
    }

    // 4. Update user roles in repository
    const updatedUser = await this.userRepository.update(id, {
      roles: userRoles,
    });

    // 5. Return response
    return this.mapToResponseDto(updatedUser);
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
