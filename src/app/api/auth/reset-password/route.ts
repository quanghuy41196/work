import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyResetToken, consumeResetToken, hashPassword } from '@/utils/apiSecurity'
import { logger } from '@/utils/logger'

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = resetPasswordSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 },
            )
        }

        const { token, password } = result.data

        // Verify HMAC signature, expiry, and replay blacklist.
        // Returns the decoded payload (userId, email) on success.
        const payload = await verifyResetToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 },
            )
        }

        const { userId } = payload

        // ── Step 1: Hash the new password ─────────────────────────────────────
        const passwordHash = await hashPassword(password)

        // ── Step 2: Persist to DB ─────────────────────────────────────────────
        // Replace this stub with your ORM/driver. The update must succeed before
        // consumeResetToken() is called — if the DB throws, the catch block below
        // returns 500 and the token remains valid so the user can retry.
        //
        //   await db.users.update({ where: { id: userId }, data: { passwordHash } })
        //
        logger.debug('DB stub: password hash ready', { userId, hashLen: passwordHash.length }, 'auth/reset-password')

        // ── Step 3: Invalidate the token AFTER DB success ──────────────────────
        // Consuming before the DB update would permanently burn the token on a
        // DB failure, forcing the user to request a new reset link.
        await consumeResetToken(token)

        logger.authEvent('password reset completed', userId)

        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error(
            'Reset-password error',
            { error: error instanceof Error ? error.message : String(error) },
            'auth/reset-password',
        )
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
