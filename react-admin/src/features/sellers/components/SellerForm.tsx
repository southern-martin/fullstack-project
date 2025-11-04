import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSellerLabels } from '../hooks/useSellerLabels';
import Button from '../../../shared/components/ui/Button';
import { FormField, SelectField } from '../../../shared/components/ui/FormField';
import type { Seller, CreateSellerRequest } from '../config/seller.types';
import { BusinessType } from '../config/seller.types';

interface SellerFormProps {
  seller?: Seller | null;
  onSubmit: (data: CreateSellerRequest) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export const SellerForm: React.FC<SellerFormProps> = ({ 
  seller, 
  onSubmit, 
  onCancel, 
  loading = false, 
  error 
}) => {
  const { L } = useSellerLabels();
  const [formData, setFormData] = useState<CreateSellerRequest>({
    companyName: '',
    businessType: BusinessType.INDIVIDUAL,
    contactEmail: '',
    phone: '',
    address: '',
    taxId: '',
    businessRegistrationNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (seller) {
      setFormData({
        companyName: seller.companyName || '',
        businessType: seller.businessType || BusinessType.INDIVIDUAL,
        contactEmail: seller.contactEmail || '',
        phone: seller.phone || '',
        address: seller.address || '',
        taxId: seller.taxId || '',
        businessRegistrationNumber: seller.businessRegistrationNumber || ''
      });
    }
  }, [seller]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing (but no client-side validation)
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [onSubmit, formData]);

  const businessTypeOptions = useMemo(() => [
    { value: BusinessType.INDIVIDUAL, label: L.form.individual },
    { value: BusinessType.COMPANY, label: L.form.company },
    { value: BusinessType.PARTNERSHIP, label: L.form.partnership },
    { value: BusinessType.CORPORATION, label: L.form.corporation }
  ], [L]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <FormField
        label={L.form.companyName}
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        error={errors.companyName}
        required
        disabled={loading}
      />

      <SelectField
        label={L.form.businessType}
        name="businessType"
        value={formData.businessType}
        onChange={handleChange}
        options={businessTypeOptions}
        error={errors.businessType}
        disabled={loading}
        required
      />

      <FormField
        label={L.form.contactEmail}
        name="contactEmail"
        type="email"
        value={formData.contactEmail}
        onChange={handleChange}
        error={errors.contactEmail}
        required
        disabled={loading}
      />

      <FormField
        label={L.form.phone}
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        disabled={loading}
      />

      <FormField
        label={L.form.address}
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        disabled={loading}
      />

      <FormField
        label={L.form.taxId}
        name="taxId"
        value={formData.taxId}
        onChange={handleChange}
        error={errors.taxId}
        disabled={loading}
      />

      <FormField
        label={L.form.businessRegistrationNumber}
        name="businessRegistrationNumber"
        value={formData.businessRegistrationNumber}
        onChange={handleChange}
        error={errors.businessRegistrationNumber}
        disabled={loading}
      />

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {L.form.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? L.form.saving : L.form.save}
        </Button>
      </div>
    </form>
  );
};
