export const PRIORITY_STATES = [
  'La Guaira',
  'Distrito Capital',
  'Miranda',
  'Carabobo',
  'Aragua',
] as const

export type PriorityState = typeof PRIORITY_STATES[number]

export interface PlaceSeed {
  place_name: string
  city_name: string
}

export const PLACES_BY_STATE: Record<PriorityState, PlaceSeed[]> = {
  'La Guaira': [
    { place_name: 'La Guaira', city_name: 'La Guaira' },
    { place_name: 'Maiquetía', city_name: 'Maiquetía' },
    { place_name: 'Catia La Mar', city_name: 'Catia La Mar' },
    { place_name: 'Macuto', city_name: 'Macuto' },
    { place_name: 'Caraballeda', city_name: 'Caraballeda' },
    { place_name: 'Naiguatá', city_name: 'Naiguatá' },
    { place_name: 'Carayaca', city_name: 'Carayaca' },
    { place_name: 'Pariata', city_name: 'Pariata' },
    { place_name: 'Caribe', city_name: 'Caribe' },
    { place_name: 'Tanaguarena', city_name: 'Tanaguarena' },
    { place_name: 'Camurí Chico', city_name: 'Camurí Chico' },
    { place_name: 'Punta de Mulatos', city_name: 'Punta de Mulatos' },
    { place_name: 'El Rincón', city_name: 'El Rincón' },
    { place_name: 'La Soublette', city_name: 'La Soublette' },
  ],
  'Distrito Capital': [
    { place_name: 'Caracas', city_name: 'Caracas' },
    { place_name: 'Catia', city_name: 'Caracas' },
    { place_name: '23 de Enero', city_name: 'Caracas' },
    { place_name: 'La Pastora', city_name: 'Caracas' },
    { place_name: 'San Bernardino', city_name: 'Caracas' },
    { place_name: 'La Candelaria', city_name: 'Caracas' },
    { place_name: 'San Agustín', city_name: 'Caracas' },
    { place_name: 'El Recreo', city_name: 'Caracas' },
    { place_name: 'Sabana Grande', city_name: 'Caracas' },
    { place_name: 'Plaza Venezuela', city_name: 'Caracas' },
    { place_name: 'El Paraíso', city_name: 'Caracas' },
    { place_name: 'La Vega', city_name: 'Caracas' },
    { place_name: 'Antímano', city_name: 'Caracas' },
    { place_name: 'Caricuao', city_name: 'Caracas' },
    { place_name: 'El Valle', city_name: 'Caracas' },
    { place_name: 'Coche', city_name: 'Caracas' },
    { place_name: 'San Martín', city_name: 'Caracas' },
    { place_name: 'Quinta Crespo', city_name: 'Caracas' },
    { place_name: 'Propatria', city_name: 'Caracas' },
    { place_name: 'Lídice', city_name: 'Caracas' },
  ],
  'Miranda': [
    { place_name: 'Chacao', city_name: 'Chacao' },
    { place_name: 'Baruta', city_name: 'Baruta' },
    { place_name: 'El Hatillo', city_name: 'El Hatillo' },
    { place_name: 'Petare', city_name: 'Petare' },
    { place_name: 'Los Teques', city_name: 'Los Teques' },
    { place_name: 'Guarenas', city_name: 'Guarenas' },
    { place_name: 'Guatire', city_name: 'Guatire' },
    { place_name: 'Charallave', city_name: 'Charallave' },
    { place_name: 'Cúa', city_name: 'Cúa' },
    { place_name: 'Santa Teresa del Tuy', city_name: 'Santa Teresa del Tuy' },
    { place_name: 'Ocumare del Tuy', city_name: 'Ocumare del Tuy' },
    { place_name: 'Caucagua', city_name: 'Caucagua' },
    { place_name: 'Higuerote', city_name: 'Higuerote' },
    { place_name: 'Río Chico', city_name: 'Río Chico' },
    { place_name: 'Carrizal', city_name: 'Carrizal' },
    { place_name: 'San Antonio de los Altos', city_name: 'San Antonio de los Altos' },
    { place_name: 'La California', city_name: 'Caracas' },
    { place_name: 'Los Ruices', city_name: 'Caracas' },
    { place_name: 'La Urbina', city_name: 'Caracas' },
    { place_name: 'El Cafetal', city_name: 'Caracas' },
    { place_name: 'Las Mercedes', city_name: 'Caracas' },
    { place_name: 'Colinas de Bello Monte', city_name: 'Caracas' },
    { place_name: 'Santa Fe', city_name: 'Caracas' },
    { place_name: 'Prados del Este', city_name: 'Caracas' },
    { place_name: 'La Trinidad', city_name: 'Caracas' },
  ],
  'Carabobo': [
    { place_name: 'Valencia', city_name: 'Valencia' },
    { place_name: 'Naguanagua', city_name: 'Naguanagua' },
    { place_name: 'San Diego', city_name: 'San Diego' },
    { place_name: 'Guacara', city_name: 'Guacara' },
    { place_name: 'Los Guayos', city_name: 'Los Guayos' },
    { place_name: 'Puerto Cabello', city_name: 'Puerto Cabello' },
    { place_name: 'Tocuyito', city_name: 'Tocuyito' },
    { place_name: 'Bejuma', city_name: 'Bejuma' },
    { place_name: 'Mariara', city_name: 'Mariara' },
    { place_name: 'Morón', city_name: 'Morón' },
    { place_name: 'La Isabelica', city_name: 'Valencia' },
    { place_name: 'Flor Amarillo', city_name: 'Valencia' },
    { place_name: 'Prebo', city_name: 'Valencia' },
    { place_name: 'El Viñedo', city_name: 'Valencia' },
    { place_name: 'San Blas', city_name: 'Valencia' },
    { place_name: 'Candelaria', city_name: 'Valencia' },
    { place_name: 'Miguel Peña', city_name: 'Valencia' },
    { place_name: 'El Trigal', city_name: 'Valencia' },
    { place_name: 'Mañongo', city_name: 'Naguanagua' },
  ],
  'Aragua': [
    { place_name: 'Maracay', city_name: 'Maracay' },
    { place_name: 'Turmero', city_name: 'Turmero' },
    { place_name: 'La Victoria', city_name: 'La Victoria' },
    { place_name: 'Cagua', city_name: 'Cagua' },
    { place_name: 'Villa de Cura', city_name: 'Villa de Cura' },
    { place_name: 'El Limón', city_name: 'El Limón' },
    { place_name: 'Palo Negro', city_name: 'Palo Negro' },
    { place_name: 'Santa Rita', city_name: 'Santa Rita' },
    { place_name: 'San Mateo', city_name: 'San Mateo' },
    { place_name: 'Las Tejerías', city_name: 'Las Tejerías' },
    { place_name: 'La Encrucijada', city_name: 'Turmero' },
    { place_name: 'Caña de Azúcar', city_name: 'El Limón' },
    { place_name: 'Base Aragua', city_name: 'Maracay' },
    { place_name: 'San Jacinto', city_name: 'Maracay' },
    { place_name: 'Los Samanes', city_name: 'Maracay' },
    { place_name: 'La Morita', city_name: 'Turmero' },
    { place_name: 'Santa Cruz', city_name: 'Santa Cruz' },
    { place_name: 'Choroní', city_name: 'Choroní' },
    { place_name: 'Ocumare de la Costa', city_name: 'Ocumare de la Costa' },
  ],
}

