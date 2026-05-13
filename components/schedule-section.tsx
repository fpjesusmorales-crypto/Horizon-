"use client"

import { useEffect } from "react"

export function ScheduleSection() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section id="schedule" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
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
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/fpjesus-morales/30min"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>
      </div>
    </section>
  )
}
