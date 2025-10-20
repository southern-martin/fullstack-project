import { apiClient } from '../../../shared/utils/api';
import { AUTH_API_CONFIG } from '../config/authApi';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<{
      data: {
        user: any;
        access_token: string;
        token: string;
        expiresIn: string;
      };
      message: string;
      statusCode: number;
      timestamp: string;
      success: boolean;
    }>(AUTH_API_CONFIG.ENDPOINTS.LOGIN, credentials);

    // Unwrap the data from the standardized API response format
    const responseData = response.data;

    // Transform the response to match the expected AuthResponse format
    const authResponse: AuthResponse = {
      user: responseData.user,
      token: responseData.token || responseData.access_token,
      expiresIn: responseData.expiresIn,
    };

    // Store token in localStorage
    if (authResponse.token) {
      localStorage.setItem('authToken', authResponse.token);
    }

    return authResponse;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<{
      data: {
        user: any;
        access_token: string;
        token: string;
        expiresIn: string;
      };
      message: string;
      statusCode: number;
      timestamp: string;
      success: boolean;
    }>(AUTH_API_CONFIG.ENDPOINTS.REGISTER, data);

    // Unwrap the data from the standardized API response format
    const responseData = response.data;

    // Transform the response to match the expected AuthResponse format
    const authResponse: AuthResponse = {
      user: responseData.user,
      token: responseData.token || responseData.access_token,
      expiresIn: responseData.expiresIn,
    };

    // Store token in localStorage
    if (authResponse.token) {
      localStorage.setItem('authToken', authResponse.token);
    }

    return authResponse;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<{
      data: {
        user: any;
        access_token: string;
        token: string;
        expiresIn: string;
      };
      message: string;
      statusCode: number;
      timestamp: string;
      success: boolean;
    }>(AUTH_API_CONFIG.ENDPOINTS.REFRESH);

    // Unwrap the data from the standardized API response format
    const responseData = response.data;

    // Transform the response to match the expected AuthResponse format
    const authResponse: AuthResponse = {
      user: responseData.user,
      token: responseData.token || responseData.access_token,
      expiresIn: responseData.expiresIn,
    };

    // Update token in localStorage
    if (authResponse.token) {
      localStorage.setItem('authToken', authResponse.token);
    }

    return authResponse;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_API_CONFIG.ENDPOINTS.PROFILE);
    return response;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get('/auth/health');
      return true;
    } catch (error) {
      console.error('Auth service health check failed:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
