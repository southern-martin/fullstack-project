import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { RoleResponseDto } from "../dto/role-response.dto";

/**
 * Get Role Use Case
 * Application service that orchestrates the role retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetRoleUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  /**
   * Executes the get role by ID use case
   * @param id - Role ID
   * @returns Role response
   */
  async executeById(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException("Role not found");
    }

    return this.mapToResponseDto(role);
  }

  /**
   * Executes the get all roles use case
   * @returns All roles
   */
  async executeAll(): Promise<RoleResponseDto[]> {
    const rolesResult = await this.roleRepository.findAll();
    return rolesResult.roles.map((role) => this.mapToResponseDto(role));
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
