import type { CategoryId } from '@/types/item'
import { cn } from '@/lib/utils/cn'
import { CATEGORY_MAP } from '@/lib/constants/categories'
import { CategoryIcon } from '@/components/icons'

export interface CategoryPillProps {
  category: CategoryId
  /** 'plain' = etiqueta con icono; 'solid' = chip con fondo azul suave. */
  variant?: 'plain' | 'solid'
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryPill({ category, variant = 'plain', size = 'sm', className }: CategoryPillProps) {
  const meta = CATEGORY_MAP[category]
  const iconSize = size === 'sm' ? 16 : 18
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold',
        size === 'sm' ? 'text-xs' : 'text-sm',
        variant === 'solid'
          ? 'rounded-full bg-azul-soft px-2.5 py-1 text-azul-strong'
          : 'text-ink-soft',
        className,
      )}
    >
      <CategoryIcon category={category} size={iconSize} className="text-azul" />
      {meta.label}
    </span>
  )
}
