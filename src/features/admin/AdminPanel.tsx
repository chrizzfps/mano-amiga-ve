import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Item } from '@/types/item'
import type { ItemStatus } from '@/types/item'
import { useItemsQuery, useUpdateStatus, useSetHidden } from '@/features/feed/useItemsQuery'
import { relativeTime } from '@/lib/utils/time'
import { categoryLabel } from '@/lib/constants/categories'
import type { CategoryId } from '@/types/item'
import {
  Button,
  Badge,
  Chip,
  Input,
  EmptyState,
  Skeleton,
  useToast,
} from '@/components/ui'
import {
  IconList,
  IconFilter,
  IconFlag,
  IconCheck,
  IconClose,
} from '@/components/icons'
import { clearAdminSession } from './AdminAuthGate'
import { Container, PageIntro } from '@/components/layout'

type AdminFilter = 'all' | 'needs' | 'offers' | 'reported' | 'fulfilled' | 'hidden'

const FILTER_OPTS: { value: AdminFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'needs', label: 'Necesidades' },
  { value: 'offers', label: 'Ofrecimientos' },
  { value: 'reported', label: 'Reportadas' },
  { value: 'fulfilled', label: 'Atendidas' },
  { value: 'hidden', label: 'Ocultas' },
]

function AdminRow({ item }: { item: Item }) {
  const { toast } = useToast()
  const updateStatus = useUpdateStatus()
  const setHidden = useSetHidden()

  function doStatus(status: ItemStatus) {
    updateStatus.mutate(
      { id: item.id, status },
      { onSuccess: () => toast(`Estado: ${status}`, { tone: 'verde' }) },
    )
  }

  function doHide(h: boolean) {
    setHidden.mutate(
      { id: item.id, hidden: h },
      { onSuccess: () => toast(h ? 'Ocultada' : 'Visible', { tone: 'azul' }) },
    )
  }

  const isBusy = updateStatus.isPending || setHidden.isPending

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${item.hidden ? 'bg-cream-deep opacity-60' : 'bg-surface border-line'}`}>
      {/* Encabezado */}
      <div className="flex items-start gap-3 justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <Badge tone={item.type === 'need' ? 'coral' : 'verde'}>
              {item.type === 'need' ? 'Necesidad' : 'Ofrecimiento'}
            </Badge>
            <Badge tone="neutral">{categoryLabel(item.category as CategoryId)}</Badge>
            {item.report_count > 0 && (
              <Badge tone="coral" icon={<IconFlag size={11} />}>{item.report_count} reportes</Badge>
            )}
            {item.hidden && <Badge tone="neutral">Oculta</Badge>}
          </div>
          <Link to={`/item/${item.id}`} className="font-bold text-azul-strong hover:underline text-sm block">
            {item.title}
          </Link>
          <p className="text-xs text-ink-faint">
            {item.approximate_location_label} ({item.zone_text}) · {relativeTime(item.created_at)} · Estado: {item.status}
          </p>
        </div>
      </div>

      {/* Acciones de moderación */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="help"
          size="sm"
          iconLeft={<IconCheck size={14} />}
          onClick={() => doStatus('fulfilled')}
          disabled={isBusy || item.status === 'fulfilled'}
        >
          Atendida
        </Button>
        <Button
          variant="urgent"
          size="sm"
          iconLeft={<IconFlag size={14} />}
          onClick={() => doStatus('closed')}
          disabled={isBusy || item.status === 'closed'}
        >
          Cerrar
        </Button>
        <Button
          variant={item.hidden ? 'soft' : 'outline'}
          size="sm"
          onClick={() => doHide(!item.hidden)}
          disabled={isBusy}
        >
          {item.hidden ? 'Hacer visible' : 'Ocultar'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<IconClose size={14} />}
          onClick={() => doStatus('reported')}
          disabled={isBusy}
        >
          Marcar falsa
        </Button>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 space-y-2" aria-hidden>
      <Skeleton shape="line" className="h-4 w-24" />
      <Skeleton shape="line" className="h-5 w-2/3" />
      <Skeleton shape="line" className="h-3.5 w-1/2" />
      <Skeleton className="h-9 mt-1" />
    </div>
  )
}

export function AdminPanel() {
  const { toast } = useToast()
  const [filter, setFilter] = useState<AdminFilter>('all')
  const [zoneSearch, setZoneSearch] = useState('')

  const qFilters = {
    type: filter === 'needs' ? 'need' as const : filter === 'offers' ? 'offer' as const : undefined,
    reportedOnly: filter === 'reported',
    availableNow: filter === 'fulfilled' ? false : undefined,
    includeHidden: filter === 'hidden' || filter === 'all',
    zone: zoneSearch.trim() || undefined,
  }

  const { data: items, isLoading } = useItemsQuery(qFilters, 'recent')

  const displayed =
    filter === 'fulfilled'
      ? items?.filter((i) => i.status === 'fulfilled') ?? []
      : filter === 'hidden'
        ? items?.filter((i) => i.hidden) ?? []
        : items ?? []

  function logout() {
    clearAdminSession()
    toast('Sesión cerrada.', { tone: 'neutral' })
    setTimeout(() => window.location.reload(), 700)
  }

  return (
    <>
      <PageIntro
        eyebrow="Admin"
        title="Panel de moderación"
        description="Gestiona publicaciones, reportes y estado del feed."
        actions={
          <Button variant="ghost" size="sm" onClick={logout}>
            Cerrar sesión
          </Button>
        }
      />
      <Container size="wide" className="pb-12 flex flex-col gap-6">
        {/* Filtros */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <IconFilter size={14} className="text-ink-faint" />
            {FILTER_OPTS.map((f) => (
              <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </Chip>
            ))}
          </div>
          <Input
            label="Filtrar por zona"
            hideLabel
            placeholder="Filtrar por zona o ciudad…"
            value={zoneSearch}
            onChange={(e) => setZoneSearch(e.target.value)}
          />
        </div>

        {/* Resumen */}
        {!isLoading && (
          <p className="text-sm text-ink-soft">
            {displayed.length} publicaciones
            {displayed.some((i) => i.report_count > 0) && (
              <span className="ml-2 text-coral-strong font-semibold">
                · {displayed.filter((i) => i.report_count > 0).length} con reportes
              </span>
            )}
          </p>
        )}

        {/* Lista */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <EmptyState
            icon={<IconList size={26} />}
            title="Sin publicaciones con estos filtros"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {displayed.map((item) => (
              <AdminRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
