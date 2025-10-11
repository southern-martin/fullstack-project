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
import { CreateRoleDto } from "../dto/create-role.dto";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { RoleResponseDto } from "../dto/user-response.dto";
import { RoleService } from "../services/role.service";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ roles: RoleResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return await this.roleService.findAll(pageNum, limitNum, search);
  }

  @Get("active")
  async findActive(): Promise<RoleResponseDto[]> {
    return await this.roleService.findActive();
  }

  @Get("count")
  async getCount(): Promise<{ count: number }> {
    const count = await this.roleService.getCount();
    return { count };
  }

  @Get("permission/:permission")
  async findByPermission(
    @Param("permission") permission: string
  ): Promise<RoleResponseDto[]> {
    return await this.roleService.findByPermission(permission);
  }

  @Get("name/:name")
  async findByName(@Param("name") name: string): Promise<RoleResponseDto> {
    return await this.roleService.findByName(name);
  }

  @Get("exists/:name")
  async existsByName(
    @Param("name") name: string
  ): Promise<{ exists: boolean }> {
    const exists = await this.roleService.existsByName(name);
    return { exists };
  }

  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<RoleResponseDto> {
    return await this.roleService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.roleService.delete(id);
  }
}
