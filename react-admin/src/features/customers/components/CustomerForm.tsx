import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import { FormField } from '../../../shared/components/ui/FormField';
import { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '../services/customerApiService';

interface CustomerFormProps {
    customer?: Customer;
    onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
    onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || undefined,
                preferences: {
                    company: formData.company.trim() || undefined
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
    }, [formData, validateForm]); // eslint-disable-line react-hooks/exhaustive-deps

    // Render footer directly - no more onFooterRender pattern
    const footer = (
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
    );

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
            {footer}
        </>
    );
};

export default CustomerForm;
