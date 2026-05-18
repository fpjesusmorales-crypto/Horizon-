"use client"

import { useState } from "react"

const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We proudly serve the Nashville metropolitan area, including surrounding neighborhoods and communities. If you're unsure whether we cover your location, please reach out and we'll be happy to confirm.",
  },
  {
    question: "How should I prepare for my cleaning?",
    answer:
      "For the best results, we recommend picking up any personal items, toys, or clutter from floors and surfaces before we arrive. This allows our team to focus entirely on cleaning. You don't need to do any pre-cleaning—just make sure we have clear access to the areas you'd like cleaned.",
  },
  {
    question: "Do I need to be home during the cleaning?",
    answer:
      "No, you don't need to be home. Many of our clients provide a key, door code, or smart lock access. If you prefer to be present for the first visit, that's completely fine too. We'll work with whatever arrangement is most comfortable for you.",
  },
  {
    question: "What cleaning products do you use?",
    answer:
      "We use professional-grade, effective cleaning products that are safe for your home. If you have specific preferences, allergies, or would like us to use eco-friendly or fragrance-free products, just let us know and we'll accommodate your needs.",
  },
  {
    question: "How do I book a cleaning?",
    answer:
      "You can book a cleaning by filling out the contact form on this page, using our booking form to select your preferred date and time, or emailing us directly at Jesusmorales@horizonoperations.cleaning. We'll confirm your appointment within 24 hours.",
  },
  {
    question: "What's the difference between Standard, Deep, and Move-In/Move-Out cleaning?",
    answer:
      "Standard Cleaning is perfect for regular maintenance and keeping your home consistently clean. Deep Cleaning is a more thorough service ideal for first-time cleanings or homes that need extra attention. Move-In/Move-Out Cleaning is designed for empty homes during transitions, ensuring every corner is spotless for the next occupant.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Our pricing is based on the type of service, the square footage of your home, cleaning frequency, and any add-ons you select. Use our quote calculator to get an instant estimate, or contact us for a personalized quote based on your specific needs.",
  },
  {
    question: "What if I need to reschedule or cancel?",
    answer:
      "We understand that plans change. We ask for at least 24 hours notice for rescheduling or cancellations. This allows us to adjust our schedule and potentially offer that slot to another client. Contact us as soon as possible if you need to make changes.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            FAQ
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Have questions about our cleaning services? Find answers to common questions below,
            or reach out to us directly.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
                <span
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600">
            Still have questions?{" "}
            <a
              href="mailto:Jesusmorales@horizonoperations.cleaning"
              className="font-medium text-teal-600 hover:text-teal-700 transition"
            >
              Contact us directly
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
