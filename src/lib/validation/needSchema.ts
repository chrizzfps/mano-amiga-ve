import { z } from 'zod'

export const needSchema = z.object({
  category: z.enum([
    'energia', 'agua', 'medicina', 'higiene', 'refugio',
    'transporte', 'mascotas', 'cuidados', 'comunicacion', 'otro',
  ], { error: 'Selecciona una categoría.' }),

  state: z.string().min(1, 'Selecciona tu estado.'),
  city: z.string().min(1, 'Selecciona tu ciudad.'),
  zone_text: z.string()
    .min(2, 'Indica tu sector o zona (mín. 2 caracteres).')
    .max(80, 'Máximo 80 caracteres.')
    .refine((v) => !v.match(/\d{4,}/), {
      message: 'No incluyas un número de casa o dirección exacta.',
    }),

  urgency: z.enum(['low', 'medium', 'high'], { error: 'Selecciona la urgencia.' }),

  title: z.string()
    .min(5, 'Describe tu necesidad en al menos 5 caracteres.')
    .max(120, 'Máximo 120 caracteres.'),

  description: z.string()
    .min(10, 'Agrega un poco más de detalle (mín. 10 caracteres).')
    .max(600, 'Máximo 600 caracteres.'),

  contact_method: z.enum(['whatsapp', 'telegram', 'phone', 'app'], {
    error: 'Selecciona cómo quieres que te contacten.',
  }),

  contact_value: z.string().max(100, 'Máximo 100 caracteres.').optional(),

  expires_at: z.string().optional(),
})

export type NeedFormValues = z.infer<typeof needSchema>
