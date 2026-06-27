import type { ItemStatus } from '@/types/item'
import { STATUS } from '@/lib/constants/taxonomy'
import { Badge } from './Badge'

export function StatusBadge({ status }: { status: ItemStatus }) {
  const meta = STATUS[status]
  if (!meta) return null
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  )
}
