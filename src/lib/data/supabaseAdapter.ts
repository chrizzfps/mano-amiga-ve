import { getSupabase } from '@/lib/supabase'
import { jitterCoords } from '@/lib/utils/location'
import { ACTIVE_NEED_STATUSES, URGENCY } from '@/lib/constants/taxonomy'
import type { Item, ItemStatus, NewItemInput } from '@/types/item'
import type { ItemReport } from '@/types/report'
import type { Counts, ItemFilters, ItemsRepository, SortBy } from './repository'

function sortItems(items: Item[], sort: SortBy): Item[] {
  const byRecent = (a: Item, b: Item) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  if (sort === 'recent') return [...items].sort(byRecent)
  return [...items].sort((a, b) => {
    const w = URGENCY[b.urgency].weight - URGENCY[a.urgency].weight
    return w !== 0 ? w : byRecent(a, b)
  })
}

export const supabaseAdapter: ItemsRepository = {
  async listItems(filters: ItemFilters = {}, sort: SortBy = 'urgency') {
    const sb = getSupabase()
    let q = sb.from('items').select('*')

    if (!filters.includeHidden) q = q.eq('hidden', false)
    if (filters.type && filters.type !== 'all') q = q.eq('type', filters.type)
    if (filters.category && filters.category !== 'all') q = q.eq('category', filters.category)
    if (filters.urgentOnly) q = q.eq('urgency', 'high')
    if (filters.availableNow) {
      // Excluye statuses inactivos — equivalente a solo mostrar open/in_progress para needs y available para offers
      q = q.not('status', 'in', '(fulfilled,closed,reported,unavailable)')
    }
    if (filters.reportedOnly) q = q.gt('report_count', 0)
    if (filters.fulfilledOnly) q = q.eq('status', 'fulfilled')
    if (filters.zone) {
      const z = filters.zone.trim()
      q = q.or(`zone_text.ilike.%${z}%,city_name.ilike.%${z}%,state_name.ilike.%${z}%,approximate_location_label.ilike.%${z}%`)
    }

    const { data, error } = await q
    if (error) throw error

    return sortItems((data as Item[]) ?? [], sort)
  },

  async getItem(id: string) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('items')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as Item
  },

  async createItem(input: NewItemInput) {
    const sb = getSupabase()
    const coords =
      input.lat != null && input.lng != null
        ? jitterCoords(input.lat, input.lng)
        : { lat: null, lng: null }

    const payload = {
      type: input.type,
      category: input.category,
      title: input.title,
      description: input.description,
      state_name: input.state_name,
      municipality_name: input.municipality_name ?? null,
      city_name: input.city_name ?? null,
      parish_name: input.parish_name ?? null,
      zone_text: input.zone_text,
      reference_text: input.reference_text ?? null,
      approximate_location_label: input.approximate_location_label,
      lat: coords.lat,
      lng: coords.lng,
      urgency: input.urgency,
      status: input.status ?? (input.type === 'need' ? 'open' : 'available'),
      contact_method: input.contact_method,
      contact_value: input.contact_value,
      capacity: input.capacity ?? null,
      available_until: input.available_until ?? null,
      expires_at: input.expires_at ?? null,
    }

    const { data, error } = await sb.from('items').insert(payload).select().single()
    if (error) throw error
    return data as Item
  },

  async updateStatus(id: string, status: ItemStatus) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('items')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Item
  },

  async setHidden(id: string, hidden: boolean) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('items')
      .update({ hidden })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Item
  },

  async reportItem({ item_id, reason, description }) {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('item_reports')
      .insert({ item_id, reason, description })
      .select()
      .single()
    if (error) throw error
    // El trigger inc_report_count incrementa report_count automáticamente
    return data as ItemReport
  },

  async verifyItem(id: string) {
    const sb = getSupabase()
    const { error: vErr } = await sb
      .from('item_verifications')
      .insert({ item_id: id, verification_type: 'neighbor' })
    if (vErr) throw vErr

    // El trigger incrementa verified_count automáticamente; fetch el item actualizado
    const { data, error } = await sb
      .from('items')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Item
  },

  async getCounts(): Promise<Counts> {
    const sb = getSupabase()
    const { data, error } = await sb.from('items').select('type,status').eq('hidden', false)
    if (error) throw error

    const items = (data as Pick<Item, 'type' | 'status'>[]) ?? []
    return {
      activeNeeds: items.filter(
        (it) => it.type === 'need' && ACTIVE_NEED_STATUSES.includes(it.status),
      ).length,
      availableOffers: items.filter(
        (it) => it.type === 'offer' && it.status === 'available',
      ).length,
      fulfilled: items.filter((it) => it.status === 'fulfilled').length,
    }
  },
}
