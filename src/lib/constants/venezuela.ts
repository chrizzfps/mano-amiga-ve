/**
 * Estados y ciudades/zonas de Venezuela para selección de ubicación aproximada.
 * No se pide dirección exacta: solo estado + ciudad + zona en texto libre.
 * Lista práctica (no exhaustiva) priorizando las áreas de la costa y la capital.
 */
export interface StateMeta {
  state: string
  /** Centro aproximado para el mapa (lat, lng). */
  center: [number, number]
  cities: string[]
}

export const VENEZUELA: StateMeta[] = [
  {
    state: 'La Guaira',
    center: [10.6, -66.93],
    cities: ['Catia La Mar', 'La Guaira', 'Maiquetía', 'Macuto', 'Caraballeda', 'Naiguatá'],
  },
  {
    state: 'Distrito Capital',
    center: [10.5, -66.91],
    cities: ['Caracas', 'Catia', 'El Valle', 'Antímano', 'La Pastora', 'San Bernardino', '23 de Enero'],
  },
  {
    state: 'Miranda',
    center: [10.3, -66.8],
    cities: ['Chacao', 'Baruta', 'El Hatillo', 'Petare', 'Los Teques', 'Guarenas', 'Guatire', 'Charallave'],
  },
  {
    state: 'Aragua',
    center: [10.24, -67.6],
    cities: ['Maracay', 'Turmero', 'La Victoria', 'El Limón', 'Cagua'],
  },
  {
    state: 'Carabobo',
    center: [10.17, -68.0],
    cities: ['Valencia', 'Puerto Cabello', 'Guacara', 'Naguanagua', 'Tocuyito'],
  },
  {
    state: 'Zulia',
    center: [10.65, -71.65],
    cities: ['Maracaibo', 'Cabimas', 'Ciudad Ojeda', 'San Francisco', 'Machiques'],
  },
  {
    state: 'Lara',
    center: [10.07, -69.32],
    cities: ['Barquisimeto', 'Cabudare', 'Carora', 'El Tocuyo'],
  },
  {
    state: 'Falcón',
    center: [11.4, -69.68],
    cities: ['Coro', 'Punto Fijo', 'Puerto Cumarebo', 'La Vela'],
  },
  {
    state: 'Anzoátegui',
    center: [10.0, -64.68],
    cities: ['Barcelona', 'Puerto La Cruz', 'Lechería', 'El Tigre', 'Anaco'],
  },
  {
    state: 'Sucre',
    center: [10.45, -64.18],
    cities: ['Cumaná', 'Carúpano', 'Güiria'],
  },
  {
    state: 'Bolívar',
    center: [8.13, -63.55],
    cities: ['Ciudad Bolívar', 'Ciudad Guayana', 'Upata', 'Tumeremo'],
  },
  {
    state: 'Mérida',
    center: [8.59, -71.15],
    cities: ['Mérida', 'El Vigía', 'Ejido', 'Tovar'],
  },
  {
    state: 'Táchira',
    center: [7.77, -72.22],
    cities: ['San Cristóbal', 'Táriba', 'La Fría', 'Rubio'],
  },
  {
    state: 'Trujillo',
    center: [9.37, -70.43],
    cities: ['Trujillo', 'Valera', 'Boconó'],
  },
  {
    state: 'Portuguesa',
    center: [9.04, -69.73],
    cities: ['Guanare', 'Acarigua', 'Araure'],
  },
  {
    state: 'Barinas',
    center: [8.62, -70.21],
    cities: ['Barinas', 'Socopó', 'Santa Bárbara'],
  },
  {
    state: 'Monagas',
    center: [9.75, -63.18],
    cities: ['Maturín', 'Punta de Mata', 'Caripito'],
  },
  {
    state: 'Guárico',
    center: [9.0, -67.36],
    cities: ['San Juan de los Morros', 'Calabozo', 'Valle de la Pascua', 'Zaraza'],
  },
  {
    state: 'Yaracuy',
    center: [10.34, -68.74],
    cities: ['San Felipe', 'Yaritagua', 'Chivacoa'],
  },
  {
    state: 'Cojedes',
    center: [9.39, -68.31],
    cities: ['San Carlos', 'Tinaquillo'],
  },
  {
    state: 'Apure',
    center: [7.89, -67.47],
    cities: ['San Fernando de Apure', 'Guasdualito', 'Achaguas'],
  },
  {
    state: 'Nueva Esparta',
    center: [11.0, -63.9],
    cities: ['Porlamar', 'La Asunción', 'Pampatar', 'Juan Griego'],
  },
  {
    state: 'Delta Amacuro',
    center: [9.06, -62.05],
    cities: ['Tucupita'],
  },
  {
    state: 'Amazonas',
    center: [5.66, -67.63],
    cities: ['Puerto Ayacucho'],
  },
]

export const STATE_NAMES = VENEZUELA.map((s) => s.state)

export const STATE_MAP: Record<string, StateMeta> = Object.fromEntries(
  VENEZUELA.map((s) => [s.state, s]),
)

export function citiesFor(state: string): string[] {
  return STATE_MAP[state]?.cities ?? []
}
