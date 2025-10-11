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
import { AuthService } from "./auth.service";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post("validate-token")
  @HttpCode(HttpStatus.OK)
  async validateToken(
    @Body() body: { token: string }
  ): Promise<UserResponseDto> {
    return this.authService.validateToken(body.token);
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req): Promise<AuthResponseDto> {
    return this.authService.refreshToken(req.user.id);
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

  // Health check endpoint
  @Get("health")
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}






