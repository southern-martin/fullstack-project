import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService, asyncLocalStorage } from './winston-logger.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Logging Interceptor
 * Adds correlation ID, tracks request/response, and measures response time
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {
    this.logger.setContext('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, headers, body } = request;
    const correlationId = headers['x-correlation-id'] || uuidv4();
    const userId = request.user?.id || request.user?.userId;

    // Set correlation ID in response header
    response.setHeader('X-Correlation-ID', correlationId);

    // Create async context store
    const store = new Map<string, any>();
    store.set('correlationId', correlationId);
    store.set('requestPath', url);
    if (userId) store.set('userId', userId);

    const startTime = Date.now();

    return asyncLocalStorage.run(store, () => {
      // Log incoming request
      this.logger.log(`Incoming ${method} ${url}`, {
        method,
        url,
        correlationId,
        userId,
        userAgent: headers['user-agent'],
        ip: request.ip,
      });

      // Log request body for POST/PUT/PATCH (excluding sensitive data)
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        const sanitizedBody = this.sanitizeBody(body);
        this.logger.debug('Request body', { body: sanitizedBody });
      }

      return next.handle().pipe(
        tap({
          next: (data) => {
            const responseTime = Date.now() - startTime;
            const statusCode = response.statusCode;

            // Log successful response
            this.logger.logRequest(method, url, statusCode, responseTime, userId);

            if (responseTime > 3000) {
              this.logger.warn(`Slow response detected: ${responseTime}ms`, {
                method,
                url,
                responseTime,
              });
            }
          },
          error: (error) => {
            const responseTime = Date.now() - startTime;
            const statusCode = error.status || 500;

            // Log error response
            this.logger.error(
              `Request failed: ${method} ${url}`,
              error.stack,
            );

            this.logger.logRequest(method, url, statusCode, responseTime, userId);
          },
        })
      );
    });
  }

  /**
   * Sanitize request body by removing sensitive fields
   */
  private sanitizeBody(body: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'accessToken', 'refreshToken'];
    
    if (typeof body !== 'object' || body === null) {
      return body;
    }

    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
