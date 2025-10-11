import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../domain/entities/user.entity";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import {
  ROLE_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from "../../domain/tokens/repository.tokens";
import { Email } from "../../domain/value-objects/email.vo";
import { Password } from "../../domain/value-objects/password.vo";
import { AuthResponseDto } from "../dtos/auth-response.dto";
import { RegisterRequestDto } from "../dtos/register-request.dto";
import { UserResponseDto } from "../dtos/user-response.dto";

export interface RegisterUseCaseInterface {
  execute(request: RegisterRequestDto): Promise<AuthResponseDto>;
}

@Injectable()
export class RegisterUseCase implements RegisterUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(request: RegisterRequestDto): Promise<AuthResponseDto> {
    const email = new Email(request.email);
    const password = new Password(request.password);

    // Check if user already exists
    const userExists = await this.userRepository.exists(email);
    if (userExists) {
      throw new ConflictException("User with this email already exists");
    }

    // Create user entity
    const user = new User();
    user.email = email.getValue();
    user.password = password.getHashedValue();
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.phone = request.phone;
    user.isActive = request.isActive ?? true;
    user.isEmailVerified = request.isEmailVerified ?? true; // Set to true for development

    // Assign default role if no roles specified
    if (!request.roleIds || request.roleIds.length === 0) {
      const defaultRole = await this.roleRepository.findByName("user");
      if (defaultRole) {
        user.roles = [defaultRole];
      }
    } else {
      const roles = await this.roleRepository.findByIds(request.roleIds);
      user.roles = roles;
    }

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      roles: savedUser.roles?.map((role) => role.name) || [],
    };

    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "24h");

    return new AuthResponseDto(
      new UserResponseDto(savedUser),
      token,
      expiresIn
    );
  }
}
