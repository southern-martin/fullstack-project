import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import { FormField } from '../../../shared/components/ui/FormField';
import { Carrier, CreateCarrierRequest, UpdateCarrierRequest } from '../services/carrierApiService';

interface CarrierFormProps {
    carrier?: Carrier;
    onSubmit: (data: CreateCarrierRequest | UpdateCarrierRequest) => Promise<void>;
    onCancel: () => void;
    onFooterReady?: (footer: React.ReactNode) => void;
}

const CarrierForm: React.FC<CarrierFormProps> = ({ carrier, onSubmit, onCancel, onFooterReady }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use ref to access current form data without causing re-renders
    const formDataRef = useRef(formData);
    formDataRef.current = formData;

    // Use ref to track if footer has been passed to parent
    const footerPassedRef = useRef(false);

    useEffect(() => {
        if (carrier) {
            setFormData({
                name: carrier.name,
                code: carrier.metadata?.code || '',
                description: carrier.description || '',
                contactEmail: carrier.contactEmail || '',
                contactPhone: carrier.contactPhone || ''
            });
        }
    }, [carrier]);

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

        if (!currentFormData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!currentFormData.code.trim()) {
            newErrors.code = 'Code is required';
        } else if (!/^[A-Z0-9_-]+$/.test(currentFormData.code.trim())) {
            newErrors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
        }

        if (currentFormData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFormData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
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
                name: currentFormData.name.trim(),
                description: currentFormData.description.trim() || undefined,
                contactEmail: currentFormData.contactEmail.trim() || undefined,
                contactPhone: currentFormData.contactPhone.trim() || undefined,
                metadata: {
                    code: currentFormData.code.trim().toUpperCase()
                }
            };

            await onSubmit(submitData);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'validationErrors' in error) {
                setErrors((error as { validationErrors: Record<string, string> }).validationErrors);
            } else {
                toast.error('An error occurred while saving the carrier');
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
                    : carrier
                        ? 'Update Carrier'
                        : 'Create Carrier'
                }
            </Button>
        </div>
    ), [onCancel, isSubmitting, handleSubmit, carrier]);

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
                        label={'Name'}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        error={errors.name}
                        placeholder={'Enter carrier name'}
                    />

                    <FormField
                        label={'Code'}
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange('code')}
                        error={errors.code}
                        placeholder={'Enter carrier code (e.g., UPS, FEDEX)'}
                    />

                    <FormField
                        label={'Contact Email'}
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange('contactEmail')}
                        error={errors.contactEmail}
                        placeholder={'Enter contact email'}
                    />

                    <FormField
                        label={'Contact Phone'}
                        name="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleInputChange('contactPhone')}
                        error={errors.contactPhone}
                        placeholder={'Enter contact phone'}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            {'Description'}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, description: e.target.value }));
                                if (errors.description) {
                                    setErrors(prev => ({ ...prev, description: '' }));
                                }
                            }}
                            placeholder={'Enter carrier description'}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CarrierForm;
