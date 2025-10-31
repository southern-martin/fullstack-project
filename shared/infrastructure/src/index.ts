/**
 * Shared Infrastructure Package
 *
 * This package provides common infrastructure components that can be used
 * across all microservices in the fullstack project.
 */

// Core utilities
export * from "./core/base-entity";
export * from "./core/domain-event";
export * from "./core/result";

// Exceptions
export * from "./exceptions/business.exception";
export * from "./exceptions/not-found.exception";
export * from "./exceptions/validation.exception";

// DTOs
export * from "./dto/api-response.dto";
export * from "./dto/error-response.dto";
export * from "./dto/pagination.dto";

// Filters
export * from "./filters/http-exception.filter";

// Interceptors
export * from "./interceptors/transform.interceptor";

// Communication
export * from "./communication/http-client";

// Database
export * from "./database/base-typeorm.repository";

// Cache
export * from "./cache/redis-cache.service";
export { CacheErrorStrategy, CacheSetOptions, CacheServiceOptions } from "./cache/redis-cache.service";
export * from "./communication/service-communicator";

// Validation
export * from "./validation/custom-validators";
export * from "./validation/validation-utils";

// Authentication
export * from "./auth/jwt-decoder.service";

// Logging - New Winston-based structured logging
export * from "./logging/logging.interceptor";
export * from "./logging/typeorm-logger";
export * from "./logging/winston-logger.module";
export * from "./logging/winston-logger.service";

// Legacy Logging (deprecated)
export * from "./logging/log-level";
export * from "./logging/logger";

// Database
export * from "./database/base-repository";
export * from "./database/connection-manager";

// Configuration
export * from "./config/database-config";
export * from "./config/service-config";

// Health
export * from "./health/health-check";
export * from "./health/health-indicator";
export * from './cache/redis-cache.service';
