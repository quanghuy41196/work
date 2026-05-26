'use client'

import type { CommonProps } from '@/@types/common'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import appConfig from '@/configs/app.config'
import { setLocale } from '@/server/actions/locale'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import classNames from 'classnames'
import { useLocale } from 'next-intl'
import { useMemo } from 'react'
import { HiCheck } from 'react-icons/hi'

const LanguageSelectorBase = ({ className }: CommonProps) => {
    const locale = useLocale()
    const languageList = appConfig?.languageList
    const selectLangFlag = useMemo(
        () => languageList.find((lang) => lang.value === locale)?.flag,
        [locale, languageList],
    )

    const handleUpdateLocale = async (locale: string) => {
        await setLocale(locale)
    }

    const selectedLanguage = (
        <div className={classNames(className, 'flex items-center')}>
            <Avatar
                size={24}
                shape="circle"
                src={`/img/countries/${selectLangFlag}.png`}
            />
        </div>
    )

    return (
        <Dropdown renderTitle={selectedLanguage} placement="bottom-end">
            {languageList.map((lang) => (
                <Dropdown.Item
                    key={lang.label}
                    className="justify-between"
                    eventKey={lang.label}
                    onClick={() => handleUpdateLocale(lang.value)}
                >
                    <span className="flex items-center">
                        <Avatar
                            size={18}
                            shape="circle"
                            src={`/img/countries/${lang.flag}.png`}
                        />
                        <span className="ltr:ml-2 rtl:mr-2">{lang.label}</span>
                    </span>
                    {locale === lang.value && (
                        <HiCheck className="text-emerald-500 text-lg" />
                    )}
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

const LanguageSelector = withHeaderItem(LanguageSelectorBase)

export default LanguageSelector
