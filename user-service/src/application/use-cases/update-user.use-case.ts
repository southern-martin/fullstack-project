import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { UserDomainService } from "../../domain/services/user.domain.service";
import { ValidationException } from "../../shared/exceptions/validation.exception";
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
    private readonly userRepository: UserRepositoryInterface,
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

    // 2. Validate update data using domain service
    const validation =
      this.userDomainService.validateUserUpdateData(updateUserDto);
    if (!validation.isValid) {
      throw ValidationException.fromFieldErrors(validation.fieldErrors);
    }

    // 3. Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(
        updateUserDto.email
      );
      if (userWithSameEmail) {
        throw ValidationException.fromFieldError(
          "email",
          "This email address is already registered"
        );
      }
    }

    // 4. Custom rule validation
    const customRuleErrors = [];

    // Custom rule: Check if email is being changed to a restricted domain
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const restrictedDomains = [
        "temp-mail.org",
        "10minutemail.com",
        "guerrillamail.com",
      ];
      const emailDomain = updateUserDto.email.split("@")[1];
      if (restrictedDomains.includes(emailDomain)) {
        customRuleErrors.push(
          "Temporary email addresses are not allowed. Please use a permanent email address."
        );
      }
    }

    // Custom rule: Check if password is in common passwords list
    if (updateUserDto.password) {
      const commonPasswords = [
        "password",
        "123456",
        "admin",
        "qwerty",
        "letmein",
      ];
      if (commonPasswords.includes(updateUserDto.password.toLowerCase())) {
        customRuleErrors.push(
          "This password is too common. Please choose a more secure password."
        );
      }
    }

    // If there are custom rule errors, throw them
    if (customRuleErrors.length > 0) {
      throw ValidationException.fromCustomRuleErrors(customRuleErrors);
    }

    // 5. Validate preferences if provided
    if (updateUserDto.preferences !== undefined) {
      const preferencesValidation = this.userDomainService.validatePreferences(
        updateUserDto.preferences
      );
      if (!preferencesValidation.isValid) {
        throw ValidationException.fromFieldError(
          "preferences",
          preferencesValidation.errors.join(", ")
        );
      }
    }

    // 6. Prepare update data
    const updateData: Partial<any> = {};

    if (updateUserDto.email !== undefined)
      updateData.email = updateUserDto.email;
    if (updateUserDto.firstName !== undefined)
      updateData.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName !== undefined)
      updateData.lastName = updateUserDto.lastName;
    if (updateUserDto.phone !== undefined)
      updateData.phone = updateUserDto.phone;
    if (updateUserDto.isActive !== undefined)
      updateData.isActive = updateUserDto.isActive;
    if (updateUserDto.isEmailVerified !== undefined)
      updateData.isEmailVerified = updateUserDto.isEmailVerified;
    if (updateUserDto.address !== undefined)
      updateData.address = updateUserDto.address;
    if (updateUserDto.preferences !== undefined)
      updateData.preferences = updateUserDto.preferences;

    // Hash password if provided
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Convert dateOfBirth string to Date if provided
    if (updateUserDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    }

    // Handle role updates
    if (updateUserDto.roleIds) {
      const allRoles = await this.roleRepository.findAll();
      const userRoles = allRoles.filter((role) =>
        updateUserDto.roleIds.includes(role.id)
      );
      updateData.roles = userRoles;
    }

    // 7. Update user in repository
    const updatedUser = await this.userRepository.update(id, updateData);

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
    const allRoles = await this.roleRepository.findAll();
    const userRoles = allRoles.filter((role) => roleIds.includes(role.id));

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
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      preferences: user.preferences,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
