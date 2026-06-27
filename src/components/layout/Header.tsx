import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'
import { IconHandHeart, IconHands, IconInfo, IconList, IconClose } from '@/components/icons'
import { Button } from '@/components/ui'
import { Container } from './Container'

/* Solo las rutas de acción/consulta diaria en el header.
   "Cómo funciona" y "Seguridad" viven en el footer — no saturan la barra. */
const NAV = [
  { to: '/necesidades', label: 'Necesidades' },
  { to: '/ofertas', label: 'Ofrecimientos' },
  { to: '/mapa', label: 'Mapa' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Bloquear scroll del body al abrir el menú móvil
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-[10000] border-b border-black/[0.06] bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72">
        <Container size="wide" className="flex h-16 items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 font-bold text-azul-strong focus-visible:rounded-md"
            aria-label="ManoAmiga VE — Inicio"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src="/logo.png" alt="ManoAmiga VE" className="h-12 w-auto" />
          </Link>

          {/* ── Nav principal (desktop) ── */}
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      cn(
                        'relative rounded-lg px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors',
                        isActive
                          ? 'text-azul-strong after:absolute after:inset-x-3 after:-bottom-px after:h-[2px] after:rounded-full after:bg-azul'
                          : 'text-ink-soft hover:text-ink',
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Acciones (Desktop) ── */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[13px] text-ink-soft hover:text-ink"
              asChild
            >
              <Link to="/como-funciona">Cómo funciona</Link>
            </Button>

            <div className="h-4 w-px bg-line" aria-hidden />

            <Button
              variant="urgent"
              size="sm"
              iconLeft={<IconHandHeart size={15} />}
              asChild
            >
              <Link to="/publicar/necesidad">
                <span>Necesito ayuda</span>
              </Link>
            </Button>
            <Button
              variant="help"
              size="sm"
              iconLeft={<IconHands size={15} />}
              asChild
            >
              <Link to="/publicar/oferta">
                <span>Puedo ayudar</span>
              </Link>
            </Button>
          </div>

          {/* ── Burger Trigger (Mobile) ── */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden flex size-10 items-center justify-center rounded-lg border border-line text-ink hover:bg-cream-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul"
          >
            {isMobileMenuOpen ? <IconClose size={20} /> : <IconList size={20} />}
          </button>

        </Container>
      </header>

      {/* ── Menú Móvil Desplegable ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[10000] flex flex-col bg-white/95 backdrop-blur-xl p-6 md:hidden animate-[ma-toast-in_180ms_ease] overflow-y-auto">
          {/* Enlaces del menú principal */}
          <nav aria-label="Menú móvil" className="flex-1">
            <ul className="flex flex-col gap-2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors',
                        isActive
                          ? 'bg-azul-soft text-azul-strong'
                          : 'text-ink-soft hover:bg-cream-deep hover:text-ink',
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
              
              {/* Enlace "Cómo funciona" */}
              <li>
                <NavLink
                  to="/como-funciona"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors',
                      isActive
                        ? 'bg-azul-soft text-azul-strong'
                        : 'text-ink-soft hover:bg-cream-deep hover:text-ink',
                    )
                  }
                >
                  <IconInfo size={18} />
                  <span>Cómo funciona</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Botones de acción al final */}
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-line">
            <Button
              variant="urgent"
              size="lg"
              block
              iconLeft={<IconHandHeart size={18} />}
              asChild
            >
              <Link to="/publicar/necesidad">
                <span>Necesito ayuda</span>
              </Link>
            </Button>
            
            <Button
              variant="help"
              size="lg"
              block
              iconLeft={<IconHands size={18} />}
              asChild
            >
              <Link to="/publicar/oferta">
                <span>Puedo ayudar</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
