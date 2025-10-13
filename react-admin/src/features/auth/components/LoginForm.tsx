import React, { useState } from 'react';

import { useAuthContext } from '../../../app/providers/AuthProvider';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Input from '../../../shared/components/ui/Input';
import { LoginCredentials } from '../types';

const LoginForm: React.FC = () => {
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthContext();
    // Default test credentials for development/testing
    const [formData, setFormData] = useState<LoginCredentials>({
        email: 'admin@example.com',
        password: 'Admin123',
    });
    const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({});

    // Don't render the form if already authenticated (routing will handle redirect)
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{'Redirecting to dashboard...'}</p>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name as keyof LoginCredentials]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Clear auth error when user starts typing
        if (error) {
            clearError();
        }
    };

    // Client-side validation removed - now handled by backend

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(formData);
            console.log('Login successful, isAuthenticated:', isAuthenticated);
            // Navigation will be handled by the routing system
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {'Sign in to your account'}
                    </h2>
                </div>
                <Card className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label={'Email Address'}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={validationErrors.email}
                            placeholder={'Enter your email'}
                            required
                        />

                        <Input
                            label={'Password'}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={validationErrors.password}
                            placeholder={'Enter your password'}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            fullWidth
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm;






