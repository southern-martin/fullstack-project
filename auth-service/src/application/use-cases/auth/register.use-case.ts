import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../../domain/entities/user.entity";
import { EventBusInterface } from "../../../domain/events/event-bus.interface";
import { UserRegisteredEvent } from "../../../domain/events/user-registered.event";
import { RoleRepositoryInterface } from "../../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../../domain/repositories/user.repository.interface";
import { AuthDomainService } from "../../../domain/services/auth.domain.service";
import { UserDomainService } from "../../../domain/services/user.domain.service";
import { AuthResponseDto } from "../../dto/auth/auth-response.dto";
import { RegisterRequestDto } from "../../dto/auth/register-request.dto";
import { UserResponseDto } from "../../dto/auth/user-response.dto";

/**
 * Register Use Case
 * Application service that orchestrates the user registration process
 * Follows Clean Architecture principles
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    @Inject("RoleRepositoryInterface")
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly authDomainService: AuthDomainService,
    private readonly userDomainService: UserDomainService,
    private readonly jwtService: JwtService,
    @Inject("EventBusInterface")
    private readonly eventBus: EventBusInterface
  ) {}

  /**
   * Executes the register use case
   * @param registerDto - Registration data
   * @returns Authentication response with token and user data
   */
  async execute(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.userDomainService.validateUserCreationData(registerDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email
    );
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // 3. Get default role
    const defaultRoleName = this.userDomainService.getDefaultUserRole();
    const defaultRole = await this.roleRepository.findByName(defaultRoleName);
    if (!defaultRole) {
      throw new BadRequestException("Default user role not found");
    }

    // 4. Create user entity
    const userData = new User({
      email: registerDto.email.toLowerCase(),
      password: registerDto.password, // Will be hashed in repository
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      isActive: true,
      isEmailVerified: false, // Email verification required
      roles: [defaultRole],
    });

    // 5. Create user in repository
    const newUser = await this.userRepository.create(userData);

    // 6. Publish UserRegisteredEvent
    await this.eventBus.publish(
      new UserRegisteredEvent(
        newUser.id,
        newUser.email,
        newUser.firstName,
        newUser.lastName,
        undefined, // IP address - can be passed from controller if needed
        new Date()
      )
    );

    // 7. Generate JWT token
    const token = await this.generateToken(newUser);

    // 8. Return response
    return {
      access_token: token,
      token: token,
      user: this.mapUserToResponseDto(newUser),
      expiresIn: this.authDomainService.getSessionTimeout().toString(),
    };
  }

  /**
   * Generates JWT token for user
   * @param user - User entity
   * @returns JWT token
   */
  private async generateToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      iss: 'auth-service', // Issuer claim for Kong JWT validation
      roles: user.roles?.map((role: any) => role.name) || [],
      permissions: this.getUserPermissions(user),
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Gets all permissions for user based on roles
   * @param user - User entity
   * @returns Array of permissions
   */
  private getUserPermissions(user: any): string[] {
    const permissions = new Set<string>();

    user.roles?.forEach((role: any) => {
      role.permissions?.forEach((permission: string) => {
        permissions.add(permission);
      });
    });

    return Array.from(permissions);
  }

  /**
   * Maps user entity to response DTO
   * @param user - User entity
   * @returns User response DTO
   */
  private mapUserToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      passwordChangedAt: user.passwordChangedAt,
      roles:
        user.roles?.map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        })) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      get fullName() {
        return `${user.firstName} ${user.lastName}`.trim();
      },
    };
  }
}
