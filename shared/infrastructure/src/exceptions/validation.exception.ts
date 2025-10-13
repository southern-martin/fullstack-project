import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Validation Exception
 *
 * Custom exception for handling validation errors with field-specific details.
 * This allows the frontend to display validation errors next to specific form fields.
 */
export class ValidationException extends HttpException {
  constructor(
    public readonly fieldErrors: Record<string, string[]>,
    message: string = "Validation failed"
  ) {
    super(
      {
        message,
        fieldErrors,
        statusCode: HttpStatus.BAD_REQUEST,
        error: "Validation Error",
      },
      HttpStatus.BAD_REQUEST
    );
  }

  /**
   * Creates a ValidationException from a single field error
   */
  static fromFieldError(field: string, error: string): ValidationException {
    return new ValidationException({ [field]: [error] });
  }

  /**
   * Creates a ValidationException from multiple field errors
   */
  static fromFieldErrors(fieldErrors: Record<string, string[]>): ValidationException {
    return new ValidationException(fieldErrors);
  }

  /**
   * Creates a ValidationException from custom rule errors
   */
  static fromCustomRuleErrors(customRuleErrors: string[]): ValidationException {
    return new ValidationException(
      { general: customRuleErrors },
      "Custom rule validation failed"
    );
  }

  /**
   * Creates a ValidationException from domain service validation result
   */
  static fromDomainValidation(
    errors: string[],
    fieldMapping: Record<string, string> = {}
  ): ValidationException {
    const fieldErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      // Try to map generic errors to specific fields
      let field = "general";

      if (error.toLowerCase().includes("email")) {
        field = "email";
      } else if (error.toLowerCase().includes("password")) {
        field = "password";
      } else if (error.toLowerCase().includes("first name")) {
        field = "firstName";
      } else if (error.toLowerCase().includes("last name")) {
        field = "lastName";
      } else if (error.toLowerCase().includes("phone")) {
        field = "phone";
      } else if (error.toLowerCase().includes("date of birth")) {
        field = "dateOfBirth";
      } else if (error.toLowerCase().includes("address")) {
        field = "address";
      } else if (error.toLowerCase().includes("preferences")) {
        field = "preferences";
      } else if (error.toLowerCase().includes("name")) {
        field = "name";
      } else if (error.toLowerCase().includes("service type")) {
        field = "serviceType";
      } else if (error.toLowerCase().includes("region")) {
        field = "region";
      } else if (error.toLowerCase().includes("rule type")) {
        field = "ruleType";
      } else if (error.toLowerCase().includes("condition")) {
        field = "condition";
      } else if (error.toLowerCase().includes("base price")) {
        field = "basePrice";
      } else if (error.toLowerCase().includes("price per unit")) {
        field = "pricePerUnit";
      }

      // Apply custom field mapping if provided
      if (fieldMapping[field]) {
        field = fieldMapping[field];
      }

      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(error);
    });

    return new ValidationException(fieldErrors);
  }

  /**
   * Get all field names that have errors
   */
  getFieldNames(): string[] {
    return Object.keys(this.fieldErrors);
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.fieldErrors[field] || [];
  }

  /**
   * Check if a specific field has errors
   */
  hasFieldError(field: string): boolean {
    return this.fieldErrors[field] && this.fieldErrors[field].length > 0;
  }

  /**
   * Get total number of errors
   */
  getErrorCount(): number {
    return Object.values(this.fieldErrors).reduce((total, errors) => total + errors.length, 0);
  }
}
