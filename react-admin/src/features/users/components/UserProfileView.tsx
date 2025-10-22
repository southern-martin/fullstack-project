import React from 'react';
import { UserProfile } from '../../../shared/types';
import { useProfileLabels } from '../hooks/useProfileLabels';

interface UserProfileViewProps {
  profile: UserProfile;
}

/**
 * UserProfileView - Read-only display of user profile
 * 
 * Features:
 * - Formatted display of all profile fields
 * - Avatar preview
 * - Clickable social links
 * - Formatted address display
 * - Age calculation from date of birth
 */
export const UserProfileView: React.FC<UserProfileViewProps> = ({ profile }) => {
  const { L } = useProfileLabels();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format address for display
  const formatAddress = (): string | null => {
    if (!profile.address) return null;
    const { street, city, state, zipCode, country } = profile.address;
    const parts = [street, city, state, zipCode, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
  const formattedAddress = formatAddress();

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      {profile.avatar && (
        <div className="flex justify-center">
          <img
            src={profile.avatar}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Avatar';
            }}
          />
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{L.sections.basicInfo}</h3>

        {profile.dateOfBirth && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-gray-500">{L.fields.dateOfBirth}:</div>
            <div className="col-span-2 text-sm text-gray-900">
              {formatDate(profile.dateOfBirth)}
              {age !== null && <span className="text-gray-500 ml-2">({age} {L.fields.age})</span>}
            </div>
          </div>
        )}

        {profile.bio && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-gray-500">{L.fields.bio}:</div>
            <div className="col-span-2 text-sm text-gray-900 whitespace-pre-wrap">{profile.bio}</div>
          </div>
        )}
      </div>

      {/* Address */}
      {formattedAddress && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{L.sections.address}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-gray-500">Location:</div>
            <div className="col-span-2 text-sm text-gray-900">{formattedAddress}</div>
          </div>
        </div>
      )}

      {/* Social Links */}
      {profile.socialLinks && Object.values(profile.socialLinks).some((link) => link) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{L.sections.socialLinks}</h3>
          <div className="space-y-2">
            {profile.socialLinks.linkedin && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-24">{L.fields.linkedin}:</span>
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {profile.socialLinks.linkedin}
                </a>
              </div>
            )}

            {profile.socialLinks.github && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-24">{L.fields.github}:</span>
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {profile.socialLinks.github}
                </a>
              </div>
            )}

            {profile.socialLinks.twitter && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-24">{L.fields.twitter}:</span>
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {profile.socialLinks.twitter}
                </a>
              </div>
            )}

            {profile.socialLinks.website && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 w-24">{L.fields.website}:</span>
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {profile.socialLinks.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences (if any) */}
      {profile.preferences && Object.keys(profile.preferences).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{L.sections.preferences}</h3>
          <div className="space-y-2">
            {Object.entries(profile.preferences).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-gray-500 capitalize">{key}:</div>
                <div className="col-span-2 text-sm text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-400 border-t pt-4">
        <div>{L.fields.createdAt}: {formatDate(profile.createdAt)}</div>
        <div>{L.fields.updatedAt}: {formatDate(profile.updatedAt)}</div>
      </div>
    </div>
  );
};
