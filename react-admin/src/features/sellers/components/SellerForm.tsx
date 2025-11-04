import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSellerLabels } from '../hooks/useSellerLabels';
import Button from '../../../shared/components/ui/Button';
import { FormField, SelectField } from '../../../shared/components/ui/FormField';
import type { Seller, CreateSellerRequest } from '../config/seller.types';
import { BusinessType } from '../config/seller.types';

interface SellerFormProps {
  seller?: Seller | null;
  onSubmit: (data: CreateSellerRequest) => Promise<void>;
  onCancel: () => void;
  onFooterReady?: (footer: React.ReactNode) => void;
}

/**
 * Seller Form Component
 * 
 * Reusable form for creating and editing sellers.
 * Follows the same pattern as UserForm with onFooterReady callback.
 */
const SellerForm: React.FC<SellerFormProps> = ({ seller, onSubmit, onCancel, onFooterReady }) => {
  const { L } = useSellerLabels();

  // Form state
  const [formData, setFormData] = useState<CreateSellerRequest>({
    userId: seller?.userId || 0,
    businessName: seller?.businessName || '',
    businessType: seller?.businessType || BusinessType.INDIVIDUAL,
    businessEmail: seller?.businessEmail || '',
    businessPhone: seller?.businessPhone || '',
    taxId: seller?.taxId || '',
    businessAddress: seller?.businessAddress || '',
    businessCity: seller?.businessCity || '',
    businessState: seller?.businessState || '',
    businessCountry: seller?.businessCountry || '',
    businessPostalCode: seller?.businessPostalCode || '',
    description: seller?.description || '',
    website: seller?.website || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use ref to access current form data without causing re-renders
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  // Use ref to track if footer has been passed to parent
  const footerPassedRef = useRef(false);

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing (but no client-side validation)
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Client-side validation removed - all validation is now handled by the server
  // The form will display server-side validation errors returned from the API

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Clear previous errors
    setErrors({});

    // Get current form data from ref
    const currentFormData = formDataRef.current;

    // No client-side validation - all validation is handled by the server
    setIsSubmitting(true);

    try {
      await onSubmit(currentFormData);
    } catch (error: unknown) {
      console.log('SellerForm caught error:', error); // Debug logging
      
      // PRIORITY 1: Handle validation errors from backend (via API client)
      if (error && typeof error === 'object' && 'validationErrors' in error) {
        console.log('Processing validationErrors:', (error as any).validationErrors); // Debug logging
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

      // PRIORITY 2: Handle custom rule errors from backend
      if (error && typeof error === 'object' && 'customRuleErrors' in error) {
        const customRuleError = error as { customRuleErrors: string[] };
        // Display custom rule errors in the validation summary
        setErrors({ general: customRuleError.customRuleErrors.join(' ') });
        return;
      }

      // PRIORITY 3: Handle validation errors from backend (direct response format)
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

      // PRIORITY 4 (FALLBACK): Handle string-based validation errors (from backend response)
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
  }, [onSubmit]); // Remove validate from dependencies

  // Memoize footer to prevent infinite re-renders
  const footer = useMemo(() => (
    <div className="flex justify-end space-x-3">
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {L.buttons?.cancel || 'Cancel'}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting
          ? (seller ? 'Updating...' : 'Creating...')
          : (seller ? 'Update Seller' : (L.buttons?.createSeller || 'Create Seller'))
        }
      </Button>
    </div>
  ), [onCancel, isSubmitting, handleSubmit, seller, L.buttons]);

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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 m-6 mb-0">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{errors.general}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 p-6">
        {/* User ID - only for create mode */}
        {!seller && (
          <FormField
            label={L.form?.userId || 'User ID'}
            name="userId"
            type="number"
            value={String(formData.userId)}
            onChange={handleChange}
            error={errors.userId}
          />
        )}

        {/* Business Name */}
        <FormField
          label={L.form?.businessName || 'Business Name'}
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleChange}
          error={errors.businessName}
          placeholder={L.placeholders?.businessName}
        />

        {/* Business Type */}
        <SelectField
          label={L.form?.businessType || 'Business Type'}
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          options={[
            { value: BusinessType.INDIVIDUAL, label: L.businessType?.individual || 'Individual' },
            { value: BusinessType.SOLE_PROPRIETOR, label: L.businessType?.soleProprietor || 'Sole Proprietor' },
            { value: BusinessType.LLC, label: L.businessType?.llc || 'LLC' },
            { value: BusinessType.CORPORATION, label: L.businessType?.corporation || 'Corporation' },
            { value: BusinessType.PARTNERSHIP, label: L.businessType?.partnership || 'Partnership' },
          ]}
          error={errors.businessType}
        />

        {/* Business Email */}
        <FormField
          label={L.form?.businessEmail || 'Business Email'}
          name="businessEmail"
          type="email"
          value={formData.businessEmail || ''}
          onChange={handleChange}
          error={errors.businessEmail}
          placeholder={L.placeholders?.businessEmail}
        />

        {/* Business Phone */}
        <FormField
          label={L.form?.businessPhone || 'Business Phone'}
          name="businessPhone"
          type="tel"
          value={formData.businessPhone || ''}
          onChange={handleChange}
          error={errors.businessPhone}
          placeholder={L.placeholders?.businessPhone}
        />

        {/* Tax ID */}
        <FormField
          label={L.form?.taxId || 'Tax ID'}
          name="taxId"
          type="text"
          value={formData.taxId || ''}
          onChange={handleChange}
          error={errors.taxId}
          placeholder={L.placeholders?.taxId}
        />

        {/* Business Address Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Business Address
          </h4>

          <div className="space-y-4">
            <FormField
              label={L.form?.businessAddress || 'Street Address'}
              name="businessAddress"
              type="text"
              value={formData.businessAddress || ''}
              onChange={handleChange}
              error={errors.businessAddress}
              placeholder={L.placeholders?.address}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label={L.form?.businessCity || 'City'}
                name="businessCity"
                type="text"
                value={formData.businessCity || ''}
                onChange={handleChange}
                error={errors.businessCity}
                placeholder={L.placeholders?.city}
              />

              <FormField
                label={L.form?.businessState || 'State/Province'}
                name="businessState"
                type="text"
                value={formData.businessState || ''}
                onChange={handleChange}
                error={errors.businessState}
                placeholder={L.placeholders?.state}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label={L.form?.businessCountry || 'Country'}
                name="businessCountry"
                type="text"
                value={formData.businessCountry || ''}
                onChange={handleChange}
                error={errors.businessCountry}
                placeholder={L.placeholders?.country}
              />

              <FormField
                label={L.form?.businessPostalCode || 'Postal Code'}
                name="businessPostalCode"
                type="text"
                value={formData.businessPostalCode || ''}
                onChange={handleChange}
                error={errors.businessPostalCode}
                placeholder={L.placeholders?.postalCode}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Additional Information
          </h4>

          <div className="space-y-4">
            <FormField
              label={L.form?.website || 'Website'}
              name="website"
              type="url"
              value={formData.website || ''}
              onChange={handleChange}
              error={errors.website}
              placeholder={L.placeholders?.website}
            />

            {/* Description - using manual textarea since no TextAreaField exists */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {L.form?.description || 'Description'}
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder={L.placeholders?.description}
                rows={4}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm ${
                  errors.description
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerForm;
