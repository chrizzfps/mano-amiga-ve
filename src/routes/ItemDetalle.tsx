import { useParams, Link } from 'react-router-dom'
import { Container } from '@/components/layout'
import { Skeleton, EmptyState, Button } from '@/components/ui'
import { IconArrowLeft } from '@/components/icons'
import { ItemDetail } from '@/features/items/ItemDetail'
import { useItemQuery } from '@/features/feed/useItemsQuery'

export default function ItemDetalle() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading, isError } = useItemQuery(id ?? '')

  if (isLoading) {
    return (
      <Container size="narrow" className="py-6 space-y-3" aria-busy>
        <Skeleton shape="line" className="h-5 w-24" />
        <Skeleton className="h-48" />
        <Skeleton shape="line" className="h-4 w-3/4" />
        <Skeleton shape="block" className="h-12" />
      </Container>
    )
  }

  if (isError || !item) {
    return (
      <Container size="narrow" className="py-12">
        <EmptyState
          title="Publicación no encontrada"
          description="Puede que ya no exista o haya sido eliminada."
          action={
            <Button variant="soft" iconLeft={<IconArrowLeft size={16} />} asChild>
              <Link to="/necesidades">Ver otras publicaciones</Link>
            </Button>
          }
        />
      </Container>
    )
  }

  return <ItemDetail item={item} />
}
