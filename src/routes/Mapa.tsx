import { lazy, Suspense } from 'react'
import { PageIntro, Container } from '@/components/layout'
import { Skeleton } from '@/components/ui'

// Leaflet y el MapView se cargan SOLO en esta ruta — nunca en el inicio.
const MapView = lazy(() => import('@/features/map/MapView'))

export default function Mapa() {
  return (
    <div className="flex flex-col flex-1">
      <PageIntro
        eyebrow="Mapa"
        title="Ver en el mapa"
        description="Pines aproximados (±500m). Para búsquedas exactas usa la lista."
      />
      <Suspense
        fallback={
          <Container className="py-4">
            <Skeleton className="h-[60vh]" />
          </Container>
        }
      >
        <MapView />
      </Suspense>
    </div>
  )
}
