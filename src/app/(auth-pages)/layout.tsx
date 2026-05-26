import AuthLayout from '@/components/layouts/AuthLayout'
import { getTranslations } from 'next-intl/server'
import { ReactNode } from 'react'
export async function generateMetadata() {
    const t = await getTranslations()
    return {
        title: t('auth.seoTitle'),
        description: t('auth.seoDescription'),
    }
}
const Layout = async ({ children }: { children: ReactNode }) => {
    const t = await getTranslations('auth')
    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            <AuthLayout>
                <h1 className="text-sm text-center text-navy uppercase mb-3">
                    {t('title')} <br />
                    {t('subTitle')}
                </h1>
                {children}
            </AuthLayout>
        </div>
    )
}

export default Layout
