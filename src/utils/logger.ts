/**
 * Centralized logging utility
 * Provides structured logging with different levels
 */

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}

interface LogEntry {
    level: LogLevel
    message: string
    metadata?: Record<string, unknown>
    timestamp: string
    context?: string
}

class Logger {
    private static instance: Logger
    private isDevelopment: boolean

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development'
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    private createLogEntry(
        level: LogLevel,
        message: string,
        metadata?: Record<string, unknown>,
        context?: string,
    ): LogEntry {
        return {
            level,
            message,
            metadata,
            context,
            timestamp: new Date().toISOString(),
        }
    }

    private shouldLog(level: LogLevel): boolean {
        if (this.isDevelopment) return true

        // In production, only log warnings and errors
        return level === LogLevel.ERROR || level === LogLevel.WARN
    }

    private formatMessage(entry: LogEntry): string {
        const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`
        const context = entry.context ? ` [${entry.context}]` : ''
        const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : ''

        return `${prefix}${context}: ${entry.message}${metadata}`
    }

    public error(message: string, metadata?: Record<string, unknown>, context?: string): void {
        if (!this.shouldLog(LogLevel.ERROR)) return

        const entry = this.createLogEntry(LogLevel.ERROR, message, metadata, context)
        console.error(this.formatMessage(entry))

        // In production, send to error tracking service
        if (!this.isDevelopment && process.env.SENTRY_DSN) {
            // TODO: Send to Sentry or other error tracking service
        }
    }

    public warn(message: string, metadata?: Record<string, unknown>, context?: string): void {
        if (!this.shouldLog(LogLevel.WARN)) return

        const entry = this.createLogEntry(LogLevel.WARN, message, metadata, context)
        console.warn(this.formatMessage(entry))
    }

    public info(message: string, metadata?: Record<string, unknown>, context?: string): void {
        if (!this.shouldLog(LogLevel.INFO)) return

        const entry = this.createLogEntry(LogLevel.INFO, message, metadata, context)
        console.info(this.formatMessage(entry))
    }

    public debug(message: string, metadata?: Record<string, unknown>, context?: string): void {
        if (!this.shouldLog(LogLevel.DEBUG)) return

        const entry = this.createLogEntry(LogLevel.DEBUG, message, metadata, context)
        console.debug(this.formatMessage(entry))
    }

    // Specific methods for common use cases
    public apiCall(method: string, url: string, duration?: number): void {
        this.debug(`API Call: ${method.toUpperCase()} ${url}`, {
            method,
            url,
            duration,
        }, 'API')
    }

    public authEvent(event: string, userId?: string): void {
        this.info(`Auth event: ${event}`, {
            event,
            userId,
        }, 'AUTH')
    }

    public securityEvent(event: string, ip?: string, userAgent?: string): void {
        this.warn(`Security event: ${event}`, {
            event,
            ip,
            userAgent,
        }, 'SECURITY')
    }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Convenience functions
export const logError = (message: string, metadata?: Record<string, unknown>, context?: string) =>
    logger.error(message, metadata, context)

export const logWarn = (message: string, metadata?: Record<string, unknown>, context?: string) =>
    logger.warn(message, metadata, context)

export const logInfo = (message: string, metadata?: Record<string, unknown>, context?: string) =>
    logger.info(message, metadata, context)

export const logDebug = (message: string, metadata?: Record<string, unknown>, context?: string) =>
    logger.debug(message, metadata, context)
