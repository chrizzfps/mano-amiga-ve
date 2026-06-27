import type { Item, ItemStatus } from '@/types/item'
import type { ItemReport } from '@/types/report'
import { ACTIVE_NEED_STATUSES, URGENCY } from '@/lib/constants/taxonomy'
import { jitterCoords } from '@/lib/utils/location'
import { seedItems } from '@/data/seed/items.seed'
import type {
  Counts,
  ItemFilters,
  ItemsRepository,
  SortBy,
} from './repository'

const ITEMS_KEY = 'manoamiga.items.v1'
const REPORTS_KEY = 'manoamiga.reports.v1'

const hasStorage = typeof window !== 'undefined' && 'localStorage' in window

function delay<T>(value: T, ms = 280): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function loadItems(): Item[] {
  if (!hasStorage) return seedItems()
  const raw = window.localStorage.getItem(ITEMS_KEY)
  if (!raw) {
    const seeded = seedItems()
    window.localStorage.setItem(ITEMS_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    return JSON.parse(raw) as Item[]
  } catch {
    return seedItems()
  }
}

function saveItems(items: Item[]): void {
  if (hasStorage) window.localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
}

function loadReports(): ItemReport[] {
  if (!hasStorage) return []
  const raw = window.localStorage.getItem(REPORTS_KEY)
  return raw ? (JSON.parse(raw) as ItemReport[]) : []
}

function saveReports(reports: ItemReport[]): void {
  if (hasStorage) window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
}

const isActive = (it: Item) =>
  it.type === 'need'
    ? ACTIVE_NEED_STATUSES.includes(it.status)
    : it.status === 'available'

function matches(it: Item, f: ItemFilters): boolean {
  if (!f.includeHidden && it.hidden) return false
  if (f.type && f.type !== 'all' && it.type !== f.type) return false
  if (f.category && f.category !== 'all' && it.category !== f.category) return false
  if (f.urgentOnly && it.urgency !== 'high') return false
  if (f.availableNow && !isActive(it)) return false
  if (f.reportedOnly && it.report_count <= 0) return false
  if (f.fulfilledOnly && it.status !== 'fulfilled') return false
  if (f.zone) {
    const q = f.zone.trim().toLowerCase()
    const hay = `${it.zone_text} ${it.city_name ?? ''} ${it.state_name} ${it.approximate_location_label}`.toLowerCase()
    if (!hay.includes(q)) return false
  }
  return true
}

function sortItems(items: Item[], sort: SortBy): Item[] {
  const byRecent = (a: Item, b: Item) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  if (sort === 'recent') return [...items].sort(byRecent)
  // urgencia primero, luego recencia
  return [...items].sort((a, b) => {
    const w = URGENCY[b.urgency].weight - URGENCY[a.urgency].weight
    return w !== 0 ? w : byRecent(a, b)
  })
}

export const mockAdapter: ItemsRepository = {
  async listItems(filters = {}, sort = 'urgency') {
    const items = loadItems().filter((it) => matches(it, filters))
    return delay(sortItems(items, sort))
  },

  async getItem(id) {
    const found = loadItems().find((it) => it.id === id) ?? null
    return delay(found)
  },

  async createItem(input) {
    const items = loadItems()
    const nowISO = new Date().toISOString()
    const coords =
      input.lat != null && input.lng != null
        ? jitterCoords(input.lat, input.lng)
        : { lat: null, lng: null }

    const item: Item = {
      id: uid(input.type === 'need' ? 'n' : 'o'),
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
      verified_count: 0,
      report_count: 0,
      hidden: false,
      created_at: nowISO,
      updated_at: nowISO,
    }
    saveItems([item, ...items])
    return delay(item, 380)
  },

  async updateStatus(id, status: ItemStatus) {
    const items = loadItems()
    const idx = items.findIndex((it) => it.id === id)
    if (idx < 0) throw new Error('Publicación no encontrada')
    items[idx] = { ...items[idx], status, updated_at: new Date().toISOString() }
    saveItems(items)
    return delay(items[idx])
  },

  async setHidden(id, hidden) {
    const items = loadItems()
    const idx = items.findIndex((it) => it.id === id)
    if (idx < 0) throw new Error('Publicación no encontrada')
    items[idx] = { ...items[idx], hidden, updated_at: new Date().toISOString() }
    saveItems(items)
    return delay(items[idx])
  },

  async reportItem({ item_id, reason, description }) {
    const reports = loadReports()
    const report: ItemReport = {
      id: uid('r'),
      item_id,
      reason,
      description,
      created_at: new Date().toISOString(),
    }
    saveReports([report, ...reports])

    const items = loadItems()
    const idx = items.findIndex((it) => it.id === item_id)
    if (idx >= 0) {
      items[idx] = { ...items[idx], report_count: items[idx].report_count + 1 }
      saveItems(items)
    }
    return delay(report)
  },

  async verifyItem(id) {
    const items = loadItems()
    const idx = items.findIndex((it) => it.id === id)
    if (idx < 0) throw new Error('Publicación no encontrada')
    items[idx] = {
      ...items[idx],
      verified_count: items[idx].verified_count + 1,
      updated_at: new Date().toISOString(),
    }
    saveItems(items)
    return delay(items[idx])
  },

  async getCounts(): Promise<Counts> {
    const items = loadItems().filter((it) => !it.hidden)
    const counts: Counts = {
      activeNeeds: items.filter(
        (it) => it.type === 'need' && ACTIVE_NEED_STATUSES.includes(it.status),
      ).length,
      availableOffers: items.filter(
        (it) => it.type === 'offer' && it.status === 'available',
      ).length,
      fulfilled: items.filter((it) => it.status === 'fulfilled').length,
    }
    return delay(counts, 120)
  },
}
