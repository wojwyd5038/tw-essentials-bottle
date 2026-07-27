'use client'

import { useMemo, useState, useTransition } from 'react'
import { Minus, Plus, ShieldCheck, Truck, Lock, Star, Loader2 } from 'lucide-react'
import { addToCart } from '@/app/actions'
import type { Product, ProductVariant } from '@/lib/shopify'
import { cn } from '@/lib/utils'

const SWATCH_COLORS: Record<string, string> = {
  Black: '#1a1a1a',
  White: '#f4f4f5',
  Pink: '#f4b7c7',
}

function getColor(variant: ProductVariant) {
  return variant.selectedOptions.find((o) => o.name.toLowerCase() === 'color')?.value ?? variant.title
}

function formatPrice(amount: string, currency: string) {
  const value = Number(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(value)
}

export function ProductSection({ product }: { product: Product }) {
  const [selectedId, setSelectedId] = useState(
    product.variants.find((v) => v.availableForSale)?.id ?? product.variants[0]?.id,
  )
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === selectedId) ?? product.variants[0],
    [product.variants, selectedId],
  )

  const activeImage =
    selectedVariant?.image?.url ?? product.featuredImage?.url ?? product.images[0]?.url ?? '/products/bottle-black.png'

  const price = formatPrice(
    selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount,
    selectedVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode,
  )

  function handleAddToCart() {
    if (!selectedVariant) return
    setError(null)
    startTransition(async () => {
      const result = await addToCart(selectedVariant.id, quantity)
      if (!result.ok) {
        setError(result.error)
        return
      }
      const url = result.checkoutUrl
      if (typeof window !== 'undefined' && window.self !== window.top) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = url
      }
    })
  }

  const soldOut = selectedVariant ? !selectedVariant.availableForSale : true

  return (
    <section id="product" className="w-full scroll-mt-16 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        {/* Image */}
        <div className="flex items-center justify-center rounded-3xl bg-[#eef6ff] p-6 md:p-10">
          <img
            key={activeImage}
            src={activeImage || "/placeholder.svg"}
            alt={`TW Essentials Smart Display Water Bottle in ${getColor(selectedVariant)}`}
            className="h-auto w-full max-w-sm object-contain drop-shadow-xl"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#4a90d9] text-[#4a90d9]" />
              ))}
            </div>
            <span className="text-sm font-medium text-[#5b6472]">4.9 · 2,300+ reviews</span>
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1a1a1a] text-balance sm:text-4xl">
            {product.title}
          </h2>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#1a1a1a]">{price}</span>
            <span className="text-base text-[#5b6472] line-through">$99.00</span>
            <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-xs font-semibold text-[#4a90d9]">
              Save 25%
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-[#5b6472] text-pretty">
            Precision hydration, always on display. Double-wall insulated, 304 stainless steel, and USB rechargeable
            so you always know your drink&apos;s exact temperature.
          </p>

          {/* Color swatches */}
          <div className="mt-6">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Color: <span className="font-normal text-[#5b6472]">{getColor(selectedVariant)}</span>
            </span>
            <div className="mt-3 flex items-center gap-3">
              {product.variants.map((variant) => {
                const color = getColor(variant)
                const active = variant.id === selectedId
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedId(variant.id)}
                    aria-label={`Select ${color}`}
                    aria-pressed={active}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      active ? 'border-[#4a90d9] ring-2 ring-[#4a90d9]/30' : 'border-[#e2e8f0] hover:border-[#4a90d9]/60',
                    )}
                  >
                    <span
                      className="h-7 w-7 rounded-full border border-black/10"
                      style={{ backgroundColor: SWATCH_COLORS[color] ?? '#ccc' }}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-full border border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-l-full text-[#1a1a1a] transition-colors hover:bg-[#eef6ff] disabled:opacity-40"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-base font-semibold text-[#1a1a1a]" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-r-full text-[#1a1a1a] transition-colors hover:bg-[#eef6ff] disabled:opacity-40"
                aria-label="Increase quantity"
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isPending || soldOut}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#4a90d9] px-8 text-base font-semibold text-white shadow-lg shadow-[#4a90d9]/25 transition-all hover:bg-[#3a7cc2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90d9] focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Adding…
                </>
              ) : soldOut ? (
                'Sold Out'
              ) : (
                <>Add to Cart · {price}</>
              )}
            </button>
          </div>

          {error ? (
            <p className="mt-3 text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#e2e8f0] pt-6 sm:grid-cols-3">
            <TrustBadge icon={<Truck className="h-5 w-5" />} label="Free shipping over $50" />
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" />} label="30-day money-back" />
            <TrustBadge icon={<Lock className="h-5 w-5" />} label="Secure checkout" />
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a]">
      <span className="text-[#4a90d9]">{icon}</span>
      {label}
    </div>
  )
}
