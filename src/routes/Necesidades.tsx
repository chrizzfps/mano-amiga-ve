import { Link } from 'react-router-dom'
import { PageIntro, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { IconHandHeart } from '@/components/icons'
import { FeedList } from '@/features/feed/FeedList'

export default function Necesidades() {
  return (
    <>
      <PageIntro
        eyebrow="Necesidades activas"
        title="¿Quién necesita ayuda?"
        description="Publicaciones de personas que necesitan una mano cerca de ti."
        actions={
          <Button variant="urgent" iconLeft={<IconHandHeart size={18} />} asChild>
            <Link to="/publicar/necesidad">Necesito ayuda</Link>
          </Button>
        }
      />
      <Container size="wide" className="pb-12">
        <FeedList defaultType="need" />
      </Container>
    </>
  )
}
