"use client"

export function ScheduleSection() {
  return (
    <section id="schedule" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">
          Schedule
        </div>

        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          Schedule a Cleaning Consultation
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Book a quick call so we can understand your home, recommend the right
          service, and confirm the next step.
        </p>

        <div className="mt-8">
          <a
            href="YOUR_CALENDLY_LINK_HERE"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          >
            Schedule Consultation
          </a>
        </div>
      </div>
    </section>
  )
}
