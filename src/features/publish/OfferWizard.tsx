import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { repository } from '@/lib/data'
import { ITEMS_KEY, COUNTS_KEY } from '@/features/feed/useItemsQuery'
import { offerSchema, type OfferFormValues } from '@/lib/validation/offerSchema'
import { CATEGORIES } from '@/lib/constants/categories'
import { CONTACT_METHODS } from '@/lib/constants/taxonomy'
import { STATE_NAMES, citiesFor } from '@/lib/constants/venezuela'
import { useToast } from '@/components/ui'
import { Input, Textarea, Select, RadioGroup } from '@/components/ui'
import type { RadioOption } from '@/components/ui'
import { CategoryIcon } from '@/components/icons'
import { StepShell } from './StepShell'
import { PublishSuccess } from './PublishSuccess'
import type { Item, CategoryId } from '@/types/item'

const TOTAL = 7

const CATEGORY_OPTIONS: RadioOption<CategoryId>[] = CATEGORIES.map((c) => ({
  value: c.id,
  label: c.label,
  description: c.offerHint,
  icon: <CategoryIcon category={c.id} size={18} />,
}))

const CONTACT_OPTIONS: RadioOption<'whatsapp' | 'telegram' | 'phone' | 'app'>[] = CONTACT_METHODS.map(
  (m) => ({ value: m.value, label: m.label }),
)

const EXAMPLES = [
  'Tengo 4 enchufes para cargar teléfonos',
  'Tengo agua filtrada para 5 familias',
  'Puedo guardar medicina en nevera esta noche',
  'Puedo hacer traslados cortos en moto',
  'Puedo recibir una mascota pequeña por una noche',
  'Tengo un baño disponible para mujeres con niños',
]

