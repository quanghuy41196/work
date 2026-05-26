import type { CommonProps } from '@/@types/common'
import { Link } from '@/i18n/navigation'
import classNames from '@/utils/classNames'
import type { ComponentPropsWithoutRef } from 'react'

interface ActionLink extends CommonProps, ComponentPropsWithoutRef<'a'> {
    themeColor?: boolean
    href?: string
    reloadDocument?: boolean
}

const ActionLink = (props: ActionLink) => {
    const { children, className, themeColor = true, href = '', ...rest } = props

    const classNameProps = {
        className: classNames(
            themeColor && 'text-primary',
            'hover:underline',
            className,
        ),
    }

    return (
        <Link href={href} {...classNameProps} {...rest}>
            {children}
        </Link>
    )
}

export default ActionLink
