'use client'

import { useState } from 'react'
import Link from 'next/link'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import {
    HiViewGrid,
    HiUsers,
    HiPlus,
    HiCheckCircle,
    HiThumbUp,
    HiAnnotation,
    HiUpload,
    HiDotsHorizontal,
    HiGlobe,
    HiX,
    HiShare,
    HiLockClosed,
} from 'react-icons/hi'
import { RiRobot2Fill } from 'react-icons/ri'

// ── Data ──────────────────────────────────────────────────────────────────────

const myGroups = [
    {
        name: 'Triển Khai Nghị quyết 57-NQ/TW trên địa bàn thành phố Hà Nội',
        meta: '8 bài viết · 39.1k thành viên',
        bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        verified: true,
    },
    {
        name: 'THÀNH PHỐ HÀ NỘI',
        meta: '1.5k bài viết · 39.2k thành viên',
        bg: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
        verified: true,
    },
    {
        name: 'Phòng Kinh tế xã',
        meta: '0 bài viết · 39 thành viên',
        bg: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
        verified: false,
    },
]

type GroupPost = {
    id: number
    authorName: string
    authorInitial: string
    authorColor: string
    groupName: string
    groupVerified: boolean
    time: string
    content: string
    images: string[]
    totalImages: number
    likes: number
    viewers: number
}

const groupPosts: GroupPost[] = [
    {
        id: 1,
        authorName: 'Nguyễn Khắc Khải',
        authorInitial: 'K',
        authorColor: '#3b82f6',
        groupName: 'THÀNH PHỐ HÀ NỘI',
        groupVerified: true,
        time: '22 giờ',
        content:
            'QUỐC OAI CHI TRẢ HƠN 1,47 TỶ ĐỒNG BỒI THƯỜNG GPMB DỰ ÁN ĐƯỜNG DÂY 220KV CẤP ĐIỆN CHO TRẠM BIẾN ÁP HÒA LẠC\n\nSáng ngày 15/5/2026, UBND xã Quốc Oai phối hợp cùng các đơn vị liên quan tổ chức chi trả tiền bồi thường, hỗ trợ giải phóng mặt bằng cho các hộ dân có đất nông nghiệp thu hồi để thực hiện dự án xây dựng tuyến đường dây 220kV cấp điện cho Trạm biến áp 220/110kV Hòa Lạc và các đường dây 110kV xuất tuyến....',
        images: [
            'linear-gradient(135deg, #c8d4dc 0%, #a8b8c4 100%)',
            'linear-gradient(135deg, #d0dae2 0%, #b0c0cc 100%)',
            'linear-gradient(135deg, #c0ccd6 0%, #a0b0bc 100%)',
            'linear-gradient(135deg, #c4d0da 0%, #a4b4c0 100%)',
            'linear-gradient(135deg, #ccd6e0 0%, #acbcc8 100%)',
        ],
        totalImages: 8,
        likes: 6,
        viewers: 70,
    },
    {
        id: 2,
        authorName: 'Trần Thị Hoa',
        authorInitial: 'H',
        authorColor: '#10b981',
        groupName: 'Triển Khai Nghị quyết 57-NQ/TW',
        groupVerified: true,
        time: '1 ngày',
        content:
            'Triển khai Nghị quyết số 57-NQ/TW ngày 22/12/2023 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia trên địa bàn thành phố Hà Nội. Các cấp ủy, chính quyền đã tổ chức quán triệt, học tập và xây dựng kế hoạch thực hiện nghiêm túc.',
        images: [
            'linear-gradient(135deg, #d4e4d0 0%, #b4c8ac 100%)',
            'linear-gradient(135deg, #c8dcc4 0%, #a8c0a0 100%)',
        ],
        totalImages: 2,
        likes: 18,
        viewers: 142,
    },
]

type SuggestedGroup = {
    name: string
    members: number
    bg: string
    hasPhoto?: boolean
}

