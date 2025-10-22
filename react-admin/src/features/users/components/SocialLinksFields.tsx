import React from 'react';
import { FormField } from '../../../shared/components/ui/FormField';
import { SocialLinks } from '../../../shared/types';
import { useProfileLabels } from '../hooks/useProfileLabels';

interface SocialLinksFieldsProps {
  socialLinks: SocialLinks;
  onChange: (socialLinks: SocialLinks) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

/**
 * SocialLinksFields - Reusable component for social media links
 * 
 * Features:
 * - LinkedIn, GitHub, Twitter, Website URL inputs
 * - URL validation on the backend
 * - Field-level error display
 * - Optional disabled state
 */
export const SocialLinksFields: React.FC<SocialLinksFieldsProps> = ({
  socialLinks,
  onChange,
  errors = {},
  disabled = false,
}) => {
  const { L } = useProfileLabels();

  const handleFieldChange = (field: keyof SocialLinks, value: string) => {
    onChange({
      ...socialLinks,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <FormField
        label={L.fields.linkedin}
        name="socialLinks.linkedin"
        type="url"
        value={socialLinks.linkedin || ''}
        onChange={(e) => handleFieldChange('linkedin', e.target.value)}
        error={errors['socialLinks.linkedin']}
        disabled={disabled}
        placeholder={L.placeholders.enterLinkedinUrl}
      />

      <FormField
        label={L.fields.github}
        name="socialLinks.github"
        type="url"
        value={socialLinks.github || ''}
        onChange={(e) => handleFieldChange('github', e.target.value)}
        error={errors['socialLinks.github']}
        disabled={disabled}
        placeholder={L.placeholders.enterGithubUrl}
      />

      <FormField
        label={L.fields.twitter}
        name="socialLinks.twitter"
        type="url"
        value={socialLinks.twitter || ''}
        onChange={(e) => handleFieldChange('twitter', e.target.value)}
        error={errors['socialLinks.twitter']}
        disabled={disabled}
        placeholder={L.placeholders.enterTwitterUrl}
      />

      <FormField
        label={L.fields.website}
        name="socialLinks.website"
        type="url"
        value={socialLinks.website || ''}
        onChange={(e) => handleFieldChange('website', e.target.value)}
        error={errors['socialLinks.website']}
        disabled={disabled}
        placeholder={L.placeholders.enterWebsiteUrl}
      />
    </div>
  );
};
