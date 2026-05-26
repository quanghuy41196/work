'use client'
import classNames from '@/utils/classNames'
import useTranslation from '@/utils/hooks/useTranslation'
import { JSX, memo, useMemo } from 'react'

import dynamic from 'next/dynamic'
import CustomPagination from '../CustomPagination'
import { IPaginationText } from './type'
const Select = dynamic(() => import('react-select'), { ssr: false })
interface TablePaginationProps {
    hiddenPagination?: boolean
    classNamePaginationTable?: string
    hiddenPaginationText?: boolean
    page?: number
    pageSize?: number
    total?: number
    maxPage: number
    toInPagination: IPaginationText
    paginationText?: (payload: IPaginationText & { total?: number }) => string
    listPageSize?: string[]
    setConfigPagination?: React.Dispatch<
        React.SetStateAction<{
            page: number
            pageSize: number
        }>
    >
    handlePageChange: (page: number) => void
}

const TablePagination = ({
    hiddenPagination,
    classNamePaginationTable,
    hiddenPaginationText,
    page = 1,
    pageSize = 10,
    total,
    maxPage,
    toInPagination,
    paginationText,
    listPageSize = ['10', '100', '200', '500', '1000', '5000'],
    setConfigPagination,
    handlePageChange
}: TablePaginationProps): JSX.Element | null => {
    const t = useTranslation()
    const menuPortalTarget = useMemo(() =>
        typeof window !== 'undefined' ? document.body : undefined,
        []
    )
    const pageSizeOptions = useMemo(
        () => listPageSize.map((size) => ({ value: size, label: `${size} / ${t('page')}` })),
        [listPageSize, t]
    )

    const currentPageSizeOption = useMemo(
        () => pageSizeOptions.find((opt) => opt.value === pageSize?.toString()),
        [pageSize, pageSizeOptions]
    )

    if (hiddenPagination) {
        return null
    }

    return (
        <div
            className={classNames(
                'flex justify-between items-center flex-wrap gap-4 wapper_pagination p-3 mt-auto bg-white border-t border-gray-200',
                classNamePaginationTable
            )}
        >
            <div className="text-sm text-gray-600">
                {!hiddenPaginationText
                    ? paginationText
                        ? paginationText({ ...toInPagination, total })
                        : total
                            ? `${t('display')} ${toInPagination.from} - ${toInPagination.to} ${t('of')} ${total} ${t('results')}`
                            : t('no_results')
                    : null}
            </div>

            <div className="flex items-center gap-4">
                <Select
                    options={pageSizeOptions}
                    value={currentPageSizeOption}
                    onChange={(option) => {
                        if (setConfigPagination && option) {
                            setConfigPagination((prev) => ({
                                ...prev,
                                pageSize: Number((option as { value: number }).value),
                                page: 1
                            }))
                        }
                    }}
                    menuPlacement="top"
                    classNames={{
                        menu: () => "max-h-48 overflow-hidden",
                        menuList: () => "max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                    }}
                    menuPortalTarget={menuPortalTarget}
                    className="w-40 text-sm"
                    classNamePrefix="react-select"
                    isSearchable={false}
                    styles={{
                        control: (base) => ({
                            ...base,
                            minHeight: '38px',
                            borderColor: '#D1D5DB'
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isSelected ? '#4F46E5' : isFocused ? '#E0E7FF' : base.backgroundColor,
                            color: isSelected ? 'white' : 'inherit'
                        })
                    }}
                />

                {!!maxPage && maxPage > 1 && (
                    <CustomPagination total={maxPage} value={page} onChange={handlePageChange} />
                )}
            </div>
        </div>
    )
}

export default memo(TablePagination)