import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, RadioGroup, Textarea, useToast } from '@/components/ui'
import type { RadioOption } from '@/components/ui'
import { IconFlag, IconClose } from '@/components/icons'
import { REPORT_REASONS } from '@/lib/constants/taxonomy'
import { useReportItem } from '@/features/feed/useItemsQuery'
import type { ReportReason } from '@/types/report'

const schema = z.object({
  reason: z.enum(['fake', 'resolved', 'duplicate', 'wrong_info', 'inappropriate', 'other'], {
    error: 'Selecciona un motivo.',
  }),
  description: z.string().max(300, 'Máximo 300 caracteres.'),
})

type FormValues = z.infer<typeof schema>

const REASON_OPTIONS: RadioOption<ReportReason>[] = REPORT_REASONS.map((r) => ({
  value: r.value,
  label: r.label,
}))

interface ReportDialogProps {
  itemId: string
  onClose: () => void
}

export function ReportDialog({ itemId, onClose }: ReportDialogProps) {
  const { toast } = useToast()
  const mutation = useReportItem()
  const [done, setDone] = useState(false)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description: '' },
  })

  const reasonVal = watch('reason')

  function onSubmit(data: FormValues) {
    mutation.mutate(
      { item_id: itemId, reason: data.reason, description: data.description },
      {
        onSuccess: () => {
          setDone(true)
          toast('Reporte enviado. Gracias.', { tone: 'azul' })
        },
        onError: () => {
          toast('No se pudo enviar el reporte.', { tone: 'coral' })
        },
      },
    )
  }

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/30"
      />
      <div
        role="dialog"
        aria-modal
        aria-label="Reportar publicación"
        className="fixed inset-x-3 top-1/2 z-50 -translate-y-1/2 rounded-2xl border border-line bg-surface p-5 shadow-lift sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-azul-strong text-lg">Reportar publicación</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar diálogo">
            <IconClose size={20} className="text-ink-soft" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <IconFlag size={30} className="text-azul" />
            <p className="font-semibold text-ink">Reporte enviado.</p>
            <p className="text-sm text-ink-soft">Lo revisaremos a la brevedad.</p>
            <Button variant="soft" onClick={onClose}>Cerrar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <RadioGroup<ReportReason>
              label="¿Por qué reportas esta publicación?"
              name="reason"
              value={reasonVal}
              onChange={(v) => setValue('reason', v, { shouldValidate: true })}
              options={REASON_OPTIONS}
              columns={2}
              error={errors.reason?.message}
            />
            <Textarea
              label="Detalle opcional"
              placeholder="Agrega más información si quieres."
              maxLength={300}
              showCount
              error={errors.description?.message}
              {...register('description')}
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
              <Button
                variant="urgent"
                type="submit"
                block
                iconLeft={<IconFlag size={16} />}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Enviando…' : 'Enviar reporte'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
