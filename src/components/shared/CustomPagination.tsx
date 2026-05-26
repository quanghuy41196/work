import classNames from '@/utils/classNames'
import { useMemo } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

interface CustomPaginationProps {
  total: number
  value: number
  onChange: (page: number) => void
}

const DOTS = '...'

const usePagination = ({ total, value }: { total: number; value: number }) => {
  return useMemo(() => {
    const range: (number | string)[] = []
    const siblingCount = 1 

    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= total) {
      for (let i = 1; i <= total; i++) {
        range.push(i)
      }
      return range
    }

    const leftSiblingIndex = Math.max(value - siblingCount, 1)
    const rightSiblingIndex = Math.min(value + siblingCount, total)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < total - 2

    const firstPageIndex = 1
    const lastPageIndex = total

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      for (let i = 1; i <= leftItemCount; i++) {
        range.push(i)
      }
      range.push(DOTS)
      range.push(total)
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      range.push(firstPageIndex)
      range.push(DOTS)
      for (let i = total - rightItemCount + 1; i <= total; i++) {
        range.push(i)
      }
    } else {
      range.push(firstPageIndex)
      if (shouldShowLeftDots) {
        range.push(DOTS)
      }
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i)
      }
      if (shouldShowRightDots) {
        range.push(DOTS)
      }
      range.push(lastPageIndex)
    }

    return range
  }, [total, value])
}

const CustomPagination = ({ total, value, onChange }: CustomPaginationProps) => {
  const paginationRange = usePagination({ total, value })

  if (total <= 1) return null

  const onNext = () => onChange(value + 1)
  const onPrevious = () => onChange(value - 1)

  return (
    <nav className="flex items-center gap-1">
      <button
        onClick={onPrevious}
        disabled={value === 1}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoChevronBack />
      </button>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span key={`${DOTS}-${index}`} className="h-8 w-8 flex items-center justify-center">
              …
            </span>
          )
        }
        return (
          <button
            key={pageNumber}
            onClick={() => onChange(Number(pageNumber))}
            className={classNames(
              'h-8 w-fit px-3 flex items-center justify-center rounded-md text-sm',
              pageNumber === value
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            )}
          >
            {pageNumber}
          </button>
        )
      })}
      <button
        onClick={onNext}
        disabled={value === total}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoChevronForward />
      </button>
    </nav>
  )
}

export default CustomPagination