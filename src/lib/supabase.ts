import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** ¿Hay credenciales de Supabase configuradas? Si no, corremos en modo mock. */
export const isSupabaseConfigured = Boolean(url && anonKey)

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
