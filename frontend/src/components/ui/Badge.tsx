import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5',
        variant === 'default' && 'bg-black text-white',
        variant === 'outline' && 'border border-[#CCCCCC] text-[#555555]',
        className,
      )}
    >
      {children}
    </span>
  )
}
