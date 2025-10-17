/**
 * PhoneNumber Value Object
 * Represents a validated phone number in the domain
 * Immutable and self-validating
 */
export class PhoneNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Create a PhoneNumber value object
   * @param phone - The phone number string to validate and wrap
   * @returns PhoneNumber value object
   * @throws Error if phone number is invalid
   */
  static create(phone: string): PhoneNumber {
    if (!phone) {
      throw new Error("Phone number cannot be empty");
    }

    const trimmedPhone = phone.trim();
    
    if (!this.isValid(trimmedPhone)) {
      throw new Error("Invalid phone number format");
    }

    return new PhoneNumber(trimmedPhone);
  }

  /**
   * Validate phone number format
   * Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
   * @param phone - Phone number string to validate
   * @returns True if valid, false otherwise
   */
  private static isValid(phone: string): boolean {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");
    
    // Phone should have 10-15 digits
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return false;
    }

    // Basic format validation - should contain only digits, spaces, parentheses, hyphens, plus
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone);
  }

  /**
   * Get the phone number value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get normalized phone number (digits only)
   */
  get normalized(): string {
    return this._value.replace(/\D/g, "");
  }

  /**
   * Format phone number for display (US format)
   * Example: +1 (234) 567-8900
   */
  get formatted(): string {
    const digits = this.normalized;
    
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return this._value; // Return original if can't format
  }

  /**
   * Check if this phone number equals another
   * @param other - PhoneNumber to compare
   * @returns True if phone numbers are equal (normalized comparison)
   */
  equals(other: PhoneNumber): boolean {
    return this.normalized === other.normalized;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}
