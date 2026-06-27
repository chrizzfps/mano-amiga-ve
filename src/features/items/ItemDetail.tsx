import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Item } from '@/types/item'
import { cn } from '@/lib/utils/cn'
import { relativeTime, formatUntil, isExpired } from '@/lib/utils/time'
import { shareItemLink } from '@/lib/utils/whatsapp'
import { CONTACT_LABEL } from '@/lib/constants/taxonomy'
import {
  Button,
  Card,
  StatusBadge,
  UrgencyBadge,
  useToast,
  ConfirmDialog,
} from '@/components/ui'
import { CategoryPill } from '@/components/ui'
import {
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconFlag,
  IconPin,
  IconShare,
  IconUsers,
  IconWhatsApp,
} from '@/components/icons'
import { Container } from '@/components/layout'
import { useUpdateStatus, useVerifyItem } from '@/features/feed/useItemsQuery'
import { ReportDialog } from './ReportDialog'

interface ItemDetailProps {
  item: Item
}

export function ItemDetail({ item }: ItemDetailProps) {
  const [showReport, setShowReport] = useState(false)
  const [showFulfilledConfirm, setShowFulfilledConfirm] = useState(false)
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const updateStatus = useUpdateStatus()
  const verifyItem = useVerifyItem()

  const isNeed = item.type === 'need'
  const isFulfilled = item.status === 'fulfilled'
  const isOpen = item.status === 'open' || item.status === 'available' || item.status === 'in_progress'
  const expired = isExpired(item.expires_at ?? item.available_until)

  const itemUrl = `${window.location.origin}/item/${item.id}`
  const waShareHref = shareItemLink(item, itemUrl)

  function handleFulfilled() {
    updateStatus.mutate(
      { id: item.id, status: 'fulfilled' },
      {
        onSuccess: () => {
          setShowFulfilledConfirm(false)
          toast('¡Marcado como atendido!', { tone: 'verde' })
        },
        onError: () => {
          setShowFulfilledConfirm(false)
          toast('No se pudo actualizar el estado.', { tone: 'coral' })
        },
      },
    )
  }

  function handleVerify() {
    verifyItem.mutate(item.id, {
      onSuccess: () => {
        setShowVerifyConfirm(false)
        toast('Verificación registrada. ¡Gracias!', { tone: 'azul' })
      },
      onError: () => {
        setShowVerifyConfirm(false)
        toast('No se pudo registrar la verificación.', { tone: 'coral' })
      },
    })
  }

  function handleShareNative() {
    if (navigator.share) {
      void navigator.share({
        title: item.title,
        text: `${isNeed ? 'Necesidad' : 'Ofrecimiento'}: ${item.title} (${item.approximate_location_label})`,
        url: itemUrl,
      })
    } else {
      void navigator.clipboard.writeText(itemUrl).then(() =>
        toast('Enlace copiado al portapapeles', { tone: 'azul' }),
      )
    }
  }

  const typeLabel = isNeed ? 'necesidad' : 'ofrecimiento'

  return (
    <Container size="narrow" className="py-6 pb-12">
      {/* Volver */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azul"
      >
        <IconArrowLeft size={18} />
        Volver
      </button>

      {/* Estado expirado */}
      {expired && !isFulfilled && (
        <div className="mb-4 rounded-lg border border-amarillo-soft bg-amarillo-soft px-4 py-3 text-sm font-semibold text-amarillo-strong">
          Esta publicación puede estar vencida. Verifica antes de contactar.
        </div>
      )}

      <Card accent={isNeed ? 'coral' : 'verde'} className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isNeed ? <UrgencyBadge urgency={item.urgency} /> : <StatusBadge status={item.status} />}
          <StatusBadge status={item.status} />
          <CategoryPill category={item.category} variant="solid" />
        </div>

        {/* Título */}
        <h1 className="text-xl font-extrabold text-azul-strong mb-2">{item.title}</h1>

        {/* Zona + tiempo */}
        <p className="flex items-center gap-1.5 text-sm text-ink-soft mb-1">
          <IconPin size={14} className="shrink-0" />
          {item.approximate_location_label}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-ink-soft mb-4">
          <IconClock size={14} className="shrink-0" />
          Publicado {relativeTime(item.created_at)}
          {item.available_until && !isExpired(item.available_until)
            ? ` · ${formatUntil(item.available_until)}`
            : ''}
        </p>

        {/* Bloque de Ubicación Híbrida Estructurada */}
        <div className="rounded-xl border border-line bg-cream-deep/20 p-4 mb-4 text-sm flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-ink-faint uppercase tracking-wide">Ubicación aproximada</span>
            <span className="font-semibold text-ink-strong">{item.approximate_location_label}</span>
          </div>
          
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-ink-faint uppercase tracking-wide">Sector / Zona</span>
            <span className="text-ink">{item.zone_text}</span>
          </div>

          {item.reference_text && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-ink-faint uppercase tracking-wide">Punto de referencia</span>
              <span className="text-ink italic">"{item.reference_text}"</span>
            </div>
          )}
        </div>

        {/* Descripción */}
        <p className="text-ink leading-relaxed mb-4">{item.description}</p>

        {/* Verificaciones */}
        {item.verified_count > 0 && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-verde-strong mb-4">
            <IconUsers size={16} />
            Verificado por {item.verified_count} {item.verified_count === 1 ? 'vecino' : 'vecinos'}
          </p>
        )}

        {/* Separador */}
        <div className="border-t border-line pt-4" />

        {/* Contacto — SOLO en detalle, nunca en cards públicas */}
        {isOpen && (
          <div className="mt-4 rounded-xl border border-line bg-cream-deep/50 p-4">
            <p className="text-xs font-bold text-ink-faint uppercase tracking-wide mb-2">Contacto</p>
            <p className="font-semibold text-ink">
              {CONTACT_LABEL[item.contact_method]}
              {item.contact_method !== 'app' && item.contact_value
                ? `: ${item.contact_value}`
                : ''}
            </p>
            {item.contact_method === 'whatsapp' && item.contact_value && (
              <div className="mt-3">
                <Button
                  variant="help"
                  size="md"
                  block
                  iconLeft={<IconWhatsApp size={18} />}
                  onClick={() =>
                    window.open(
                      `https://wa.me/58${item.contact_value.replace(/\D/g, '').replace(/^0/, '')}`,
                      '_blank',
                      'noopener',
                    )
                  }
                >
                  Contactar por WhatsApp
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Acciones secundarias */}
      <div className={cn('mt-4 grid gap-3', 'grid-cols-1 sm:grid-cols-2')}>
        <Button
          variant="soft"
          iconLeft={<IconWhatsApp size={18} />}
          onClick={() => window.open(waShareHref, '_blank', 'noopener')}
        >
          Compartir por WhatsApp
        </Button>

        <Button
          variant="outline"
          iconLeft={<IconShare size={18} />}
          onClick={handleShareNative}
        >
          Compartir enlace
        </Button>

        {/* Marcar atendida — abre modal de confirmación */}
        {!isFulfilled && isOpen && (
          <Button
            variant="help"
            iconLeft={<IconCheck size={18} />}
            onClick={() => setShowFulfilledConfirm(true)}
          >
            Marcar como atendida
          </Button>
        )}

        {/* Verificar — abre modal de confirmación */}
        {isOpen && (
          <Button
            variant="outline"
            iconLeft={<IconUsers size={18} />}
            onClick={() => setShowVerifyConfirm(true)}
          >
            Verificar que es real
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          iconLeft={<IconFlag size={16} />}
          onClick={() => setShowReport(true)}
          className="text-ink-faint sm:col-span-2"
        >
          Reportar publicación
        </Button>
      </div>

      <div className="mt-8 text-center">
        <Link to="/necesidades" className="text-sm font-semibold text-azul hover:underline">
          Ver más publicaciones
        </Link>
      </div>

      {/* Modal: confirmar atendida */}
      {showFulfilledConfirm && (
        <ConfirmDialog
          title={`¿Ya fue atendida esta ${typeLabel}?`}
          description={`Al confirmar, esta ${typeLabel} desaparecerá del feed principal y pasará al historial de atendidas. Esta acción no se puede deshacer desde la app.`}
          confirmLabel="Sí, marcar como atendida"
          confirmVariant="help"
          onConfirm={handleFulfilled}
          onCancel={() => setShowFulfilledConfirm(false)}
          isPending={updateStatus.isPending}
        />
      )}

      {/* Modal: confirmar verificación */}
      {showVerifyConfirm && (
        <ConfirmDialog
          title="¿Confirmas que esta publicación es real?"
          description="Al verificar, añades tu voto de confianza. Esto ayuda a la comunidad a identificar publicaciones legítimas. Solo verifica si tienes motivo para creerlo."
          confirmLabel="Sí, es real"
          confirmVariant="soft"
          onConfirm={handleVerify}
          onCancel={() => setShowVerifyConfirm(false)}
          isPending={verifyItem.isPending}
        />
      )}

      {showReport && (
        <ReportDialog itemId={item.id} onClose={() => setShowReport(false)} />
      )}
    </Container>
  )
}
