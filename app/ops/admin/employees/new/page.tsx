"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Calendar, Users, ClipboardList, LogOut } from "lucide-react"

export default function NewEmployeePage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "cleaner",
    hourly_rate: "",
    notes: "",
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      email_confirm: true,
      password: Math.random().toString(36).slice(-12), // Temporary password
      user_metadata: {
        first_name: formData.first_name,
        last_name: formData.last_name,
      },
    })

    // For now, just create the employee record without linking to auth
    // The employee can be linked later when they sign up
    const { error } = await supabase.from("employees").insert({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || null,
      role: formData.role,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      notes: formData.notes || null,
      status: "active",
    })

    if (error) {
      alert("Error creating employee: " + error.message)
      setLoading(false)
      return
    }

    router.push("/ops/admin/employees")
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 h-full w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/ops/admin" className="text-xl font-bold text-slate-900">
            Horizon Ops
          </Link>
        </div>
        <nav className="p-4">
          <p className="mb-2 text-xs font-medium uppercase text-slate-400">Main</p>
          <Link href="/ops/admin" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <Calendar className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/ops/admin/work-orders" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <ClipboardList className="h-5 w-5" />
            Work Orders
          </Link>
          <Link href="/ops/admin/employees" className="mb-1 flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-2 text-teal-700">
            <Users className="h-5 w-5" />
            Employees
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <a
            href="/ops/auth/signout"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/ops/admin/employees" className="rounded-lg p-2 hover:bg-slate-200">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Add Employee</h1>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Role *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="cleaner">Cleaner</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Hourly Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Link
                href="/ops/admin/employees"
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Add Employee"}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            The employee will need to sign up at /ops/auth/login with this email to access the portal.
          </p>
        </form>
      </main>
    </div>
  )
}
