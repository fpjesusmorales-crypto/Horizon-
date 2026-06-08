"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Calendar, Users, ClipboardList, LogOut } from "lucide-react"

interface Employee {
  id: string
  first_name: string
  last_name: string
}

interface Checklist {
  id: string
  name: string
  service_type: string
}

export default function NewWorkOrderPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    city: "",
    zip: "",
    service_type: "Standard Clean",
    scheduled_date: "",
    scheduled_time: "",
    estimated_duration: 120,
    assigned_employee_id: "",
    checklist_template_id: "",
    notes: "",
    price: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const [{ data: empData }, { data: checkData }] = await Promise.all([
        supabase.from("employees").select("id, first_name, last_name").eq("status", "active"),
        supabase.from("cleaning_checklists").select("id, name, service_type"),
      ])
      
      if (empData) setEmployees(empData)
      if (checkData) setChecklists(checkData)
    }
    loadData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("work_orders").insert({
      ...formData,
      assigned_employee_id: formData.assigned_employee_id || null,
      checklist_template_id: formData.checklist_template_id || null,
      price: formData.price ? parseFloat(formData.price) : null,
      status: formData.assigned_employee_id ? "assigned" : "pending",
    })

    if (error) {
      alert("Error creating work order: " + error.message)
      setLoading(false)
      return
    }

    router.push("/ops/admin/work-orders")
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
          <Link href="/ops/admin/work-orders" className="mb-1 flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-2 text-teal-700">
            <ClipboardList className="h-5 w-5" />
            Work Orders
          </Link>
          <Link href="/ops/admin/employees" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
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
          <Link href="/ops/admin/work-orders" className="rounded-lg p-2 hover:bg-slate-200">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">New Work Order</h1>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Service Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Service Type *</label>
                <select
                  required
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Standard Clean">Standard Clean</option>
                  <option value="Deep Clean">Deep Clean</option>
                  <option value="Move In/Out">Move In/Out</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Checklist Template</label>
                <select
                  value={formData.checklist_template_id}
                  onChange={(e) => setFormData({ ...formData, checklist_template_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Auto-select based on service</option>
                  {checklists.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Scheduled Date *</label>
                <input
                  type="date"
                  required
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Scheduled Time</label>
                <input
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Assignment</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Assign to Employee</label>
              <select
                value={formData.assigned_employee_id}
                onChange={(e) => setFormData({ ...formData, assigned_employee_id: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
              >
                <option value="">Leave Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes for Employee</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                placeholder="Special instructions, gate codes, pet info, etc."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              href="/ops/admin/work-orders"
              className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Work Order"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
