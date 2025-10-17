/**
 * Email Value Object
 * Represents a validated email address in the domain
 * Immutable and self-validating
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Create an Email value object
   * @param email - The email string to validate and wrap
   * @returns Email value object
   * @throws Error if email is invalid
   */
  static create(email: string): Email {
    if (!email) {
      throw new Error("Email cannot be empty");
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (!this.isValid(trimmedEmail)) {
      throw new Error("Invalid email format");
    }

    return new Email(trimmedEmail);
  }

  /**
   * Validate email format
   * @param email - Email string to validate
   * @returns True if valid, false otherwise
   */
  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Get the email value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Get email domain
   */
  get domain(): string {
    return this._value.split("@")[1];
  }

  /**
   * Get email local part (before @)
   */
  get localPart(): string {
    return this._value.split("@")[0];
  }

  /**
   * Check if this email equals another
   * @param other - Email to compare
   * @returns True if emails are equal
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}
