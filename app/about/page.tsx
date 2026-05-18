import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Horizon Operations",
  description:
    "Learn about Horizon Operations - a Nashville-based residential cleaning company focused on reliability, professionalism, and consistent quality.",
}

const values = [
  {
    title: "Reliable & Consistent",
    description: "Dependable scheduling, clear expectations, and a consistent standard every visit.",
  },
  {
    title: "Fully Professional Service",
    description: "Trained cleaners, proper equipment, and attention to detail on every job.",
  },
  {
    title: "Easy Online Booking",
    description: "Simple scheduling process with quick quotes and flexible appointment times.",
  },
  {
    title: "Flexible Recurring Plans",
    description: "Weekly, biweekly, or monthly cleaning schedules with recurring discounts.",
  },
  {
    title: "Satisfaction Focused",
    description: "Your satisfaction is our priority. We stand behind our work.",
  },
  {
    title: "Nashville Local Business",
    description: "Proudly serving the Nashville metro area with local, personalized service.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                ABOUT US
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                A cleaning company built on trust and consistency
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Horizon Operations is a Nashville-based residential cleaning company focused on 
                reliability, professionalism, and consistent quality.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
                  Our Mission
                </div>
                <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
                  Deliver dependable cleaning services with clear communication and attention to detail.
                </h2>
                <p className="mt-5 leading-7 text-slate-700">
                  We specialize in routine home cleaning, deep cleaning, move-in/move-out services, 
                  and recurring maintenance plans designed to simplify everyday life for busy 
                  homeowners and families.
                </p>
                <p className="mt-4 leading-7 text-slate-700">
                  At Horizon Operations, we believe a clean environment creates peace of mind. 
                  Every service is built around professionalism, trust, and operational 
                  consistency — from booking to final walkthrough.
                </p>
                <p className="mt-4 leading-7 text-slate-700">
                  Whether you need a one-time reset or recurring cleaning support, Horizon 
                  Operations is committed to creating a cleaner, more comfortable home experience.
                </p>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] shadow-xl">
                  <Image
                    src="/images/horizon-team-cleaning.png?v=2"
                    alt="Horizon Operations cleaning professionals"
                    width={800}
                    height={533}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100">
                  <div className="text-2xl font-bold text-teal-600">Nashville</div>
                  <div className="text-sm text-slate-600">Local Business</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
                What We Stand For
              </div>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Why Choose Horizon Operations
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                We proudly serve the greater Nashville area and continue building a reputation 
                centered on these core values.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="text-xl font-semibold text-slate-900">{value.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">Our Focus</div>
                <div className="mt-2 text-xl font-semibold">Reliability first</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Dependable scheduling, clear expectations, and a consistent standard every visit.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">Our Process</div>
                <div className="mt-2 text-xl font-semibold">Structured service</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A repeatable cleaning workflow that supports quality control and a better client experience.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">Our Standard</div>
                <div className="mt-2 text-xl font-semibold">Respect for the home</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  We treat every home carefully, communicate professionally, and work with respect for your space.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">Our Direction</div>
                <div className="mt-2 text-xl font-semibold">Built to grow well</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Starting with residential service and building a foundation strong enough to scale over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Ready to experience the difference?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Book your first cleaning today and see why Nashville homeowners trust Horizon Operations.
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
