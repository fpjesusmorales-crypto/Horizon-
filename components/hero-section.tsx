export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
            RESIDENTIAL CLEANING • SAFETY • RELIABILITY • NASHVILLE, TN
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-balance md:text-6xl">
            Reliable Residential Cleaning in Nashville
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
            Horizon Operations provides dependable residential cleaning focused on
            consistency, professionalism, and peace of mind. Clear communication,
            reliable scheduling, and service you can trust.
          </p>
          <div className="mt-4 text-sm font-medium text-teal-300">
            Email: <a href="mailto:Jesusmorales@horizonoperations.cleaning" className="underline underline-offset-2 hover:text-teal-200 transition">Jesusmorales@horizonoperations.cleaning</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5"
            >
              Book a Cleaning
            </a>
            <a
              href="#services"
              className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View Services
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">Reliable</div>
              <div className="mt-1 text-sm text-slate-300">Clear scheduling and dependable service.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">Safe</div>
              <div className="mt-1 text-sm text-slate-300">Respectful, careful, and detail-driven in every home.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">Consistent</div>
              <div className="mt-1 text-sm text-slate-300">A structured process designed for repeat quality.</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Horizon Operations</div>
                <div className="text-2xl font-semibold">Residential Cleaning</div>
              </div>
              <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                Now Booking
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <div className="font-medium text-slate-900">Standard Cleaning</div>
                  <div>Ideal for recurring upkeep and maintaining a clean, comfortable home.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500" />
                <div>
                  <div className="font-medium text-slate-900">Deep Cleaning</div>
                  <div>Built for first visits, neglected spaces, and a full reset of the home.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-900" />
                <div>
                  <div className="font-medium text-slate-900">Move-In / Move-Out</div>
                  <div>Detailed empty-home cleaning for smooth transitions and clean handoffs.</div>
                </div>
              </div>
            </div>
            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Book a Cleaning
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
