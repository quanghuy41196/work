import type { CommonProps } from '@/@types/common'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Dropdown from '@/components/ui/Dropdown'
import Menu from '@/components/ui/Menu'
import Tooltip from '@/components/ui/Tooltip'
import { Link } from '@/i18n/navigation'
import classNames from '@/utils/classNames'
import VerticalMenuIcon from './VerticalMenuIcon'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
    nav: NavigationTree
    direction?: Direction
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    t: TranslationFn
    renderAsIcon?: boolean
    userAuthority: string[]
    currentKey?: string
    parentKeys?: string[]
}

interface DefaultItemProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    sideCollapsed?: boolean
    t: TranslationFn
    indent?: boolean
    userAuthority: string[]
    showIcon?: boolean
    showTitle?: boolean
    treeLine?: boolean
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps { }

const CollapsedItem = ({
    nav,
    children,
    direction,
    renderAsIcon,
    onLinkClick,
    userAuthority,
    t,
    currentKey,
}: CollapsedItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            {renderAsIcon ? (
                <Tooltip
                    title={t(nav.translateKey, nav.title)}
                    placement={direction === 'rtl' ? 'left' : 'right'}
                >
                    {children}
                </Tooltip>
            ) : (
                <Dropdown.Item active={currentKey === nav.key}>
                    {nav.path ? (
                        <Link
                            className="h-full w-full flex items-center outline-hidden"
                            href={nav.path}
                            target={nav.isExternalLink ? '_blank' : ''}
                            onClick={() =>
                                onLinkClick?.({
                                    key: nav.key,
                                    title: nav.title,
                                    path: nav.path,
                                })
                            }
                        >
                            <span>{t(nav.translateKey, nav.title)}</span>
                        </Link>
                    ) : (
                        <span>{t(nav.translateKey, nav.title)}</span>
                    )}
                </Dropdown.Item>
            )}
        </AuthorityCheck>
    )
}

const DefaultItem = (props: DefaultItemProps) => {
    const {
        nav,
        onLinkClick,
        showTitle,
        indent,
        treeLine,
        showIcon = true,
        userAuthority,
        t,
    } = props

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <MenuItem  key={nav.key} eventKey={nav.key} dotIndent={indent && !treeLine} className={classNames(!indent && treeLine && 'relative before:-translate-y-1/2 before:-left-2 before:rounded-bl-2xl before:absolute before:w-[21px] before:border-l-[2px] before:border-b-[2px] before:border-[#dbdbdb]  before:h-[135%] [&:not(.menu-item~.menu-item)]:before:h-1/2')}>
                <Link
                    href={nav.path}
                    className="flex items-center gap-2 h-full w-full"
                    target={nav.isExternalLink ? '_blank' : ''}
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                >
                    {showIcon && <VerticalMenuIcon icon={nav.icon} />}
                    {showTitle && <span>{t(nav.translateKey, nav.title)}</span>}
                </Link>
            </MenuItem>
        </AuthorityCheck>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    direction,
    indent,
    treeLine,
    renderAsIcon,
    userAuthority,
    showIcon,
    showTitle,
    t,
    currentKey,
    parentKeys,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
    
    return (
        <>
            {sideCollapsed ? (
                <CollapsedItem
                    currentKey={currentKey}
                    parentKeys={parentKeys}
                    nav={nav}
                    direction={direction}
                    renderAsIcon={renderAsIcon}
                    userAuthority={userAuthority}
                    t={t}
                    onLinkClick={onLinkClick}
                >
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        userAuthority={userAuthority}
                        showIcon={showIcon}
                        showTitle={showTitle}
                        t={t}
                        onLinkClick={onLinkClick}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    userAuthority={userAuthority}
                    showIcon={showIcon}
                    showTitle={showTitle}
                    indent={indent}
                    treeLine={treeLine}
                    t={t}
                    onLinkClick={onLinkClick}
                />
            )}
        </>
    )
}

export default VerticalSingleMenuItem
