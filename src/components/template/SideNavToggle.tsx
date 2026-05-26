import type { CommonProps } from '@/@types/common'
import NavToggle from '@/components/shared/NavToggle'
import classNames from '@/utils/classNames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useTheme from '@/utils/hooks/useTheme'

const SideNavToggleBase = ({ className }: CommonProps) => {
    const { layout, setSideNavCollapse } = useTheme((state) => state)

    const sideNavCollapse = layout.sideNavCollapse

    const onCollapse = () => {
        setSideNavCollapse(!sideNavCollapse)
    }

    return (
        <div
            className={classNames('hidden lg:block', className)}
            role="button"
            onClick={onCollapse}
        >
            <NavToggle className="text-2xl" toggled={sideNavCollapse} />
        </div>
    )
}

const SideNavToggle = withHeaderItem(SideNavToggleBase)

export default SideNavToggle
