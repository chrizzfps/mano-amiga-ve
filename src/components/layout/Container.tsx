import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'narrow' | 'default' | 'wide'
}

const sizes = {
  narrow: 'max-w-2xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
}

export function Container({ size = 'default', className, ...rest }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-4 sm:px-6', sizes[size], className)} {...rest} />
}
