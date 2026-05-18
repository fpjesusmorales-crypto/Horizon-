"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import { FaqSection } from "@/components/faq-section"
import { useLanguage } from "@/lib/i18n"

export default function ContactPage() {
  const { locale } = useLanguage()

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                {locale === "es" ? "CONTÁCTENOS" : "CONTACT US"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {locale === "es"
                  ? "Hablemos de sus necesidades de limpieza"
                  : "Let's talk about your cleaning needs"
                }
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                {locale === "es"
                  ? "¿Tiene preguntas o está listo para reservar? Comuníquese y le responderemos dentro de 24 horas. Estamos aquí para ayudar."
                  : "Have questions or ready to book? Reach out and we'll get back to you within 24 hours. We're here to help."
                }
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
