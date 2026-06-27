# ManoAmiga VE

> Da una mano. Recibe una mano.

Plataforma humanitaria que conecta **pequeñas necesidades** (cargar un teléfono, agua,
refrigerar insulina, baño/ducha, traslado corto, refugio, mascotas, niños y adultos
mayores) con **micro-ayudas cercanas**. SPA liviana, mobile-first, accesible y
optimizada para conexiones inestables.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Estilos | Tailwind CSS v4 · tokens propios en `src/styles/tokens.css` |
| Routing | React Router v7 (SPA, rutas lazy) |
| Datos async | TanStack Query v5 |
| Formularios | Zod + React Hook Form |
| Backend | Supabase (Auth, Postgres, RLS) |
| Mapa | Leaflet + OpenStreetMap (lazy, solo en `/mapa`) |
| Package manager | pnpm |

## Desarrollo local

```bash
pnpm install

# Copiar credenciales de entorno
cp .env.example .env.local
# → Editar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

pnpm dev        # servidor de desarrollo (http://localhost:5173)
pnpm build      # typecheck + build de producción
pnpm preview    # previsualizar el build
pnpm lint       # oxlint
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |

Sin estas variables la app corre en **modo mock** sobre `localStorage` con datos de
ejemplo (`src/data/seed/`). El selector de adaptador vive en `src/lib/data/index.ts`
y la UI no cambia al migrar.

## Estructura

```
src/
  app/          router, providers, App
  routes/       páginas (lazy)
  components/
    ui/         librería de componentes propios
    layout/     AppShell, Header, BottomNav, Footer
    icons/      set de iconos SVG propio
  features/     funcionalidades por dominio (feed, items, publish, admin, map)
  lib/          data (repositorio + adaptadores), constants, utils, validation
  data/seed/    datos de ejemplo (modo mock)
  types/        tipos de dominio
  styles/       tokens + estilos base
supabase/
  migrations/   migraciones SQL numeradas
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Home |
| `/necesidades` | Feed de necesidades |
| `/ofertas` | Feed de ofertas |
| `/publicar/necesidad` | Publicar necesidad |
| `/publicar/oferta` | Publicar oferta |
| `/item/:id` | Detalle de publicación |
| `/mapa` | Mapa interactivo |
| `/historial` | Items atendidos |
| `/como-funciona` | Guía de uso |
| `/seguridad` | Privacidad y seguridad |
| `/lite` | Versión mínima |
| `/admin` | Panel administrador |

## Principios de diseño

- **Mobile-first real** — la pantalla de 375 px es la pantalla de referencia
- **Sin login obligatorio** — publicar no requiere cuenta
- **Privacidad en ubicación** — estado/ciudad + zona de texto; nunca dirección exacta en público; coordenadas con jitter ~500 m; contacto solo visible en detalle
- **Carga rápida** — mapa y rutas pesadas con lazy loading
- **Accesibilidad seria** — foco visible, labels semánticos, navegación por teclado
- **Identidad visual propia** — set de iconos SVG sin dependencias de terceros
- **Compartir por WhatsApp** — cada publicación genera un enlace directo

## Base de datos

Migraciones en `supabase/migrations/`. Se aplican con:

```bash
supabase db push
```

La tabla `public.admin_config` almacena la configuración del administrador.
RLS habilitado en todas las tablas públicas.

## Licencia

MIT
