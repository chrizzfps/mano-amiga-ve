import { useEffect, useState, useRef } from 'react'
import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { Input, Select } from '@/components/ui'
import { getStates, getPlacesByState, buildApproximateLocationLabel } from '@/lib/venezuela-locations'

interface LocationFieldsProps {
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  errors: FieldErrors<any>
}

export function LocationFields({ register, setValue, watch, errors }: LocationFieldsProps) {
  const stateVal = watch('state_name') || ''
  const cityVal = watch('city_name') || ''
  const zoneVal = watch('zone_text') || ''

  const [cityFocused, setCityFocused] = useState(false)
  const [zoneFocused, setZoneFocused] = useState(false)

  const cityContainerRef = useRef<HTMLDivElement>(null)
  const zoneContainerRef = useRef<HTMLDivElement>(null)

  // Obtener sugerencias para el estado seleccionado
  const placesSeed = getPlacesByState(stateVal)

  // Ciudades únicas sugeridas
  const uniqueCities = Array.from(new Set(placesSeed.map((p) => p.city_name)))
    .filter(Boolean)
    .sort()

  // Sectores sugeridos según el estado
  const zoneSuggestions = placesSeed
    .map((p) => p.place_name)
    .filter(Boolean)
    .sort()

  // Filtrar sugerencias en base a la escritura del usuario
  const filteredCities = cityVal.trim()
    ? uniqueCities.filter((c) => c.toLowerCase().includes(cityVal.toLowerCase()))
    : uniqueCities

  const filteredZones = zoneVal.trim()
    ? zoneSuggestions.filter((z) => z.toLowerCase().includes(zoneVal.toLowerCase()))
    : zoneSuggestions

  // Cerrar los dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityContainerRef.current && !cityContainerRef.current.contains(e.target as Node)) {
        setCityFocused(false)
      }
      if (zoneContainerRef.current && !zoneContainerRef.current.contains(e.target as Node)) {
        setZoneFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Actualizar la etiqueta pública cuando cambian el estado o la ciudad
  useEffect(() => {
    const label = buildApproximateLocationLabel({
      state_name: stateVal,
      city_name: cityVal,
    })
    setValue('approximate_location_label', label, { shouldValidate: true })
  }, [stateVal, cityVal, setValue])

  const stateOptions = getStates().map((s) => ({ value: s, label: s }))

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Estado (Obligatorio) */}
      <Select
        label="Estado"
        placeholder="Selecciona tu estado"
        options={stateOptions}
        required
        error={errors.state_name?.message as string}
        {...register('state_name', {
          onChange: () => {
            // Resetear campos dependientes al cambiar de estado
            setValue('city_name', '')
            setValue('municipality_name', '')
            setValue('parish_name', '')
            setValue('zone_text', '')
            setValue('approximate_location_label', '')
          },
        })}
      />

      {/* Invisible input para registrar la etiqueta autogenerada en react-hook-form */}
      <input type="hidden" {...register('approximate_location_label')} />
      <input type="hidden" {...register('municipality_name')} />
      <input type="hidden" {...register('parish_name')} />

      {/* 2. Ciudad / Municipio (Híbrido) */}
      <div ref={cityContainerRef} className="relative">
        <Input
          label="Ciudad / Municipio"
          placeholder={stateVal ? 'Ej. Catia La Mar, Valencia, Chacao...' : 'Primero elige el estado'}
          disabled={!stateVal}
          error={errors.city_name?.message as string}
          hint="Puedes elegir una de la lista o escribir la tuya si no aparece."
          autoComplete="off"
          {...register('city_name', {
            onChange: (e) => {
              // El municipio se asume igual a la ciudad para simplificar en el seed
              setValue('municipality_name', e.target.value)
            },
          })}
          onFocus={() => stateVal && setCityFocused(true)}
        />
        {cityFocused && filteredCities.length > 0 && (
          <div className="absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface py-1 shadow-lift animate-[ma-toast-in_120ms_ease]">
            {filteredCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setValue('city_name', city, { shouldValidate: true })
                  setValue('municipality_name', city, { shouldValidate: true })
                  setCityFocused(false)
                }}
                className="flex w-full items-center px-4 py-2.5 text-left text-sm text-ink hover:bg-cream-deep cursor-pointer font-medium select-none transition-colors active:bg-azul-soft active:text-azul-strong"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Parroquia / Sector / Zona aproximada (Híbrido - Obligatorio) */}
      <div ref={zoneContainerRef} className="relative">
        <Input
          label="Parroquia, Sector o Zona aproximada"
          placeholder="Ej: Caribe, Catia, Candelaria, San Jacinto..."
          disabled={!stateVal}
          required
          error={errors.zone_text?.message as string}
          hint="Usa el nombre del barrio o sector. Nunca el número de casa."
          autoComplete="off"
          {...register('zone_text')}
          onFocus={() => stateVal && setZoneFocused(true)}
        />
        {zoneFocused && filteredZones.length > 0 && (
          <div className="absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface py-1 shadow-lift animate-[ma-toast-in_120ms_ease]">
            {filteredZones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => {
                  setValue('zone_text', zone, { shouldValidate: true })
                  
                  // Auto-completar la ciudad asociada a este lugar si no ha escrito una
                  const matchedPlace = placesSeed.find((p) => p.place_name === zone)
                  if (matchedPlace && !cityVal) {
                    setValue('city_name', matchedPlace.city_name, { shouldValidate: true })
                    setValue('municipality_name', matchedPlace.city_name, { shouldValidate: true })
                  }
                  
                  setZoneFocused(false)
                }}
                className="flex w-full items-center px-4 py-2.5 text-left text-sm text-ink hover:bg-cream-deep cursor-pointer font-medium select-none transition-colors active:bg-azul-soft active:text-azul-strong"
              >
                {zone}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Referencia opcional (No sensible) */}
      <Input
        label="Punto de referencia (Opcional)"
        placeholder="Ej: frente a la plaza, a 2 cuadras de la iglesia..."
        error={errors.reference_text?.message as string}
        maxLength={120}
        {...register('reference_text')}
      />

      {/* Advertencia de Privacidad */}
      <div className="rounded-xl bg-azul-soft/60 p-4 border border-azul-soft text-[13px] text-azul-strong flex flex-col gap-1">
        <p className="font-bold flex items-center gap-1.5">
          🔒 Protección de Privacidad:
        </p>
        <p>
          No coloques tu dirección exacta. Usa una zona aproximada o un punto de referencia que sea seguro para ti.
        </p>
      </div>
    </div>
  )
}
