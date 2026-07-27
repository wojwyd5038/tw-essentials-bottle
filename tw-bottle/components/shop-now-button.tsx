'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ShopNowButton({
  children,
  size = 'md',
  className,
}: {
  children: ReactNode
  size?: 'md' | 'lg'
  className?: string
}) {
  function scrollToProduct() {
    document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={scrollToProduct}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-[#4a90d9] font-semibold text-white shadow-lg shadow-[#4a90d9]/25 transition-all hover:bg-[#3a7cc2] hover:shadow-xl hover:shadow-[#4a90d9]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90d9] focus-visible:ring-offset-2 active:scale-[0.98]',
        size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm',
        className,
      )}
    >
      {children}
    </button>
  )
}
