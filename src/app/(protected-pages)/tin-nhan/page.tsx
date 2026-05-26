'use client'

import { useState } from 'react'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import {
    HiSearch,
    HiMail,
    HiCog,
    HiPencilAlt,
    HiPlus,
    HiVideoCamera,
    HiPhotograph,
    HiEmojiHappy,
    HiPaperClip,
    HiMicrophone,
    HiAnnotation,
    HiCalendar,
    HiCheckCircle,
    HiClock,
    HiChevronDown,
    HiCollection,
    HiX,
    HiFolder,
    HiChartBar,
    HiFilter,
    HiSwitchVertical,
    HiViewList,
    HiSparkles,
    HiBell,
    HiRefresh,
    HiExclamation,
    HiEye,
    HiTag,
    HiLink,
    HiDocumentText,
    HiLocationMarker,
    HiUser,
    HiUsers,
    HiFlag,
} from 'react-icons/hi'
import { RiRobot2Fill } from 'react-icons/ri'
import type { ComponentType } from 'react'

type IconComp = ComponentType<{ className?: string; color?: string }>

// ── Conversation data ─────────────────────────────────────────────────────────

type Conversation = {
    id: number
    name: string
    preview: string
    time: string
    avatarType: 'group' | 'ai' | 'color'
    avatarColor?: string
    verified?: boolean
    badge?: 'Bot' | 'AI'
    active?: boolean
}

const conversations: Conversation[] = [
    { id: 1, name: 'vitechgroup', preview: 'Liên: 🔥', time: '12 giờ', avatarType: 'group', active: true },
    { id: 2, name: 'Thông báo Hệ thống', preview: 'Bạn đã nhập thông tin đăng nhã...', time: '22 giờ', avatarType: 'color', avatarColor: '#22c55e', verified: true, badge: 'Bot' },
    { id: 3, name: 'Phòng Kinh tế xã', preview: '🌸 🎉 Lê Anh Tuấn đã tạo côn...', time: 'Hôm qua', avatarType: 'color', avatarColor: '#6366f1' },
    { id: 4, name: 'Thông báo bài viết', preview: 'Quản trị viên Trần Hồng Anh nh...', time: '7 ngày', avatarType: 'color', avatarColor: '#f59e0b', verified: true, badge: 'Bot' },
    { id: 5, name: 'Trợ lý chấm c...', preview: '⚠️ Sắp đến thời điểm chốt côn...', time: '27/04/2026', avatarType: 'color', avatarColor: '#3b82f6', verified: true, badge: 'Bot' },
    { id: 6, name: 'Trợ lý cuộc họp', preview: 'Xin lỗi anh chị, em đã bị từ chối...', time: '07/04/2026', avatarType: 'ai', avatarColor: '#8b5cf6', verified: true, badge: 'AI' },
    { id: 7, name: 'Thông báo hệ thống', preview: 'Kính gửi Quý Khách hàng, Để n...', time: '03/04/2026', avatarType: 'color', avatarColor: '#1a3f82', verified: true, badge: 'Bot' },
]

type Message = {
    id: number
    sender: string
    initial: string
    avatarColor: string
    content: string
    timestamp: string
    deleted?: boolean
    showTimestamp?: boolean
}

const messages: Message[] = [
    { id: 1, sender: 'Quách Sỹ Lâm', initial: 'Q', avatarColor: '#3b82f6', content: '👍', timestamp: '21:31, 9 tháng 04', showTimestamp: true },
    { id: 2, sender: 'Nguyễn Ngọc Tuấn', initial: 'T', avatarColor: '#6b7280', content: 'Tin nhắn đã bị xóa', timestamp: '18:38, 11 tháng 04', deleted: true, showTimestamp: true },
    { id: 3, sender: 'Nguyễn Xuân Minh', initial: 'NM', avatarColor: '#10b981', content: '👍', timestamp: '10:23, 14 tháng 04', showTimestamp: true },
    { id: 4, sender: 'Nguyễn Thị Kim Dung', initial: 'D', avatarColor: '#f59e0b', content: '👍', timestamp: '10:50, 14 tháng 04', showTimestamp: false },
    { id: 5, sender: 'Nguyễn Bích Lưu', initial: 'NL', avatarColor: '#ec4899', content: '👍', timestamp: '08:13, 15 tháng 04', showTimestamp: true },
    { id: 6, sender: 'Trần Thị Hương', initial: 'H', avatarColor: '#f97316', content: '👍', timestamp: '08:13, 15 tháng 04', showTimestamp: false },
    { id: 7, sender: 'Nguyễn Thị Liên', initial: 'L', avatarColor: '#a855f7', content: '👍', timestamp: '21:03, 15 tháng 05', showTimestamp: true },
]

