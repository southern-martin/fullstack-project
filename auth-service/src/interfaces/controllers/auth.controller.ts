import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { ValidateTokenUseCase } from '../../application/use-cases/auth/validate-token.use-case';
import { AuthResponseDto } from '../../application/dtos/auth/auth-response.dto';
import { LoginRequestDto } from '../../application/dtos/auth/login-request.dto';
import { RegisterRequestDto } from '../../application/dtos/auth/register-request.dto';
import { UserResponseDto } from '../../application/dtos/auth/user-response.dto';

/**
 * Auth Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  /**
   * Login endpoint
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }

  /**
   * Register endpoint
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }

  /**
   * Validate token endpoint
   * POST /auth/validate-token
   */
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(
    @Body() body: { token: string }
  ): Promise<UserResponseDto> {
    return this.validateTokenUseCase.execute(body.token);
  }

  /**
   * Get user profile endpoint
   * GET /auth/profile
   */
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }

  /**
   * Logout endpoint
   * POST /auth/logout
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }

  /**
   * Health check endpoint
   * GET /auth/health
   */
  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}