import { Link } from 'react-router-dom'
import type { Item } from '@/types/item'
import { Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { IconCheck, IconArrowRight, IconWhatsApp } from '@/components/icons'
import { shareItemLink } from '@/lib/utils/whatsapp'

export function PublishSuccess({ item }: { item: Item }) {
  const itemUrl = `${window.location.origin}/item/${item.id}`
  const waHref = shareItemLink(item, itemUrl)

  return (
    <Container size="narrow" className="py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-verde-soft text-verde-strong">
          <IconCheck size={32} />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold text-azul-strong">
            ¡Publicación creada!
          </h2>
          <p className="mt-2 text-ink-soft">
            Tu publicación ya está en el feed. Alguien cercano la verá pronto.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            variant="help"
            size="lg"
            block
            iconLeft={<IconWhatsApp size={20} />}
            onClick={() => window.open(waHref, '_blank', 'noopener')}
          >
            Compartir por WhatsApp
          </Button>
          <Button variant="soft" size="md" block iconRight={<IconArrowRight size={16} />} asChild>
            <Link to={`/item/${item.id}`}>Ver mi publicación</Link>
          </Button>
          <Button variant="ghost" size="sm" block asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>

        <p className="text-xs text-ink-faint max-w-xs">
          Recuerda: el contacto solo es visible para quien entre al detalle.
          Si ya te atendieron, márcala como atendida para que otros la vean resuelta.
        </p>
      </div>
    </Container>
  )
}
