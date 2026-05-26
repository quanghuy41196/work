'use server'
import type { SignInCredential } from '@/@types/auth'
import sleep from '@/utils/sleep'

// Replace this function body with a real backend API call in production.
const validateCredential = async (values: SignInCredential) => {
    const { email, password } = values

    await sleep(80)

    if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_DEV_AUTH !== 'true') {
        return null
    }

    // Dev-only: both email AND password must match env vars.
    // Set NEXT_PUBLIC_ACCOUNT_DEFAULT and DEV_ACCOUNT_PASSWORD in .env.local.
    const devEmail = process.env.NEXT_PUBLIC_ACCOUNT_DEFAULT
    const devPassword = process.env.DEV_ACCOUNT_PASSWORD

    if (!devEmail || !devPassword) return null
    if (email !== devEmail || password !== devPassword) return null

    return {
        id: '1',
        userName: 'Admin',
        email,
        authority: ['Admin'],
        accountUserName: 'admin',
    }
}

export default validateCredential
