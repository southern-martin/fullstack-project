import { ValueObject } from "../interfaces/value-object.interface";

/**
 * PhoneNumber Value Object
 *
 * Encapsulates phone number validation and normalization logic.
 * Follows Value Object pattern from Domain-Driven Design.
 *
 * Business Rules:
 * - Must be valid phone number format
 * - Normalized to international format
 * - Supports country codes
 * - Immutable after creation
 */
export class PhoneNumber implements ValueObject {
  private readonly _value: string;
  private readonly _countryCode: string;
  private readonly _formatted: string;

  constructor(phone: string) {
    const normalized = this.validateAndNormalize(phone);
    this._value = normalized.number;
    this._countryCode = normalized.countryCode;
    this._formatted = normalized.formatted;
  }

  /**
   * Get the raw phone number (digits only)
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get the country code
   */
  get countryCode(): string {
    return this._countryCode;
  }

  /**
   * Get the formatted phone number
   */
  get formatted(): string {
    return this._formatted;
  }

  /**
   * Get the phone number for display (with formatting)
   */
  get displayValue(): string {
    if (this._countryCode === '+1') {
      // US format: (XXX) XXX-XXXX
      const match = this._value.match(/^1(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    // International format: +XX XXX XXX XXXX
    if (this._value.length >= 10) {
      const parts = this._value.match(/(\d{1,3})(\d{1,3})(\d{1,4})(\d{1,4})$/);
      if (parts) {
        return `${this._countryCode} ${parts.slice(1).join(' ')}`;
      }
    }

    return this._formatted;
  }

  /**
   * Check if phone number is from a specific country
   */
  isFromCountry(countryCode: string): boolean {
    return this._countryCode === countryCode;
  }

  /**
   * Check if phone number is mobile (basic heuristic)
   */
  isMobile(): boolean {
    // Basic heuristic: Mobile numbers often have different patterns
    // This is simplified - in real implementation, you'd have country-specific rules
    const mobilePrefixes = {
      '+1': ['2', '3', '4', '5', '6', '7', '8', '9'], // US mobile prefixes
      '+44': ['7'], // UK mobile
      '+91': ['6', '7', '8', '9'], // India mobile
    };

    const prefixes = mobilePrefixes[this._countryCode];
    if (!prefixes) return true; // Default to mobile if unknown

    const firstDigit = this._value.replace(this._countryCode, '')[0];
    return prefixes.includes(firstDigit);
  }

  /**
   * Check if this phone number equals another
   */
  equals(other: PhoneNumber): boolean {
    if (!(other instanceof PhoneNumber)) {
      return false;
    }
    return this._value === other.value && this._countryCode === other.countryCode;
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this._formatted;
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): { value: string; countryCode: string; formatted: string } {
    return {
      value: this._value,
      countryCode: this._countryCode,
      formatted: this._formatted
    };
  }

  /**
   * Validate and normalize phone number
   * @private
   */
  private validateAndNormalize(phone: string): {
    number: string;
    countryCode: string;
    formatted: string;
  } {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Phone number is required and must be a string');
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      throw new Error('Phone number cannot be empty');
    }

    // Extract digits only
    const digitsOnly = trimmedPhone.replace(/\D/g, '');

    if (digitsOnly.length < 10) {
      throw new Error('Phone number must have at least 10 digits');
    }

    if (digitsOnly.length > 15) {
      throw new Error('Phone number cannot have more than 15 digits');
    }

    // Detect country code
    const { countryCode, number } = this.extractCountryCode(digitsOnly);

    // Validate number based on country
    this.validatePhoneNumberForCountry(number, countryCode);

    const formatted = this.formatPhoneNumber(countryCode, number);

    return { number, countryCode, formatted };
  }

  /**
   * Extract country code from phone number
   * @private
   */
  private extractCountryCode(digits: string): { countryCode: string; number: string } {
    // Default to +1 if no country code specified
    if (digits.startsWith('1') && digits.length === 11) {
      return { countryCode: '+1', number: digits };
    }

    // Check for explicit country code
    const hasCountryCode = digits.startsWith('+');
    if (hasCountryCode) {
      // Find where country code ends (usually 1-3 digits)
      for (let i = 2; i <= 4; i++) {
        const potentialCode = digits.substring(0, i);
        const remainingDigits = digits.substring(i);

        if (remainingDigits.length >= 10 && remainingDigits.length <= 15) {
          return { countryCode: `+${potentialCode}`, number: remainingDigits };
        }
      }
    }

    // Default to +1 for US numbers
    return { countryCode: '+1', number: digits };
  }

  /**
   * Validate phone number for specific country
   * @private
   */
  private validatePhoneNumberForCountry(number: string, countryCode: string): void {
    switch (countryCode) {
      case '+1': // US/Canada
        if (number.length !== 10) {
          throw new Error('US/Canada phone numbers must have exactly 10 digits');
        }
        break;
      case '+44': // UK
        if (number.length < 10 || number.length > 11) {
          throw new Error('UK phone numbers must have 10-11 digits');
        }
        break;
      case '+91': // India
        if (number.length !== 10) {
          throw new Error('Indian phone numbers must have exactly 10 digits');
        }
        break;
      default:
        // Basic validation for other countries
        if (number.length < 7 || number.length > 15) {
          throw new Error('Phone number length is invalid for the detected country');
        }
    }
  }

  /**
   * Format phone number for display
   * @private
   */
  private formatPhoneNumber(countryCode: string, number: string): string {
    switch (countryCode) {
      case '+1': // US/Canada
        const match = number.match(/(\d{3})(\d{3})(\d{4})/);
        return match
          ? `${countryCode} (${match[1]}) ${match[2]}-${match[3]}`
          : `${countryCode} ${number}`;
      case '+44': // UK
        if (number.length === 11) {
          return `${countryCode} ${number.substring(0, 4)} ${number.substring(4)}`;
        }
        return `${countryCode} ${number}`;
      default:
        // Generic format
        const groups = number.match(/(\d{1,4})(\d{1,4})(\d{1,4})(\d{1,4})/);
        return groups
          ? `${countryCode} ${groups.slice(1).filter(g => g).join(' ')}`
          : `${countryCode} ${number}`;
    }
  }

  /**
   * Create PhoneNumber from string (factory method)
   */
  static fromString(phone: string): PhoneNumber {
    return new PhoneNumber(phone);
  }

  /**
   * Check if string is a valid phone number (without throwing)
   */
  static isValid(phone: string): boolean {
    try {
      new PhoneNumber(phone);
      return true;
    } catch {
      return false;
    }
  }
}
