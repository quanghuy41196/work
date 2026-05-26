'use client'

import Link from 'next/link'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import {
    HiTrendingUp,
    HiUserGroup,
    HiChartBar,
    HiUsers,
    HiBookmark,
    HiThumbUp,
    HiAnnotation,
    HiUpload,
    HiDotsHorizontal,
    HiGlobe,
    HiPlus,
    HiVideoCamera,
    HiChevronRight,
    HiArrowNarrowRight,
    HiRefresh,
    HiCalendar,
    HiCheckCircle,
    HiOfficeBuilding,
    HiInformationCircle,
    HiFlag,
} from 'react-icons/hi'
import { RiRobot2Fill } from 'react-icons/ri'
import type { ComponentType } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type IconComp = ComponentType<{ className?: string; color?: string }>

type Post = {
    id: number
    author: string
    role: string
    initial: string
    color: string
    time: string
    content: string
    images: string[]
    likes: number
    comments: number
    shares: number
}

// ── Post data ─────────────────────────────────────────────────────────────────

const posts: Post[] = [
    {
        id: 1,
        author: 'Nguyễn Thị Hương',
        role: 'Thành viên tại vitechgroup',
        initial: 'H',
        color: '#f97316',
        time: '2 giờ trước',
        content:
            'UBND xã Thường Tín tổ chức Hội nghị sơ kết 6 tháng đầu năm và triển khai nhiệm vụ trọng tâm 6 tháng cuối năm 2025. Tham dự có đồng chí Bí thư Đảng ủy, Chủ tịch UBND xã cùng lãnh đạo các ban, ngành, đoàn thể và đại diện 12 thôn trên địa bàn.',
        images: [
            'linear-gradient(135deg, #c7d9e8 0%, #a5c0d6 100%)',
            'linear-gradient(135deg, #d2dce8 0%, #b8c8d8 100%)',
        ],
        likes: 24,
        comments: 3,
        shares: 2,
    },
    {
        id: 2,
        author: 'Trần Văn Minh',
        role: 'Thành viên tại vitechgroup',
        initial: 'M',
        color: '#3b82f6',
        time: '4 giờ trước',
        content:
            'Ban Chỉ huy Quân sự xã Thường Tín tổ chức buổi ra quân huấn luyện dân quân tự vệ năm 2025. Hơn 120 chiến sĩ dân quân đã tham gia với tinh thần hăng hái, quyết tâm hoàn thành xuất sắc nhiệm vụ được giao theo chỉ tiêu của huyện.',
        images: [
            'linear-gradient(135deg, #d1dce8 0%, #b8cad8 100%)',
            'linear-gradient(135deg, #c8d5e3 0%, #b0c3d3 100%)',
            'linear-gradient(135deg, #bfcede 0%, #a8bece 100%)',
            'linear-gradient(135deg, #d4dfe9 0%, #bccad9 100%)',
        ],
        likes: 45,
        comments: 7,
        shares: 5,
    },
    {
        id: 3,
        author: 'Lê Thị Phương',
        role: 'Thành viên tại vitechgroup',
        initial: 'P',
        color: '#a855f7',
        time: '6 giờ trước',
        content:
            '🚫 THUỐC LÁ ĐIỆN TỬ, THUỐC LÁ NUNG NÓNG là sản phẩm thuốc lá và BỊ CẤM KINH DOANH tại Việt Nam theo Luật Phòng chống tác hại thuốc lá. Phạt tiền từ 3.000.000 – 10.000.000 đồng đối với các hành vi vi phạm. Hãy cùng nhau bảo vệ sức khỏe cộng đồng!',
        images: ['linear-gradient(135deg, #fef2f2 0%, #fca5a5 50%, #ef4444 100%)'],
        likes: 89,
        comments: 12,
        shares: 34,
    },
    {
        id: 4,
        author: 'Nguyễn Văn Thắng',
        role: 'Thành viên tại vitechgroup',
        initial: 'T',
        color: '#10b981',
        time: 'Hôm qua lúc 14:30',
        content:
            'vitechgroup long trọng tổ chức Lễ kỷ niệm 135 năm Ngày sinh Chủ tịch Hồ Chí Minh (19/5/1890 – 19/5/2025). Đây là dịp ôn lại cuộc đời, sự nghiệp vĩ đại của Người và thi đua thực hiện lời dạy của Bác trong công tác và cuộc sống.',
        images: [
            'linear-gradient(135deg, #dae8d9 0%, #b8d4b8 100%)',
            'linear-gradient(135deg, #c8dfc7 0%, #a8cfaa 100%)',
            'linear-gradient(135deg, #d5e8d4 0%, #b5d4b5 100%)',
        ],
        likes: 112,
        comments: 18,
        shares: 22,
    },
    {
        id: 5,
        author: 'Phạm Thị Lan',
        role: 'Thành viên tại vitechgroup',
        initial: 'L',
        color: '#ec4899',
        time: 'Hôm qua lúc 09:15',
        content:
            'Hội Phụ nữ xã Thường Tín tổ chức tập huấn về phòng chống bạo lực gia đình và bình đẳng giới. Chương trình thu hút gần 80 hội viên phụ nữ từ các thôn tham dự, được sự hỗ trợ của Hội LHPN huyện Thường Tín.',
        images: [
            'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)',
            'linear-gradient(135deg, #fdf4ff 0%, #f0abfc 100%)',
        ],
        likes: 67,
        comments: 9,
        shares: 8,
    },
    {
        id: 6,
        author: 'Đoàn Thanh Niên',
        role: 'Thành viên tại vitechgroup',
        initial: 'Đ',
        color: '#f59e0b',
        time: '2 ngày trước',
        content:
            'Đoàn Thanh niên xã Thường Tín phát động phong trào "Thanh niên tình nguyện vì cộng đồng". Hàng trăm đoàn viên đã tham gia dọn vệ sinh môi trường, trồng cây xanh và hỗ trợ người dân tiếp cận dịch vụ công trực tuyến.',
        images: [
            'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
            'linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)',
            'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)',
            'linear-gradient(135deg, #fffbeb 0%, #fef08a 100%)',
        ],
        likes: 98,
        comments: 15,
        shares: 19,
    },
]

