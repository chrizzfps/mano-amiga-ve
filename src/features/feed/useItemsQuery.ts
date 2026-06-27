import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { repository } from '@/lib/data'
import type { ItemFilters, SortBy } from '@/lib/data'
import type { ItemStatus } from '@/types/item'
import type { ReportReason } from '@/types/report'

export const ITEMS_KEY = 'items'
export const COUNTS_KEY = 'counts'

export function useItemsQuery(filters: ItemFilters = {}, sort: SortBy = 'urgency') {
  return useQuery({
    queryKey: [ITEMS_KEY, filters, sort],
    queryFn: () => repository.listItems(filters, sort),
  })
}

export function useItemQuery(id: string) {
  return useQuery({
    queryKey: [ITEMS_KEY, id],
    queryFn: () => repository.getItem(id),
    enabled: Boolean(id),
  })
}

export function useCountsQuery() {
  return useQuery({
    queryKey: [COUNTS_KEY],
    queryFn: () => repository.getCounts(),
    refetchInterval: 60_000,
  })
}

export function useUpdateStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ItemStatus }) =>
      repository.updateStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [ITEMS_KEY] })
      void qc.invalidateQueries({ queryKey: [COUNTS_KEY] })
    },
  })
}

export function useVerifyItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repository.verifyItem(id),
    onSuccess: (item) => {
      void qc.invalidateQueries({ queryKey: [ITEMS_KEY, item.id] })
    },
  })
}

export function useReportItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      item_id,
      reason,
      description,
    }: {
      item_id: string
      reason: ReportReason
      description: string
    }) => repository.reportItem({ item_id, reason, description }),
    onSuccess: (_report, { item_id }) => {
      void qc.invalidateQueries({ queryKey: [ITEMS_KEY, item_id] })
    },
  })
}

export function useSetHidden() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      repository.setHidden(id, hidden),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [ITEMS_KEY] })
    },
  })
}
