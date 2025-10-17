/**
 * Password Value Object
 * Represents a validated password in the domain
 * Immutable and self-validating
 * Note: This represents the plain password for validation purposes only
 */
export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Create a Password value object
   * @param password - The password string to validate and wrap
   * @returns Password value object
   * @throws Error if password is invalid
   */
  static create(password: string): Password {
    if (!password) {
      throw new Error("Password cannot be empty");
    }

    const validationResult = this.validate(password);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(", "));
    }

    return new Password(password);
  }

  /**
   * Validate password against security requirements
   * @param password - Password string to validate
   * @returns Validation result with errors
   */
  private static validate(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Minimum length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    // Maximum length
    if (password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    }

    // Must contain lowercase
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    // Must contain uppercase
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    // Must contain digit
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one digit");
    }

    // Must contain special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get the password value (use with caution)
   */
  get value(): string {
    return this._value;
  }

  /**
   * Check password strength
   * @returns Strength level: weak, medium, strong
   */
  get strength(): "weak" | "medium" | "strong" {
    let score = 0;

    if (this._value.length >= 12) score++;
    if (/[a-z]/.test(this._value)) score++;
    if (/[A-Z]/.test(this._value)) score++;
    if (/\d/.test(this._value)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this._value)) score++;
    if (this._value.length >= 16) score++;

    if (score <= 3) return "weak";
    if (score <= 5) return "medium";
    return "strong";
  }

  /**
   * Check if password contains common patterns
   * @returns True if password appears to be weak
   */
  hasCommonPatterns(): boolean {
    const commonPasswords = [
      "password",
      "123456",
      "12345678",
      "admin",
      "qwerty",
      "letmein",
      "welcome",
      "monkey",
      "dragon",
    ];

    const lowerPassword = this._value.toLowerCase();
    return commonPasswords.some((common) => lowerPassword.includes(common));
  }

  /**
   * String representation (masked for security)
   */
  toString(): string {
    return "********";
  }
}
