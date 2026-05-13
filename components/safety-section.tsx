export function SafetySection() {
  return (
    <section id="safety" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">Safety &amp; Reliability</div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">The kind of cleaning service homeowners feel comfortable trusting.</h2>
          <p className="mt-4 text-slate-300">
            Safety and reliability are not marketing lines here. They are part of the operating standard.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-lg font-semibold">Clear Communication</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Straightforward scheduling, responsive communication, and clear expectations from the first contact.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-lg font-semibold">Respectful Service</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A professional approach inside the home, with care for property, privacy, and consistency.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-lg font-semibold">Process-Driven Quality</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Structured cleaning methods that reduce missed details and support dependable results over time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