// ── Left sidebar data ─────────────────────────────────────────────────────────

type NavItem = { Icon: IconComp; label: string; active?: boolean; iconBg: string; iconColor: string; href?: string }

const leftNavItems: NavItem[] = [
    { Icon: HiTrendingUp, label: 'Bảng tin tổ chức', active: true, iconBg: '#dcfce7', iconColor: '#16a34a' },
    { Icon: HiUserGroup,  label: 'Nhóm',  href: '/nhom',          iconBg: '#ede9fe', iconColor: '#7c3aed' },
    { Icon: HiChartBar,   label: 'Ghi nhận & Bảng xếp hạng',     iconBg: '#fff7ed', iconColor: '#ea580c' },
    { Icon: HiUsers,      label: 'Tất cả thành viên',             iconBg: '#eff6ff', iconColor: '#2563eb' },
    { Icon: HiBookmark,   label: 'Bài viết đã lưu',               iconBg: '#faf5ff', iconColor: '#9333ea' },
]

// ── Right sidebar data ────────────────────────────────────────────────────────

const miniApps = [
    {
        Icon: HiOfficeBuilding as IconComp,
        name: 'Quản lý văn bản nội bộ HN',
        desc: 'Quản lý văn bản nội bộ HN',
        iconBg: '#dbeafe',
        iconColor: '#2563eb',
    },
    {
        Icon: HiInformationCircle as IconComp,
        name: 'Hệ thống thông tin điều hành tác ...',
        desc: 'Hệ thống thông tin điều hành tác n...',
        iconBg: '#fee2e2',
        iconColor: '#dc2626',
    },
    {
        Icon: HiFlag as IconComp,
        name: 'Dịch vụ công Hà Nội',
        desc: 'Dịch vụ công Hà Nội',
        iconBg: '#fee2e2',
        iconColor: '#dc2626',
    },
]

