"use client"

import { useEffect } from "react"
import Script from "next/script"

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
          <div
            className="calendly-inline-widget mx-auto rounded-2xl overflow-hidden bg-white"
            data-url="https://calendly.com/fpjesus-morales/30min"
            style={{ minWidth: "320px", height: "700px", maxWidth: "900px" }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
          />
        </div>
      </div>
    </section>
  )
}
