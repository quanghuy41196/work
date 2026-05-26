import '@/assets/styles/app.css'
import { auth } from '@/auth'
import AuthProvider from '@/components/auth/AuthProvider'
import { ReactQueryProvider } from '@/components/shared/ReactQueryProvider'
import LocaleProvider from '@/components/template/LocaleProvider'
import NavigationProvider from '@/components/template/Navigation/NavigationProvider'
import ThemeProvider from '@/components/template/Theme/ThemeProvider'
import pageMetaConfig from '@/configs/page-meta.config'
import { getLocale } from '@/server/actions/locale'
import { getNavigation } from '@/server/actions/navigation/getNavigation'
import { getTheme } from '@/server/actions/theme'
import { getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'

export const metadata = {
    ...pageMetaConfig,
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const session = await auth()

    const navigationTree = await getNavigation()
    const locale = await getLocale()

    const messages = await getMessages()

    const theme = await getTheme()

    return (
        <AuthProvider session={session}>
            <html
                className={theme.mode === 'dark' ? 'dark' : 'light'}
                dir={theme.direction}
                suppressHydrationWarning
            >
                <body suppressHydrationWarning>
                    <LocaleProvider locale={locale} messages={messages}>
                        <ThemeProvider theme={theme}>
                            <NavigationProvider navigationTree={navigationTree}>
                                <ReactQueryProvider>
                                    {children}
                                </ReactQueryProvider>
                            </NavigationProvider>
                        </ThemeProvider>
                    </LocaleProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
