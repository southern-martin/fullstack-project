import { PaginatedResponse, PaginationParams } from '../../../shared/types';
import { ROLES_API_CONFIG } from '../config/rolesApi';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  RoleStats,
  PermissionCategory,
} from '../types';
import { roleApiClient } from './roleApiClient';

class RoleApiService {
  private readonly basePath: string;
  private readonly permissionsPath: string;

  constructor() {
    this.basePath = ROLES_API_CONFIG.ENDPOINTS.LIST;
    this.permissionsPath = ROLES_API_CONFIG.PERMISSIONS.LIST;
  }

  // ==================== Role CRUD Operations ====================

  /**
   * Get paginated list of roles
   */
  async getRoles(params?: PaginationParams): Promise<PaginatedResponse<Role>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    const response = await roleApiClient.get<{
      data: {
        data: Role[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    }>(endpoint);

    // Extract the nested data structure from the API response
    return response.data;
  }

  /**
   * Get a single role by ID
   */
  async getRoleById(id: number): Promise<Role> {
    return roleApiClient.get<{ data: Role }>(
      ROLES_API_CONFIG.ENDPOINTS.BY_ID(id)
    ).then(res => res.data);
  }

  /**
   * Get a role by name
   */
  async getRoleByName(name: string): Promise<Role> {
    return roleApiClient.get<{ data: Role }>(
      ROLES_API_CONFIG.ENDPOINTS.BY_NAME(name)
    ).then(res => res.data);
  }

  /**
   * Get all active roles
   */
  async getActiveRoles(): Promise<Role[]> {
    return roleApiClient.get<{ data: Role[] }>(
      ROLES_API_CONFIG.ENDPOINTS.ACTIVE
    ).then(res => res.data);
  }

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleRequest): Promise<Role> {
    return roleApiClient.post<{ data: Role }>(
      ROLES_API_CONFIG.ENDPOINTS.CREATE,
      data
    ).then(res => res.data);
  }

  /**
   * Update an existing role
   */
  async updateRole(id: number, data: UpdateRoleRequest): Promise<Role> {
    return roleApiClient.put<{ data: Role }>(
      ROLES_API_CONFIG.ENDPOINTS.UPDATE(id),
      data
    ).then(res => res.data);
  }

  /**
   * Delete a role
   */
  async deleteRole(id: number): Promise<void> {
    return roleApiClient.delete(ROLES_API_CONFIG.ENDPOINTS.DELETE(id));
  }

  /**
   * Get role count
   */
  async getRoleCount(): Promise<number> {
    return roleApiClient.get<{ data: { count: number } }>(
      ROLES_API_CONFIG.ENDPOINTS.COUNT
    ).then(res => res.data.count);
  }

  /**
   * Get role statistics
   */
  async getRoleStats(): Promise<RoleStats> {
    return roleApiClient.get<{ data: RoleStats }>(
      ROLES_API_CONFIG.ENDPOINTS.STATS
    ).then(res => res.data);
  }

  // ==================== Permission Management ====================

  /**
   * Assign permissions to a role
   */
  async assignPermissions(
    roleId: number,
    data: AssignPermissionsRequest
  ): Promise<Role> {
    return roleApiClient.post<{ data: Role }>(
      ROLES_API_CONFIG.ENDPOINTS.ASSIGN_PERMISSIONS(roleId),
      data
    ).then(res => res.data);
  }

  /**
   * Get users with a specific role
   */
  async getUsersByRole(roleId: number): Promise<any[]> {
    return roleApiClient.get<{ data: any[] }>(
      ROLES_API_CONFIG.ENDPOINTS.USERS_BY_ROLE(roleId)
    ).then(res => res.data);
  }

  // ==================== Permission Operations ====================

  /**
   * Get all available permissions
   */
  async getPermissions(): Promise<Permission[]> {
    return roleApiClient.get<{ data: Permission[] }>(
      this.permissionsPath
    ).then(res => res.data);
  }

  /**
   * Get permissions by category
   */
  async getPermissionsByCategory(category: PermissionCategory): Promise<Permission[]> {
    return roleApiClient.get<{ data: Permission[] }>(
      ROLES_API_CONFIG.PERMISSIONS.BY_CATEGORY(category)
    ).then(res => res.data);
  }

  /**
   * Get all permission categories
   */
  async getPermissionCategories(): Promise<PermissionCategory[]> {
    return roleApiClient.get<{ data: PermissionCategory[] }>(
      ROLES_API_CONFIG.PERMISSIONS.CATEGORIES
    ).then(res => res.data);
  }
}

export const roleApiService = new RoleApiService();
