import { cn } from '@/lib/utils/cn'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'gold'

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-leather/10 text-leather border-leather/20',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  gold: 'bg-gold/20 text-leather border-gold/40',
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-body font-bold uppercase tracking-wider border',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
