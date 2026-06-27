import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { Field, controlBase, controlBorder, describedBy } from './Field'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  id?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, required, className, id: idProp, ...rest },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <Field id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} required={required}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        className={cn(controlBase, controlBorder, className)}
        {...rest}
      />
    </Field>
  )
})
