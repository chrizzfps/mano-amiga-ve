import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
  /** Si se pasa, el icono es semántico (role=img); si no, es decorativo (aria-hidden). */
  title?: string
}

/** Base compartida: garantiza un trazo coherente en todo el set propio. */
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

/* ---- Navegación / acciones ---- */

export const IconList = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Svg>
)

export const IconMapFold = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
)

export const IconPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IconHome = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v9h12v-9" />
    <path d="M10 19v-5h4v5" />
  </Svg>
)

export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
)

export const IconInfo = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5h.01" />
  </Svg>
)

export const IconSearch = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4-4" />
  </Svg>
)

export const IconFilter = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16l-6 7v6l-4-2v-4Z" />
  </Svg>
)

export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5 9.5 17 19 7" />
  </Svg>
)

export const IconFlag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3v18" />
    <path d="M6 4h11l-2.2 3.2L17 11H6" />
  </Svg>
)

export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const IconArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
)

export const IconChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
)

export const IconClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)

export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)

export const IconUsers = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9" />
  </Svg>
)

export const IconHeart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20S4.5 15.5 4.5 9.8A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7.5 1.8C19.5 15.5 12 20 12 20Z" />
  </Svg>
)

export const IconShare = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="12" r="2.4" />
    <circle cx="17" cy="6" r="2.4" />
    <circle cx="17" cy="18" r="2.4" />
    <path d="M8.1 11 14.9 7.2M8.1 13l6.8 3.8" />
  </Svg>
)

export const IconWhatsApp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20l1.3-3.7A7.5 7.5 0 1 1 8 19l-4 1Z" />
    <path d="M9 9c0 3 2.5 5.5 5.5 5.5.6 0 .9-.6.7-1.1l-.5-1.1-1.6.6c-1-.5-1.9-1.4-2.4-2.4l.6-1.6-1.1-.5c-.5-.2-1.1.1-1.1.7Z" />
  </Svg>
)

export const IconHandHeart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 9.6 11 8.6a1.7 1.7 0 0 0-2.4 2.4l3.4 3.3 3.4-3.3A1.7 1.7 0 0 0 13 8.6Z" />
    <path d="M4 15h2.5l2.2 1.6c.5.4 1.2.6 1.9.6h3.2a1.3 1.3 0 0 0 0-2.6H10" />
    <path d="M4 14v6" />
  </Svg>
)

export const IconHands = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11 13V8.2a1.2 1.2 0 0 0-2.4 0V13" />
    <path d="M8.6 13V9.6a1.2 1.2 0 0 0-2.4 0V15a5 5 0 0 0 5 5h.4" />
    <path d="M13 13V8.2a1.2 1.2 0 0 1 2.4 0V13" />
    <path d="M15.4 13V9.6a1.2 1.2 0 0 1 2.4 0V15a5 5 0 0 1-5 5h-.4" />
  </Svg>
)

export const IconSpark = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6Z" />
  </Svg>
)
