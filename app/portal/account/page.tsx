"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  zip: string | null
  home_size: string | null
  special_instructions: string | null
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(data || { id: user.id, email: user.email } as Profile)
      setLoading(false)
    }
    fetchProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setMessage("")

    const formData = new FormData(e.currentTarget)
    const updates = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      zip: formData.get("zip") as string,
      home_size: formData.get("home_size") as string,
      special_instructions: formData.get("special_instructions") as string,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)

    if (error) {
      setMessage("Failed to update profile. Please try again.")
    } else {
      setMessage("Profile updated successfully!")
      setProfile({ ...profile, ...updates })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="h-96 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <Link
            href="/portal"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  defaultValue={profile?.first_name || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  defaultValue={profile?.last_name || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={profile?.phone || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Service Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={profile?.address || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={profile?.city || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="zip" className="mb-1 block text-sm font-medium text-slate-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  defaultValue={profile?.zip || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Home Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="home_size" className="mb-1 block text-sm font-medium text-slate-700">
                  Home Size (sq ft)
                </label>
                <select
                  id="home_size"
                  name="home_size"
                  defaultValue={profile?.home_size || ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">Select size</option>
                  <option value="0-1000">Under 1,000 sq ft</option>
                  <option value="1001-1500">1,001 - 1,500 sq ft</option>
                  <option value="1501-2000">1,501 - 2,000 sq ft</option>
                  <option value="2001-2500">2,001 - 2,500 sq ft</option>
                  <option value="2501-3000">2,501 - 3,000 sq ft</option>
                  <option value="3001+">3,001+ sq ft</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="special_instructions" className="mb-1 block text-sm font-medium text-slate-700">
                  Special Instructions
                </label>
                <textarea
                  id="special_instructions"
                  name="special_instructions"
                  rows={3}
                  defaultValue={profile?.special_instructions || ""}
                  placeholder="Entry codes, pet information, areas to focus on..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`mb-4 rounded-xl p-3 text-sm ${
              message.includes("success") ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}
