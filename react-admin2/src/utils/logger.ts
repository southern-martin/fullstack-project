// Enterprise-grade logging system

import { config } from "../config";
import { ILogger } from "../interfaces";

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
}

// Console logger implementation
class ConsoleLogger implements ILogger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.logLevel = this.getLogLevel();
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  private getLogLevel(): LogLevel {
    const level = config.get("logging.level", "info");
    switch (level.toLowerCase()) {
      case "debug":
        return LogLevel.DEBUG;
      case "info":
        return LogLevel.INFO;
      case "warn":
        return LogLevel.WARN;
      case "error":
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = LogLevel[entry.level];
    const meta = entry.meta ? ` ${JSON.stringify(entry.meta)}` : "";
    const error = entry.error ? ` Error: ${entry.error.message}` : "";

    return `[${timestamp}] ${level}: ${entry.message}${meta}${error}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    meta?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      error,
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      requestId: this.getCurrentRequestId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    // Get from auth context or localStorage
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).id : undefined;
    } catch {
      return undefined;
    }
  }

  private getCurrentSessionId(): string | undefined {
    // Get from session storage or generate
    try {
      return sessionStorage.getItem("sessionId") || undefined;
    } catch {
      return undefined;
    }
  }

  private getCurrentRequestId(): string | undefined {
    // Get from request context or generate
    return (window as any).__REQUEST_ID__;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formattedMessage = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        if (entry.error) {
          console.error(entry.error.stack);
        }
        break;
    }

    // Send to remote logging service in production
    if (!this.isDevelopment) {
      this.sendToRemoteLogger(entry);
    }
  }

  private async sendToRemoteLogger(entry: LogEntry): Promise<void> {
    try {
      const loggingEndpoint = config.get("logging.endpoint");
      if (!loggingEndpoint) return;

      await fetch(loggingEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Don't log logging errors to avoid infinite loops
      console.error("Failed to send log to remote service:", error);
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log(this.createLogEntry(LogLevel.DEBUG, message, meta));
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log(this.createLogEntry(LogLevel.INFO, message, meta));
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log(this.createLogEntry(LogLevel.WARN, message, meta));
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    this.log(this.createLogEntry(LogLevel.ERROR, message, meta, error));
  }
}

// Remote logger implementation
class RemoteLogger implements ILogger {
  private endpoint: string;
  private batchSize: number;
  private flushInterval: number;
  private logQueue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.endpoint = config.get("logging.endpoint", "/api/logs");
    this.batchSize = config.get("logging.batchSize", 10);
    this.flushInterval = config.get("logging.flushInterval", 5000);
    this.startFlushTimer();
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const logs = this.logQueue.splice(0, this.batchSize);

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      // Re-queue logs on failure
      this.logQueue.unshift(...logs);
      console.error("Failed to send logs to remote service:", error);
    }
  }

  private addToQueue(entry: LogEntry): void {
    this.logQueue.push(entry);

    if (this.logQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.addToQueue({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      meta,
    });
  }

  info(message: string, meta?: Record<string, any>): void {
    this.addToQueue({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      meta,
    });
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.addToQueue({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      meta,
    });
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    this.addToQueue({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      meta,
      error: error
        ? ({
            name: error.name,
            message: error.message,
            stack: error.stack,
          } as any)
        : undefined,
    });
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

// Composite logger that combines console and remote logging
class CompositeLogger implements ILogger {
  private consoleLogger: ConsoleLogger;
  private remoteLogger: RemoteLogger;

  constructor() {
    this.consoleLogger = new ConsoleLogger();
    this.remoteLogger = new RemoteLogger();
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.consoleLogger.debug(message, meta);
    this.remoteLogger.debug(message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.consoleLogger.info(message, meta);
    this.remoteLogger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.consoleLogger.warn(message, meta);
    this.remoteLogger.warn(message, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    this.consoleLogger.error(message, error, meta);
    this.remoteLogger.error(message, error, meta);
  }

  destroy(): void {
    this.remoteLogger.destroy();
  }
}

// Create logger instance
const logger = new CompositeLogger();

// Performance monitoring utilities
export const performanceLogger = {
  startTimer: (name: string): (() => void) => {
    const startTime = performance.now();
    logger.debug(`Performance timer started: ${name}`);

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.info(`Performance timer ended: ${name}`, {
        duration: `${duration.toFixed(2)}ms`,
      });
    };
  },

  measure: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const endTimer = performanceLogger.startTimer(name);
    try {
      const result = await fn();
      return result;
    } finally {
      endTimer();
    }
  },

  measureSync: <T>(name: string, fn: () => T): T => {
    const endTimer = performanceLogger.startTimer(name);
    try {
      const result = fn();
      return result;
    } finally {
      endTimer();
    }
  },
};

// Error boundary logger
export const errorLogger = {
  logError: (error: Error, errorInfo?: any): void => {
    logger.error("React Error Boundary caught an error", error, {
      componentStack: errorInfo?.componentStack,
      errorBoundary: errorInfo?.errorBoundary,
    });
  },

  logUnhandledRejection: (event: PromiseRejectionEvent): void => {
    logger.error("Unhandled promise rejection", event.reason, {
      type: "unhandledRejection",
    });
  },

  logUncaughtError: (event: ErrorEvent): void => {
    logger.error("Uncaught error", new Error(event.message), {
      type: "uncaughtError",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  },
};

// Initialize global error handlers
if (typeof window !== "undefined") {
  window.addEventListener(
    "unhandledrejection",
    errorLogger.logUnhandledRejection
  );
  window.addEventListener("error", errorLogger.logUncaughtError);
}

// Export logger and utilities
export { logger };
export type { LogEntry };
export default logger;
