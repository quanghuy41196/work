import classNames from '@/utils/classNames';
import { forwardRef, InputHTMLAttributes } from 'react';
import { FaCheck } from 'react-icons/fa'; // Một icon từ react-icons

type CustomCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className={classNames(
            'peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'checked:bg-indigo-600 checked:border-indigo-600',
            className
          )}
          {...props}
        />
        <FaCheck
          className={classNames(
            'absolute h-2.5 w-2.5 text-white pointer-events-none',
            checked ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
    )
  }
)

CustomCheckbox.displayName = 'CustomCheckbox'
export default CustomCheckbox