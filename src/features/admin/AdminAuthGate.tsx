import { useState, type ReactNode } from 'react'
import { Container } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import { BrandMark, IconShield } from '@/components/icons'

const ADMIN_KEY = 'manoamiga.admin.v1'

function getStored(): boolean {
  try {
    return localStorage.getItem(ADMIN_KEY) === 'ok'
  } catch {
    return false
  }
}

/**
 * Gate de admin local (stub MVP).
 * En producción: reemplazar por Supabase Auth magic link.
 * La contraseña de acceso es cualquier cadena no vacía (demo).
 * Cuando Supabase esté activo, reemplazar por supabase.auth.signInWithOtp().
 */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(getStored)
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function handleAccess(e: React.FormEvent) {
    e.preventDefault()
    // Stub: acepta cualquier contraseña (MVP). En prod: Supabase magic link.
    if (pass.trim().length >= 4) {
      localStorage.setItem(ADMIN_KEY, 'ok')
      setAuthed(true)
    } else {
      setError('Contraseña incorrecta o muy corta (mín. 4 caracteres).')
    }
  }

  if (authed) return <>{children}</>

  return (
    <Container size="narrow" className="py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <BrandMark size={40} />
          <span className="flex size-8 items-center justify-center rounded-full bg-azul-soft text-azul-strong">
            <IconShield size={20} />
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-azul-strong">Acceso de administración</h1>
          <p className="text-sm text-ink-soft mt-2">
            Esta sección está protegida. Ingresa la contraseña de administrador.
          </p>
          <p className="text-xs text-ink-faint mt-1">
            (MVP: cualquier contraseña ≥4 caracteres — integrar Supabase Auth en producción)
          </p>
        </div>
        <form onSubmit={handleAccess} className="w-full max-w-sm flex flex-col gap-4">
          <Input
            label="Contraseña"
            type="password"
            placeholder="Contraseña de admin"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            error={error}
            required
          />
          <Button type="submit" block>Acceder</Button>
        </form>
      </div>
    </Container>
  )
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_KEY)
}
