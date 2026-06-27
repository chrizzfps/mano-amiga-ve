import { Chip } from '@/components/ui'
import { CategoryIcon, IconFilter } from '@/components/icons'
import { CATEGORIES } from '@/lib/constants/categories'
import type { ItemFilters, SortBy } from '@/lib/data'
import type { ItemType } from '@/types/item'
import type { CategoryId } from '@/types/item'

export interface FeedFiltersProps {
  filters: ItemFilters
  sort: SortBy
  onFiltersChange: (f: ItemFilters) => void
  onSortChange: (s: SortBy) => void
}

const TYPE_OPTS: { value: ItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'need', label: 'Necesidades' },
  { value: 'offer', label: 'Ofrecimientos' },
]

export function FeedFilters({ filters, sort, onFiltersChange, onSortChange }: FeedFiltersProps) {
  const set = (patch: Partial<ItemFilters>) => onFiltersChange({ ...filters, ...patch })

  return (
    <div className="flex flex-col gap-3">
      {/* Tipo */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs font-bold text-ink-soft">
          <IconFilter size={14} /> Tipo
        </span>
        {TYPE_OPTS.map((t) => (
          <Chip
            key={t.value}
            selected={filters.type === t.value || (!filters.type && t.value === 'all')}
            onClick={() => set({ type: t.value })}
          >
            {t.label}
          </Chip>
        ))}
      </div>

      {/* Categorías — scroll horizontal sin scrollbar nativa */}
      <div className="relative -mx-4">
        {/* Fade izquierdo */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-cream to-transparent" aria-hidden />
        {/* Fade derecho */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-cream to-transparent" aria-hidden />
        <div className="flex gap-2 overflow-x-auto px-4 scroll-smooth snap-x fancy-scrollbar">
          <Chip
            selected={!filters.category || filters.category === 'all'}
            onClick={() => set({ category: 'all' })}
            className="snap-start shrink-0"
          >
            Todas
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              selected={filters.category === c.id}
              onClick={() => set({ category: c.id as CategoryId })}
              icon={<CategoryIcon category={c.id} size={14} />}
              className="snap-start shrink-0"
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex gap-2 flex-wrap">
        <Chip
          selected={!!filters.urgentOnly}
          onClick={() => set({ urgentOnly: !filters.urgentOnly })}
        >
          🔴 Urgente
        </Chip>
        <Chip
          selected={!!filters.availableNow}
          onClick={() => set({ availableNow: !filters.availableNow })}
        >
          ✅ Disponible ahora
        </Chip>
        <Chip
          selected={sort === 'urgency'}
          onClick={() => onSortChange('urgency')}
        >
          Por urgencia
        </Chip>
        <Chip
          selected={sort === 'recent'}
          onClick={() => onSortChange('recent')}
        >
          Más recientes
        </Chip>
      </div>
    </div>
  )
}
