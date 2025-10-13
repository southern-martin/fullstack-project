/**
 * Database Configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

/**
 * Service Configuration
 *
 * Standardized configuration for all microservices.
 */
export interface ServiceConfig {
  // Service identification
  name: string;
  version: string;
  port: number;
  host: string;

  // Database configuration
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
  };

  // Redis configuration
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };

  // JWT configuration
  jwt: {
    secret: string;
    expiresIn: string;
    issuer: string;
  };

  // CORS configuration
  cors: {
    origin: string[];
    credentials: boolean;
  };

  // Logging configuration
  logging: {
    level: string;
    format: "json" | "text";
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  };

  // External services
  services: {
    auth: string;
    user: string;
    customer: string;
    carrier: string;
    pricing: string;
    translation: string;
  };

  // Health check configuration
  health: {
    enabled: boolean;
    path: string;
    interval: number;
  };

  // Rate limiting
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
  };
}

/**
 * Load service configuration from environment variables
 */
export function loadServiceConfig(): ServiceConfig {
  return {
    name: process.env.SERVICE_NAME || "unknown-service",
    version: process.env.SERVICE_VERSION || "1.0.0",
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "localhost",

    database: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "app_db",
      synchronize: process.env.DB_SYNCHRONIZE === "true",
      logging: process.env.DB_LOGGING === "true",
    },

    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || "0", 10),
    },

    jwt: {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      issuer: process.env.JWT_ISSUER || "fullstack-project",
    },

    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
      credentials: process.env.CORS_CREDENTIALS === "true",
    },

    logging: {
      level: process.env.LOG_LEVEL || "info",
      format: (process.env.LOG_FORMAT as "json" | "text") || "text",
      enableConsole: process.env.LOG_ENABLE_CONSOLE !== "false",
      enableFile: process.env.LOG_ENABLE_FILE === "true",
      filePath: process.env.LOG_FILE_PATH,
    },

    services: {
      auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
      user: process.env.USER_SERVICE_URL || "http://localhost:3003",
      customer: process.env.CUSTOMER_SERVICE_URL || "http://localhost:3004",
      carrier: process.env.CARRIER_SERVICE_URL || "http://localhost:3005",
      pricing: process.env.PRICING_SERVICE_URL || "http://localhost:3006",
      translation:
        process.env.TRANSLATION_SERVICE_URL || "http://localhost:3007",
    },

    health: {
      enabled: process.env.HEALTH_ENABLED !== "false",
      path: process.env.HEALTH_PATH || "/health",
      interval: parseInt(process.env.HEALTH_INTERVAL || "30000", 10),
    },

    rateLimit: {
      enabled: process.env.RATE_LIMIT_ENABLED === "true",
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    },
  };
}

/**
 * Validate service configuration
 */
export function validateServiceConfig(config: ServiceConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!config.name) {
    errors.push("Service name is required");
  }

  if (!config.version) {
    errors.push("Service version is required");
  }

  if (!config.port || config.port < 1 || config.port > 65535) {
    errors.push("Valid port number is required (1-65535)");
  }

  // Validate database configuration
  if (!config.database.host) {
    errors.push("Database host is required");
  }

  if (
    !config.database.port ||
    config.database.port < 1 ||
    config.database.port > 65535
  ) {
    errors.push("Valid database port is required");
  }

  if (!config.database.username) {
    errors.push("Database username is required");
  }

  if (!config.database.database) {
    errors.push("Database name is required");
  }

  // Validate Redis configuration
  if (!config.redis.host) {
    errors.push("Redis host is required");
  }

  if (
    !config.redis.port ||
    config.redis.port < 1 ||
    config.redis.port > 65535
  ) {
    errors.push("Valid Redis port is required");
  }

  // Validate JWT configuration
  if (!config.jwt.secret || config.jwt.secret.length < 32) {
    errors.push("JWT secret must be at least 32 characters long");
  }

  if (!config.jwt.expiresIn) {
    errors.push("JWT expiration time is required");
  }

  // Validate service URLs
  Object.entries(config.services).forEach(([name, url]) => {
    if (!url) {
      errors.push(`${name} service URL is required`);
    } else if (!isValidUrl(url)) {
      errors.push(`${name} service URL is invalid: ${url}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if URL is valid
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(): {
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
} {
  const environment = process.env.NODE_ENV || "development";

  return {
    environment,
    isDevelopment: environment === "development",
    isProduction: environment === "production",
  };
}

/**
 * Configuration manager
 */
export class ConfigurationManager {
  private config: ServiceConfig;
  private validation: { isValid: boolean; errors: string[] };

  constructor() {
    this.config = loadServiceConfig();
    this.validation = validateServiceConfig(this.config);
  }

  /**
   * Get configuration
   */
  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  /**
   * Get database configuration
   */
  getDatabaseConfig() {
    return { ...this.config.database };
  }

  /**
   * Get Redis configuration
   */
  getRedisConfig() {
    return { ...this.config.redis };
  }

  /**
   * Get JWT configuration
   */
  getJwtConfig() {
    return { ...this.config.jwt };
  }

  /**
   * Get service URLs
   */
  getServiceUrls() {
    return { ...this.config.services };
  }

  /**
   * Check if configuration is valid
   */
  isValid(): boolean {
    return this.validation.isValid;
  }

  /**
   * Get validation errors
   */
  getValidationErrors(): string[] {
    return [...this.validation.errors];
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...updates };
    this.validation = validateServiceConfig(this.config);
  }

  /**
   * Get environment info
   */
  getEnvironmentInfo() {
    return getEnvironmentConfig();
  }
}
