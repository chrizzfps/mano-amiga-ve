import { useEffect, useRef } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  confirmVariant?: 'primary' | 'urgent' | 'help' | 'soft' | 'outline'
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  confirmVariant = 'primary',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  isPending = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
    return () => dialogRef.current?.close()
  }, [])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-sm rounded-2xl border border-line bg-surface p-0 shadow-lift backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-azul-strong">{title}</h2>
        <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Procesando…' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
