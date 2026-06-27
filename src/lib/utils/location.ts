/**
 * Privacidad por diseño: nunca exponemos la ubicación exacta.
 * Aplicamos un desplazamiento aleatorio (~hasta 500m) a las coordenadas
 * antes de guardarlas, de modo que los pins del mapa sean aproximados.
 */
const JITTER_METERS = 500
const EARTH_RADIUS = 6_378_137 // metros

export function jitterCoords(
  lat: number,
  lng: number,
  meters: number = JITTER_METERS,
): { lat: number; lng: number } {
  // Desplazamiento aleatorio uniforme dentro de un círculo de `meters`.
  const r = meters * Math.sqrt(Math.random())
  const theta = Math.random() * 2 * Math.PI
  const dNorth = r * Math.cos(theta)
  const dEast = r * Math.sin(theta)

  const dLat = (dNorth / EARTH_RADIUS) * (180 / Math.PI)
  const dLng =
    (dEast / (EARTH_RADIUS * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI)

  return {
    lat: Number((lat + dLat).toFixed(5)),
    lng: Number((lng + dLng).toFixed(5)),
  }
}
