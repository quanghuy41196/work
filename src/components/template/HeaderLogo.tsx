import type { Mode } from '@/@types/theme'
import Logo from '@/components/template/Logo'
import appConfig from '@/configs/app.config'
import { Link } from '@/i18n/navigation'
import useTheme from '@/utils/hooks/useTheme'

const HeaderLogo = ({ mode }: { mode?: Mode }) => {
    const defaultMode = useTheme((state) => state.mode)

    return (
        <Link href={appConfig.authenticatedEntryPath}>
            <Logo
                imgClass="max-h-10"
                mode={mode || defaultMode}
                className="hidden lg:block"
            />
        </Link>
    )
}

export default HeaderLogo
