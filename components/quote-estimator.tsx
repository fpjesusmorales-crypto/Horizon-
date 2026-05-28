"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/lib/i18n"

const SERVICE_RATES = {
  standard: { labelEn: "Standard Clean", labelEs: "Limpieza Estándar", price: 119 },
  deep: { labelEn: "Deep Clean", labelEs: "Limpieza Profunda", price: 199 },
  "move-in-move-out": { labelEn: "Move In / Move Out", labelEs: "Mudanza", price: 279 },
}

const SQ_FT_MULTIPLIERS = [
  { max: 1000, multiplier: 1.0, label: "0–1,000 sq ft" },
  { max: 1500, multiplier: 1.15, label: "1,001–1,500 sq ft" },
  { max: 2000, multiplier: 1.3, label: "1,501–2,000 sq ft" },
  { max: 2500, multiplier: 1.5, label: "2,001–2,500 sq ft" },
  { max: 3000, multiplier: 1.75, label: "2,501–3,000 sq ft" },
]

const FREQUENCY_DISCOUNTS = {
  "one-time": { labelEn: "One-Time", labelEs: "Una Vez", discount: 0 },
  weekly: { labelEn: "Weekly", labelEs: "Semanal", discount: 0.2 },
  biweekly: { labelEn: "Biweekly", labelEs: "Quincenal", discount: 0.15 },
  monthly: { labelEn: "Monthly", labelEs: "Mensual", discount: 0.1 },
}

const ADD_ONS = [
  { id: "oven", labelEn: "Inside Oven", labelEs: "Interior del Horno", price: 45 },
  { id: "fridge", labelEn: "Inside Fridge", labelEs: "Interior del Refrigerador", price: 40 },
  { id: "baseboards", labelEn: "Baseboards", labelEs: "Zócalos", price: 50 },
  { id: "pet-hair", labelEn: "Pet Hair Treatment", labelEs: "Tratamiento de Pelo de Mascota", price: 35 },
  { id: "windows", labelEn: "Interior Windows", labelEs: "Ventanas Interiores", price: 8, perUnit: true, unitLabelEn: "window", unitLabelEs: "ventana" },
  { id: "laundry", labelEn: "Laundry", labelEs: "Lavandería", price: 30 },
  { id: "dishes", labelEn: "Dishes", labelEs: "Platos", price: 25 },
  { id: "organization", labelEn: "Organization", labelEs: "Organización", price: 50 },
]

type ServiceType = keyof typeof SERVICE_RATES
type FrequencyType = keyof typeof FREQUENCY_DISCOUNTS

