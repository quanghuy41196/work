import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Bảo mật headers
    async headers() {
        const isDev = process.env.NODE_ENV === 'development'

        // Dev: relaxed CSP to support Next.js HMR (needs unsafe-eval + unsafe-inline).
        // Production: no unsafe-eval; unsafe-inline kept for style only (Tailwind injects styles).
        // If you add CDN scripts/fonts later, add their origins here instead of using unsafe-*.
        const csp = isDev
            ? [
                `default-src 'self'`,
                `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
                `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
                `img-src 'self' data: blob:`,
                `connect-src 'self' ws: wss:`,
                `font-src 'self' data: https://fonts.gstatic.com`,
            ].join('; ')
            : [
                `default-src 'self'`,
                `script-src 'self' 'unsafe-inline'`,
                `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
                `img-src 'self' data: blob:`,
                `connect-src 'self'`,
                `font-src 'self' data: https://fonts.gstatic.com`,
                `frame-ancestors 'none'`,
                `base-uri 'self'`,
                `form-action 'self'`,
            ].join('; ')

        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: csp,
                    },
                    // Only send HSTS in production (HTTPS only)
                    ...(!isDev ? [{
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    }] : []),
                ],
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex, nofollow',
                    }
                ],
            },
        ]
    },

    // Cấu hình môi trường
    env: {
        CUSTOM_BUILD_TIME: new Date().toISOString(),
    },

    // Tối ưu hóa bundle
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@tanstack/react-table', 'framer-motion'],
    },

    // Cấu hình TypeScript
    typescript: {
        ignoreBuildErrors: false,
    },

    // Cấu hình ESLint
    eslint: {
        ignoreDuringBuilds: false,
    },

    // Cấu hình hình ảnh
    images: {
        // remotePatterns replaces the deprecated `domains` field (Next.js 14+).
        // Add remote image hosts here when needed.
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: 'localhost' },
        ],
        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
};
export default withNextIntl(nextConfig);
