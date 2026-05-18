"use client"

import { useState, type FormEvent } from "react"

const SERVICE_OPTIONS = [
  { value: "standard", label: "Standard Cleaning", price: "$119+" },
  { value: "deep", label: "Deep Cleaning", price: "$199+" },
  { value: "move", label: "Move-In / Move-Out", price: "$279+" },
]

const TIME_SLOTS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Service
    service: "",
    frequency: "one-time",
    // Step 2: Date & Time
    preferredDate: "",
    preferredTime: "",
    alternateDate: "",
    // Step 3: Home Details
    squareFeet: "",
    bedrooms: "",
    bathrooms: "",
    specialInstructions: "",
    // Step 4: Contact
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function nextStep() {
    if (step < 4) setStep(step + 1)
  }

  function prevStep() {
    if (step > 1) setStep(step - 1)
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!formData.service
      case 2:
        return !!formData.preferredDate && !!formData.preferredTime
      case 3:
        return true // Optional fields
      case 4:
        return !!formData.name && !!formData.email && !!formData.phone
      default:
        return false
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canProceed()) return

    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit booking request")
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  // Get today's date for min date attribute
  const today = new Date().toISOString().split("T")[0]

  if (status === "success") {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
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
            className="text-teal-600"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-slate-900">Booking Request Received!</h3>
        <p className="mt-3 text-slate-600">
          Thank you for your booking request. We&apos;ll review your preferred times and 
          confirm your appointment within 24 hours.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          A confirmation email has been sent to {formData.email}
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
        >
          Return Home
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                  s < step
                    ? "bg-teal-500 text-white"
                    : s === step
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {s < step ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 4 && (
                <div
                  className={`mx-2 h-0.5 w-8 sm:w-16 md:w-20 ${
                    s < step ? "bg-teal-500" : "bg-slate-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>Service</span>
          <span>Date & Time</span>
          <span>Home</span>
          <span>Contact</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Service */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Select Your Service</h3>
              <p className="mt-1 text-sm text-slate-600">
                Choose the type of cleaning service you need
              </p>
            </div>

            <div className="space-y-3">
              {SERVICE_OPTIONS.map((service) => (
                <label
                  key={service.value}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    formData.service === service.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service"
                      value={service.value}
                      checked={formData.service === service.value}
                      onChange={(e) => updateField("service", e.target.value)}
                      className="h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="font-medium text-slate-900">{service.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{service.price}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cleaning Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => updateField("frequency", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              >
                <option value="one-time">One-Time Cleaning</option>
                <option value="weekly">Weekly (20% off)</option>
                <option value="biweekly">Biweekly (15% off)</option>
                <option value="monthly">Monthly (10% off)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Choose Your Preferred Date & Time</h3>
              <p className="mt-1 text-sm text-slate-600">
                Select when you&apos;d like us to come. We&apos;ll confirm availability within 24 hours.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  min={today}
                  value={formData.preferredDate}
                  onChange={(e) => updateField("preferredDate", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Alternate Date (optional)
                </label>
                <input
                  type="date"
                  min={today}
                  value={formData.alternateDate}
                  onChange={(e) => updateField("alternateDate", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Preferred Time Window *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIME_SLOTS.map((slot) => (
                  <label
                    key={slot}
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm transition ${
                      formData.preferredTime === slot
                        ? "border-teal-500 bg-teal-50 font-medium text-teal-700"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredTime"
                      value={slot}
                      checked={formData.preferredTime === slot}
                      onChange={(e) => updateField("preferredTime", e.target.value)}
                      className="sr-only"
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Home Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Tell Us About Your Home</h3>
              <p className="mt-1 text-sm text-slate-600">
                This helps us prepare and provide accurate pricing
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Square Feet
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.squareFeet}
                  onChange={(e) => updateField("squareFeet", e.target.value)}
                  placeholder="e.g. 1,800"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bedrooms
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bathrooms
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => updateField("bathrooms", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="1.5">1.5</option>
                  <option value="2">2</option>
                  <option value="2.5">2.5</option>
                  <option value="3">3</option>
                  <option value="3+">3+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Special Instructions or Requests
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => updateField("specialInstructions", e.target.value)}
                placeholder="Any specific areas to focus on, access instructions, pets, allergies, etc."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Your Contact Information</h3>
              <p className="mt-1 text-sm text-slate-600">
                We&apos;ll use this to confirm your booking
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(615) 555-0123"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Service Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="123 Main St, Nashville, TN"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {status === "error" && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceed() || status === "loading"}
              className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Submitting..." : "Submit Booking Request"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
