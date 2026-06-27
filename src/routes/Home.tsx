import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/layout'
import { Button, Skeleton, EmptyState, CategoryPill } from '@/components/ui'
import {
  IconHandHeart,
  IconHands,
  IconArrowRight,
  IconShield,
  IconPin,
  IconSpark,
  IconMapFold,
  CategoryIcon,
} from '@/components/icons'
import { CATEGORIES } from '@/lib/constants/categories'
import { ItemCard } from '@/features/items/ItemCard'
import { useItemsQuery, useCountsQuery } from '@/features/feed/useItemsQuery'

const MapPreview = lazy(() => import('@/features/map/MapPreview'))

/* ---- Counter ---- */
function Counter({
  value,
  label,
  tone,
}: {
  value: number | undefined
  label: string
  tone: 'coral' | 'verde' | 'amarillo'
}) {
  const colorMap = {
    coral: 'text-coral-strong',
    verde: 'text-verde-strong',
    amarillo: 'text-amarillo-strong',
  }
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {value == null ? (
        <Skeleton shape="line" className="h-9 w-16 rounded-xl" />
      ) : (
        <span className={`text-4xl font-extrabold tabular-nums ${colorMap[tone]}`}>
          {value.toLocaleString('es-VE')}
        </span>
      )}
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
    </div>
  )
}

/* ---- Skeleton de tarjeta en el feed ---- */
function CardSkeleton() {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
      <Skeleton shape="line" className="h-4 w-20" />
      <Skeleton shape="line" className="h-5 w-3/4" />
      <Skeleton shape="line" className="h-3.5 w-1/2" />
      <Skeleton shape="line" className="h-3.5 w-full" />
      <Skeleton shape="block" className="mt-3 h-9" />
    </div>
  )
}

/* ---- Pasos de "Cómo funciona" ---- */
const HOW_STEPS = [
  {
    num: '1',
    title: 'Publica lo que necesitas o puedes ofrecer',
    body: 'Solo una línea, sin dirección exacta, sin cédula. En menos de dos minutos.',
  },
  {
    num: '2',
    title: 'Alguien cercano lo ve y te contacta',
    body: 'Por WhatsApp, Telegram o teléfono, cuando tú quieras y con quien tú elijas.',
  },
  {
    num: '3',
    title: 'Se dan una mano',
    body: 'Así de simple. Una pequeña ayuda puede cambiar el día de alguien.',
  },
]

/* ---- Ejemplos: qué pedir / ofrecer ---- */
const NEED_EXAMPLES = [
  { cat: 'energia' as const, text: 'Cargar el teléfono o un equipo médico' },
  { cat: 'agua' as const, text: 'Agua para beber, cocinar o asearse' },
  { cat: 'medicina' as const, text: 'Refrigerar insulina o guardar un medicamento' },
  { cat: 'higiene' as const, text: 'Un baño o ducha por unas horas' },
  { cat: 'refugio' as const, text: 'Un lugar seguro para descansar' },
  { cat: 'transporte' as const, text: 'Un traslado corto en emergencia' },
]

const OFFER_EXAMPLES = [
  { cat: 'energia' as const, text: 'Tengo 4 enchufes para cargar teléfonos' },
  { cat: 'agua' as const, text: 'Tengo agua filtrada para 5 familias' },
  { cat: 'medicina' as const, text: 'Puedo guardar medicina en nevera esta noche' },
  { cat: 'transporte' as const, text: 'Puedo hacer traslados cortos en moto' },
  { cat: 'mascotas' as const, text: 'Puedo recibir una mascota pequeña por una noche' },
  { cat: 'higiene' as const, text: 'Tengo un baño disponible para mujeres con niños' },
]

/* ---- Puntos de seguridad ---- */
const SAFETY_POINTS = [
  'Nunca publicamos tu dirección exacta. Solo zona o sector.',
  'El contacto aparece únicamente en el detalle de la publicación.',
  'Cada publicación puede verificarse o reportarse por la comunidad.',
  'Confirma siempre con quien contactes antes de acudir a un lugar.',
]

