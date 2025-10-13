import { LogLevel, getLogLevelName, parseLogLevel } from "./log-level";

/**
 * Log Entry Interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  service?: string;
  traceId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

/**
 * Logger Configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  service: string;
  context?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
  enableJson?: boolean;
  includeStackTrace?: boolean;
}

/**
 * Logger
 *
 * Standardized logger for all microservices with structured logging support.
 */
export class Logger {
  private config: LoggerConfig;
  private traceId: string | null = null;

  constructor(config: LoggerConfig) {
    this.config = {
      enableConsole: true,
      enableFile: false,
      enableJson: false,
      includeStackTrace: false,
      ...config,
    };
  }

  /**
   * Set trace ID for request correlation
   */
  setTraceId(traceId: string): void {
    this.traceId = traceId;
  }

  /**
   * Clear trace ID
   */
  clearTraceId(): void {
    this.traceId = null;
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, { error, metadata });
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, { metadata });
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, { metadata });
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, { metadata });
  }

  /**
   * Log verbose message
   */
  verbose(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.VERBOSE, message, { metadata });
  }

  /**
   * Log HTTP request
   */
  logHttpRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    this.info(`HTTP ${method} ${url}`, {
      method,
      url,
      statusCode,
      duration,
      ...metadata,
    });
  }

  /**
   * Log database query
   */
  logDatabaseQuery(
    query: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    this.debug(`Database Query: ${query}`, {
      query,
      duration,
      ...metadata,
    });
  }

  /**
   * Log service communication
   */
  logServiceCommunication(
    service: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    this.info(`Service Communication: ${service}`, {
      service,
      endpoint,
      method,
      statusCode,
      duration,
      ...metadata,
    });
  }

  /**
   * Log business event
   */
  logBusinessEvent(
    event: string,
    entity: string,
    entityId: string | number,
    metadata?: Record<string, any>
  ): void {
    this.info(`Business Event: ${event}`, {
      event,
      entity,
      entityId,
      ...metadata,
    });
  }

  /**
   * Log performance metric
   */
  logPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    this.info(`Performance: ${operation}`, {
      operation,
      duration,
      ...metadata,
    });
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    options: {
      context?: string;
      metadata?: Record<string, any>;
      error?: Error;
    } = {}
  ): void {
    if (level > this.config.level) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: options.context || this.config.context,
      service: this.config.service,
      traceId: this.traceId || undefined,
      metadata: options.metadata,
      error: options.error,
    };

    this.writeLog(logEntry);
  }

  /**
   * Write log entry
   */
  private writeLog(entry: LogEntry): void {
    if (this.config.enableConsole) {
      this.writeToConsole(entry);
    }

    if (this.config.enableFile && this.config.filePath) {
      this.writeToFile(entry);
    }
  }

  /**
   * Write to console
   */
  private writeToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const level = getLogLevelName(entry.level);
    const context = entry.context ? `[${entry.context}]` : "";
    const service = entry.service ? `[${entry.service}]` : "";
    const traceId = entry.traceId ? `[${entry.traceId}]` : "";

    if (this.config.enableJson) {
      console.log(JSON.stringify(entry));
    } else {
      const prefix = `${timestamp} ${level} ${service}${context}${traceId}`;

      if (entry.error) {
        console.error(`${prefix} ${entry.message}`, entry.error);
      } else if (entry.metadata) {
        console.log(`${prefix} ${entry.message}`, entry.metadata);
      } else {
        console.log(`${prefix} ${entry.message}`);
      }
    }
  }

  /**
   * Write to file
   */
  private writeToFile(entry: LogEntry): void {
    // File logging implementation would go here
    // For now, we'll just log to console
    console.log(`[FILE] ${JSON.stringify(entry)}`);
  }

  /**
   * Create child logger with additional context
   */
  child(context: string): Logger {
    const childLogger = new Logger({
      ...this.config,
      context: this.config.context
        ? `${this.config.context}:${context}`
        : context,
    });

    if (this.traceId) {
      childLogger.setTraceId(this.traceId);
    }

    return childLogger;
  }

  /**
   * Update logger configuration
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

/**
 * Create logger instance
 */
export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config);
}

/**
 * Default logger instance
 */
export const defaultLogger = createLogger({
  level: parseLogLevel(process.env.LOG_LEVEL || "INFO"),
  service: process.env.SERVICE_NAME || "unknown-service",
  enableConsole: true,
  enableJson: process.env.LOG_FORMAT === "json",
});
