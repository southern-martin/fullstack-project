import {
  PaginatedResponse,
  PaginationParams,
  User,
} from '../../../shared/types';
import { USERS_API_CONFIG } from '../config/usersApi';
import { userApiClient } from './userApiClient';

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
      console.log('UserApiService constructor called');
      console.log('USERS_API_CONFIG:', USERS_API_CONFIG);
      console.log('USERS_API_CONFIG.ENDPOINTS:', USERS_API_CONFIG?.ENDPOINTS);
      this.basePath = USERS_API_CONFIG?.ENDPOINTS?.LIST || '/users';
      console.log('UserApiService initialized with basePath:', this.basePath);
    } catch (error) {
      console.error('Error initializing UserApiService:', error);
      console.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );
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

    // User Service now returns standardized format: {data: {users: User[], total: number}, message, statusCode, ...}
    // Frontend expects {data: User[], total: number, page: number, limit: number, totalPages: number}
    const response = await userApiClient.get<{
      data: { users: User[]; total: number };
      message: string;
      statusCode: number;
      timestamp: string;
      success: boolean;
    }>(url);

    // Unwrap the data field from the standardized response
    const responseData = response.data;

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const totalPages = Math.ceil(responseData.total / limit);

    return {
      data: responseData.users,
      total: responseData.total,
      page,
      limit,
      totalPages,
    };
  }

  async getUserById(id: number): Promise<User> {
    const response = await userApiClient.get<{
      data: User;
      message: string;
      statusCode: number;
    }>(`${this.basePath}/${id}`);
    return response.data;
  }

  async getUserByEmail(email: string): Promise<User> {
    const response = await userApiClient.get<{
      data: User;
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.BY_EMAIL(email));
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await userApiClient.post<{
      data: User;
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.CREATE, userData);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await userApiClient.patch<{
      data: User;
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.UPDATE(id), userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await userApiClient.delete<{
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.DELETE(id));
  }

  async assignRoles(id: number, roles: AssignRolesRequest): Promise<User> {
    const response = await userApiClient.patch<{
      data: User;
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.ASSIGN_ROLES(id), roles);
    return response.data;
  }

  async getActiveUsers(): Promise<User[]> {
    const response = await userApiClient.get<{
      data: User[];
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.ACTIVE);
    return response.data;
  }

  async getUserCount(): Promise<{ count: number }> {
    const response = await userApiClient.get<{
      data: { count: number };
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.COUNT);
    return response.data;
  }

  async getUsersByRole(roleName: string): Promise<User[]> {
    const response = await userApiClient.get<{
      data: User[];
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.BY_ROLE(roleName));
    return response.data;
  }

  async checkUserExists(email: string): Promise<{ exists: boolean }> {
    const response = await userApiClient.get<{
      data: { exists: boolean };
      message: string;
      statusCode: number;
    }>(USERS_API_CONFIG.ENDPOINTS.EXISTS(email));
    return response.data;
  }
}

export const userApiService = new UserApiService();
