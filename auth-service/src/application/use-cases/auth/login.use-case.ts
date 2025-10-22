import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EventBusInterface } from "../../../domain/events/event-bus.interface";
import { LoginFailedEvent } from "../../../domain/events/login-failed.event";
import { UserLoggedInEvent } from "../../../domain/events/user-logged-in.event";
import { UserRepositoryInterface } from "../../../domain/repositories/user.repository.interface";
import { AuthDomainService } from "../../../domain/services/auth.domain.service";
import { UserDomainService } from "../../../domain/services/user.domain.service";
import { AuthResponseDto } from "../../dto/auth/auth-response.dto";
import { LoginRequestDto } from "../../dto/auth/login-request.dto";
import { UserResponseDto } from "../../dto/auth/user-response.dto";

/**
 * Login Use Case
 * Application service that orchestrates the login process
 * Follows Clean Architecture principles
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    private readonly authDomainService: AuthDomainService,
    private readonly userDomainService: UserDomainService,
    private readonly jwtService: JwtService,
    @Inject("EventBusInterface")
    private readonly eventBus: EventBusInterface
  ) {}

  /**
   * Executes the login use case
   * @param loginDto - Login credentials
   * @returns Authentication response with token and user data
   */
  async execute(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    // 1. Validate input
    this.validateLoginInput(loginDto);

    // 2. Find user by email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      // Publish LoginFailedEvent for security monitoring
      await this.eventBus.publish(
        new LoginFailedEvent(
          loginDto.email,
          "User not found",
          undefined, // IP address - can be passed from controller if needed
          undefined // User agent - can be passed from controller if needed
        )
      );
      throw new UnauthorizedException("Invalid credentials");
    }

    // 3. Check if user can authenticate (business rules)
    if (!this.authDomainService.canUserAuthenticate(user)) {
      // Publish LoginFailedEvent for security monitoring
      await this.eventBus.publish(
        new LoginFailedEvent(
          loginDto.email,
          "Account is inactive or email not verified"
        )
      );
      throw new UnauthorizedException(
        "Account is inactive or email not verified"
      );
    }

    // 4. Validate password
    const isPasswordValid = await this.userRepository.validatePassword(
      user.id,
      loginDto.password
    );
    if (!isPasswordValid) {
      // Publish LoginFailedEvent for security monitoring
      await this.eventBus.publish(
        new LoginFailedEvent(loginDto.email, "Invalid password")
      );
      // Note: Failed login attempts tracking not available with current schema
      console.warn(
        "Failed login attempt tracking disabled due to simplified schema"
      );
      throw new UnauthorizedException("Invalid credentials");
    }

    // Account locking feature disabled with simplified schema
    // if (this.authDomainService.isAccountLocked(user.failedLoginAttempts || 0)) {
    //   throw new UnauthorizedException(
    //     "Account is locked due to too many failed attempts"
    //   );
    // }

    // Failed login attempts reset not available with current schema
    // await this.userRepository.resetFailedLoginAttempts(user.id);

    // 7. Update last login
    await this.userRepository.updateLastLogin(user.id);

    // 8. Publish UserLoggedInEvent
    await this.eventBus.publish(
      new UserLoggedInEvent(
        user.id,
        user.email,
        undefined, // IP address - can be passed from controller if needed
        undefined, // User agent - can be passed from controller if needed
        new Date()
      )
    );

    // 9. Generate JWT token
    const token = await this.generateToken(user);

    // 10. Return response
    return {
      access_token: token,
      token: token,
      user: this.mapUserToResponseDto(user),
      expiresIn: this.authDomainService.getSessionTimeout().toString(),
    };
  }

  /**
   * Validates login input
   * @param loginDto - Login credentials
   */
  private validateLoginInput(loginDto: LoginRequestDto): void {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException("Email and password are required");
    }

    if (!this.authDomainService.isValidEmail(loginDto.email)) {
      throw new BadRequestException("Invalid email format");
    }
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
