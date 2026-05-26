import appConfig from '@/configs/app.config'
import {
    authRoutes as _authRoutes,
    protectedRoutes as _protectedRoutes,
    publicRoutes as _publicRoutes,
} from '@/configs/routes.config'
import { auth } from '@/auth'
import { type NextRequest, NextResponse } from 'next/server'
import { REDIRECT_URL_KEY } from './constants/app.constant'

// ── CSRF ──────────────────────────────────────────────────────────────────────
// For state-changing requests to internal API routes, verify that the Origin
// header matches the application's own host. This guards against cross-site
// form submissions without requiring a separate CSRF token cookie.
// Note: /api/auth/* is excluded — NextAuth handles its own CSRF internally.
// Note: /api/proxy/* is excluded — it is a stateless reverse-proxy that
//   forwards requests to the backend. The backend authenticates each request
//   via the Bearer token injected by the proxy handler (not via session cookie),
//   so there is no session state for a CSRF attack to exploit. Applying the
//   Origin check here would also break server-to-server calls that legitimately
//   have no Origin header.

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isCsrfSafe(req: NextRequest): boolean {
    const pathname = req.nextUrl.pathname

    // Only enforce on internal API routes (not the backend proxy or NextAuth)
    if (!pathname.startsWith('/api/')) return true
    if (pathname.startsWith('/api/auth/')) return true  // NextAuth owns these
    if (pathname.startsWith('/api/proxy/')) return true // stateless proxy — see comment above

    if (!STATE_CHANGING_METHODS.has(req.method)) return true

    const origin = req.headers.get('origin')
    if (!origin) return false // reject mutations with no Origin header

    try {
        const originUrl = new URL(origin)
        return originUrl.host === req.nextUrl.host
    } catch {
        return false
    }
}

// ================== NORMALIZE ROUTES ==================
const publicRoutes = Object.keys(_publicRoutes)
const authRoutes = Object.keys(_authRoutes)
const protectedRoutes = Object.keys(_protectedRoutes)

// ================== MATCH ==================
function matchRoute(pathname: string, routes: string[]) {
    if (!Array.isArray(routes)) return false

    return routes.some((route) => {
        if (typeof route !== 'string') return false

        if (pathname === route) return true

        // dynamic routes: /users/[id]
        if (route.includes('[')) {
            // Split on dynamic segments, escape regex special chars in the literal
            // parts, then rejoin with [^/]+ so dots and other metacharacters in
            // static path segments are treated as literals (not wildcards).
            const pattern = route
                .split(/(\[.*?\])/)
                .map((part) =>
                    /^\[.*\]$/.test(part)
                        ? '[^/]+'
                        : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                )
                .join('')
                .replace(/\//g, '\\/')

            return new RegExp(`^${pattern}$`).test(pathname)
        }

        return false
    })
}

// ================== MIDDLEWARE ==================
const middleware = auth((req) => {
    const { nextUrl } = req
    const pathname = nextUrl.pathname

    const isSignedIn = !!req.auth

    const isApiRoute = pathname.startsWith('/api/')
    const isApiAuthRoute = pathname.startsWith(`${appConfig.apiPrefix}/auth`)

    const isPublicRoute = matchRoute(pathname, publicRoutes)
    const isAuthRoute = matchRoute(pathname, authRoutes)
    const isProtectedRoute = matchRoute(pathname, protectedRoutes)

    // ================== CSRF CHECK ==================
    if (!isCsrfSafe(req)) {
        return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }

    // ================== SKIP API ==================
    if (isApiRoute || isApiAuthRoute) {
        return NextResponse.next()
    }

    // ================== PUBLIC ROUTES ==================
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // ================== AUTH ROUTES (login/register) ==================
    if (isAuthRoute) {
        if (isSignedIn) {
            return NextResponse.redirect(
                new URL(appConfig.authenticatedEntryPath, nextUrl),
            )
        }
        return NextResponse.next()
    }

    // ================== NO PUBLIC ROUTES FALLBACK ==================
    if (!publicRoutes.length && !isAuthRoute && !isProtectedRoute) {
        return NextResponse.redirect(
            new URL(appConfig.authenticatedEntryPath, nextUrl),
        )
    }

    // ================== PROTECTED ROUTES ==================
    if (isProtectedRoute && !isSignedIn) {
        const callbackUrl = pathname + nextUrl.search

        const loginUrl = new URL(
            appConfig.unAuthenticatedEntryPath,
            nextUrl,
        )

        // Do NOT encodeURIComponent the callbackUrl here.
        // URLSearchParams.set() already percent-encodes the value, so double-encoding
        // would produce an overly long header and trigger HTTP 431. The callbackUrl is
        // a server-generated path+search string (not user-controlled input), so it is
        // safe to pass as-is. The CSRF origin check earlier in this middleware ensures
        // cross-origin POSTs cannot forge the redirect destination.
        loginUrl.searchParams.set(REDIRECT_URL_KEY, callbackUrl)

        return NextResponse.redirect(loginUrl)
    }

    // ================== DEFAULT ==================
    return NextResponse.next()
})

export default middleware

// ================== MATCHER ==================
export const config = {
    matcher: ['/((?!_next|.*\\..*).*)'],
}
