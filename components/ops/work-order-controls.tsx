"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Check, Loader2, Play, CheckCircle, X, UserPlus } from "lucide-react"

type EmployeeOption = {
  id: string
  first_name: string
  last_name: string
}

type Props = {
  workOrderId: string
  currentStatus: string
  currentEmployeeId: string | null
  employees: EmployeeOption[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export function WorkOrderControls({ workOrderId, currentStatus, currentEmployeeId, employees }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [status, setStatus] = useState(currentStatus)
  const [employeeId, setEmployeeId] = useState<string>(currentEmployeeId ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyUpdate = async (updates: Record<string, unknown>) => {
    setSaving(true)
    setError(null)
    const { error: updateError } = await supabase.from("work_orders").update(updates).eq("id", workOrderId)
    setSaving(false)
    if (updateError) {
      console.log("[v0] work order update failed:", updateError.message)
      setError(updateError.message)
      return false
    }
    router.refresh()
    return true
  }

  const handleAssign = async (newEmployeeId: string) => {
    setEmployeeId(newEmployeeId)
    const updates: Record<string, unknown> = { assigned_employee_id: newEmployeeId || null }
    // Auto-advance a pending order to "assigned" when an employee is chosen
    if (newEmployeeId && status === "pending") {
      updates.status = "assigned"
      setStatus("assigned")
    }
    // If the employee is removed, fall back to pending
    if (!newEmployeeId && status === "assigned") {
      updates.status = "pending"
      setStatus("pending")
    }
    await applyUpdate(updates)
  }

  const handleStatusChange = async (newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus }
    if (newStatus === "in_progress" && !currentEmployeeId && !employeeId) {
      setError("Assign an employee before starting this job.")
      return
    }
    setStatus(newStatus)
    await applyUpdate(updates)
  }

  // Status transition buttons available from the current state
  const statusActions: { label: string; value: string; icon: typeof Play; tone: string }[] = []
  if (status === "pending" || status === "assigned") {
    statusActions.push({ label: "Start Job", value: "in_progress", icon: Play, tone: "bg-purple-600 hover:bg-purple-700" })
  }
  if (status === "in_progress") {
    statusActions.push({ label: "Mark Completed", value: "completed", icon: CheckCircle, tone: "bg-green-600 hover:bg-green-700" })
  }
  if (status !== "completed" && status !== "cancelled") {
    statusActions.push({ label: "Cancel Job", value: "cancelled", icon: X, tone: "bg-red-600 hover:bg-red-700" })
  }
  if (status === "cancelled") {
    statusActions.push({ label: "Reopen", value: employeeId ? "assigned" : "pending", icon: Play, tone: "bg-teal-600 hover:bg-teal-700" })
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Manage Work Order</h2>

      {/* Current status */}
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium uppercase text-slate-500">Status</p>
        <p className="font-medium text-slate-900">{STATUS_LABELS[status] ?? status}</p>
      </div>

      {/* Assign employee */}
      <div className="mb-4">
        <label htmlFor="assign-employee" className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
          <UserPlus className="h-4 w-4" />
          Assign Employee
        </label>
        <select
          id="assign-employee"
          value={employeeId}
          disabled={saving}
          onChange={(e) => handleAssign(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
        >
          <option value="">Unassigned</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Status actions */}
      <div className="space-y-2">
        {statusActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.value + action.label}
              onClick={() => handleStatusChange(action.value)}
              disabled={saving}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${action.tone}`}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
              {action.label}
            </button>
          )
        })}
      </div>

      {status === "completed" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          This job is complete.
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
