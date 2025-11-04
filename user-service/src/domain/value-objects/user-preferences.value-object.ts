import { ValueObject } from "../interfaces/value-object.interface";

/**
 * UserPreferences Value Object
 *
 * Encapsulates user preferences validation and normalization logic.
 * Follows Value Object pattern from Domain-Driven Design.
 *
 * Business Rules:
 * - Must be valid JSON if object provided
 * - Must not exceed size limits
 * - Immutable after creation
 * - Supports common user preference types
 */
export class UserPreferences implements ValueObject {
  private readonly _value: Record<string, any>;

  constructor(preferences: Record<string, any> | null | undefined) {
    this._value = this.validateAndNormalize(preferences || {});
  }

  /**
   * Get all preferences
   */
  get value(): Record<string, any> {
    return { ...this._value };
  }

  /**
   * Get specific preference
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    return this._value[key] as T ?? defaultValue;
  }

  /**
   * Check if preference exists
   */
  has(key: string): boolean {
    return key in this._value;
  }

  /**
   * Get theme preference
   */
  getTheme(): 'light' | 'dark' | 'system' {
    return this.get('theme', 'system');
  }

  /**
   * Get language preference
   */
  getLanguage(): string {
    return this.get('language', 'en');
  }

  /**
   * Get timezone preference
   */
  getTimezone(): string {
    return this.get('timezone', 'UTC');
  }

  /**
   * Get email notification preference
   */
  getEmailNotifications(): boolean {
    return this.get('emailNotifications', true);
  }

  /**
   * Get push notification preference
   */
  getPushNotifications(): boolean {
    return this.get('pushNotifications', true);
  }

  /**
   * Get privacy level preference
   */
  getPrivacyLevel(): 'public' | 'friends' | 'private' {
    return this.get('privacyLevel', 'friends');
  }

  /**
   * Get dashboard layout preference
   */
  getDashboardLayout(): 'grid' | 'list' | 'cards' {
    return this.get('dashboardLayout', 'grid');
  }

  /**
   * Check if preferences are default
   */
  isDefault(): boolean {
    const defaultPrefs = new UserPreferences(null);
    return this.equals(defaultPrefs);
  }

  /**
   * Check if this equals another UserPreferences
   */
  equals(other: UserPreferences): boolean {
    if (!(other instanceof UserPreferences)) {
      return false;
    }

    const thisKeys = Object.keys(this._value).sort();
    const otherKeys = Object.keys(other._value).sort();

    if (thisKeys.length !== otherKeys.length) {
      return false;
    }

    return thisKeys.every(key =>
      JSON.stringify(this._value[key]) === JSON.stringify(other._value[key])
    );
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return JSON.stringify(this._value);
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): Record<string, any> {
    return this._value;
  }

  /**
   * Validate and normalize preferences
   * @private
   */
  private validateAndNormalize(preferences: Record<string, any>): Record<string, any> {
    if (typeof preferences !== 'object' || preferences === null) {
      throw new Error('Preferences must be a valid object');
    }

    // Check overall size limit
    const preferencesString = JSON.stringify(preferences);
    if (preferencesString.length > 2000) {
      throw new Error('Preferences must not exceed 2000 characters');
    }

    // Validate specific preference keys and values
    const validatedPreferences: Record<string, any> = {};

    for (const [key, value] of Object.entries(preferences)) {
      // Skip null/undefined values
      if (value === null || value === undefined) {
        continue;
      }

      // Validate known preference keys
      if (this.isValidPreferenceKey(key)) {
        validatedPreferences[key] = this.validatePreferenceValue(key, value);
      }
    }

    return validatedPreferences;
  }

  /**
   * Validate preference key
   * @private
   */
  private isValidPreferenceKey(key: string): boolean {
    const validKeys = [
      'theme',
      'language',
      'timezone',
      'emailNotifications',
      'pushNotifications',
      'privacyLevel',
      'dashboardLayout',
      'dateFormat',
      'timeFormat',
      'currency',
      'itemsPerPage',
      'autoSave',
      'twoFactorAuth'
    ];

    // Allow custom preference keys with prefix
    return validKeys.includes(key) || key.startsWith('custom.');
  }

  /**
   * Validate preference value
   * @private
   */
  private validatePreferenceValue(key: string, value: any): any {
    switch (key) {
      case 'theme':
        const validThemes = ['light', 'dark', 'system'];
        return validThemes.includes(value) ? value : 'system';

      case 'language':
        return typeof value === 'string' && value.length <= 5 ? value : 'en';

      case 'timezone':
        return typeof value === 'string' && value.length <= 50 ? value : 'UTC';

      case 'emailNotifications':
      case 'pushNotifications':
      case 'autoSave':
      case 'twoFactorAuth':
        return typeof value === 'boolean' ? value : true;

      case 'privacyLevel':
        const validLevels = ['public', 'friends', 'private'];
        return validLevels.includes(value) ? value : 'friends';

      case 'dashboardLayout':
        const validLayouts = ['grid', 'list', 'cards'];
        return validLayouts.includes(value) ? value : 'grid';

      case 'dateFormat':
        const validFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
        return validFormats.includes(value) ? value : 'MM/DD/YYYY';

      case 'timeFormat':
        const validTimeFormats = ['12h', '24h'];
        return validTimeFormats.includes(value) ? value : '12h';

      case 'currency':
        const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
        return validCurrencies.includes(value) ? value : 'USD';

      case 'itemsPerPage':
        const validPages = [10, 25, 50, 100];
        return validPages.includes(value) ? value : 25;

      default:
        // For custom preferences, ensure they're serializable
        if (this.isSerializable(value)) {
          return value;
        }
        return null;
    }
  }

  /**
   * Check if value is serializable
   * @private
   */
  private isSerializable(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    const type = typeof value;
    const serializableTypes = ['string', 'number', 'boolean', 'object'];

    if (!serializableTypes.includes(type)) {
      if (Array.isArray(value)) {
        // Arrays are serializable
        try {
          JSON.stringify(value);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }

    if (type === 'object') {
      try {
        JSON.stringify(value);
        return true;
      } catch {
        return false;
      }
    }

    return true;
  }

  /**
   * Create UserPreferences from string (factory method)
   */
  static fromString(preferencesString: string): UserPreferences {
    try {
      const preferences = JSON.parse(preferencesString);
      return new UserPreferences(preferences);
    } catch {
      throw new Error('Invalid preferences JSON format');
    }
  }

  /**
   * Create UserPreferences from object (factory method)
   */
  static fromObject(preferences: Record<string, any>): UserPreferences {
    return new UserPreferences(preferences);
  }

  /**
   * Create default UserPreferences (factory method)
   */
  static createDefault(): UserPreferences {
    return new UserPreferences({
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      emailNotifications: true,
      pushNotifications: true,
      privacyLevel: 'friends',
      dashboardLayout: 'grid',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      itemsPerPage: 25,
      autoSave: true,
      twoFactorAuth: false
    });
  }

  /**
   * Merge with another UserPreferences
   */
  merge(other: UserPreferences): UserPreferences {
    const merged = { ...this._value, ...other._value };
    return new UserPreferences(merged);
  }

  /**
   * Create copy with updates
   */
  withUpdates(updates: Partial<Record<string, any>>): UserPreferences {
    const updated = { ...this._value, ...updates };
    return new UserPreferences(updated);
  }
}