export default function QuoteEstimator() {
  const { locale, t } = useLanguage()
  const [serviceType, setServiceType] = useState<ServiceType>("standard")
  const [squareFeet, setSquareFeet] = useState("")
  const [frequency, setFrequency] = useState<FrequencyType>("one-time")
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [windowCount, setWindowCount] = useState(0)

  function formatNumberWithCommas(value: string): string {
    const numericValue = value.replace(/\D/g, "")
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  function handleSquareFeetChange(value: string) {
    setSquareFeet(formatNumberWithCommas(value))
  }

  function getNumericSquareFeet(): number {
    return parseInt(squareFeet.replace(/,/g, "")) || 0
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const calculation = useMemo(() => {
    const sqFt = getNumericSquareFeet()
    
    // Check if custom quote is required
    if (sqFt > 3000) {
      return { customQuote: true }
    }

    // Get base price
    const basePrice = SERVICE_RATES[serviceType].price

    // Get square footage multiplier
    let sqFtMultiplier = 1.0
    if (sqFt > 0) {
      const tier = SQ_FT_MULTIPLIERS.find((t) => sqFt <= t.max)
      if (tier) {
        sqFtMultiplier = tier.multiplier
      }
    }

    // Calculate subtotal (base * sq ft multiplier)
    const subtotal = basePrice * sqFtMultiplier

    // Calculate frequency discount
    const discountRate = FREQUENCY_DISCOUNTS[frequency].discount
    const discountAmount = subtotal * discountRate

    // Calculate add-ons total
    let addOnsTotal = 0
    ADD_ONS.forEach((addOn) => {
      if (selectedAddOns[addOn.id]) {
        if (addOn.perUnit) {
          addOnsTotal += addOn.price * windowCount
        } else {
          addOnsTotal += addOn.price
        }
      }
    })

    // Final total
    const finalTotal = subtotal - discountAmount + addOnsTotal

    return {
      customQuote: false,
      basePrice,
      sqFtMultiplier,
      subtotal: Math.round(subtotal * 100) / 100,
      discountRate,
      discountAmount: Math.round(discountAmount * 100) / 100,
      addOnsTotal,
      finalTotal: Math.round(finalTotal * 100) / 100,
    }
  }, [serviceType, squareFeet, frequency, selectedAddOns, windowCount])

  return (
    <section className="bg-white py-20" id="quote-estimator">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            {locale === "es" ? "Calculadora de Cotización Instantánea" : "Instant Quote Calculator"}
          </div>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            {t.quote.title}
          </h2>
          <p className="mt-4 text-slate-600">
            {locale === "es"
              ? "Seleccione su tipo de servicio, tamaño de hogar y cualquier complemento para ver su precio estimado."
              : "Select your service type, home size, and any add-ons to see your estimated price."
            }
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Form */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="grid gap-5">
              {/* Service Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.quote.serviceType}
                </label>
                <div className="grid gap-2">
                  {Object.entries(SERVICE_RATES).map(([key, { labelEn, labelEs, price }]) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition ${
                        serviceType === key
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="serviceType"
                          value={key}
                          checked={serviceType === key}
                          onChange={(e) => setServiceType(e.target.value as ServiceType)}
                          className="h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm font-medium text-slate-900">
                          {locale === "es" ? labelEs : labelEn}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">${price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.quote.squareFootage}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={squareFeet}
                  onChange={(e) => handleSquareFeetChange(e.target.value)}
                  placeholder="e.g. 1,800"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  {locale === "es"
                    ? "Ingrese los pies cuadrados de su hogar para precios precisos"
                    : "Enter your home's square footage for accurate pricing"
                  }
                </p>
              </div>

              {/* Frequency */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.quote.frequency}
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as FrequencyType)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                >
                  <option value="one-time">
                    {locale === "es" ? "Una Vez (Sin descuento)" : "One-Time (No discount)"}
                  </option>
                  <option value="weekly">
                    {locale === "es" ? "Semanal (20% desc.)" : "Weekly (20% off)"}
                  </option>
                  <option value="biweekly">
                    {locale === "es" ? "Quincenal (15% desc.)" : "Biweekly (15% off)"}
                  </option>
                  <option value="monthly">
                    {locale === "es" ? "Mensual (10% desc.)" : "Monthly (10% off)"}
                  </option>
                </select>
              </div>

              {/* Add-ons */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t.quote.addons} ({locale === "es" ? "opcional" : "optional"})
                </label>
                <div className="grid gap-2">
                  {ADD_ONS.map((addOn) => (
                    <div key={addOn.id}>
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition ${
                          selectedAddOns[addOn.id]
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedAddOns[addOn.id] || false}
                            onChange={() => toggleAddOn(addOn.id)}
                            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">
                            {locale === "es" ? addOn.labelEs : addOn.labelEn}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          ${addOn.price}
                          {addOn.perUnit && `/${locale === "es" ? addOn.unitLabelEs : addOn.unitLabelEn}`}
                        </span>
                      </label>
                      {/* Window count input */}
                      {addOn.perUnit && selectedAddOns[addOn.id] && (
                        <div className="mt-2 ml-7 flex items-center gap-2">
                          <label className="text-xs text-slate-600">
                            {t.quote.windowQuantity}:
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={windowCount || ""}
                            onChange={(e) => setWindowCount(parseInt(e.target.value) || 0)}
                            className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-teal-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            {calculation.customQuote ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="rounded-full bg-slate-100 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-600"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {t.quote.summary.customQuote}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t.quote.summary.customQuoteDesc}
                </p>
                <a
                  href="mailto:bookings@horizonoperations.cleaning"
                  className="mt-6 inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {t.quote.summary.contactUs}
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t.quote.summary.title}
                  </h3>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {locale === "es" ? SERVICE_RATES[serviceType].labelEs : SERVICE_RATES[serviceType].labelEn}
                    </span>
                    <span className="font-medium text-slate-900">
                      ${SERVICE_RATES[serviceType].price.toFixed(2)}
                    </span>
                  </div>

                  {calculation.sqFtMultiplier !== 1 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        {locale === "es" 
                          ? `Multiplicador de tamaño (${calculation.sqFtMultiplier}x)`
                          : `Size multiplier (${calculation.sqFtMultiplier}x)`
                        }
                      </span>
                      <span className="font-medium text-slate-900">
                        ${calculation.subtotal.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {calculation.discountAmount > 0 && (
                    <div className="flex justify-between text-teal-600">
                      <span>
                        {locale === "es"
                          ? `Descuento ${FREQUENCY_DISCOUNTS[frequency].labelEs} (${Math.round(calculation.discountRate * 100)}% desc.)`
                          : `${FREQUENCY_DISCOUNTS[frequency].labelEn} discount (${Math.round(calculation.discountRate * 100)}% off)`
                        }
                      </span>
                      <span className="font-medium">
                        -${calculation.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {calculation.addOnsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t.quote.addons}</span>
                      <span className="font-medium text-slate-900">
                        +${calculation.addOnsTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-semibold text-slate-900">
                      {t.quote.summary.total}
                    </span>
                    <span className="text-3xl font-bold text-teal-600">
                      ${calculation.finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.quote.summary.disclaimer}
                </p>

                {/* CTA */}
                <a
                  href="#contact"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                >
                  {t.quote.summary.bookNow}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
