import type { Urgency } from '@/types/item'
import { URGENCY } from '@/lib/constants/taxonomy'
import { Badge } from './Badge'

/** Solo destaca visualmente la urgencia alta; las demás van discretas. */
export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const meta = URGENCY[urgency]
  return (
    <Badge tone={meta.tone} dot={urgency !== 'low'} className={urgency === 'high' ? 'uppercase tracking-wide' : undefined}>
      {meta.label}
    </Badge>
  )
}
