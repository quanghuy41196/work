import classNames from '@/utils/classNames'
import { JSX } from 'react'
import { RenderSortStatusProps } from 'react-data-grid'
import { ArrowIcon } from './Icons'

const RenderSortStatus = ({ sortDirection, priority }: RenderSortStatusProps): JSX.Element => {
  return (
    <>
      {sortDirection !== undefined && (
        <ArrowIcon
          className={classNames(sortDirection === 'DESC' && '-rotate-180', 'transition-transform')}
          size={20}
        />
      )}
      <span>{priority}</span>
    </>
  )
}

export default RenderSortStatus
