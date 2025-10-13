import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Business Exception
 *
 * Custom exception for handling business rule violations and domain-specific errors.
 * This represents errors that occur due to business logic constraints.
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode?: string,
    public readonly details?: Record<string, any>,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(
      {
        message,
        errorCode,
        details,
        statusCode,
        error: "Business Error",
      },
      statusCode
    );
  }

  /**
   * Creates a BusinessException for resource not found
   */
  static notFound(resource: string, identifier?: string | number): BusinessException {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    
    return new BusinessException(
      message,
      'RESOURCE_NOT_FOUND',
      { resource, identifier },
      HttpStatus.NOT_FOUND
    );
  }

  /**
   * Creates a BusinessException for resource already exists
   */
  static alreadyExists(resource: string, identifier?: string | number): BusinessException {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' already exists`
      : `${resource} already exists`;
    
    return new BusinessException(
      message,
      'RESOURCE_ALREADY_EXISTS',
      { resource, identifier },
      HttpStatus.CONFLICT
    );
  }

  /**
   * Creates a BusinessException for insufficient permissions
   */
  static insufficientPermissions(action: string, resource: string): BusinessException {
    return new BusinessException(
      `Insufficient permissions to ${action} ${resource}`,
      'INSUFFICIENT_PERMISSIONS',
      { action, resource },
      HttpStatus.FORBIDDEN
    );
  }

  /**
   * Creates a BusinessException for business rule violation
   */
  static businessRuleViolation(rule: string, details?: Record<string, any>): BusinessException {
    return new BusinessException(
      `Business rule violation: ${rule}`,
      'BUSINESS_RULE_VIOLATION',
      { rule, ...details },
      HttpStatus.BAD_REQUEST
    );
  }

  /**
   * Creates a BusinessException for operation not allowed
   */
  static operationNotAllowed(operation: string, reason?: string): BusinessException {
    const message = reason 
      ? `Operation '${operation}' is not allowed: ${reason}`
      : `Operation '${operation}' is not allowed`;
    
    return new BusinessException(
      message,
      'OPERATION_NOT_ALLOWED',
      { operation, reason },
      HttpStatus.BAD_REQUEST
    );
  }

  /**
   * Creates a BusinessException for external service error
   */
  static externalServiceError(service: string, error: string): BusinessException {
    return new BusinessException(
      `External service '${service}' error: ${error}`,
      'EXTERNAL_SERVICE_ERROR',
      { service, originalError: error },
      HttpStatus.BAD_GATEWAY
    );
  }

  /**
   * Get the error code
   */
  getErrorCode(): string | undefined {
    return this.errorCode;
  }

  /**
   * Get additional details
   */
  getDetails(): Record<string, any> | undefined {
    return this.details;
  }

  /**
   * Check if this is a specific error type
   */
  isErrorCode(errorCode: string): boolean {
    return this.errorCode === errorCode;
  }
}
