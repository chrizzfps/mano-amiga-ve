import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import { SkipLink } from './SkipLink'
import { RouteFallback } from './RouteFallback'

/** Estructura base responsive de toda la app. */
export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header />
      <main id="contenido" tabIndex={-1} className="flex-1 flex flex-col outline-none">
        <Suspense fallback={<RouteFallback />}>
          <div className="flex flex-col flex-1">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
      {/* Espaciador para que el contenido no quede bajo la barra inferior en móvil */}
      <div className="h-20 md:hidden" aria-hidden />
      <BottomNav />
      <ScrollRestoration />
    </div>
  )
}
