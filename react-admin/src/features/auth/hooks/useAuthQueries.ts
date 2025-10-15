import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../../../shared/query/queryKeys';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from '../../../shared/types';
import { authService } from '../services/authService';

/**
 * Auth Service Hooks using TanStack Query
 */

// Get user profile
export const useAuthProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    enabled: !!authService.getStoredToken() && authService.isTokenValid(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Health check
export const useAuthHealth = () => {
  return useQuery({
    queryKey: authKeys.health(),
    queryFn: () => authService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 1,
  });
};

// Login mutation
export const useAuthLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      // Set user data in cache
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

// Register mutation
export const useAuthRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      // Set user data in cache
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

// Logout mutation
export const useAuthLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Clear all user data
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
    },
  });
};

// Refresh token mutation
export const useAuthRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (data: AuthResponse) => {
      // Update profile with new token
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
    onError: (error: any) => {
      console.error('Token refresh failed:', error);
      // Clear auth data on refresh failure
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

// Note: validateToken method is not available in authService
// Token validation is handled by isTokenValid() method
