import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { ListRolesQueryDto } from "../dto/list-roles-query.dto";
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
    private readonly roleRepository: RoleRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface
  ) {}

  /**
   * Executes the get role by ID use case with user count
   * @param id - Role ID
   * @returns Role response with stats
   */
  async executeById(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException("Role not found");
    }

    // Get users with this role
    const users = await this.userRepository.findByRole(role.name);
    
    const response = this.mapToResponseDto(role);
    response.usersCount = users.length;
    response.permissionsCount = role.permissions?.length || 0;
    
    return response;
  }

  /**
   * Executes the get role by name use case
   * @param name - Role name
   * @returns Role response
   */
  async executeByName(name: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException("Role not found");
    }

    const users = await this.userRepository.findByRole(role.name);
    const response = this.mapToResponseDto(role);
    response.usersCount = users.length;
    response.permissionsCount = role.permissions?.length || 0;
    
    return response;
  }

  /**
   * Executes the get all roles use case with pagination
   * @param query - Query parameters
   * @returns Paginated roles
   */
  async executeAll(query?: ListRolesQueryDto): Promise<{ 
    data: RoleResponseDto[]; 
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const search = query?.search;
    const activeOnly = query?.activeOnly;

    // Create PaginationDto
    const paginationDto = new PaginationDto();
    paginationDto.page = page;
    paginationDto.limit = limit;
    if (search) {
      paginationDto.search = search;
    }

    let rolesResult;
    
    if (search) {
      rolesResult = await this.roleRepository.search(search, paginationDto);
    } else {
      rolesResult = await this.roleRepository.findAll(paginationDto);
    }

    let roles = rolesResult.roles;
    
    // Filter active roles if requested
    if (activeOnly) {
      roles = roles.filter(role => role.isActive);
    }

    const total = rolesResult.total;
    const totalPages = Math.ceil(total / limit);

    const data = roles.map((role) => {
      const dto = this.mapToResponseDto(role);
      dto.permissionsCount = role.permissions?.length || 0;
      return dto;
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get active roles only
   */
  async executeActive(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findActive();
    return roles.map((role) => this.mapToResponseDto(role));
  }

  /**
   * Get role statistics
   */
  async executeStats(): Promise<{
    totalRoles: number;
    activeRoles: number;
    inactiveRoles: number;
    totalPermissions: number;
    averagePermissionsPerRole: number;
  }> {
    const total = await this.roleRepository.count();
    const activeCount = await this.roleRepository.countActive();
    const allRoles = await this.roleRepository.findAll();
    
    const totalPermissions = allRoles.roles.reduce(
      (sum, role) => sum + (role.permissions?.length || 0),
      0
    );

    return {
      totalRoles: total,
      activeRoles: activeCount,
      inactiveRoles: total - activeCount,
      totalPermissions,
      averagePermissionsPerRole: total > 0 ? Math.round(totalPermissions / total * 10) / 10 : 0,
    };
  }

  /**
   * Get users assigned to a role
   */
  async executeUsersByRole(roleId: number): Promise<any[]> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException("Role not found");
    }

    const users = await this.userRepository.findByRole(role.name);
    
    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    }));
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
      permissions: role.permissions || [],
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
