export function ExpectSection() {
  return (
    <section id="expect" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            What to Expect
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            A cleaner process from the first conversation.
          </h2>
          <p className="mt-4 text-slate-600">
            We focus on making residential cleaning feel straightforward,
            dependable, and professional from start to finish.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-lg font-semibold text-foreground">Clear Communication</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Clear scheduling, straightforward updates, and responsive follow-through.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-lg font-semibold text-foreground">Consistent Standards</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A structured cleaning process designed to deliver dependable results each visit.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-lg font-semibold text-foreground">Respect for Your Home</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Professional service with care for your space, routines, and privacy.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="text-lg font-semibold text-foreground">Reliable Scheduling</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A service experience built around showing up, following through, and doing the job well.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
