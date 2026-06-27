import type { Item } from '@/types/item'
import { categoryLabel } from '@/lib/constants/categories'
import { URGENCY } from '@/lib/constants/taxonomy'
import { formatTime } from './time'

const CLOSING = 'No todos pueden hacerlo todo. Pero todos pueden dar una mano.'

/** Construye el mensaje compartible con el formato de marca. */
export function buildShareMessage(item: Item, url: string): string {
  const lead = item.type === 'need' ? 'Se necesita' : 'Se ofrece'
  const lines = [
    'MANOAMIGA VE',
    '',
    `${lead}: ${item.title}`,
    `Categoría: ${categoryLabel(item.category)}`,
    `Zona: ${item.zone_text}, ${item.city}`,
    `Urgencia: ${URGENCY[item.urgency].label}`,
  ]
  if (item.available_until) {
    lines.push(`Vigente ${formatTime(item.available_until)}`)
  }
  lines.push('', 'Ver publicación:', url, '', CLOSING)
  return lines.join('\n')
}

/** Solo dígitos; normaliza números venezolanos a formato internacional (58...). */
export function normalizeVePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('58')) return digits
  if (digits.startsWith('0')) return `58${digits.slice(1)}`
  return digits
}

/** Deep link de WhatsApp. Si hay teléfono, abre el chat directo. */
export function waLink(text: string, phone?: string): string {
  const encoded = encodeURIComponent(text)
  if (phone) {
    return `https://wa.me/${normalizeVePhone(phone)}?text=${encoded}`
  }
  return `https://wa.me/?text=${encoded}`
}

/** Link para compartir una publicación por WhatsApp. */
export function shareItemLink(item: Item, url: string): string {
  return waLink(buildShareMessage(item, url))
}
