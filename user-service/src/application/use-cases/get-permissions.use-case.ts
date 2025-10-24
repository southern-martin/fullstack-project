import { Inject, Injectable } from "@nestjs/common";
import { PermissionRepositoryInterface } from "../../domain/repositories/permission.repository.interface";
import { PermissionResponseDto } from "../dto/permission-response.dto";

/**
 * Get Permissions Use Case
 * Application service that orchestrates the permission retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface
  ) {}

  /**
   * Get all permissions
   */
  async executeAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.findAll();
    return permissions.map((permission) => this.mapToResponseDto(permission));
  }

  /**
   * Get permission by ID
   */
  async executeById(id: number): Promise<PermissionResponseDto | null> {
    const permission = await this.permissionRepository.findById(id);
    return permission ? this.mapToResponseDto(permission) : null;
  }

  /**
   * Get permissions by category
   */
  async executeByCategory(category: string): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.findByCategory(category);
    return permissions.map((permission) => this.mapToResponseDto(permission));
  }

  /**
   * Get all categories
   */
  async executeCategories(): Promise<string[]> {
    return this.permissionRepository.getCategories();
  }

  /**
   * Map permission entity to response DTO
   */
  private mapToResponseDto(permission: any): PermissionResponseDto {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      category: permission.category,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
