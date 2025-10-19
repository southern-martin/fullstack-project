import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * Transform Interceptor
 *
 * Automatically wraps all successful responses in the standardized ApiResponseDto format.
 * This ensures consistent response structure across all microservices.
 *
 * Features:
 * - Wraps response data in standardized format
 * - Adds timestamp to all responses
 * - Preserves status codes (200, 201, etc.)
 * - Skips transformation for responses already in correct format
 *
 * Usage in main.ts:
 * ```typescript
 * import { TransformInterceptor } from '@shared/infrastructure/interceptors/transform.interceptor';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalInterceptors(new TransformInterceptor());
 *   await app.listen(3000);
 * }
 * ```
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If response is already in ApiResponseDto format, return as-is
        if (this.isApiResponse(data)) {
          return data;
        }

        // Get status code from response
        const statusCode = response.statusCode || 200;

        // Determine appropriate message based on status code
        const message = this.getSuccessMessage(statusCode, request.method);

        // Log successful response (optional, can be disabled in production)
        if (process.env.LOG_RESPONSES === 'true') {
          this.logger.log(
            `${request.method} ${request.url} - ${statusCode} - ${message}`,
          );
        }

        // Wrap data in standardized format
        return new ApiResponseDto(data, message, statusCode, true);
      }),
    );
  }

  /**
   * Check if data is already in ApiResponseDto format
   */
  private isApiResponse(data: any): data is ApiResponseDto<T> {
    return (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      'message' in data &&
      'statusCode' in data &&
      'timestamp' in data &&
      'success' in data
    );
  }

  /**
   * Get appropriate success message based on status code and HTTP method
   */
  private getSuccessMessage(statusCode: number, method: string): string {
    // Custom messages for different status codes
    if (statusCode === 201) {
      return 'Created successfully';
    }
    if (statusCode === 204) {
      return 'No content';
    }

    // Custom messages for different HTTP methods
    switch (method) {
      case 'POST':
        return 'Created successfully';
      case 'PUT':
        return 'Updated successfully';
      case 'PATCH':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      case 'GET':
        return 'Success';
      default:
        return 'Success';
    }
  }
}