// ── Calendar data (Lịch họp) ──────────────────────────────────────────────────

const calendarWeeks = [
    { month: 'Tháng 5/2026', weeks: ['Ngày 04 - Ngày 10/5', 'Ngày 11 - Ngày 17/5', 'Ngày 18 - Ngày 24/5', 'Ngày 25 - Ngày 31 tháng 5'] },
    { month: 'Tháng 6/2026', weeks: ['Ngày 01 - Ngày 07/6', 'Ngày 08 - Ngày 14/6', 'Ngày 15 - Ngày 21/6', 'Ngày 22 - Ngày 28/6', 'Ngày 29 - Ngày 05 tháng 7'] },
    { month: 'Tháng 7/2026', weeks: ['Ngày 06 - Ngày 12/7', 'Ngày 13 - Ngày 19/7', 'Ngày 20 - Ngày 26/7', 'Ngày 27 - Ngày 02 tháng 8'] },
    { month: 'Tháng 8/2026', weeks: ['Ngày 03 - Ngày 09/8', 'Ngày 10 - Ngày 16/8', 'Ngày 17 - Ngày 23/8', 'Ngày 24 - Ngày 30/8'] },
]

// ── Task departments (Nhiệm vụ) ───────────────────────────────────────────────

const departments = [
    'Văn phòng HĐND và UB...',
    'Trạm Y tế',
    'Trung tâm Dịch vụ tổng...',
    'Ban Quản lý dự án đầu ...',
    'Phòng Kinh tế',
    'Phòng Văn hóa - Xã hội',
]

// ── Right sidebar actions ─────────────────────────────────────────────────────

type RightAction = { Icon: IconComp; label: string; key: string }

const rightActions: RightAction[] = [
    { Icon: HiVideoCamera as IconComp, label: 'Cuộc họp', key: 'meeting' },
    { Icon: HiSearch as IconComp, label: 'Tìm kiếm', key: 'search' },
    { Icon: HiCollection as IconComp, label: 'Thư viện', key: 'library' },
    { Icon: HiAnnotation as IconComp, label: 'Chủ đề', key: 'topics' },
    { Icon: HiCalendar as IconComp, label: 'Tạo lịch họp', key: 'create-meeting' },
    { Icon: HiCheckCircle as IconComp, label: 'Tạo nhiệm vụ', key: 'create-task' },
    { Icon: HiClock as IconComp, label: 'Lịch sử hoạt động', key: 'history' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function ConvAvatar({ conv }: { conv: Conversation }) {
    if (conv.avatarType === 'group') {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <div className="flex -space-x-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-500" />
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-400" />
                </div>
            </div>
        )
    }
    if (conv.avatarType === 'ai') {
        return (
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: conv.avatarColor }}>
                <RiRobot2Fill className="w-5 h-5 text-white" />
            </div>
        )
    }
    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold" style={{ backgroundColor: conv.avatarColor }}>
            {conv.name.charAt(0)}
        </div>
    )
}

