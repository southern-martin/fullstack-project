import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationResult } from '../../domain/services/auth-validation.service';

/**
 * Custom Validation Exception
 * Follows Clean Architecture principles
 * Provides detailed validation error information
 */
export class ValidationException extends HttpException {
  public readonly errors: string[];
  public readonly fieldErrors: Record<string, string>;
  public readonly timestamp: string;
  public readonly path: string;

  constructor(
    errors: string[],
    fieldErrors?: Record<string, string>,
    path?: string,
  ) {
    super(
      {
        message: 'Validation failed',
        errors,
        fieldErrors: fieldErrors || {},
        timestamp: new Date().toISOString(),
        path: path || '',
      },
      HttpStatus.BAD_REQUEST,
    );

    this.errors = errors;
    this.fieldErrors = fieldErrors || {};
    this.timestamp = new Date().toISOString();
    this.path = path || '';
  }

  /**
   * Creates ValidationException from field errors
   * @param fieldErrors - Record of field names to error messages
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromFieldErrors(
    fieldErrors: Record<string, string>,
    path?: string,
  ): ValidationException {
    const errors = Object.values(fieldErrors);
    return new ValidationException(errors, fieldErrors, path);
  }

  /**
   * Creates ValidationException from single field error
   * @param field - Field name
   * @param message - Error message
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromFieldError(
    field: string,
    message: string,
    path?: string,
  ): ValidationException {
    const fieldErrors = { [field]: message };
    return ValidationException.fromFieldErrors(fieldErrors, path);
  }

  /**
   * Creates ValidationException from custom rule errors
   * @param errors - Array of error messages
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromCustomRuleErrors(
    errors: string[],
    path?: string,
  ): ValidationException {
    return new ValidationException(errors, {}, path);
  }

  /**
   * Creates ValidationException from ValidationResult
   * @param validationResult - ValidationResult object
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromValidationResult(
    validationResult: ValidationResult,
    path?: string,
  ): ValidationException {
    if (validationResult.isValid) {
      throw new Error('Cannot create ValidationException from valid result');
    }

    return new ValidationException(
      validationResult.errors,
      validationResult.fieldErrors,
      path,
    );
  }

  /**
   * Creates ValidationException for single error message
   * @param message - Error message
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromSingleError(message: string, path?: string): ValidationException {
    return new ValidationException([message], {}, path);
  }

  /**
   * Creates ValidationException for authentication failures
   * @param message - Authentication error message
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromAuthenticationError(message: string, path?: string): ValidationException {
    return new ValidationException([message], {}, path);
  }

  /**
   * Creates ValidationException for authorization failures
   * @param message - Authorization error message
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromAuthorizationError(message: string, path?: string): ValidationException {
    return new ValidationException([message], {}, path);
  }

  /**
   * Creates ValidationException for business rule violations
   * @param ruleName - Name of the violated rule
   * @param message - Error message
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromBusinessRuleViolation(
    ruleName: string,
    message: string,
    path?: string,
  ): ValidationException {
    const errorMessage = `Business rule '${ruleName}' violated: ${message}`;
    return new ValidationException([errorMessage], {}, path);
  }

  /**
   * Creates ValidationException for security violations
   * @param message - Security error message
   * @param path - Request path where error occurred
   * @returns ValidationException instance
   */
  static fromSecurityViolation(message: string, path?: string): ValidationException {
    return new ValidationException([message], {}, path);
  }

  /**
   * Checks if this is a field validation error
   * @returns True if this exception contains field errors
   */
  hasFieldErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }

  /**
   * Gets error for a specific field
   * @param field - Field name
   * @returns Error message for the field or null
   */
  getFieldError(field: string): string | null {
    return this.fieldErrors[field] || null;
  }

  /**
   * Adds a new field error
   * @param field - Field name
   * @param message - Error message
   */
  addFieldError(field: string, message: string): void {
    this.fieldErrors[field] = message;
    if (!this.errors.includes(message)) {
      this.errors.push(message);
    }
  }

  /**
   * Adds a general error
   * @param message - Error message
   */
  addError(message: string): void {
    if (!this.errors.includes(message)) {
      this.errors.push(message);
    }
  }

  /**
   * Merges another ValidationException into this one
   * @param other - Another ValidationException to merge
   */
  merge(other: ValidationException): void {
    // Merge field errors
    Object.assign(this.fieldErrors, other.fieldErrors);

    // Merge general errors
    other.errors.forEach(error => {
      if (!this.errors.includes(error)) {
        this.errors.push(error);
      }
    });
  }

  /**
   * Converts exception to a plain object for API responses
   * @returns Plain object representation
   */
  toResponseObject(): {
    message: string;
    errors: string[];
    fieldErrors: Record<string, string>;
    timestamp: string;
    path: string;
  } {
    return {
      message: 'Validation failed',
      errors: this.errors,
      fieldErrors: this.fieldErrors,
      timestamp: this.timestamp,
      path: this.path,
    };
  }

  /**
   * Gets a summary of all errors
   * @returns Consolidated error message
   */
  getErrorSummary(): string {
    if (this.errors.length === 0) {
      return 'Unknown validation error';
    }

    if (this.errors.length === 1) {
      return this.errors[0];
    }

    const fieldErrorCount = Object.keys(this.fieldErrors).length;
    const generalErrorCount = this.errors.length;

    if (fieldErrorCount > 0 && generalErrorCount > fieldErrorCount) {
      return `${fieldErrorCount} field error(s) and ${generalErrorCount - fieldErrorCount} general validation error(s)`;
    }

    if (fieldErrorCount > 0) {
      return `${fieldErrorCount} field validation error(s)`;
    }

    return `${generalErrorCount} validation error(s)`;
  }

  /**
   * Checks if this is a critical validation error
   * @returns True if this is a critical error
   */
  isCritical(): boolean {
    const criticalKeywords = [
      'security',
      'unauthorized',
      'forbidden',
      'critical',
      'blocked',
      'suspended',
    ];

    return this.errors.some(error =>
      criticalKeywords.some(keyword =>
        error.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
  }
}
