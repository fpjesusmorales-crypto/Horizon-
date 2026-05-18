import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Cleaning | Horizon Operations",
  description:
    "Schedule your residential cleaning service in Nashville. Choose your service, pick a date and time, and book online.",
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-16 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                BOOK ONLINE
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Schedule Your Cleaning
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Select your service, pick your preferred date and time, and we&apos;ll 
                confirm your appointment within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <BookingForm />
          </div>
        </section>

        {/* Info */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-lg font-semibold text-slate-900">Quick Response</div>
                <p className="mt-2 text-sm text-slate-600">
                  We review all booking requests and confirm within 24 hours.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-lg font-semibold text-slate-900">Flexible Scheduling</div>
                <p className="mt-2 text-sm text-slate-600">
                  Choose from multiple time slots and provide an alternate date if needed.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-lg font-semibold text-slate-900">Confirmation Email</div>
                <p className="mt-2 text-sm text-slate-600">
                  You&apos;ll receive a confirmation email with your appointment details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Have Questions */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Have Questions?</h2>
            <p className="mt-3 text-slate-600">
              Not sure which service is right for you? Need a custom quote? We&apos;re happy to help.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/services#quote-estimator"
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Get Instant Quote
              </a>
              <a
                href="/contact"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
