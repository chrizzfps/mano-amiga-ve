import type { CategoryId } from '@/types/item'

export interface CategoryMeta {
  id: CategoryId
  /** Clave del icono SVG propio (ver components/icons/CategoryIcon). */
  icon: CategoryId
  label: string
  /** Frase corta para chips y filtros. */
  short: string
  /** Qué se puede pedir en esta categoría. */
  needHint: string
  /** Qué se puede ofrecer en esta categoría. */
  offerHint: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'energia',
    icon: 'energia',
    label: 'Energía',
    short: 'Cargar y electricidad',
    needHint: 'Cargar el teléfono, una linterna, energía para un equipo médico.',
    offerHint: 'Enchufes libres, una planta eléctrica, batería para cargar.',
  },
  {
    id: 'agua',
    icon: 'agua',
    label: 'Agua',
    short: 'Agua potable',
    needHint: 'Agua para beber, cocinar o asearse.',
    offerHint: 'Agua filtrada, pipa, llenado de envases.',
  },
  {
    id: 'medicina',
    icon: 'medicina',
    label: 'Medicina',
    short: 'Salud y medicinas',
    needHint: 'Refrigerar insulina, un medicamento, primeros auxilios.',
    offerHint: 'Nevera para medicinas, botiquín, un remedio puntual.',
  },
  {
    id: 'higiene',
    icon: 'higiene',
    label: 'Higiene',
    short: 'Baño y aseo',
    needHint: 'Un baño, una ducha, productos de aseo.',
    offerHint: 'Baño o ducha disponible, jabón, toallas.',
  },
  {
    id: 'refugio',
    icon: 'refugio',
    label: 'Refugio',
    short: 'Lugar seguro',
    needHint: 'Un lugar seguro por unas horas o para pasar la noche.',
    offerHint: 'Espacio techado, una habitación, sombra y descanso.',
  },
  {
    id: 'transporte',
    icon: 'transporte',
    label: 'Transporte',
    short: 'Traslados cortos',
    needHint: 'Un traslado corto, llevar a alguien a un punto seguro.',
    offerHint: 'Viajes cortos en moto o carro, mover cosas livianas.',
  },
  {
    id: 'mascotas',
    icon: 'mascotas',
    label: 'Mascotas',
    short: 'Ayuda con mascotas',
    needHint: 'Resguardar o cuidar una mascota por un rato.',
    offerHint: 'Recibir una mascota pequeña, comida o agua para animales.',
  },
  {
    id: 'cuidados',
    icon: 'cuidados',
    label: 'Niños y adultos mayores',
    short: 'Personas vulnerables',
    needHint: 'Acompañar a un niño, niña o adulto mayor.',
    offerHint: 'Compañía, cuidado breve, un lugar tranquilo para descansar.',
  },
  {
    id: 'comunicacion',
    icon: 'comunicacion',
    label: 'Comunicación',
    short: 'Conexión y señal',
    needHint: 'Hacer una llamada, conectarse, avisar que están bien.',
    offerHint: 'Wifi, señal, prestar el teléfono para un mensaje.',
  },
  {
    id: 'otro',
    icon: 'otro',
    label: 'Otro',
    short: 'Otra cosa',
    needHint: 'Algo puntual que no encaja en las categorías anteriores.',
    offerHint: 'Una ayuda que no encaja en las categorías anteriores.',
  },
]

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>

export function categoryLabel(id: CategoryId): string {
  return CATEGORY_MAP[id]?.label ?? 'Otro'
}
