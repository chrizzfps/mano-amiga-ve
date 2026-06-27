import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'
import {
  IconHandHeart,
  IconHands,
  IconHeart,
  IconHome,
  IconMapFold,
  IconPlus,
} from '@/components/icons'

const ITEMS = [
  { to: '/', label: 'Inicio', icon: IconHome, end: true },
  { to: '/necesidades', label: 'Necesidades', icon: IconHeart, end: false },
  { to: '/ofertas', label: 'Ofrece', icon: IconHands, end: false },
  { to: '/mapa', label: 'Mapa', icon: IconMapFold, end: false },
]

export function BottomNav() {
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="md:hidden">
      {/* Hoja de acciones para publicar */}
      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink/30 motion-safe:animate-[ma-toast-in_150ms_ease]"
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-label="Publicar"
            className="fixed inset-x-3 bottom-[5.5rem] z-50 flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3 shadow-lift motion-safe:animate-[ma-toast-in_200ms_ease]"
          >
            <Link
              to="/publicar/necesidad"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-coral-soft px-4 py-3 font-semibold text-coral-strong"
            >
              <IconHandHeart size={22} />
              Necesito ayuda
            </Link>
            <Link
              to="/publicar/oferta"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-verde-soft px-4 py-3 font-semibold text-verde-strong"
            >
              <IconHands size={22} />
              Puedo ayudar
            </Link>
          </div>
        </>
      )}

      <nav
        aria-label="Navegación inferior"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-1">
          {ITEMS.slice(0, 2).map((it) => (
            <NavItem key={it.to} {...it} />
          ))}

          <li className="flex justify-center">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Publicar"
              className={cn(
                'mb-1 flex size-14 -translate-y-3 items-center justify-center rounded-full bg-azul text-cream shadow-lift transition-transform',
                open && 'rotate-45',
              )}
            >
              <IconPlus size={26} />
            </button>
          </li>

          {ITEMS.slice(2).map((it) => (
            <NavItem key={it.to} {...it} />
          ))}
        </ul>
      </nav>
    </div>
  )
}

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof IconHome
  end: boolean
}) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[0.7rem] font-semibold',
            isActive ? 'text-azul-strong' : 'text-ink-faint',
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon size={22} className={isActive ? 'text-azul' : undefined} />
            <span>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  )
}
