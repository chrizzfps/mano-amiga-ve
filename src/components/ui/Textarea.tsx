import { forwardRef, useId, useState, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { Field, controlBase, controlBorder, describedBy } from './Field'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  /** Muestra contador de caracteres si hay maxLength. */
  showCount?: boolean
  id?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hideLabel, required, showCount, maxLength, className, id: idProp, defaultValue, value, onChange, ...rest },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  const [count, setCount] = useState(String(value ?? defaultValue ?? '').length)

  return (
    <Field id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} required={required}>
      <textarea
        ref={ref}
        id={id}
        rows={3}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setCount(e.target.value.length)
          onChange?.(e)
        }}
        className={cn(controlBase, controlBorder, 'py-2.5 min-h-24 resize-y leading-relaxed', className)}
        {...rest}
      />
      {showCount && maxLength != null && (
        <p className="text-right text-xs text-ink-faint">
          {count}/{maxLength}
        </p>
      )}
    </Field>
  )
})
