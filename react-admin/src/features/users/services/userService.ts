import { userApiClient } from './userApiClient';
import { userApiService } from './userApiService';
import { USER_API_CONFIG } from '../../../config/api';

class UserService {
  // Wrap existing userApiService methods
  async getUsers(params?: any) {
    return userApiService.getUsers(params);
  }

  async getUserById(id: number) {
    return userApiService.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return userApiService.getUserByEmail(email);
  }

  async createUser(userData: any) {
    return userApiService.createUser(userData);
  }

  async updateUser(id: number, userData: any) {
    return userApiService.updateUser(id, userData);
  }

  async deleteUser(id: number) {
    return userApiService.deleteUser(id);
  }

  async assignRoles(id: number, roles: any) {
    return userApiService.assignRoles(id, roles);
  }

  async getActiveUsers() {
    return userApiService.getActiveUsers();
  }

  async getUserCount() {
    return userApiService.getUserCount();
  }

  async getUsersByRole(roleName: string) {
    return userApiService.getUsersByRole(roleName);
  }

  async checkUserExists(email: string) {
    return userApiService.checkUserExists(email);
  }

  // Add health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${USER_API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'X-Service': 'user',
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('User service health check failed:', error);
      return false;
    }
  }
}

export const userService = new UserService();
export default userService;
