import type { CommonProps } from '@/@types/common'
import type { LazyExoticComponent } from 'react'
import { lazy, useMemo, type JSX } from 'react'

type LayoutType = 'simple' | 'split' | 'side' | 'default'

type Layouts = Record<
    LayoutType,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

const currentLayoutType: LayoutType = 'default'

const layouts: Layouts = {
    simple: lazy(() => import('./Simple')),
    split: lazy(() => import('./Split')),
    side: lazy(() => import('./Side')),
    default: lazy(() => import('./Default')),
}

const AuthLayout = ({ children }: CommonProps) => {
    const Layout = useMemo(() => {
        return layouts[currentLayoutType]
    }, [])

    return <Layout>{children}</Layout>
}

export default AuthLayout
