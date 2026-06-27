import { Link } from 'react-router-dom'
import { Container } from '@/components/layout'
import { Button, EmptyState } from '@/components/ui'
import { BrandMark, IconHome } from '@/components/icons'

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        icon={<BrandMark size={40} boxed={false} className="text-azul" />}
        title="No encontramos esta página"
        description="Puede que el enlace esté roto o que la publicación ya no exista."
        action={
          <Button iconLeft={<IconHome size={18} />} asChild>
            <Link to="/">Ir al inicio</Link>
          </Button>
        }
      />
    </Container>
  )
}
