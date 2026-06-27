import type { SVGProps } from 'react'

interface BrandMarkProps extends SVGProps<SVGSVGElement> {
  size?: number
  /** Logo completo con cuadro azul (true) o solo el trazo de las manos (false). */
  boxed?: boolean
}

/** Marca de ManoAmiga VE: dos manos que se encuentran en un punto cálido. */
export function BrandMark({ size = 32, boxed = true, ...rest }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="ManoAmiga VE"
      {...rest}
    >
      {boxed && <rect width="64" height="64" rx="15" fill="var(--color-azul)" />}
      <g
        fill="none"
        stroke={boxed ? 'var(--color-cream)' : 'currentColor'}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 41c-3.6-2.1-4.6-6.2-2.4-9.3l7.3-10.3c1-1.5 3.1-1 3.1.9l-.4 7.4" />
        <path d="M49 41c3.6-2.1 4.6-6.2 2.4-9.3l-7.3-10.3c-1-1.5-3.1-1-3.1.9l.4 7.4" />
      </g>
      <circle cx="32" cy="35" r="5.6" fill="var(--color-amarillo)" />
      <circle cx="32" cy="35" r="2.3" fill={boxed ? 'var(--color-azul)' : 'var(--color-cream)'} />
    </svg>
  )
}
