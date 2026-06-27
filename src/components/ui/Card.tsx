import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Acento lateral de color (necesidad=coral, oferta=verde, etc.). */
  accent?: 'none' | 'azul' | 'coral' | 'verde' | 'amarillo'
  interactive?: boolean
}

const accents: Record<NonNullable<CardProps['accent']>, string> = {
  none: '',
  azul: 'before:bg-azul',
  coral: 'before:bg-coral',
  verde: 'before:bg-verde',
  amarillo: 'before:bg-amarillo',
}

export function Card({ accent = 'none', interactive, className, children, ...rest }: CardProps) {
  const hasAccent = accent !== 'none'
  return (
    <div
      className={cn(
        'relative rounded-xl border border-line bg-surface shadow-soft',
        hasAccent &&
          'overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-[""]',
        hasAccent && accents[accent],
        interactive &&
          'transition-[box-shadow,transform] duration-150 hover:shadow-lift hover:-translate-y-0.5 focus-within:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