/* ================================================================== */

export default function Home() {
  const { data: counts, isLoading: loadingCounts } = useCountsQuery()
  // Solo publicaciones activas (no atendidas ni cerradas) para el feed del Home
  const { data: recent, isLoading: loadingRecent } = useItemsQuery({ availableNow: true }, 'recent')

  const preview = recent?.slice(0, 6) ?? []

  return (
    <div className="flex flex-col gap-0">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-cream-deep via-cream to-azul-soft/30 border-b border-black/[0.05] py-14 sm:py-20"
        aria-labelledby="hero-title"
      >
        {/* Decorative background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-amarillo/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-azul/10 blur-3xl"
        />

        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy + CTAs */}
            <div className="flex flex-col items-start gap-6 max-w-2xl">
              <img src="/logo.png" alt="ManoAmiga VE" className="h-14 w-auto" />
              <div>
                <h1
                  id="hero-title"
                  className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-azul-strong"
                >
                  Da una mano.
                  <br />
                  <span className="text-amarillo-strong">Recibe una mano.</span>
                </h1>
                <p className="mt-4 text-lg text-ink-soft max-w-xl leading-relaxed">
                  ManoAmiga VE conecta pequeñas necesidades con personas cercanas que pueden ayudar.
                </p>
                <p className="mt-3 text-base text-ink-soft max-w-xl">
                  Después de una emergencia, a veces lo que salva el día es un enchufe, agua,
                  una ducha, un traslado corto, una medicina fría o un lugar seguro por unas horas.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button variant="urgent" size="lg" iconLeft={<IconHandHeart size={20} />} asChild>
                  <Link to="/publicar/necesidad">Necesito ayuda</Link>
                </Button>
                <Button variant="help" size="lg" iconLeft={<IconHands size={20} />} asChild>
                  <Link to="/publicar/oferta">Puedo ayudar</Link>
                </Button>
              </div>
            </div>

            {/* Right: Tsunami polaroid card */}
            <div className="hidden lg:flex justify-center items-center">
              {/* Outer float wrapper */}
              <div
                style={{ animation: 'ma-hero-float 5s ease-in-out infinite' }}
                className="relative"
              >
                {/* Soft glow behind the card */}
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 scale-[1.15] rounded-[32px] bg-amarillo/30 blur-2xl"
                />

                {/* Polaroid card */}
                <div
                  className="relative flex flex-col gap-0 rounded-[20px] border-4 border-white bg-white shadow-[0_20px_60px_-10px_rgba(17,74,123,0.25),0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden"
                  style={{ transform: 'rotate(2.5deg)', maxWidth: 300 }}
                >
                  {/* Photo */}
                  <div className="relative overflow-hidden rounded-t-[14px]">
                    <img
                      src="/tsunami.avif"
                      alt="Tsunami, un héroe de la comunidad"
                      className="w-full object-cover"
                      style={{
                        height: 280,
                        filter: 'saturate(1.1) contrast(1.04)',
                      }}
                    />
                    {/* Subtle vignette */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)',
                      }}
                    />
                  </div>

                  {/* Polaroid caption */}
                  <div className="flex flex-col items-center gap-1.5 px-5 pt-4 pb-5 bg-white">
                    <p
                      className="text-center text-sm font-bold text-azul-strong leading-snug"
                      style={{ fontFamily: "'Caveat', 'Patrick Hand', cursive" }}
                    >
                      Tú también puedes ser un héroe como Tsunami 🌊
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amarillo/20 px-3 py-0.5 text-[11px] font-bold text-amarillo-strong uppercase tracking-wider">
                      ⭐ Héroe Nacional
                    </span>
                  </div>
                </div>

                {/* Decorative sticker: floating badge */}
                <div
                  className="absolute -top-4 -right-6 z-10 flex items-center justify-center rounded-full border-2 border-white bg-coral text-white shadow-lg"
                  style={{
                    width: 56,
                    height: 56,
                    animation: 'ma-hero-spin 12s linear infinite',
                    fontSize: 22,
                  }}
                  aria-hidden
                >
                  🫂
                </div>

                {/* Decorative sticker: heart */}
                <div
                  className="absolute -bottom-4 -left-5 z-10 flex items-center justify-center rounded-full border-2 border-white bg-verde text-white shadow-lg"
                  style={{ width: 44, height: 44, animation: 'ma-hero-float 3.5s ease-in-out infinite reverse', fontSize: 18 }}
                  aria-hidden
                >
                  💚
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Keyframe styles */}
        <style>{`
          @keyframes ma-hero-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(0.8deg); }
            66% { transform: translateY(-5px) rotate(-0.5deg); }
          }
          @keyframes ma-hero-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>


      {/* ── Contadores ───────────────────────────────────────────── */}
      <section
        className="bg-surface border-b border-line py-8"
        aria-label="Estadísticas actuales"
      >
        <Container size="wide">
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            <Counter
              value={loadingCounts ? undefined : counts?.activeNeeds}
              label="Necesidades activas"
              tone="coral"
            />
            <Counter
              value={loadingCounts ? undefined : counts?.availableOffers}
              label="Ayudas disponibles"
              tone="verde"
            />
            <Counter
              value={loadingCounts ? undefined : counts?.fulfilled}
              label="Ayudas atendidas"
              tone="amarillo"
            />
          </div>
        </Container>
      </section>

      {/* ── Feed "Ahora mismo" ───────────────────────────────────── */}
      <section className="py-10 sm:py-12" aria-labelledby="recientes-title">
        <Container size="wide">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amarillo-strong mb-1">
                En tiempo real
              </p>
              <h2 id="recientes-title" className="text-2xl font-extrabold">
                Ahora mismo
              </h2>
            </div>
            <Button variant="ghost" size="sm" iconRight={<IconArrowRight size={16} />} asChild>
              <Link to="/necesidades">Ver todo</Link>
            </Button>
          </div>

          {loadingRecent ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : preview.length === 0 ? (
            <EmptyState
              icon={<IconSpark size={26} />}
              title="Todavía no hay publicaciones"
              description="Sé el primero en publicar una necesidad o una oferta de ayuda."
              action={
                <Button variant="primary" asChild>
                  <Link to="/publicar/necesidad">Publicar ahora</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Categorías ───────────────────────────────────────────── */}
      <section className="bg-cream-deep/60 border-y border-line py-10 sm:py-12" aria-labelledby="cats-title">
        <Container size="wide">
          <p className="text-xs font-bold uppercase tracking-widest text-amarillo-strong mb-1">
            Categorías
          </p>
          <h2 id="cats-title" className="text-2xl font-extrabold mb-6">
            ¿Qué necesitas?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/necesidades?cat=${cat.id}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-4 text-center
                           transition-[border-color,box-shadow] hover:border-azul hover:shadow-soft focus-visible:outline
                           focus-visible:outline-3 focus-visible:outline-azul"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-azul-soft text-azul
                                 group-hover:bg-azul group-hover:text-cream transition-colors">
                  <CategoryIcon category={cat.id} size={24} />
                </span>
                <span className="text-sm font-semibold text-ink">{cat.label}</span>
                <span className="text-xs text-ink-soft">{cat.short}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Qué puedes pedir / ofrecer ──────────────────────────── */}
      <section className="py-10 sm:py-14" aria-labelledby="ejemplos-title">
        <Container size="wide">
          <p className="text-xs font-bold uppercase tracking-widest text-amarillo-strong mb-1">
            Ejemplos reales
          </p>
          <h2 id="ejemplos-title" className="text-2xl font-extrabold mb-8">
            Una mano para dar, una mano para recibir
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Qué puedes pedir */}
            <div className="rounded-2xl border border-coral-soft bg-coral-soft/30 p-6">
              <h3 className="flex items-center gap-2 font-bold text-coral-strong text-lg mb-4">
                <IconHandHeart size={22} />
                Qué puedes pedir
              </h3>
              <ul className="flex flex-col gap-3">
                {NEED_EXAMPLES.map((ex) => (
                  <li key={ex.text} className="flex items-start gap-3 text-sm">
                    <CategoryPill category={ex.cat} variant="solid" size="sm" />
                    <span className="text-ink">{ex.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button variant="urgent" size="sm" iconLeft={<IconHandHeart size={16} />} asChild>
                  <Link to="/publicar/necesidad">Publicar una necesidad</Link>
                </Button>
              </div>
            </div>

            {/* Qué puedes ofrecer */}
            <div className="rounded-2xl border border-verde-soft bg-verde-soft/30 p-6">
              <h3 className="flex items-center gap-2 font-bold text-verde-strong text-lg mb-4">
                <IconHands size={22} />
                Qué puedes ofrecer
              </h3>
              <ul className="flex flex-col gap-3">
                {OFFER_EXAMPLES.map((ex) => (
                  <li key={ex.text} className="flex items-start gap-3 text-sm">
                    <CategoryPill category={ex.cat} variant="solid" size="sm" />
                    <span className="text-ink">{ex.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button variant="help" size="sm" iconLeft={<IconHands size={16} />} asChild>
                  <Link to="/publicar/oferta">Publicar una oferta</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Cómo funciona ───────────────────────────────────────── */}
      <section
        className="bg-azul py-12 sm:py-16"
        aria-labelledby="how-title"
      >
        <Container size="wide">
          <p className="text-xs font-bold uppercase tracking-widest text-amarillo mb-1">
            Simple y rápido
          </p>
          <h2 id="how-title" className="text-2xl font-extrabold text-cream mb-8">
            Cómo funciona
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_STEPS.map((s) => (
              <div key={s.num} className="flex flex-col gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-amarillo text-azul-strong font-extrabold text-lg">
                  {s.num}
                </span>
                <h3 className="font-bold text-cream">{s.title}</h3>
                <p className="text-sm text-cream/75">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mapa ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 border-t border-line" aria-labelledby="map-home-title">
        <Container size="wide">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amarillo-strong mb-1">
                Cerca de ti
              </p>
              <h2 id="map-home-title" className="text-2xl font-extrabold flex items-center gap-2">
                <IconMapFold size={24} className="text-azul" />
                Dónde están las publicaciones
              </h2>
            </div>
            <Button variant="ghost" size="sm" iconRight={<IconArrowRight size={16} />} asChild>
              <Link to="/mapa">Abrir mapa</Link>
            </Button>
          </div>
          <Suspense
            fallback={
              <div className="rounded-2xl overflow-hidden border border-line">
                <Skeleton className="h-[420px] w-full" />
              </div>
            }
          >
            <MapPreview />
          </Suspense>
        </Container>
      </section>

      {/* ── Seguridad ───────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 border-t border-line" aria-labelledby="safety-title">
        <Container size="narrow">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-verde-soft text-verde-strong">
                <IconShield size={22} />
              </span>
              <h2 id="safety-title" className="text-2xl font-extrabold">
                Tu seguridad, primero
              </h2>
            </div>
            <ul className="flex flex-col gap-3">
              {SAFETY_POINTS.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm">
                  <IconPin size={16} className="mt-0.5 shrink-0 text-verde" />
                  <span className="text-ink">{pt}</span>
                </li>
              ))}
            </ul>
            <div>
              <Button variant="soft" size="sm" iconRight={<IconArrowRight size={16} />} asChild>
                <Link to="/seguridad">Leer más sobre privacidad y seguridad</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
