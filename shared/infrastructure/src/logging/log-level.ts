/**
 * Log Levels
 * 
 * Standardized log levels for all services.
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

/**
 * Log Level Names
 */
export const LogLevelNames = {
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.VERBOSE]: 'VERBOSE',
} as const;

/**
 * Get log level name
 */
export function getLogLevelName(level: LogLevel): string {
  return LogLevelNames[level] || 'UNKNOWN';
}

/**
 * Parse log level from string
 */
export function parseLogLevel(level: string): LogLevel {
  const upperLevel = level.toUpperCase();
  
  switch (upperLevel) {
    case 'ERROR':
      return LogLevel.ERROR;
    case 'WARN':
    case 'WARNING':
      return LogLevel.WARN;
    case 'INFO':
      return LogLevel.INFO;
    case 'DEBUG':
      return LogLevel.DEBUG;
    case 'VERBOSE':
      return LogLevel.VERBOSE;
    default:
      return LogLevel.INFO;
  }
}
