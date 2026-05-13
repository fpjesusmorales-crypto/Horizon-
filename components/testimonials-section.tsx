import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    location: "Green Hills",
    quote: "Finally, a cleaning service that actually shows up when they say they will. The communication is refreshing - I always know exactly when to expect them and what's been done.",
    rating: 5,
  },
  {
    name: "James & Emily R.",
    location: "East Nashville",
    quote: "We've tried several cleaning services over the years. Horizon is the first one where we feel completely comfortable leaving them in our home. Professional, thorough, and trustworthy.",
    rating: 5,
  },
  {
    name: "Michael T.",
    location: "The Gulch",
    quote: "The consistency is what sold me. Every visit, same high standard. No surprises, no missed spots. It's exactly what I needed.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-gradient-to-b from-white to-amber-50/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Client Stories
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
            Trusted by Nashville homeowners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Real feedback from clients who value reliability and peace of mind.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-[1.75rem] bg-white p-8 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-slate-700 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 text-sm font-semibold text-white">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
