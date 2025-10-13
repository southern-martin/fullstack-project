import {
  PaginatedResponse,
  PaginationParams,
  User,
} from '../../../shared/types';
import { apiClient } from '../../../shared/utils/api';
import { USERS_API_CONFIG } from '../config/usersApi';

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleIds?: number[];
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface AssignRolesRequest {
  roleIds: number[];
}

class UserApiService {
  private readonly basePath: string;

  constructor() {
    try {
      this.basePath = USERS_API_CONFIG?.ENDPOINTS?.LIST || '/users';
      console.log('UserApiService initialized with basePath:', this.basePath);
    } catch (error) {
      console.error('Error initializing UserApiService:', error);
      this.basePath = '/users'; // Fallback
    }
  }

  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder)
      queryParams.append('sortOrder', params.sortOrder.toUpperCase());

    const url = queryParams.toString()
      ? `${this.basePath}?${queryParams}`
      : this.basePath;

    // User Service returns {users: User[], total: number}
    // Frontend expects {data: User[], total: number, page: number, limit: number, totalPages: number}
    const response = await apiClient.get<{ users: User[]; total: number }>(url);

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const totalPages = Math.ceil(response.total / limit);

    return {
      data: response.users,
      total: response.total,
      page,
      limit,
      totalPages,
    };
  }

  async getUserById(id: number): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${id}`);
  }

  async getUserByEmail(email: string): Promise<User> {
    return apiClient.get<User>(USERS_API_CONFIG.ENDPOINTS.BY_EMAIL(email));
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(USERS_API_CONFIG.ENDPOINTS.CREATE, userData);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>(
      USERS_API_CONFIG.ENDPOINTS.UPDATE(id),
      userData
    );
  }

  async deleteUser(id: number): Promise<void> {
    return apiClient.delete<void>(USERS_API_CONFIG.ENDPOINTS.DELETE(id));
  }

  async assignRoles(id: number, roles: AssignRolesRequest): Promise<User> {
    return apiClient.patch<User>(
      USERS_API_CONFIG.ENDPOINTS.ASSIGN_ROLES(id),
      roles
    );
  }

  async getActiveUsers(): Promise<User[]> {
    return apiClient.get<User[]>(USERS_API_CONFIG.ENDPOINTS.ACTIVE);
  }

  async getUserCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(USERS_API_CONFIG.ENDPOINTS.COUNT);
  }

  async getUsersByRole(roleName: string): Promise<User[]> {
    return apiClient.get<User[]>(USERS_API_CONFIG.ENDPOINTS.BY_ROLE(roleName));
  }

  async checkUserExists(email: string): Promise<{ exists: boolean }> {
    return apiClient.get<{ exists: boolean }>(
      USERS_API_CONFIG.ENDPOINTS.EXISTS(email)
    );
  }
}

export const userApiService = new UserApiService();
