// @/components/ReactTableGridCustom/TableGrid.tsx
import { imageStaticPaths } from '@/constants/imagePaths.constant'
import { JSX, Key, RefObject, memo } from 'react'
import DataGrid, {
  CellClickArgs,
  CellMouseEvent,
  Column,
  DataGridHandle,
  RenderCheckboxProps,
  SortColumn
} from 'react-data-grid'
import { LoadingIcon } from 'yet-another-react-lightbox'
import CustomCheckbox from '../CustomCheckbox'
import RenderSortStatus from './_components/RenderSortStatus'

interface TableGridProps<T, SR> {
  tableRef: RefObject<DataGridHandle>
  rows: readonly T[]
  columns: readonly Column<T, SR>[]
  rowKeyGetter?: (row: T) => Key
  selectedRows?: ReadonlySet<Key>
  onCellClick: (args: CellClickArgs<T, SR>, event: CellMouseEvent) => void
  sortColumns: readonly SortColumn[]
  onSortColumnsChange: (sortColumns: readonly SortColumn[]) => void
  total: number | undefined
  fetching?: boolean
  isLoading: boolean
  isSelectRow: boolean
  // Pass other DataGrid props
  [key: string]: unknown
}

function TableGrid<T, SR = unknown>({
  tableRef,
  rows,
  columns,
  rowKeyGetter,
  selectedRows,
  onCellClick,
  sortColumns,
  onSortColumnsChange,
  total,
  fetching,
  isLoading,
  isSelectRow,
  ...spread
}: TableGridProps<T, SR>): JSX.Element {
  return (
    <div className="relative   flex flex-col flex-1 min-h-0">
      <DataGrid<T, SR>
        ref={tableRef}
        aria-rowcount={rows?.length}
        selectedRows={selectedRows}
        rows={rows}
        rowKeyGetter={rowKeyGetter && isSelectRow ? rowKeyGetter : undefined}
        columns={columns}
        onCellClick={onCellClick}
        renderers={{
          renderSortStatus: RenderSortStatus,
          renderCheckbox({ onChange, checked,indeterminate, ...rest }: RenderCheckboxProps) {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
              onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey)
            }
            return <CustomCheckbox checked={!!checked} onChange={handleChange} {...rest} {...(indeterminate ? { indeterminate: true } : {})} />
          }
        }}
        className="rdg-light flex-1 h-full min-h-0 [&>.rdg-row]:hover:bg-gray-500"
        defaultColumnOptions={{
          renderCell: ({ column, row }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = (row as any)[column.key]
            return [null, undefined, ''].includes(value) ? '-' : value
          }
        }}
        sortColumns={sortColumns}
        onSortColumnsChange={onSortColumnsChange}
        {...spread}
      />
      {total === 0 && (
        <div className="no_result absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 select-none">
          <div className="flex flex-col justify-center">
            <img src={imageStaticPaths.logoTable} alt="" className="size-32" />
          </div>
        </div>
      )}
      {(fetching || isLoading) && (
        <div className="absolute inset-0 bg-gray-50/45 flex justify-center items-center ">
          <div className=" animate-spin">
            <LoadingIcon />
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(TableGrid) as typeof TableGrid