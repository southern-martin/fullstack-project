import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  fieldErrors: Record<string, string[]>;
}

/**
 * Validation Utils
 *
 * Utility functions for validation across all services.
 */
export class ValidationUtils {
  /**
   * Validate a DTO object
   */
  static async validateDto<T extends object>(
    dtoClass: new () => T,
    data: any,
    options?: { skipMissingProperties?: boolean; whitelist?: boolean }
  ): Promise<ValidationResult> {
    const dto = plainToClass(dtoClass, data);
    const errors = await validate(dto, {
      skipMissingProperties: options?.skipMissingProperties || false,
      whitelist: options?.whitelist || true,
    });

    const fieldErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      const fieldName = error.property;
      const errorMessages = error.constraints
        ? Object.values(error.constraints)
        : ["Invalid value"];

      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = [];
      }
      fieldErrors[fieldName].push(...(errorMessages as string[]));
    });

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate date format
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validate UUID format
   */
  static isValidUuid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, "");
  }

  /**
   * Validate and sanitize string
   */
  static validateAndSanitizeString(
    input: string,
    minLength: number = 1,
    maxLength: number = 255
  ): { isValid: boolean; value: string; error?: string } {
    const sanitized = this.sanitizeString(input);

    if (sanitized.length < minLength) {
      return {
        isValid: false,
        value: sanitized,
        error: `String must be at least ${minLength} characters long`,
      };
    }

    if (sanitized.length > maxLength) {
      return {
        isValid: false,
        value: sanitized,
        error: `String must not exceed ${maxLength} characters`,
      };
    }

    return {
      isValid: true,
      value: sanitized,
    };
  }

  /**
   * Validate numeric range
   */
  static validateNumericRange(
    value: number,
    min: number,
    max: number
  ): { isValid: boolean; error?: string } {
    if (value < min) {
      return {
        isValid: false,
        error: `Value must be at least ${min}`,
      };
    }

    if (value > max) {
      return {
        isValid: false,
        error: `Value must not exceed ${max}`,
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Validate array length
   */
  static validateArrayLength(
    array: any[],
    minLength: number = 0,
    maxLength?: number
  ): { isValid: boolean; error?: string } {
    if (array.length < minLength) {
      return {
        isValid: false,
        error: `Array must contain at least ${minLength} items`,
      };
    }

    if (maxLength && array.length > maxLength) {
      return {
        isValid: false,
        error: `Array must not contain more than ${maxLength} items`,
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Validate business rules
   */
  static validateBusinessRules(
    rules: Array<{ condition: boolean; error: string }>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    rules.forEach((rule) => {
      if (!rule.condition) {
        errors.push(rule.error);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format validation errors for API response
   */
  static formatValidationErrors(
    errors: ValidationError[]
  ): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      const fieldName = error.property;
      const errorMessages = error.constraints
        ? Object.values(error.constraints)
        : ["Invalid value"];

      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = [];
      }
      fieldErrors[fieldName].push(...(errorMessages as string[]));
    });

    return fieldErrors;
  }

  /**
   * Check if value is empty
   */
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === "string") {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === "object") {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  /**
   * Check if value is not empty
   */
  static isNotEmpty(value: any): boolean {
    return !this.isEmpty(value);
  }
}
