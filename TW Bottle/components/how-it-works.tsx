import { Droplets, Hand, Gauge } from 'lucide-react'

const STEPS = [
  {
    icon: Droplets,
    title: 'Fill it up',
    description: 'Pour in your favorite drink — hot or cold. Double-wall insulation locks in the temperature.',
  },
  {
    icon: Hand,
    title: 'Tap the cap',
    description: 'A single tap wakes the built-in LED display on the smart cap.',
  },
  {
    icon: Gauge,
    title: 'Know exactly',
    description: 'Read your drink&apos;s precise temperature instantly, every single time.',
  },
]

export function HowItWorks() {
  return (
    <section className="w-full bg-[#eef6ff]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1a1a1a] text-balance sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-[#5b6472] text-pretty">Three simple steps to smarter hydration.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-sm"
              >
                <span className="absolute right-5 top-5 text-5xl font-extrabold text-[#eef6ff]">{i + 1}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6ff] text-[#4a90d9]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-[#1a1a1a]">{step.title}</h3>
                <p
                  className="mt-2 leading-relaxed text-[#5b6472] text-pretty"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
