"use client";

import { useState } from "react";

const ADD_ON_OPTIONS = [
  "Inside Refrigerator",
  "Inside Oven",
  "Interior Windows",
  "Baseboards",
  "Inside Cabinets / Drawers",
  "Laundry Folding",
  "Dishes",
  "Pet Hair Treatment",
  "Garage Sweep / Reset",
  "Same-Day / Urgent Request",
];

type QuoteResponse = {
  recommendedService: string;
  estimatedRange: string;
  summary: string;
  selectedAddOns: string[];
  nextStep: string;
};

export default function QuoteEstimator() {
  const [form, setForm] = useState({
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: "",
    cleaningType: "standard",
    condition: "moderate",
    serviceFrequency: "one-time",
    zipCode: "",
  });

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [result, setResult] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleAddOn(addOn: string) {
    setSelectedAddOns((prev) =>
      prev.includes(addOn)
        ? prev.filter((a) => a !== addOn)
        : [...prev, addOn]
    );
  }

  function formatNumberWithCommas(value: string): string {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, "");
    // Add commas for thousands
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function handleSquareFeetChange(value: string) {
    const formatted = formatNumberWithCommas(value);
    setForm((prev) => ({
      ...prev,
      squareFeet: formatted,
    }));
  }

  function getNumericSquareFeet(): number | undefined {
    const numericValue = form.squareFeet.replace(/,/g, "");
    return numericValue ? Number(numericValue) : undefined;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        squareFeet: getNumericSquareFeet(),
        cleaningType: form.cleaningType as
          | "standard"
          | "deep"
          | "move-in-move-out",
        condition: form.condition as "light" | "moderate" | "heavy",
        serviceFrequency: form.serviceFrequency as "one-time" | "weekly" | "biweekly" | "monthly",
        zipCode: form.zipCode || undefined,
        addOns: selectedAddOns,
      };

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get estimate.");
      }

      setResult(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white py-20" id="quote-estimator">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            AI Quote Estimator
          </div>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Get a fast cleaning estimate
          </h2>
          <p className="mt-4 text-slate-600">
            Enter a few details and get an estimated range for residential cleaning in Nashville.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.bathrooms}
                  onChange={(e) => updateField("bathrooms", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Square Feet (optional)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.squareFeet}
                  onChange={(e) => handleSquareFeetChange(e.target.value)}
                  placeholder="e.g. 2,500"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cleaning Type
                </label>
                <select
                  value={form.cleaningType}
                  onChange={(e) => updateField("cleaningType", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="standard">Standard Cleaning</option>
                  <option value="deep">Deep Cleaning</option>
                  <option value="move-in-move-out">Move-In / Move-Out</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Service Frequency
                </label>
                <select
                  value={form.serviceFrequency}
                  onChange={(e) => updateField("serviceFrequency", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="one-time">One-Time Cleaning</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly (Recommended)</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ZIP Code (optional)
                </label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => updateField("zipCode", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Add-Ons (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ADD_ON_OPTIONS.map((addOn) => (
                    <label
                      key={addOn}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs transition hover:border-teal-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addOn)}
                        onChange={() => toggleAddOn(addOn)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-slate-700">{addOn}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Estimating..." : "Get Estimate"}
              </button>
            </div>
          </form>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            {!result && !error && (
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Your estimate will appear here
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This tool provides an estimate range only. Final pricing can vary based on the home&apos;s condition, layout, and service needs.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Recommended Service
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    {result.recommendedService}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Estimated Range
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-teal-600">
                    {result.estimatedRange}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Summary
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {result.summary}
                  </p>
                </div>

                {result.selectedAddOns && result.selectedAddOns.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Selected Add-Ons
                    </div>
                    <ul className="mt-1 space-y-1">
                      {result.selectedAddOns.map((addOn) => (
                        <li key={addOn} className="text-sm text-slate-700">
                          • {addOn}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-slate-500">
                    Next Step
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {result.nextStep}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Book a Cleaning
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
