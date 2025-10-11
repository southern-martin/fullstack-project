import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthDomainService } from "../../domain/services/auth.domain.service";
import { Email } from "../../domain/value-objects/email.vo";
import { Password } from "../../domain/value-objects/password.vo";
import { AuthResponseDto } from "../dtos/auth-response.dto";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { UserResponseDto } from "../dtos/user-response.dto";

export interface LoginUseCaseInterface {
  execute(request: LoginRequestDto): Promise<AuthResponseDto>;
}

@Injectable()
export class LoginUseCase implements LoginUseCaseInterface {
  constructor(
    private readonly authDomainService: AuthDomainService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(request: LoginRequestDto): Promise<AuthResponseDto> {
    const email = new Email(request.email);

    // Validate password format first
    new Password(request.password);

    const user = await this.authDomainService.validateUser(
      email,
      request.password
    );

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!this.authDomainService.canUserLogin(user)) {
      throw new UnauthorizedException("Account is inactive or not verified");
    }

    // Update last login
    await this.authDomainService.updateUserLastLogin(user);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((role) => role.name) || [],
    };

    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "24h");

    return new AuthResponseDto(new UserResponseDto(user), token, expiresIn);
  }
}
