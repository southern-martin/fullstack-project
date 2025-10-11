import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import { FormField } from '../../../shared/components/ui/FormField';
import { Carrier, CreateCarrierRequest, UpdateCarrierRequest } from '../services/carrierApiService';

interface CarrierFormProps {
    carrier?: Carrier;
    onSubmit: (data: CreateCarrierRequest | UpdateCarrierRequest) => Promise<void>;
    onCancel: () => void;
}

const CarrierForm: React.FC<CarrierFormProps> = ({ carrier, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Code is required';
        } else if (!/^[A-Z0-9_-]+$/.test(formData.code.trim())) {
            newErrors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
        }

        if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
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
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                contactEmail: formData.contactEmail.trim() || undefined,
                contactPhone: formData.contactPhone.trim() || undefined,
                metadata: {
                    code: formData.code.trim().toUpperCase()
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
                    : carrier
                        ? 'Update Carrier'
                        : 'Create Carrier'
                }
            </Button>
        </div>
    );

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
            {footer}
        </>
    );
};

export default CarrierForm;
