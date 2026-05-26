import 'server-only'

/**
 * Environment variables configuration with validation
 * Ensures all required environment variables are set
 */

interface EnvironmentConfig {
    // App settings
    NODE_ENV: 'development' | 'production' | 'test'
    APP_NAME: string
    APP_VERSION: string

    // API Configuration
    SERVER_URL: string
    BACKEND_API_URL: string
    INTERNAL_API_SECRET: string
    API_ENCRYPTION_KEY: string

    // Authentication
    AUTH_SECRET: string
    NEXTAUTH_URL: string

    // Optional OAuth
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string

    // Database
    DATABASE_URL?: string

    // Security
    JWT_SECRET: string

    // Optional services
    REDIS_URL?: string
    SENTRY_DSN?: string
}

function getEnvironmentVariable(name: string, defaultValue?: string): string {
    const value = process.env[name] || defaultValue

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

function getOptionalEnvironmentVariable(name: string): string | undefined {
    return process.env[name]
}

function validateEnvironmentVariables(): EnvironmentConfig {
    return {
        // Required variables
        NODE_ENV: getEnvironmentVariable('NODE_ENV', 'development') as 'development' | 'production' | 'test',
        APP_NAME: getEnvironmentVariable('NEXT_PUBLIC_APP_NAME', 'MKT Next'),
        APP_VERSION: getEnvironmentVariable('NEXT_PUBLIC_APP_VERSION', '1.0.0'),

        SERVER_URL: getEnvironmentVariable('NEXT_PUBLIC_SERVER_URL'),
        BACKEND_API_URL: getEnvironmentVariable('BACKEND_API_URL'),
        INTERNAL_API_SECRET: getEnvironmentVariable('INTERNAL_API_SECRET'),
        API_ENCRYPTION_KEY: getEnvironmentVariable('API_ENCRYPTION_KEY'),

        AUTH_SECRET: getEnvironmentVariable('AUTH_SECRET'),
        NEXTAUTH_URL: getEnvironmentVariable('NEXTAUTH_URL', 'http://localhost:3000'),

        JWT_SECRET: getEnvironmentVariable('JWT_SECRET'),

        // Optional variables
        GITHUB_CLIENT_ID: getOptionalEnvironmentVariable('GITHUB_AUTH_CLIENT_ID'),
        GITHUB_CLIENT_SECRET: getOptionalEnvironmentVariable('GITHUB_AUTH_CLIENT_SECRET'),
        GOOGLE_CLIENT_ID: getOptionalEnvironmentVariable('GOOGLE_AUTH_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET: getOptionalEnvironmentVariable('GOOGLE_AUTH_CLIENT_SECRET'),

        DATABASE_URL: getOptionalEnvironmentVariable('DATABASE_URL'),
        REDIS_URL: getOptionalEnvironmentVariable('REDIS_URL'),
        SENTRY_DSN: getOptionalEnvironmentVariable('SENTRY_DSN'),
    }
}

// Only validate on the server. Server-side env vars (no NEXT_PUBLIC_ prefix) are
// undefined on the client — importing this file from a Client Component will crash.
// Use the `server-only` package or keep imports inside server actions / API routes.
const env: EnvironmentConfig =
    typeof window === 'undefined'
        ? validateEnvironmentVariables()
        : ({} as EnvironmentConfig)

export default env
export type { EnvironmentConfig }
