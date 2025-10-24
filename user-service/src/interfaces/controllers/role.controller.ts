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
import { ListRolesQueryDto } from "../../application/dto/list-roles-query.dto";
import { CreateRoleDto } from "../../application/dto/create-role.dto";
import { RoleResponseDto } from "../../application/dto/role-response.dto";
import { UpdateRoleDto } from "../../application/dto/update-role.dto";
import { CreateRoleUseCase } from "../../application/use-cases/create-role.use-case";
import { DeleteRoleUseCase } from "../../application/use-cases/delete-role.use-case";
import { GetRoleUseCase } from "../../application/use-cases/get-role.use-case";
import { UpdateRoleUseCase } from "../../application/use-cases/update-role.use-case";

/**
 * Role Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@Controller("roles")
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase
  ) {}

  /**
   * Create role endpoint
   * POST /roles
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  /**
   * Get all roles endpoint with pagination
   * GET /roles
   */
  @Get()
  async findAll(@Query() query: ListRolesQueryDto): Promise<{ 
    data: RoleResponseDto[]; 
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.getRoleUseCase.executeAll(query);
  }

  /**
   * Get active roles only
   * GET /roles/active
   */
  @Get("active")
  async findActive(): Promise<RoleResponseDto[]> {
    return this.getRoleUseCase.executeActive();
  }

  /**
   * Get role statistics
   * GET /roles/stats
   */
  @Get("stats")
  async getStats(): Promise<{
    totalRoles: number;
    activeRoles: number;
    inactiveRoles: number;
    totalPermissions: number;
    averagePermissionsPerRole: number;
  }> {
    return this.getRoleUseCase.executeStats();
  }

  /**
   * Get role by name endpoint
   * GET /roles/name/:name
   */
  @Get("name/:name")
  async findByName(
    @Param("name") name: string
  ): Promise<RoleResponseDto> {
    return this.getRoleUseCase.executeByName(name);
  }

  /**
   * Get users with a specific role
   * GET /roles/:id/users
   */
  @Get(":id/users")
  async getUsersByRole(
    @Param("id", ParseIntPipe) id: number
  ): Promise<any[]> {
    return this.getRoleUseCase.executeUsersByRole(id);
  }

  /**
   * Get role by ID endpoint
   * GET /roles/:id
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<RoleResponseDto> {
    return this.getRoleUseCase.executeById(id);
  }

  /**
   * Update role endpoint
   * PATCH /roles/:id
   */
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    return this.updateRoleUseCase.execute(id, updateRoleDto);
  }

  /**
   * Delete role endpoint
   * DELETE /roles/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteRoleUseCase.execute(id);
  }
}
