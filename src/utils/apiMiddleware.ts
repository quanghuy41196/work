import { NextRequest, NextResponse } from 'next/server'
import { verifySecureToken } from '@/utils/apiSecurity'
import { logger } from '@/utils/logger'
import { getRedisClient } from '@/lib/redis'

export interface SecureApiRequest extends NextRequest {
    isVerified?: boolean
    clientId?: string
}

// ── CORS ──────────────────────────────────────────────────────────────────────

function getAllowedOrigins(): string[] {
    const fromEnv = process.env.CORS_ALLOWED_ORIGINS
    if (fromEnv) {
        return fromEnv.split(',').map((o) => o.trim()).filter(Boolean)
    }
    if (process.env.NODE_ENV !== 'development') {
        logger.warn(
            'CORS_ALLOWED_ORIGINS is not set — falling back to localhost. Set this in production.',
            undefined,
            'apiMiddleware',
        )
    }
    return ['http://localhost:3000', 'http://127.0.0.1:3000']
}

// ── RATE LIMITER ──────────────────────────────────────────────────────────────
// Redis fixed-window when REDIS_URL is set; in-memory sliding window otherwise.
// In-memory: single-process, resets on restart. Use Redis for multi-instance production.

interface RateLimitEntry {
    count: number
    windowStart: number
}

/**
 * Creates an isolated rate limiter with configurable window and limit.
 * Returns an async check function — Redis I/O is async; the in-memory path is synchronous
 * internally but wrapped in a promise for a uniform interface.
 */
export function createRateLimiter(windowMs: number, maxRequests: number) {
    const store = new Map<string, RateLimitEntry>()

    // Prune stale in-memory entries to prevent unbounded growth
    const pruneInterval = setInterval(() => {
        const cutoff = Date.now() - windowMs
        for (const [ip, entry] of store) {
            if (entry.windowStart < cutoff) store.delete(ip)
        }
    }, Math.max(windowMs, 60_000))

    if (pruneInterval.unref) pruneInterval.unref()

    return async function check(ip: string): Promise<boolean> {
        const redis = await getRedisClient()

        if (redis) {
            // Fixed-window via INCR + PEXPIRE — atomic per-key counter in Redis
            const window = Math.floor(Date.now() / windowMs)
            const key = `rl:${windowMs}:${ip}:${window}`
            const count = await redis.incr(key)
            if (count === 1) await redis.pexpire(key, windowMs)
            if (count > maxRequests) {
                logger.securityEvent('Rate limit exceeded', ip)
                return false
            }
            return true
        }

        // In-memory sliding window fallback
        const now = Date.now()
        const entry = store.get(ip)

        if (!entry || now - entry.windowStart > windowMs) {
            store.set(ip, { count: 1, windowStart: now })
            return true
        }

        entry.count += 1
        if (entry.count > maxRequests) {
            logger.securityEvent('Rate limit exceeded', ip)
            return false
        }
        return true
    }
}

// Default limiter used by withApiSecurity (60 req/min per IP)
const checkRateLimit = createRateLimiter(60_000, 60)

// ── BOT DETECTION ─────────────────────────────────────────────────────────────
// UA-based checks are easily spoofed; treat as a lightweight first filter only.

const BOT_UA_PATTERNS = [
    'bot', 'crawler', 'spider', 'slurp', 'facebookexternalhit',
    'ia_archiver', 'bingpreview',
]

// ── MIDDLEWARE FACTORIES ───────────────────────────────────────────────────────

export function withApiSecurity(
    handler: (req: SecureApiRequest) => Promise<NextResponse> | NextResponse,
) {
    return async (req: SecureApiRequest): Promise<NextResponse> => {
        const allowedOrigins = getAllowedOrigins()
        const origin = req.headers.get('origin')

        // ── CORS preflight ─────────────────────────────────────────────────────
        // Browsers send OPTIONS before cross-origin POST/PUT/DELETE requests.
        // Without a proper 204 response the actual request is never sent.
        if (req.method === 'OPTIONS') {
            if (!origin || !allowedOrigins.includes(origin)) {
                return new NextResponse(null, { status: 403 })
            }
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Secure-Token',
                    'Access-Control-Max-Age': '86400',
                    'Vary': 'Origin',
                },
            })
        }

        if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
        }

        const clientIp =
            req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            req.headers.get('x-real-ip') ||
            'unknown'
        req.clientId = clientIp

        // Rate limit
        if (!(await checkRateLimit(clientIp))) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429, headers: { 'Retry-After': '60' } },
            )
        }

        // CORS — reject non-preflight requests from unlisted origins
        if (origin && !allowedOrigins.includes(origin)) {
            logger.securityEvent('CORS origin rejected', clientIp, origin)
            return NextResponse.json({ error: 'CORS: Origin not allowed' }, { status: 403 })
        }

        // Secure token (optional — only verified when header is present)
        const secureToken = req.headers.get('x-secure-token')
        if (secureToken) {
            if (!verifySecureToken(secureToken)) {
                return NextResponse.json(
                    { error: 'Invalid or expired security token' },
                    { status: 401 },
                )
            }
            req.isVerified = true
        }

        try {
            const response = await handler(req)

            // Security headers
            response.headers.set('X-Content-Type-Options', 'nosniff')
            response.headers.set('X-Frame-Options', 'DENY')
            response.headers.set('X-XSS-Protection', '1; mode=block')
            response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

            // Reflect allowed origin so browsers accept the response
            if (origin && allowedOrigins.includes(origin)) {
                response.headers.set('Access-Control-Allow-Origin', origin)
                response.headers.set('Vary', 'Origin')
            }

            return response
        } catch (error) {
            logger.error(
                'Unhandled API error',
                { error: error instanceof Error ? error.message : String(error) },
                'apiMiddleware',
            )
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }
    }
}

/**
 * Lightweight rate-limiting wrapper for the backend proxy.
 * Does NOT check CORS or secure tokens — those are handled by Next.js middleware
 * and the authenticated session. Does NOT read req.body so the stream stays intact
 * for forwarding to the backend.
 *
 * Higher limit than the API routes (300 req/min) because each page may fire
 * several parallel requests.
 */
const checkProxyRateLimit = createRateLimiter(60_000, 300)

export function withProxyRateLimit(
    handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const clientIp =
            req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            req.headers.get('x-real-ip') ||
            'unknown'

        if (!(await checkProxyRateLimit(clientIp))) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429, headers: { 'Retry-After': '60' } },
            )
        }

        return handler(req)
    }
}

export function withHighSecurity(
    handler: (req: SecureApiRequest) => Promise<NextResponse> | NextResponse,
) {
    return withApiSecurity(async (req: SecureApiRequest) => {
        if (!req.isVerified) {
            return NextResponse.json({ error: 'Security token required' }, { status: 401 })
        }

        const userAgent = (req.headers.get('user-agent') ?? '').toLowerCase()
        const isBot = !userAgent || BOT_UA_PATTERNS.some((p) => userAgent.includes(p))
        if (isBot) {
            logger.securityEvent('Bot UA blocked', req.clientId, userAgent)
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        return handler(req)
    })
}
