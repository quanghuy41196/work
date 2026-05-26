'use client'
import { get, orderBy } from 'lodash'
import { JSX, Key, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CellClickArgs, CellMouseEvent, Column, DataGridHandle, SelectColumn, SortColumn } from 'react-data-grid'

import classNames from '@/utils/classNames'
import TableGrid from './TableGrid'
import TablePagination from './TablePagination'
import { IPaginationText, IReactTableGridCustom, TColumnsTable } from './type'
import useTranslationTable from './useTranslationTable'
import { calculatorTotalPage, STT } from './utils'

const ReactTableGridCustom = <T, SR = unknown, K extends Key = Key>({
    classNamePaginationTable,
    classNameWapperTable,
    hiddenPagination,
    hiddenSTT,
    data = [],
    page,
    pageSize,
    total,
    onChange,
    setConfigPagination,
    columns,
    rowKeyGetter = 'uid',
    selectedRows,
    hiddenPaginationText,
    paginationText,
    listPageSize,
    fetching,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCellClick: _propsOnCellClick,
    sortColumns: propsSortColumns,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSortColumnsChange: _propsOnSortColumnsChange,
    ...spread
}: IReactTableGridCustom<T, SR, K>): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true)
    const tableRef = useRef<DataGridHandle | null>(null)
    const [containerWidth, setContainerWidth] = useState<number>(0)
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>(propsSortColumns || [])
    const isSelectRow = selectedRows !== undefined

    const maxPage = useMemo(
        () =>
            !hiddenPagination
                ? calculatorTotalPage({
                    total,
                    pageSize
                })
                : 0,
        [pageSize, total, hiddenPagination]
    )

    const toInPagination = useMemo(() => {
        const initPage: IPaginationText = {
            from: 0,
            to: 0
        }
        if (!hiddenPaginationText && pageSize && page) {
            const from = STT(
                {
                    page: page,
                    pageSize: pageSize
                },
                0
            )
            return {
                from,
                to: maxPage === page ? total : page * pageSize
            }
        }
        return initPage
    }, [pageSize, page, hiddenPaginationText, maxPage, total])

    const columnTranslation = useTranslationTable<T, SR>(columns as TColumnsTable<T, SR>)
    useEffect(() => {
        setIsLoading(false)
        if (tableRef.current?.element) {
            const width = tableRef.current.element.offsetWidth
            if (width) setContainerWidth(width)
        }
    }, [])
    const newColumns = useMemo(() => {
        let columnsCustom = [...columnTranslation]
        const adjustedContainerWidth = containerWidth - 80 + 35
        columnsCustom = columnsCustom.map((col) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newCol = { ...col } as any
            delete newCol.maxWidth
            newCol.width = 200
            return newCol
        })
        const totalMaxWidth = columnsCustom.reduce((sum, col) => {
            return sum + ('width' in col ? Number(col?.width ?? 200) : 0)
        }, 0)
        if (totalMaxWidth < adjustedContainerWidth && columnsCustom.length > 0) {
            const evenWidth = Math.floor(adjustedContainerWidth / columnsCustom.length)
            columnsCustom = columnsCustom.map((col) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newCol = { ...col } as any
                delete newCol.maxWidth
                newCol.width = evenWidth
                return newCol
            })
        }
        if (isSelectRow) {
            columnsCustom.unshift(SelectColumn)
        }

        if (!hiddenSTT || (!hiddenSTT && page && pageSize)) {
            columnsCustom.unshift({
                key: 'index',
                name: 'STT',
                width: 80,
                renderCell: ({ rowIdx }) => STT({ page, pageSize }, rowIdx)
            })
        }
        return columnsCustom
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hiddenSTT, isSelectRow, page, pageSize, containerWidth])
    const customRowKeyGetter = useMemo(() => {
        return (row: NoInfer<T>): K => {
            if (typeof rowKeyGetter === 'function') {
                return rowKeyGetter(row)
            }
            return get(row, rowKeyGetter as string) as K
        }
    }, [rowKeyGetter])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCellClick = (args: CellClickArgs<T, SR>, _: CellMouseEvent): void => {
        const keyGetter = customRowKeyGetter
        const value = keyGetter(args?.row)

        if (!selectedRows) return

        const newSelectedRows = new Set(selectedRows)

        if (newSelectedRows.has(value)) {
            newSelectedRows.delete(value)
        } else {
            newSelectedRows.add(value)
        }

        if (spread?.onSelectedRowsChange) {
            spread.onSelectedRowsChange(newSelectedRows)
        }
    }

    const handlePageChange = useCallback(
        (page: number) => {
            if (onChange) {
                onChange(page)
                return
            }

            if (setConfigPagination) {
                setConfigPagination((prev) => ({ ...prev, page }))
            }
        },
        [setConfigPagination, onChange]
    )

    const sortedRows = useMemo((): readonly T[] => {
        if (sortColumns.length === 0) return data

        const direction = sortColumns[0]?.direction?.toLowerCase() as 'desc' | 'asc'
        const columnKey = sortColumns[0]?.columnKey

        return orderBy(
            data,
            (item) => {
                const value = get(item, columnKey, '')
                const numberValue = parseFloat(String(value))
                return isNaN(numberValue) ? value : numberValue
            },
            [direction]
        )
    }, [data, sortColumns])

    useEffect(() => {
        if (page && page > maxPage && maxPage > 0) {
            handlePageChange(1)
        }
    }, [page, maxPage, handlePageChange])
    return (
        <div
            className={classNames(
                ' flex-1 rounded-md overflow-hidden relative h-full flex flex-col min-h-0',
                classNameWapperTable
            )}
        >
            <TableGrid
                tableRef={tableRef as React.RefObject<DataGridHandle>}
                rows={sortedRows}
                columns={newColumns as unknown as readonly Column<NoInfer<T>, SR>[]}
                rowKeyGetter={customRowKeyGetter}
                selectedRows={selectedRows ?? undefined}
                onCellClick={handleCellClick}
                sortColumns={sortColumns}
                onSortColumnsChange={setSortColumns}
                total={total}
                fetching={fetching}
                isLoading={isLoading}
                isSelectRow={isSelectRow}
                {...spread}
            />
            <TablePagination
                hiddenPagination={hiddenPagination}
                classNamePaginationTable={classNamePaginationTable}
                hiddenPaginationText={hiddenPaginationText}
                page={page}
                pageSize={pageSize}
                total={total}
                maxPage={maxPage}
                toInPagination={toInPagination}
                paginationText={
                    paginationText
                        ? (payload) => String(paginationText(payload))
                        : undefined
                }
                listPageSize={listPageSize}
                setConfigPagination={setConfigPagination}
                handlePageChange={handlePageChange}
            />
        </div>
    )
}

export default memo(ReactTableGridCustom) as typeof ReactTableGridCustom