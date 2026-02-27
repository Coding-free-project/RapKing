import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium uppercase tracking-wide transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-black text-white hover:bg-[#1A1A1A]',
          variant === 'secondary' && 'bg-white text-black border border-black hover:bg-black hover:text-white',
          variant === 'outline' && 'border border-[#CCCCCC] text-[#555555] hover:border-black hover:text-black',
          variant === 'ghost' && 'text-[#555555] hover:text-black',
          size === 'sm' && 'text-xs px-3 py-1.5',
          size === 'md' && 'text-sm px-4 py-2',
          size === 'lg' && 'text-sm px-6 py-3',
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
