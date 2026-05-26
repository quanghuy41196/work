'use client'

import { useEffect, useRef, useState } from 'react'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import {
    HiPlus,
    HiChevronLeft,
    HiChevronRight,
    HiChevronDown,
    HiSearch,
    HiX,
    HiExclamation,
    HiCalendar,
    HiCheckCircle,
    HiClock,
} from 'react-icons/hi'
import { RiRobot2Fill } from 'react-icons/ri'

// ── Calendar helpers ──────────────────────────────────────────────────────────

const VI_MONTHS = ['Tháng Một','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bảy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai']
const VI_DAY_SHORT = ['T2','T3','T4','T5','T6','T7','CN']
const TODAY = { year: 2026, month: 4, day: 16 } // May 16, 2026

function generateCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay()
    const firstDayAdj = firstDay === 0 ? 6 : firstDay - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const cells: { day: number; cur: boolean }[] = []
    for (let i = firstDayAdj - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, cur: false })
    for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, cur: true })
    for (let i = 1; cells.length < 42; i++) cells.push({ day: i, cur: false })
    return cells
}

// Week 20: May 11–17, 2026
const WEEK_DAYS = [
    { label: 'Th2', date: 11 },
    { label: 'Th3', date: 12 },
    { label: 'Th4', date: 13 },
    { label: 'Th5', date: 14 },
    { label: 'Th6', date: 15 },
    { label: 'Th7', date: 16 },
    { label: 'CN', date: 17 },
]

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 64 // px per hour

function formatHour(h: number) {
    if (h === 0) return ''
    const period = h < 12 ? 'AM' : 'PM'
    const display = h === 12 ? 12 : h > 12 ? h - 12 : h
    return `${display}:00 ${period}`
}

// Current time: ~10:00 AM on May 16
const CURRENT_HOUR = 10
const CURRENT_MIN = 0
const CURRENT_DAY_IDX = 5 // Th7 = index 5
const CURRENT_TOP = (CURRENT_HOUR + CURRENT_MIN / 60) * HOUR_HEIGHT

// ── Sub-components ────────────────────────────────────────────────────────────

