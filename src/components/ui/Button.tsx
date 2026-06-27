import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'help' | 'urgent' | 'soft' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Ocupa todo el ancho (útil en móvil). */
  block?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** Renderiza el estilo sobre el hijo (ej. un <Link>) en vez de un <button>. */
  asChild?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg ' +
  'transition-[background-color,color,box-shadow,transform] duration-150 ' +
  'active:translate-y-px disabled:opacity-55 disabled:pointer-events-none select-none ' +
  'no-underline'

const variants: Record<Variant, string> = {
  primary: 'bg-azul text-cream hover:bg-azul-strong shadow-soft',
  help: 'bg-verde text-cream hover:bg-verde-strong shadow-soft',
  urgent: 'bg-coral text-cream hover:bg-coral-strong shadow-soft',
  soft: 'bg-azul-soft text-azul-strong hover:bg-[color-mix(in_srgb,var(--color-azul-soft)_82%,#fff)]',
  outline: 'border-2 border-line-strong text-ink hover:border-azul hover:text-azul-strong bg-surface/60',
  ghost: 'text-ink hover:bg-cream-deep',
}

const sizes: Record<Size, string> = {
  // min-h asegura áreas táctiles cómodas (>=44px) en móvil
  sm: 'text-sm px-3 min-h-9',
  md: 'text-[0.95rem] px-4 min-h-11',
  lg: 'text-base px-5 min-h-12',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', block?: boolean) {
  return cn(base, variants[variant], sizes[size], block && 'w-full')
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, iconLeft, iconRight, asChild, className, children, type, ...rest },
  ref,
) {
  const classes = cn(buttonClasses(variant, size, block), className)

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      children: (
        <>
          {iconLeft}
          {child.props.children}
          {iconRight}
        </>
      ),
    })
  }

  return (
    <button ref={ref} type={type ?? 'button'} className={classes} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
})
