import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout'

// Rutas cargadas de forma diferida (cada una en su propio chunk).
const Home = lazy(() => import('@/routes/Home'))
const Necesidades = lazy(() => import('@/routes/Necesidades'))
const Ofertas = lazy(() => import('@/routes/Ofertas'))
const PublicarNecesidad = lazy(() => import('@/routes/PublicarNecesidad'))
const PublicarOferta = lazy(() => import('@/routes/PublicarOferta'))
const ItemDetalle = lazy(() => import('@/routes/ItemDetalle'))
const Mapa = lazy(() => import('@/routes/Mapa'))
const ComoFunciona = lazy(() => import('@/routes/ComoFunciona'))
const Seguridad = lazy(() => import('@/routes/Seguridad'))
const Historial = lazy(() => import('@/routes/Historial'))
const Lite = lazy(() => import('@/routes/Lite'))
const Admin = lazy(() => import('@/routes/Admin'))
const NotFound = lazy(() => import('@/routes/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'necesidades', element: <Necesidades /> },
      { path: 'ofertas', element: <Ofertas /> },
      { path: 'publicar/necesidad', element: <PublicarNecesidad /> },
      { path: 'publicar/oferta', element: <PublicarOferta /> },
      { path: 'item/:id', element: <ItemDetalle /> },
      { path: 'mapa', element: <Mapa /> },
      { path: 'historial', element: <Historial /> },
      { path: 'como-funciona', element: <ComoFunciona /> },
      { path: 'seguridad', element: <Seguridad /> },
      { path: 'lite', element: <Lite /> },
      { path: 'admin', element: <Admin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
