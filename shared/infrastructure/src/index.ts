/**
 * Shared Infrastructure Package
 * 
 * This package provides common infrastructure components that can be used
 * across all microservices in the fullstack project.
 */

// Core utilities
export * from './core/result';
export * from './core/base-entity';
export * from './core/domain-event';

// Exceptions
export * from './exceptions/validation.exception';
export * from './exceptions/business.exception';
export * from './exceptions/not-found.exception';

// DTOs
export * from './dto/pagination.dto';
export * from './dto/api-response.dto';
export * from './dto/error-response.dto';

// Communication
export * from './communication/service-communicator';
export * from './communication/http-client';

// Validation
export * from './validation/validation-utils';
export * from './validation/custom-validators';

// Logging
export * from './logging/logger';
export * from './logging/log-level';

// Database
export * from './database/base-repository';
export * from './database/connection-manager';

// Configuration
export * from './config/service-config';
export * from './config/database-config';

// Health
export * from './health/health-check';
export * from './health/health-indicator';
