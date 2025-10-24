import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";
import { PermissionResponseDto } from "../../application/dto/permission-response.dto";
import { GetPermissionsUseCase } from "../../application/use-cases/get-permissions.use-case";

/**
 * Permission Controller
 * Interface adapter for HTTP requests related to permissions
 * Follows Clean Architecture principles
 */
@Controller("permissions")
export class PermissionController {
  constructor(
    private readonly getPermissionsUseCase: GetPermissionsUseCase
  ) {}

  /**
   * Get all permissions
   * GET /permissions
   */
  @Get()
  async findAll(): Promise<PermissionResponseDto[]> {
    return this.getPermissionsUseCase.executeAll();
  }

  /**
   * Get all permission categories
   * GET /permissions/categories
   */
  @Get("categories")
  async getCategories(): Promise<{ categories: string[] }> {
    const categories = await this.getPermissionsUseCase.executeCategories();
    return { categories };
  }

  /**
   * Get permissions by category
   * GET /permissions/category/:category
   */
  @Get("category/:category")
  async findByCategory(
    @Param("category") category: string
  ): Promise<PermissionResponseDto[]> {
    return this.getPermissionsUseCase.executeByCategory(category);
  }
}
