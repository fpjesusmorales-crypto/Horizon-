import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import { FaqSection } from "@/components/faq-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Horizon Operations",
  description:
    "Get in touch with Horizon Operations for residential cleaning services in Nashville. Request a quote, ask questions, or book your cleaning today.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                CONTACT US
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Let&apos;s talk about your cleaning needs
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Have questions or ready to book? Reach out and we&apos;ll get back to you 
                within 24 hours. We&apos;re here to help.
              </p>
              <div className="mt-8">
                <a
                  href="mailto:Jesusmorales@horizonoperations.cleaning"
                  className="text-teal-300 hover:text-teal-200 transition underline underline-offset-2"
                >
                  Jesusmorales@horizonoperations.cleaning
                </a>
              </div>
            </div>
          </div>
        </section>

        <ContactSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
