import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EventBusService } from "../../../../shared/services/event-bus.service";
import { UserLoggedInEvent } from "../../domain/events/user-logged-in.event";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { AuthDomainService } from "../../domain/services/auth.domain.service";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { LoginDto } from "../dto/login.dto";

/**
 * LoginUseCase
 *
 * This use case handles user authentication and login.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly authDomainService: AuthDomainService,
    private readonly jwtService: JwtService,
    private readonly eventBusService: EventBusService
  ) {}

  /**
   * Executes the login use case.
   * @param loginDto The login data.
   * @param ipAddress Optional IP address for logging.
   * @param userAgent Optional user agent for logging.
   * @returns Authentication response with JWT token.
   */
  async execute(
    loginDto: LoginDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponseDto> {
    // 1. Validate input using domain service
    const validation = this.authDomainService.validateLoginCredentials(
      loginDto.email,
      loginDto.password
    );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Find user by email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 3. Validate user authentication status
    const userValidation =
      this.authDomainService.validateUserAuthentication(user);
    if (!userValidation.isValid) {
      throw new UnauthorizedException(userValidation.errors.join(", "));
    }

    // 4. Verify password
    const isPasswordValid = this.authDomainService.verifyPassword(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // 5. Generate JWT token
    const payload = this.authDomainService.generateJwtPayload(user);
    const accessToken = this.jwtService.sign(payload);

    // 6. Update last login time
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // 7. Publish domain event
    const loginEvent = new UserLoggedInEvent(
      user.id,
      user.email,
      new Date(),
      ipAddress,
      userAgent
    );
    await this.eventBusService.publish(loginEvent);

    // 8. Return response
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        roles:
          user.roles?.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions || [],
          })) || [],
      },
    };
  }
}
