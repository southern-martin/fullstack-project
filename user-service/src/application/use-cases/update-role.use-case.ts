import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { RoleResponseDto } from "../dto/role-response.dto";
import { UpdateRoleDto } from "../dto/update-role.dto";

/**
 * Update Role Use Case
 * Application service that orchestrates the role update process
 * Follows Clean Architecture principles
 */
@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  /**
   * Executes the update role use case
   * @param id - Role ID
   * @param updateRoleDto - Update data
   * @returns Updated role response
   */
  async execute(
    id: number,
    updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    // 1. Find existing role
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new NotFoundException("Role not found");
    }

    // 2. Validate update data
    const validation = this.validateRoleUpdateData(updateRoleDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 3. Check if name is being changed and if it already exists
    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const roleWithSameName = await this.roleRepository.findByName(
        updateRoleDto.name
      );
      if (roleWithSameName) {
        throw new ConflictException("Role name already exists");
      }
    }

    // 4. Prepare update data
    const updateData: Partial<any> = {};

    if (updateRoleDto.name !== undefined) updateData.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined)
      updateData.description = updateRoleDto.description;
    if (updateRoleDto.permissions !== undefined)
      updateData.permissions = updateRoleDto.permissions;
    if (updateRoleDto.isActive !== undefined)
      updateData.isActive = updateRoleDto.isActive;

    // 5. Update role in repository
    const updatedRole = await this.roleRepository.update(id, updateData);

    // 6. Return response
    return this.mapToResponseDto(updatedRole);
  }

  /**
   * Validates role update data
   * @param updateData - Role update data
   * @returns Validation result
   */
  private validateRoleUpdateData(updateData: UpdateRoleDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length < 2) {
        errors.push("Role name must be at least 2 characters");
      }
      if (updateData.name.length > 50) {
        errors.push("Role name must not exceed 50 characters");
      }
    }

    if (
      updateData.description !== undefined &&
      updateData.description.length > 200
    ) {
      errors.push("Role description must not exceed 200 characters");
    }

    if (
      updateData.permissions !== undefined &&
      !Array.isArray(updateData.permissions)
    ) {
      errors.push("Permissions must be an array");
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
