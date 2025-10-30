import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export interface Response<T> {
  data: T;
}

/**
 * Transform Interceptor
 * Automatically transforms response entities to DTOs using class-transformer
 * Respects @Expose and @Exclude decorators
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already a DTO or primitive, return as-is
        if (!data || typeof data !== 'object') {
          return { data };
        }

        // Handle arrays
        if (Array.isArray(data)) {
          return {
            data: data.map((item) =>
              plainToInstance(item.constructor as any, item, {
                excludeExtraneousValues: true,
              }),
            ) as any,
          };
        }

        // Handle pagination response { sellers, total }
        if (data.sellers && Array.isArray(data.sellers)) {
          return {
            data: {
              sellers: data.sellers.map((item: any) =>
                plainToInstance(item.constructor as any, item, {
                  excludeExtraneousValues: true,
                }),
              ),
              total: data.total,
            } as any,
          };
        }

        // Handle single object
        return {
          data: plainToInstance(data.constructor as any, data, {
            excludeExtraneousValues: true,
          }) as any,
        };
      }),
    );
  }
}
