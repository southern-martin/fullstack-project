import { CreateProfileUseCase } from "@/application/use-cases/profile/create-profile.use-case";
import { DeleteProfileUseCase } from "@/application/use-cases/profile/delete-profile.use-case";
import { GetProfileUseCase } from "@/application/use-cases/profile/get-profile.use-case";
import { UpdateProfileUseCase } from "@/application/use-cases/profile/update-profile.use-case";
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { JwtDecoder } from "../../infrastructure/auth/jwt-decoder.service";
import { CreateProfileDto } from "../dtos/create-profile.dto";
import { UpdateProfileDto } from "../dtos/update-profile.dto";

/**
 * Profile Controller
 * Handles HTTP requests for user profile management
 */
@Controller("profiles")
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly deleteProfileUseCase: DeleteProfileUseCase,
    private readonly jwtDecoder: JwtDecoder,
  ) {}

  /**
   * Get current user's profile
   * GET /profiles/me
   * Auth: Required (Kong validates JWT)
   * Returns the profile of the authenticated user
   */
  @Get("me")
  async getMyProfile(@Req() request: Request) {
    // Extract authenticated user ID from JWT
    const authHeader = request.headers.authorization;
    const userId = this.jwtDecoder.getUserId(authHeader);

    const profile = await this.getProfileUseCase.execute(userId);

    if (!profile) {
      return {
        success: false,
        message: "Profile not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    };
  }

  /**
   * Create a new user profile
   * POST /profiles/:userId
   * Auth: Required (Kong validates JWT)
   * Authorization: User can only create their own profile OR admin can create any profile
   */
  @Post(":userId")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: Request,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() createProfileDto: CreateProfileDto
  ) {
    // Extract authenticated user info from JWT
    const authHeader = request.headers.authorization;
    const authenticatedUserId = this.jwtDecoder.getUserId(authHeader);
    const userRoles = this.jwtDecoder.getUserRoles(authHeader);

    // Authorization check: User can only create their own profile unless they're admin
    if (authenticatedUserId !== userId && !userRoles.includes('admin')) {
      throw new ForbiddenException('You can only create your own profile');
    }

    // Convert DTO to domain format
    const profileData: Partial<any> = {
      ...createProfileDto,
      dateOfBirth: createProfileDto.dateOfBirth
        ? new Date(createProfileDto.dateOfBirth)
        : undefined,
    };

    const profile = await this.createProfileUseCase.execute(
      userId,
      profileData
    );

    return {
      success: true,
      message: "Profile created successfully",
      data: profile,
    };
  }

  /**
   * Get user profile by user ID
   * GET /profiles/:userId
   * Auth: Required (Kong validates JWT)
   * Authorization: User can only view their own profile OR admin can view any profile
   */
  @Get(":userId")
  async getByUserId(
    @Req() request: Request,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    // Extract authenticated user info from JWT
    const authHeader = request.headers.authorization;
    const authenticatedUserId = this.jwtDecoder.getUserId(authHeader);
    const userRoles = this.jwtDecoder.getUserRoles(authHeader);

    // Authorization check: User can only view their own profile unless they're admin
    if (authenticatedUserId !== userId && !userRoles.includes('admin')) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const profile = await this.getProfileUseCase.execute(userId);

    if (!profile) {
      return {
        success: false,
        message: "Profile not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    };
  }

  /**
   * Update user profile
   * PATCH /profiles/:userId
   * Auth: Required (Kong validates JWT)
   * Authorization: User can only update their own profile OR admin can update any profile
   */
  @Patch(":userId")
  async update(
    @Req() request: Request,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    // Extract authenticated user info from JWT
    const authHeader = request.headers.authorization;
    const authenticatedUserId = this.jwtDecoder.getUserId(authHeader);
    const userRoles = this.jwtDecoder.getUserRoles(authHeader);

    // Authorization check: User can only update their own profile unless they're admin
    if (authenticatedUserId !== userId && !userRoles.includes('admin')) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Convert DTO to domain format
    const profileData: Partial<any> = {
      ...updateProfileDto,
      dateOfBirth: updateProfileDto.dateOfBirth
        ? new Date(updateProfileDto.dateOfBirth)
        : undefined,
    };

    const profile = await this.updateProfileUseCase.execute(
      userId,
      profileData
    );

    return {
      success: true,
      message: "Profile updated successfully",
      data: profile,
    };
  }

  /**
   * Delete user profile
   * DELETE /profiles/:userId
   * Auth: Required (Kong validates JWT)
   * Authorization: User can only delete their own profile OR admin can delete any profile
   */
  @Delete(":userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Req() request: Request,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    // Extract authenticated user info from JWT
    const authHeader = request.headers.authorization;
    const authenticatedUserId = this.jwtDecoder.getUserId(authHeader);
    const userRoles = this.jwtDecoder.getUserRoles(authHeader);

    // Authorization check: User can only delete their own profile unless they're admin
    if (authenticatedUserId !== userId && !userRoles.includes('admin')) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    await this.deleteProfileUseCase.execute(userId);
  }
}
