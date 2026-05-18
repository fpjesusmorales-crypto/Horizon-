"use client"

import { useState, type FormEvent } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, BarChart3, Briefcase, Building2, Handshake, Users, Workflow } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function PartnershipsGrowthPage() {
  const { t } = useLanguage()
  const p = t.partnerships

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to send")

      setStatus("success")
      setFormData({ name: "", company: "", email: "", phone: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  const growthCards = [
    {
      title: p.cards.residential.title,
      description: p.cards.residential.description,
      icon: Building2,
    },
    {
      title: p.cards.subscription.title,
      description: p.cards.subscription.description,
      icon: BarChart3,
    },
    {
      title: p.cards.automation.title,
      description: p.cards.automation.description,
      icon: Workflow,
    },
    {
      title: p.cards.expansion.title,
      description: p.cards.expansion.description,
      icon: Briefcase,
    },
    {
      title: p.cards.workforce.title,
      description: p.cards.workforce.description,
      icon: Users,
    },
    {
      title: p.cards.commercial.title,
      description: p.cards.commercial.description,
      icon: Handshake,
    },
  ]

  const operationalPoints = [
    p.operational.systems,
    p.operational.technology,
    p.operational.data,
    p.operational.revenue,
    p.operational.brand,
    p.operational.retention,
    p.operational.planning,
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950" />
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                {p.badge}
              </p>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                {p.heroTitle}
              </h1>
              <p className="mb-8 text-lg leading-8 text-slate-300 md:text-xl">
                {p.heroDescription}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center rounded-2xl bg-teal-500 px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-teal-400"
              >
                {p.contactCta} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-3xl font-bold">{p.aboutTitle}</h2>
            <p className="max-w-4xl text-lg leading-8 text-slate-700">
              {p.aboutDescription}
            </p>
          </div>
        </section>

        {/* Growth Strategy Section */}
        <section className="bg-slate-100 px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-3xl font-bold">{p.growthTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {growthCards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.title} className="rounded-2xl bg-white p-6 shadow-sm">
                    <Icon className="mb-4 h-8 w-8 text-cyan-700" />
                    <h3 className="mb-3 text-xl font-semibold">{card.title}</h3>
                    <p className="text-slate-600">{card.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Operational Focus Section */}
        <section className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-3xl font-bold">{p.operationalTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {operationalPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-slate-200 p-5 text-slate-700">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Opportunities Section */}
        <section className="bg-slate-950 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-3xl font-bold">{p.opportunitiesTitle}</h2>
            <p className="max-w-4xl text-lg leading-8 text-slate-300">
              {p.opportunitiesDescription}
            </p>
            <p className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-400">
              {p.disclaimer}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold">{p.connectTitle}</h2>
            <p className="mb-8 text-slate-600">
              {p.connectDescription}
            </p>

            {status === "success" ? (
              <div className="rounded-2xl bg-teal-50 p-8 text-center">
                <h3 className="mb-2 text-xl font-semibold text-teal-800">{p.form.successTitle}</h3>
                <p className="text-teal-700">{p.form.successDescription}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                  className="rounded-xl border border-slate-300 p-4 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder={p.form.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  className="rounded-xl border border-slate-300 p-4 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder={p.form.company}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-300 p-4 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder={p.form.email}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  className="rounded-xl border border-slate-300 p-4 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder={p.form.phone}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <textarea
                  className="min-h-36 rounded-xl border border-slate-300 p-4 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder={p.form.message}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-2xl bg-slate-900 px-6 py-4 font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
                >
                  {status === "loading" ? p.form.submitting : p.form.submit}
                </button>
                {status === "error" && (
                  <p className="text-center text-sm text-red-600">{p.form.error}</p>
                )}
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
