import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Tone } from '@/lib/constants/taxonomy'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  /** Punto de color a la izquierda. */
  dot?: boolean
  icon?: ReactNode
}

export const toneSoft: Record<Tone, string> = {
  azul: 'bg-azul-soft text-azul-strong',
  amarillo: 'bg-amarillo-soft text-[#8a5a00]',
  coral: 'bg-coral-soft text-coral-strong',
  verde: 'bg-verde-soft text-verde-strong',
  neutral: 'bg-cream-deep text-ink-soft',
}

export const toneDot: Record<Tone, string> = {
  azul: 'bg-azul',
  amarillo: 'bg-amarillo-strong',
  coral: 'bg-coral',
  verde: 'bg-verde',
  neutral: 'bg-ink-faint',
}

export function Badge({ tone = 'neutral', dot, icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        toneSoft[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span className={cn('size-1.5 rounded-full', toneDot[tone])} aria-hidden />}
      {icon}
      {children}
    </span>
  )
}
