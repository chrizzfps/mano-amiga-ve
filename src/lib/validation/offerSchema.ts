import { z } from 'zod'

export const offerSchema = z.object({
  category: z.enum([
    'energia', 'agua', 'medicina', 'higiene', 'refugio',
    'transporte', 'mascotas', 'cuidados', 'comunicacion', 'otro',
  ], { error: 'Selecciona una categoría.' }),

  title: z.string()
    .min(5, 'Describe tu oferta en al menos 5 caracteres.')
    .max(120, 'Máximo 120 caracteres.'),

  capacity: z.number()
    .int('Debe ser un número entero.')
    .min(1, 'Mínimo 1.')
    .max(999, 'Máximo 999.')
    .optional(),

  available_until: z.string().optional(),

  state_name: z.string().min(1, 'Selecciona tu estado.'),
  municipality_name: z.string().optional().nullable(),
  city_name: z.string().optional().nullable(),
  parish_name: z.string().optional().nullable(),
  zone_text: z.string()
    .min(2, 'Indica tu sector o zona.')
    .max(80, 'Máximo 80 caracteres.')
    .refine((v) => !v.match(/\d{4,}/), {
      message: 'No incluyas número de casa o dirección exacta.',
    }),
  reference_text: z.string().max(120, 'Máximo 120 caracteres.').optional().nullable(),
  approximate_location_label: z.string().min(1, 'Etiqueta de ubicación obligatoria.'),

  description: z.string()
    .min(10, 'Agrega un poco más de detalle.')
    .max(600, 'Máximo 600 caracteres.'),

  contact_method: z.enum(['whatsapp', 'telegram', 'phone', 'app'], {
    error: 'Selecciona cómo quieres que te contacten.',
  }),

  contact_value: z.string().max(100).optional(),
})

export type OfferFormValues = z.infer<typeof offerSchema>