function ConversationList() {
    return (
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="px-3 pt-3 pb-2">
                <div className="relative mb-2">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Tìm kiếm" className="w-full h-8 pl-9 pr-3 bg-gray-100 rounded-full text-sm text-gray-700 placeholder-gray-400 outline-none" />
                </div>
                <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><HiMail className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><HiCog className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><HiPencilAlt className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                    <button key={conv.id} className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${conv.active ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <ConvAvatar conv={conv} />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 mb-0.5">
                                <span className="text-sm font-semibold text-gray-900 truncate">{conv.name}</span>
                                {conv.verified && <HiCheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                {conv.badge && (
                                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded shrink-0 ${conv.badge === 'AI' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {conv.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{conv.preview}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 self-start mt-1">{conv.time}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function ChatHeader() {
    return (
        <div className="h-14 flex items-center px-4 border-b border-gray-200 gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-gray-900">vitechgroup</span>
                    <button className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                        <HiCog className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <HiPlus className="w-4 h-4" />
                </button>
                <div className="flex -space-x-1.5">
                    {['#f97316', '#a855f7'].map((bg, i) => (
                        <div key={i} className="w-7 h-7 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: bg }}>
                            {['H', 'T'][i]}
                        </div>
                    ))}
                </div>
                <button className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    <span>+86</span>
                    <HiChevronDown className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

// Tab: Tin nhắn
function MessagesTab({ showTopicsPanel, onCloseTopics }: { showTopicsPanel: boolean; onCloseTopics: () => void }) {
    return (
        <div className="flex flex-1 overflow-hidden relative">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        {msg.showTimestamp && (
                            <div className="flex items-center justify-center mb-3">
                                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{msg.timestamp}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5" style={{ backgroundColor: msg.avatarColor }}>
                                {msg.initial}
                            </div>
                            <div className="min-w-0">
                                <span className="text-sm font-semibold text-gray-900">{msg.sender}</span>
                                <div className={`text-sm mt-0.5 ${msg.deleted ? 'italic text-gray-400' : 'text-gray-800'}`}>{msg.content}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showTopicsPanel && (
                <div className="w-72 border-l border-gray-200 bg-white flex flex-col shrink-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-800">Chủ đề đang hoạt động</span>
                        <button onClick={onCloseTopics} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <HiX className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                    <div className="flex border-b border-gray-100">
                        <button className="flex-1 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Đã tham gia</button>
                        <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Chưa tham gia</button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
                        <div className="relative">
                            <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center">
                                <HiAnnotation className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-2xl flex items-center justify-center">
                                <HiAnnotation className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">Chưa có chủ đề nào</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Date/time picker helpers ──────────────────────────────────────────────────

type DateVal = { year: number; month: number; day: number }
type PickerType = 'startDate' | 'startTime' | 'endDate' | 'endTime' | null

const VI_MONTHS = ['Th01','Th02','Th03','Th04','Th05','Th06','Th07','Th08','Th09','Th10','Th11','Th12']
const VI_DAY_COLS = ['T2','T3','T4','T5','T6','T7','CN']
const TODAY_VAL: DateVal = { year: 2026, month: 4, day: 16 }

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

function formatDateVal(d: DateVal): string {
    const date = new Date(d.year, d.month, d.day)
    const names = ['CN','T2','T3','T4','T5','T6','T7']
    return `${names[date.getDay()]}, ${String(d.day).padStart(2,'0')}/${String(d.month+1).padStart(2,'0')}/${d.year}`
}

const TIME_SLOTS: string[] = (() => {
    const s: string[] = []
    for (let h = 0; h < 24; h++)
        for (let m = 0; m < 60; m += 15) {
            const p = h < 12 ? 'AM' : 'PM'
            const dh = h === 0 ? 12 : h > 12 ? h - 12 : h
            s.push(`${dh}:${String(m).padStart(2,'0')} ${p}`)
        }
    return s
})()

function CalendarPicker({ value, onChange }: { value: DateVal; onChange: (d: DateVal) => void }) {
    const [dispYear, setDispYear] = useState(value.year)
    const [dispMonth, setDispMonth] = useState(value.month)
    const cells = generateCalendarDays(dispYear, dispMonth)
    const prevMonth = () => dispMonth === 0 ? (setDispMonth(11), setDispYear(y => y - 1)) : setDispMonth(m => m - 1)
    const nextMonth = () => dispMonth === 11 ? (setDispMonth(0), setDispYear(y => y + 1)) : setDispMonth(m => m + 1)
    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-60" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
                <button onClick={prevMonth} className="px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 text-sm font-medium">{'<'}</button>
                <span className="text-sm font-semibold text-gray-700">{VI_MONTHS[dispMonth]} {dispYear}</span>
                <button onClick={nextMonth} className="px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 text-sm font-medium">{'>'}</button>
            </div>
            <div className="grid grid-cols-7 mb-1">
                {VI_DAY_COLS.map(d => <div key={d} className="text-center text-xs text-gray-400 py-0.5">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((cell, i) => {
                    const isSel = cell.cur && cell.day === value.day && dispYear === value.year && dispMonth === value.month
                    const isToday = cell.cur && cell.day === TODAY_VAL.day && dispYear === TODAY_VAL.year && dispMonth === TODAY_VAL.month
                    return (
                        <button key={i}
                            onClick={() => cell.cur && onChange({ year: dispYear, month: dispMonth, day: cell.day })}
                            className={`h-7 rounded-full text-xs transition-colors ${isSel ? 'bg-blue-600 text-white font-bold' : isToday ? 'bg-blue-100 text-blue-700 font-semibold' : cell.cur ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-default'}`}
                        >
                            {cell.day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function TimePicker({ onSelect }: { onSelect: (t: string) => void }) {
    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-y-auto max-h-52 w-36" onClick={e => e.stopPropagation()}>
            {TIME_SLOTS.map(slot => (
                <button key={slot} onClick={() => onSelect(slot)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
                    {slot}
                </button>
            ))}
        </div>
    )
}

// Modal: Tạo cuộc họp
function CreateMeetingModal({ onClose }: { onClose: () => void }) {
    const [meetingName, setMeetingName] = useState('')
    const [googleMeet, setGoogleMeet] = useState(true)
    const [startDate, setStartDate] = useState<DateVal>(TODAY_VAL)
    const [endDate, setEndDate] = useState<DateVal>(TODAY_VAL)
    const [startTime, setStartTime] = useState('9:32 AM')
    const [endTime, setEndTime] = useState('10:02 AM')
    const [pickerAnchor, setPickerAnchor] = useState<{ type: PickerType; rect: DOMRect } | null>(null)

    const openPicker = (type: PickerType, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        setPickerAnchor(prev => prev?.type === type ? null : { type, rect })
    }
    const closePicker = () => setPickerAnchor(null)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => { closePicker(); onClose() }}>

            {/* Floating pickers (rendered at fixed viewport position) */}
            {pickerAnchor && (
                <div style={{ position: 'fixed', top: pickerAnchor.rect.bottom + 4, left: pickerAnchor.rect.left, zIndex: 60 }}>
                    {pickerAnchor.type === 'startDate' && <CalendarPicker value={startDate} onChange={d => { setStartDate(d); closePicker() }} />}
                    {pickerAnchor.type === 'startTime' && <TimePicker onSelect={t => { setStartTime(t); closePicker() }} />}
                    {pickerAnchor.type === 'endDate' && <CalendarPicker value={endDate} onChange={d => { setEndDate(d); closePicker() }} />}
                    {pickerAnchor.type === 'endTime' && <TimePicker onSelect={t => { setEndTime(t); closePicker() }} />}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 pt-6 pb-2" onClick={closePicker}>
                    {/* Title */}
                    <input
                        type="text"
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                        placeholder="Tên cuộc họp"
                        className="w-full text-lg text-gray-700 placeholder-gray-300 border-b-2 border-blue-500 outline-none pb-2 mb-5 bg-transparent"
                        onClick={e => e.stopPropagation()}
                    />

                    {/* Date/time row */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                    <HiClock className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Bắt đầu</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={e => openPicker('startDate', e)} className={`flex-1 h-9 px-3 rounded-lg flex items-center text-sm text-gray-700 transition-colors ${pickerAnchor?.type === 'startDate' ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    {formatDateVal(startDate)}
                                </button>
                                <button onClick={e => openPicker('startTime', e)} className={`w-24 h-9 px-3 rounded-lg flex items-center text-sm text-gray-700 font-medium transition-colors ${pickerAnchor?.type === 'startTime' ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    {startTime}
                                </button>
                            </div>
                        </div>
                        <div className="text-gray-400 shrink-0 mt-5">→</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center shrink-0">
                                    <HiClock className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Kết thúc</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={e => openPicker('endDate', e)} className={`flex-1 h-9 px-3 rounded-lg flex items-center text-sm text-gray-700 transition-colors ${pickerAnchor?.type === 'endDate' ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    {formatDateVal(endDate)}
                                </button>
                                <button onClick={e => openPicker('endTime', e)} className={`w-24 h-9 px-3 rounded-lg flex items-center text-sm text-gray-700 font-medium transition-colors ${pickerAnchor?.type === 'endTime' ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    {endTime}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Event type + all day */}
                    <div className="flex items-center gap-3 mb-4">
                        <button className="flex items-center gap-2 h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                            <div className="w-3.5 h-3.5 border border-gray-300 rounded-sm" />
                            Chọn loại sự kiện
                            <HiChevronDown className="w-4 h-4" />
                        </button>
                        <div className="flex-1 flex items-center justify-end gap-2">
                            <span className="text-sm text-gray-600">Đây là một sự kiện cả ngày</span>
                            <button className="w-10 h-5 rounded-full bg-gray-200 relative transition-colors">
                                <div className="w-4 h-4 bg-white rounded-full shadow absolute top-0.5 left-0.5" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Người chủ trì */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Người chủ trì</p>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">H</span>
                            </div>
                            <button className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                                <HiPlus className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Người tham gia */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Người tham gia</p>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">H</span>
                            </div>
                            <button className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                                <HiPlus className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Mời qua Email */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Mời qua Email</p>
                        <input type="email" placeholder="Nhập email khách mời..."
                            className="w-full h-9 px-3 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-b border-gray-200 focus:border-blue-400 transition-colors"
                            onClick={e => e.stopPropagation()} />
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Google Meet */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800">Cuộc họp Google Meet</span>
                            <button onClick={e => { e.stopPropagation(); setGoogleMeet(v => !v) }}
                                className={`w-10 h-5 rounded-full relative transition-colors ${googleMeet ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${googleMeet ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                        {googleMeet && (
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Bạn sẽ được điều hướng để đăng nhập vào Google sau khi tạo cuộc họp để hoàn tất việc khởi tạo
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Phòng họp */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800">Phòng họp</span>
                            <button className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition-colors">
                                <HiPlus className="w-3.5 h-3.5" /> Thêm
                            </button>
                        </div>
                        <p className="text-sm text-gray-400">Chưa có phòng họp</p>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Lặp lại + nhắc nhở */}
                    <div className="flex items-center gap-3 mb-4">
                        <button className="flex-1 flex items-center gap-2 h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <HiRefresh className="w-4 h-4 text-gray-400" />
                            Không lặp lại
                            <HiChevronDown className="w-4 h-4 ml-auto" />
                        </button>
                        <button className="flex-1 flex items-center gap-2 h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <HiBell className="w-4 h-4 text-gray-400" />
                            Nhắc trước 10 phút
                            <HiChevronDown className="w-4 h-4 ml-auto" />
                        </button>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Nội dung */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Nội dung cuộc họp</p>
                        <textarea rows={3} placeholder="Nhập nội dung..."
                            className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none resize-none focus:bg-gray-100 transition-colors"
                            onClick={e => e.stopPropagation()} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-2 text-sm text-orange-500">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <HiExclamation className="w-3 h-3 text-orange-500" />
                        </div>
                        Không đồng bộ với Lịch Google
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy bỏ</button>
                        <button className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Tab: Lịch họp
function MeetingsTab() {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="flex flex-1 overflow-hidden">
            {showModal && <CreateMeetingModal onClose={() => setShowModal(false)} />}
            <div className="w-64 border-r border-gray-200 overflow-y-auto shrink-0">
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Tháng 5/2026</span>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                        Tạo mới <HiPlus className="w-4 h-4" />
                    </button>
                </div>
                {calendarWeeks.map(({ month, weeks }) => (
                    <div key={month} className="mb-2">
                        <p className="px-4 py-1.5 text-xs font-semibold text-gray-700">{month}</p>
                        {weeks.map((week) => (
                            <button key={week} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                                <span className="w-4 h-px bg-gray-300 shrink-0" />
                                <span className="text-sm text-gray-600">{week}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { bg: '#fef3c7', fg: '#f59e0b' },
                        { bg: '#d1fae5', fg: '#10b981' },
                        { bg: '#dbeafe', fg: '#3b82f6' },
                        { bg: '#fce7f3', fg: '#ec4899' },
                    ].map(({ bg, fg }, i) => (
                        <div key={i} className="w-20 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: fg, opacity: 0.6 }} />
                        </div>
                    ))}
                </div>
                <p className="text-base font-semibold text-gray-700">Chưa có cuộc họp trong nhóm</p>
                <p className="text-sm text-gray-400 text-center">Khi bạn tạo cuộc họp, chi tiết cuộc họp sẽ xuất hiện ở đây</p>
                <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors">
                    Tạo cuộc họp
                </button>
            </div>
        </div>
    )
}

// Modal: Tạo nhiệm vụ
function CreateTaskModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [qty, setQty] = useState(1)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="h-12 flex items-center justify-between px-5 border-b border-gray-200 shrink-0">
                <span className="text-sm text-gray-600">Nhiệm vụ của tôi</span>
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">Lưu</button>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Banner */}
                    <div className="mx-6 mt-5 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 45%, #f97316 100%)' }}>
                        <div className="flex items-center px-4 py-3 gap-3">
                            <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0">
                                <circle cx="20" cy="20" r="19" fill="#DA251D" />
                                <polygon fill="#FFFF00" points="20,5 22.9,14.3 32.8,14.3 24.9,20.1 27.8,29.4 20,23.6 12.2,29.4 15.1,20.1 7.2,14.3 17.1,14.3" />
                            </svg>
                            <p className="text-white text-xs font-bold leading-relaxed">
                                PHƯƠNG CHÂM 6 RÕ: RÕ NGƯỜI, RÕ VIỆC, RÕ THỜI GIAN, RÕ TRÁCH NHIỆM, RÕ SẢN PHẨM, RÕ THẨM QUYỀN
                            </p>
                        </div>
                    </div>

                    {/* Icon buttons */}
                    <div className="flex items-center gap-1 px-6 mt-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"><HiFlag className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"><HiEye className="w-4 h-4" /></button>
                    </div>

                    {/* Title */}
                    <div className="px-6 mt-1">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề nhiệm vụ..."
                            className="w-full text-2xl text-gray-800 placeholder-gray-300 outline-none bg-transparent py-2"
                        />
                    </div>

                    {/* Nội dung */}
                    <div className="px-6 mt-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Nội dung</p>
                        <div className="flex items-center gap-0.5 border border-gray-200 rounded-t-lg px-2 py-1.5 bg-gray-50 flex-wrap">
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500 text-sm w-6">↺</button>
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500 text-sm w-6">↻</button>
                            <div className="w-px h-4 bg-gray-300 mx-1" />
                            {['H₁','H₂'].map(h => <button key={h} className="px-1.5 py-0.5 hover:bg-gray-200 rounded text-gray-600 text-xs font-bold">{h}</button>)}
                            <div className="w-px h-4 bg-gray-300 mx-1" />
                            <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded text-gray-600 text-xs font-bold">B</button>
                            <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded text-gray-600 text-xs italic font-serif">I</button>
                            <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded text-gray-600 text-xs line-through">S</button>
                            <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded text-gray-600 text-xs font-mono">{'<>'}</button>
                            <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded text-gray-600 text-xs font-serif">&quot;</button>
                            <div className="w-px h-4 bg-gray-300 mx-1" />
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><HiViewList className="w-3.5 h-3.5" /></button>
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><HiViewList className="w-3.5 h-3.5 rotate-180" /></button>
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><HiLink className="w-3.5 h-3.5" /></button>
                            <div className="flex-1" />
                            <button className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700 whitespace-nowrap">
                                <HiSparkles className="w-3.5 h-3.5" /> Viết mô tả bằng AI
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Nhập nội dung nhiệm vụ"
                            rows={6}
                            className="w-full px-3 py-3 border border-t-0 border-gray-200 rounded-b-lg text-sm text-gray-700 placeholder-gray-300 outline-none resize-none"
                        />
                    </div>

                    {/* Subtasks */}
                    <div className="px-6 mt-4 pb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-800">Nhiệm vụ con (0 / 0)</span>
                            <button className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700">
                                <HiSparkles className="w-3.5 h-3.5" /> AI tạo nhiệm vụ <HiChevronDown className="w-3 h-3" />
                            </button>
                        </div>
                        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                            <HiPlus className="w-4 h-4" /> Thêm nhiệm vụ con
                        </button>
                    </div>
                </div>

                <div className="w-px bg-gray-200 shrink-0" />

                {/* Right sidebar */}
                <div className="w-[380px] overflow-y-auto shrink-0 px-6 py-5 space-y-6">
                    {/* Thông tin */}
                    <div>
                        <p className="text-base font-semibold text-gray-900 mb-3">Thông tin</p>
                        <div className="space-y-1">
                            {([
                                { Icon: HiLocationMarker, label: 'Vị trí', value: 'Nhiệm vụ của tôi', isTag: true },
                                { Icon: HiUser, label: 'Chủ trì', placeholder: 'Thêm đơn vị chủ trì' },
                                { Icon: HiUsers, label: 'Phối hợp', placeholder: 'Thêm đơn vị phối hợp' },
                                { Icon: HiCalendar, label: 'Thời hạn', placeholder: 'Thêm thời hạn' },
                                { Icon: HiTag, label: 'Nhãn dán', placeholder: 'Thêm nhãn dán' },
                            ] as const).map(({ Icon, label, value, placeholder, isTag }: any) => (
                                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                                    <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="text-sm text-gray-500 w-24 shrink-0">{label}</span>
                                    {isTag ? (
                                        <button className="text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors font-medium">
                                            {value} <HiChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                        </button>
                                    ) : (
                                        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">{placeholder}</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KPI */}
                    <div>
                        <p className="text-base font-semibold text-gray-900 mb-3">KPI nhiệm vụ</p>
                        <label className="flex items-center gap-2.5 mb-4 cursor-pointer">
                            <div className="w-4 h-4 border border-gray-300 rounded shrink-0" />
                            <span className="text-sm text-gray-700">Tính KPI theo nhiệm vụ con</span>
                        </label>
                        <div className="space-y-1">
                            {[
                                { label: 'Loại nhiệm vụ', value: 'Soạn thảo văn bản hành chính', blue: true },
                                { label: 'Sản phẩm', value: 'Văn bản (5 điểm)', blue: false },
                                { label: 'Hệ số quy đổi', value: '1', blue: false },
                            ].map(({ label, value, blue }) => (
                                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                                    <span className="text-sm text-gray-500 flex-1">{label}</span>
                                    {blue ? (
                                        <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">{value}</span>
                                    ) : (
                                        <span className="text-sm text-gray-700">{value}</span>
                                    )}
                                </div>
                            ))}
                            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                                <span className="text-sm text-gray-500 flex-1">Số lượng giao</span>
                                <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))}
                                    className="w-28 h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-300 text-right" />
                            </div>
                        </div>
                        <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                                <HiClock className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-500">SL giao quy đổi</span>
                                <span className="text-sm font-semibold text-gray-800 ml-auto">{qty}</span>
                            </div>
                            <p className="text-xs text-gray-400 pl-6">= Số lượng giao*Hệ số quy đổi</p>
                        </div>
                    </div>

                    {/* Văn bản & Đính kèm */}
                    <div className="space-y-4">
                        {[
                            { Icon: HiDocumentText, label: 'Văn bản giao nhiệm vụ (0)' },
                            { Icon: HiPaperClip, label: 'Đính kèm (0)' },
                        ].map(({ Icon, label }) => (
                            <div key={label} className="flex items-center justify-between py-1">
                                <button className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-gray-600 transition-colors">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                    {label}
                                    <HiChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                    <HiPlus className="w-3.5 h-3.5" /> Thêm
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

// Tab: Nhiệm vụ
function TasksTab() {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="flex flex-1 overflow-hidden">
            {showModal && <CreateTaskModal onClose={() => setShowModal(false)} />}
            <div className="w-64 border-r border-gray-200 flex flex-col shrink-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-base font-semibold text-gray-800">Danh sách</span>
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"><HiPlus className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"><HiViewList className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                        <HiChartBar className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700">Thống kê chung</span>
                    </button>
                    {departments.map((dept) => (
                        <button key={dept} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                            <HiFolder className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{dept}</span>
                        </button>
                    ))}
                </div>
                <button className="flex items-center justify-between px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <HiCollection className="w-4 h-4 text-gray-400" />
                        <span>Lưu trữ</span>
                    </div>
                    <HiChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                </button>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100">
                    <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <HiFilter className="w-4 h-4" /> Bộ lọc
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <HiSwitchVertical className="w-4 h-4" /> Sắp xếp
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <HiViewList className="w-4 h-4" /> Hiển thị
                    </button>
                    <div className="flex-1" />
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Tìm kiếm" className="h-8 pl-9 pr-3 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none w-40" />
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">
                        <HiPlus className="w-4 h-4" /> Tạo
                        <HiChevronDown className="w-3 h-3" />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-400 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                        <HiSparkles className="w-4 h-4" /> AI tạo nhiệm vụ
                        <HiChevronDown className="w-3 h-3" />
                    </button>
                </div>
                <div className="px-4 py-2 border-b border-gray-100">
                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        <HiPlus className="w-4 h-4" /> Thêm mô tả
                    </button>
                </div>
                <div className="flex-1" />
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = 'messages' | 'meetings' | 'tasks' | 'topics'

export default function TinNhanPage() {
    const [activeTab, setActiveTab] = useState<Tab>('messages')
    const [showTopicsPanel, setShowTopicsPanel] = useState(false)

    const tabs = [
        { key: 'messages' as Tab, label: 'Tin nhắn', Icon: HiAnnotation },
        { key: 'meetings' as Tab, label: 'Lịch họp', Icon: HiCalendar },
        { key: 'tasks' as Tab, label: 'Nhiệm vụ', Icon: HiCheckCircle },
        { key: 'topics' as Tab, label: 'Chủ đề', Icon: HiAnnotation },
    ]

    const handleTabClick = (key: Tab) => {
        setActiveTab(key)
        if (key === 'topics') setShowTopicsPanel(true)
        else setShowTopicsPanel(false)
    }

    const handleRightAction = (key: string) => {
        if (key === 'topics') {
            setShowTopicsPanel((v) => !v)
            setActiveTab('messages')
        }
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <HanoiWorkHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Far-left icon strip */}
                <div className="w-[52px] bg-white border-r border-gray-100 flex flex-col items-center py-3 gap-1 shrink-0">
                    {[
                        { label: 'Tất cả', active: true, color: '#1a3f82', bg: '#dbeafe' },
                        { label: 'Chưa đọc', active: false, color: '#16a34a', bg: '#dcfce7' },
                        { label: 'Chủ đề phụ', active: false, color: '#16a34a', bg: '#dcfce7' },
                    ].map(({ label, active, color, bg }) => (
                        <button key={label} title={label} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ backgroundColor: active ? bg : 'transparent' }}>
                            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: color }}>
                                <HiAnnotation className="w-3 h-3 text-white" />
                            </div>
                        </button>
                    ))}
                    <div className="flex-1" />
                    <button className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <HiPlus className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Conversation list */}
                <ConversationList />

                {/* Main chat area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ChatHeader />

                    {/* Tab bar */}
                    <div className="flex items-center border-b border-gray-200 px-4 shrink-0">
                        {tabs.map(({ key, label, Icon }) => {
                            const isActive = activeTab === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleTabClick(key)}
                                    className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                                        isActive
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab content */}
                    <div className="flex flex-1 overflow-hidden flex-col">
                        {activeTab === 'messages' && (
                            <>
                                <MessagesTab showTopicsPanel={showTopicsPanel} onCloseTopics={() => setShowTopicsPanel(false)} />
                                {/* Composer */}
                                <div className="border-t border-gray-200 px-4 py-3 shrink-0">
                                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                        <div className="text-sm text-gray-400 mb-3">Trả lời...</div>
                                        <div className="flex items-center gap-3">
                                            {[HiPhotograph, HiCollection, HiMail, HiPaperClip, HiEmojiHappy, HiPencilAlt, HiMicrophone].map((Icon, i) => (
                                                <button key={i} className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Icon className="w-5 h-5" />
                                                </button>
                                            ))}
                                            <div className="flex-1" />
                                            <button className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                                                <span className="text-sm">👍</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === 'meetings' && <MeetingsTab />}
                        {activeTab === 'tasks' && <TasksTab />}
                        {activeTab === 'topics' && (
                            <MessagesTab showTopicsPanel={true} onCloseTopics={() => setActiveTab('messages')} />
                        )}
                    </div>
                </div>

                {/* Right action sidebar */}
                <div className="w-[60px] bg-white border-l border-gray-100 flex flex-col items-center py-3 gap-1 shrink-0">
                    {rightActions.map(({ Icon, label, key }) => {
                        const isTopics = key === 'topics' && showTopicsPanel
                        return (
                            <button
                                key={key}
                                title={label}
                                onClick={() => handleRightAction(key)}
                                className={`w-10 h-10 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors group ${isTopics ? 'bg-pink-500' : 'hover:bg-gray-100'}`}
                            >
                                <Icon className={`w-5 h-5 ${isTopics ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                <span className={`text-[9px] leading-none text-center line-clamp-1 w-full px-0.5 ${isTopics ? 'text-white' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
