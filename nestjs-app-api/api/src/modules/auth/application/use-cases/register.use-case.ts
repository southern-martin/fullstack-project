import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EventBusService } from "../../../../shared/services/event-bus.service";
import { User } from "../../domain/entities/user.entity";
import { UserRegisteredEvent } from "../../domain/events/user-registered.event";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { AuthDomainService } from "../../domain/services/auth.domain.service";
import { UserDomainService } from "../../domain/services/user.domain.service";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { RegisterDto } from "../dto/register.dto";

/**
 * RegisterUseCase
 *
 * This use case handles user registration.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly authDomainService: AuthDomainService,
    private readonly userDomainService: UserDomainService,
    private readonly jwtService: JwtService,
    private readonly eventBusService: EventBusService
  ) {}

  /**
   * Executes the register use case.
   * @param registerDto The registration data.
   * @returns Authentication response with JWT token.
   */
  async execute(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.authDomainService.validateUserRegistrationData(registerDto);
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

    // 3. Normalize user data
    const normalizedData =
      this.userDomainService.normalizeUserData(registerDto);

    // 4. Hash password
    const hashedPassword = this.authDomainService.generatePasswordHash(
      registerDto.password
    );

    // 5. Get default roles (if any)
    const defaultRoles = await this.roleRepository.findByName("user");
    const roles = defaultRoles ? [defaultRoles] : [];

    // 6. Create user entity
    const user = new User();
    user.email = normalizedData.email!;
    user.password = hashedPassword;
    user.firstName = normalizedData.firstName!;
    user.lastName = normalizedData.lastName!;
    user.phone = normalizedData.phone;
    user.isActive = true;
    user.isEmailVerified = false; // Email verification will be handled separately
    user.roles = roles;

    // 7. Save user
    const savedUser = await this.userRepository.create(user);

    // 8. Generate JWT token
    const payload = this.authDomainService.generateJwtPayload(savedUser);
    const accessToken = this.jwtService.sign(payload);

    // 9. Publish domain event
    const registerEvent = new UserRegisteredEvent(
      savedUser.id,
      savedUser.email,
      savedUser.firstName,
      savedUser.lastName,
      new Date()
    );
    await this.eventBusService.publish(registerEvent);

    // 10. Return response
    return {
      accessToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        isActive: savedUser.isActive,
        isEmailVerified: savedUser.isEmailVerified,
        roles:
          savedUser.roles?.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions || [],
          })) || [],
      },
    };
  }
}
