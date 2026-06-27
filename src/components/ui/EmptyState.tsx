import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface EmptyStateProps {
  /** Icono o ilustración propia. */
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/** Estados vacíos humanos, no fríos. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface/60 px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <span className="flex size-14 items-center justify-center rounded-full bg-azul-soft text-azul">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-bold text-azul-strong">{title}</h3>
      {description && <p className="max-w-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
