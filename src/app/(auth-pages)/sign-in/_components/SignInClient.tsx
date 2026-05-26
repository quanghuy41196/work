'use client'

import type {
    OnOauthSignInPayload,
    OnSignInPayload,
} from '@/components/auth/SignIn'
import SignIn from '@/components/auth/SignIn'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import handleOauthSignIn from '@/server/actions/auth/handleOauthSignIn'
import { onSignInWithCredentials } from '@/server/actions/auth/handleSignIn'
import { useSearchParams } from 'next/navigation'

const SignInClient = () => {
    const searchParams = useSearchParams()
    // Only accept internal paths to prevent open-redirect attacks.
    // Attacker could craft /sign-in?redirectUrl=https://evil.com otherwise.
    const raw = searchParams.get(REDIRECT_URL_KEY)
    const callbackUrl = raw?.startsWith('/') ? raw : undefined

    const handleSignIn = ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignInPayload) => {
        setSubmitting(true)

        onSignInWithCredentials(values, callbackUrl).then((data) => {
            if (data?.error) {
                // Only log errors in development mode
                if (process.env.NODE_ENV === 'development') {
                    console.error('Sign in error:', data.error)
                }
                setMessage(data.error as string)
                setSubmitting(false)
            }
        })
    }

    const handleOAuthSignIn = async ({ type }: OnOauthSignInPayload) => {
        if (type === 'google') {
            await handleOauthSignIn('google')
        }
        if (type === 'github') {
            await handleOauthSignIn('github')
        }
    }

    return <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />
}

export default SignInClient
