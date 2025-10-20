import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * Global HTTP Exception Filter
 *
 * Catches all HTTP exceptions and formats them according to our standardized error response format.
 * This ensures consistent error responses across all microservices.
 *
 * Usage in main.ts:
 * ```typescript
 * import { HttpExceptionFilter } from '@shared/infrastructure/filters/http-exception.filter';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalFilters(new HttpExceptionFilter());
 *   await app.listen(3000);
 * }
 * ```
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number;
    let message: string;
    let error: string;
    let fieldErrors: Record<string, string[]> | undefined;
    let details: Record<string, any> | undefined;

    // Handle HTTP exceptions (thrown by NestJS or manually)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;

        // Extract message (handle both string and array formats)
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message[0];
          
          // If it's a validation error, extract field errors
          if (status === HttpStatus.BAD_REQUEST) {
            fieldErrors = this.extractFieldErrors(responseObj.message);
          }
        } else {
          message = responseObj.message || exception.message;
        }

        // Extract error type
        error = responseObj.error || this.getErrorType(status);

        // Extract validation errors if present (class-validator format)
        if (responseObj.errors && Array.isArray(responseObj.errors)) {
          fieldErrors = this.extractFieldErrors(responseObj.errors);
        }
      } else {
        message = exceptionResponse as string;
        error = this.getErrorType(status);
      }
    } 
    // Handle unknown errors (500 Internal Server Error)
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';

      // Log the full error for debugging
      this.logger.error('Unhandled exception:', exception);

      // Include error details in development mode
      if (process.env.NODE_ENV === 'development') {
        details = {
          errorName: (exception as Error).name,
          errorMessage: (exception as Error).message,
          stack: (exception as Error).stack,
        };
      }
    }

    // Create standardized error response
    const errorResponse = new ErrorResponseDto(
      message,
      status,
      error,
      request.url,
      fieldErrors,
      details
    );

    // Log error (but not 404s to reduce noise)
    if (status !== HttpStatus.NOT_FOUND) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        fieldErrors ? JSON.stringify(fieldErrors) : ''
      );
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Extract field-level validation errors from class-validator messages
   */
  private extractFieldErrors(messages: any[]): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};

    messages.forEach((msg) => {
      if (typeof msg === 'string') {
        // Simple string message - extract field name if possible
        const match = msg.match(/^(\w+)\s/);
        const field = match ? match[1] : 'general';
        
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(msg);
      } else if (typeof msg === 'object' && msg.property) {
        // class-validator format: { property: 'email', constraints: { ... } }
        const field = msg.property;
        
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }

        if (msg.constraints) {
          Object.values(msg.constraints).forEach((constraint: any) => {
            fieldErrors[field].push(constraint);
          });
        }
      }
    });

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
  }

  /**
   * Get human-readable error type based on status code
   */
  private getErrorType(status: number): string {
    const errorTypes: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };

    return errorTypes[status] || 'Error';
  }
}
