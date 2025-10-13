import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../../infrastructure/strategies/jwt.strategy";

// Use Cases
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { LogoutUseCase } from "../../application/use-cases/logout.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";

// DTOs
import { AuthResponseDto } from "../../application/dto/auth-response.dto";
import { LoginDto } from "../../application/dto/login.dto";
import { RegisterDto } from "../../application/dto/register.dto";

/**
 * AuthController
 *
 * This controller handles HTTP requests for authentication operations.
 * It delegates business logic to use cases and returns appropriate HTTP responses.
 */
@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  /**
   * User login endpoint.
   * @param loginDto Login credentials.
   * @param req Express request object.
   * @returns Authentication response with JWT token.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request
  ): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    return this.loginUseCase.execute(loginDto, ipAddress, userAgent);
  }

  /**
   * User registration endpoint.
   * @param registerDto Registration data.
   * @returns Authentication response with JWT token.
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }

  /**
   * Refresh JWT token endpoint.
   * @param req Express request object.
   * @returns New authentication response with refreshed JWT token.
   */
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request): Promise<AuthResponseDto> {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("No token provided");
    }

    return this.refreshTokenUseCase.execute(token);
  }

  /**
   * User logout endpoint.
   * @param req Express request object.
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const user = (req as any).user;
    const sessionStartTime = (req as any).sessionStartTime; // This would need to be implemented

    await this.logoutUseCase.execute(user.id, user.email, sessionStartTime);

    return { message: "Logged out successfully" };
  }

  /**
   * Get current user profile endpoint.
   * @param req Express request object.
   * @returns Current user information.
   */
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request): Promise<any> {
    const user = (req as any).user;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      permissions: user.permissions,
    };
  }
}
