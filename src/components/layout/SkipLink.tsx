/** Enlace para saltar al contenido principal (accesibilidad / teclado). */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-azul focus:px-4 focus:py-2 focus:font-semibold focus:text-cream focus:shadow-lift"
    >
      Saltar al contenido
    </a>
  )
}
