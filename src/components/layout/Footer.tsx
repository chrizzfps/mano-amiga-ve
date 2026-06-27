import { Link } from 'react-router-dom'
import { IconHandHeart, IconHands } from '@/components/icons'
import { Button } from '@/components/ui'
import { Container } from './Container'

const NAV_EXPLORE = [
  { to: '/necesidades', label: 'Necesidades activas' },
  { to: '/ofertas', label: 'Ofrecimientos disponibles' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/historial', label: 'Historial de atendidas' },
  { to: '/lite', label: 'Modo Lite (conexión lenta)' },
]

const NAV_INFO = [
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/seguridad', label: 'Seguridad y privacidad' },
]

export function Footer() {
  return (
    <footer className="bg-[#08111F] text-white">

      {/* ── Bloque editorial — tagline grande ─────────────────────── */}
      <div className="border-b border-white/[0.07] py-16 sm:py-20">
        <Container size="wide">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
            Red vecinal de ayuda mutua · Venezuela
          </p>
          <blockquote className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            No todos pueden
            <br className="hidden sm:block" /> hacerlo todo.
            <br />
            <span className="text-amarillo">Pero todos pueden dar una mano.</span>
          </blockquote>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="urgent" size="lg" iconLeft={<IconHandHeart size={18} />} asChild>
              <Link to="/publicar/necesidad">Necesito ayuda</Link>
            </Button>
            <Button variant="help" size="lg" iconLeft={<IconHands size={18} />} asChild>
              <Link to="/publicar/oferta">Puedo ayudar</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* ── Links — 3 columnas ─────────────────────────────────────── */}
      <div className="border-b border-white/[0.07] py-12">
        <Container size="wide">
          <div className="grid gap-10 sm:grid-cols-3">

            {/* Marca */}
            <div className="flex flex-col gap-4">
              <Link to="/" aria-label="Inicio" className="w-fit">
                <img src="/logo.png" alt="ManoAmiga VE" className="h-10 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
              </Link>
              <p className="text-sm leading-relaxed text-white/45">
                Una iniciativa solidaria para conectar pequeñas necesidades con personas cercanas que
                pueden ayudar. Hecho con cariño para Venezuela.
              </p>
            </div>

            {/* Explorar */}
            <nav aria-label="Explorar">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/25">
                Explorar
              </p>
              <ul className="flex flex-col gap-2.5">
                {NAV_EXPLORE.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Info */}
            <nav aria-label="Información">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/25">
                Información
              </p>
              <ul className="flex flex-col gap-2.5">
                {NAV_INFO.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Nota de seguridad */}
              <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                <p className="text-xs leading-relaxed text-white/35">
                  En emergencias reales, contacta los servicios de tu municipio. ManoAmiga VE es ayuda
                  vecinal, no un servicio de emergencias.
                </p>
              </div>
            </nav>

          </div>
        </Container>
      </div>

      {/* ── Barra inferior ─────────────────────────────────────────── */}
      <div className="py-5">
        <Container size="wide" className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/25">
            © 2025 ManoAmiga VE — Iniciativa solidaria
          </p>
          <p className="text-[12px] text-white/20">
            Tu contacto nunca aparece en el feed público.
          </p>
        </Container>
      </div>

    </footer>
  )
}
