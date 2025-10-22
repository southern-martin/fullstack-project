import React from 'react';
import { FormField } from '../../../shared/components/ui/FormField';
import { ProfileAddress } from '../../../shared/types';
import { useProfileLabels } from '../hooks/useProfileLabels';

interface AddressFieldsProps {
  address: ProfileAddress;
  onChange: (address: ProfileAddress) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

/**
 * AddressFields - Reusable component for address input
 * 
 * Features:
 * - Street, City, State, Zip Code, Country fields
 * - Nested object state management
 * - Field-level error display
 * - Optional disabled state
 */
export const AddressFields: React.FC<AddressFieldsProps> = ({
  address,
  onChange,
  errors = {},
  disabled = false,
}) => {
  const { L } = useProfileLabels();

  const handleFieldChange = (field: keyof ProfileAddress, value: string) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label={L.fields.street}
          name="address.street"
          type="text"
          value={address.street || ''}
          onChange={(e) => handleFieldChange('street', e.target.value)}
          error={errors['address.street']}
          disabled={disabled}
          placeholder={L.placeholders.enterStreet}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={L.fields.city}
          name="address.city"
          type="text"
          value={address.city || ''}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          error={errors['address.city']}
          disabled={disabled}
          placeholder={L.placeholders.enterCity}
        />

        <FormField
          label={L.fields.state}
          name="address.state"
          type="text"
          value={address.state || ''}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          error={errors['address.state']}
          disabled={disabled}
          placeholder={L.placeholders.enterState}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={L.fields.zipCode}
          name="address.zipCode"
          type="text"
          value={address.zipCode || ''}
          onChange={(e) => handleFieldChange('zipCode', e.target.value)}
          error={errors['address.zipCode']}
          disabled={disabled}
          placeholder={L.placeholders.enterZipCode}
        />

        <FormField
          label={L.fields.country}
          name="address.country"
          type="text"
          value={address.country || ''}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          error={errors['address.country']}
          disabled={disabled}
          placeholder={L.placeholders.enterCountry}
        />
      </div>
    </div>
  );
};
