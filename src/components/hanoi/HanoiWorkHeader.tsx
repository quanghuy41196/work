'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HiHome,
    HiDocumentText,
    HiChatAlt2,
    HiCalendar,
    HiCheckCircle,
    HiClipboardList,
    HiSearch,
    HiBell,
    HiChevronDown,
    HiUser,
} from 'react-icons/hi'
import type { ComponentType } from 'react'

type IconComp = ComponentType<{ className?: string }>

const navLinks: { Icon: IconComp; href: string }[] = [
    { Icon: HiHome, href: '/dashboard' },
    { Icon: HiDocumentText, href: '/bang-tin' },
    { Icon: HiChatAlt2, href: '/tin-nhan' },
    { Icon: HiCalendar, href: '/lich' },
    { Icon: HiCheckCircle, href: '/nhiem-vu' },
    { Icon: HiClipboardList, href: '/ghi-chu' },
]

export default function HanoiWorkHeader() {
    const pathname = usePathname()

    return (
        <header
            className="h-16 flex items-center px-4 gap-4 shrink-0 relative z-20"
            style={{ backgroundColor: '#1a3f82' }}
        >
            {/* Org */}
            <button className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center ring-2 ring-yellow-400/40">
                    <span className="text-yellow-400 text-xs font-bold select-none">★</span>
                </div>
                <div className="text-left">
                    <p className="text-white text-sm font-semibold leading-none mb-0.5">vitechgroup</p>
                    <p className="text-blue-200 text-xs leading-none">Thành viên</p>
                </div>
                <HiChevronDown className="w-4 h-4 text-blue-300 ml-0.5" />
            </button>

            {/* Nav */}
            <nav className="flex-1 flex items-center justify-center gap-0.5">
                {navLinks.map(({ Icon, href }, i) => {
                    const active = href !== '#' && pathname === href
                    return (
                        <Link
                            key={i}
                            href={href}
                            className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                                active
                                    ? 'bg-white/15 text-white'
                                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {active && (
                                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-300" />
                            )}
                        </Link>
                    )
                })}

            </nav>

            {/* Search + bell + avatar */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="h-8 pl-9 pr-4 text-sm text-white placeholder-blue-300 bg-white/10 border border-white/20 rounded-full outline-none focus:border-white/50 w-52 transition-colors"
                    />
                </div>
                <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-blue-200 hover:bg-white/10 transition-colors">
                    <HiBell className="w-5 h-5" />
                    <span
                        className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2"
                        style={{ borderColor: '#1a3f82' }}
                    />
                </button>
                <button className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/30 hover:ring-white/60 transition-all">
                    <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                        <HiUser className="w-5 h-5 text-white" />
                    </div>
                </button>
            </div>
        </header>
    )
}
