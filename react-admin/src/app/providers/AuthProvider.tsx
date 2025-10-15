import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthLogin, useAuthLogout, useAuthProfile, useAuthRefreshToken, useAuthRegister } from '../../features/auth/hooks/useAuthQueries';
import { authService } from '../../features/auth/services/authService';
import { AuthContextType } from '../../features/auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    // TanStack Query hooks
    const { data: user, isLoading: profileLoading, error: profileError } = useAuthProfile();
    const loginMutation = useAuthLogin();
    const logoutMutation = useAuthLogout();
    const registerMutation = useAuthRegister();
    const refreshTokenMutation = useAuthRefreshToken();

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            const token = authService.getStoredToken();

            if (token && authService.isTokenValid()) {
                // Token exists and is valid, profile will be fetched by useAuthProfile
                setIsInitialized(true);
            } else {
                // No valid token, user is not authenticated
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, []);

    // Handle token refresh
    useEffect(() => {
        const token = authService.getStoredToken();

        if (token && !authService.isTokenValid()) {
            // Token is expired, try to refresh
            refreshTokenMutation.mutate();
        }
    }, [refreshTokenMutation]);

    // Determine authentication state
    const isAuthenticated = !!user && !profileError;
    const isLoading = profileLoading || !isInitialized || loginMutation.isPending || registerMutation.isPending;
    const error = profileError?.message || loginMutation.error?.message || registerMutation.error?.message || null;

    // Auth context value
    const authContextValue: AuthContextType = {
        user: user || null,
        token: authService.getStoredToken(),
        isAuthenticated,
        isLoading,
        error,
        login: async (credentials) => {
            try {
                await loginMutation.mutateAsync(credentials);
            } catch (error) {
                throw error;
            }
        },
        register: async (data) => {
            try {
                await registerMutation.mutateAsync(data);
            } catch (error) {
                throw error;
            }
        },
        logout: async () => {
            try {
                await logoutMutation.mutateAsync();
            } catch (error) {
                // Even if logout fails on server, clear local state
                authService.logout();
            }
        },
        refreshToken: async () => {
            try {
                await refreshTokenMutation.mutateAsync();
            } catch (error) {
                throw error;
            }
        },
        clearError: () => {
            // Clear errors by refetching profile
            // This will trigger a refetch and clear any stale errors
        },
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};


















