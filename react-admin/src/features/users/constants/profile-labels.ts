/**
 * Profile Module - Centralized Label Constants
 * 
 * This file contains all static UI text labels for the User Profile module.
 * Labels are organized by category for easy maintenance.
 * 
 * These labels will be translated using the MD5-based Translation Service.
 */

export interface ProfileLabels {
  // Tab labels
  tabs: {
    details: string;
    profile: string;
    roles: string;
  };

  // Section titles
  sections: {
    basicInfo: string;
    address: string;
    socialLinks: string;
    preferences: string;
    metadata: string;
  };

  // Form field labels
  fields: {
    dateOfBirth: string;
    age: string;
    bio: string;
    avatar: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
    preferences: string;
    createdAt: string;
    updatedAt: string;
  };

  // Placeholders
  placeholders: {
    enterBio: string;
    enterAvatarUrl: string;
    enterStreet: string;
    enterCity: string;
    enterState: string;
    enterZipCode: string;
    enterCountry: string;
    enterLinkedinUrl: string;
    enterGithubUrl: string;
    enterTwitterUrl: string;
    enterWebsiteUrl: string;
    selectDate: string;
  };

  // Action buttons
  actions: {
    createProfile: string;
    editProfile: string;
    updateProfile: string;
    cancel: string;
    save: string;
    close: string;
  };

  // Messages
  messages: {
    noProfile: string;
    loadingProfile: string;
    createSuccess: string;
    updateSuccess: string;
    saveError: string;
    characterCount: string;
    characterLimit: string;
  };

  // Validation messages
  validation: {
    invalidUrl: string;
    invalidDate: string;
    bioTooLong: string;
    required: string;
  };

  // Helper text
  help: {
    bioHint: string;
    avatarHint: string;
    dobHint: string;
    addressHint: string;
    socialLinksHint: string;
  };
}

/**
 * Default English labels
 * These serve as the base text that will be translated
 */
export const PROFILE_LABELS: ProfileLabels = {
  tabs: {
    details: 'User Details',
    profile: 'Profile',
    roles: 'Roles & Permissions',
  },

  sections: {
    basicInfo: 'Basic Information',
    address: 'Address',
    socialLinks: 'Social Links',
    preferences: 'Preferences',
    metadata: 'Metadata',
  },

  fields: {
    dateOfBirth: 'Date of Birth',
    age: 'Age',
    bio: 'Biography',
    avatar: 'Avatar URL',
    street: 'Street Address',
    city: 'City',
    state: 'State/Province',
    zipCode: 'ZIP/Postal Code',
    country: 'Country',
    linkedin: 'LinkedIn Profile',
    github: 'GitHub Profile',
    twitter: 'Twitter Handle',
    website: 'Website',
    preferences: 'Preferences',
    createdAt: 'Created',
    updatedAt: 'Last Updated',
  },

  placeholders: {
    enterBio: 'Tell us about yourself...',
    enterAvatarUrl: 'https://example.com/avatar.jpg',
    enterStreet: '123 Main Street',
    enterCity: 'San Francisco',
    enterState: 'California',
    enterZipCode: '94105',
    enterCountry: 'United States',
    enterLinkedinUrl: 'https://linkedin.com/in/username',
    enterGithubUrl: 'https://github.com/username',
    enterTwitterUrl: 'https://twitter.com/username',
    enterWebsiteUrl: 'https://yourwebsite.com',
    selectDate: 'Select date',
  },

  actions: {
    createProfile: 'Create Profile',
    editProfile: 'Edit Profile',
    updateProfile: 'Update Profile',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
  },

  messages: {
    noProfile: 'No profile information yet',
    loadingProfile: 'Loading profile...',
    createSuccess: 'Profile created successfully',
    updateSuccess: 'Profile updated successfully',
    saveError: 'Failed to save profile',
    characterCount: 'characters',
    characterLimit: 'Character limit:',
  },

  validation: {
    invalidUrl: 'Please enter a valid URL',
    invalidDate: 'Please enter a valid date',
    bioTooLong: 'Biography must be 500 characters or less',
    required: 'This field is required',
  },

  help: {
    bioHint: 'Share a brief description about yourself (max 500 characters)',
    avatarHint: 'Enter a URL to your profile picture',
    dobHint: 'Your date of birth will be used to calculate your age',
    addressHint: 'Your physical address for contact purposes',
    socialLinksHint: 'Connect your professional social media profiles',
  },
};
