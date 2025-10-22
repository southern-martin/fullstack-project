/**
 * UserProfile Domain Entity
 * Represents additional user profile information
 */
export class UserProfile {
  id?: number;
  userId: number;
  dateOfBirth?: Date;
  bio?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<UserProfile> = {}) {
    this.id = data.id;
    this.userId = data.userId!;
    this.dateOfBirth = data.dateOfBirth;
    this.bio = data.bio;
    this.avatar = data.avatar;
    this.address = data.address;
    this.socialLinks = data.socialLinks;
    this.preferences = data.preferences || {};
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Calculate age from date of birth
   */
  getAge(): number | null {
    if (!this.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get full address as formatted string
   */
  getFormattedAddress(): string | null {
    if (!this.address) return null;
    
    const parts = [
      this.address.street,
      this.address.city,
      this.address.state,
      this.address.zipCode,
      this.address.country,
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(", ") : null;
  }

  /**
   * Check if profile is complete
   */
  isComplete(): boolean {
    return !!(
      this.dateOfBirth &&
      this.bio &&
      this.address?.city &&
      this.address?.country
    );
  }

  /**
   * Get preference by key
   */
  getPreference(key: string, defaultValue?: any): any {
    return this.preferences?.[key] ?? defaultValue;
  }

  /**
   * Set preference by key
   */
  setPreference(key: string, value: any): void {
    if (!this.preferences) {
      this.preferences = {};
    }
    this.preferences[key] = value;
  }
}
