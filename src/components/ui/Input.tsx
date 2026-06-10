import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition-colors',
      'focus:border-primary focus:ring-1 focus:ring-primary',
      className,
    )}
    {...props}
  />
)
