import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { AuthResponseDto } from "../../application/dto/auth/auth-response.dto";
import { LoginRequestDto } from "../../application/dto/auth/login-request.dto";
import { RegisterRequestDto } from "../../application/dto/auth/register-request.dto";
import { UserResponseDto } from "../../application/dto/auth/user-response.dto";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";
import { ValidateTokenUseCase } from "../../application/use-cases/auth/validate-token.use-case";

/**
 * Auth Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase
  ) {}

  /**
   * Login endpoint
   * POST /auth/login
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login", description: "Authenticate user and return JWT token" })
  @ApiResponse({ 
    status: 200, 
    description: "Successfully authenticated", 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }

  /**
   * Register endpoint
   * POST /auth/register
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "User registration", description: "Register a new user account" })
  @ApiResponse({ 
    status: 201, 
    description: "User successfully registered", 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 409, description: "Email already exists" })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  async register(
    @Body() registerDto: RegisterRequestDto
  ): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }

  /**
   * Validate token endpoint
   * POST /auth/validate-token
   */
  @Post("validate-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Validate JWT token", description: "Verify JWT token and return user info" })
  @ApiBody({ 
    schema: { 
      type: "object", 
      properties: { 
        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." } 
      } 
    } 
  })
  @ApiResponse({ 
    status: 200, 
    description: "Token is valid", 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 401, description: "Invalid or expired token" })
  async validateToken(
    @Body() body: { token: string }
  ): Promise<UserResponseDto> {
    return this.validateTokenUseCase.execute(body.token);
  }

  /**
   * Get user profile endpoint
   * GET /auth/profile
   */
  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get user profile", description: "Get current authenticated user profile" })
  @ApiResponse({ 
    status: 200, 
    description: "User profile retrieved", 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 401, description: "Unauthorized - invalid or missing token" })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }

  /**
   * Logout endpoint
   * POST /auth/logout
   */
  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User logout", description: "Logout current user (client should discard token)" })
  @ApiResponse({ 
    status: 200, 
    description: "Successfully logged out",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Logged out successfully" }
      }
    }
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async logout(): Promise<{ message: string }> {
    return { message: "Logged out successfully" };
  }

  /**
   * Health check endpoint
   * GET /auth/health
   */
  @Get("health")
  @ApiOperation({ summary: "Health check", description: "Check service health status" })
  @ApiResponse({ 
    status: 200, 
    description: "Service is healthy",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        timestamp: { type: "string", example: "2025-10-26T10:00:00.000Z" }
      }
    }
  })
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
