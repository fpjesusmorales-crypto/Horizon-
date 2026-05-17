export function RecurringPlansSection() {
  const plans = [
    {
      name: "Weekly Cleaning",
      description: "Best for busy households that need consistent upkeep.",
      benefits: [
        "Highest consistency",
        "Best for families, pets, and high-traffic homes",
        "Priority scheduling",
      ],
    },
    {
      name: "Biweekly Cleaning",
      description: "Our most popular recurring option.",
      benefits: [
        "Balanced upkeep and affordability",
        "Ideal for most homes",
        "Helps prevent buildup between visits",
      ],
      popular: true,
    },
    {
      name: "Monthly Cleaning",
      description: "Best for lighter maintenance.",
      benefits: [
        "Good for lower-traffic homes",
        "Helps reset key areas",
        "Flexible scheduling",
      ],
    },
  ];

  return (
    <section id="recurring-plans" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">
            Recurring Cleaning Plans
          </div>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Keep your home consistently clean with scheduled service.
          </h2>
          <p className="mt-4 text-slate-400">
            Our recurring cleaning plans are designed for clients who want dependable service on a predictable schedule. Choose weekly, biweekly, or monthly cleaning based on your home&apos;s needs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[1.75rem] border p-6 ${
                plan.popular
                  ? "border-teal-500 bg-slate-800"
                  : "border-slate-700 bg-slate-800/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-slate-900">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-slate-300">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-6 inline-flex w-full justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  plan.popular
                    ? "bg-teal-500 text-slate-900"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
              >
                Book a Cleaning
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Final pricing depends on home size, condition, service type, and selected add-ons.
        </p>
      </div>
    </section>
  );
}
