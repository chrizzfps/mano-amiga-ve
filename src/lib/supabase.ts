import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const url = rawUrl?.trim()
const anonKey = rawKey?.trim()

/** ¿Hay credenciales de Supabase configuradas? Si no, corremos en modo mock. */
export const isSupabaseConfigured = Boolean(url && anonKey && url !== 'undefined' && anonKey !== 'undefined')

if (isSupabaseConfigured && url && anonKey) {
  console.log(
    '[ManoAmiga] Conectando a Supabase:',
    url,
    `| Key snippet: ${anonKey.slice(0, 8)}...${anonKey.slice(-8)}`
  )
} else {
  console.warn('[ManoAmiga] Supabase no configurado o variables corruptas. Usando datos Mock locales.')
}

let client: SupabaseClient | null = null

/** Cliente Supabase perezoso. Solo se crea si hay credenciales. */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
    )
  }
  if (!client) {
    client = createClient(url as string, anonKey as string)
  }
  return client
}
