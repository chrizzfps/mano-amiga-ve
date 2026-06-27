import { isSupabaseConfigured } from '@/lib/supabase'
import { mockAdapter } from './mockAdapter'
import { supabaseAdapter } from './supabaseAdapter'
import type { ItemsRepository } from './repository'

/**
 * Selección del adaptador activo. Hoy: mock (decisión "mock local primero").
 * Cuando se configuren credenciales y el adaptador Supabase esté implementado,
 * la app cambiará sola sin tocar la UI.
 */
export const repository: ItemsRepository = isSupabaseConfigured
  ? supabaseAdapter
  : mockAdapter

export type { ItemsRepository, ItemFilters, SortBy, Counts } from './repository'
