import { Link } from 'react-router-dom'
import type { Item } from '@/types/item'
import { cn } from '@/lib/utils/cn'
import { relativeTime, formatUntil } from '@/lib/utils/time'
import { Card, UrgencyBadge, StatusBadge, Button } from '@/components/ui'
import { CategoryPill } from '@/components/ui'
import { IconCheck, IconHandHeart, IconUsers } from '@/components/icons'

export interface ItemCardProps {
  item: Item
  className?: string
}

/**
 * Tarjeta pública de ítem. NO muestra datos de contacto.
 * Variante necesidad: acento coral · CTA "Puedo ayudar"
 * Variante oferta: acento verde · CTA "Ver oferta"
 */
export function ItemCard({ item, className }: ItemCardProps) {
  const isNeed = item.type === 'need'
  const accent = isNeed ? 'coral' : 'verde'

  const metaTime =
    isNeed
      ? relativeTime(item.created_at)
      : item.available_until
        ? formatUntil(item.available_until)
        : relativeTime(item.created_at)

  return (
    <Card accent={accent} interactive className={cn('flex flex-col gap-0', className)}>
      <Link
        to={`/item/${item.id}`}
        className="flex flex-1 flex-col gap-2 p-4 outline-none"
        aria-label={`${item.title} — ${item.approximate_location_label}`}
      >
        {/* Fila superior: badges */}
        <div className="flex flex-wrap items-center gap-2">
          {isNeed ? (
            <UrgencyBadge urgency={item.urgency} />
          ) : (
            <StatusBadge status={item.status} />
          )}
          <CategoryPill category={item.category} />
        </div>

        {/* Título */}
        <h3 className="font-bold text-azul-strong leading-snug">{item.title}</h3>

        {/* Zona + tiempo */}
        <div className="text-xs text-ink-soft flex flex-col gap-0.5">
          <p className="font-semibold text-ink-strong">{item.approximate_location_label}</p>
          <p>Zona aproximada: {item.zone_text} &middot; {metaTime}</p>
        </div>

        {/* Descripción corta */}
        <p className="text-sm text-ink line-clamp-2">{item.description}</p>

        {/* Verificaciones */}
        {item.verified_count > 0 && (
          <p className="flex items-center gap-1 text-xs font-semibold text-verde-strong">
            <IconUsers size={14} />
            Verificado por {item.verified_count} {item.verified_count === 1 ? 'vecino' : 'vecinos'}
          </p>
        )}
      </Link>

      {/* CTA */}
      <div className="border-t border-line px-4 pb-3 pt-3">
        <Button
          variant={isNeed ? 'urgent' : 'help'}
          size="sm"
          block
          iconLeft={isNeed ? <IconHandHeart size={16} /> : <IconCheck size={16} />}
          asChild
        >
          <Link to={`/item/${item.id}`}>
            {isNeed ? 'Puedo ayudar' : 'Ver oferta'}
          </Link>
        </Button>
      </div>
    </Card>
  )
}
