/**
 * Error Response DTO
 *
 * Standardized error response format for all API endpoints.
 */
export class ErrorResponseDto {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly error: string;
  public readonly timestamp: string;
  public readonly path?: string;
  public readonly fieldErrors?: Record<string, string[]>;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    error: string,
    path?: string,
    fieldErrors?: Record<string, string[]>,
    details?: Record<string, any>
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.fieldErrors = fieldErrors;
    this.details = details;
  }

  /**
   * Create a validation error response
   */
  static validation(
    message: string,
    fieldErrors: Record<string, string[]>,
    path?: string
  ): ErrorResponseDto {
    return new ErrorResponseDto(
      message,
      400,
      "Validation Error",
      path,
      fieldErrors
    );
  }

  /**
   * Create a business error response
   */
  static business(
    message: string,
    errorCode?: string,
    details?: Record<string, any>,
    path?: string
  ): ErrorResponseDto {
    return new ErrorResponseDto(
      message,
      400,
      "Business Error",
      path,
      undefined,
      { errorCode, ...details }
    );
  }

  /**
   * Create a not found error response
   */
  static notFound(
    message: string,
    resource?: string,
    identifier?: string | number,
    path?: string
  ): ErrorResponseDto {
    return new ErrorResponseDto(message, 404, "Not Found", path, undefined, {
      resource,
      identifier,
    });
  }

  /**
   * Create an unauthorized error response
   */
  static unauthorized(
    message: string = "Unauthorized",
    path?: string
  ): ErrorResponseDto {
    return new ErrorResponseDto(message, 401, "Unauthorized", path);
  }

  /**
   * Create a forbidden error response
   */
  static forbidden(
    message: string = "Forbidden",
    path?: string
  ): ErrorResponseDto {
    return new ErrorResponseDto(message, 403, "Forbidden", path);
  }

  /**
   * Create an internal server error response
   */
  static internal(
    message: string = "Internal Server Error",
    path?: string,
    details?: Record<string, any>
  ): ErrorResponseDto {
    return new ErrorResponseDto(
      message,
      500,
      "Internal Server Error",
      path,
      undefined,
      details
    );
  }

  /**
   * Create a service unavailable error response
   */
  static serviceUnavailable(
    message: string = "Service Unavailable",
    path?: string
  ): ErrorResponseDto {
    return new ErrorResponseDto(message, 503, "Service Unavailable", path);
  }

  /**
   * Check if this is a validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 400 && this.error === "Validation Error";
  }

  /**
   * Check if this is a business error
   */
  isBusinessError(): boolean {
    return this.statusCode === 400 && this.error === "Business Error";
  }

  /**
   * Check if this is a not found error
   */
  isNotFoundError(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if this is an authentication error
   */
  isAuthenticationError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if this is an authorization error
   */
  isAuthorizationError(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if this is a server error
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Get field errors if this is a validation error
   */
  getFieldErrors(): Record<string, string[]> | undefined {
    return this.fieldErrors;
  }

  /**
   * Get error details
   */
  getDetails(): Record<string, any> | undefined {
    return this.details;
  }

  /**
   * Convert to JSON
   */
  toJSON(): string {
    return JSON.stringify(this);
  }
}
