import type { CommonProps } from '@/@types/common'
import { APP_NAME } from '@/constants/app.constant'
import { imageStaticPaths } from '@/constants/imagePaths.constant'
import classNames from 'classnames'
import Image from 'next/image'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number
    logoHeight?: number
}


const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth,
        logoHeight,
    } = props

    const width = logoWidth || (type === 'full' ? 205 : 40)
    const height = logoHeight || (type === 'full' ? 77 : 40)

    return (
        <div className={classNames('logo', className)} style={style}>
            {mode === 'light' && (
                <>
                    <Image
                        className={classNames(
                            'object-cover',
                            type === 'full' ? '' : 'hidden',
                            imgClass,
                        )}
                        src={imageStaticPaths?.logoMktFull}
                        alt={`${APP_NAME} logo`}
                        width={width}
                        height={height}
                        priority
                    />
                    <Image
                        className={classNames(
                            'object-cover',
                            type === 'streamline' ? '' : 'hidden',
                            imgClass,
                        )}
                        src={imageStaticPaths?.logoMktStreamline}
                        alt={`${APP_NAME} logo`}
                        width={width}
                        height={height}
                        priority
                    />
                </>
            )}
            {mode === 'dark' && (
                <>
                    <Image
                        className={classNames('object-cover',
                            type === 'full' ? '' : 'hidden',
                            imgClass,
                        )}
                        src={imageStaticPaths?.logoMktFull}
                        alt={`${APP_NAME} logo`}
                        width={width}
                        height={height}
                        priority
                    />
                    <Image
                        className={classNames( 'object-cover',
                            type === 'streamline' ? '' : 'hidden',
                            imgClass,
                        )}
                       src={imageStaticPaths?.logoMktStreamline}
                        alt={`${APP_NAME} logo`}
                        width={width}
                        height={height}
                        priority
                    />
                </>
            )}
        </div>
    )
}

export default Logo
