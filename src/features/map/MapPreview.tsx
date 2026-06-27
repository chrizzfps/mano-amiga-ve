import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import type { Map } from 'leaflet'
import type { Item, CategoryId } from '@/types/item'
import { useItemsQuery } from '@/features/feed/useItemsQuery'
import { URGENCY } from '@/lib/constants/taxonomy'
import { categoryLabel } from '@/lib/constants/categories'
import { relativeTime } from '@/lib/utils/time'
import { Link } from 'react-router-dom'
import { IconArrowRight, IconMapFold } from '@/components/icons'

function pinColor(item: Item): string {
  if (item.type === 'need') return item.urgency === 'high' ? '#E15B49' : '#F2B441'
  return '#2C8C6A'
}

function buildPopup(item: Item): string {
  const typeLabel = item.type === 'need' ? 'Necesidad' : 'Ofrecimiento'
  const cat = categoryLabel(item.category as CategoryId)
  const ago = relativeTime(item.created_at)
  return `
    <div style="font-family:system-ui,sans-serif;min-width:180px">
      <p style="font-size:11px;font-weight:700;color:#8a8690;text-transform:uppercase;margin:0 0 2px">
        ${typeLabel} · ${cat}
      </p>
      <p style="font-size:14px;font-weight:700;color:#0C3358;margin:0 0 4px">${item.title}</p>
      <p style="font-size:12px;color:#5c5862;margin:0 0 8px">${item.approximate_location_label} (${item.zone_text}) · ${ago}</p>
      <a href="/item/${item.id}" style="display:inline-block;background:#114A7B;color:#FBF6EE;
         font-size:12px;font-weight:600;padding:5px 12px;border-radius:8px;text-decoration:none">
        Ver detalle →
      </a>
    </div>
  `
}

export default function MapPreview() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<Map | null>(null)

  const { data: items } = useItemsQuery({ availableNow: true }, 'urgency')

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    void (async () => {
      const L = await import('leaflet')
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl

      const map = L.map(mapRef.current!, {
        center: [10.48, -66.9],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      leafletMap.current = map
      if (items) addPins(L, map, items)
    })()

    return () => {
      leafletMap.current?.remove()
      leafletMap.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!leafletMap.current || !items) return
    void (async () => {
      const L = await import('leaflet')
      addPins(L, leafletMap.current!, items)
    })()
  }, [items])

  function addPins(L: typeof import('leaflet'), map: Map, list: Item[]) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer)
    })
    list
      .filter((it) => it.lat != null && it.lng != null && !it.hidden)
      .forEach((item) => {
        if (item.lat == null || item.lng == null) return
        const color = pinColor(item)
        const urgencyLabel = URGENCY[item.urgency].label
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};
                             border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);"
                      title="${item.title} · ${item.type === 'need' ? urgencyLabel : 'Disponible'}">
                 </div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10],
        })
        L.marker([item.lat, item.lng], { icon })
          .bindPopup(buildPopup(item), { maxWidth: 240 })
          .addTo(map)
      })
  }

  const pinCount = items?.filter((it) => it.lat != null && it.lng != null).length ?? 0

  return (
    <div className="relative rounded-2xl overflow-hidden border border-line shadow-soft">
      {/* Mapa */}
      <div ref={mapRef} style={{ height: 420 }} className="w-full bg-cream-deep" />

      {/* Leyenda flotante */}
      <div className="absolute top-3 left-3 z-[1000] rounded-xl border border-line bg-surface/95 px-3 py-2 shadow-lift text-xs flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-coral inline-block" />
          <span className="text-ink-soft">Necesidad urgente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amarillo-strong inline-block" />
          <span className="text-ink-soft">Necesidad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-verde inline-block" />
          <span className="text-ink-soft">Ofrecimiento</span>
        </div>
      </div>

      {/* CTA inferior */}
      <div className="absolute bottom-0 inset-x-0 z-[1000] flex items-center justify-between bg-surface/90 backdrop-blur-sm px-4 py-3 border-t border-line">
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <IconMapFold size={13} />
          {pinCount > 0 ? `${pinCount} publicaciones en el mapa` : 'Pines aproximados (±500m)'}
        </p>
        <Link
          to="/mapa"
          className="flex items-center gap-1 text-xs font-bold text-azul hover:underline"
        >
          Ver mapa completo <IconArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
