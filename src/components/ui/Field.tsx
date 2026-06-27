import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  /** Oculta la etiqueta visualmente pero la mantiene para lectores de pantalla. */
  hideLabel?: boolean
  required?: boolean
  children: ReactNode
  className?: string
}

/** Estructura accesible compartida: label + hint + mensaje de error enlazados por id. */
export function Field({
  id,
  label,
  hint,
  error,
  hideLabel,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'text-sm font-semibold text-ink',
          hideLabel && 'sr-only',
        )}
      >
        {label}
        {required && <span className="text-coral"> *</span>}
      </label>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-coral-strong">
          {error}
        </p>
      )}
    </div>
  )
}

/** Calcula el aria-describedby según hint/error presentes. */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids: string[] = []
  if (hint && !error) ids.push(`${id}-hint`)
  if (error) ids.push(`${id}-error`)
  return ids.length ? ids.join(' ') : undefined
}

export const controlBase =
  'w-full rounded-lg border bg-surface px-3.5 min-h-11 text-ink placeholder:text-ink-faint ' +
  'transition-colors duration-150 outline-none ' +
  'focus-visible:border-azul aria-[invalid=true]:border-coral aria-[invalid=true]:bg-coral-soft/40'

export const controlBorder = 'border-line-strong'
