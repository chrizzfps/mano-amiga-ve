import { Link } from 'react-router-dom'
import { PageIntro, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { IconHands } from '@/components/icons'
import { FeedList } from '@/features/feed/FeedList'

export default function Ofertas() {
  return (
    <>
      <PageIntro
        eyebrow="Ofrecimientos disponibles"
        title="¿Quién puede ayudar?"
        description="Personas y recursos disponibles cerca de ti."
        actions={
          <Button variant="help" iconLeft={<IconHands size={18} />} asChild>
            <Link to="/publicar/oferta">Puedo ayudar</Link>
          </Button>
        }
      />
      <Container size="wide" className="pb-12">
        <FeedList defaultType="offer" />
      </Container>
    </>
  )
}
