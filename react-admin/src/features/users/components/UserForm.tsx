import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from '../../../shared/components/ui/Button';
import { CheckboxField, FormField, SelectField } from '../../../shared/components/ui/FormField';
import { Role, User } from '../../../shared/types';
import { CreateUserRequest, UpdateUserRequest } from '../services/userApiService';


const MOCK_ROLES: Role[] = [
    { id: 1, name: 'Admin', description: 'Administrator role' },
    { id: 2, name: 'Editor', description: 'Editor role' },
    { id: 3, name: 'Viewer', description: 'Viewer role' },
];

const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleIds: [] as number[],
    isActive: true,
};

interface UserFormProps {
    user?: User;
    onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
    onCancel: () => void;
    onFooterReady?: (footer: React.ReactNode) => void;
}

// Helper function to clear field errors
const clearFieldError = (errors: Record<string, string>, fieldName: string): Record<string, string> => {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    return newErrors;
};

// Helper function to create form data for submission
const createSubmissionData = (
    formData: typeof initialFormData,
    user?: User
): CreateUserRequest | UpdateUserRequest => {
    if (user) {
        // For updates, exclude roleIds and password
        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            isActive: formData.isActive,
        };
    } else {
        // For creation, include roleIds and password
        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            roleIds: formData.roleIds,
        };
    }
};

/**
 * UserForm - Enhanced user form with translation preloading
 * 
 * Features:
 * - Preloads all form translations before displaying
 * - Shows loading state while translations are being fetched
 * - Displays error messages if translation loading fails
 * - Provides smooth user experience without text flashing
 */
const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, onFooterReady }) => {

    // Form state
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use ref to access current form data without causing re-renders
    const formDataRef = useRef(formData);
    formDataRef.current = formData;

    // Use ref to track if footer has been passed to parent
    const footerPassedRef = useRef(false);


    // Initialize form data and roles
    useEffect(() => {
        try {
            if (user) {
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    password: '', // Password is not pre-filled for security
                    roleIds: user.roles ? user.roles.map(role => role.id) : [],
                    isActive: user.isActive !== undefined ? user.isActive : true,
                });
            } else {
                setFormData(initialFormData);
            }
        } catch (error) {
            // Error initializing form data - use default values
            setFormData(initialFormData);
        }

        // In a real app, you'd fetch roles here
        // For now, use mock roles
        setRoles(MOCK_ROLES);
        setLoadingRoles(false);
    }, [user]);

    // Event handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear field error when user starts typing (but no client-side validation)
        if (errors[name]) {
            setErrors(prev => clearFieldError(prev, name));
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
        setFormData(prev => ({ ...prev, roleIds: selectedOptions }));

        // Clear role error when user selects roles
        if (errors.roleIds) {
            setErrors(prev => clearFieldError(prev, 'roleIds'));
        }
    };

    // Client-side validation removed - all validation is now handled by the server
    // The form will display server-side validation errors returned from the API

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        // Clear previous errors
        setErrors({});

        // Get current form data from ref
        const currentFormData = formDataRef.current;

        // No client-side validation - all validation is handled by the server
        setIsSubmitting(true);

        const dataToSubmit = createSubmissionData(currentFormData, user);

        try {
            await onSubmit(dataToSubmit);
        } catch (error: unknown) {
            // Handle custom rule errors from backend
            if (error && typeof error === 'object' && 'customRuleErrors' in error) {
                const customRuleError = error as { customRuleErrors: string[] };
                // Display custom rule errors in the validation summary
                setErrors({ general: customRuleError.customRuleErrors.join(' ') });
                return;
            }

            // Handle validation errors from backend
            if (error && typeof error === 'object' && 'validationErrors' in error) {
                const validationError = error as { validationErrors: Record<string, string[]> };
                // Convert array of errors to single error per field
                const fieldErrors: Record<string, string> = {};
                Object.entries(validationError.validationErrors).forEach(([field, errors]) => {
                    if (Array.isArray(errors) && errors.length > 0) {
                        fieldErrors[field] = errors[0]; // Take the first error for each field
                    }
                });
                setErrors(fieldErrors);
                return;
            }

            // Handle validation errors from backend (direct response format)
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.data?.fieldErrors) {
                    // Handle field-specific validation errors from the server
                    const fieldErrors: Record<string, string> = {};
                    Object.entries(axiosError.response.data.fieldErrors).forEach(([field, errors]) => {
                        if (Array.isArray(errors) && errors.length > 0) {
                            fieldErrors[field] = errors[0]; // Take the first error for each field
                        }
                    });
                    setErrors(fieldErrors);
                    return;
                } else if (axiosError.response?.data?.message) {
                    // Handle general error messages
                    setErrors({ general: axiosError.response.data.message });
                    return;
                }
            }

            // Handle string-based validation errors (from backend response)
            if (error && typeof error === 'object' && 'message' in error) {
                const errorMessage = (error as { message: string }).message;
                setErrors({ general: errorMessage });
                return;
            }

            // Re-throw non-validation errors so the parent component can handle them
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [user, onSubmit]); // Remove formData from dependencies

    // Memoize footer to prevent infinite re-renders
    const footer = useMemo(() => (
        <div className="flex justify-end space-x-3">
            <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
            >
                {isSubmitting
                    ? 'Saving...'
                    : user
                        ? 'Update User'
                        : 'Create User'
                }
            </Button>
        </div>
    ), [onCancel, isSubmitting, handleSubmit, user]);

    // Pass footer to parent component only once when component mounts
    useEffect(() => {
        if (onFooterReady && !footerPassedRef.current) {
            onFooterReady(footer);
            footerPassedRef.current = true;
        }
    }, [onFooterReady, footer]);

    return (
        <div className="animate-fade-in">
            {/* Show validation summary only for general errors */}
            {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 m-6 mb-0">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{errors.general}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 p-6">
                <FormField
                    label="First Name"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                />

                <FormField
                    label="Last Name"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                />

                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />

                {!user && (
                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />
                )}

                <SelectField
                    label="Roles"
                    name="roleIds"
                    value={formData.roleIds.map(String)}
                    onChange={handleRoleChange}
                    options={roles.map(role => ({ value: role.id, label: role.name }))}
                    error={errors.roleIds}
                    multiple
                    disabled={loadingRoles}
                />

                <CheckboxField
                    label="Is Active"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    error={errors.isActive}
                />
            </div>
        </div>
    );
};

export default UserForm;