/** Obtener la lista de estados prioritarios */
export function getStates(): string[] {
  return [...PRIORITY_STATES]
}

/** Obtener los sectores y ciudades sugeridas para un estado */
export function getPlacesByState(stateName: string): PlaceSeed[] {
  if (!stateName) return []
  return PLACES_BY_STATE[stateName as PriorityState] || []
}

/** Filtrar sugerencias de lugares por búsqueda y opcionalmente por estado */
export function searchPlaces(query: string, stateName?: string): PlaceSeed[] {
  const cleanQuery = query.toLowerCase().trim()
  if (!cleanQuery) return []

  const list = stateName 
    ? getPlacesByState(stateName) 
    : PRIORITY_STATES.flatMap(s => PLACES_BY_STATE[s])

  return list.filter(p => 
    p.place_name.toLowerCase().includes(cleanQuery) || 
    p.city_name.toLowerCase().includes(cleanQuery)
  )
}

/** Construye la etiqueta de ubicación para visualización pública */
export function buildApproximateLocationLabel(data: {
  state_name: string
  city_name?: string | null
}): string {
  const state = data.state_name ? data.state_name.trim() : ''
  const city = data.city_name ? data.city_name.trim() : ''

  if (city && city.toLowerCase() !== state.toLowerCase()) {
    return `${city}, ${state}`
  }
  return state
}

export const STATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'La Guaira': { lat: 10.601, lng: -66.932 },
  'Distrito Capital': { lat: 10.485, lng: -66.901 },
  'Miranda': { lat: 10.482, lng: -66.820 },
  'Carabobo': { lat: 10.170, lng: -67.980 },
  'Aragua': { lat: 10.244, lng: -67.590 },
}

export function getApproximateStateCoords(stateName: string): { lat: number; lng: number } | null {
  return STATE_COORDINATES[stateName] || null
}
