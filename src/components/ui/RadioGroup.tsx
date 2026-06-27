import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface RadioOption<T extends string = string> {
  value: T
  label: string
  description?: string
  icon?: ReactNode
}

export interface RadioGroupProps<T extends string = string> {
  label: string
  name: string
  value: T | undefined
  onChange: (value: T) => void
  options: RadioOption<T>[]
  error?: string
  hint?: string
  /** 1 = lista apilada (default), 2/3 = rejilla. */
  columns?: 1 | 2 | 3
}

const cols: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
}

/** Grupo de opciones tipo tarjeta. Radios nativos = navegación por teclado gratis. */
export function RadioGroup<T extends string = string>({
  label,
  name,
  value,
  onChange,
  options,
  error,
  hint,
  columns = 1,
}: RadioGroupProps<T>) {
  const groupId = useId()
  const hintId = hint ? `${groupId}-hint` : undefined
  const errId = error ? `${groupId}-error` : undefined

  return (
    <fieldset
      className="flex flex-col gap-2 border-0 p-0 m-0"
      aria-describedby={cn(hintId, errId) || undefined}
    >
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      {hint && !error && (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      )}
      <div className={cn('grid gap-2', cols[columns])} role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const checked = value === o.value
          return (
            <label
              key={o.value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors duration-150',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-azul has-[:focus-visible]:outline-offset-2',
                checked
                  ? 'border-azul bg-azul-soft'
                  : 'border-line-strong bg-surface hover:border-azul/60',
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {/* indicador propio */}
              <span
                aria-hidden
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                  checked ? 'border-azul' : 'border-line-strong',
                )}
              >
                {checked && <span className="size-2.5 rounded-full bg-azul" />}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1.5 font-semibold text-ink">
                  {o.icon}
                  {o.label}
                </span>
                {o.description && (
                  <span className="text-sm text-ink-soft">{o.description}</span>
                )}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p id={errId} role="alert" className="text-sm font-medium text-coral-strong">
          {error}
        </p>
      )}
    </fieldset>
  )
}
