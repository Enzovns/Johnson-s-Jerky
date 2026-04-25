import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-sm font-bold uppercase tracking-wider text-leather"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 font-body bg-parchment border-2 text-charcoal placeholder-leather/40',
            'focus:outline-none focus:border-terra focus:bg-white transition-colors',
            error ? 'border-red-500' : 'border-dark-leather/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-600 text-xs font-body">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
