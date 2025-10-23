import { Injectable, LoggerService, Scope } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import * as winston from "winston";

/**
 * Context storage for request tracking
 */
export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

/**
 * Winston Logger Service
 * Provides structured JSON logging with correlation IDs and context
 */
@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;
  private context?: string;
  private serviceName: string;

  constructor() {
    this.serviceName = process.env.SERVICE_NAME || "unknown-service";

    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.errors({ stack: true }),
      winston.format.metadata({
        fillExcept: ["message", "level", "timestamp", "service"],
      }),
      winston.format.json()
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: logFormat,
      defaultMeta: {
        service: this.serviceName,
        environment: process.env.NODE_ENV || "development",
      },
      transports: [
        // JSON console transport for Promtail/Loki parsing
        new winston.transports.Console({
          format: winston.format.json(), // Output as JSON for structured logging
        }),
      ],
    });
  }

  /**
   * Set the logging context (e.g., class name)
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * Get correlation ID from async storage
   */
  private getCorrelationId(): string | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get("correlationId");
  }

  /**
   * Get user ID from async storage
   */
  private getUserId(): string | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get("userId");
  }

  /**
   * Get request path from async storage
   */
  private getRequestPath(): string | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get("requestPath");
  }

  /**
   * Build log metadata with context
   */
  private buildMetadata(meta?: any): any {
    const correlationId = this.getCorrelationId();
    const userId = this.getUserId();
    const requestPath = this.getRequestPath();

    return {
      ...(meta || {}),
      context: this.context,
      ...(correlationId && { correlationId }),
      ...(userId && { userId }),
      ...(requestPath && { requestPath }),
    };
  }

  /**
   * Log a message at the specified level
   */
  private logMessage(level: string, message: any, meta?: any) {
    const metadata = this.buildMetadata(meta);

    if (typeof message === "object") {
      this.logger.log(level, JSON.stringify(message), metadata);
    } else {
      this.logger.log(level, message, metadata);
    }
  }

  log(message: any, meta?: any, context?: string) {
    if (context) this.setContext(context);
    this.logMessage("info", message, meta);
  }

  error(message: any, trace?: string, context?: string) {
    if (context) this.setContext(context);
    this.logMessage("error", message, { trace });
  }

  warn(message: any, meta?: any, context?: string) {
    if (context) this.setContext(context);
    this.logMessage("warn", message, meta);
  }

  debug(message: any, meta?: any, context?: string) {
    if (context) this.setContext(context);
    this.logMessage("debug", message, meta);
  }

  verbose(message: any, meta?: any, context?: string) {
    if (context) this.setContext(context);
    this.logMessage("verbose", message, meta);
  }

  /**
   * Log HTTP request
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userId?: string
  ) {
    this.logMessage("info", "HTTP Request", {
      method,
      url,
      statusCode,
      responseTime,
      userId,
      type: "http_request",
    });
  }

  /**
   * Log database query
   */
  logQuery(query: string, parameters: any[], duration: number, error?: Error) {
    const level = error ? "error" : duration > 1000 ? "warn" : "debug";
    this.logMessage(level, "Database Query", {
      query,
      parameters,
      duration,
      error: error?.message,
      type: "database_query",
    });
  }

  /**
   * Log business event
   */
  logEvent(eventName: string, eventData: any, userId?: string) {
    this.logMessage("info", `Event: ${eventName}`, {
      eventName,
      eventData,
      userId,
      type: "business_event",
    });
  }

  /**
   * Log authentication event
   */
  logAuth(action: string, userId?: string, success?: boolean, metadata?: any) {
    const level = success === false ? "warn" : "info";
    this.logMessage(level, `Auth: ${action}`, {
      action,
      userId,
      success,
      ...metadata,
      type: "authentication",
    });
  }
}
