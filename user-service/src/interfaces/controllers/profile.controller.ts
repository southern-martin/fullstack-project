import { CreateProfileUseCase } from "@/application/use-cases/profile/create-profile.use-case";
import { DeleteProfileUseCase } from "@/application/use-cases/profile/delete-profile.use-case";
import { GetProfileUseCase } from "@/application/use-cases/profile/get-profile.use-case";
import { UpdateProfileUseCase } from "@/application/use-cases/profile/update-profile.use-case";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
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
    private readonly deleteProfileUseCase: DeleteProfileUseCase
  ) {}

  /**
   * Create a new user profile
   * POST /profiles/:userId
   */
  @Post(":userId")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() createProfileDto: CreateProfileDto
  ) {
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
   */
  @Get(":userId")
  async getByUserId(@Param("userId", ParseIntPipe) userId: number) {
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
   */
  @Patch(":userId")
  async update(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
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
   */
  @Delete(":userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("userId", ParseIntPipe) userId: number) {
    await this.deleteProfileUseCase.execute(userId);
  }
}
