import type {
  ContactMethod,
  ItemStatus,
  ItemType,
  Urgency,
} from '@/types/item'
import type { ReportReason } from '@/types/report'

/** "tone" mapea a las familias de color del design system. */
export type Tone = 'azul' | 'amarillo' | 'coral' | 'verde' | 'neutral'

export const URGENCY: Record<Urgency, { label: string; tone: Tone; weight: number }> = {
  high: { label: 'Urgente', tone: 'coral', weight: 3 },
  medium: { label: 'Pronto', tone: 'amarillo', weight: 2 },
  low: { label: 'Sin apuro', tone: 'neutral', weight: 1 },
}

export const URGENCY_OPTIONS: { value: Urgency; label: string; help: string }[] = [
  { value: 'high', label: 'Urgente', help: 'Se necesita en las próximas horas.' },
  { value: 'medium', label: 'Pronto', help: 'Hoy o mañana estaría bien.' },
  { value: 'low', label: 'Sin apuro', help: 'Puede esperar unos días.' },
]

export const STATUS: Record<ItemStatus, { label: string; tone: Tone }> = {
  // Necesidades
  open: { label: 'Abierta', tone: 'azul' },
  in_progress: { label: 'En proceso', tone: 'amarillo' },
  fulfilled: { label: 'Atendida', tone: 'verde' },
  closed: { label: 'Cerrada', tone: 'neutral' },
  reported: { label: 'Reportada', tone: 'coral' },
  // Ofertas
  available: { label: 'Disponible', tone: 'verde' },
  unavailable: { label: 'No disponible', tone: 'neutral' },
}

export const TYPE_LABEL: Record<ItemType, string> = {
  need: 'Necesidad',
  offer: 'Oferta',
}

export const CONTACT_METHODS: { value: ContactMethod; label: string; placeholder: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp', placeholder: 'Ej. 0412 1234567' },
  { value: 'telegram', label: 'Telegram', placeholder: 'Ej. @usuario' },
  { value: 'phone', label: 'Teléfono', placeholder: 'Ej. 0212 1234567' },
  { value: 'app', label: 'Por la app', placeholder: 'Te avisaremos aquí' },
]

export const CONTACT_LABEL: Record<ContactMethod, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  phone: 'Teléfono',
  app: 'Por la app',
}

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'fake', label: 'Parece falsa' },
  { value: 'resolved', label: 'Ya fue atendida' },
  { value: 'duplicate', label: 'Está repetida' },
  { value: 'wrong_info', label: 'Información incorrecta' },
  { value: 'inappropriate', label: 'Contenido inapropiado' },
  { value: 'other', label: 'Otro motivo' },
]

/** Estados que cuentan como "activos" en los contadores públicos. */
export const ACTIVE_NEED_STATUSES: ItemStatus[] = ['open', 'in_progress']
export const ACTIVE_OFFER_STATUSES: ItemStatus[] = ['available']
export const FULFILLED_STATUSES: ItemStatus[] = ['fulfilled']
