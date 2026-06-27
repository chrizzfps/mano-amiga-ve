/** Utilidades de tiempo en español de Venezuela. */

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** "hace 12 min", "hace 3 h", "hace 2 d". */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now - then)
  if (diff < MINUTE) return 'hace un momento'
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE)
    return `hace ${m} min`
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR)
    return `hace ${h} h`
  }
  const d = Math.floor(diff / DAY)
  return d === 1 ? 'hace 1 día' : `hace ${d} días`
}

/** "8:30 p.m." en formato venezolano. */
export function formatTime(iso: string): string {
  const d = new Date(iso)
  return d
    .toLocaleTimeString('es-VE', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace('a. m.', 'a.m.')
    .replace('p. m.', 'p.m.')
    .toLowerCase()
}

/** "hasta las 5:00 p.m." o, si es otro día, "hasta el 27/06 a las 5:00 p.m.". */
export function formatUntil(iso: string, now: number = Date.now()): string {
  const d = new Date(iso)
  const sameDay = new Date(now).toDateString() === d.toDateString()
  if (sameDay) return `hasta las ${formatTime(iso)}`
  const date = d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' })
  return `hasta el ${date} a las ${formatTime(iso)}`
}

/** ¿La vigencia ya pasó? */
export function isExpired(iso: string | null, now: number = Date.now()): boolean {
  if (!iso) return false
  return new Date(iso).getTime() < now
}

/** Convierte un input datetime-local a ISO. */
export function localInputToISO(value: string): string {
  return new Date(value).toISOString()
}
