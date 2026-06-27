export type ReportReason =
  | 'fake' // parece falsa
  | 'resolved' // ya fue atendida
  | 'duplicate' // está repetida
  | 'wrong_info' // información incorrecta
  | 'inappropriate' // contenido inapropiado
  | 'other'

export interface ItemReport {
  id: string
  item_id: string
  reason: ReportReason
  description: string
  created_at: string
}

export type VerificationType = 'neighbor' | 'volunteer' | 'organization'

export interface ItemVerification {
  id: string
  item_id: string
  verification_type: VerificationType
  created_at: string
}
