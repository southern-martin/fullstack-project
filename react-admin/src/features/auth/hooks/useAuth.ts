import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthState, LoginCredentials, RegisterData } from '../types';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      setHasInitialized(true);
      console.log('Auth state updated, isAuthenticated: true');
    } catch (error: any) {
      let errorMessage = error.message || 'Login failed';

      // Handle validation errors (only for 400 Bad Request, not 401 Unauthorized)
      if (error.validationErrors && error.status === 400) {
        const validationMessages = Object.values(error.validationErrors).join(
          ', '
        );
        errorMessage = `Validation failed: ${validationMessages}`;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.register(data);
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      setHasInitialized(true);
    } catch (error: any) {
      let errorMessage = error.message || 'Registration failed';

      // Handle validation errors (only for 400 Bad Request)
      if (error.validationErrors && error.status === 400) {
        const validationMessages = Object.values(error.validationErrors).join(
          ', '
        );
        errorMessage = `Validation failed: ${validationMessages}`;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      setHasInitialized(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (!authService.isTokenValid()) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
      return;
    }

    try {
      const response = await authService.refreshToken();
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    if (hasInitialized) return;

    const checkAuth = async () => {
      const token = authService.getStoredToken();

      if (!token || !authService.isTokenValid()) {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
        }));
        setHasInitialized(true);
        return;
      }

      try {
        const user = await authService.getProfile();
        setState(prev => ({
          ...prev,
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Auth check failed:', error);
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
      setHasInitialized(true);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove hasInitialized dependency to prevent infinite loop

  return {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };
};







