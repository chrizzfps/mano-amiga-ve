import type { ReactElement } from 'react'
import type { CategoryId } from '@/types/item'
import type { IconProps } from './icons'

function Svg({ size = 22, title, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export const IconEnergia = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.5 3.5V7M14.5 3.5V7" />
    <path d="M7 7h10v2a5 5 0 0 1-10 0Z" />
    <path d="M12 14v3a2 2 0 0 0 2 2" />
  </Svg>
)

export const IconAgua = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c4 5 6 7.7 6 10.5a6 6 0 0 1-12 0C6 10.7 8 8 12 3Z" />
    <path d="M9.4 13.2A2.6 2.6 0 0 0 12 15.8" />
  </Svg>
)

export const IconMedicina = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4h6M10 4v2M14 4v2" />
    <path d="M8.5 6h7v9a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" />
    <path d="M12 10v4M10 12h4" />
  </Svg>
)

export const IconHigiene = (p: IconProps) => (
  <Svg {...p}>
    <path d="M17 4v4h-7" />
    <path d="M6 8h8l-1.5 3h-5Z" />
    <path d="M8 14v1.5M11 14v2M14 14v1.5" />
  </Svg>
)

export const IconRefugio = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 11.5 12 4.5l8.5 7" />
    <path d="M5.5 10.5V20h13v-9.5" />
    <path d="M10.5 20v-5h3v5" />
  </Svg>
)

export const IconTransporte = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="16" r="3" />
    <circle cx="18" cy="16" r="3" />
    <path d="M6 16l2.6-5h4.4l3 5" />
    <path d="M13 11l2-2h2.5l1 2M8.6 11H6.5" />
  </Svg>
)

export const IconMascotas = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 15.5c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.5-1.3 2.6-3 2.6s-3-1.1-3-2.6Z" />
    <circle cx="7.5" cy="11" r="1.4" />
    <circle cx="10.5" cy="8.5" r="1.4" />
    <circle cx="13.5" cy="8.5" r="1.4" />
    <circle cx="16.5" cy="11" r="1.4" />
  </Svg>
)

export const IconCuidados = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8" cy="6" r="2.2" />
    <path d="M8 8.2V15M5.5 11h5M8 15l-2 5M8 15l2 5" />
    <circle cx="16" cy="9" r="1.8" />
    <path d="M16 10.8V16M14 13h4M16 16l-1.5 4M16 16l1.5 4" />
  </Svg>
)

export const IconComunicacion = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 4v-4a2 2 0 0 1-2-2Z" />
    <path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" />
  </Svg>
)

export const IconOtro = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 11.5V7a1.2 1.2 0 0 1 2.4 0v4" />
    <path d="M10.4 11V6a1.2 1.2 0 0 1 2.4 0v5" />
    <path d="M12.8 11V7.5a1.2 1.2 0 0 1 2.4 0V13" />
    <path d="M8 11.5c-1.4 0-2.3 1.2-1.8 2.6l1 2.6A5 5 0 0 0 12 20h1.2a5 5 0 0 0 5-5v-2" />
  </Svg>
)

const MAP: Record<CategoryId, (p: IconProps) => ReactElement> = {
  energia: IconEnergia,
  agua: IconAgua,
  medicina: IconMedicina,
  higiene: IconHigiene,
  refugio: IconRefugio,
  transporte: IconTransporte,
  mascotas: IconMascotas,
  cuidados: IconCuidados,
  comunicacion: IconComunicacion,
  otro: IconOtro,
}

export interface CategoryIconProps extends IconProps {
  category: CategoryId
}

export function CategoryIcon({ category, ...rest }: CategoryIconProps) {
  const Cmp = MAP[category] ?? IconOtro
  return <Cmp {...rest} />
}
