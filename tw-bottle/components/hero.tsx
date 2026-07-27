import { ShopNowButton } from '@/components/shop-now-button'

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden">
      {/* Background image */}
      <img
        src="/products/hero-bottle.png"
        alt="TW Essentials Smart Display Water Bottle resting on a bright kitchen counter"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Readability overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 md:to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4a90d9]">
            Precision Hydration
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-[#1a1a1a] text-balance sm:text-5xl lg:text-6xl">
            Your Drink. Your Temperature. Always On Display.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#5b6472] text-pretty">
            The smart bottle with a built-in LED cap that shows your exact drink temperature at a glance.
          </p>
          <div className="mt-8">
            <ShopNowButton size="lg">Shop Now</ShopNowButton>
          </div>
          <p className="mt-4 text-sm font-medium text-[#5b6472]">
            Free shipping over $50 · 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  )
}
