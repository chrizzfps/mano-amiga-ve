import { PageIntro } from '@/components/layout'
import { NeedWizard } from '@/features/publish/NeedWizard'

export default function PublicarNecesidad() {
  return (
    <>
      <PageIntro
        eyebrow="Necesito ayuda"
        title="Publicar una necesidad"
        description="Sin dirección exacta, sin cédula. En menos de dos minutos."
      />
      <NeedWizard />
    </>
  )
}
