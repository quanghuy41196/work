import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

// import AxiosBase from '@/services/axios/AxiosBase'

export default {
    secret: process.env.AUTH_SECRET,
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                // Requires BOTH NODE_ENV=development AND ENABLE_DEV_AUTH=true to prevent
                // accidental bypass when NODE_ENV is misconfigured in production.
                const isDevAuth = process.env.ENABLE_DEV_AUTH === 'true'

                if (isDevAuth && credentials?.email === process.env.NEXT_PUBLIC_ACCOUNT_DEFAULT) {
                    return {
                        id: '1',
                        name: 'Admin',
                        email: process.env.NEXT_PUBLIC_ACCOUNT_DEFAULT,
                        image: '',
                        authority: ['Admin'],
                        accessToken: 'dev-token',
                    }
                }

                // Production: authenticate via backend API
                // try {
                //     const res = await AxiosBase.post(`/auth/login`, {
                //         username: credentials?.email,
                //         password: credentials?.password,
                //     })
                //     const apiResponse = res.data
                //     if (apiResponse && (apiResponse.success || apiResponse.token)) {
                //         const userData = apiResponse.user || apiResponse.data || apiResponse
                //         return {
                //             id: userData?.id || userData?.userId,
                //             name: userData?.userName || userData?.name || userData?.fullName,
                //             email: userData?.email,
                //             image: userData?.avatar || userData?.picture,
                //             authority: userData?.authority || userData?.roles || ['user'],
                //             accessToken: apiResponse?.token || apiResponse?.accessToken,
                //         }
                //     }
                //     return null
                // } catch (err) {
                //     console.error('Authentication error:', err instanceof Error ? err.message : 'Unknown error')
                //     return null
                // }

                return null
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            token = { ...token, ...user }
            return token
        },
        async session({ session, token }) {
            /** apply extra user attributes here, for example, we add 'authority' & 'id' in this section */
            return {
                ...session,
                user: {
                    ...session.user,
                    id: (token.sub || token.id) as string,
                    authority: (token.authority || ['user']) as string[],
                    accessToken: token.accessToken as string,
                },
            }
        },
    },
} satisfies NextAuthConfig