function MiniCalendar() {
    const [dispYear, setDispYear] = useState(TODAY.year)
    const [dispMonth, setDispMonth] = useState(TODAY.month)
    const cells = generateCalendarDays(dispYear, dispMonth)

    const prevMonth = () => dispMonth === 0 ? (setDispMonth(11), setDispYear(y => y - 1)) : setDispMonth(m => m - 1)
    const nextMonth = () => dispMonth === 11 ? (setDispMonth(0), setDispYear(y => y + 1)) : setDispMonth(m => m + 1)

    return (
        <div className="px-3 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800">
                    {VI_MONTHS[dispMonth]} {dispYear}
                </span>
                <div className="flex items-center gap-0.5">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <HiChevronLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <HiChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 mb-1">
                {VI_DAY_SHORT.map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 py-1 font-medium">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((cell, i) => {
                    const isToday = cell.cur && cell.day === TODAY.day && dispYear === TODAY.year && dispMonth === TODAY.month
                    return (
                        <button
                            key={i}
                            className={`h-7 rounded-full text-xs transition-colors mx-auto w-7 ${
                                isToday
                                    ? 'bg-teal-500 text-white font-bold'
                                    : cell.cur
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-gray-300'
                            }`}
                        >
                            {cell.day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ── Create Event Modal ────────────────────────────────────────────────────────

type EventSlot = { dayIdx: number; hour: number }

const SLOT_DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function formatSlotTime(h: number) {
    const period = h < 12 ? 'AM' : 'PM'
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${display}:00 ${period}`
}

function CreateEventModal({ slot, onClose }: { slot: EventSlot; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'event' | 'todo' | 'reminder'>('event')
    const [title, setTitle] = useState('')
    const [allDay, setAllDay] = useState(false)
    const [meetEnabled, setMeetEnabled] = useState(false)

    const dayLabel = SLOT_DAY_LABELS[slot.dayIdx]
    const date = WEEK_DAYS[slot.dayIdx].date
    const dateStr = `${dayLabel}, ${String(date).padStart(2, '0')}/05/2026`
    const startTimeStr = formatSlotTime(slot.hour)
    const endTimeStr = formatSlotTime(Math.min(slot.hour + 1, 23))

    const tabs = [
        { key: 'event' as const, label: 'Sự kiện', Icon: HiCalendar },
        { key: 'todo' as const, label: 'Cần làm', Icon: HiCheckCircle },
        { key: 'reminder' as const, label: 'Nhắc lịch', Icon: HiClock },
    ]

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={onClose}>
            <div className="w-[600px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Tabs */}
                <div className="flex items-center gap-1 px-4 pt-4 pb-3 border-b border-gray-100">
                    {tabs.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeTab === key ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                    <button onClick={onClose} className="ml-auto p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                        <HiX className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">
                    {/* Title */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                        <input
                            autoFocus
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Thêm tiêu đề cho sự kiện này"
                            className="w-full text-xl text-gray-700 placeholder-gray-300 outline-none border-b-2 border-blue-400 pb-2 bg-transparent"
                        />
                    </div>

                    {/* Date / Time */}
                    <div className="px-6 py-4 border-b border-gray-100 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                                <span className="text-xs font-medium text-gray-500">Bắt đầu</span>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">{dateStr}</button>
                            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">{startTimeStr}</button>
                            <span className="text-gray-400 text-lg">→</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-orange-400 shrink-0" />
                                <span className="text-xs font-medium text-gray-500">Kết thúc</span>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">{dateStr}</button>
                            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">{endTimeStr}</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
                                Chọn loại sự kiện
                                <HiChevronDown className="w-4 h-4" />
                            </button>
                            <label className="flex items-center gap-2 ml-auto cursor-pointer select-none">
                                <span className="text-sm text-gray-600">Đây là một sự kiện cả ngày</span>
                                <button
                                    type="button"
                                    onClick={() => setAllDay(v => !v)}
                                    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${allDay ? 'bg-blue-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${allDay ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </button>
                            </label>
                        </div>
                    </div>

                    {/* Host */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 mb-3">Người chủ trì</p>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold">H</div>
                            <button className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors">
                                <HiPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 mb-3">Người tham gia</p>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">A</div>
                            <button className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors">
                                <HiPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Email invite */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Mời qua Email</p>
                        <input
                            type="email"
                            placeholder="Nhập email khách mời..."
                            className="w-full text-sm text-gray-600 placeholder-gray-400 outline-none py-1.5 border-b border-gray-200 focus:border-blue-400 bg-transparent transition-colors"
                        />
                    </div>

                    {/* Google Meet */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800 mb-1">Cuộc họp Google Meet</p>
                                <p className="text-xs text-gray-500 leading-relaxed">Bạn sẽ được điều hướng để đăng nhập vào Google sau khi tạo cuộc họp để hoàn tất việc khởi tạo</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMeetEnabled(v => !v)}
                                className={`relative w-9 h-5 rounded-full transition-colors shrink-0 mt-0.5 ${meetEnabled ? 'bg-blue-500' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${meetEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Meeting room */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-800">Phòng họp</p>
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <HiPlus className="w-3.5 h-3.5" />
                                Thêm
                            </button>
                        </div>
                        <p className="text-sm text-gray-400">Chưa có phòng họp</p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex items-center gap-3 px-6 py-3 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                            <HiExclamation className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-amber-700 font-medium truncate">Không đồng bộ với Lịch Google</span>
                    </div>
                    <button onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors shrink-0">
                        Hủy bỏ
                    </button>
                    <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold shrink-0" style={{ backgroundColor: '#1a3f82' }}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LichPage() {
    const [showSyncBanner, setShowSyncBanner] = useState(true)
    const [eventSlot, setEventSlot] = useState<EventSlot | null>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    // Scroll to 8am on mount
    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.scrollTop = 8 * HOUR_HEIGHT - 16
        }
    }, [])

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <HanoiWorkHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <div className="w-[280px] border-r border-gray-200 flex flex-col shrink-0 bg-white">
                    {/* Create button */}
                    <div className="px-3 pt-4">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full text-sm font-semibold transition-colors shadow-sm w-full justify-center">
                            <HiPlus className="w-5 h-5" />
                            Tạo sự kiện
                        </button>
                    </div>

                    {/* Mini calendar */}
                    <MiniCalendar />

                    <div className="border-t border-gray-100 mt-2 mx-3" />

                    {/* Sidebar items */}
                    <div className="px-2 py-2 space-y-1">
                        {/* Lịch của tôi */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shrink-0 text-white text-xs font-bold">
                                H
                            </div>
                            <span className="flex-1 text-sm font-medium text-gray-800 text-left">Lịch của tôi</span>
                            <HiChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Đặt phòng họp */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                                <div className="w-4 h-4 border-2 border-white rounded-sm" />
                            </div>
                            <span className="flex-1 text-sm font-medium text-gray-800 text-left">Đặt phòng họp</span>
                            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">Mới</span>
                        </button>

                        {/* Đồng bộ lịch */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                            <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-white">
                                    <rect x="2" y="4" width="16" height="13" rx="2" />
                                    <rect x="6" y="2" width="2" height="4" rx="1" fill="white" opacity="0.8" />
                                    <rect x="12" y="2" width="2" height="4" rx="1" fill="white" opacity="0.8" />
                                </svg>
                            </div>
                            <span className="flex-1 text-sm font-medium text-gray-800 text-left">Đồng bộ lịch</span>
                            <HiChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex-1" />

                    {/* Search colleagues */}
                    <div className="px-3 py-3 border-t border-gray-100">
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Đối chiếu với đồng nghiệp"
                                className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Main calendar area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Calendar header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-gray-900">Tuần 20</span>
                                <span className="text-sm text-gray-400 ml-1">Tháng 5, 2026</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <HiChevronLeft className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <HiChevronRight className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-gray-500">
                                    <rect x="2" y="4" width="16" height="13" rx="2" />
                                </svg>
                                Yêu cầu phê duyệt
                            </button>
                            <button className="flex items-center gap-1 h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                Tuần <HiChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                Hôm nay
                            </button>
                        </div>
                    </div>

                    {/* Sync banner */}
                    {showSyncBanner && (
                        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200 shrink-0">
                            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                                <HiExclamation className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">Chưa đồng bộ với lịch Google.</span>
                            <button className="text-sm text-amber-600 font-semibold hover:underline">Đồng bộ ngay</button>
                            <button onClick={() => setShowSyncBanner(false)} className="ml-auto p-0.5 hover:bg-amber-100 rounded transition-colors">
                                <HiX className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    )}

                    {/* Day column headers */}
                    <div className="flex border-b border-gray-200 shrink-0">
                        <div className="w-16 shrink-0" />
                        {WEEK_DAYS.map((d, i) => {
                            const isToday = d.date === TODAY.day
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center py-2 border-l border-gray-100">
                                    <span className={`text-xs font-medium ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>{d.label}</span>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mt-0.5 text-sm font-bold ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                                        {d.date}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Time grid */}
                    <div ref={gridRef} className="flex-1 overflow-y-auto">
                        <div className="flex relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
                            {/* Time labels */}
                            <div className="w-16 shrink-0 relative">
                                <div className="text-[10px] text-gray-400 text-right pr-2 pt-0.5 sticky top-0">GMT+07</div>
                                {HOURS.map(h => (
                                    <div key={h} style={{ top: h * HOUR_HEIGHT }} className="absolute right-2 -translate-y-2.5 text-xs text-gray-400 whitespace-nowrap">
                                        {formatHour(h)}
                                    </div>
                                ))}
                            </div>

                            {/* Day columns */}
                            {WEEK_DAYS.map((d, colIdx) => (
                                <div key={colIdx} className="flex-1 border-l border-gray-100 relative">
                                    {/* Hour cells */}
                                    {HOURS.map(h => (
                                        <div key={h} style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                                            className="absolute inset-x-0 border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            onClick={() => setEventSlot({ dayIdx: colIdx, hour: h })} />
                                    ))}

                                    {/* Current time indicator on today's column */}
                                    {colIdx === CURRENT_DAY_IDX && (
                                        <div style={{ top: CURRENT_TOP }} className="absolute inset-x-0 flex items-center z-10 pointer-events-none">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 -ml-1.5 shrink-0" />
                                            <div className="flex-1 h-0.5 bg-blue-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create event modal */}
            {eventSlot && <CreateEventModal slot={eventSlot} onClose={() => setEventSlot(null)} />}

            {/* Floating AI button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-gray-600/80 hover:bg-gray-700 transition-colors">
                    <RiRobot2Fill className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
