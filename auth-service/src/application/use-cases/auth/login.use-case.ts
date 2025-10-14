import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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
    private readonly jwtService: JwtService
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
      throw new UnauthorizedException("Invalid credentials");
    }

    // 3. Check if user can authenticate (business rules)
    if (!this.authDomainService.canUserAuthenticate(user)) {
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
      // Update failed login attempts
      await this.userRepository.incrementFailedLoginAttempts(user.id);
      throw new UnauthorizedException("Invalid credentials");
    }

    // 5. Check if account is locked
    if (this.authDomainService.isAccountLocked(user.failedLoginAttempts || 0)) {
      throw new UnauthorizedException(
        "Account is locked due to too many failed attempts"
      );
    }

    // 6. Reset failed login attempts on successful login
    await this.userRepository.resetFailedLoginAttempts(user.id);

    // 7. Update last login
    await this.userRepository.updateLastLogin(user.id);

    // 8. Generate JWT token
    const token = await this.generateToken(user);

    // 9. Return response
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
      emailVerifiedAt: user.emailVerifiedAt,
      metadata: user.metadata,
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
