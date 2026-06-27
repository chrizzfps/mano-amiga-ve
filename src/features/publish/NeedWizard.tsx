import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { repository } from '@/lib/data'
import { ITEMS_KEY, COUNTS_KEY } from '@/features/feed/useItemsQuery'
import { needSchema, type NeedFormValues } from '@/lib/validation/needSchema'
import { CATEGORIES } from '@/lib/constants/categories'
import { URGENCY_OPTIONS, CONTACT_METHODS } from '@/lib/constants/taxonomy'
import { useToast } from '@/components/ui'
import { Input, Textarea, RadioGroup } from '@/components/ui'
import type { RadioOption } from '@/components/ui'
import { CategoryIcon } from '@/components/icons'
import { StepShell } from './StepShell'
import { PublishSuccess } from './PublishSuccess'
import { LocationFields } from '@/components/ui/LocationFields'
import type { Item } from '@/types/item'
import type { CategoryId } from '@/types/item'

const TOTAL = 6

const CATEGORY_OPTIONS: RadioOption<CategoryId>[] = CATEGORIES.map((c) => ({
  value: c.id,
  label: c.label,
  description: c.needHint,
  icon: <CategoryIcon category={c.id} size={18} />,
}))

const URGENCY_RADIO: RadioOption<'low' | 'medium' | 'high'>[] = URGENCY_OPTIONS.map((u) => ({
  value: u.value,
  label: u.label,
  description: u.help,
}))

const CONTACT_OPTIONS: RadioOption<'whatsapp' | 'telegram' | 'phone' | 'app'>[] = CONTACT_METHODS.map(
  (m) => ({ value: m.value, label: m.label }),
)

export function NeedWizard() {
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
  } = useForm<NeedFormValues>({
    resolver: zodResolver(needSchema),
    defaultValues: { urgency: 'medium', contact_method: 'whatsapp' },
  })

  const contactMethod = watch('contact_method')
  const categoryVal = watch('category')
  const urgencyVal = watch('urgency')

  const mutation = useMutation({
    mutationFn: (data: NeedFormValues) =>
      repository.createItem({
        type: 'need',
        category: data.category,
        title: data.title,
        description: data.description,
        state_name: data.state_name,
        municipality_name: data.municipality_name ?? null,
        city_name: data.city_name ?? null,
        parish_name: data.parish_name ?? null,
        zone_text: data.zone_text,
        reference_text: data.reference_text ?? null,
        approximate_location_label: data.approximate_location_label,
        urgency: data.urgency,
        contact_method: data.contact_method,
        contact_value: data.contact_value ?? '',
        expires_at: data.expires_at ?? null,
        status: 'open',
      }),
    onSuccess: (item) => {
      void qc.invalidateQueries({ queryKey: [ITEMS_KEY] })
      void qc.invalidateQueries({ queryKey: [COUNTS_KEY] })
      setPublished(item)
      toast('¡Publicación creada!', { tone: 'verde' })
    },
    onError: () => {
      toast('No se pudo publicar. Intenta de nuevo.', { tone: 'coral' })
    },
  })

  const FIELDS_PER_STEP: Array<Array<keyof NeedFormValues>> = [
    ['category'],
    ['state_name', 'city_name', 'zone_text', 'reference_text', 'approximate_location_label'],
    ['urgency'],
    ['title', 'description'],
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
    '¿Qué necesitas?',
    '¿Dónde estás aproximadamente?',
    '¿Qué tan urgente es?',
    'Describe en una línea',
    '¿Cómo pueden contactarte?',
    'Revisa y publica',
  ]

  const HINTS = [
    'Selecciona la categoría que mejor describe tu necesidad.',
    'Solo el sector o zona. Nunca dirección exacta.',
    undefined,
    'Una línea clara ayuda a que alguien actúe rápido.',
    'Solo aparecerá en el detalle, nunca en el feed público.',
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
        <LocationFields
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />
      )}

      {step === 3 && (
        <RadioGroup<'low' | 'medium' | 'high'>
          label="Urgencia"
          name="urgency"
          value={urgencyVal}
          onChange={(v) => setValue('urgency', v, { shouldValidate: true })}
          options={URGENCY_RADIO}
          columns={1}
          error={errors.urgency?.message}
        />
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <Input
            label="Necesito…"
            placeholder="Ej. Refrigerar insulina esta noche"
            maxLength={120}
            required
            error={errors.title?.message}
            {...register('title')}
          />
          <Textarea
            label="Un poco más de detalle"
            placeholder="Ej. Se necesita nevera o hielo para mantener insulina fría hasta mañana."
            maxLength={600}
            showCount
            required
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            label="¿Hasta cuándo necesitas esto? (opcional)"
            type="datetime-local"
            error={errors.expires_at?.message}
            {...register('expires_at')}
          />
        </div>
      )}

      {step === 5 && (
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
              required={contactMethod !== 'app'}
              error={errors.contact_value?.message}
              {...register('contact_value')}
            />
          )}
          <p className="rounded-lg bg-azul-soft p-3 text-sm text-azul-strong">
            Tu contacto solo será visible para quien entre al detalle de tu publicación,
            nunca en el feed público.
          </p>
        </div>
      )}

      {step === 6 && (
        <ReviewStep values={getValues()} />
      )}
    </StepShell>
  )
}

/* ---- Resumen final antes de publicar ---- */
function ReviewStep({ values }: { values: NeedFormValues }) {
  const catMeta = CATEGORIES.find((c) => c.id === values.category)
  const rows = [
    { label: 'Categoría', value: catMeta?.label ?? '' },
    { label: 'Ubicación', value: values.approximate_location_label },
    { label: 'Sector o Zona', value: values.zone_text },
    ...(values.reference_text ? [{ label: 'Punto de referencia', value: values.reference_text }] : []),
    { label: 'Urgencia', value: URGENCY_OPTIONS.find((u) => u.value === values.urgency)?.label ?? '' },
    { label: 'Necesito', value: values.title },
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
