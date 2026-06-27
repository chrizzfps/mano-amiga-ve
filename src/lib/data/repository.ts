import type {
  CategoryId,
  Item,
  ItemStatus,
  ItemType,
  NewItemInput,
} from '@/types/item'
import type { ItemReport, ReportReason, VerificationType } from '@/types/report'

export interface ItemFilters {
  type?: ItemType | 'all'
  category?: CategoryId | 'all'
  /** Solo urgencia alta. */
  urgentOnly?: boolean
  /** Solo ofertas disponibles ahora (o necesidades abiertas). */
  availableNow?: boolean
  /** Búsqueda por zona/ciudad/estado. */
  zone?: string
  /** Admin: incluir publicaciones ocultas. */
  includeHidden?: boolean
  /** Admin: solo publicaciones con reportes. */
  reportedOnly?: boolean
  /** Solo publicaciones ya atendidas (historial). */
  fulfilledOnly?: boolean
}

export type SortBy = 'urgency' | 'recent'

export interface Counts {
  activeNeeds: number
  availableOffers: number
  fulfilled: number
}

/**
 * Contrato de acceso a datos. El adaptador `mock` lo implementa hoy;
 * el adaptador `supabase` lo implementará sin que la UI cambie.
 */
export interface ItemsRepository {
  listItems(filters?: ItemFilters, sort?: SortBy): Promise<Item[]>
  getItem(id: string): Promise<Item | null>
  createItem(input: NewItemInput): Promise<Item>
  updateStatus(id: string, status: ItemStatus): Promise<Item>
  setHidden(id: string, hidden: boolean): Promise<Item>
  reportItem(input: {
    item_id: string
    reason: ReportReason
    description: string
  }): Promise<ItemReport>
  verifyItem(id: string, type?: VerificationType): Promise<Item>
  getCounts(): Promise<Counts>
}
