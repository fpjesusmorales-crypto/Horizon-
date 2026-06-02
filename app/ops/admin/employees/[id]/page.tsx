"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Calendar, Users, ClipboardList, LogOut, Trash2 } from "lucide-react"

interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: string
  status: string
  hourly_rate: number | null
  hire_date: string | null
  notes: string | null
  user_id: string | null
}

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "cleaner",
    status: "active",
    hourly_rate: "",
    notes: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/ops/auth/login")
        return
      }

      // Check current user role
      const { data: currentEmp } = await supabase
        .from("employees")
        .select("role")
        .eq("user_id", user.id)
        .single()

      if (!currentEmp || currentEmp.role !== "admin") {
        router.push("/ops/admin")
        return
      }
      setCurrentUserRole(currentEmp.role)

      // Load employee
      const { data: emp, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !emp) {
        router.push("/ops/admin/employees")
        return
      }

      setEmployee(emp)
      setFormData({
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        phone: emp.phone || "",
        role: emp.role,
        status: emp.status,
        hourly_rate: emp.hourly_rate?.toString() || "",
        notes: emp.notes || "",
      })
      setLoading(false)
    }
    loadData()
  }, [id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from("employees")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        status: formData.status,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        notes: formData.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      alert("Error updating employee: " + error.message)
      setSaving(false)
      return
    }

    router.push("/ops/admin/employees")
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      return
    }

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error deleting employee: " + error.message)
      return
    }

    router.push("/ops/admin/employees")
  }

  const formatRole = (role: string) => {
    return role.replace("_", " ")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-slate-900">Edit Employee</h1>
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
                    <option value="team_lead">Team Lead</option>
                    <option value="dispatcher">Dispatcher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.role === "admin" && "Full access to all features"}
                    {formData.role === "dispatcher" && "Can manage work orders and view employees"}
                    {formData.role === "team_lead" && "Can manage work orders for their team"}
                    {formData.role === "cleaner" && "Can view and complete assigned jobs"}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
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

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Employee
              </button>
              <div className="flex gap-3">
                <Link
                  href="/ops/admin/employees"
                  className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {employee?.user_id ? (
            <p className="mt-4 text-center text-sm text-green-600">
              This employee has linked their account and can access the portal.
            </p>
          ) : (
            <p className="mt-4 text-center text-sm text-slate-500">
              This employee has not yet signed up. They can sign up at /ops/auth/login with email: {formData.email}
            </p>
          )}
        </form>
      </main>
    </div>
  )
}
