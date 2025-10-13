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
import { CreateRoleDto } from "../../application/dtos/create-role.dto";
import { RoleResponseDto } from "../../application/dtos/role-response.dto";
import { UpdateRoleDto } from "../../application/dtos/update-role.dto";
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
   * Get all roles endpoint
   * GET /roles
   */
  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    return this.getRoleUseCase.executeAll();
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
