'use client'

import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader';
import type { ComponentType } from 'react';
import {
    HiArchive,
    HiBookOpen,
    HiCalendar,
    HiCog,
    HiCurrencyDollar,
    HiFlag,
    HiGlobe,
    HiInformationCircle,
    HiOfficeBuilding,
    HiPlus,
    HiSearch,
    HiStar,
    HiVideoCamera,
} from 'react-icons/hi';
import { RiRobot2Fill } from 'react-icons/ri';

// ── Flags ────────────────────────────────────────────────────────────────────

const VietnamFlag = () => (
    <svg viewBox="0 0 3 2" className="w-full h-full">
        <rect width="3" height="2" fill="#DA251D" />
        <polygon
            fill="#FFFF00"
            points="1.5,0.2 1.67,0.73 2.22,0.73 1.77,1.05 1.94,1.58 1.5,1.26 1.06,1.58 1.23,1.05 0.78,0.73 1.33,0.73"
        />
    </svg>
)

const PartyFlag = () => (
    <svg viewBox="0 0 3 2" className="w-full h-full">
        <rect width="3" height="2" fill="#DA251D" />
        <polygon
            fill="#FFFF00"
            points="0.3,0.12 0.37,0.32 0.58,0.32 0.42,0.44 0.48,0.64 0.3,0.52 0.12,0.64 0.18,0.44 0.02,0.32 0.23,0.32"
        />
        <text x="1.5" y="1.5" textAnchor="middle" fontSize="1.2" fill="#FFFF00" fontFamily="serif">
            ☭
        </text>
    </svg>
)

// ── Data ─────────────────────────────────────────────────────────────────────

type IconComponent = ComponentType<{ className?: string; color?: string }>

type AppDef = {
    id: number
    name: string
    Icon: IconComponent
    color: string
}

const apps: AppDef[] = [
    { id: 1, name: 'Quản lý văn bản nội bộ HN', Icon: HiOfficeBuilding, color: '#0052CC' },
    { id: 2, name: 'Hệ thống thông tin điều hành t...', Icon: HiInformationCircle, color: '#CC0000' },
    { id: 3, name: 'Dịch vụ công Hà Nội', Icon: HiGlobe, color: '#1a4fa0' },
    { id: 4, name: 'Hệ thống điều hành tác nghiệp...', Icon: HiCog, color: '#CC3300' },
    { id: 5, name: 'Dịch vụ công của Đảng', Icon: HiFlag, color: '#CC0000' },
    { id: 6, name: 'Sổ tay Đảng viên', Icon: HiBookOpen, color: '#CC0000' },
    { id: 7, name: 'Hệ thống Tư liệu - Văn kiện Đảng', Icon: HiArchive, color: '#CC0000' },
    { id: 8, name: 'Đánh giá, phân loại CB, CC', Icon: HiStar, color: '#1a4fa0' },
    { id: 9, name: 'Quản trị iHanoi', Icon: HiGlobe, color: '#0099CC' },
    { id: 10, name: 'NỘP ĐẢNG PHÍ', Icon: HiCurrencyDollar, color: '#CC0000' },
]

