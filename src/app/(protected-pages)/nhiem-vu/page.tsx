'use client'

import { useState } from 'react'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import {
    HiPlus,
    HiChevronDown,
    HiChevronRight,
    HiCheckCircle,
    HiChartBar,
    HiFlag,
    HiExclamation,
    HiStar,
    HiArchive,
    HiMenuAlt2,
    HiLocationMarker,
    HiTrendingUp,
    HiDocumentText,
    HiClock,
    HiLightningBolt,
    HiUserGroup,
    HiAdjustments,
} from 'react-icons/hi'

const SIDEBAR_CATEGORIES = [
    { Icon: HiLocationMarker, label: 'TP. Hà Nội', color: 'text-teal-500', bg: 'bg-teal-50' },
    { Icon: HiTrendingUp, label: 'Nhiệm vụ chiến lược', color: 'text-purple-500', bg: 'bg-purple-50' },
    { Icon: HiDocumentText, label: 'Quản lý văn bản', color: 'text-blue-500', bg: 'bg-blue-50' },
    { Icon: HiClock, label: 'Nhiệm vụ thường xuyên', color: 'text-orange-500', bg: 'bg-orange-50' },
    { Icon: HiLightningBolt, label: 'Nhiệm vụ phát sinh', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { Icon: HiUserGroup, label: 'Nhóm cộng tác (2)', color: 'text-pink-500', bg: 'bg-pink-50' },
]

const SCROLL_TAGS = ['Nhiệm vụ chiến lược', 'Nhiệm vụ thường xuyên', 'Nhiệm vụ phát sinh', 'Nhóm cộng tác']

const MAIN_TABS = ['Tổng quan', 'Giao cho tôi', 'Tạo bởi tôi', 'Tôi phối hợp', 'Tôi theo dõi']

export default function NhiemVuPage() {
    const [activeTab, setActiveTab] = useState('Tổng quan')
    const [activeNav, setActiveNav] = useState('my-tasks')

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <HanoiWorkHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <div className="w-[280px] border-r border-gray-200 flex flex-col shrink-0 bg-white overflow-y-auto">
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-3">
                        <span className="text-base font-bold text-gray-800">Quản lý nhiệm vụ</span>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <HiMenuAlt2 className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Featured OKR card */}
                    <div className="mx-3 mb-3 rounded-xl border border-red-100 bg-red-50 p-3 flex gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                            <span className="text-white text-sm">🔥</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 leading-snug">Phương pháp đánh giá OKR/KPI</p>
                            <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">Nghiên cứu và thực hiện bởi Trường Đại học Kinh tế - Đại học Quốc Gia Hà Nội</p>
                        </div>
                    </div>

                    {/* Nav items */}
                    <div className="px-2 space-y-0.5">
                        <button
                            onClick={() => setActiveNav('overview')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeNav === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <HiChartBar className="w-4 h-4 shrink-0" />
                            Tổng quan
                        </button>
                        <button
                            onClick={() => setActiveNav('my-tasks')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeNav === 'my-tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <HiCheckCircle className="w-4 h-4 shrink-0" />
                            Nhiệm vụ của tôi
                        </button>
                    </div>

                    {/* Scroll tags */}
                    <div className="flex gap-1.5 px-3 mt-3 pb-1 overflow-x-auto scrollbar-hide">
                        {SCROLL_TAGS.map(tag => (
                            <span key={tag} className="shrink-0 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Tree categories */}
                    <div className="px-2 mt-2 space-y-0.5">
                        {SIDEBAR_CATEGORIES.map(({ Icon, label, color, bg }) => (
                            <div key={label} className="flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                                <HiChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                                </div>
                                <span className="flex-1 text-sm text-gray-700 min-w-0 truncate">{label}</span>
                                <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition-all">
                                    <HiPlus className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1" />

                    {/* Archive */}
                    <div className="px-4 py-3 border-t border-gray-100">
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            <HiArchive className="w-4 h-4" />
                            Lưu trữ
                            <HiChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                    {/* Content header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
                        <h1 className="text-xl font-bold text-gray-900">Nhiệm vụ của tôi</h1>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                            <HiPlus className="w-4 h-4" />
                            Tạo nhiệm vụ
                        </button>
                    </div>

                    {/* Sub-tabs */}
                    <div className="flex items-center gap-0 px-6 bg-white border-b border-gray-200 shrink-0">
                        {MAIN_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable main area */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                        {/* Task overview section */}
                        <div>
                            <h2 className="text-base font-bold text-gray-800 mb-3">Tổng quan nhiệm vụ</h2>

                            {/* Filters */}
                            <div className="flex gap-3 mb-4">
                                {[
                                    'Dự án: Tất cả',
                                    'Loại nhiệm vụ: Tất cả',
                                    'Thời hạn: Tất cả',
                                ].map(f => (
                                    <button key={f} className="flex-1 flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                        {f}
                                        <HiChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                                    </button>
                                ))}
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Overdue */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                            <HiExclamation className="w-3.5 h-3.5 text-red-500" />
                                        </div>
                                        <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Nhiệm vụ quá hạn</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-4xl font-bold text-gray-900">0</span>
                                        <button className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-0.5">
                                            Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Incomplete */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                            <HiFlag className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                        <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Nhiệm vụ chưa hoàn thành</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-4xl font-bold text-gray-900">1</span>
                                        <button className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-0.5">
                                            Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                            <HiCheckCircle className="w-3.5 h-3.5 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">Tổng số nhiệm vụ</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-4xl font-bold text-gray-900">4</span>
                                        <button className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-0.5">
                                            Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KPI overview section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-base font-bold text-gray-800">Tổng quan về KPI</h2>
                                    <button className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-0.5">
                                        Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                    Thời gian: Từ 01/05/2026 đến 31/05/2026
                                    <HiChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            {/* KPI cards */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Số lượng */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            <HiAdjustments className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide leading-snug">Điểm phần trăm về số lượng</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-gray-900">50</span>
                                        <span className="text-lg font-semibold text-gray-500 ml-1">%</span>
                                    </div>
                                    <div className="space-y-1.5 mb-4">
                                        <p className="text-sm text-gray-600">Kết quả thực hiện: 1/2 nhiệm vụ</p>
                                        <div className="flex items-center gap-1.5">
                                            <HiExclamation className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-xs text-red-500">1 nhiệm vụ chưa hoàn thành</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3">
                                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                                            Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Chất lượng */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <HiStar className="w-5 h-5 text-green-500" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide leading-snug">Điểm phần trăm về chất lượng</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-gray-900">50</span>
                                        <span className="text-lg font-semibold text-gray-500 ml-1">%</span>
                                    </div>
                                    <div className="space-y-1.5 mb-4">
                                        <p className="text-sm text-gray-600">Tổng số lần trả lại: 0</p>
                                        <div className="flex items-center gap-1.5">
                                            <HiExclamation className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-xs text-red-500">0 nhiệm vụ bị trả lại</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3">
                                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                                            Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tiến độ */}
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                            <svg viewBox="0 0 20 20" className="w-5 h-5 fill-orange-500">
                                                <rect x="3" y="9" width="14" height="2" rx="1" />
                                                <rect x="3" y="13" width="10" height="2" rx="1" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide leading-snug">Điểm phần trăm về tiến độ</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-gray-900">50</span>
                                        <span className="text-lg font-semibold text-gray-500 ml-1">%</span>
                                    </div>
                                    <div className="space-y-1.5 mb-4">
                                        <p className="text-sm text-gray-600">Tổng số ngày chậm tiến độ: 0</p>
                                        <div className="flex items-center gap-1.5">
                                            <HiExclamation className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-xs text-red-500">0 nhiệm vụ chậm tiến độ</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3">
                                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                                            Xem chi tiết <HiChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
