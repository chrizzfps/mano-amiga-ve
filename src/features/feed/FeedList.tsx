import { useState, useId } from 'react'
import { Link } from 'react-router-dom'
import { useItemsQuery } from './useItemsQuery'
import { FeedFilters } from './FeedFilters'
import { ItemCard } from '@/features/items/ItemCard'
import { Skeleton, EmptyState, Button } from '@/components/ui'
import { IconList, IconHandHeart, IconSpark, IconSearch } from '@/components/icons'
import { Input } from '@/components/ui'
import type { ItemFilters, SortBy } from '@/lib/data'
import type { ItemType } from '@/types/item'

interface FeedListProps {
  defaultType?: ItemType | 'all'
  defaultFilters?: Partial<ItemFilters>
  title?: string
  eyebrow?: string
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 space-y-2" aria-hidden>
      <Skeleton shape="line" className="h-4 w-20" />
      <Skeleton shape="line" className="h-5 w-3/4" />
      <Skeleton shape="line" className="h-3.5 w-1/2" />
      <Skeleton shape="line" className="h-3.5 w-full" />
      <Skeleton shape="block" className="mt-3 h-9" />
    </div>
  )
}

export function FeedList({ defaultType = 'all', defaultFilters, title, eyebrow }: FeedListProps) {
  const zoneId = useId()
  const [filters, setFilters] = useState<ItemFilters>({
    type: defaultType,
    category: 'all',
    availableNow: true,
    ...defaultFilters,
  })
  const [sort, setSort] = useState<SortBy>('urgency')
  const [zoneInput, setZoneInput] = useState('')

  // Aplica la búsqueda por zona con debounce manual en onChange
  const activeFilters: ItemFilters = {
    ...filters,
    zone: zoneInput.trim() || undefined,
  }

  const { data: items, isLoading, isError } = useItemsQuery(activeFilters, sort)

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      {(title ?? eyebrow) && (
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-amarillo-strong mb-1">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="text-2xl font-extrabold text-azul-strong">{title}</h2>}
        </div>
      )}

      {/* Búsqueda por zona */}
      <Input
        id={zoneId}
        label="Buscar por zona"
        hideLabel
        placeholder="Buscar por zona o sector…"
        value={zoneInput}
        onChange={(e) => setZoneInput(e.target.value)}
      />

      {/* Filtros */}
      <FeedFilters
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      {/* Resultados */}
      {isLoading ? (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Cargando publicaciones"
          aria-busy
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<IconSpark size={26} />}
          title="No se pudo cargar el feed"
          description="Hubo un problema al cargar las publicaciones. Intenta de nuevo."
          action={<Button onClick={() => window.location.reload()}>Recargar</Button>}
        />
      ) : !items?.length ? (
        <EmptyState
          icon={
            zoneInput ? <IconSearch size={26} /> : <IconList size={26} />
          }
          title={
            zoneInput
              ? `Sin resultados para "${zoneInput}"`
              : 'No hay publicaciones con estos filtros'
          }
          description={
            zoneInput
              ? 'Prueba con otro sector o quita la búsqueda.'
              : 'Prueba cambiando los filtros o sé el primero en publicar.'
          }
          action={
            <Button
              variant={filters.type === 'offer' ? 'help' : 'urgent'}
              iconLeft={<IconHandHeart size={18} />}
              asChild
            >
              <Link to={filters.type === 'offer' ? '/publicar/oferta' : '/publicar/necesidad'}>
                {filters.type === 'offer' ? 'Publicar una oferta' : 'Publicar una necesidad'}
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <p className="text-sm text-ink-soft">
            {items.length} {items.length === 1 ? 'publicación' : 'publicaciones'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