const suggestedGroups: SuggestedGroup[] = [
    { name: 'Trạm y tế xã Thường Tín', members: 41, bg: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 60%, #f59e0b 100%)' },
    { name: 'TRUNG TÂM DỊCH VỤ TỔNG HỢP XÃ THƯỜNG TÍN', members: 31, bg: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 60%, #3b82f6 100%)' },
    { name: 'Cơ quan Ủy ban MTTQ Việt Nam xã', members: 23, bg: 'linear-gradient(135deg, #dcfce7 0%, #86efac 60%, #22c55e 100%)' },
    { name: 'PHÒNG VĂN HÓA XÃ THƯỜNG TÍN 1', members: 23, bg: 'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 60%, #ec4899 100%)' },
    { name: 'Phòng Văn Hoá - XH', members: 20, bg: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 60%, #8b5cf6 100%)' },
    { name: 'Tổ Hành chính - Tổng hợp và Truyền thông', members: 11, bg: 'linear-gradient(135deg, #fff7ed 0%, #fdba74 60%, #f97316 100%)' },
    { name: 'Thường trực HĐND xã và Chuyên trách', members: 10, bg: 'linear-gradient(135deg, #fef2f2 0%, #fca5a5 60%, #ef4444 100%)', hasPhoto: true },
    { name: 'Văn phòng Đảng ủy', members: 10, bg: 'linear-gradient(135deg, #f0fdf4 0%, #86efac 60%, #16a34a 100%)' },
    { name: 'Ban Xây dựng Đảng xã Thường Tín', members: 8, bg: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 60%, #d97706 100%)', hasPhoto: true },
    { name: 'Tổ Văn hoá và Thể thao', members: 7, bg: 'linear-gradient(135deg, #ecfdf5 0%, #6ee7b7 60%, #10b981 100%)', hasPhoto: true },
    { name: 'Ubkt đảng ủy vitechgroup', members: 6, bg: 'linear-gradient(135deg, #eff6ff 0%, #93c5fd 60%, #2563eb 100%)', hasPhoto: true },
    { name: 'Hỗ trợ Hanoiwork (test)', members: 5, bg: 'linear-gradient(135deg, #f5f3ff 0%, #c4b5fd 60%, #7c3aed 100%)', hasPhoto: true },
    { name: 'Cơ quan Hội LHPN xã Thường Tín', members: 5, bg: 'linear-gradient(135deg, #fdf4ff 0%, #f0abfc 60%, #d946ef 100%)' },
    { name: 'Phòng dân số vitechgroup', members: 3, bg: 'linear-gradient(135deg, #fefce8 0%, #fde68a 60%, #ca8a04 100%)' },
    { name: 'Công đoàn Ban QLDA', members: 2, bg: 'linear-gradient(135deg, #f0f9ff 0%, #7dd3fc 60%, #0284c7 100%)' },
    { name: 'Test', members: 2, bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 60%, #64748b 100%)' },
    { name: 'Khoa Phòng Bệnh, ATTP', members: 1, bg: 'linear-gradient(135deg, #fff1f2 0%, #fda4af 60%, #e11d48 100%)' },
    { name: 'Điểm Trạm Y Tế Khánh Hà', members: 1, bg: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 60%, #15803d 100%)' },
    { name: 'văn phòng', members: 1, bg: 'linear-gradient(135deg, #fafafa 0%, #d1d5db 60%, #6b7280 100%)' },
    { name: 'Test', members: 1, bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 60%, #94a3b8 100%)' },
    { name: 'An', members: 1, bg: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 60%, #b45309 100%)' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function PostImages({ images, total }: { images: string[]; total: number }) {
    const shown = images.length
    const extra = total > shown ? total - shown : 0

    if (!shown) return null

    if (shown === 1)
        return <div className="mt-2 rounded-lg overflow-hidden h-72" style={{ background: images[0] }} />

    if (shown === 2)
        return (
            <div className="mt-2 grid grid-cols-2 gap-0.5 h-60 rounded-lg overflow-hidden">
                {images.map((bg, i) => <div key={i} style={{ background: bg }} />)}
            </div>
        )

    if (shown === 3)
        return (
            <div className="mt-2 grid grid-cols-2 grid-rows-2 gap-0.5 h-60 rounded-lg overflow-hidden">
                <div className="row-span-2" style={{ background: images[0] }} />
                <div style={{ background: images[1] }} />
                <div style={{ background: images[2] }} />
            </div>
        )

    if (shown === 4)
        return (
            <div className="mt-2 grid grid-cols-2 gap-0.5 h-60 rounded-lg overflow-hidden">
                {images.map((bg, i) => <div key={i} style={{ background: bg }} />)}
            </div>
        )

    return (
        <div className="mt-2 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5 h-52">
                <div style={{ background: images[0] }} />
                <div style={{ background: images[1] }} />
            </div>
            <div className="grid grid-cols-3 gap-0.5 h-40 mt-0.5">
                <div style={{ background: images[2] }} />
                <div style={{ background: images[3] }} />
                <div className="relative" style={{ background: images[4] }}>
                    {extra > 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">+{extra}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function GroupPostCard({ post }: { post: GroupPost }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-start justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: post.authorColor }}
                    >
                        {post.authorInitial}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">
                            {post.authorName}{' '}
                            <span className="text-gray-400 font-normal mx-0.5">▶</span>
                            {post.groupName}
                            {post.groupVerified && (
                                <HiCheckCircle className="inline w-3.5 h-3.5 text-blue-500 ml-0.5 -mt-0.5" />
                            )}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            {post.time} · <HiGlobe className="w-3 h-3" />
                        </p>
                    </div>
                </div>
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                    <HiDotsHorizontal className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="px-4 pb-1">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {post.content}{' '}
                    <button className="text-blue-600 font-medium hover:underline">Xem thêm</button>
                </p>
            </div>

            <div className="px-4">
                <PostImages images={post.images} total={post.totalImages} />
            </div>

            <div className="flex items-center justify-between px-4 py-2 mt-1">
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <span className="w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center">
                        <HiThumbUp className="w-2.5 h-2.5 text-white" />
                    </span>
                    {post.likes}
                </span>
                <span className="text-xs text-gray-500">{post.viewers} người xem</span>
            </div>

            <div className="mx-4 border-t border-gray-100" />

            <div className="flex items-center px-2 py-1">
                {[
                    { Icon: HiThumbUp, label: 'Thích' },
                    { Icon: HiAnnotation, label: 'Bình luận' },
                    { Icon: HiUpload, label: 'Chia sẻ' },
                ].map(({ Icon, label }) => (
                    <button
                        key={label}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 text-sm font-medium"
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}

function SuggestedGroupCard({ group }: { group: SuggestedGroup }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-36" style={{ background: group.bg }}>
                <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                    <HiShare className="w-3.5 h-3.5 text-gray-600" />
                </button>
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{group.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <HiLockClosed className="w-3 h-3" />
                    {group.members} thành viên
                </p>
                <button className="mt-auto w-full py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Tham gia
                </button>
            </div>
        </div>
    )
}

type View = 'feed' | 'suggested'

function GroupsLeftSidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
    return (
        <aside className="w-[280px] shrink-0 bg-white border-r border-gray-200 sticky top-0 min-h-[calc(100vh-64px)]">
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Nhóm</h2>

                <div className="space-y-0.5 mb-3">
                    <button
                        onClick={() => setView('feed')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${view === 'feed' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${view === 'feed' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                            <HiViewGrid className={`w-5 h-5 ${view === 'feed' ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className={`font-semibold text-sm ${view === 'feed' ? 'text-blue-700' : 'text-gray-700'}`}>
                            Bảng tin của bạn
                        </span>
                    </button>
                    <button
                        onClick={() => setView('suggested')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${view === 'suggested' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${view === 'suggested' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                            <HiUsers className={`w-5 h-5 ${view === 'suggested' ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className={`font-medium text-sm ${view === 'suggested' ? 'text-blue-700' : 'text-gray-700'}`}>
                            Nhóm đề xuất
                        </span>
                    </button>
                </div>

                <Link
                    href="/tao-nhom"
                    className="flex items-center justify-center gap-2 w-full py-2.5 mb-4 border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                    <HiPlus className="w-4 h-4" />
                    Tạo nhóm mới
                </Link>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">Nhóm bạn tham gia</h3>
                        <button className="text-xs text-blue-600 font-medium hover:underline">
                            Xem tất cả
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {myGroups.map(({ name, meta, bg, verified }) => (
                            <button
                                key={name}
                                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg shrink-0"
                                    style={{ background: bg }}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-start gap-1">
                                        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                                            {name}
                                        </p>
                                        {verified && (
                                            <HiCheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{meta}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}

function NewMessagePopup() {
    const [open, setOpen] = useState(true)
    if (!open) return null
    return (
        <div className="fixed bottom-0 left-[280px] z-40 w-64 bg-white rounded-t-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <HiAnnotation className="w-4 h-4 text-blue-500" />
                    Tin nhắn mới
                </span>
                <button
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <HiX className="w-4 h-4 text-gray-400" />
                </button>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center ring-2 ring-yellow-400/40 shrink-0">
                    <span className="text-yellow-400 text-[10px] font-bold">★</span>
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">vitechgroup</p>
                    <p className="text-sm text-gray-500">Liên: 🔥</p>
                </div>
            </button>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NhomPage() {
    const [view, setView] = useState<View>('feed')

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f2f5' }}>
            <HanoiWorkHeader />

            <div className="flex flex-1">
                <GroupsLeftSidebar view={view} setView={setView} />

                {view === 'feed' ? (
                    <main className="flex-1 flex justify-center py-4 px-4">
                        <div className="w-full max-w-[680px] space-y-3">
                            {groupPosts.map((post) => (
                                <GroupPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </main>
                ) : (
                    <main className="flex-1 py-6 px-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Nhóm đề xuất</h2>
                        <div className="grid grid-cols-4 gap-3">
                            {suggestedGroups.map((group, i) => (
                                <SuggestedGroupCard key={i} group={group} />
                            ))}
                        </div>
                    </main>
                )}
            </div>

            <NewMessagePopup />

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
