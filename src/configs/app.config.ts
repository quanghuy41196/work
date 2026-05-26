export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    activeNavTranslation: boolean
    languageList: {
        label: string
        value: string
        flag: string
    }[]
}

const appConfig: AppConfig = {
    apiPrefix: '/api/proxy',
    authenticatedEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'vi',
    activeNavTranslation: false,
    languageList: [
        { label: 'English', value: 'en', flag: 'US' },
        { label: 'Việt Nam', value: 'vi', flag: 'VN' },
    ]
}

export default appConfig
