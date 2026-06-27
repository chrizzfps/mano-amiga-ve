import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Forma rápida: 'line' redondeada, 'block' rectangular, 'circle'. */
  shape?: 'line' | 'block' | 'circle'
}

const shapes = {
  line: 'h-3.5 rounded-full',
  block: 'rounded-lg',
  circle: 'rounded-full aspect-square',
}

export function Skeleton({ shape = 'block', className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('shimmer bg-cream-deep', shapes[shape], className)}
      {...rest}
    />
  )
}
