import { Link } from 'react-router-dom'
import { PageIntro, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { IconShield, IconPin, IconFlag, IconUsers, IconArrowRight } from '@/components/icons'

const ITEMS = [
  {
    icon: <IconPin size={22} />,
    title: 'Sin dirección exacta',
    body: 'Pedimos zona o sector, nunca número de casa, calle o coordenada precisa. Los pines del mapa tienen un desplazamiento aleatorio de ±500m.',
  },
  {
    icon: <IconUsers size={22} />,
    title: 'Sin cédula ni datos personales',
    body: 'No pedimos identificación. Solo lo mínimo: qué necesitas, dónde aproximadamente y cómo contactarte.',
  },
  {
    icon: <IconFlag size={22} />,
    title: 'El contacto, solo en el detalle',
    body: 'Tu número o usuario de WhatsApp/Telegram no aparece en el feed público. Solo quien entra al detalle de tu publicación lo ve.',
  },
  {
    icon: <IconShield size={22} />,
    title: 'Verifica antes de ir',
    body: 'Antes de acudir a un lugar desconocido, confirma por escrito con la persona. Cualquiera puede marcar una publicación como verificada o reportarla.',
  },
  {
    icon: <IconFlag size={22} />,
    title: 'Reporta si algo parece falso',
    body: 'Cada publicación tiene un botón de reporte. El equipo revisa y puede ocultarla. Juntos mantenemos el feed confiable.',
  },
]

export default function Seguridad() {
  return (
    <div className="flex flex-col flex-1">
      <PageIntro
        eyebrow="Seguridad"
        title="Tu privacidad y seguridad"
        description="ManoAmiga VE está diseñado para proteger a quien pide y a quien ayuda."
      />
      <Container size="narrow" className="pb-12 flex flex-col gap-6">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex gap-4">
            <span className="flex size-10 h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-soft text-verde-strong">
              {item.icon}
            </span>
            <div>
              <h2 className="font-bold text-azul-strong mb-1">{item.title}</h2>
              <p className="text-ink-soft text-sm">{item.body}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-line bg-cream-deep/50 p-5 mt-2">
          <p className="text-sm text-ink-soft">
            En caso de emergencia real, contacta a los cuerpos de emergencia de tu municipio.
            ManoAmiga VE es una plataforma de ayuda mutua entre vecinos, no un servicio de emergencias.
          </p>
        </div>

        <Button variant="soft" iconRight={<IconArrowRight size={16} />} asChild>
          <Link to="/como-funciona">Cómo funciona la plataforma →</Link>
        </Button>
      </Container>
    </div>
  )
}
