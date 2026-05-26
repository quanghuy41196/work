'use client'

import { useState } from 'react'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import {
    HiPlus,
    HiSearch,
    HiStar,
    HiClock,
    HiDocumentText,
    HiChevronDown,
    HiChevronRight,
    HiX,
    HiDotsHorizontal,
    HiShare,
    HiFilter,
    HiSortAscending,
    HiMenuAlt1,
    HiMenuAlt2,
    HiMenuAlt3,
    HiViewList,
    HiInformationCircle,
} from 'react-icons/hi'
import { RiRobot2Fill } from 'react-icons/ri'

const TABS = ['Riêng tư', 'Công khai', 'Đã lưu trữ']

const NOTES = [
    { id: 1, title: 'Danh sách trực KCT nông dân', initials: 'DT', color: 'bg-teal-500', starred: false },
    { id: 2, title: 'Chưa có tiêu đề', initials: 'D', color: 'bg-gray-800', starred: false, selected: true },
    { id: 3, title: 'ghi chú', initials: 'G', color: 'bg-amber-500', starred: false },
    { id: 4, title: 'Chưa có tiêu đề', initials: 'C', color: 'bg-blue-600', starred: false },
    { id: 5, title: 'Chưa có tiêu đề', initials: 'N', color: 'bg-green-500', starred: false },
    { id: 6, title: 'Chưa có tiêu đề', initials: 'A', color: 'bg-pink-500', starred: false },
    { id: 7, title: 'Chưa có tiêu đề', initials: 'H', color: 'bg-purple-600', starred: false },
    { id: 8, title: 'Chưa có tiêu đề', initials: 'B', color: 'bg-gray-900', starred: false },
    { id: 9, title: 'Chưa có tiêu đề', initials: 'T', color: 'bg-orange-500', starred: false },
]

const TOOLBAR_FMT = [
    { label: 'B', cls: 'font-bold' },
    { label: 'I', cls: 'italic' },
    { label: 'U', cls: 'underline' },
    { label: 'S', cls: 'line-through' },
]

