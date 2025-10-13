import {
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { UserDomainService } from "../../domain/services/user.domain.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { ValidationException } from "../../../shared/exceptions/validation.exception";

/**
 * Create User Use Case
 * Application service that orchestrates the user creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RoleRepositoryInterface')
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
      throw ValidationException.fromFieldError('email', 'This email address is already registered');
    }

    // 3. Validate preferences if provided
    if (createUserDto.preferences) {
      const preferencesValidation = this.userDomainService.validatePreferences(
        createUserDto.preferences
      );
      if (!preferencesValidation.isValid) {
        throw ValidationException.fromFieldError('preferences', preferencesValidation.errors.join(", "));
      }
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 5. Get roles if provided
    let roles = [];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const allRoles = await this.roleRepository.findAll();
      roles = allRoles.filter((role) =>
        createUserDto.roleIds.includes(role.id)
      );
    }

    // 6. Create user entity
    const user = {
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      isActive: createUserDto.isActive ?? true,
      isEmailVerified: createUserDto.isEmailVerified ?? false,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : null,
      address: createUserDto.address,
      preferences: createUserDto.preferences,
      roles,
    };

    // 7. Save user in repository
    const savedUser = await this.userRepository.create(user);

    // 8. Return response
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
