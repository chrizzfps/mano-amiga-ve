/** Tipos de dominio de ManoAmiga VE. Espejo del futuro esquema `items` en Supabase. */

export type ItemType = 'need' | 'offer'

export type Urgency = 'low' | 'medium' | 'high'

export type ContactMethod = 'whatsapp' | 'telegram' | 'phone' | 'app'

export type CategoryId =
  | 'energia'
  | 'agua'
  | 'medicina'
  | 'higiene'
  | 'refugio'
  | 'transporte'
  | 'mascotas'
  | 'cuidados'
  | 'comunicacion'
  | 'otro'

/** Estados de una necesidad. */
export type NeedStatus = 'open' | 'in_progress' | 'fulfilled' | 'closed' | 'reported'
/** Estados de una oferta. */
export type OfferStatus = 'available' | 'unavailable' | 'fulfilled' | 'closed' | 'reported'
export type ItemStatus = NeedStatus | OfferStatus

export interface Item {
  id: string
  type: ItemType
  category: CategoryId
  title: string
  description: string
  /** Zona aproximada en texto, ej. "Catia La Mar". Nunca dirección exacta. */
  zone_text: string
  state: string
  city: string
  /** Coordenadas aproximadas (con jitter). Pueden ser null. */
  lat: number | null
  lng: number | null
  urgency: Urgency
  status: ItemStatus
  contact_method: ContactMethod
  /** Solo visible en la página de detalle, nunca en cards públicas. */
  contact_value: string
  capacity: number | null
  available_until: string | null
  expires_at: string | null
  verified_count: number
  report_count: number
  /** Moderación: oculta de las vistas públicas (no en el esquema mínimo, uso interno admin). */
  hidden?: boolean
  created_at: string
  updated_at: string
}

/** Campos que aporta el usuario al publicar (el resto los gestiona el servidor). */
export type NewItemInput = Pick<
  Item,
  | 'type'
  | 'category'
  | 'title'
  | 'description'
  | 'zone_text'
  | 'state'
  | 'city'
  | 'urgency'
  | 'contact_method'
  | 'contact_value'
> &
  Partial<Pick<Item, 'lat' | 'lng' | 'capacity' | 'available_until' | 'expires_at' | 'status'>>
