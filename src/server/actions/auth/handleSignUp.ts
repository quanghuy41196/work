'use server'

import type { SignUpCredential } from '@/@types/auth'

// TODO: replace with a real API call:
//   const res = await fetch('/api/auth/sign-up', { method: 'POST', body: JSON.stringify({...}) })
//   if (!res.ok) throw new Error(await res.text())
//   return res.json()
export const onSignUpWithCredentials = async ({
    email,
    firstName,
    lastName,
}: SignUpCredential) => {
    /** Stub — not yet wired to the backend */
    return {
        email,
        userName: `${firstName} ${lastName}`,
        id: firstName,
    }
}
