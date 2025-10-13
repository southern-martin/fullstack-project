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
  static fromFieldErrors(
    fieldErrors: Record<string, string[]>
  ): ValidationException {
    return new ValidationException(fieldErrors);
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
}
