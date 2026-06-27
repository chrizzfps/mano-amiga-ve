import { Skeleton } from '@/components/ui'
import { Container } from './Container'

/** Fallback mientras carga un chunk de ruta (lazy). */
export function RouteFallback() {
  return (
    <Container className="py-10" aria-busy>
      <span className="sr-only">Cargando…</span>
      <Skeleton shape="line" className="h-7 w-48" />
      <Skeleton shape="line" className="mt-3 h-4 w-72 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </Container>
  )
}
