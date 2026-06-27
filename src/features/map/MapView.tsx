import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import type { Map } from 'leaflet'
import type { Item } from '@/types/item'
import type { CategoryId } from '@/types/item'
import { useItemsQuery } from '@/features/feed/useItemsQuery'
import { CATEGORIES } from '@/lib/constants/categories'
import { URGENCY } from '@/lib/constants/taxonomy'
import { Chip, EmptyState } from '@/components/ui'
import { IconMapFold, IconSpark } from '@/components/icons'
import { Container } from '@/components/layout'
import { categoryLabel } from '@/lib/constants/categories'
import { relativeTime } from '@/lib/utils/time'
import { useState } from 'react'

/* ---- Colores por tipo de ítem ---- */
function pinColor(item: Item): string {
  if (item.type === 'need') {
    return item.urgency === 'high' ? '#E15B49' : '#F2B441'
  }
  return '#2C8C6A'
}

function buildPopup(item: Item): string {
  const typeLabel = item.type === 'need' ? 'Necesidad' : 'Ofrecimiento'
  const ago = relativeTime(item.created_at)
  const cat = categoryLabel(item.category as CategoryId)
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;min-width:200px">
      <p style="font-size:11px;font-weight:700;color:#8a8690;text-transform:uppercase;margin:0 0 2px">
        ${typeLabel} · ${cat}
      </p>
      <p style="font-size:15px;font-weight:700;color:#0C3358;margin:0 0 4px">${item.title}</p>
      <p style="font-size:12px;color:#5c5862;margin:0 0 8px">${item.zone_text} · ${ago}</p>
      <a href="/item/${item.id}" style="display:inline-block;background:#114A7B;color:#FBF6EE;
         font-size:12px;font-weight:600;padding:5px 12px;border-radius:8px;text-decoration:none">
        Ver detalle →
      </a>
      <p style="font-size:10px;color:#8a8690;margin-top:6px">
        📍 Ubicación aproximada (±500m)
      </p>
    </div>
  `
}

function MapLegend() {
  return (
    <div className="absolute bottom-6 right-3 z-[1000] rounded-xl border border-line bg-surface/95 p-3 shadow-lift text-xs">
      <p className="font-bold text-ink-soft mb-2 uppercase tracking-wide">Leyenda</p>
      <ul className="flex flex-col gap-1.5">
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-coral inline-block" />
          Necesidad urgente
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-amarillo-strong inline-block" />
          Necesidad
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-verde inline-block" />
          Ofrecimiento disponible
        </li>
      </ul>
      <p className="mt-2 text-ink-faint">Pins aproximados (±500m)</p>
    </div>
  )
}

export default function MapView() {
  const [catFilter, setCatFilter] = useState<CategoryId | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'need' | 'offer'>('all')
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<Map | null>(null)
  const mapReady = useRef(false)

  const { data: items, isLoading } = useItemsQuery({
    category: catFilter,
    type: typeFilter,
  })

  // Inicializa el mapa Leaflet solo una vez — siempre renderizamos el div del mapa
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    void (async () => {
      const L = await import('leaflet')

      // Workaround para el icono roto en Vite
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl

      const map = L.map(mapRef.current!, {
        center: [10.48, -66.9],
        zoom: 10,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      leafletMap.current = map
      mapReady.current = true

      // Si ya hay items cargados cuando el mapa termina, agregar markers
      if (items) updateMarkers(L, map, items)
    })()

    return () => {
      leafletMap.current?.remove()
      leafletMap.current = null
      mapReady.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Función para actualizar markers
  async function updateMarkers(
    Leaflet: typeof import('leaflet'),
    map: Map,
    itemList: Item[],
  ) {
    map.eachLayer((layer) => {
      if (layer instanceof Leaflet.Marker) {
        map.removeLayer(layer)
      }
    })

    const eligible = itemList.filter(
      (it) => it.lat != null && it.lng != null && !it.hidden,
    )

    eligible.forEach((item) => {
      if (item.lat == null || item.lng == null) return

      const color = pinColor(item)
      const urgencyLabel = URGENCY[item.urgency].label

      const icon = Leaflet.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};
                           border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3);"
                    title="${item.title} · ${item.type === 'need' ? urgencyLabel : 'Disponible'}">
               </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10],
      })

      Leaflet.marker([item.lat, item.lng], { icon })
        .bindPopup(buildPopup(item), { maxWidth: 260 })
        .addTo(map)
    })
  }

  // Actualiza markers cuando cambian los items o filtros
  useEffect(() => {
    if (!leafletMap.current || !items) return
    void (async () => {
      const Leaflet = await import('leaflet')
      await updateMarkers(Leaflet, leafletMap.current!, items)
    })()
  }, [items])

  const withCoords = items?.filter((it) => it.lat != null && it.lng != null) ?? []

  return (
    <div className="flex flex-col gap-0">
      {/* Filtros compactos sobre el mapa */}
      <div className="border-b border-line bg-cream px-4 py-3">
        <div className="relative -mx-4">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-cream to-transparent" aria-hidden />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-cream to-transparent" aria-hidden />
          <div className="flex gap-2 overflow-x-auto px-4 fancy-scrollbar">
            <Chip selected={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>Todo</Chip>
            <Chip selected={typeFilter === 'need'} onClick={() => setTypeFilter('need')}>Necesidades</Chip>
            <Chip selected={typeFilter === 'offer'} onClick={() => setTypeFilter('offer')}>Ofrecimientos</Chip>
            <span className="w-px bg-line mx-1 shrink-0" />
            <Chip selected={catFilter === 'all'} onClick={() => setCatFilter('all')}>Todas las categorías</Chip>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                selected={catFilter === c.id}
                onClick={() => setCatFilter(c.id)}
                className="shrink-0"
              >
                {c.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Aviso: lista como alternativa */}
      <div className="bg-azul-soft border-b border-line px-4 py-2 text-xs text-azul-strong font-semibold">
        El mapa es orientativo. Usa la{' '}
        <a href="/necesidades" className="underline">lista</a>{' '}
        para ver todas las publicaciones.{' '}
        {withCoords.length > 0 && `Mostrando ${withCoords.length} pines aproximados.`}
      </div>

      {/* Mapa — siempre renderizado para que el ref esté disponible */}
      <div className="relative" style={{ height: 'max(60vh, 400px)' }}>
        <div ref={mapRef} className="h-full w-full" />
        <MapLegend />

        {/* Skeleton superpuesto mientras carga */}
        {isLoading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-cream/70 animate-pulse">
            <p className="text-sm font-semibold text-ink-soft">Cargando mapa…</p>
          </div>
        )}

        {withCoords.length === 0 && !isLoading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-cream/80">
            <EmptyState
              icon={<IconSpark size={26} />}
              title="Sin pines en el mapa"
              description="Las publicaciones sin coordenadas o con los filtros actuales no aparecen aquí."
              action={
                <a href="/necesidades" className="text-sm font-semibold text-azul underline">
                  Ver lista completa
                </a>
              }
            />
          </div>
        )}
      </div>

      <Container className="py-3">
        <p className="flex items-center gap-1.5 text-xs text-ink-faint">
          <IconMapFold size={14} />
          Los pines muestran una ubicación aproximada (±500m) para proteger la privacidad de quien publica.
        </p>
      </Container>
    </div>
  )
}
