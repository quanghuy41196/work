import { CommonProps } from '@/@types/common'
import { imageStaticPaths } from '@/constants/imagePaths.constant'
import Image from 'next/image'
import { ReactNode } from 'react'
interface DefaultProps extends CommonProps {
    content?: ReactNode
}

const Default = ({ children }: DefaultProps) => {
    return (
        <div className="main-section relative text-sm antialiased bg-[#023071]">
            <div className="min-h-screen text-black dark:text-white-dark">
                <div
                    className={`flex min-h-screen items-center lg:justify-start bg-cover bg-center justify-center lg:pl-56`}
                    style={{
                        backgroundImage: `url(${imageStaticPaths.background})`,
                    }}
                >
                    <div className="max-w-6xl w-full px-4">
                        <div className="flex flex-col md:flex-row items-stretch gap-8">
                            <div className="w-full md:w-[500px] lg:w-[540px] bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                                <div className="flex flex-col items-center mb-8">
                                    <Image
                                        alt="logo"
                                        src={imageStaticPaths.logoMktFull}
                                        width={250}
                                        height={50}
                                        className="m-auto"
                                        priority
                                    />
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Default
