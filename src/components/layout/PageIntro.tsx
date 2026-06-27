import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Container } from './Container'

export interface PageIntroProps {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
}

/** Encabezado de página consistente en toda la app. */
export function PageIntro({ eyebrow, title, description, actions, className }: PageIntroProps) {
  return (
    <Container className={cn('pt-8 pb-2 sm:pt-10', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-1 text-sm font-bold uppercase tracking-wide text-amarillo-strong">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </Container>
  )
}
