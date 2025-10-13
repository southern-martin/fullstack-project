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
  Query,
} from "@nestjs/common";
import { AssignRolesDto } from "../../application/dtos/assign-roles.dto";
import { CreateUserDto } from "../../application/dtos/create-user.dto";
import { UpdateUserDto } from "../../application/dtos/update-user.dto";
import { UserResponseDto } from "../../application/dtos/user-response.dto";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";
import { GetUserUseCase } from "../../application/use-cases/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";

/**
 * User Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@Controller("users")
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  /**
   * Create user endpoint
   * POST /users
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  /**
   * Get all users endpoint
   * GET /users
   */
  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.getUserUseCase.executeAll(pageNum, limitNum, search);
  }

  /**
   * Get active users endpoint
   * GET /users/active
   */
  @Get("active")
  async findActive(): Promise<UserResponseDto[]> {
    return this.getUserUseCase.executeActive();
  }

  /**
   * Get user count endpoint
   * GET /users/count
   */
  @Get("count")
  async getCount(): Promise<{ count: number }> {
    return this.getUserUseCase.executeCount();
  }

  /**
   * Get user by email endpoint
   * GET /users/email/:email
   */
  @Get("email/:email")
  async findByEmail(@Param("email") email: string): Promise<UserResponseDto> {
    return this.getUserUseCase.executeByEmail(email);
  }

  /**
   * Get users by role endpoint
   * GET /users/role/:roleName
   */
  @Get("role/:roleName")
  async findByRole(
    @Param("roleName") roleName: string
  ): Promise<UserResponseDto[]> {
    return this.getUserUseCase.executeByRole(roleName);
  }

  /**
   * Check if user exists by email endpoint
   * GET /users/exists/:email
   */
  @Get("exists/:email")
  async existsByEmail(
    @Param("email") email: string
  ): Promise<{ exists: boolean }> {
    return this.getUserUseCase.executeExistsByEmail(email);
  }

  /**
   * Get user by ID endpoint
   * GET /users/:id
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UserResponseDto> {
    return this.getUserUseCase.executeById(id);
  }

  /**
   * Update user endpoint
   * PATCH /users/:id
   */
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  /**
   * Assign roles to user endpoint
   * PATCH /users/:id/roles
   */
  @Patch(":id/roles")
  async assignRoles(
    @Param("id", ParseIntPipe) id: number,
    @Body() assignRolesDto: AssignRolesDto
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.assignRoles(id, assignRolesDto.roleIds);
  }

  /**
   * Delete user endpoint
   * DELETE /users/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
