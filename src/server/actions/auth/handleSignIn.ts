'use server'

import type { SignInCredential } from '@/@types/auth'
import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'

export const onSignInWithCredentials = async (
    { email, password }: SignInCredential,
    callbackUrl?: string,
) => {
    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || appConfig.authenticatedEntryPath,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            // NextAuth v5: error.type is already a string — no double nesting needed
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials!' }
                default:
                    return { error: 'Something went wrong!' }
            }
        }
        throw error
    }
}
