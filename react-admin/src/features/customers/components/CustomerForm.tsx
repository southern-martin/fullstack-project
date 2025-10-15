import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import { FormField } from '../../../shared/components/ui/FormField';
import { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '../services/customerApiService';

interface CustomerFormProps {
    customer?: Customer;
    onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
    onCancel: () => void;
    onFooterReady?: (footer: React.ReactNode) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel, onFooterReady }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use ref to access current form data without causing re-renders
    const formDataRef = useRef(formData);
    formDataRef.current = formData;

    // Use ref to track if footer has been passed to parent
    const footerPassedRef = useRef(false);

    useEffect(() => {
        if (customer) {
            setFormData({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone || '',
                company: customer.preferences?.company || ''
            });
        }
    }, [customer]);

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};
        const currentFormData = formDataRef.current;

        if (!currentFormData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!currentFormData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!currentFormData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFormData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, []);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const currentFormData = formDataRef.current;
            const submitData = {
                firstName: currentFormData.firstName.trim(),
                lastName: currentFormData.lastName.trim(),
                email: currentFormData.email.trim(),
                phone: currentFormData.phone.trim() || undefined,
                preferences: {
                    company: currentFormData.company.trim() || undefined
                }
            };

            await onSubmit(submitData);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'validationErrors' in error) {
                setErrors((error as { validationErrors: Record<string, string> }).validationErrors);
            } else {
                toast.error('An error occurred while saving the customer');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [validateForm, onSubmit]);

    // Memoize footer to prevent infinite re-renders
    const footer = useMemo(() => (
        <div className="flex justify-end space-x-3">
            <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                {'Cancel'}
            </Button>
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
            >
                {isSubmitting
                    ? 'Saving...'
                    : customer
                        ? 'Update Customer'
                        : 'Create Customer'
                }
            </Button>
        </div>
    ), [onCancel, isSubmitting, handleSubmit, customer]);

    // Pass footer to parent component only once when component mounts
    useEffect(() => {
        if (onFooterReady && !footerPassedRef.current) {
            onFooterReady(footer);
            footerPassedRef.current = true;
        }
    }, [onFooterReady, footer]);

    return (
        <>
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label={'First Name'}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        error={errors.firstName}
                        placeholder={'Enter first name'}
                    />

                    <FormField
                        label={'Last Name'}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        error={errors.lastName}
                        placeholder={'Enter last name'}
                    />

                    <FormField
                        label={'Email'}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={errors.email}
                        placeholder={'Enter email address'}
                    />

                    <FormField
                        label={'Phone'}
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        error={errors.phone}
                        placeholder={'Enter phone number'}
                    />

                    <FormField
                        label={'Company'}
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange('company')}
                        error={errors.company}
                        placeholder={'Enter company name'}
                    />
                </div>
            </div>
        </>
    );
};

export default CustomerForm;
