import { authApiClient } from '../../../shared/utils/authApi';
import { AUTH_API_CONFIG } from '../config/authApi';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authApiClient.post<{
      success: boolean;
      data: {
        user: any;
        accessToken: string;
        expiresIn: string;
      };
      message: string;
    }>(AUTH_API_CONFIG.ENDPOINTS.LOGIN, credentials);

    // Transform the response to match the expected AuthResponse format
    const authResponse: AuthResponse = {
      user: response.data.user,
      token: response.data.accessToken,
      expiresIn: response.data.expiresIn,
    };

    // Store token in localStorage
    if (authResponse.token) {
      localStorage.setItem('authToken', authResponse.token);
    }

    return authResponse;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await authApiClient.post<{
      success: boolean;
      data: {
        user: any;
        accessToken: string;
        expiresIn: string;
      };
      message: string;
    }>(AUTH_API_CONFIG.ENDPOINTS.REGISTER, data);

    // Transform the response to match the expected AuthResponse format
    const authResponse: AuthResponse = {
      user: response.data.user,
      token: response.data.accessToken,
      expiresIn: response.data.expiresIn,
    };

    // Store token in localStorage
    if (authResponse.token) {
      localStorage.setItem('authToken', authResponse.token);
    }

    return authResponse;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await authApiClient.post<{
      success: boolean;
      data: {
        user: any;
        accessToken: string;
        expiresIn: string;
      };
      message: string;
    }>(AUTH_API_CONFIG.ENDPOINTS.REFRESH);

    // Transform the response to match the expected AuthResponse format
    const authResponse: AuthResponse = {
      user: response.data.user,
      token: response.data.accessToken,
      expiresIn: response.data.expiresIn,
    };

    // Update token in localStorage
    if (authResponse.token) {
      localStorage.setItem('authToken', authResponse.token);
    }

    return authResponse;
  }

  async logout(): Promise<void> {
    try {
      await authApiClient.post(AUTH_API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  }

  async getProfile(): Promise<User> {
    return authApiClient.get<User>(AUTH_API_CONFIG.ENDPOINTS.PROFILE);
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
      await authApiClient.get('/health');
      return true;
    } catch (error) {
      console.error('Auth service health check failed:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
