import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Role } from "../../domain/entities/role.entity";
import { PermissionRepositoryInterface } from "../../domain/repositories/permission.repository.interface";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { CreateRoleDto } from "../dto/create-role.dto";
import { RoleResponseDto } from "../dto/role-response.dto";

/**
 * Create Role Use Case
 * Application service that orchestrates the role creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject("RoleRepositoryInterface")
    private readonly roleRepository: RoleRepositoryInterface,
    @Inject("PermissionRepositoryInterface")
    private readonly permissionRepository: PermissionRepositoryInterface
  ) {}

  /**
   * Executes the create role use case
   * @param createRoleDto - Role creation data
   * @returns Created role response
   */
  async execute(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    // 1. Validate input
    const validation = this.validateRoleCreationData(createRoleDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. If permissionIds are provided, validate they exist
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findByIds(
        createRoleDto.permissionIds
      );
      if (permissions.length !== createRoleDto.permissionIds.length) {
        throw new BadRequestException("One or more permission IDs are invalid");
      }
    }

    // 3. Check if role name already exists
    const existingRole = await this.roleRepository.findByName(
      createRoleDto.name
    );
    if (existingRole) {
      throw new ConflictException("Role name already exists");
    }

    // 4. Create role entity
    const role = new Role({
      name: createRoleDto.name,
      description: createRoleDto.description,
      isActive: createRoleDto.isActive ?? true,
    });

    // 5. Save role in repository with permissions
    const savedRole = await this.roleRepository.create(
      role,
      createRoleDto.permissionIds
    );

    // 6. Return response
    return this.mapToResponseDto(savedRole);
  }

  /**
   * Validates role creation data
   * @param roleData - Role creation data
   * @returns Validation result
   */
  private validateRoleCreationData(roleData: CreateRoleDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!roleData.name || roleData.name.trim().length < 2) {
      errors.push("Role name must be at least 2 characters");
    }

    if (roleData.name && roleData.name.length > 50) {
      errors.push("Role name must not exceed 50 characters");
    }

    if (roleData.description && roleData.description.length > 200) {
      errors.push("Role description must not exceed 200 characters");
    }

    if (roleData.permissionIds && !Array.isArray(roleData.permissionIds)) {
      errors.push("Permission IDs must be an array");
    }

    if (
      roleData.permissionIds &&
      roleData.permissionIds.some((id) => typeof id !== "number" || id <= 0)
    ) {
      errors.push("All permission IDs must be positive numbers");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Maps role entity to response DTO
   * @param role - Role entity
   * @returns Role response DTO
   */
  private mapToResponseDto(role: any): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
