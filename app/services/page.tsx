import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServicesSection } from "@/components/services-section"
import { AddonsSection } from "@/components/addons-section"
import { RecurringPlansSection } from "@/components/recurring-plans-section"
import QuoteEstimator from "@/components/quote-estimator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | Horizon Operations",
  description:
    "Explore our residential cleaning services in Nashville - Standard Cleaning, Deep Cleaning, and Move-In/Move-Out services with flexible add-ons and recurring plans.",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                OUR SERVICES
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Professional Cleaning Services in Nashville
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                From routine maintenance to deep cleaning and move-in/move-out services,
                we offer flexible options designed around your needs.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#quote-estimator"
                  className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Get Instant Quote
                </a>
                <a
                  href="/contact"
                  className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <ServicesSection />
        <AddonsSection />
        <RecurringPlansSection />
        <QuoteEstimator />

        {/* CTA */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Ready to book your cleaning?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Get started with a quote or reach out to discuss your specific needs.
              We respond within 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/book"
                className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Book a Cleaning
              </a>
              <a
                href="/contact"
                className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
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
