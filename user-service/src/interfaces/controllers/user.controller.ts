import { PaginationDto } from "@fullstack-project/shared-infrastructure";
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AssignRolesDto } from "../../application/dto/assign-roles.dto";
import { CreateUserDto } from "../../application/dto/create-user.dto";
import { UpdateUserDto } from "../../application/dto/update-user.dto";
import { UserResponseDto } from "../../application/dto/user-response.dto";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";
import { GetUserUseCase } from "../../application/use-cases/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/update-user.use-case";

/**
 * User Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@ApiTags("users")
@ApiBearerAuth("JWT-auth")
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
  @ApiOperation({
    summary: "Create new user",
    description: "Create a new user with the provided information",
  })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({
    status: 409,
    description: "User with this email already exists",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  /**
   * Get all users endpoint
   * GET /users
   */
  @Get()
  @ApiOperation({
    summary: "Get all users",
    description: "Retrieve paginated list of users with optional search",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page",
    example: 10,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search term for filtering users",
  })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const paginationDto = new PaginationDto();
    paginationDto.page = pageNum;
    paginationDto.limit = limitNum;
    const result = await this.getUserUseCase.executeAll(paginationDto, search);

    const totalPages = Math.ceil(result.total / limitNum);

    return {
      ...result,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Get active users endpoint
   * GET /users/active
   */
  @Get("active")
  @ApiOperation({
    summary: "Get active users",
    description: "Retrieve all active users",
  })
  @ApiResponse({
    status: 200,
    description: "Active users retrieved successfully",
    type: [UserResponseDto],
  })
  async findActive(): Promise<UserResponseDto[]> {
    return this.getUserUseCase.executeActive();
  }

  /**
   * Get user count endpoint
   * GET /users/count
   */
  @Get("count")
  @ApiOperation({
    summary: "Get user count",
    description: "Get total number of users",
  })
  @ApiResponse({
    status: 200,
    description: "User count retrieved successfully",
  })
  async getCount(): Promise<{ count: number }> {
    return this.getUserUseCase.executeCount();
  }

  /**
   * Get user by email endpoint
   * GET /users/email/:email
   */
  @Get("email/:email")
  @ApiOperation({
    summary: "Get user by email",
    description: "Retrieve a user by their email address",
  })
  @ApiParam({ name: "email", description: "User email address" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findByEmail(@Param("email") email: string): Promise<UserResponseDto> {
    return this.getUserUseCase.executeByEmail(email);
  }

  /**
   * Get users by role endpoint
   * GET /users/role/:roleName
   */
  @Get("role/:roleName")
  @ApiOperation({
    summary: "Get users by role",
    description: "Retrieve all users with a specific role",
  })
  @ApiParam({ name: "roleName", description: "Role name" })
  @ApiResponse({
    status: 200,
    description: "Users retrieved successfully",
    type: [UserResponseDto],
  })
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
  @ApiOperation({
    summary: "Check if user exists",
    description: "Check if a user with the given email exists",
  })
  @ApiParam({ name: "email", description: "User email address" })
  @ApiResponse({ status: 200, description: "Existence check completed" })
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
  @ApiOperation({
    summary: "Get user by ID",
    description: "Retrieve a user by their ID",
  })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
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
  @ApiOperation({
    summary: "Update user",
    description: "Update user information",
  })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
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
  @ApiOperation({
    summary: "Assign roles to user",
    description: "Assign one or more roles to a user",
  })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "Roles assigned successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
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
  @ApiOperation({ summary: "Delete user", description: "Delete a user by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 204, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
