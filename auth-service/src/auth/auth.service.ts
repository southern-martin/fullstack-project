import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<UserResponseDto | null> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        return null;
      }

      const isPasswordValid = await this.userService.validatePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return null;
      }

      // Update last login
      await this.userService.updateLastLogin(user.id);

      return new UserResponseDto(user);
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    };

    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "24h");

    return new AuthResponseDto(user, token, expiresIn);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Create user
    const user = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      isActive: registerDto.isActive,
      isEmailVerified: registerDto.isEmailVerified,
      roleIds: registerDto.roleIds,
    });

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

  async validateToken(token: string): Promise<UserResponseDto> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (!user.isActive) {
        throw new UnauthorizedException("User account is inactive");
      }

      return new UserResponseDto(user);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  async refreshToken(token: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(token, { ignoreExpiration: true });
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (!user.isActive) {
        throw new UnauthorizedException("User account is inactive");
      }

      // Generate new token
      const newPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles?.map((role) => role.name) || [],
      };

      const newToken = this.jwtService.sign(newPayload);
      const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN", "24h");

      return new AuthResponseDto(
        new UserResponseDto(user),
        newToken,
        expiresIn
      );
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}








