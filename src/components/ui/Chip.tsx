import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  icon?: ReactNode
}

/** Filtro/toggle accesible. Usa aria-pressed para lectores de pantalla. */
export function Chip({ selected, icon, className, children, type, ...rest }: ChipProps) {
  return (
    <button
      type={type ?? 'button'}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 min-h-9 text-sm font-medium',
        'transition-colors duration-150 whitespace-nowrap',
        selected
          ? 'border-azul bg-azul text-cream'
          : 'border-line-strong bg-surface text-ink-soft hover:border-azul hover:text-azul-strong',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