const participants = [
    { initial: 'H', bg: '#f97316' },
    { initial: 'T', bg: '#a855f7' },
    { initial: 'N', bg: '#ec4899' },
    { initial: 'L', bg: '#14b8a6' },
    { initial: 'P', bg: '#3b82f6' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function AppIcon({ app }: { app: AppDef }) {
    return (
        <button className="flex flex-col items-center gap-1.5 w-[78px] group cursor-pointer">
            <div className="w-[56px] h-[56px] rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-150">
                <app.Icon className="w-7 h-7" color={app.color} />
            </div>
            <span className="text-white text-[11px] text-center leading-tight line-clamp-2 w-full select-none">
                {app.name}
            </span>
        </button>
    )
}

function MeetingIllustration() {
    const Dots = () => (
        <div className="flex gap-0.5 items-center shrink-0">
            {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-gray-300" />
            ))}
        </div>
    )

    return (
        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 overflow-hidden">
            <div className="bg-white rounded-xl p-2 shadow-sm shrink-0">
                <HiCalendar className="w-8 h-8 text-blue-500" />
            </div>
            <Dots />
            <div className="flex -space-x-2 shrink-0">
                {participants.slice(0, 2).map(({ initial, bg }) => (
                    <div
                        key={initial}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white"
                        style={{ backgroundColor: bg }}
                    >
                        {initial}
                    </div>
                ))}
            </div>
            <span className="text-lg shrink-0">📍</span>
            <div className="flex -space-x-2 shrink-0">
                {participants.slice(2, 4).map(({ initial, bg }) => (
                    <div
                        key={initial}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white"
                        style={{ backgroundColor: bg }}
                    >
                        {initial}
                    </div>
                ))}
            </div>
            <span className="text-lg shrink-0">📍</span>
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shrink-0"
                style={{ backgroundColor: participants[4].bg }}
            >
                {participants[4].initial}
            </div>
            <Dots />
            <div className="bg-green-500 rounded-xl p-2 shadow-sm shrink-0">
                <HiVideoCamera className="w-8 h-8 text-white" />
            </div>
        </div>
    )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HanoiWorkDashboard() {
    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <HanoiWorkHeader />

            <div
                className="flex-1 flex flex-col"
                style={{
                    background:
                        'linear-gradient(180deg, #1652a8 0%, #2878d8 40%, #5aadf5 72%, #d8ecfc 100%)',
                }}
            >
                {/* Blue hero */}
                <div className="relative flex flex-col items-center pt-10 pb-16 px-8 overflow-hidden">
                    <div
                        className="absolute left-0 top-0 w-36 h-48 shadow-2xl rounded overflow-hidden pointer-events-none"
                        style={{ transform: 'rotate(-8deg) translate(-20px, -8px)' }}
                    >
                        <PartyFlag />
                    </div>
                    <div
                        className="absolute right-0 top-0 w-36 h-48 shadow-2xl rounded overflow-hidden pointer-events-none"
                        style={{ transform: 'rotate(8deg) translate(20px, -8px)' }}
                    >
                        <VietnamFlag />
                    </div>

                    <h1 className="text-white text-2xl font-semibold mb-6 drop-shadow">
                        👋 Chào mừng bạn
                    </h1>

                    <div className="relative w-[560px] mb-8">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm thông minh..."
                            className="w-full h-12 pl-12 pr-5 bg-white rounded-full text-gray-700 placeholder-gray-400 shadow-lg outline-none text-sm"
                        />
                    </div>

                    <div className="flex gap-5 mb-4">
                        {apps.slice(0, 8).map((app) => (
                            <AppIcon key={app.id} app={app} />
                        ))}
                    </div>
                    <div className="flex gap-5">
                        {apps.slice(8).map((app) => (
                            <AppIcon key={app.id} app={app} />
                        ))}
                    </div>
                </div>

                {/* White card */}
                <div className="mx-auto w-full max-w-4xl bg-white rounded-t-2xl shadow-xl px-8 py-6 flex-1">
                    <div className="grid grid-cols-2 gap-0">
                        <div className="pr-8">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        Phòng họp không giấy tờ
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Sắp xếp và điều phối lịch họp dễ dàng.
                                    </p>
                                </div>
                                <button className="flex items-center gap-0.5 text-sm text-blue-600 hover:text-blue-700 font-medium shrink-0 ml-4">
                                    <HiPlus className="w-4 h-4" />
                                    Thêm
                                </button>
                            </div>
                            <MeetingIllustration />
                        </div>

                        <div className="pl-8 border-l border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                    <span className="text-base">📋</span>
                                    Nhiệm vụ cần giải quyết
                                </h3>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium shrink-0 ml-4">
                                    Xem tất cả
                                </button>
                            </div>
                            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                                <span className="text-sm text-gray-700 truncate flex-1 min-w-0">
                                    Giao Huy - PTP chỉ đạo, d/c Phương tham mưu Thả...
                                </span>
                                <HiFlag className="w-4 h-4 text-red-500 shrink-0" />
                                <span className="text-xs text-gray-400 shrink-0">29/05</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-gray-600/80 hover:bg-gray-700 transition-colors">
                    <RiRobot2Fill className="w-6 h-6" />
                </button>
                <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <HiPlus className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
