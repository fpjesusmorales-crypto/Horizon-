const ADD_ONS = [
  { name: "Inside Refrigerator", price: "$35–$60" },
  { name: "Inside Oven", price: "$35–$75" },
  { name: "Interior Windows", price: "$5–$10 per window" },
  { name: "Baseboards", price: "$40–$100" },
  { name: "Inside Cabinets / Drawers", price: "$40–$100" },
  { name: "Laundry Folding", price: "$25–$50" },
  { name: "Dishes", price: "$20–$45" },
  { name: "Pet Hair Treatment", price: "$25–$75" },
  { name: "Garage Sweep / Reset", price: "$40–$100" },
  { name: "Same-Day / Urgent Request", price: "+20%" },
]

export function AddonsSection() {
  return (
    <section id="add-ons" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            Add-On Services
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
            Customize your cleaning based on what your home needs.
          </h2>
          <p className="mt-4 text-slate-600">
            Add-ons help target specific areas that need extra attention beyond a standard residential cleaning.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ADD_ONS.map((addon) => (
            <div
              key={addon.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="text-sm font-semibold text-slate-900">{addon.name}</div>
              <div className="mt-2 text-xs text-teal-600">{addon.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
