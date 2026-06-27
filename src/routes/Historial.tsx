import { useState } from 'react'
import { PageIntro, Container } from '@/components/layout'
import { Skeleton, EmptyState } from '@/components/ui'
import { IconCheck, IconSpark } from '@/components/icons'
import { ItemCard } from '@/features/items/ItemCard'
import { useItemsQuery } from '@/features/feed/useItemsQuery'
import type { ItemType } from '@/types/item'

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 space-y-2" aria-hidden>
      <Skeleton shape="line" className="h-4 w-20" />
      <Skeleton shape="line" className="h-5 w-3/4" />
      <Skeleton shape="line" className="h-3.5 w-1/2" />
      <Skeleton shape="block" className="mt-3 h-9" />
    </div>
  )
}

const TYPE_TABS: { value: ItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'need', label: 'Necesidades' },
  { value: 'offer', label: 'Ofrecimientos' },
]

export default function Historial() {
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all')

  const { data: items, isLoading } = useItemsQuery(
    { fulfilledOnly: true, type: typeFilter },
    'recent',
  )

  return (
    <div className="flex flex-col flex-1">
      <PageIntro
        eyebrow="Historial"
        title="Publicaciones atendidas"
        description="Registro de necesidades y ofertas que ya encontraron su mano amiga."
      />

      <Container size="wide" className="pb-12 flex flex-col gap-6">
        {/* Tabs de tipo */}
        <div className="flex gap-2 flex-wrap">
          {TYPE_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTypeFilter(t.value)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                typeFilter === t.value
                  ? 'bg-verde text-cream'
                  : 'bg-cream-deep/60 text-ink-soft hover:bg-verde-soft hover:text-verde-strong',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !items?.length ? (
          <EmptyState
            icon={<IconSpark size={26} />}
            title="Sin publicaciones atendidas aún"
            description="Cuando alguien marque una publicación como atendida, aparecerá aquí."
          />
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-verde-strong font-semibold">
              <IconCheck size={16} />
              {items.length} {items.length === 1 ? 'publicación atendida' : 'publicaciones atendidas'}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  )
}
