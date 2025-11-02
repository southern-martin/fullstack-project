import { ValueObject } from "../interfaces/value-object.interface";

/**
 * Email Value Object
 *
 * Encapsulates email validation and normalization logic.
 * Follows Value Object pattern from Domain-Driven Design.
 *
 * Business Rules:
 * - Must be valid email format
 * - Always stored in lowercase
 * - Trimmed whitespace
 * - Immutable after creation
 */
export class Email implements ValueObject {
  private readonly _value: string;

  constructor(email: string) {
    this._value = this.validateAndNormalize(email);
  }

  /**
   * Get the email value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get the domain part of the email
   */
  get domain(): string {
    const parts = this._value.split('@');
    return parts.length > 1 ? parts[1].toLowerCase() : '';
  }

  /**
   * Get the local part of the email
   */
  get local(): string {
    const parts = this._value.split('@');
    return parts[0] || '';
  }

  /**
   * Check if email is from a temporary domain
   */
  isFromTemporaryDomain(): boolean {
    const temporaryDomains = [
      'temp-mail.org',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'trashmail.com'
    ];
    return temporaryDomains.includes(this.domain.toLowerCase());
  }

  /**
   * Check if email is from a business domain (basic heuristic)
   */
  isBusinessEmail(): boolean {
    const businessIndicators = [
      'info@',
      'contact@',
      'support@',
      'admin@',
      'sales@',
      'service@'
    ];

    return businessIndicators.some(indicator =>
      this._value.toLowerCase().startsWith(indicator)
    ) || this.domain.includes('company') || this.domain.includes('corp');
  }

  /**
   * Check if this email equals another email
   */
  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value === other.value;
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this._value;
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): string {
    return this._value;
  }

  /**
   * Validate and normalize email
   * @private
   */
  private validateAndNormalize(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      throw new Error('Email cannot be empty');
    }

    const normalizedEmail = trimmedEmail.toLowerCase();

    if (!this.isValidEmailFormat(normalizedEmail)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    return normalizedEmail;
  }

  /**
   * Validate email format using comprehensive regex
   * @private
   */
  private isValidEmailFormat(email: string): boolean {
    // RFC 5322 compliant email regex (simplified for practical use)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Additional basic checks
    if (!email.includes('@') || email.startsWith('@') || email.endsWith('@')) {
      return false;
    }

    const [local, domain] = email.split('@');
    if (local.length === 0 || domain.length === 0) {
      return false;
    }

    if (local.length > 64 || domain.length > 253) {
      return false;
    }

    return emailRegex.test(email);
  }

  /**
   * Create Email from string (factory method)
   */
  static fromString(email: string): Email {
    return new Email(email);
  }

  /**
   * Check if string is a valid email (without throwing)
   */
  static isValid(email: string): boolean {
    try {
      new Email(email);
      return true;
    } catch {
      return false;
    }
  }
}
