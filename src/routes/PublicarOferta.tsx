import { PageIntro } from '@/components/layout'
import { OfferWizard } from '@/features/publish/OfferWizard'

export default function PublicarOferta() {
  return (
    <>
      <PageIntro
        eyebrow="Puedo ayudar"
        title="Publicar una oferta"
        description="Comparte lo que puedes dar. Sin dirección exacta."
      />
      <OfferWizard />
    </>
  )
}
