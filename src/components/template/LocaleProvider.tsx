'use client'
import { dateLocales } from '@/i18n/dateLocales'
import dayjs from 'dayjs'
import { NextIntlClientProvider } from 'next-intl'
import { useEffect } from 'react'

import type { AbstractIntlMessages } from 'next-intl'

type LocaleProvider = {
    messages: AbstractIntlMessages
    children: React.ReactNode
    locale: string
}

const LocaleProvider = ({ messages, children, locale }: LocaleProvider) => {
    useEffect(() => {
        dateLocales[locale]().then(() => {
            dayjs.locale(locale)
        })
    }, [locale])
    return (
        <NextIntlClientProvider
            messages={messages}
            locale={locale}
            onError={(error) => {
                if (error.code === 'MISSING_MESSAGE') {
                    console.warn('Missing translation:', error.originalMessage)
                }
            }}
            getMessageFallback={({ key }) => key}
        >
            {children}
        </NextIntlClientProvider>
    )
}

export default LocaleProvider
