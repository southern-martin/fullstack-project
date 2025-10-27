import React, { useState } from 'react';

import { useAuthContext } from '../../../app/providers/AuthProvider';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Input from '../../../shared/components/ui/Input';
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher';
import { LoginCredentials } from '../types';
import { useAuthLabels } from '../hooks/useAuthTranslation';

const LoginForm: React.FC = () => {
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthContext();
    const { L } = useAuthLabels();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: 'admin@example.com',
        password: 'Admin123!',
    });
    const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({});

    // Don't render the form if already authenticated (routing will handle redirect)
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{L.status.redirecting}</p>
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(formData);
            // Navigation will be handled by the routing system
        } catch (error) {
            // Error is handled by the useAuth hook
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-6">
            <div className="max-w-md w-full space-y-8">
                {/* Language Switcher - positioned at top right */}
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>
                
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {L.page.signInTitle}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {L.page.signInSubtitle}
                    </p>
                </div>
                <Card className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label={L.form.emailAddress}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={validationErrors.email}
                            placeholder={L.placeholders.enterEmail}
                            required
                        />

                        <Input
                            label={L.form.password}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={validationErrors.password}
                            placeholder={L.placeholders.enterPassword}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            fullWidth
                        >
                            {isLoading ? L.buttons.signingIn : L.buttons.signIn}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm;