function NoteEditor({ title, onBack }: { title: string; onBack: () => void }) {
    const [noteTitle, setNoteTitle] = useState(title)
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <button onClick={onBack} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <HiChevronRight className="w-3.5 h-3.5 rotate-180" />
                        <HiDocumentText className="w-4 h-4" />
                        Các ghi chú
                    </button>
                    <HiChevronRight className="w-3.5 h-3.5" />
                    <div className="flex items-center gap-1.5 text-gray-700">
                        <HiDocumentText className="w-4 h-4" />
                        <span>{noteTitle || 'Chưa có tiêu đề'}</span>
                    </div>
                </div>
                <span className="text-xs text-gray-400">Chỉnh sửa -3s trước</span>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-4 py-2 border-b border-gray-200 shrink-0 bg-white">
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors mr-1">
                    <HiViewList className="w-4 h-4 text-gray-500" />
                </button>

                <button className="flex items-center gap-0.5 px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-600 transition-colors">
                    Text <HiChevronDown className="w-3 h-3 ml-0.5" />
                </button>

                <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-600 transition-colors">
                    Color <span className="text-xs font-semibold">Aa</span>
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                {TOOLBAR_FMT.map(({ label, cls }) => (
                    <button key={label} className={`w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-sm text-gray-600 transition-colors ${cls}`}>
                        {label}
                    </button>
                ))}

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><HiMenuAlt1 className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><HiMenuAlt2 className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><HiMenuAlt3 className="w-4 h-4 text-gray-500" /></button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                {/* List icons as inline SVG */}
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-gray-500">
                        <circle cx="2" cy="4" r="1.2"/><rect x="5" y="3.2" width="9" height="1.6" rx="0.8"/>
                        <circle cx="2" cy="8" r="1.2"/><rect x="5" y="7.2" width="9" height="1.6" rx="0.8"/>
                        <circle cx="2" cy="12" r="1.2"/><rect x="5" y="11.2" width="9" height="1.6" rx="0.8"/>
                    </svg>
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-gray-500">
                        <text x="1" y="5" fontSize="5" fontWeight="bold">1.</text>
                        <rect x="6" y="3.2" width="8" height="1.6" rx="0.8"/>
                        <text x="1" y="9" fontSize="5" fontWeight="bold">2.</text>
                        <rect x="6" y="7.2" width="8" height="1.6" rx="0.8"/>
                        <text x="1" y="13" fontSize="5" fontWeight="bold">3.</text>
                        <rect x="6" y="11.2" width="8" height="1.6" rx="0.8"/>
                    </svg>
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-gray-500">
                        <rect x="1" y="3" width="3" height="3" rx="0.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                        <rect x="6" y="3.2" width="8" height="1.6" rx="0.8"/>
                        <rect x="1" y="7" width="3" height="3" rx="0.5" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                        <rect x="6" y="7.2" width="8" height="1.6" rx="0.8"/>
                    </svg>
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 fill-gray-500">
                        <rect x="1" y="3" width="14" height="1.5" rx="0.75"/>
                        <rect x="4" y="6.5" width="11" height="1.5" rx="0.75"/>
                        <rect x="4" y="10" width="11" height="1.5" rx="0.75"/>
                        <rect x="1" y="13" width="14" height="1.5" rx="0.75"/>
                    </svg>
                </button>

                <button className="px-1.5 py-1 hover:bg-gray-100 rounded transition-colors text-xs font-mono text-gray-500">&lt;/&gt;</button>

                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <rect x="1" y="1" width="14" height="14" rx="1"/>
                        <line x1="1" y1="5.5" x2="15" y2="5.5"/>
                        <line x1="1" y1="10.5" x2="15" y2="10.5"/>
                        <line x1="5.5" y1="1" x2="5.5" y2="15"/>
                        <line x1="10.5" y1="1" x2="10.5" y2="15"/>
                    </svg>
                </button>

                <div className="flex-1" />

                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><HiStar className="w-4 h-4 text-gray-400" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><HiInformationCircle className="w-4 h-4 text-gray-400" /></button>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><HiDotsHorizontal className="w-4 h-4 text-gray-400" /></button>
            </div>

            {/* Editor body */}
            <div className="flex flex-1 overflow-hidden">
                {/* TOC sidebar */}
                <div className="w-48 border-r border-gray-100 px-3 pt-4 shrink-0">
                    <p className="text-xs text-gray-400 leading-relaxed">Các tiêu đề sẽ được hiển thị ở đây để điều hướng</p>
                </div>

                {/* Main editor */}
                <div className="flex-1 overflow-y-auto px-16 pt-10 pb-16">
                    <input
                        type="text"
                        value={noteTitle}
                        onChange={e => setNoteTitle(e.target.value)}
                        placeholder="Chưa có tiêu đề"
                        className="w-full text-4xl font-bold text-gray-800 placeholder-gray-300 outline-none bg-transparent mb-6"
                        autoFocus
                    />
                    <div className="relative">
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            onInput={() => {}}
                            className="w-full min-h-[300px] text-sm text-gray-700 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300"
                            data-placeholder="Ấn '/' để nhận lệnh..."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function GhiChuPage() {
    const [activeTab, setActiveTab] = useState('Công khai')
    const [showNotif, setShowNotif] = useState(true)
    const [view, setView] = useState<'list' | 'editor'>('list')
    const [notes, setNotes] = useState(NOTES)

    const toggleStar = (id: number) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n))
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <HanoiWorkHeader />

            {view === 'editor' ? (
                <NoteEditor title="" onBack={() => setView('list')} />
            ) : (
                <>
                    {/* Page header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-2">
                            <HiDocumentText className="w-5 h-5 text-gray-500" />
                            <span className="text-base font-semibold text-gray-800">Các ghi chú</span>
                        </div>
                        <button
                            onClick={() => setView('editor')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                            <HiPlus className="w-4 h-4" />
                            Tạo ghi chú
                        </button>
                    </div>

                    {/* Tabs + toolbar */}
                    <div className="flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-0">
                            {TABS.map(tab => (
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
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <HiSearch className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <HiSortAscending className="w-4 h-4" />
                                Ngày chỉnh sửa
                                <HiChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <HiFilter className="w-4 h-4" />
                                Bộ lọc
                                <HiChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Note list */}
                    <div className="flex-1 overflow-y-auto">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => setView('editor')}
                                className={`flex items-center px-6 py-3 border-b border-gray-100 cursor-pointer group transition-colors ${
                                    note.selected ? 'bg-gray-100' : 'hover:bg-gray-50'
                                }`}
                            >
                                <HiDocumentText className="w-4 h-4 text-gray-400 shrink-0 mr-3" />
                                <span className="flex-1 text-sm text-gray-700">{note.title}</span>

                                {/* Hover actions */}
                                <div className="hidden group-hover:flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full ${note.color} flex items-center justify-center`}>
                                        <span className="text-white text-[10px] font-bold">{note.initials.charAt(0)}</span>
                                    </div>
                                    <button onClick={e => e.stopPropagation()} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <HiShare className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button onClick={e => e.stopPropagation()} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <HiClock className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); toggleStar(note.id) }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <HiStar className={`w-4 h-4 ${note.starred ? 'text-yellow-400' : 'text-gray-400'}`} />
                                    </button>
                                    <button onClick={e => e.stopPropagation()} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <HiDotsHorizontal className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                {/* Default visible: avatar + star if starred */}
                                <div className="flex group-hover:hidden items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full ${note.color} flex items-center justify-center`}>
                                        <span className="text-white text-[10px] font-bold">{note.initials.charAt(0)}</span>
                                    </div>
                                    {note.starred && <HiStar className="w-4 h-4 text-yellow-400" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Notification popup */}
            {showNotif && (
                <div className="fixed bottom-6 left-6 z-50 w-[260px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-semibold text-gray-700">Tin nhắn mới</span>
                        </div>
                        <button onClick={() => setShowNotif(false)} className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                            <HiX className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">X</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">vitechgroup</p>
                            <p className="text-xs text-gray-500 truncate">Chấm: 🔥</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating AI button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white bg-gray-600/80 hover:bg-gray-700 transition-colors">
                    <RiRobot2Fill className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
