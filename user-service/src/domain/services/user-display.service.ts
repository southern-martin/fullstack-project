import { User } from '../entities/user.entity';
import { UserPreferences } from '../value-objects/user-preferences.value-object';

/**
 * User Display Service
 *
 * Focused service for user display and presentation logic.
 * Follows Single Responsibility Principle - only handles display logic.
 *
 * Business Rules:
 * - Formats user data for display
 * - Generates display names and avatars
 * - Handles localization preferences
 */
export class UserDisplayService {
  /**
   * Determines user display name
   * @returns Formatted display name
   */
  getUserDisplayName(user: User): string {
    const firstName = user.firstName?.trim() || '';
    const lastName = user.lastName?.trim() || '';

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) {
      return firstName;
    }

    if (lastName) {
      return lastName;
    }

    return user.email || 'Unknown User';
  }

  /**
   * Determines user display name with formatting preferences
   * @returns Formatted display name based on preferences
   */
  getUserDisplayNameWithFormat(user: User, preferences?: UserPreferences): string {
    const baseName = this.getUserDisplayName(user);

    if (!preferences) {
      return baseName;
    }

    const displayName = preferences.get('displayName', 'firstNameLastName');

    switch (displayName) {
      case 'firstNameLastName':
        return `${user.firstName} ${user.lastName}`.trim();
      case 'lastNameFirstName':
        return `${user.lastName}, ${user.firstName}`.trim();
      case 'firstName':
        return user.firstName || '';
      case 'lastName':
        return user.lastName || '';
      case 'email':
        return user.email || '';
      case 'initials':
        return this.getInitials(user);
      default:
        return baseName;
    }
  }

  /**
   * Gets user initials
   * @returns User initials (1-2 characters)
   */
  getInitials(user: User): string {
    const firstName = user.firstName?.trim() || '';
    const lastName = user.lastName?.trim() || '';

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    if (firstName) {
      return firstName[0].toUpperCase();
    }

    if (lastName) {
      return lastName[0].toUpperCase();
    }

    return '?';
  }

  /**
   * Gets user avatar URL or initials
   * @returns Avatar URL or initials
   */
  getUserAvatar(user: User, size: 'sm' | 'md' | 'lg' = 'md'): string {
    if (user.metadata?.avatar) {
      // Return avatar with size parameter if supported
      const avatarUrl = user.metadata.avatar;
      if (avatarUrl.includes('?')) {
        return `${avatarUrl}&size=${this.getAvatarSize(size)}`;
      } else {
        return `${avatarUrl}?size=${this.getAvatarSize(size)}`;
      }
    }

    // Generate initials-based avatar
    return this.generateAvatarFromInitials(user, size);
  }

  /**
   * Gets user's full name with title
   * @returns Full name with appropriate title
   */
  getFullNameWithTitle(user: User, preferences?: UserPreferences): string {
    const fullName = this.getUserDisplayNameWithFormat(user, preferences);
    const title = preferences?.get('title', '');

    return title ? `${title} ${fullName}`.trim() : fullName;
  }

  /**
   * Gets user's localized greeting
   * @returns Personalized greeting message
   */
  getLocalizedGreeting(user: User, preferences?: UserPreferences): string {
    const language = preferences?.getLanguage() || 'en';
    const displayName = this.getUserDisplayNameWithFormat(user, preferences);
    const timeOfDay = this.getTimeOfDay();

    const greetings = {
      en: {
        morning: `Good morning, ${displayName}`,
        afternoon: `Good afternoon, ${displayName}`,
        evening: `Good evening, ${displayName}`,
        night: `Good night, ${displayName}`,
        default: `Hello, ${displayName}`,
      },
      es: {
        morning: `Buenos días, ${displayName}`,
        afternoon: `Buenas tardes, ${displayName}`,
        evening: `Buenas noches, ${displayName}`,
        night: `Buenas noches, ${displayName}`,
        default: `Hola, ${displayName}`,
      },
      fr: {
        morning: `Bonjour, ${displayName}`,
        afternoon: `Bon après-midi, ${displayName}`,
        evening: `Bonsoir, ${displayName}`,
        night: `Bonne nuit, ${displayName}`,
        default: `Salut, ${displayName}`,
      },
    };

    const langGreetings = greetings[language] || greetings.en;
    return langGreetings[timeOfDay] || langGreetings.default;
  }

  /**
   * Formats user's address for display
   * @returns Formatted address string
   */
  formatUserAddress(user: User): string {
    if (!user.address) {
      return 'No address provided';
    }

    const { street, city, state, zipCode, country } = user.address;
    const parts = [];

    if (street) parts.push(street);

    const cityStateZip = [city, state, zipCode].filter(Boolean).join(', ');
    if (cityStateZip) parts.push(cityStateZip);

    if (country) parts.push(country);

    return parts.join(', ') || 'No address provided';
  }

  /**
   * Formats user's address in single line
   * @returns Single-line formatted address
   */
  formatUserAddressSingleLine(user: User): string {
    if (!user.address) {
      return '';
    }

    const { street, city, state, zipCode, country } = user.address;
    return [street, city, state, zipCode, country].filter(Boolean).join(', ');
  }

  /**
   * Formats user's phone number for display
   * @returns Formatted phone number
   */
  formatUserPhoneNumber(user: User): string {
    if (!user.phone) {
      return 'No phone number';
    }

    // Basic phone formatting
    const cleaned = user.phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      // US format: (XXX) XXX-XXXX
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // US with country code: +1 (XXX) XXX-XXXX
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    return user.phone; // Return original if can't format
  }

  /**
   * Gets user's status display text
   * @returns Human-readable status
   */
  getUserStatusDisplay(user: User): string {
    if (user.isActive) {
      const lastLogin = user.lastLoginAt;
      if (lastLogin) {
        const daysSinceLogin = this.getDaysSinceDate(lastLogin);
        if (daysSinceLogin === 0) {
          return 'Active now';
        } else if (daysSinceLogin <= 7) {
          return `Active ${daysSinceLogin} days ago`;
        } else if (daysSinceLogin <= 30) {
          return `Active ${Math.floor(daysSinceLogin / 7)} weeks ago`;
        } else {
          return `Active ${Math.floor(daysSinceLogin / 30)} months ago`;
        }
      } else {
        return 'Active (never logged in)';
      }
    } else {
      return 'Inactive';
    }
  }

  /**
   * Gets user's role display text
   * @returns Formatted role names
   */
  getUserRoleDisplay(user: User): string {
    if (!user.roles || user.roles.length === 0) {
      return 'No roles assigned';
    }

    const activeRoles = user.roles.filter((role) => role.isActive);
    if (activeRoles.length === 0) {
      return 'No active roles';
    }

    const roleNames = activeRoles
      .sort((a, b) => this.getRolePriority(b.name) - this.getRolePriority(a.name))
      .map((role) => this.formatRoleName(role.name));

    if (roleNames.length === 1) {
      return roleNames[0];
    }

    if (roleNames.length <= 2) {
      return roleNames.join(' & ');
    }

    return `${roleNames.slice(0, -1).join(', ')} & ${roleNames[roleNames.length - 1]}`;
  }

  /**
   * Gets user's email display with verification status
   * @returns Email with verification indicator
   */
  getUserEmailDisplay(user: User): string {
    const email = user.email || 'No email';
    const verificationIcon = user.isEmailVerified ? '✓' : '?';
    return `${email} ${verificationIcon}`;
  }

  /**
   * Formats user's date of birth
   * @returns Formatted date of birth
   */
  formatDateOfBirth(user: User, preferences?: UserPreferences): string {
    if (!user.dateOfBirth) {
      return 'Not provided';
    }

    const dateFormat = preferences?.get('dateFormat', 'MM/DD/YYYY');
    const date = new Date(user.dateOfBirth);

    switch (dateFormat) {
      case 'DD/MM/YYYY':
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      case 'YYYY-MM-DD':
        return date.toISOString().split('T')[0];
      default:
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    }
  }

  /**
   * Gets user's age display
   * @returns Formatted age text
   */
  getAgeDisplay(user: User): string {
    if (!user.dateOfBirth) {
      return 'Age not provided';
    }

    const age = this.calculateAge(user.dateOfBirth);

    if (age < 1) {
      return 'Less than 1 year old';
    }

    return `${age} years old`;
  }

  /**
   * Generates user profile completion percentage
   * @returns Profile completion percentage
   */
  getProfileCompletion(user: User): number {
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.address,
      user.dateOfBirth,
    ];

    const completedFields = fields.filter(
      (field) => field !== undefined && field !== null && field !== '',
    ).length;

    return Math.round((completedFields / fields.length) * 100);
  }

  /**
   * Gets user's timezone display
   * @returns Formatted timezone with offset
   */
  getTimezoneDisplay(user: User, preferences?: UserPreferences): string {
    const timezone = preferences?.getTimezone() || 'UTC';
    const now = new Date();
    const offset = now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });

    return `${timezone} (${offset})`;
  }

  /**
   * Private helper methods
   */

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  private getAvatarSize(size: 'sm' | 'md' | 'lg'): number {
    const sizes = { sm: 32, md: 64, lg: 128 };
    return sizes[size];
  }

  private generateAvatarFromInitials(user: User, size: 'sm' | 'md' | 'lg'): string {
    const initials = this.getInitials(user);
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
      '#F8B739',
      '#52C777',
    ];

    const colorIndex = user.email
      ? user.email.charCodeAt(0) % colors.length
      : Math.floor(Math.random() * colors.length);

    const bgColor = colors[colorIndex];
    const sizePx = this.getAvatarSize(size);

    // Generate SVG avatar
    return `data:image/svg+xml;base64,${btoa(
      `
      <svg width="${sizePx}" height="${sizePx}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
              fill="white" font-family="Arial, sans-serif"
              font-size="${sizePx * 0.4}" font-weight="bold">
          ${initials}
        </text>
      </svg>
    `.trim(),
    )}`;
  }

  private formatRoleName(roleName: string): string {
    return roleName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getRolePriority(roleName: string): number {
    const priorities: Record<string, number> = {
      super_admin: 100,
      admin: 80,
      moderator: 60,
      manager: 50,
      analyst: 40,
      user: 20,
      guest: 10,
    };

    return priorities[roleName] || 0;
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private getDaysSinceDate(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
