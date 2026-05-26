import { logger } from '@/utils/logger'
import 'server-only'

// Minimal interface covering every Redis command used in this project.
// Satisfied by ioredis.Redis when available; callers fall back to in-memory stores otherwise.
export interface RedisClient {
    ping(): Promise<string>
    get(key: string): Promise<string | null>
    set(key: string, value: string, ...args: Array<string | number>): Promise<string | null>
    exists(...keys: string[]): Promise<number>
    incr(key: string): Promise<number>
    pexpire(key: string, milliseconds: number): Promise<number>
    on(event: 'error', listener: (err: Error) => void): this
}

// undefined = never attempted; null = unavailable (cached failure or no REDIS_URL)
let _client: RedisClient | null | undefined = undefined

/**
 * Returns the lazily-initialized Redis client, or null when Redis is unavailable.
 *
 * Requires ioredis: npm install ioredis
 * Set REDIS_URL in your environment to enable Redis.
 * Without REDIS_URL every call returns null — callers use in-memory fallbacks
 * that are per-process only and reset on restart (not suitable for multi-instance production).
 */
export async function getRedisClient(): Promise<RedisClient | null> {
    if (!process.env.REDIS_URL) return null
    if (_client !== undefined) return _client

    try {
        // Dynamic import keeps ioredis optional — if not installed the catch handles it gracefully.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { default: IoRedis } = await import('ioredis') as unknown as { default: new (...args: any[]) => unknown }
        const redis = new IoRedis(process.env.REDIS_URL, { maxRetriesPerRequest: 2 }) as RedisClient
        redis.on('error', (err: Error) => {
            logger.error('Redis connection error', { message: err.message }, 'redis')
        })
        await redis.ping()
        _client = redis
        logger.info('Redis connected', undefined, 'redis')
    } catch (err) {
        logger.warn(
            'Redis unavailable — in-memory fallback active (not suitable for multi-instance production)',
            { error: err instanceof Error ? err.message : String(err) },
            'redis',
        )
        _client = null
    }

    return _client
}
