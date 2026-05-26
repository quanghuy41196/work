import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/utils/apiSecurity'
import { logger } from '@/utils/logger'

const signUpSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = signUpSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 },
            )
        }

        const { email, password, firstName, lastName } = result.data

        // ── Step 1: Hash the password ──────────────────────────────────────────
        const passwordHash = await hashPassword(password)

        // ── Step 2: Insert user into DB ────────────────────────────────────────
        // Replace this stub with your ORM/driver.
        // Return 409 if the email is already registered (unique constraint).
        //
        //   const user = await db.users.create({
        //       data: { email, passwordHash, firstName, lastName, emailVerified: false }
        //   })
        //   if (!user) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
        //
        logger.debug(
            'DB stub: user registration',
            { email, firstName, lastName, hashLen: passwordHash.length },
            'auth/sign-up',
        )

        // ── Step 3: Send email verification ───────────────────────────────────
        // Replace with your email provider (Resend, SendGrid, Nodemailer, etc.)
        // generateResetToken can double as an email-verify token with a longer TTL:
        //
        //   import { generateResetToken } from '@/utils/apiSecurity'
        //   const verifyToken = generateResetToken(user.id, email, 24 * 60) // 24 h
        //   await sendEmail({ to: email, subject: 'Verify your account', token: verifyToken })
        //

        logger.authEvent('sign-up attempted', email)

        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error(
            'Sign-up error',
            { error: error instanceof Error ? error.message : String(error) },
            'auth/sign-up',
        )
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