export function OfferWizard() {
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState<Item | null>(null)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { toast } = useToast()

  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: { contact_method: 'whatsapp' },
  })

  const stateVal = watch('state')
  const contactMethod = watch('contact_method')
  const categoryVal = watch('category')

  const stateOptions = STATE_NAMES.map((s) => ({ value: s, label: s }))
  const cityOptions = stateVal
    ? citiesFor(stateVal).map((c) => ({ value: c, label: c }))
    : []

  const mutation = useMutation({
    mutationFn: (data: OfferFormValues) =>
      repository.createItem({
        type: 'offer',
        category: data.category,
        title: data.title,
        description: data.description,
        zone_text: data.zone_text,
        state: data.state,
        city: data.city,
        urgency: 'low',
        contact_method: data.contact_method,
        contact_value: data.contact_value ?? '',
        capacity: data.capacity ?? null,
        available_until: data.available_until ?? null,
        status: 'available',
      }),
    onSuccess: (item) => {
      void qc.invalidateQueries({ queryKey: [ITEMS_KEY] })
      void qc.invalidateQueries({ queryKey: [COUNTS_KEY] })
      setPublished(item)
      toast('¡Ofrecimiento publicado!', { tone: 'verde' })
    },
    onError: () => {
      toast('No se pudo publicar. Intenta de nuevo.', { tone: 'coral' })
    },
  })

  const FIELDS_PER_STEP: Array<Array<keyof OfferFormValues>> = [
    ['category'],
    ['title'],
    ['capacity', 'available_until'],
    ['state', 'city', 'zone_text'],
    ['description'],
    ['contact_method', 'contact_value'],
    [],
  ]

  async function goNext() {
    const ok = await trigger(FIELDS_PER_STEP[step - 1])
    if (!ok) return
    if (step === TOTAL) {
      mutation.mutate(getValues())
      return
    }
    setStep((s) => s + 1)
  }

  function goBack() {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep((s) => s - 1)
    }
  }

  if (published) return <PublishSuccess item={published} />

  const TITLES = [
    '¿Qué puedes ofrecer?',
    'Descríbelo en una línea',
    '¿Cuánta capacidad tienes y hasta cuándo?',
    '¿En qué zona estás?',
    'Agrega detalles o restricciones',
    '¿Cómo pueden contactarte?',
    'Revisa y publica',
  ]

  const HINTS = [
    'Selecciona la categoría que mejor describe tu ayuda.',
    undefined,
    'Opcional, pero muy útil para quien necesita ayuda.',
    'Solo el sector. Nunca la dirección exacta.',
    'Restricciones de acceso, condiciones, horarios, etc.',
    'Solo aparecerá en el detalle, nunca en el feed.',
    undefined,
  ]

  return (
    <StepShell
      title={TITLES[step - 1]}
      hint={HINTS[step - 1]}
      current={step}
      total={TOTAL}
      onBack={goBack}
      onNext={goNext}
      isLastStep={step === TOTAL}
      isSubmitting={mutation.isPending}
    >
      {step === 1 && (
        <RadioGroup<CategoryId>
          label="Categoría"
          name="category"
          value={categoryVal}
          onChange={(v) => setValue('category', v, { shouldValidate: true })}
          options={CATEGORY_OPTIONS}
          columns={2}
          error={errors.category?.message}
        />
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <Input
            label="Puedo ofrecer…"
            placeholder="Ej. 4 enchufes para cargar teléfonos"
            maxLength={120}
            required
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Ejemplos</p>
            <ul className="flex flex-col gap-1.5">
              {EXAMPLES.map((ex) => (
                <li
                  key={ex}
                  role="button"
                  tabIndex={0}
                  onClick={() => setValue('title', ex, { shouldValidate: true })}
                  onKeyDown={(e) => e.key === 'Enter' && setValue('title', ex, { shouldValidate: true })}
                  className="cursor-pointer rounded-lg border border-line bg-cream-deep/50 px-3 py-2 text-sm text-ink hover:border-azul hover:bg-azul-soft"
                >
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Input
            label="Capacidad (personas, familias, dosis…)"
            type="number"
            min={1}
            max={999}
            placeholder="Ej. 4"
            error={errors.capacity?.message}
            {...register('capacity', { valueAsNumber: true })}
          />
          <Input
            label="Disponible hasta"
            type="datetime-local"
            error={errors.available_until?.message}
            {...register('available_until')}
          />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <Select
            label="Estado"
            placeholder="Selecciona tu estado"
            options={stateOptions}
            required
            error={errors.state?.message}
            {...register('state', { onChange: () => setValue('city', '') })}
          />
          <Select
            label="Ciudad / municipio"
            placeholder={stateVal ? 'Selecciona la ciudad' : 'Primero elige el estado'}
            options={cityOptions}
            disabled={!stateVal}
            required
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="Sector o zona"
            placeholder="Ej. Chacao, sector Los Palos Grandes"
            maxLength={80}
            required
            error={errors.zone_text?.message}
            {...register('zone_text')}
          />
        </div>
      )}

      {step === 5 && (
        <Textarea
          label="Detalles adicionales"
          placeholder="Ej. Solo mujeres con niños. Traer envases limpios. Disponible de 8am a 5pm."
          maxLength={600}
          showCount
          required
          error={errors.description?.message}
          {...register('description')}
        />
      )}

      {step === 6 && (
        <div className="flex flex-col gap-4">
          <RadioGroup<'whatsapp' | 'telegram' | 'phone' | 'app'>
            label="¿Por dónde prefieren contactarte?"
            name="contact_method"
            value={contactMethod}
            onChange={(v) => setValue('contact_method', v, { shouldValidate: true })}
            options={CONTACT_OPTIONS}
            columns={2}
            error={errors.contact_method?.message}
          />
          {(contactMethod as string) !== 'app' && (
            <Input
              label={contactMethod === 'telegram' ? 'Usuario de Telegram' : 'Número de teléfono'}
              placeholder={
                CONTACT_METHODS.find((m) => m.value === contactMethod)?.placeholder ?? ''
              }
              error={errors.contact_value?.message}
              {...register('contact_value')}
            />
          )}
        </div>
      )}

      {step === 7 && (
        <OfferReviewStep values={getValues()} />
      )}
    </StepShell>
  )
}

function OfferReviewStep({ values }: { values: OfferFormValues }) {
  const catMeta = CATEGORIES.find((c) => c.id === values.category)
  const rows = [
    { label: 'Categoría', value: catMeta?.label ?? '' },
    { label: 'Ofrezco', value: values.title },
    { label: 'Zona', value: `${values.zone_text}, ${values.city}, ${values.state}` },
    ...(values.capacity ? [{ label: 'Capacidad', value: String(values.capacity) }] : []),
    ...(values.available_until
      ? [{ label: 'Hasta', value: new Date(values.available_until).toLocaleString('es-VE') }]
      : []),
    { label: 'Detalle', value: values.description },
    { label: 'Contacto', value: `${values.contact_method}${values.contact_value ? `: ${values.contact_value}` : ''}` },
  ]
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <dl>
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5 border-b border-line px-4 py-3 last:border-0">
            <dt className="text-xs font-bold text-ink-faint uppercase tracking-wide">{r.label}</dt>
            <dd className="text-sm text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
