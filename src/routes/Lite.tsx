import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useItemsQuery } from '@/features/feed/useItemsQuery'
import { relativeTime, formatUntil } from '@/lib/utils/time'
import { cn } from '@/lib/utils/cn'
import { URGENCY } from '@/lib/constants/taxonomy'
import { categoryLabel } from '@/lib/constants/categories'
import type { Item } from '@/types/item'
import type { CategoryId } from '@/types/item'

/* Modo Lite: sin mapa, sin imágenes, sin animaciones, feed compacto.
   Diseñado para conexiones muy lentas. CSS mínimo. */

function LiteRow({ item }: { item: Item }) {
  const isNeed = item.type === 'need'
  const urgMeta = URGENCY[item.urgency]
  const cat = categoryLabel(item.category as CategoryId)
  const time =
    isNeed
      ? relativeTime(item.created_at)
      : item.available_until
        ? formatUntil(item.available_until)
        : relativeTime(item.created_at)

  return (
    <li
      className={cn(
        'border-b border-line px-4 py-3 last:border-0',
        isNeed && item.urgency === 'high' && 'bg-coral-soft/30',
      )}
    >
      <Link to={`/item/${item.id}`} className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase',
              isNeed ? 'bg-coral-soft text-coral-strong' : 'bg-verde-soft text-verde-strong',
            )}
          >
            {isNeed ? (item.urgency === 'high' ? '🔴 Urgente' : 'Necesidad') : '✅ Ofrecimiento'}
          </span>
          <span className="text-xs text-ink-faint">{cat}</span>
        </div>
        <span className="font-bold text-azul-strong">{item.title}</span>
        <span className="text-sm text-ink-soft">
          {item.approximate_location_label} ({item.zone_text}) · {time}
        </span>
        {isNeed && (
          <span className="text-xs text-ink-faint">{urgMeta.label}</span>
        )}
      </Link>
    </li>
  )
}

export default function Lite() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'need' | 'offer'>('all')
  const [urgentOnly, setUrgentOnly] = useState(false)

  const { data: items, isLoading } = useItemsQuery(
    { type: typeFilter, urgentOnly, availableNow: true },
    'urgency',
  )

  return (
    <div style={{ fontFamily: 'system-ui,-apple-system,sans-serif', maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Encabezado ultra compacto */}
      <div style={{ borderBottom: '1px solid #e8dece', padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong style={{ color: '#114A7B', fontSize: '16px' }}>ManoAmiga VE</strong>
          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#8a8690', background: '#e7eef5', padding: '2px 7px', borderRadius: '99px' }}>Modo Lite</span>
        </div>
        <Link to="/" style={{ fontSize: '12px', color: '#114A7B' }}>Versión completa →</Link>
      </div>

      {/* Filtros mínimos */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '10px 0' }}>
        {(['all', 'need', 'offer'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            style={{
              border: `2px solid ${typeFilter === t ? '#114A7B' : '#e8dece'}`,
              background: typeFilter === t ? '#114A7B' : '#fff',
              color: typeFilter === t ? '#FBF6EE' : '#232026',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {t === 'all' ? 'Todo' : t === 'need' ? 'Necesidades' : 'Ofrecimientos'}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUrgentOnly((v) => !v)}
          style={{
            border: `2px solid ${urgentOnly ? '#E15B49' : '#e8dece'}`,
            background: urgentOnly ? '#fbe1db' : '#fff',
            color: urgentOnly ? '#C4412F' : '#232026',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🔴 Solo urgentes
        </button>
      </div>

      {/* Botones de publicar (grandes, táctiles) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <Link
          to="/publicar/necesidad"
          style={{
            flex: 1, display: 'block', background: '#E15B49', color: '#fff',
            textAlign: 'center', padding: '12px', borderRadius: '10px',
            fontWeight: '700', fontSize: '14px', textDecoration: 'none',
          }}
        >
          Necesito ayuda
        </Link>
        <Link
          to="/publicar/oferta"
          style={{
            flex: 1, display: 'block', background: '#2C8C6A', color: '#fff',
            textAlign: 'center', padding: '12px', borderRadius: '10px',
            fontWeight: '700', fontSize: '14px', textDecoration: 'none',
          }}
        >
          Puedo ayudar
        </Link>
      </div>

      {/* Feed compacto */}
      {isLoading ? (
        <p style={{ color: '#8a8690', fontSize: '14px', padding: '20px 0' }}>Cargando…</p>
      ) : !items?.length ? (
        <p style={{ color: '#8a8690', fontSize: '14px', padding: '20px 0' }}>
          No hay publicaciones con estos filtros.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #e8dece', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
          {items.map((item) => (
            <LiteRow key={item.id} item={item} />
          ))}
        </ul>
      )}

      <p style={{ fontSize: '11px', color: '#8a8690', marginTop: '16px', textAlign: 'center' }}>
        Vista simplificada · sin mapa · sin imágenes
      </p>
    </div>
  )
}
