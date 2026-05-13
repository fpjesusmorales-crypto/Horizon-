export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">Services</div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">Residential cleaning designed around trust and consistency.</h2>
          <p className="mt-4 text-slate-600">
            We start with residential cleaning and focus on doing the basics exceptionally well: clear
            communication, dependable service, and visible results.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="text-lg font-semibold">Standard Cleaning</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A recurring service designed to keep your home clean, comfortable, and maintained on a
              consistent schedule.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Kitchen surface wipe-down</li>
              <li>Bathroom cleaning and disinfecting</li>
              <li>Dusting and straightening</li>
              <li>Vacuuming and mopping</li>
              <li>Trash removal</li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-lg">
            <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              Most Requested
            </div>
            <div className="mt-4 text-lg font-semibold">Deep Cleaning</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Best for first-time appointments or homes that need more attention before moving into a
              maintenance routine.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Everything in Standard Cleaning</li>
              <li>Baseboards and door frames</li>
              <li>Cabinet fronts and detailed wipe-downs</li>
              <li>Heavy buildup attention areas</li>
              <li>Deeper reset of key living spaces</li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="text-lg font-semibold">Move-In / Move-Out</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Detailed cleaning for empty homes to support a cleaner, smoother transition between move-in
              and move-out.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Inside cabinets and drawers</li>
              <li>Appliance exterior cleaning</li>
              <li>Bathroom and kitchen reset</li>
              <li>Floor-to-finish cleaning</li>
              <li>Final walkthrough quality check</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
