"use client"

import { useState, type FormEvent } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    homeSize: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-slate-100 p-8 md:p-10">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">Book a Cleaning</div>
            <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">Tell us about your home and the type of cleaning you need.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Use the form below to request a cleaning. You can also call, email, or send a message directly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="tel"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="email"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500 sm:col-span-2"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Home size or number of bedrooms"
                value={formData.homeSize}
                onChange={(e) => setFormData({ ...formData, homeSize: e.target.value })}
              />
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none transition focus:border-teal-500"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="">Select service</option>
                <option value="standard">Standard Cleaning</option>
                <option value="deep">Deep Cleaning</option>
                <option value="move">Move-In / Move-Out Cleaning</option>
              </select>
              <textarea
                className="min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 sm:col-span-2"
                placeholder="Tell us about your cleaning needs"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 sm:col-span-2"
              >
                Book a Cleaning
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Phone</div>
              <a href="tel:+16154287282" className="mt-2 block text-lg font-semibold transition hover:text-teal-600">(615) 428-7282</a>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Email</div>
              <div className="mt-2 text-lg font-semibold">horizonoperationsllc@gmail.com</div>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Message</div>
              <div className="mt-2 text-base leading-7 text-slate-600">
                Serving Nashville, Tennessee. We respond as quickly as possible and aim to make booking straightforward and stress-free.
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-xl">
              <div className="text-sm font-medium text-slate-400">What to expect</div>
              <div className="mt-2 text-2xl font-semibold">A cleaner process from the first conversation.</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Tell us what you need, and we&apos;ll help you identify the right service and next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
