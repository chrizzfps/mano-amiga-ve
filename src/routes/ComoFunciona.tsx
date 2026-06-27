import { Link } from 'react-router-dom'
import { PageIntro, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { IconHandHeart, IconHands, IconArrowRight } from '@/components/icons'

const STEPS = [
  {
    num: '1',
    title: 'Publica tu necesidad o tu ayuda',
    body: 'Elige la categoría, tu zona aproximada y describe en una línea qué necesitas o qué puedes dar. Sin cédula, sin dirección exacta. En menos de 2 minutos.',
  },
  {
    num: '2',
    title: 'Alguien lo ve y te contacta',
    body: 'Cualquier persona puede ver el feed y decidir ayudar. El contacto solo aparece en el detalle de la publicación, nunca en la lista pública.',
  },
  {
    num: '3',
    title: 'Coordinen y dense una mano',
    body: 'Acuerdan el lugar y el momento. Cuando se resuelve, quien publicó puede marcarla como atendida para que todos sepan.',
  },
  {
    num: '4',
    title: 'La comunidad verifica y reporta',
    body: 'Cualquier vecino puede verificar que una publicación es real o reportarla si parece falsa. Así mantenemos el feed confiable.',
  },
]

export default function ComoFunciona() {
  return (
    <div className="flex flex-col flex-1">
      <PageIntro
        eyebrow="Cómo funciona"
        title="Simple, rápido y seguro"
        description="ManoAmiga VE conecta necesidades con ayudas en cuatro pasos."
      />
      <Container size="narrow" className="pb-12 flex flex-col gap-8">
        {STEPS.map((s) => (
          <div key={s.num} className="flex gap-4">
            <span className="flex size-10 h-10 w-10 shrink-0 items-center justify-center rounded-full bg-azul text-cream font-extrabold text-lg">
              {s.num}
            </span>
            <div>
              <h2 className="font-bold text-azul-strong mb-1">{s.title}</h2>
              <p className="text-ink-soft">{s.body}</p>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-line bg-cream-deep/50 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-azul-strong text-lg">¿Listo para comenzar?</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="urgent" iconLeft={<IconHandHeart size={18} />} asChild>
              <Link to="/publicar/necesidad">Necesito ayuda</Link>
            </Button>
            <Button variant="help" iconLeft={<IconHands size={18} />} asChild>
              <Link to="/publicar/oferta">Puedo ayudar</Link>
            </Button>
          </div>
          <Button variant="ghost" size="sm" iconRight={<IconArrowRight size={16} />} asChild>
            <Link to="/seguridad">Leer sobre seguridad y privacidad →</Link>
          </Button>
        </div>
      </Container>
    </div>
  )
}