const groupShortcuts = [
    {
        name: 'Triển Khai Nghị quyết 57-NQ...',
        meta: '8 bài viết · 39062 thành viên',
        bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        verified: true,
    },
    {
        name: 'THÀNH PHỐ HÀ NỘI',
        meta: '124 bài viết · 85210 thành viên',
        bg: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
        verified: true,
    },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function PostImages({ images }: { images: string[] }) {
    const count = images.length
    if (!count) return null

    if (count === 1)
        return <div className="mt-2 rounded-lg overflow-hidden h-72 w-full" style={{ background: images[0] }} />

    if (count === 2)
        return (
            <div className="mt-2 grid grid-cols-2 gap-0.5 h-60 rounded-lg overflow-hidden">
                {images.map((bg, i) => <div key={i} style={{ background: bg }} />)}
            </div>
        )

    if (count === 3)
        return (
            <div className="mt-2 grid grid-cols-2 grid-rows-2 gap-0.5 h-60 rounded-lg overflow-hidden">
                <div className="row-span-2" style={{ background: images[0] }} />
                <div style={{ background: images[1] }} />
                <div style={{ background: images[2] }} />
            </div>
        )

    const extra = count > 4 ? count - 4 : 0
    return (
        <div className="mt-2 grid grid-cols-2 gap-0.5 h-60 rounded-lg overflow-hidden">
            {images.slice(0, 4).map((bg, i) => (
                <div key={i} className="relative" style={{ background: bg }}>
                    {i === 3 && extra > 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">+{extra}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function PostCard({ post }: { post: Post }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-start justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: post.color }}
                    >
                        {post.initial}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-gray-900 leading-none mb-0.5">{post.author}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            {post.role} · {post.time} · <HiGlobe className="w-3 h-3" />
                        </p>
                    </div>
                </div>
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                    <HiDotsHorizontal className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="px-4 pb-1">
                <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
            </div>

            <div className="px-4">
                <PostImages images={post.images} />
            </div>

            <div className="flex items-center justify-between px-4 py-2 mt-1">
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <span className="w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center">
                        <HiThumbUp className="w-2.5 h-2.5 text-white" />
                    </span>
                    {post.likes}
                </span>
                <div className="flex items-center gap-3 text-gray-500 text-xs">
                    {post.comments > 0 && <span>{post.comments} bình luận</span>}
                    {post.shares > 0 && <span>{post.shares} lần chia sẻ</span>}
                </div>
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

function LeftSidebar() {
    return (
        <aside className="w-64 shrink-0 sticky top-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-1">
                    <p className="text-sm font-semibold text-gray-800">Trang chủ</p>
                </div>
                {leftNavItems.map(({ Icon, label, active, iconBg, iconColor, href }, i) => {
                    const inner = (
                        <>
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: iconBg }}
                            >
                                <Icon className="w-5 h-5" color={iconColor} />
                            </div>
                            <span className={`font-medium leading-tight ${active ? 'text-green-700' : 'text-gray-700'}`}>
                                {label}
                            </span>
                        </>
                    )
                    const cls = `w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left ${active ? 'bg-green-50' : 'hover:bg-gray-50'}`
                    return href ? (
                        <Link key={i} href={href} className={cls}>{inner}</Link>
                    ) : (
                        <button key={i} className={cls}>{inner}</button>
                    )
                })}
                <div className="h-2" />
            </div>
        </aside>
    )
}

function RightSidebar() {
    return (
        <aside className="w-64 shrink-0 space-y-3 sticky top-4">
            {/* Tạo cuộc họp */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                        <HiVideoCamera className="w-5 h-5 text-white" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-gray-800 text-left">Tạo cuộc họp</span>
                    <HiChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                </button>
            </div>

            {/* Mini App */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 pt-3 pb-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mini App</p>
                </div>
                {miniApps.map(({ Icon, name, desc, iconBg, iconColor }, i) => (
                    <button
                        key={i}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: iconBg }}
                        >
                            <Icon className="w-5 h-5" color={iconColor} />
                        </div>
                        <div className="min-w-0 text-left">
                            <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                            <p className="text-xs text-gray-400 truncate">{desc}</p>
                        </div>
                    </button>
                ))}
                <button className="w-full flex items-center justify-center gap-1 py-3 text-sm text-blue-600 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100">
                    Xem tất cả
                    <HiArrowNarrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Lịch làm việc */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Lịch làm việc
                    </p>
                    <div className="flex items-center gap-0.5">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                            <HiRefresh className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                            <HiPlus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center py-5 gap-1.5">
                    <HiCalendar className="w-12 h-12 text-gray-300" />
                    <p className="text-sm text-gray-500">Chưa có sự kiện nào</p>
                    <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline mt-0.5">
                        Đi đến Lịch
                        <HiArrowNarrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Lối tắt nhóm */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Lối tắt nhóm
                    </p>
                    <div className="flex items-center gap-0.5">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                            <HiBookmark className="w-4 h-4" />
                        </button>
                        <Link href="/tao-nhom" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                            <HiPlus className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
                {groupShortcuts.map(({ name, meta, bg, verified }, i) => (
                    <button
                        key={i}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                        <div
                            className="w-10 h-10 rounded-lg shrink-0"
                            style={{ background: bg }}
                        />
                        <div className="min-w-0 text-left flex-1">
                            <div className="flex items-center gap-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                                {verified && (
                                    <HiCheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                            </div>
                            <p className="text-xs text-gray-400">{meta}</p>
                        </div>
                    </button>
                ))}
                <div className="h-2" />
            </div>
        </aside>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BangTin() {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f2f5' }}>
            <HanoiWorkHeader />

            <div className="flex gap-4 px-6 py-4 max-w-[1200px] mx-auto w-full items-start">
                <LeftSidebar />

                <main className="flex-1 min-w-0 space-y-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </main>

                <RightSidebar />
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
