import { Flame } from 'lucide-react'

export function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-50 w-full bg-[#1a1a1a] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5 text-center">
        <Flame className="h-4 w-4 shrink-0 text-[#4a90d9]" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-wide sm:text-sm text-balance">
          Limited offer: 2 for 15% less{' '}
          <span className="mx-1 text-[#4a90d9]">·</span> 3 for 20% less
        </p>
      </div>
    </div>
  )
}
