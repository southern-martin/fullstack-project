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
import { AuthResponseDto } from "../../application/dtos/auth-response.dto";
import { LoginRequestDto } from "../../application/dtos/login-request.dto";
import { RegisterRequestDto } from "../../application/dtos/register-request.dto";
import { UserResponseDto } from "../../application/dtos/user-response.dto";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { ValidateTokenUseCase } from "../../application/use-cases/validate-token.use-case";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterRequestDto
  ): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto);
  }

  @Post("validate-token")
  @HttpCode(HttpStatus.OK)
  async validateToken(
    @Body() body: { token: string }
  ): Promise<UserResponseDto> {
    return this.validateTokenUseCase.execute(body.token);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }

  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ message: string }> {
    return { message: "Logged out successfully" };
  }

  @Get("health")
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}








