import { Link } from 'react-router-dom'
import { PageIntro } from '@/components/layout'
import { Button, EmptyState } from '@/components/ui'
import { IconArrowLeft, IconSpark } from '@/components/icons'

interface PhaseStubProps {
  title: string
  phase: string
  description: string
}

/** Placeholder coherente para rutas que se construyen en fases posteriores. */
export function PhaseStub({ title, phase, description }: PhaseStubProps) {
  return (
    <>
      <PageIntro eyebrow={phase} title={title} description={description} />
      <div className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
        <EmptyState
          icon={<IconSpark size={26} />}
          title="En construcción"
          description="Esta sección se habilita en una próxima fase. La base, el diseño y la navegación ya están listos."
          action={
            <Button variant="soft" iconLeft={<IconArrowLeft size={18} />} asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
          }
        />
      </div>
    </>
  )
}
