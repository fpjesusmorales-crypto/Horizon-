import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="bg-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">About</div>
            <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">A service company built around professionalism, safety, and follow-through.</h2>
            <p className="mt-5 leading-7 text-slate-700">
              Horizon Operations was created to provide residential cleaning with a stronger operational
              foundation. That means better communication, more dependable execution, and a cleaner,
              safer experience for every client.
            </p>
            <p className="mt-4 leading-7 text-slate-700">
              We believe homeowners should feel confident about who is entering their space, how the work
              will be handled, and what level of quality to expect. Our approach is simple: show up,
              communicate clearly, and deliver consistent results.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/images/horizon-team-cleaning.png"
                alt="Horizon Ops cleaning professionals in branded uniforms cleaning a modern home"
                width={800}
                height={533}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100">
              <div className="text-2xl font-bold text-teal-600">100%</div>
              <div className="text-sm text-slate-600">Satisfaction Focus</div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">Our Focus</div>
            <div className="mt-2 text-xl font-semibold">Reliability first</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Dependable scheduling, clear expectations, and a consistent standard every visit.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">Our Process</div>
            <div className="mt-2 text-xl font-semibold">Structured service</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A repeatable cleaning workflow that supports quality control and a better client experience.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">Our Standard</div>
            <div className="mt-2 text-xl font-semibold">Respect for the home</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We treat every home carefully, communicate professionally, and work with respect for your space.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">Our Direction</div>
            <div className="mt-2 text-xl font-semibold">Built to grow well</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Starting with residential service and building a foundation strong enough to scale over time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
