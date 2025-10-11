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
import { AssignRolesDto } from "../dto/assign-roles.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UserService } from "../services/user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return await this.userService.findAll(pageNum, limitNum, search);
  }

  @Get("active")
  async findActive(): Promise<UserResponseDto[]> {
    return await this.userService.findActive();
  }

  @Get("count")
  async getCount(): Promise<{ count: number }> {
    const count = await this.userService.getCount();
    return { count };
  }

  @Get("email/:email")
  async findByEmail(@Param("email") email: string): Promise<UserResponseDto> {
    return await this.userService.findByEmail(email);
  }

  @Get("role/:roleName")
  async findByRole(
    @Param("roleName") roleName: string
  ): Promise<UserResponseDto[]> {
    return await this.userService.findByRole(roleName);
  }

  @Get("exists/:email")
  async existsByEmail(
    @Param("email") email: string
  ): Promise<{ exists: boolean }> {
    const exists = await this.userService.existsByEmail(email);
    return { exists };
  }

  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UserResponseDto> {
    return await this.userService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return await this.userService.update(id, updateUserDto);
  }

  @Patch(":id/roles")
  async assignRoles(
    @Param("id", ParseIntPipe) id: number,
    @Body() assignRolesDto: AssignRolesDto
  ): Promise<UserResponseDto> {
    return await this.userService.assignRoles(id, assignRolesDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.userService.delete(id);
  }
}
