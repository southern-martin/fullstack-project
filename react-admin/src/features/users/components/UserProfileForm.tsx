import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import { FormField } from '../../../shared/components/ui/FormField';
import { CreateProfileRequest, UpdateProfileRequest, UserProfile } from '../../../shared/types';
import { useProfileLabels } from '../hooks/useProfileLabels';
import { AddressFields } from './AddressFields';
import { SocialLinksFields } from './SocialLinksFields';

const initialFormData: CreateProfileRequest = {
  dateOfBirth: '',
  bio: '',
  avatar: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  socialLinks: {
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
  },
  preferences: {},
  metadata: {},
};

interface UserProfileFormProps {
  profile?: UserProfile | null;
  userId: number;
  onSubmit: (data: CreateProfileRequest | UpdateProfileRequest) => Promise<void>;
  onCancel: () => void;
  onFooterReady?: (footer: React.ReactNode) => void;
}

/**
 * UserProfileForm - Complete user profile form with all fields
 * 
 * Features:
 * - Biography and avatar
 * - Date of birth
 * - Address fields (nested)
 * - Social links (nested)
 * - Server-side validation
 * - Create or update mode
 */
export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  profile,
  userId,
  onSubmit,
  onCancel,
  onFooterReady,
}) => {
  const { L } = useProfileLabels();
  
  // Form state
  const [formData, setFormData] = useState<CreateProfileRequest>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use ref to access current form data without causing re-renders
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  // Use ref to track if footer has been passed to parent
  const footerPassedRef = useRef(false);

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '', // Convert to YYYY-MM-DD
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        address: profile.address || initialFormData.address,
        socialLinks: profile.socialLinks || initialFormData.socialLinks,
        preferences: profile.preferences || {},
        metadata: profile.metadata || {},
      });
    } else {
      setFormData(initialFormData);
    }
  }, [profile]);

  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle address changes
  const handleAddressChange = (address: typeof formData.address) => {
    setFormData((prev) => ({ ...prev, address }));

    // Clear address errors
    const addressErrorKeys = Object.keys(errors).filter((key) => key.startsWith('address.'));
    if (addressErrorKeys.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        addressErrorKeys.forEach((key) => delete newErrors[key]);
        return newErrors;
      });
    }
  };

  // Handle social links changes
  const handleSocialLinksChange = (socialLinks: typeof formData.socialLinks) => {
    setFormData((prev) => ({ ...prev, socialLinks }));

    // Clear social links errors
    const socialLinksErrorKeys = Object.keys(errors).filter((key) => key.startsWith('socialLinks.'));
    if (socialLinksErrorKeys.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        socialLinksErrorKeys.forEach((key) => delete newErrors[key]);
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Clear previous errors
      setErrors({});

      // Get current form data from ref
      const currentFormData = formDataRef.current;

      // No client-side validation - all validation is handled by the server
      setIsSubmitting(true);

      try {
        // Clean up empty strings and empty objects before submission
        const dataToSubmit: CreateProfileRequest | UpdateProfileRequest = {
          dateOfBirth: currentFormData.dateOfBirth || undefined,
          bio: currentFormData.bio || undefined,
          avatar: currentFormData.avatar || undefined,
          address: Object.values(currentFormData.address || {}).some((v) => v)
            ? currentFormData.address
            : undefined,
          socialLinks: Object.values(currentFormData.socialLinks || {}).some((v) => v)
            ? currentFormData.socialLinks
            : undefined,
          preferences: Object.keys(currentFormData.preferences || {}).length > 0
            ? currentFormData.preferences
            : undefined,
          metadata: Object.keys(currentFormData.metadata || {}).length > 0
            ? currentFormData.metadata
            : undefined,
        };

        await onSubmit(dataToSubmit);
      } catch (error: unknown) {
        // Handle validation errors from backend
        if (error && typeof error === 'object' && 'validationErrors' in error) {
          const validationError = error as { validationErrors: Record<string, string[]> };
          const fieldErrors: Record<string, string> = {};
          Object.entries(validationError.validationErrors).forEach(([field, errors]) => {
            if (Array.isArray(errors) && errors.length > 0) {
              fieldErrors[field] = errors[0];
            }
          });
          setErrors(fieldErrors);
          return;
        }

        // Handle validation errors from backend (Axios format)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          if (axiosError.response?.data?.fieldErrors) {
            const fieldErrors: Record<string, string> = {};
            Object.entries(axiosError.response.data.fieldErrors).forEach(([field, errors]) => {
              if (Array.isArray(errors) && errors.length > 0) {
                fieldErrors[field] = errors[0];
              }
            });
            setErrors(fieldErrors);
            return;
          } else if (axiosError.response?.data?.message) {
            setErrors({ general: axiosError.response.data.message });
            return;
          }
        }

        // Generic error
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  // Create footer buttons
  const footer = useMemo(
    () => (
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          {L.actions.cancel}
        </Button>
        <Button type="submit" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? L.actions.save : profile ? L.actions.updateProfile : L.actions.createProfile}
        </Button>
      </div>
    ),
    [onCancel, handleSubmit, isSubmitting, profile, L.actions]
  );

  // Pass footer to parent when ready
  useEffect(() => {
    if (!footerPassedRef.current && onFooterReady) {
      onFooterReady(footer);
      footerPassedRef.current = true;
    }
  }, [footer, onFooterReady]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{L.sections.basicInfo}</h3>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            {L.fields.dateOfBirth}
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        <FormField
          label={L.fields.avatar}
          name="avatar"
          type="url"
          value={formData.avatar || ''}
          onChange={handleChange}
          error={errors.avatar}
          disabled={isSubmitting}
          placeholder={L.placeholders.enterAvatarUrl}
        />

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            {L.fields.bio}
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={L.placeholders.enterBio}
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.bio?.length || 0} / 500 {L.messages.characterCount}
          </p>
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{L.sections.address}</h3>
        <AddressFields
          address={formData.address || initialFormData.address!}
          onChange={handleAddressChange}
          errors={errors}
          disabled={isSubmitting}
        />
      </div>

      {/* Social Links Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{L.sections.socialLinks}</h3>
        <SocialLinksFields
          socialLinks={formData.socialLinks || initialFormData.socialLinks!}
          onChange={handleSocialLinksChange}
          errors={errors}
          disabled={isSubmitting}
        />
      </div>

      {/* Footer rendered inline for standalone form (if not passed to parent) */}
      {!onFooterReady && <div className="pt-4 border-t">{footer}</div>}
    </form>
  );
};
