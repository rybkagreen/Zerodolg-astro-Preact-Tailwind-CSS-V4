// Modern logging system with 2029 best practices

// Global type declarations
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Log levels for structured logging
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Logger configuration interface
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableAnalytics: boolean;
  appName: string;
}

/**
 * Log entry interface for structured logging
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Modern logger class with structured logging and analytics integration
 */
class Logger {
  private config: LoggerConfig;
  private readonly isDevelopment: boolean;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.isDevelopment = process.env['NODE_ENV'] === 'development';

    this.config = {
      level: this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
      enableConsole: true,
      enableAnalytics: this.isDevelopment ? false : true,
      appName: 'zerodolg-astro',
      ...config,
    };
  }

  /**
   * Check if logging is enabled for the given level
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  /**
   * Create structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context !== undefined) {
      logEntry.context = context;
    }

    if (error !== undefined) {
      logEntry.error = error;
    }

    return logEntry;
  }

  /**
   * Output to console with appropriate styling
   */
  private outputToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const styles = {
      [LogLevel.DEBUG]: 'color: #666; background: #f0f0f0',
      [LogLevel.INFO]: 'color: #007acc; background: #e6f3ff',
      [LogLevel.WARN]: 'color: #ff9800; background: #fff3e0',
      [LogLevel.ERROR]: 'color: #f44336; background: #ffebee',
    };

    const levelNames = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
    };

    const style = styles[entry.level as keyof typeof styles] || '';
    const levelName = levelNames[entry.level as keyof typeof levelNames] || 'UNKNOWN';

    console.log(
      `%c[${this.config.appName}] %c${levelName}%c ${entry.message}`,
      'color: #888; font-weight: bold',
      `${style}; padding: 2px 6px; border-radius: 3px; font-weight: bold`,
      'color: inherit',
      entry.context || '',
      entry.error || ''
    );
  }

  /**
   * Send to analytics service
   */
  private sendToAnalytics(entry: LogEntry): void {
    if (!this.config.enableAnalytics) return;

    // Integration with analytics services
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'log', {
        event_category: 'application',
        event_label: entry.message,
        level: LogLevel[entry.level],
        ...entry.context,
      });
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.outputToConsole(entry);
    this.sendToAnalytics(entry);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.outputToConsole(entry);
    this.sendToAnalytics(entry);
  }

  /**
   * Warn level logging
   */
  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const entry = this.createLogEntry(LogLevel.WARN, message, context, error);
    this.outputToConsole(entry);
    this.sendToAnalytics(entry);
  }

  /**
   * Error level logging
   */
  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.outputToConsole(entry);
    this.sendToAnalytics(entry);
  }

  /**
   * Update logger configuration
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create global logger instance
export const logger = new Logger();

// Development helper for quick debugging
export const devLog = {
  debug: (message: string, ...args: unknown[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.debug(`🔍 ${message}`, ...args);
    }
  },

  info: (message: string, ...args: unknown[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.info(`ℹ️ ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },

  error: (message: string, ...args: unknown[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.error(`❌ ${message}`, ...args);
    }
  },
};
