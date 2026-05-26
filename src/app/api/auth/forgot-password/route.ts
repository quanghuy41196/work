import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/utils/logger'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = forgotPasswordSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 },
            )
        }

        // TODO: wire to DB and email provider:
        //   const user = await db.users.findUnique({ where: { email: result.data.email } })
        //   if (user) {
        //     const token = generateResetToken(user.id, user.email)  // ttlMinutes defaults to 60
        //     await sendEmail({ to: user.email, subject: 'Reset your password', token })
        //   }
        //   // Always fall through to the success response to prevent email enumeration.
        logger.authEvent('forgot-password requested', result.data.email)

        // Always return success to prevent email enumeration
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Forgot-password error', { error: error instanceof Error ? error.message : String(error) }, 'auth/forgot-password')
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
