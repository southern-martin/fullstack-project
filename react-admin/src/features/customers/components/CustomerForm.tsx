import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import { FormField } from '../../../shared/components/ui/FormField';
import { useCustomerLabels } from '../hooks/useCustomerLabels';
import { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '../services/customerApiService';

interface CustomerFormProps {
    customer?: Customer;
    onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
    onCancel: () => void;
    onFooterReady?: (footer: React.ReactNode) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel, onFooterReady }) => {
    // Translation hook
    const { L } = useCustomerLabels();
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
            newErrors.firstName = L.validation.firstNameRequired;
        }

        if (!currentFormData.lastName.trim()) {
            newErrors.lastName = L.validation.lastNameRequired;
        }

        if (!currentFormData.email.trim()) {
            newErrors.email = L.validation.emailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFormData.email)) {
            newErrors.email = L.validation.emailInvalid;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [L]);

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
                toast.error(L.messages.saveError);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [validateForm, onSubmit, L]);

    // Memoize footer to prevent infinite re-renders
    const footer = useMemo(() => (
        <div className="flex justify-end space-x-3">
            <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                {L.buttons.cancel}
            </Button>
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
            >
                {isSubmitting
                    ? L.buttons.saving
                    : customer
                        ? L.buttons.update
                        : L.buttons.create
                }
            </Button>
        </div>
    ), [onCancel, isSubmitting, handleSubmit, customer, L]);

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
                        label={L.form.firstName}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        error={errors.firstName}
                        placeholder={L.placeholders.firstName}
                    />

                    <FormField
                        label={L.form.lastName}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        error={errors.lastName}
                        placeholder={L.placeholders.lastName}
                    />

                    <FormField
                        label={L.form.email}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={errors.email}
                        placeholder={L.placeholders.email}
                    />

                    <FormField
                        label={L.form.phone}
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        error={errors.phone}
                        placeholder={L.placeholders.phone}
                    />

                    <FormField
                        label={L.form.company}
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange('company')}
                        error={errors.company}
                        placeholder={L.placeholders.company}
                    />
                </div>
            </div>
        </>
    );
};

export default CustomerForm;
