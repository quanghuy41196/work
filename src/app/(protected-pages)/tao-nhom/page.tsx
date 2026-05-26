'use client'

import { useState, useRef } from 'react'
import HanoiWorkHeader from '@/components/hanoi/HanoiWorkHeader'
import { HiCamera } from 'react-icons/hi'

export default function TaoNhom() {
    const [groupName, setGroupName] = useState('')
    const [showError, setShowError] = useState(false)
    const [coverImage, setCoverImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleContinue = () => {
        if (!groupName.trim()) {
            setShowError(true)
            return
        }
        setShowError(false)
        // TODO: proceed to next step
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value)
        if (e.target.value.trim()) setShowError(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setCoverImage(url)
        }
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f2f5' }}>
            <HanoiWorkHeader />

            <div className="flex-1 flex flex-col items-center py-10 px-4">
                <div className="w-full max-w-[520px]">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Tạo nhóm mới</h1>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Tạo không gian tuyệt vời để hoàn thành nhiệm vụ và chỉ liên lạc với những người bạn
                        muốn. Hãy chia sẻ ảnh và video, trò chuyện, lên kế hoạch và nhiều hoạt động khác
                        với những người bạn.
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-gray-200 rounded-full mb-8">
                        <div className="h-full w-1/2 bg-green-500 rounded-full" />
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        {/* Group name */}
                        <div className="mb-5">
                            <div className="flex items-center gap-3 mb-2">
                                <label className="text-sm font-semibold text-gray-800">
                                    Tên nhóm <span className="text-red-500">*</span>
                                </label>
                                {showError && (
                                    <div className="relative">
                                        <div className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                                            Tên nhóm không được phép để trống
                                        </div>
                                        {/* Downward caret */}
                                        <div
                                            className="absolute -bottom-[5px] right-4 w-2.5 h-2.5 bg-red-500 rotate-45"
                                            style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={groupName}
                                onChange={handleNameChange}
                                placeholder="Nhập tên nhóm..."
                                className="w-full h-11 px-4 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white transition-all border border-transparent focus:border-blue-300"
                            />
                        </div>

                        {/* Cover image */}
                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-800 mb-3 block">
                                Chọn ảnh bìa
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all"
                                style={{ minHeight: '172px' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {coverImage ? (
                                    <img
                                        src={coverImage}
                                        alt="cover preview"
                                        className="w-full h-36 object-cover rounded-xl"
                                    />
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                fileInputRef.current?.click()
                                            }}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                                        >
                                            <HiCamera className="w-5 h-5" />
                                            Chọn ảnh từ máy tính
                                        </button>
                                        <p className="text-xs text-gray-400 text-center leading-relaxed px-6">
                                            Khuyến khích bạn sử dụng ảnh có kích thước{' '}
                                            <strong className="text-gray-600">1800*672px</strong>
                                            <br />
                                            Và vùng nội dung chính của ảnh bìa cách lề mỗi bên một khoảng{' '}
                                            <strong className="text-gray-600">300px</strong>
                                            <br />
                                            để đảm bảo hiển thị tốt nhất trên cả hai nền tảng Web &amp; Mobile.
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleContinue}
                            className="w-full h-12 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
