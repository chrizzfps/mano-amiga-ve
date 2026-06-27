import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui'
import { IconArrowLeft, IconArrowRight, IconCheck } from '@/components/icons'
import { Container } from '@/components/layout'

export interface StepShellProps {
  title: string
  current: number
  total: number
  onBack: () => void
  onNext: () => void
  isLastStep: boolean
  isSubmitting?: boolean
  nextDisabled?: boolean
  children: ReactNode
  hint?: string
}

/** Shell del wizard de publicación: barra de progreso + navegación. */
export function StepShell({
  title,
  current,
  total,
  onBack,
  onNext,
  isLastStep,
  isSubmitting,
  nextDisabled,
  children,
  hint,
}: StepShellProps) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100)

  return (
    <Container size="narrow" className="py-6 sm:py-10">
      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm font-semibold text-ink-soft">
          <span>Paso {current} de {total}</span>
          <span>{pct}% completado</span>
        </div>
        <div
          className="h-2 rounded-full bg-line overflow-hidden"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Paso ${current} de ${total}`}
        >
          <div
            className="h-full bg-azul rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Título del paso */}
      <h2 className="text-xl font-extrabold text-azul-strong mb-1">{title}</h2>
      {hint && <p className="text-sm text-ink-soft mb-6">{hint}</p>}

      {/* Contenido del paso */}
      <div className={cn('mt-4', !hint && 'mt-6')}>{children}</div>

      {/* Navegación */}
      <div className="mt-8 flex gap-3 items-center">
        <Button
          variant="ghost"
          size="md"
          iconLeft={<IconArrowLeft size={18} />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          {current === 1 ? 'Cancelar' : 'Atrás'}
        </Button>
        <Button
          variant="primary"
          size="md"
          block
          iconRight={isLastStep ? <IconCheck size={18} /> : <IconArrowRight size={18} />}
          onClick={onNext}
          disabled={nextDisabled || isSubmitting}
        >
          {isSubmitting ? 'Publicando…' : isLastStep ? 'Publicar' : 'Siguiente'}
        </Button>
      </div>
    </Container>
  )
}
