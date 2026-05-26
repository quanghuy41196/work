import 'server-only'
import crypto from 'crypto'
import { promisify } from 'util'
import { logger } from '@/utils/logger'
import { getRedisClient } from '@/lib/redis'

const scryptAsync = promisify(crypto.scrypt)

// Fail hard at startup if required secrets are missing — never silently use
// a hardcoded fallback key that would be the same across all deployments.
const SECRET_KEY = process.env.API_ENCRYPTION_KEY
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET

if (!SECRET_KEY) {
    throw new Error('API_ENCRYPTION_KEY environment variable is required')
}
if (!INTERNAL_SECRET) {
    throw new Error('INTERNAL_API_SECRET environment variable is required')
}

// Derives a 32-byte AES key from SECRET_KEY using a random per-call salt (stored with ciphertext).
function deriveKey(salt: Buffer): Buffer {
    return crypto.scryptSync(SECRET_KEY as string, salt, 32)
}

// ── ENDPOINT ENCRYPTION ────────────────────────────────────────────────────────

/**
 * Encrypts an endpoint string using AES-256-GCM.
 * Returns null on failure so callers can decide whether to abort or fall back.
 * Never silently returns the plaintext endpoint — that would expose the URL.
 * Output format: saltHex:ivHex:tagHex:ciphertextHex
 */
