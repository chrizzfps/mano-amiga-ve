import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils/cn'
import type { Tone } from '@/lib/constants/taxonomy'
import { toneDot } from './Badge'

export interface ToastItem {
  id: string
  message: string
  tone?: Tone
  duration?: number
}

interface ToastContextValue {
  toast: (message: string, opts?: { tone?: Tone; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current[id]
    if (timer) {
      clearTimeout(timer)
      delete timers.current[id]
    }
  }, [])

  const toast = useCallback(
    (message: string, opts?: { tone?: Tone; duration?: number }) => {
      const id = Math.random().toString(36).slice(2, 9)
      const duration = opts?.duration ?? 4000
      setItems((prev) => [...prev, { id, message, tone: opts?.tone ?? 'azul' }])
      timers.current[id] = setTimeout(() => remove(id), duration)
    },
    [remove],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Región accesible: anuncios no intrusivos */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="region"
        aria-label="Notificaciones"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lift',
              'motion-safe:animate-[ma-toast-in_220ms_ease]',
            )}
          >
            <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', toneDot[t.tone ?? 'azul'])} aria-hidden />
            <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="text-ink-faint hover:text-ink"
              aria-label="Cerrar notificación"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