export function encryptEndpoint(endpoint: string): string | null {
    try {
        const salt = crypto.randomBytes(16)
        const iv = crypto.randomBytes(12) // 96-bit IV recommended for GCM
        const key = deriveKey(salt)
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
        let encrypted = cipher.update(endpoint, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const tag = cipher.getAuthTag()
        return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`
    } catch (error) {
        logger.error('Encryption failed', { error: error instanceof Error ? error.message : String(error) }, 'apiSecurity')
        return null
    }
}

/**
 * Decrypts an endpoint string.
 * Returns null on failure so callers can throw an appropriate error.
 * Never silently returns the ciphertext — that would produce a garbage URL.
 * Expects format: saltHex:ivHex:tagHex:ciphertextHex
 */
export function decryptEndpoint(encryptedEndpoint: string): string | null {
    try {
        const parts = encryptedEndpoint.split(':')
        if (parts.length !== 4) {
            throw new Error('Invalid encrypted endpoint format')
        }
        const [saltHex, ivHex, tagHex, encrypted] = parts
        const salt = Buffer.from(saltHex, 'hex')
        const iv = Buffer.from(ivHex, 'hex')
        const tag = Buffer.from(tagHex, 'hex')
        const key = deriveKey(salt)
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
        decipher.setAuthTag(tag)
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch (error) {
        logger.error('Decryption failed', { error: error instanceof Error ? error.message : String(error) }, 'apiSecurity')
        return null
    }
}

// ── INTERNAL API TOKEN ─────────────────────────────────────────────────────────

/**
 * Generates a short-lived HMAC token for internal API calls.
 * Format: timestamp:nonce:hmac — valid for 5 minutes.
 */
export function generateSecureToken(): string {
    const timestamp = Date.now().toString()
    const nonce = crypto.randomBytes(16).toString('hex')
    const hmac = crypto
        .createHmac('sha256', INTERNAL_SECRET as string)
        .update(`${timestamp}:${nonce}`)
        .digest('hex')
    return `${timestamp}:${nonce}:${hmac}`
}

/**
 * Verifies an internal API token. Returns false if tampered with or older than 5 minutes.
 */
export function verifySecureToken(token: string): boolean {
    try {
        const parts = token.split(':')
        if (parts.length !== 3) return false
        const [timestamp, nonce, providedHmac] = parts

        const expectedHmac = crypto
            .createHmac('sha256', INTERNAL_SECRET as string)
            .update(`${timestamp}:${nonce}`)
            .digest('hex')

        const tokenAge = Date.now() - parseInt(timestamp, 10)
        const isExpired = tokenAge > 5 * 60 * 1000

        // Use timingSafeEqual to prevent timing attacks
        const a = Buffer.from(expectedHmac, 'hex')
        const b = Buffer.from(providedHmac, 'hex')
        const isValid = a.length === b.length && crypto.timingSafeEqual(a, b)

        return isValid && !isExpired
    } catch {
        return false
    }
}

// ── PASSWORD HASHING ───────────────────────────────────────────────────────────
// Uses Node.js native scrypt — same hardness class as bcrypt, no extra dependency.
// Alternative: npm install bcryptjs @types/bcryptjs and use bcrypt.hash / bcrypt.compare.

/**
 * Hashes a password for storage. Use in sign-up and password-reset flows.
 * Output format: saltHex:derivedHex (safe to store in DB as a single column).
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex')
    const derived = (await scryptAsync(password, salt, 64)) as Buffer
    return `${salt}:${derived.toString('hex')}`
}

/**
 * Verifies a password against a stored hash produced by hashPassword().
 * Uses timing-safe comparison to prevent timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
        const [salt, hashed] = storedHash.split(':')
        const derived = (await scryptAsync(password, salt, 64)) as Buffer
        const expected = Buffer.from(hashed, 'hex')
        return derived.length === expected.length && crypto.timingSafeEqual(derived, expected)
    } catch {
        return false
    }
}

// ── RESET TOKEN BLACKLIST ──────────────────────────────────────────────────────
// Consumed token nonces are stored to prevent replay attacks.
// Redis (via REDIS_URL) is used when available; falls back to in-memory which is
// per-process only and resets on restart — not suitable for multi-instance production.

interface BlacklistEntry { expiresAt: number }
const usedResetNonces = new Map<string, BlacklistEntry>()

const pruneTimer = setInterval(() => {
    const now = Date.now()
    for (const [nonce, entry] of usedResetNonces) {
        if (entry.expiresAt < now) usedResetNonces.delete(nonce)
    }
}, 10 * 60_000)
// Avoid keeping the process alive in non-serverless environments
if (pruneTimer.unref) pruneTimer.unref()

async function isNonceBlacklisted(nonce: string): Promise<boolean> {
    const redis = await getRedisClient()
    if (redis) {
        return (await redis.exists(`reset-nonce:${nonce}`)) > 0
    }
    const entry = usedResetNonces.get(nonce)
    return !!entry && entry.expiresAt > Date.now()
}

async function blacklistNonce(nonce: string, ttlSeconds: number): Promise<boolean> {
    const redis = await getRedisClient()
    if (redis) {
        // NX ensures atomicity — only sets if key does not already exist
        const result = await redis.set(`reset-nonce:${nonce}`, '1', 'EX', ttlSeconds, 'NX')
        return result === 'OK'
    }
    if (usedResetNonces.has(nonce)) return false
    usedResetNonces.set(nonce, { expiresAt: Date.now() + ttlSeconds * 1000 })
    return true
}

// ── RESET TOKEN ────────────────────────────────────────────────────────────────

export interface ResetTokenPayload {
    expiry: number
    nonce: string
    userId: string
    email: string
}

/**
 * Generates a signed password-reset token embedding userId and email.
 * Format: base64url(JSON payload).hmacHex
 * Default TTL: 60 minutes.
 */
export function generateResetToken(userId: string, email: string, ttlMinutes = 60): string {
    const payload: ResetTokenPayload = {
        expiry: Date.now() + ttlMinutes * 60_000,
        nonce: crypto.randomBytes(16).toString('hex'),
        userId,
        email,
    }
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const hmac = crypto
        .createHmac('sha256', INTERNAL_SECRET as string)
        .update(`reset:${payloadB64}`)
        .digest('hex')
    return `${payloadB64}.${hmac}`
}

/**
 * Verifies a reset token's signature and expiry.
 * Returns the decoded payload (including userId and email) on success, or null if
 * the token is invalid, expired, or already consumed.
 * Does NOT consume the token — call consumeResetToken() after a successful DB update.
 */
export async function verifyResetToken(token: string): Promise<ResetTokenPayload | null> {
    try {
        const dot = token.lastIndexOf('.')
        if (dot === -1) return null
        const payloadB64 = token.slice(0, dot)
        const providedHmac = token.slice(dot + 1)

        const expectedHmac = crypto
            .createHmac('sha256', INTERNAL_SECRET as string)
            .update(`reset:${payloadB64}`)
            .digest('hex')

        const a = Buffer.from(expectedHmac, 'hex')
        const b = Buffer.from(providedHmac, 'hex')
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

        const payload: ResetTokenPayload = JSON.parse(
            Buffer.from(payloadB64, 'base64url').toString('utf8')
        )

        if (Date.now() > payload.expiry) return null
        if (await isNonceBlacklisted(payload.nonce)) return null

        return payload
    } catch {
        return null
    }
}

/**
 * Invalidates a reset token so it cannot be replayed.
 * Call this AFTER a successful DB password update — never before.
 * Calling before the DB update would burn the token on a DB failure,
 * forcing the user to request a new reset link.
 * Returns false if the token is already consumed or expired.
 */
export async function consumeResetToken(token: string): Promise<boolean> {
    try {
        const dot = token.lastIndexOf('.')
        if (dot === -1) return false
        const payload: ResetTokenPayload = JSON.parse(
            Buffer.from(token.slice(0, dot), 'base64url').toString('utf8')
        )
        const ttlSeconds = Math.ceil((payload.expiry - Date.now()) / 1000)
        if (ttlSeconds <= 0) return false
        return blacklistNonce(payload.nonce, ttlSeconds)
    } catch {
        return false
    }
}

export function obfuscateApiKey(apiKey: string): string {
    if (!apiKey) return ''
    const visible = apiKey.slice(0, 4)
    const hidden = '*'.repeat(Math.max(0, apiKey.length - 8))
    const ending = apiKey.slice(-4)
    return `${visible}${hidden}${ending}`
}
